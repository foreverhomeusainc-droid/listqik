import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api-auth";
import { parseAdminPhotoUrls } from "@/lib/admin-photo-urls";
import { createBuyerDealAdmin, listAdminBuyerDeals, updateBuyerDealAdmin } from "@/lib/buyers/deals-service";
import type { BuyerDealReviewStatus, BuyerDealStatus } from "@/lib/buyers/types";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const deals = await listAdminBuyerDeals();
  return NextResponse.json({ ok: true, deals });
}

type CreateBody = {
  city?: string;
  state?: string;
  zip?: string;
  listPrice?: number;
  approximateMarketValue?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  investorTags?: string[];
  publicRemarks?: string;
  heroImageUrl?: string;
  additionalPhotoUrls?: string[];
  status?: BuyerDealStatus;
  dealFeatured?: boolean;
  domDays?: number | null;
  street?: string;
  propertyType?: "single-family" | "condo" | "townhome" | "multi-family" | "other";
};

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const city = body.city?.trim() ?? "";
  const zip = body.zip?.trim() ?? "";
  if (!city || !zip) {
    return NextResponse.json({ ok: false, error: "City and ZIP are required." }, { status: 400 });
  }
  if (typeof body.listPrice !== "number" || body.listPrice <= 0) {
    return NextResponse.json({ ok: false, error: "Valid list price is required." }, { status: 400 });
  }
  if (!body.heroImageUrl?.trim()) {
    return NextResponse.json({ ok: false, error: "Hero image is required." }, { status: 400 });
  }

  const tags = Array.isArray(body.investorTags)
    ? body.investorTags.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean)
    : [];

  const deal = await createBuyerDealAdmin({
    city,
    state: body.state,
    zip,
    listPrice: body.listPrice,
    approximateMarketValue: body.approximateMarketValue,
    beds: body.beds,
    baths: body.baths,
    sqft: body.sqft,
    investorTags: tags,
    publicRemarks: body.publicRemarks,
    heroImageUrl: body.heroImageUrl,
    additionalPhotoUrls: parseAdminPhotoUrls(body.additionalPhotoUrls),
    status: body.status,
    dealFeatured: body.dealFeatured,
    domDays: body.domDays,
    street: body.street,
    propertyType: body.propertyType,
  });

  return NextResponse.json({ ok: true, deal });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: {
    id?: string;
    reviewStatus?: BuyerDealReviewStatus;
    active?: boolean;
    dealFeatured?: boolean;
    approximateMarketValue?: number | null;
    investorScore?: number;
    heroImageUrl?: string;
    additionalPhotoUrls?: string[];
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
  if (typeof body.dealFeatured === "boolean") patch.dealFeatured = body.dealFeatured;
  if (body.approximateMarketValue === null) patch.approximateMarketValue = null;
  else if (typeof body.approximateMarketValue === "number" && body.approximateMarketValue > 0) {
    patch.approximateMarketValue = Math.round(body.approximateMarketValue);
  }
  if (typeof body.investorScore === "number") patch.investorScore = body.investorScore;
  if (body.heroImageUrl !== undefined) {
    const hero = body.heroImageUrl.trim();
    if (!hero) {
      return NextResponse.json({ ok: false, error: "Hero image is required." }, { status: 400 });
    }
    patch.heroImageUrl = hero;
  }
  if (body.additionalPhotoUrls !== undefined) {
    patch.additionalPhotoUrls = parseAdminPhotoUrls(body.additionalPhotoUrls);
  }

  if (body.reviewStatus === "approved") patch.active = true;

  const deal = await updateBuyerDealAdmin(body.id, patch);
  if (!deal) {
    return NextResponse.json({ ok: false, error: "Deal not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deal });
}
