import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { resolveLegacyCalculator } from "@/lib/calculators/types";
import { fulfillCalculatorPush } from "@/lib/calculators/fulfill-calculator-push";
import { connectDb } from "@/lib/mongodb";

type Body = {
  calculatorSlug?: string;
  listingKind?: "sale" | "rental";
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: number;
  propertyType?: string;
  payload?: Record<string, unknown>;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Sign in to push this deal to a live listing.", loginUrl: "/login" },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const slug = body.calculatorSlug?.trim() ?? "";
  const calc = resolveLegacyCalculator(slug);
  if (!calc) {
    return NextResponse.json({ ok: false, error: "Unknown calculator." }, { status: 400 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);

  const result = await fulfillCalculatorPush(userId, {
    calculatorSlug: slug,
    listingKind: body.listingKind,
    street: body.street,
    unit: body.unit,
    city: body.city,
    state: body.state,
    zip: body.zip,
    price: body.price,
    propertyType: body.propertyType,
    payload: body.payload,
  });

  return NextResponse.json({
    ok: true,
    draftId: result.draftId,
    redirectUrl: result.redirectUrl,
    listingCreated: result.listingCreated,
    listingId: result.listingId,
    creditRedeemed: result.creditRedeemed ?? false,
  });
}
