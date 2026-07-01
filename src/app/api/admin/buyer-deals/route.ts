import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { listAdminBuyerDeals, updateBuyerDealAdmin } from "@/lib/buyers/deals-service";
import type { BuyerDealReviewStatus } from "@/lib/buyers/types";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const deals = await listAdminBuyerDeals();
  return NextResponse.json({ ok: true, deals });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: {
    id?: string;
    reviewStatus?: BuyerDealReviewStatus;
    active?: boolean;
    teaserFeatured?: boolean;
    investorScore?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.id?.trim()) {
    return NextResponse.json({ ok: false, error: "Deal id required." }, { status: 400 });
  }

  const patch: Parameters<typeof updateBuyerDealAdmin>[1] = {};
  if (body.reviewStatus) patch.reviewStatus = body.reviewStatus;
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.teaserFeatured === "boolean") patch.teaserFeatured = body.teaserFeatured;
  if (typeof body.investorScore === "number") patch.investorScore = body.investorScore;

  if (body.reviewStatus === "approved") patch.active = true;

  const deal = await updateBuyerDealAdmin(body.id, patch);
  if (!deal) {
    return NextResponse.json({ ok: false, error: "Deal not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deal });
}
