export type CreditBundleSlug = "pipeline-5" | "pipeline-10" | "pipeline-25";

export type CreditBundleDefinition = {
  slug: CreditBundleSlug;
  name: string;
  credits: number;
  amountUsd: number;
  savingsLabel: string;
  tierBumpHint: string;
};

export const CREDIT_BUNDLES: CreditBundleDefinition[] = [
  {
    slug: "pipeline-5",
    name: "5-Pack Pipeline Bundle",
    credits: 5,
    amountUsd: 335,
    savingsLabel: "Save ~15% vs single listings",
    tierBumpHint: "Instantly counts toward Syndicate perks when purchased",
  },
  {
    slug: "pipeline-10",
    name: "10-Pack Pipeline Bundle",
    credits: 10,
    amountUsd: 630,
    savingsLabel: "Save ~20% vs single listings",
    tierBumpHint: "Enough credits to reach Portfolio Titan status",
  },
  {
    slug: "pipeline-25",
    name: "25-Pack Pipeline Bundle",
    credits: 25,
    amountUsd: 1487,
    savingsLabel: "Save ~25% vs single listings",
    tierBumpHint: "Unlock Market Mogul tier status immediately",
  },
];

export function creditBundleBySlug(slug: string): CreditBundleDefinition | null {
  return CREDIT_BUNDLES.find((b) => b.slug === slug) ?? null;
}

export function parseCreditBundlePriceMap(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[key.trim()] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}
