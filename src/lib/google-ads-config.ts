/** Google Ads account / gtag ID (e.g. AW-18257270972). */
export const GOOGLE_ADS_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID?.trim() || "AW-18257270972";

/**
 * Purchase conversion `send_to` (e.g. AW-18257270972/mGuxCOrF0cMcELyx34FE).
 * Override with NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO if the label changes in Google Ads.
 */
export const GOOGLE_ADS_PURCHASE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() ||
  "AW-18257270972/mGuxCOrF0cMcELyx34FE";

export type GoogleAdsPurchasePayload = {
  transactionId: string;
  value: number;
  currency: string;
};
