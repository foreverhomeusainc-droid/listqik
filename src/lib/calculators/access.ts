import { createHash } from "crypto";
import type { Types } from "mongoose";
import { computeVelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import type { LoyaltyTierId } from "@/lib/loyalty/tiers";
import type { CalculatorId } from "@/lib/calculators/types";
import { connectDb } from "@/lib/mongodb";
import { CalculatorUsage } from "@/models/CalculatorUsage";

export const ANON_DAILY_LIMIT = Number(process.env.CALCULATOR_ANON_DAILY_LIMIT ?? 3);

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

export function fingerprintFromRequest(req: Request): string {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)lq_calc_fp=([^;]+)/);
  if (match?.[1]) {
    return createHash("sha256").update(match[1]).digest("hex");
  }
  const ua = req.headers.get("user-agent") ?? "unknown";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex");
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
