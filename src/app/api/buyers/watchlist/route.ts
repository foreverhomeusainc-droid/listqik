import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { listDealsByIds } from "@/lib/buyers/deals-service";
import { connectDb } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const hasRep = await hasAcknowledgedBuyerRep(session.user.id);
  if (!hasRep) {
    return NextResponse.json(
      { ok: false, error: "Buyer Representation required.", repUrl: "/buyer-representation" },
      { status: 403 },
    );
  }

  await connectDb();
  const user = await User.findById(session.user.id).select({ savedBuyerDealIds: 1 }).lean();
  const ids = (user?.savedBuyerDealIds ?? []).map((id: unknown) => String(id));
  const deals = await listDealsByIds(ids);

  return NextResponse.json({ ok: true, deals, dealIds: ids });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !Types.ObjectId.isValid(session.user.id)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const hasRep = await hasAcknowledgedBuyerRep(session.user.id);
  if (!hasRep) {
    return NextResponse.json(
      { ok: false, error: "Buyer Representation required.", repUrl: "/buyer-representation" },
      { status: 403 },
    );
  }

  let body: { dealId?: string; action?: "add" | "remove" };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const dealId = body.dealId?.trim() ?? "";
  if (!Types.ObjectId.isValid(dealId)) {
    return NextResponse.json({ ok: false, error: "Invalid deal id." }, { status: 400 });
  }

  await connectDb();
  const oid = new Types.ObjectId(dealId);
  const userId = new Types.ObjectId(session.user.id);

  if (body.action === "remove") {
    await User.updateOne({ _id: userId }, { $pull: { savedBuyerDealIds: oid } });
  } else {
    await User.updateOne({ _id: userId }, { $addToSet: { savedBuyerDealIds: oid } });
  }

  const user = await User.findById(userId).select({ savedBuyerDealIds: 1 }).lean();
  const ids = (user?.savedBuyerDealIds ?? []).map((id: unknown) => String(id));

  return NextResponse.json({ ok: true, dealIds: ids, saved: body.action !== "remove" });
}
