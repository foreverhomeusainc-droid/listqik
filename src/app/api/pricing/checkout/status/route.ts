import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";
import { UpgradePurchase } from "@/models/UpgradePurchase";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId")?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "sessionId is required." },
      { status: 400 },
    );
  }

  await connectDb();

  const session = await PricingCheckoutSession.findOne({ sessionId }).lean();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Checkout session not found." }, { status: 404 });
  }

  const user = await User.findOne({ email: session.purchaserEmail })
    .select("_id passwordSetupTokenSha256")
    .lean();

  const planPaid = Boolean(session.planPaid);
  const upgradesPaid = Boolean(session.upgradesPaid);
  const requiresUpgradePayment = Array.isArray(session.selectedUpgradeSlugs)
    ? session.selectedUpgradeSlugs.length > 0
    : false;
  const userExists = Boolean(user);
  const setupRequired = Boolean(user?.passwordSetupTokenSha256);
  const upgradePurchase = await UpgradePurchase.findOne({ checkoutSessionId: sessionId })
    .select("externalOrderId amountTotal currency upgradeSlugs")
    .sort({ purchasedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({
    ok: true,
    sessionId,
    planPaid,
    upgradesPaid,
    requiresUpgradePayment,
    userExists,
    setupRequired,
    upgradesPurchase: upgradePurchase
      ? {
          transactionId: upgradePurchase.externalOrderId?.trim() || sessionId,
          amountTotal:
            typeof upgradePurchase.amountTotal === "number" ? upgradePurchase.amountTotal : null,
          currency: upgradePurchase.currency?.trim()?.toUpperCase() || "USD",
          upgradeSlugs: Array.isArray(upgradePurchase.upgradeSlugs)
            ? upgradePurchase.upgradeSlugs.filter(
                (slug: unknown): slug is string => typeof slug === "string" && slug.trim().length > 0,
              )
            : [],
        }
      : null,
  });
}

