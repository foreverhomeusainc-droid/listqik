export type LoyaltyTierId = "scout" | "syndicate" | "titan" | "mogul";

export type LoyaltyTierDefinition = {
  id: LoyaltyTierId;
  name: string;
  tagline: string;
  minEffectiveCount: number;
  maxEffectiveCount: number | null;
  fastTrackQueue: boolean;
  nextTierId: LoyaltyTierId | null;
};

export const LOYALTY_TIERS: LoyaltyTierDefinition[] = [
  {
    id: "scout",
    name: "Solo Scout",
    tagline: "You've stepped out of the traditional 6% trap.",
    minEffectiveCount: 0,
    maxEffectiveCount: 3,
    fastTrackQueue: false,
    nextTierId: "syndicate",
  },
  {
    id: "syndicate",
    name: "Volume Velocity Syndicate",
    tagline: "Recognized player — tools the amateurs don't get.",
    minEffectiveCount: 4,
    maxEffectiveCount: 11,
    fastTrackQueue: true,
    nextTierId: "titan",
  },
  {
    id: "titan",
    name: "Portfolio Titan",
    tagline: "We treat you like an institutional partner.",
    minEffectiveCount: 12,
    maxEffectiveCount: 24,
    fastTrackQueue: true,
    nextTierId: "mogul",
  },
  {
    id: "mogul",
    name: "Market Mogul",
    tagline: "The platform adapts to you.",
    minEffectiveCount: 25,
    maxEffectiveCount: null,
    fastTrackQueue: true,
    nextTierId: null,
  },
];

export function tierForEffectiveCount(count: number): LoyaltyTierDefinition {
  const normalized = Math.max(0, Math.floor(count));
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i -= 1) {
    const tier = LOYALTY_TIERS[i];
    if (normalized >= tier.minEffectiveCount) {
      return tier;
    }
  }
  return LOYALTY_TIERS[0];
}

export function progressToNextTier(effectiveCount: number): {
  currentTier: LoyaltyTierDefinition;
  nextTier: LoyaltyTierDefinition | null;
  progressPct: number;
  listingsUntilNext: number | null;
} {
  const currentTier = tierForEffectiveCount(effectiveCount);
  const nextTier = currentTier.nextTierId
    ? LOYALTY_TIERS.find((t) => t.id === currentTier.nextTierId) ?? null
    : null;

  if (!nextTier) {
    return { currentTier, nextTier: null, progressPct: 100, listingsUntilNext: null };
  }

  const span = nextTier.minEffectiveCount - currentTier.minEffectiveCount;
  const into = effectiveCount - currentTier.minEffectiveCount;
  const progressPct = span <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((into / span) * 100)));
  const listingsUntilNext = Math.max(0, nextTier.minEffectiveCount - effectiveCount);

  return { currentTier, nextTier, progressPct, listingsUntilNext };
}
