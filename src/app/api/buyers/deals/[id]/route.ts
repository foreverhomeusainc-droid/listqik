import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { getFullDealById } from "@/lib/buyers/deals-service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const deal = await getFullDealById(id);
  if (!deal) {
    return NextResponse.json({ ok: false, error: "Deal not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deal });
}
