import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * POST /api/auth/acknowledge-user-agreement
 *
 * Marks the signed-in user as having acknowledged the ListQik User Agreement
 * (the gate shown at /listing-agreement). Idempotent — re-acknowledging keeps
 * the original timestamp.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(session.user.id)) {
    return NextResponse.json({ ok: false, error: "Invalid session user." }, { status: 400 });
  }

  await connectDb();

  const userId = new Types.ObjectId(session.user.id);
  const result = await User.updateOne(
    { _id: userId, userAgreementAcknowledgedAt: null },
    { $set: { userAgreementAcknowledgedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    // Either the user didn't exist or already acknowledged previously — both are fine.
    const existing = (await User.findById(userId, { userAgreementAcknowledgedAt: 1 }).lean()) as
      | { userAgreementAcknowledgedAt?: Date | null }
      | null;
    if (!existing) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }
  }

  return NextResponse.json({ ok: true });
}
