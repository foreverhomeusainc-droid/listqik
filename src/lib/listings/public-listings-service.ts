import type { Listing as PublicListing, ListingStatus, ListingType } from "@/data/types";
import { buildPublicImageUrl } from "@/lib/r2";
import { slugifyListingParts } from "@/lib/listings/listing-slug";
import { isPlaceholderListing } from "@/lib/listings/placeholder-listings";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import type { Types } from "mongoose";

export type MongoListingDoc = {
  _id: Types.ObjectId;
  slug?: string | null;
  title?: string | null;
  street: string;
  unit?: string | null;
  city: string;
  state: string;
  zip: string;
  neighborhood?: string | null;
  price: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  status: "INCOMPLETE" | "ACTIVE" | "PENDING" | "EXPIRED" | "SOLD";
  propertyType?: "SINGLE_FAMILY" | "CONDOMINIUM" | null;
  publishedOnSite?: boolean;
  dealOfTheWeek?: boolean;
  dealOfTheWeekRank?: number | null;
  dealOfTheWeekUntil?: Date | null;
  tags?: string[];
  heroImageUrl?: string | null;
  additionalPhotoUrls?: string[];
  publicRemarks?: string | null;
  description?: string | null;
};

function resolveImageSrc(url: string | null | undefined): string {
  const raw = (url ?? "").trim();
  if (!raw) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  }
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }
  return buildPublicImageUrl(raw);
}

function mapStatus(status: MongoListingDoc["status"]): ListingStatus {
  if (status === "PENDING") return "pending";
  if (status === "SOLD") return "sold";
  return "active";
}

function mapPropertyType(pt?: string | null): ListingType {
  if (pt === "CONDOMINIUM") return "condo";
  return "single-family";
}

function listingTitle(doc: MongoListingDoc): string {
  if (doc.title?.trim()) return doc.title.trim();
  const street = doc.street.trim();
  if (street) {
    const parts = street.split(/\s+/);
    if (parts.length >= 2) return parts.slice(1).join(" ") || street;
    return street;
  }
  return `${doc.city} Home`;
}

export function mapMongoListingToPublic(doc: MongoListingDoc): PublicListing | null {
  if (isPlaceholderListing(doc)) return null;
  if (!doc.publishedOnSite) return null;
  if (!["ACTIVE", "PENDING", "SOLD"].includes(doc.status)) return null;

  const slug =
    doc.slug?.trim() ||
    slugifyListingParts({
      city: doc.city,
      zip: doc.zip,
      street: doc.street,
      id: String(doc._id),
    });

  const summary =
    (doc.publicRemarks ?? "").trim() ||
    (doc.description ?? "").trim() ||
    `Listing in ${doc.city}, ${doc.state}.`;

  const heroSrc = resolveImageSrc(doc.heroImageUrl);
  const gallery = (doc.additionalPhotoUrls ?? [])
    .filter((u) => typeof u === "string" && u.trim())
    .slice(0, 8)
    .map((u) => ({
      src: resolveImageSrc(u),
      alt: listingTitle(doc),
    }));

  return {
    slug,
    title: listingTitle(doc),
    city: doc.city,
    state: "TX",
    neighborhood: doc.neighborhood?.trim() || doc.zip,
    price: doc.price,
    beds: doc.beds ?? undefined,
    baths: doc.baths ?? undefined,
    sqft: doc.sqft ?? undefined,
    status: mapStatus(doc.status),
    type: mapPropertyType(doc.propertyType),
    featured: Boolean(doc.dealOfTheWeek),
    tags: Array.isArray(doc.tags) ? doc.tags.filter((t) => typeof t === "string" && t.trim()) : [],
    heroImage: {
      src: heroSrc,
      alt: listingTitle(doc),
    },
    gallery: gallery.length ? gallery : undefined,
    summary,
  };
}

function dealOfWeekFilter() {
  const now = new Date();
  return {
    publishedOnSite: true,
    dealOfTheWeek: true,
    status: { $in: ["ACTIVE", "PENDING"] },
    $or: [{ dealOfTheWeekUntil: null }, { dealOfTheWeekUntil: { $gte: now } }],
  };
}

export async function listPublishedListings(): Promise<PublicListing[]> {
  await connectDb();
  const docs = await Listing.find({
    publishedOnSite: true,
    status: { $in: ["ACTIVE", "PENDING", "SOLD"] },
  })
    .sort({ dealOfTheWeek: -1, dealOfTheWeekRank: -1, listedOn: -1, updatedAt: -1 })
    .lean<MongoListingDoc[]>();

  const mapped = docs
    .map((d) => mapMongoListingToPublic(d))
    .filter((l): l is PublicListing => l !== null);

  return mapped;
}

export async function listDealsOfTheWeek(limit = 4): Promise<PublicListing[]> {
  await connectDb();
  const docs = await Listing.find(dealOfWeekFilter())
    .sort({ dealOfTheWeekRank: -1, updatedAt: -1 })
    .limit(limit)
    .lean<MongoListingDoc[]>();

  const mapped = docs
    .map((d) => mapMongoListingToPublic(d))
    .filter((l): l is PublicListing => l !== null);

  return mapped;
}

export async function getPublishedListingBySlug(slug: string): Promise<PublicListing | null> {
  await connectDb();
  const doc = await Listing.findOne({
    slug,
    publishedOnSite: true,
    status: { $in: ["ACTIVE", "PENDING", "SOLD"] },
  }).lean<MongoListingDoc | null>();

  if (doc) {
    return mapMongoListingToPublic(doc);
  }

  return null;
}

export async function ensureUniqueListingSlug(
  base: string,
  excludeId?: Types.ObjectId,
): Promise<string> {
  let candidate = base.slice(0, 120);
  let n = 0;
  for (;;) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Listing.exists(query);
    if (!exists) return candidate;
    n += 1;
    candidate = `${base.slice(0, 110)}-${n}`;
  }
}

export async function assignListingSlug(
  listing: { _id: Types.ObjectId; city: string; zip: string; street: string; slug?: string | null },
): Promise<string> {
  if (listing.slug?.trim()) return listing.slug.trim();
  const base = slugifyListingParts({
    city: listing.city,
    zip: listing.zip,
    street: listing.street,
    id: String(listing._id),
  });
  return ensureUniqueListingSlug(base, listing._id);
}

/** Call when a listing should appear on listqik.com/listings */
export async function publishListingOnSite(listingId: Types.ObjectId): Promise<void> {
  const listing = await Listing.findById(listingId);
  if (!listing) return;

  listing.publishedOnSite = true;
  if (!listing.publishedAt) listing.publishedAt = new Date();
  listing.slug = await assignListingSlug({
    _id: listing._id,
    city: listing.city,
    zip: listing.zip,
    street: listing.street,
    slug: listing.slug,
  });
  await listing.save();
}
