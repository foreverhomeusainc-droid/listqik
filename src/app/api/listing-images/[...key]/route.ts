import { GetObjectCommand, NoSuchKey } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { createR2Client, getR2Config } from "@/lib/r2";

export const runtime = "nodejs";

/**
 * GET /api/listing-images/<key segments...>
 *
 * Streams a stored listing image from R2 through our origin. We use this so
 * `<img src>` works even when the bucket has no public r2.dev / custom domain
 * configured (i.e. when R2_PUBLIC_BASE_URL is unset).
 *
 * Keys are constrained to the `listings/` prefix — anything else is rejected
 * so the route can't be abused as a general R2 reader.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key: keySegments } = await ctx.params;
  if (!Array.isArray(keySegments) || keySegments.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing object key." }, { status: 400 });
  }

  const key = keySegments
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");

  if (!key.startsWith("listings/") || key.includes("..")) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
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

  try {
    const client = createR2Client();
    const obj = await client.send(
      new GetObjectCommand({ Bucket: cfg.bucketName, Key: key }),
    );

    const bytes = await obj.Body?.transformToByteArray();
    if (!bytes) {
      return NextResponse.json({ ok: false, error: "Empty object." }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("content-type", obj.ContentType ?? "application/octet-stream");
    headers.set("content-length", String(bytes.byteLength));
    // Short cache: same-listing dashboards revisit images frequently; clients
    // should still see updates within a minute when sellers replace photos.
    headers.set("cache-control", "private, max-age=60");
    if (obj.ETag) headers.set("etag", obj.ETag);

    return new Response(bytes, { status: 200, headers });
  } catch (err) {
    if (err instanceof NoSuchKey) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Could not load image.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
