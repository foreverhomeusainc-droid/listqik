import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { buildPublicImageUrl, createR2Client, getR2Config } from "@/lib/r2";
import { Listing } from "@/models/Listing";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB; matches typical MLS photo guidance.

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
}

function inferExt(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "bin";
}

/**
 * POST /api/dashboard/listings/[id]/hero-image/upload
 *
 * Receives the image file as `multipart/form-data` (field name: `file`) and
 * uploads it to R2 server-side. This avoids CORS / signed-URL pitfalls that
 * affect direct browser-to-R2 uploads.
 *
 * Returns `{ ok, key, publicUrl }`. The publicUrl is safe to drop into an
 * `<img>` tag — it uses our proxy when no R2 public domain is configured.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid listing id." }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected multipart/form-data with a `file` field." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Missing `file` field in upload." },
      { status: 400 },
    );
  }

  const contentType = (file.type || "").toLowerCase();
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { ok: false, error: "Unsupported image type. Use JPEG, PNG, WEBP, or GIF." },
      { status: 415 },
    );
  }

  if (file.size <= 0) {
    return NextResponse.json({ ok: false, error: "Empty file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `Image exceeds the ${Math.round(MAX_BYTES / (1024 * 1024))}MB limit.` },
      { status: 413 },
    );
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const listing = await Listing.findOne({ _id: id, userId }).lean();
  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }

  let cfg;
  try {
    cfg = getR2Config();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "R2 is not configured." },
      { status: 500 },
    );
  }

  const ext = inferExt(contentType);
  const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
  const key = `listings/${id}/hero/${Date.now()}-${safeName}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    const client = createR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: cfg.bucketName,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        ContentLength: bytes.byteLength,
      }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not upload to storage.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    key,
    publicUrl: buildPublicImageUrl(key),
  });
}
