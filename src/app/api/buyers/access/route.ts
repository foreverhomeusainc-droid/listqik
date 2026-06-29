import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import type { BuyerAccess } from "@/lib/buyers/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user?.id);
  const hasBuyerRep = isAuthenticated && session?.user?.id
    ? await hasAcknowledgedBuyerRep(session.user.id)
    : false;

  const access: BuyerAccess = {
    isAuthenticated,
    hasBuyerRep,
    canViewFullDeals: hasBuyerRep,
    canRunComps: hasBuyerRep,
  };

  return NextResponse.json({ ok: true, access });
}
