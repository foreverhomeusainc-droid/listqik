import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { createListingFromCalculatorDraft } from "@/lib/calculators/fulfill-calculator-push";
import { connectDb } from "@/lib/mongodb";

type Body = {
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid draft id." }, { status: 400 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const result = await createListingFromCalculatorDraft(userId, new Types.ObjectId(id), body);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, needsAddress: result.needsAddress ?? false },
      { status: result.needsAddress ? 400 : 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    listingId: result.listingId,
    redirectUrl: result.redirectUrl,
  });
}
