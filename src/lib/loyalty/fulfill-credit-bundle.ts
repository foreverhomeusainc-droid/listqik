import { Types } from "mongoose";
import { creditBundleBySlug } from "@/lib/loyalty/credit-bundles";
import { ListingCredit } from "@/models/ListingCredit";
import { PlanPurchase } from "@/models/PlanPurchase";
import { User } from "@/models/User";

export async function fulfillListingCreditBundle(input: {
  userId: Types.ObjectId;
  bundleSlug: string;
  externalOrderId: string;
  checkoutSessionId?: string;
  amountTotalUsd?: number | null;
}): Promise<{ status: "duplicate" | "ok"; creditsAdded: number }> {
  const bundle = creditBundleBySlug(input.bundleSlug);
  if (!bundle) {
    throw new Error(`Unknown credit bundle slug: ${input.bundleSlug}`);
  }

  const existing = await ListingCredit.findOne({ externalOrderId: input.externalOrderId }).lean();
  if (existing) {
    return { status: "duplicate", creditsAdded: existing.quantityPurchased ?? 0 };
  }

  await ListingCredit.create({
    userId: input.userId,
    bundleSlug: bundle.slug,
    bundleName: bundle.name,
    quantityPurchased: bundle.credits,
    quantityRemaining: bundle.credits,
    amountTotalUsd: input.amountTotalUsd ?? bundle.amountUsd,
    purchasedAt: new Date(),
    externalOrderId: input.externalOrderId,
    checkoutSessionId: input.checkoutSessionId ?? null,
  });

  return { status: "ok", creditsAdded: bundle.credits };
}

export async function redeemOneListingCredit(userId: Types.ObjectId): Promise<
  | { ok: true; planPurchaseId: string; creditsRemaining: number }
  | { ok: false; error: string }
> {
  const bundle = await ListingCredit.findOne({ userId, quantityRemaining: { $gt: 0 } })
    .sort({ purchasedAt: 1 })
    .exec();

  if (!bundle) {
    return { ok: false, error: "No listing credits available." };
  }

  bundle.quantityRemaining -= 1;
  await bundle.save();

  const user = await User.findById(userId).select("email").lean();
  if (!user?.email) {
    bundle.quantityRemaining += 1;
    await bundle.save();
    return { ok: false, error: "User account not found." };
  }

  const externalOrderId = `credit-redeem-${bundle._id}-${bundle.quantityPurchased - bundle.quantityRemaining}`;
  const existingPlan = await PlanPurchase.findOne({ externalOrderId }).lean();
  if (existingPlan) {
    const remaining = await ListingCredit.aggregate<{ total: number }>([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$quantityRemaining" } } },
    ]);
    return {
      ok: true,
      planPurchaseId: String(existingPlan._id),
      creditsRemaining: remaining[0]?.total ?? 0,
    };
  }

  try {
    const purchase = await PlanPurchase.create({
      purchaserEmail: user.email,
      userId,
      planId: "subsonic",
      planName: "Subsonic (Velocity Credit)",
      status: "ACTIVE",
      purchasedAt: new Date(),
      claimedAt: new Date(),
      externalOrderId,
      paymentStatus: "credit_redeemed",
      amountTotal: 0,
    });

    const remaining = await ListingCredit.aggregate<{ total: number }>([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$quantityRemaining" } } },
    ]);

    return {
      ok: true,
      planPurchaseId: String(purchase._id),
      creditsRemaining: remaining[0]?.total ?? 0,
    };
  } catch {
    bundle.quantityRemaining += 1;
    await bundle.save();
    return { ok: false, error: "Could not activate listing credit. Please try again." };
  }
}
