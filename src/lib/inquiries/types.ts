import type { BuyerRepresentationIntake } from "@/lib/buyers/representation-intake";

export type SiteInquiryKind = "listing-request" | "comps-request";
export type SiteInquiryStatus = "new" | "contacted" | "closed";

export type ListingContext = {
  slug?: string;
  title?: string;
  city?: string;
  state?: string;
  price?: number;
  url?: string;
};

export type CreateListingInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consent: boolean;
  source?: string;
  listing?: ListingContext;
  buyerRepresentation: BuyerRepresentationIntake;
  utm?: Record<string, string | undefined>;
  userAgent?: string;
};

export type CreateCompsInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  consent: boolean;
  source?: string;
  zip?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  userAgent?: string;
};

export type SiteInquiryRow = {
  id: string;
  kind: SiteInquiryKind;
  status: SiteInquiryStatus;
  source: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  listing: ListingContext | null;
  buyerRepresentation: BuyerRepresentationIntake | null;
  compsRequest: { zip: string; beds: number | null; baths: number | null; sqft: number | null } | null;
  createdAt: string;
};
