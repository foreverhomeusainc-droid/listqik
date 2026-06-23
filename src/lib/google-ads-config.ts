/** Google Ads account / gtag ID (e.g. AW-18257270972). */
export const GOOGLE_ADS_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID?.trim() || "AW-18257270972";

/**
 * Purchase conversion `send_to` (e.g. AW-18257270972/xxxxxxxx).
 * Required in production after creating the Purchase action in the new Google Ads account.
 */
export const GOOGLE_ADS_PURCHASE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim() || "";

export type GoogleAdsPurchasePayload = {
  transactionId: string;
  value: number;
  currency: string;
};
