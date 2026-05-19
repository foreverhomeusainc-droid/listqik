import type Stripe from "stripe";

/** Parse slugs stored on checkout session metadata at creation time. */
export function parseUpgradeSlugsFromMetadata(
  metadata: Record<string, string | undefined> | Stripe.Metadata | null | undefined,
): string[] {
  const csv =
    metadata && typeof metadata === "object" && "upgradeSlugsCsv" in metadata
      ? String(metadata.upgradeSlugsCsv ?? "").trim()
      : "";
  if (!csv) return [];
  return [...new Set(csv.split(",").map((s) => s.trim()).filter(Boolean))];
}

/** Map Stripe line-item price IDs back to upgrade slugs via env JSON. */
export function parseUpgradeSlugsFromLineItems(
  lineItems: Stripe.LineItem[],
  priceIdToSlug: Map<string, string>,
): string[] {
  const slugs = lineItems
    .map((row) => row.price?.id || "")
    .map((priceId) => priceIdToSlug.get(priceId) || "")
    .filter(Boolean);
  return [...new Set(slugs)];
}

/**
 * Prefer metadata slugs (set at checkout) and fall back to line-item price mapping.
 */
export function resolveUpgradeSlugs(
  metadata: Record<string, string | undefined> | Stripe.Metadata | null | undefined,
  lineItems: Stripe.LineItem[],
  priceIdToSlug: Map<string, string>,
): string[] {
  const fromMeta = parseUpgradeSlugsFromMetadata(metadata);
  if (fromMeta.length > 0) return fromMeta;
  return parseUpgradeSlugsFromLineItems(lineItems, priceIdToSlug);
}
