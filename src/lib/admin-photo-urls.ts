export const ADMIN_MAX_ADDITIONAL_PHOTOS = 24;

export function parseAdminPhotoUrls(raw: unknown, max = ADMIN_MAX_ADDITIONAL_PHOTOS): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const url = item.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= max) break;
  }
  return out;
}
