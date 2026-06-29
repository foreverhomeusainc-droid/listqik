import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/admin-api-auth";
import {
  assignListingSlug,
  publishListingOnSite,
} from "@/lib/listings/public-listings-service";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";

type CreateBody = {
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: number;
  title?: string;
  neighborhood?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  tags?: string[];
  propertyType?: "SINGLE_FAMILY" | "CONDOMINIUM";
  status?: "ACTIVE" | "PENDING" | "SOLD";
  heroImageUrl?: string;
  publicRemarks?: string;
  publishedOnSite?: boolean;
  dealOfTheWeek?: boolean;
  dealOfTheWeekRank?: number;
};

function parseTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean)
    .slice(0, 12);
}

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  await connectDb();
  const listings = await Listing.find()
    .sort({ publishedOnSite: -1, dealOfTheWeek: -1, updatedAt: -1 })
    .select(
      "_id street city state zip price status publishedOnSite dealOfTheWeek slug title heroImageUrl createdByAdmin",
    )
    .lean();

  return NextResponse.json({ ok: true, listings });
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const street = body.street?.trim() ?? "";
  const city = body.city?.trim() ?? "";
  const zip = body.zip?.trim() ?? "";
  const price = body.price;

  if (!street || !city || !zip) {
    return NextResponse.json(
      { ok: false, error: "Street, city, and ZIP are required." },
      { status: 400 },
    );
  }
  if (typeof price !== "number" || price <= 0) {
    return NextResponse.json({ ok: false, error: "Valid price is required." }, { status: 400 });
  }

  await connectDb();
  const userId = new Types.ObjectId(auth.session.user.id);
  const publish = body.publishedOnSite !== false;

  const listing = await Listing.create({
    userId,
    street,
    unit: body.unit?.trim() || undefined,
    city,
    state: (body.state?.trim() || "TX").toUpperCase(),
    zip,
    price,
    title: body.title?.trim() || "",
    neighborhood: body.neighborhood?.trim() || "",
    beds: typeof body.beds === "number" ? body.beds : null,
    baths: typeof body.baths === "number" ? body.baths : null,
    sqft: typeof body.sqft === "number" ? body.sqft : null,
    tags: parseTags(body.tags),
    propertyType: body.propertyType === "CONDOMINIUM" ? "CONDOMINIUM" : "SINGLE_FAMILY",
    status: body.status === "PENDING" || body.status === "SOLD" ? body.status : "ACTIVE",
    heroImageUrl: body.heroImageUrl?.trim() || undefined,
    publicRemarks: body.publicRemarks?.trim() || "",
    publishedOnSite: publish,
    publishedAt: publish ? new Date() : null,
    dealOfTheWeek: Boolean(body.dealOfTheWeek),
    dealOfTheWeekRank: typeof body.dealOfTheWeekRank === "number" ? body.dealOfTheWeekRank : 0,
    setupFinalizedAt: new Date(),
    listedOn: new Date(),
    createdByAdmin: true,
    planLabel: "Admin inventory",
  });

  listing.slug = await assignListingSlug({
    _id: listing._id,
    city: listing.city,
    zip: listing.zip,
    street: listing.street,
  });
  await listing.save();

  if (publish) {
    await publishListingOnSite(listing._id);
  }

  return NextResponse.json({
    ok: true,
    listingId: String(listing._id),
    slug: listing.slug,
    publicUrl: `/listings/${listing.slug}`,
  });
}
