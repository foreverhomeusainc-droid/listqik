export type BuyerDealStatus = "active" | "pending" | "sold";

export type BuyerDealReviewStatus = "pending" | "approved" | "rejected";

export type BuyerDealTeaser = {
  id: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  approximateMarketValue: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  propertyType: string;
  status: BuyerDealStatus;
  investorTags: string[];
  publicRemarks: string;
  heroImageUrl: string;
  additionalPhotoUrls: string[];
  domDays: number | null;
  investorScore: number;
  arvEstimate: number | null;
  dealFeatured: boolean;
};

export type BuyerDealFull = BuyerDealTeaser & {
  mlsNumber: string;
  mlsName: string;
  street: string;
  unit: string;
  privateRemarks: string;
  drivingDirections: string;
  rentEstimateMonthly: number | null;
  latitude: number | null;
  longitude: number | null;
  syncedAt: string | null;
  soldPrice: number | null;
  soldDate: string | null;
};

export type BuyerDealFilters = {
  zip?: string;
  tag?: string;
  status?: BuyerDealStatus;
  minScore?: number;
  maxPrice?: number;
  sort?: "score" | "price-asc" | "price-desc" | "dom";
};

export type BuyerAccess = {
  isAuthenticated: boolean;
  hasBuyerRep: boolean;
  canViewFullDeals: boolean;
  canRunComps: boolean;
};

export type BuyerDealAdminRow = BuyerDealFull & {
  externalId: string;
  reviewStatus: BuyerDealReviewStatus;
  active: boolean;
  /** Shown publicly as Deal of the Week when approximate market value is set. */
  dealFeatured: boolean;
};
