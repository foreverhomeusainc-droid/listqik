import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/admin-api-auth";
import {
  assignListingSlug,
  publishListingOnSite,
} from "@/lib/listings/public-listings-service";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";

type PatchBody = {
  publishedOnSite?: boolean;
  dealOfTheWeek?: boolean;
  dealOfTheWeekRank?: number;
  dealOfTheWeekUntil?: string | null;
  title?: string;
  neighborhood?: string;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  tags?: string[];
  heroImageUrl?: string;
  publicRemarks?: string;
  status?: "ACTIVE" | "PENDING" | "SOLD" | "INCOMPLETE" | "EXPIRED";
  price?: number;
};

function parseTags(raw: unknown): string[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean)
    .slice(0, 12);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { id } = await ctx.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid listing id." }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  await connectDb();
  const listing = await Listing.findById(id);
  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }

  if (body.title !== undefined) listing.title = body.title.trim();
  if (body.neighborhood !== undefined) listing.neighborhood = body.neighborhood.trim();
  if (body.beds !== undefined) listing.beds = body.beds;
  if (body.baths !== undefined) listing.baths = body.baths;
  if (body.sqft !== undefined) listing.sqft = body.sqft;
  if (body.tags !== undefined) listing.tags = parseTags(body.tags) ?? [];
  if (body.heroImageUrl !== undefined) listing.heroImageUrl = body.heroImageUrl.trim() || undefined;
  if (body.publicRemarks !== undefined) listing.publicRemarks = body.publicRemarks;
  if (body.price !== undefined && body.price > 0) listing.price = body.price;
  if (body.status !== undefined) listing.status = body.status;

  if (body.dealOfTheWeek !== undefined) listing.dealOfTheWeek = body.dealOfTheWeek;
  if (body.dealOfTheWeekRank !== undefined) listing.dealOfTheWeekRank = body.dealOfTheWeekRank;
  if (body.dealOfTheWeekUntil !== undefined) {
    listing.dealOfTheWeekUntil = body.dealOfTheWeekUntil
      ? new Date(body.dealOfTheWeekUntil)
      : null;
  }

  if (body.publishedOnSite !== undefined) {
    listing.publishedOnSite = body.publishedOnSite;
    if (body.publishedOnSite) {
      if (!listing.publishedAt) listing.publishedAt = new Date();
      listing.slug = await assignListingSlug({
        _id: listing._id,
        city: listing.city,
        zip: listing.zip,
        street: listing.street,
        slug: listing.slug,
      });
    } else {
      listing.dealOfTheWeek = false;
      listing.dealOfTheWeekUntil = null;
    }
  }

  if (listing.dealOfTheWeek && !listing.publishedOnSite) {
    listing.publishedOnSite = true;
    if (!listing.publishedAt) listing.publishedAt = new Date();
    listing.slug = await assignListingSlug({
      _id: listing._id,
      city: listing.city,
      zip: listing.zip,
      street: listing.street,
      slug: listing.slug,
    });
  }

  await listing.save();

  if (listing.publishedOnSite && !listing.slug) {
    await publishListingOnSite(listing._id);
  }

  return NextResponse.json({
    ok: true,
    listing: {
      id: String(listing._id),
      slug: listing.slug ?? null,
      publishedOnSite: listing.publishedOnSite,
      dealOfTheWeek: listing.dealOfTheWeek,
      publicUrl: listing.slug && listing.publishedOnSite ? `/listings/${listing.slug}` : null,
    },
  });
}
