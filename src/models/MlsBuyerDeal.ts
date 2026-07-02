import { Schema, model, models } from "mongoose";

const mlsBuyerDealSchema = new Schema(
  {
    externalId: { type: String, required: true, unique: true, trim: true, index: true },
    mlsNumber: { type: String, trim: true, default: "" },
    mlsName: { type: String, trim: true, default: "MLS" },
    street: { type: String, trim: true, default: "" },
    unit: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, default: "Texas" },
    zip: { type: String, trim: true, required: true, index: true },
    listPrice: { type: Number, required: true, min: 0 },
    /** Buyer-facing value anchor — set in admin after comps/market review. */
    approximateMarketValue: { type: Number, default: null },
    arvEstimate: { type: Number, default: null },
    beds: { type: Number, default: null },
    baths: { type: Number, default: null },
    sqft: { type: Number, default: null },
    propertyType: {
      type: String,
      enum: ["single-family", "condo", "townhome", "multi-family", "other"],
      default: "single-family",
    },
    status: {
      type: String,
      enum: ["active", "pending", "sold"],
      default: "active",
      index: true,
    },
    domDays: { type: Number, default: null },
    rentEstimateMonthly: { type: Number, default: null },
    investorScore: { type: Number, default: 0, index: true },
    investorTags: { type: [String], default: [] },
    teaserFeatured: { type: Boolean, default: false, index: true },
    publicRemarks: { type: String, default: "" },
    privateRemarks: { type: String, default: "" },
    drivingDirections: { type: String, default: "" },
    heroImageUrl: { type: String, trim: true, default: "" },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    soldPrice: { type: Number, default: null },
    soldDate: { type: Date, default: null },
    active: { type: Boolean, default: true, index: true },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
    syncedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const MlsBuyerDeal =
  models.MlsBuyerDeal ?? model("MlsBuyerDeal", mlsBuyerDealSchema);
