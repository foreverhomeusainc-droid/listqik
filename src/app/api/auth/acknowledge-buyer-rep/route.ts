import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

const DEFAULT_NEXT_URL = "/dashboard/buyers";

function sanitizeBuyerRepNextUrl(url: unknown): string {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) {
    return DEFAULT_NEXT_URL;
  }

  const allowedPrefixes = ["/dashboard/buyers", "/demo/buyer-dashboard"];
  const isAllowed = allowedPrefixes.some(
    (prefix) => url === prefix || url.startsWith(`${prefix}?`),
  );
  return isAllowed ? url : DEFAULT_NEXT_URL;
}

export async function POST(request: Request) {
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

  const body = (await request.json().catch(() => ({}))) as { nextUrl?: unknown };
  const nextUrl = sanitizeBuyerRepNextUrl(body.nextUrl);

  return NextResponse.json({ ok: true, nextUrl });
}
