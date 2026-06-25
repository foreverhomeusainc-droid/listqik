import type { Types } from "mongoose";
import { Listing } from "@/models/Listing";
import { ListingCredit } from "@/models/ListingCredit";
import { PlanPurchase } from "@/models/PlanPurchase";
import { progressToNextTier, tierForEffectiveCount, type LoyaltyTierId } from "@/lib/loyalty/tiers";
import { countMemberCalculatorRuns } from "@/lib/calculators/access";

const TRADITIONAL_LISTING_COMMISSION_PCT = 0.03;
const PLAN_FEE_FALLBACK_USD: Record<string, number> = {
  subsonic: 79,
  supersonic: 295,
  hypersonic: 595,
};

const ROLLING_MS = 365 * 24 * 60 * 60 * 1000;

function rollingCutoff(): Date {
  return new Date(Date.now() - ROLLING_MS);
}

function isRentalListing(row: { tenantOccupied?: boolean; listingKind?: string }): boolean {
  if (row.listingKind === "rental") return true;
  return Boolean(row.tenantOccupied);
}

export type LoyaltyListingCounts = {
  mlsListings12mo: number;
  rentalListings12mo: number;
  totalListings12mo: number;
  lifetimeListings: number;
};

export type LoyaltySavings = {
  traditionalCommissionsAvoidedUsd: number;
  listQikFeesPaidUsd: number;
  netSavingsUsd: number;
};

export type VelocityClubSnapshot = {
  tierId: LoyaltyTierId;
  tierName: string;
  tierTagline: string;
  effectiveCount: number;
  unusedCredits: number;
  rollingListings12mo: number;
  counts: LoyaltyListingCounts;
  savings: LoyaltySavings;
  velocityScore: number;
  progressPct: number;
  listingsUntilNext: number | null;
  nextTierName: string | null;
  fastTrackEligible: boolean;
  fastTrackTrialActive: boolean;
};

async function countRollingListings(userId: Types.ObjectId): Promise<{
  rows: Array<{ price?: number | null; tenantOccupied?: boolean; listingKind?: string }>;
  mls: number;
  rental: number;
}> {
  const cutoff = rollingCutoff();
  const rows = await Listing.find({
    userId,
    status: { $in: ["ACTIVE", "PENDING", "SOLD", "EXPIRED"] },
    $or: [{ listedOn: { $gte: cutoff } }, { setupFinalizedAt: { $gte: cutoff } }],
  })
    .select("price tenantOccupied listingKind")
    .lean();

  let mls = 0;
  let rental = 0;
  for (const row of rows) {
    if (isRentalListing(row)) {
      rental += 1;
    } else {
      mls += 1;
    }
  }

  return { rows, mls, rental };
}

export async function sumUnusedCredits(userId: Types.ObjectId): Promise<number> {
  const bundles = await ListingCredit.find({ userId, quantityRemaining: { $gt: 0 } })
    .select("quantityRemaining")
    .lean();
  return bundles.reduce((sum, row) => sum + (row.quantityRemaining ?? 0), 0);
}

async function computeSavings(userId: Types.ObjectId, userEmail?: string | null): Promise<LoyaltySavings> {
  const lifetimeRows = await Listing.find({
    userId,
    status: { $in: ["ACTIVE", "PENDING", "SOLD", "EXPIRED"] },
  })
    .select("price")
    .lean();

  let traditionalCommissionsAvoidedUsd = 0;
  for (const row of lifetimeRows) {
    const price = typeof row.price === "number" && row.price > 0 ? row.price : 0;
    traditionalCommissionsAvoidedUsd += price * TRADITIONAL_LISTING_COMMISSION_PCT;
  }

  const email = userEmail?.trim().toLowerCase();
  const planQuery = email
    ? {
        $or: [{ userId }, { purchaserEmail: email }],
        status: { $in: ["ACTIVE", "PENDING_CLAIM", "EXPIRED"] },
      }
    : { userId, status: { $in: ["ACTIVE", "PENDING_CLAIM", "EXPIRED"] } };

  const [plans, credits] = await Promise.all([
    PlanPurchase.find(planQuery).select("amountTotal planId paymentStatus").lean(),
    ListingCredit.find({ userId }).select("amountTotalUsd").lean(),
  ]);

  let listQikFeesPaidUsd = 0;
  for (const plan of plans) {
    if (plan.paymentStatus === "credit_redeemed") {
      continue;
    }
    if (typeof plan.amountTotal === "number" && plan.amountTotal > 0) {
      listQikFeesPaidUsd += plan.amountTotal;
    } else {
      const slug = (plan.planId ?? "").toLowerCase();
      listQikFeesPaidUsd += PLAN_FEE_FALLBACK_USD[slug] ?? 0;
    }
  }
  for (const bundle of credits) {
    if (typeof bundle.amountTotalUsd === "number" && bundle.amountTotalUsd > 0) {
      listQikFeesPaidUsd += bundle.amountTotalUsd;
    }
  }

  const netSavingsUsd = Math.max(0, traditionalCommissionsAvoidedUsd - listQikFeesPaidUsd);

  return {
    traditionalCommissionsAvoidedUsd: Math.round(traditionalCommissionsAvoidedUsd),
    listQikFeesPaidUsd: Math.round(listQikFeesPaidUsd),
    netSavingsUsd: Math.round(netSavingsUsd),
  };
}

function computeVelocityScore(args: {
  mls12mo: number;
  rental12mo: number;
  totalCreditsPurchased: number;
  activeMonthsStreak: number;
  calculatorRuns: number;
}): number {
  const base = args.mls12mo * 100 + args.rental12mo * 40;
  const bulkBonus = args.totalCreditsPurchased >= 25 ? 500 : args.totalCreditsPurchased >= 10 ? 250 : args.totalCreditsPurchased >= 5 ? 100 : 0;
  const streakBonus = args.activeMonthsStreak >= 3 ? 150 : args.activeMonthsStreak >= 2 ? 75 : args.activeMonthsStreak >= 1 ? 25 : 0;
  const calculatorBonus = Math.min(200, args.calculatorRuns * 2);
  return base + bulkBonus + streakBonus + calculatorBonus;
}

async function activeMonthStreak(userId: Types.ObjectId): Promise<number> {
  const since = new Date();
  since.setMonth(since.getMonth() - 6);
  const rows = await Listing.find({
    userId,
    status: { $ne: "INCOMPLETE" },
    $or: [{ listedOn: { $gte: since } }, { setupFinalizedAt: { $gte: since } }, { createdAt: { $gte: since } }],
  })
    .select("listedOn setupFinalizedAt createdAt")
    .lean();

  const months = new Set<string>();
  for (const row of rows) {
    const d = row.listedOn ?? row.setupFinalizedAt ?? row.createdAt;
    if (!d) continue;
    const date = new Date(d);
    months.add(`${date.getUTCFullYear()}-${date.getUTCMonth()}`);
  }

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 6; i += 1) {
    const probe = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${probe.getUTCFullYear()}-${probe.getUTCMonth()}`;
    if (months.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

async function totalCreditsEverPurchased(userId: Types.ObjectId): Promise<number> {
  const bundles = await ListingCredit.find({ userId }).select("quantityPurchased").lean();
  return bundles.reduce((sum, row) => sum + (row.quantityPurchased ?? 0), 0);
}

export async function computeVelocityClubSnapshot(
  userId: Types.ObjectId,
  options?: { fastTrackTrialActive?: boolean; userEmail?: string | null },
): Promise<VelocityClubSnapshot> {
  const [rolling, unusedCredits, lifetimeCount, totalPurchasedCredits, streak, calculatorRuns] =
    await Promise.all([
    countRollingListings(userId),
    sumUnusedCredits(userId),
    Listing.countDocuments({
      userId,
      status: { $in: ["ACTIVE", "PENDING", "SOLD", "EXPIRED"] },
    }),
    totalCreditsEverPurchased(userId),
    activeMonthStreak(userId),
    countMemberCalculatorRuns(userId),
  ]);

  const rollingListings12mo = rolling.mls + rolling.rental;
  const effectiveCount = rollingListings12mo + unusedCredits;
  const tier = tierForEffectiveCount(effectiveCount);
  const { progressPct, listingsUntilNext, nextTier } = progressToNextTier(effectiveCount);
  const savings = await computeSavings(userId, options?.userEmail);
  const velocityScore = computeVelocityScore({
    mls12mo: rolling.mls,
    rental12mo: rolling.rental,
    totalCreditsPurchased: totalPurchasedCredits,
    activeMonthsStreak: streak,
    calculatorRuns,
  });

  return {
    tierId: tier.id,
    tierName: tier.name,
    tierTagline: tier.tagline,
    effectiveCount,
    unusedCredits,
    rollingListings12mo,
    counts: {
      mlsListings12mo: rolling.mls,
      rentalListings12mo: rolling.rental,
      totalListings12mo: rollingListings12mo,
      lifetimeListings: lifetimeCount,
    },
    savings,
    velocityScore,
    progressPct,
    listingsUntilNext,
    nextTierName: nextTier?.name ?? null,
    fastTrackEligible: tier.fastTrackQueue,
    fastTrackTrialActive: Boolean(options?.fastTrackTrialActive),
  };
}

export function previewTierAfterBundle(
  currentEffectiveCount: number,
  bundleCredits: number,
): { tierName: string; effectiveCount: number } {
  const effectiveCount = currentEffectiveCount + bundleCredits;
  const tier = tierForEffectiveCount(effectiveCount);
  return { tierName: tier.name, effectiveCount };
}
