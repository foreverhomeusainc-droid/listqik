import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { listFullDeals } from "@/lib/buyers/deals-service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Sign in to access investor buyer deals.", loginUrl: "/login" },
      { status: 401 },
    );
  }

  const hasRep = await hasAcknowledgedBuyerRep(session.user.id);
  if (!hasRep) {
    return NextResponse.json(
      {
        ok: false,
        error: "Buyer Representation Agreement required.",
        repUrl: "/buyer-representation",
      },
      { status: 403 },
    );
  }

  const deals = await listFullDeals();
  return NextResponse.json({ ok: true, deals });
}
