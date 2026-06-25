import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import type { InvestorPersona } from "@/lib/loyalty/onboarding";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

type Body = {
  action?: "complete_welcome" | "set_persona" | "mark_progress_seen" | "mark_fast_track_seen";
  persona?: InvestorPersona;
};

const PERSONAS: InvestorPersona[] = ["flipper", "wholesaler", "landlord"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const action = body.action?.trim();
  if (!action) {
    return NextResponse.json({ ok: false, error: "action is required." }, { status: 400 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  if (!user.velocityClubJoinedAt) {
    user.velocityClubJoinedAt = new Date();
  }

  const onboarding = user.loyaltyOnboarding ?? {
    welcomeComplete: false,
    personaComplete: false,
    progressSeen: false,
    fastTrackUnlockSeen: false,
  };

  if (action === "complete_welcome") {
    onboarding.welcomeComplete = true;
  } else if (action === "set_persona") {
    const persona = body.persona;
    if (!persona || !PERSONAS.includes(persona)) {
      return NextResponse.json({ ok: false, error: "Valid persona is required." }, { status: 400 });
    }
    user.investorPersona = persona;
    onboarding.personaComplete = true;
  } else if (action === "mark_progress_seen") {
    onboarding.progressSeen = true;
  } else if (action === "mark_fast_track_seen") {
    onboarding.fastTrackUnlockSeen = true;
  } else {
    return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
  }

  user.loyaltyOnboarding = onboarding;
  await user.save();

  return NextResponse.json({ ok: true });
}
