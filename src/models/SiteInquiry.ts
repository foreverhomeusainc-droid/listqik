import { Schema, model, models } from "mongoose";

const listingContextSchema = new Schema(
  {
    slug: { type: String, default: "" },
    title: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    price: { type: Number, default: null },
    url: { type: String, default: "" },
  },
  { _id: false },
);

const buyerRepSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },
    mailingAddress: { type: String, required: true, trim: true },
    propertyType: { type: String, enum: ["buy", "lease"], required: true },
    representationStart: { type: String, required: true, trim: true },
    representationDuration: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const compsRequestSchema = new Schema(
  {
    zip: { type: String, trim: true, default: "" },
    beds: { type: Number, default: null },
    baths: { type: Number, default: null },
    sqft: { type: Number, default: null },
  },
  { _id: false },
);

const siteInquirySchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["listing-request", "comps-request"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
    source: { type: String, default: "", trim: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, default: "" },
    consent: { type: Boolean, default: false },
    listing: { type: listingContextSchema, default: null },
    buyerRepresentation: { type: buyerRepSchema, default: null },
    compsRequest: { type: compsRequestSchema, default: null },
    utm: { type: Schema.Types.Mixed, default: null },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteInquiry = models.SiteInquiry ?? model("SiteInquiry", siteInquirySchema);
