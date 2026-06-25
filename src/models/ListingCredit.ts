import { Schema, model, models } from "mongoose";

const listingCreditSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bundleSlug: {
      type: String,
      required: true,
      enum: ["pipeline-5", "pipeline-10", "pipeline-25"],
    },
    bundleName: { type: String, required: true, trim: true },
    quantityPurchased: { type: Number, required: true, min: 1 },
    quantityRemaining: { type: Number, required: true, min: 0 },
    amountTotalUsd: { type: Number, default: null },
    purchasedAt: { type: Date, default: Date.now, index: true },
    /** Stripe checkout session id — idempotent fulfillment */
    externalOrderId: { type: String, trim: true, sparse: true, unique: true },
    checkoutSessionId: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);

export const ListingCredit = models.ListingCredit ?? model("ListingCredit", listingCreditSchema);
