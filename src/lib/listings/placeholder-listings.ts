/** Demo cards formerly shipped in src/data/listings.ts — never show publicly. */
export const PLACEHOLDER_LISTING_SLUGS = [
  "austin-78704-south-lamar-glass-loft",
  "dallas-75205-highland-park-cobalt",
  "houston-77005-west-u-greenline",
  "san-antonio-78209-alamo-heights-panel",
] as const;

export const PLACEHOLDER_LISTING_TITLES = [
  "South Lamar Glass Loft",
  "Highland Park Cobalt",
  "West U Greenline",
  "Alamo Heights Panel",
] as const;

export function isPlaceholderListing(doc: {
  slug?: string | null;
  title?: string | null;
}): boolean {
  const slug = doc.slug?.trim();
  if (slug && (PLACEHOLDER_LISTING_SLUGS as readonly string[]).includes(slug)) return true;
  const title = doc.title?.trim();
  if (title && (PLACEHOLDER_LISTING_TITLES as readonly string[]).includes(title)) return true;
  return false;
}
