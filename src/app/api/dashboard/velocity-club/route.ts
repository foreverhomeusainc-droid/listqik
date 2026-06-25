import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { computeVelocityClubSnapshot } from "@/lib/loyalty/compute-loyalty-snapshot";
import { CREDIT_BUNDLES } from "@/lib/loyalty/credit-bundles";
import { deriveOnboardingState } from "@/lib/loyalty/onboarding";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { ListingCredit } from "@/models/ListingCredit";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);

  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  if (!user.velocityClubJoinedAt) {
    const joinedAt = new Date();
    await User.updateOne({ _id: userId }, { $set: { velocityClubJoinedAt: joinedAt } });
    user.velocityClubJoinedAt = joinedAt;
  }

  const [snapshot, creditRows, listingStats] = await Promise.all([
    computeVelocityClubSnapshot(userId, {
      fastTrackTrialActive: Boolean(user.loyaltyFastTrackTrialActive),
      userEmail: user.email,
    }),
    ListingCredit.find({ userId }).sort({ purchasedAt: -1 }).lean(),
    Promise.all([
      Listing.countDocuments({ userId }),
      Listing.countDocuments({ userId, status: { $in: ["ACTIVE", "PENDING", "SOLD"] } }),
    ]),
  ]);

  const onboarding = deriveOnboardingState({
    createdAt: user.createdAt,
    velocityClubJoinedAt: user.velocityClubJoinedAt,
    investorPersona: user.investorPersona as "flipper" | "wholesaler" | "landlord" | null,
    loyaltyOnboarding: user.loyaltyOnboarding,
    fastTrackTrialActive: user.loyaltyFastTrackTrialActive,
    fastTrackTrialGrantedAt: user.loyaltyFastTrackTrialGrantedAt,
    hasAnyListing: listingStats[0] > 0,
    hasLiveListing: listingStats[1] > 0,
  });

  return NextResponse.json({
    ok: true,
    snapshot,
    bundles: CREDIT_BUNDLES,
    credits: creditRows.map((row) => ({
      id: String(row._id),
      bundleSlug: row.bundleSlug,
      bundleName: row.bundleName,
      quantityPurchased: row.quantityPurchased,
      quantityRemaining: row.quantityRemaining,
      purchasedAt: row.purchasedAt?.toISOString() ?? null,
    })),
    onboarding,
  });
}
