import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    purchasedUpgradeSlugs: { type: [String], default: [] },
    /** Set when account is created from a paid order; cleared after password is chosen. */
    passwordSetupTokenSha256: { type: String, trim: true, sparse: true, index: true },
    passwordSetupExpiresAt: { type: Date },
    /**
     * Timestamp of the user's one-time acknowledgment of the ListQik User Agreement.
     * Required before they can access /dashboard listing flows.
     */
    userAgreementAcknowledgedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = models.User ?? model("User", userSchema);
