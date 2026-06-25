import { Schema, model, models } from "mongoose";
import type { CalculatorId } from "@/lib/calculators/types";

const calculatorUsageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
    fingerprintHash: { type: String, required: true, index: true },
    calculatorId: {
      type: String,
      required: true,
      enum: ["fix-and-flip", "rental", "multifamily", "mortgage", "brrrr", "wholesale"],
    },
    usageDate: { type: String, required: true, index: true },
    count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

calculatorUsageSchema.index({ fingerprintHash: 1, calculatorId: 1, usageDate: 1 }, { unique: true });
calculatorUsageSchema.index(
  { userId: 1, calculatorId: 1, usageDate: 1 },
  { unique: true, sparse: true },
);

export const CalculatorUsage =
  models.CalculatorUsage ?? model("CalculatorUsage", calculatorUsageSchema);

export type CalculatorUsageDoc = {
  fingerprintHash: string;
  calculatorId: CalculatorId;
  usageDate: string;
  count: number;
};
