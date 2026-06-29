import { Schema, model, models } from "mongoose";
import { ALL_CALCULATOR_IDS } from "@/lib/calculators/types";

const calculatorDealDraftSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    calculatorId: {
      type: String,
      required: true,
      enum: ALL_CALCULATOR_IDS,
    },
    listingKind: { type: String, enum: ["sale", "rental"], default: "sale" },
    street: { type: String, trim: true, default: "" },
    unit: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "Texas" },
    zip: { type: String, trim: true, default: "" },
    price: { type: Number, default: null },
    propertyType: { type: String, default: "SINGLE_FAMILY" },
    payload: { type: Schema.Types.Mixed, default: {} },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const CalculatorDealDraft =
  models.CalculatorDealDraft ?? model("CalculatorDealDraft", calculatorDealDraftSchema);
