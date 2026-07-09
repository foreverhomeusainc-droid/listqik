import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminListingForm, type AdminListingFormData } from "@/components/admin/admin-listing-form";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { Types } from "mongoose";

export default async function AdminEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) notFound();

  await connectDb();
  const listing = await Listing.findById(id).lean();
  if (!listing || !listing.createdByAdmin) notFound();

  const data: AdminListingFormData = {
    id: String(listing._id),
    street: listing.street ?? "",
    unit: listing.unit ?? "",
    city: listing.city ?? "",
    state: listing.state ?? "TX",
    zip: listing.zip ?? "",
    price: listing.price,
    title: listing.title ?? "",
    neighborhood: listing.neighborhood ?? "",
    beds: listing.beds ?? null,
    baths: listing.baths ?? null,
    sqft: listing.sqft ?? null,
    tags: Array.isArray(listing.tags)
      ? listing.tags.filter((t: unknown): t is string => typeof t === "string")
      : [],
    propertyType: listing.propertyType === "CONDOMINIUM" ? "CONDOMINIUM" : "SINGLE_FAMILY",
    status:
      listing.status === "PENDING" || listing.status === "SOLD" ? listing.status : "ACTIVE",
    heroImageUrl: listing.heroImageUrl ?? "",
    additionalPhotoUrls: Array.isArray(listing.additionalPhotoUrls)
      ? listing.additionalPhotoUrls.filter((u: unknown): u is string => typeof u === "string")
      : [],
    publicRemarks: listing.publicRemarks ?? "",
    publishedOnSite: Boolean(listing.publishedOnSite),
    dealOfTheWeek: Boolean(listing.dealOfTheWeek),
    dealOfTheWeekRank:
      typeof listing.dealOfTheWeekRank === "number" ? listing.dealOfTheWeekRank : 0,
  };

  return (
    <div className="space-y-6">
      <header>
        <Link href="/dashboard/admin/listings" className="text-xs text-emerald-300 hover:underline">
          ← All listings
        </Link>
        <h2 className="mt-2 text-lg font-semibold text-emerald-50">Edit admin listing</h2>
        <p className="mt-1 text-sm text-white/65">{data.title || data.street}</p>
      </header>
      <AdminListingForm listing={data} />
    </div>
  );
}
