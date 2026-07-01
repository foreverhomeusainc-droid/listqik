import { createHash } from "crypto";
import type { Types } from "mongoose";
import { computeVelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import type { LoyaltyTierId } from "@/lib/loyalty/tiers";
import type { CalculatorId } from "@/lib/calculators/types";
import { connectDb } from "@/lib/mongodb";
import { CalculatorUsage } from "@/models/CalculatorUsage";

export const ANON_DAILY_LIMIT = Number(process.env.CALCULATOR_ANON_DAILY_LIMIT ?? 5);
export const CALC_FINGERPRINT_COOKIE = "lq_calc_fp";

export type CalculatorAccess = {
  calculatorId: CalculatorId;
  accessLevel: "anonymous" | "scout" | "syndicate";
  tierId: LoyaltyTierId | null;
  canRun: boolean;
  runsRemaining: number | null;
  canExportPdf: boolean;
  canPushToListing: boolean;
  isAuthenticated: boolean;
};

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Stable anonymous id: always prefer the calc fingerprint cookie (set on first visit). */
export function resolveCalculatorFingerprint(req: Request): {
  fingerprintHash: string;
  cookieToSet: string | null;
} {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CALC_FINGERPRINT_COOKIE}=([^;]+)`));
  if (match?.[1]) {
    return {
      fingerprintHash: createHash("sha256").update(match[1]).digest("hex"),
      cookieToSet: null,
    };
  }
  const plain = calcFingerprintCookieValue();
  return {
    fingerprintHash: createHash("sha256").update(plain).digest("hex"),
    cookieToSet: plain,
  };
}

/** @deprecated Use resolveCalculatorFingerprint for consistent guest tracking. */
export function fingerprintFromRequest(req: Request): string {
  return resolveCalculatorFingerprint(req).fingerprintHash;
}

export function attachCalculatorFingerprintCookie(
  res: { cookies: { set: (name: string, value: string, options: object) => void } },
  cookieToSet: string | null,
): void {
  if (!cookieToSet) return;
  res.cookies.set(CALC_FINGERPRINT_COOKIE, cookieToSet, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

function tierMeetsPdfExport(tierId: LoyaltyTierId | null): boolean {
  return tierId === "syndicate" || tierId === "titan" || tierId === "mogul";
}

export async function resolveCalculatorAccess(input: {
  calculatorId: CalculatorId;
  userId?: Types.ObjectId | null;
  userEmail?: string | null;
  fingerprintHash: string;
  incrementIfAnonymous?: boolean;
}): Promise<CalculatorAccess> {
  await connectDb();

  if (input.userId) {
    const snapshot = await computeVelocityClubSnapshot(input.userId, {
      userEmail: input.userEmail,
    });
    const syndicate = tierMeetsPdfExport(snapshot.tierId);
    return {
      calculatorId: input.calculatorId,
      accessLevel: syndicate ? "syndicate" : "scout",
      tierId: snapshot.tierId,
      canRun: true,
      runsRemaining: null,
      canExportPdf: syndicate,
      canPushToListing: true,
      isAuthenticated: true,
    };
  }

  const usageDate = utcDateKey();
  const row = await CalculatorUsage.findOne({
    fingerprintHash: input.fingerprintHash,
    calculatorId: input.calculatorId,
    usageDate,
  }).lean();

  const used = row?.count ?? 0;
  const remaining = Math.max(0, ANON_DAILY_LIMIT - used);

  if (input.incrementIfAnonymous && remaining > 0) {
    await CalculatorUsage.findOneAndUpdate(
      { fingerprintHash: input.fingerprintHash, calculatorId: input.calculatorId, usageDate },
      { $inc: { count: 1 } },
      { upsert: true, new: true },
    );
    return {
      calculatorId: input.calculatorId,
      accessLevel: "anonymous",
      tierId: null,
      canRun: true,
      runsRemaining: remaining - 1,
      canExportPdf: false,
      canPushToListing: false,
      isAuthenticated: false,
    };
  }

  return {
    calculatorId: input.calculatorId,
    accessLevel: "anonymous",
    tierId: null,
    canRun: remaining > 0,
    runsRemaining: remaining,
    canExportPdf: false,
    canPushToListing: false,
    isAuthenticated: false,
  };
}

export function calcFingerprintCookieValue(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function recordMemberCalculatorRun(
  userId: Types.ObjectId,
  calculatorId: CalculatorId,
): Promise<void> {
  const usageDate = utcDateKey();
  await CalculatorUsage.findOneAndUpdate(
    { userId, calculatorId, usageDate },
    {
      $inc: { count: 1 },
      $setOnInsert: { fingerprintHash: `member:${userId.toString()}` },
    },
    { upsert: true },
  );
}

export async function countMemberCalculatorRuns(userId: Types.ObjectId): Promise<number> {
  const rows = await CalculatorUsage.aggregate<{ total: number }>([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$count" } } },
  ]);
  return rows[0]?.total ?? 0;
}
