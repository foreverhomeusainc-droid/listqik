import { S3Client } from "@aws-sdk/client-s3";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function getR2Config() {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");
  const bucketName = process.env.R2_BUCKET_NAME?.trim() || process.env.R2_BUCKET?.trim();
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME (or legacy R2_BUCKET) is not configured.");
  }
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint,
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.trim() || null,
  };
}

export function createR2Client() {
  const cfg = getR2Config();

  return new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    // R2 supports both styles, but path-style is the documented default that
    // avoids virtual-host DNS pitfalls (and works for signed URLs).
    forcePathStyle: true,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
}

/**
 * Build the URL we hand back to the browser for displaying a stored object.
 *
 * When R2_PUBLIC_BASE_URL is configured (custom domain or r2.dev), we use it
 * directly. Otherwise we fall back to our same-origin proxy so `<img src>`
 * works without exposing the R2 S3 endpoint (which requires auth).
 */
export function buildPublicImageUrl(key: string): string {
  const cfg = getR2Config();
  if (cfg.publicBaseUrl) {
    return `${cfg.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  }
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/api/listing-images/${encodedKey}`;
}
