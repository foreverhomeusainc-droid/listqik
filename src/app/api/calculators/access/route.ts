import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import {
  calcFingerprintCookieValue,
  fingerprintFromRequest,
  recordMemberCalculatorRun,
  resolveCalculatorAccess,
} from "@/lib/calculators/access";
import { calculatorBySlug } from "@/lib/calculators/types";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("tool")?.trim() ?? "";
  const calc = calculatorBySlug(slug);
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

  const fingerprintHash = fingerprintFromRequest(req);
  const access = await resolveCalculatorAccess({
    calculatorId: calc.id,
    userId,
    userEmail,
    fingerprintHash,
    incrementIfAnonymous: false,
  });

  const res = NextResponse.json({ ok: true, access });
  if (!session?.user?.id && !req.headers.get("cookie")?.includes("lq_calc_fp=")) {
    res.cookies.set("lq_calc_fp", calcFingerprintCookieValue(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return res;
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("tool")?.trim() ?? "";
  const calc = calculatorBySlug(slug);
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

  const fingerprintHash = fingerprintFromRequest(req);
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
  if (!session?.user?.id && !req.headers.get("cookie")?.includes("lq_calc_fp=")) {
    res.cookies.set("lq_calc_fp", calcFingerprintCookieValue(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return res;
}
