import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import {
  attachCalculatorFingerprintCookie,
  recordMemberCalculatorRun,
  resolveCalculatorAccess,
  resolveCalculatorFingerprint,
} from "@/lib/calculators/access";
import { calculatorByAccessKey } from "@/lib/calculators/types";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("tool")?.trim() ?? "";
  const calc = calculatorByAccessKey(slug);
  if (!calc) {
    return NextResponse.json({ ok: false, error: "Unknown calculator." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  await connectDb();

  let userId: Types.ObjectId | null = null;
  let userEmail: string | null = null;
  if (session?.user?.id) {
    userId = new Types.ObjectId(session.user.id);
    const user = await User.findById(userId).select("email").lean();
    userEmail = user?.email ?? session.user.email ?? null;
  }

  const { fingerprintHash, cookieToSet } = resolveCalculatorFingerprint(req);
  const access = await resolveCalculatorAccess({
    calculatorId: calc.id,
    userId,
    userEmail,
    fingerprintHash,
    incrementIfAnonymous: false,
  });

  const res = NextResponse.json({ ok: true, access });
  attachCalculatorFingerprintCookie(res, cookieToSet);
  return res;
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("tool")?.trim() ?? "";
  const calc = calculatorByAccessKey(slug);
  if (!calc) {
    return NextResponse.json({ ok: false, error: "Unknown calculator." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  await connectDb();

  let userId: Types.ObjectId | null = null;
  let userEmail: string | null = null;
  if (session?.user?.id) {
    userId = new Types.ObjectId(session.user.id);
    const user = await User.findById(userId).select("email").lean();
    userEmail = user?.email ?? session.user.email ?? null;
  }

  const { fingerprintHash, cookieToSet } = resolveCalculatorFingerprint(req);
  const access = await resolveCalculatorAccess({
    calculatorId: calc.id,
    userId,
    userEmail,
    fingerprintHash,
    incrementIfAnonymous: !userId,
  });

  if (!access.canRun) {
    return NextResponse.json(
      {
        ok: false,
        error: "Daily limit reached. Create a free account for unlimited runs.",
        access,
      },
      { status: 429 },
    );
  }

  if (userId) {
    await recordMemberCalculatorRun(userId, calc.id);
  }

  const res = NextResponse.json({ ok: true, access });
  attachCalculatorFingerprintCookie(res, cookieToSet);
  return res;
}
