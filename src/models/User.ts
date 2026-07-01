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
    /** Velocity Club — first portal visit */
    velocityClubJoinedAt: { type: Date, default: null },
    investorPersona: {
      type: String,
      enum: ["flipper", "wholesaler", "landlord"],
      default: null,
    },
    loyaltyOnboarding: {
      welcomeComplete: { type: Boolean, default: false },
      personaComplete: { type: Boolean, default: false },
      progressSeen: { type: Boolean, default: false },
      fastTrackUnlockSeen: { type: Boolean, default: false },
    },
    loyaltyEmailDay2SentAt: { type: Date, default: null },
    loyaltyEmailDay3SentAt: { type: Date, default: null },
    /** Granted after first listing goes live; consumed on next finalize */
    loyaltyFastTrackTrialActive: { type: Boolean, default: false },
    loyaltyFastTrackTrialGrantedAt: { type: Date, default: null },
    loyaltyFirstListingLiveAt: { type: Date, default: null },
    /** Buyer representation agreement — required for full MLS buyer deals access */
    buyerRepAcknowledgedAt: { type: Date, default: null },
    buyerRepDocumentVersion: { type: String, default: null },
    savedBuyerDealIds: [{ type: Schema.Types.ObjectId, ref: "MlsBuyerDeal", default: [] }],
  },
  { timestamps: true },
);

export const User = models.User ?? model("User", userSchema);
