import { PutObjectCommand } from "@aws-sdk/client-s3";
import { buildPublicImageUrl, createR2Client, getR2Config } from "@/lib/r2";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const MAX_BYTES = 15 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
}

function inferExt(contentType: string, fileName: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/heic" || contentType === "image/heif") return "heic";
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  if (lower.endsWith(".gif")) return "gif";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "heic";
  return "bin";
}

export function resolveImageContentType(file: File): string {
  const fromType = (file.type || "").toLowerCase();
  if (fromType) return fromType;
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".heif")) return "image/heif";
  return "";
}

export async function uploadAdminImageToR2(
  file: File,
  keyPrefix: string,
): Promise<{ ok: true; key: string; publicUrl: string } | { ok: false; error: string; status: number }> {
  const contentType = resolveImageContentType(file);
  if (!ALLOWED_TYPES.has(contentType)) {
    return {
      ok: false,
      error: "Unsupported image type. Use JPEG, PNG, WEBP, GIF, or HEIC.",
      status: 415,
    };
  }
  if (file.size <= 0) {
    return { ok: false, error: "Empty file.", status: 400 };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `Image exceeds the ${Math.round(MAX_BYTES / (1024 * 1024))}MB limit.`,
      status: 413,
    };
  }

  let cfg;
  try {
    cfg = getR2Config();
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "R2 is not configured.",
      status: 500,
    };
  }

  const ext = inferExt(contentType, file.name);
  const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
  const key = `${keyPrefix}/${Date.now()}-${safeName}.${ext}`;
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
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not upload to storage.",
      status: 502,
    };
  }

  return { ok: true, key, publicUrl: buildPublicImageUrl(key) };
}
