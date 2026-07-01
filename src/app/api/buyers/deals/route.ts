import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { hasAcknowledgedBuyerRep } from "@/lib/buyer-rep";
import { getLatestFeedSyncAt, listFullDeals } from "@/lib/buyers/deals-service";
import type { BuyerDealFilters, BuyerDealStatus } from "@/lib/buyers/types";

function parseFilters(searchParams: URLSearchParams): BuyerDealFilters {
  const sort = searchParams.get("sort");
  const status = searchParams.get("status");
  const minScore = searchParams.get("minScore");
  const maxPrice = searchParams.get("maxPrice");
  return {
    zip: searchParams.get("zip") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    status:
      status === "active" || status === "pending" || status === "sold"
        ? (status as BuyerDealStatus)
        : undefined,
    minScore: minScore ? Number(minScore) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "dom" || sort === "score"
        ? sort
        : "score",
  };
}

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const filters = parseFilters(searchParams);
  const [deals, lastSyncedAt] = await Promise.all([listFullDeals(filters), getLatestFeedSyncAt()]);

  return NextResponse.json({ ok: true, deals, lastSyncedAt });
}
