import type { FullServiceTierId } from "@/i18n/full-service-copy";

/** Stripe catalog rows (one-time intake fee; listing commission % is at closing per agreement). */
export type FullServiceStripeCatalogRow = {
  slug: FullServiceTierId;
  name: string;
  /** One-time onboarding / agreement fee charged at checkout (USD). */
  intakeFeeUsd: number;
  listingCommissionPercent: number;
};

export const FULL_SERVICE_STRIPE_CATALOG: FullServiceStripeCatalogRow[] = [
  {
    slug: "market-expert",
    name: "ListQik Full Service — Market Expert (1% listing commission at closing)",
    intakeFeeUsd: 199,
    listingCommissionPercent: 1,
  },
  {
    slug: "local-expert",
    name: "ListQik Full Service — Local Expert (2% minimum listing commission at closing)",
    intakeFeeUsd: 299,
    listingCommissionPercent: 2,
  },
];
