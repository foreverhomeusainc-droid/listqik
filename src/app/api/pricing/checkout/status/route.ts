import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";
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

  return NextResponse.json({
    ok: true,
    sessionId,
    planPaid,
    upgradesPaid,
    requiresUpgradePayment,
    userExists,
    setupRequired,
  });
}

