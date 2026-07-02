import { connectDb } from "@/lib/mongodb";
import type {
  CreateCompsInquiryInput,
  CreateListingInquiryInput,
  SiteInquiryRow,
  SiteInquiryStatus,
} from "@/lib/inquiries/types";
import { SiteInquiry } from "@/models/SiteInquiry";

function mapRow(doc: {
  _id: { toString(): string };
  kind: string;
  status: string;
  source?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  listing?: Record<string, unknown> | null;
  buyerRepresentation?: Record<string, unknown> | null;
  compsRequest?: { zip?: string; beds?: number | null; baths?: number | null; sqft?: number | null } | null;
  createdAt?: Date;
}): SiteInquiryRow {
  return {
    id: doc._id.toString(),
    kind: doc.kind as SiteInquiryRow["kind"],
    status: doc.status as SiteInquiryStatus,
    source: doc.source ?? "",
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? "",
    message: doc.message ?? "",
    listing: (doc.listing as SiteInquiryRow["listing"]) ?? null,
    buyerRepresentation: (doc.buyerRepresentation as SiteInquiryRow["buyerRepresentation"]) ?? null,
    compsRequest: doc.compsRequest
      ? {
          zip: doc.compsRequest.zip ?? "",
          beds: doc.compsRequest.beds ?? null,
          baths: doc.compsRequest.baths ?? null,
          sqft: doc.compsRequest.sqft ?? null,
        }
      : null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function createListingInquiry(input: CreateListingInquiryInput): Promise<SiteInquiryRow> {
  await connectDb();
  const row = await SiteInquiry.create({
    kind: "listing-request",
    status: "new",
    source: input.source ?? "listing-detail",
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() ?? "",
    message: input.message?.trim() ?? "",
    consent: input.consent,
    listing: input.listing ?? null,
    buyerRepresentation: input.buyerRepresentation,
    utm: input.utm ?? null,
    userAgent: input.userAgent ?? "",
  });
  return mapRow(row.toObject());
}

export async function createCompsInquiry(input: CreateCompsInquiryInput): Promise<SiteInquiryRow> {
  await connectDb();
  const row = await SiteInquiry.create({
    kind: "comps-request",
    status: "new",
    source: input.source ?? "comps-request",
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() ?? "",
    message: "",
    consent: input.consent,
    compsRequest: {
      zip: input.zip ?? "",
      beds: input.beds ?? null,
      baths: input.baths ?? null,
      sqft: input.sqft ?? null,
    },
    userAgent: input.userAgent ?? "",
  });
  return mapRow(row.toObject());
}

export async function listSiteInquiries(kind?: SiteInquiryRow["kind"]): Promise<SiteInquiryRow[]> {
  await connectDb();
  const filter = kind ? { kind } : {};
  const rows = await SiteInquiry.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  return rows.map(mapRow);
}

export async function updateSiteInquiryStatus(
  id: string,
  status: SiteInquiryStatus,
): Promise<SiteInquiryRow | null> {
  await connectDb();
  const row = await SiteInquiry.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
  return row ? mapRow(row) : null;
}
