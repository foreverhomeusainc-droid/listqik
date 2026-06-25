import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { redeemOneListingCredit } from "@/lib/loyalty/fulfill-credit-bundle";
import { connectDb } from "@/lib/mongodb";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const result = await redeemOneListingCredit(userId);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    planPurchaseId: result.planPurchaseId,
    creditsRemaining: result.creditsRemaining,
    nextUrl: "/dashboard?credit=redeemed",
  });
}
