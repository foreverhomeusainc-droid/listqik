import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { CalculatorDealDraft } from "@/models/CalculatorDealDraft";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid draft id." }, { status: 400 });
  }

  await connectDb();
  const draft = await CalculatorDealDraft.findOne({
    _id: id,
    userId: new Types.ObjectId(session.user.id),
  }).lean();

  if (!draft) {
    return NextResponse.json({ ok: false, error: "Draft not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    draft: {
      id: String(draft._id),
      calculatorId: draft.calculatorId,
      listingKind: draft.listingKind,
      street: draft.street,
      unit: draft.unit,
      city: draft.city,
      state: draft.state,
      zip: draft.zip,
      price: draft.price,
      propertyType: draft.propertyType,
      payload: draft.payload,
      consumedAt: draft.consumedAt?.toISOString() ?? null,
    },
  });
}
