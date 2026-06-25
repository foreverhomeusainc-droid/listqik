import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { dispatchVelocityClubOnboardingEmail } from "@/lib/dispatch-velocity-club-onboarding-email";
import { User } from "@/models/User";

function appBaseUrl(): string {
  const auth = process.env.NEXTAUTH_URL?.trim();
  if (auth) return auth.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "";
}

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization")?.trim();
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await connectDb();
  const base = appBaseUrl();
  const dashboardUrl = base ? `${base}/dashboard/velocity-club` : "/dashboard/velocity-club";

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const candidates = await User.find({
    velocityClubJoinedAt: { $ne: null },
    email: { $exists: true, $ne: "" },
  })
    .select("email name velocityClubJoinedAt loyaltyEmailDay2SentAt loyaltyEmailDay3SentAt createdAt")
    .lean();

  let day2Sent = 0;
  let day3Sent = 0;
  const errors: string[] = [];

  for (const user of candidates) {
    const joined = user.velocityClubJoinedAt ?? user.createdAt;
    if (!joined || !user.email) continue;
    const ageDays = Math.floor((now - new Date(joined).getTime()) / dayMs);

    if (ageDays >= 1 && !user.loyaltyEmailDay2SentAt) {
      const result = await dispatchVelocityClubOnboardingEmail({
        kind: "day2",
        to: user.email,
        fullName: user.name,
        dashboardUrl,
      });
      if (result.sent) {
        await User.updateOne({ _id: user._id }, { $set: { loyaltyEmailDay2SentAt: new Date() } });
        day2Sent += 1;
      } else if (result.error) {
        errors.push(`day2:${user.email}:${result.error}`);
      }
    }

    if (ageDays >= 2 && !user.loyaltyEmailDay3SentAt) {
      const result = await dispatchVelocityClubOnboardingEmail({
        kind: "day3",
        to: user.email,
        fullName: user.name,
        dashboardUrl,
      });
      if (result.sent) {
        await User.updateOne({ _id: user._id }, { $set: { loyaltyEmailDay3SentAt: new Date() } });
        day3Sent += 1;
      } else if (result.error) {
        errors.push(`day3:${user.email}:${result.error}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    processed: candidates.length,
    day2Sent,
    day3Sent,
    errors,
  });
}
