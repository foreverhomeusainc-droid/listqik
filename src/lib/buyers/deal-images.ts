const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

export function buyerDealImageUrls(deal: {
  heroImageUrl?: string | null;
  additionalPhotoUrls?: string[] | null;
}): string[] {
  const hero = deal.heroImageUrl?.trim() ?? "";
  const extra = (deal.additionalPhotoUrls ?? [])
    .map((u) => (typeof u === "string" ? u.trim() : ""))
    .filter(Boolean)
    .filter((u) => u !== hero);
  if (hero) return [hero, ...extra];
  if (extra.length) return extra;
  return [FALLBACK_IMAGE];
}

export { FALLBACK_IMAGE as BUYER_DEAL_FALLBACK_IMAGE };
