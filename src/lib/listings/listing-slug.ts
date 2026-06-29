/** Build a URL-safe slug from address parts; caller ensures uniqueness. */
export function slugifyListingParts(input: {
  city: string;
  zip: string;
  street: string;
  id?: string;
}): string {
  const city = input.city.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const zip = input.zip.trim().replace(/\D/g, "").slice(0, 5);
  const street = input.street
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const base = [city, zip, street].filter(Boolean).join("-").replace(/-+/g, "-");
  if (base.length >= 8) return base;
  return base ? `${base}-${(input.id ?? "").slice(-6)}` : `listing-${(input.id ?? "").slice(-8)}`;
}
