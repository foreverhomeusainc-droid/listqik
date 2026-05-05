import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { PricingCheckoutSession } from "@/models/PricingCheckoutSession";

type SessionBody = {
  sessionId?: string;
  email?: string;
  planId?: string;
  planCheckoutUrl?: string;
  selectedUpgradeSlugs?: string[];
};

export async function POST(req: Request) {
  let body: SessionBody;
  try {
    body = (await req.json()) as SessionBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  const email = body.email?.trim().toLowerCase();
  const planId = body.planId?.trim();
  if (!sessionId || !email || !planId) {
    return NextResponse.json(
      { ok: false, error: "sessionId, email, and planId are required." },
      { status: 400 },
    );
  }

  const selectedUpgradeSlugs = (body.selectedUpgradeSlugs ?? [])
    .map((v) => v.trim())
    .filter(Boolean);

  await connectDb();
  await PricingCheckoutSession.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        purchaserEmail: email,
        planId,
        planCheckoutUrl: body.planCheckoutUrl?.trim() || null,
        selectedUpgradeSlugs,
      },
    },
    { upsert: true, new: true },
  );

  return NextResponse.json({ ok: true, sessionId });
}

