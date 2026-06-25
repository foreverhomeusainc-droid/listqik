/** Subsonic plan defaults used in calculator comparisons */
export const SUBSONIC_UPFRONT_USD = 79;
export const SUBSONIC_CLOSE_FEE_PCT = 0.005;
export const TRADITIONAL_LISTING_COMMISSION_PCT = 0.03;

export function listQikListingFeeUsd(salePrice: number): number {
  const price = Math.max(0, salePrice);
  return SUBSONIC_UPFRONT_USD + price * SUBSONIC_CLOSE_FEE_PCT;
}

export function traditionalListingCommissionUsd(salePrice: number): number {
  return Math.max(0, salePrice) * TRADITIONAL_LISTING_COMMISSION_PCT;
}

export function listQikSavingsUsd(salePrice: number): number {
  return Math.max(0, traditionalListingCommissionUsd(salePrice) - listQikListingFeeUsd(salePrice));
}
