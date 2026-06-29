import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

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
  await User.updateOne(
    { _id: userId, buyerRepAcknowledgedAt: null },
    { $set: { buyerRepAcknowledgedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, nextUrl: "/dashboard/buyers" });
}
