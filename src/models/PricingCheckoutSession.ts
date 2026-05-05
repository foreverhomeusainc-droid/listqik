import { Schema, model, models } from "mongoose";

const pricingCheckoutSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, trim: true, index: true },
    purchaserEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    planId: { type: String, required: true, trim: true, index: true },
    selectedUpgradeSlugs: { type: [String], default: [] },
    planCheckoutUrl: { type: String, default: null },
    upgradesCheckoutUrl: { type: String, default: null },
    planPaid: { type: Boolean, default: false, index: true },
    upgradesPaid: { type: Boolean, default: false, index: true },
    planExternalOrderId: { type: String, trim: true, default: null },
    upgradesExternalOrderId: { type: String, trim: true, default: null },
    lastWebhookAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const PricingCheckoutSession =
  models.PricingCheckoutSession ?? model("PricingCheckoutSession", pricingCheckoutSessionSchema);

