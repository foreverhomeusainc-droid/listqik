export type BuyerDealStatus = "active" | "pending" | "sold";

export type BuyerDealTeaser = {
  id: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  propertyType: string;
  status: BuyerDealStatus;
  investorTags: string[];
  publicRemarks: string;
  heroImageUrl: string;
  domDays: number | null;
  investorScore: number;
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
};

export type BuyerAccess = {
  isAuthenticated: boolean;
  hasBuyerRep: boolean;
  canViewFullDeals: boolean;
  canRunComps: boolean;
};
