/** Google Ads account / gtag ID (e.g. AW-18163123085). */
export const GOOGLE_ADS_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID?.trim() || "AW-18163123085";

/**
 * Purchase conversion `send_to` (e.g. AW-18163123085/xcP3CPX7j60cEI2H7dRD).
 * Set NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO in production if the label changes in Google Ads.
 */
export const GOOGLE_ADS_PURCHASE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() ||
  "AW-18163123085/xcP3CPX7j60cEI2H7dRD";

export type GoogleAdsPurchasePayload = {
  transactionId: string;
  value: number;
  currency: string;
};
