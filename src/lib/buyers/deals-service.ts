import type {
  BuyerDealAdminRow,
  BuyerDealFilters,
  BuyerDealFull,
  BuyerDealReviewStatus,
  BuyerDealTeaser,
} from "@/lib/buyers/types";
import { Types } from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { MlsBuyerDeal } from "@/models/MlsBuyerDeal";
import buyerDealsSeed from "@/data/buyer-deals-seed.json";

/** Comp-only rows stay in DB for comps math but not in buyer feed. */
export function isCompOnlyDeal(tags: string[] | undefined): boolean {
  const t = tags ?? [];
  return t.length > 0 && t.every((tag) => tag === "comp");
}

function feedQuery(extra: Record<string, unknown> = {}) {
  return {
    active: true,
    reviewStatus: "approved",
    ...extra,
  };
}

function mapTeaser(row: {
  _id: { toString(): string };
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  propertyType: string;
  status: string;
  investorTags?: string[];
  publicRemarks?: string;
  heroImageUrl?: string;
  domDays?: number | null;
  investorScore?: number;
  arvEstimate?: number | null;
}): BuyerDealTeaser {
  return {
    id: row._id.toString(),
    city: row.city,
    state: row.state,
    zip: row.zip,
    listPrice: row.listPrice,
    beds: row.beds ?? null,
    baths: row.baths ?? null,
    sqft: row.sqft ?? null,
    propertyType: row.propertyType,
    status: row.status as BuyerDealTeaser["status"],
    investorTags: row.investorTags ?? [],
    publicRemarks: row.publicRemarks ?? "",
    heroImageUrl: row.heroImageUrl ?? "",
    domDays: row.domDays ?? null,
    investorScore: row.investorScore ?? 0,
    arvEstimate: row.arvEstimate ?? null,
  };
}

export function mapFullDeal(row: {
  _id: { toString(): string };
  externalId?: string;
  mlsNumber?: string;
  mlsName?: string;
  street?: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  propertyType: string;
  status: string;
  investorTags?: string[];
  publicRemarks?: string;
  privateRemarks?: string;
  drivingDirections?: string;
  heroImageUrl?: string;
  domDays?: number | null;
  investorScore?: number;
  rentEstimateMonthly?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  syncedAt?: Date | null;
  soldPrice?: number | null;
  soldDate?: Date | null;
  reviewStatus?: string;
  active?: boolean;
  teaserFeatured?: boolean;
}): BuyerDealFull {
  return {
    ...mapTeaser(row),
    mlsNumber: row.mlsNumber ?? "",
    mlsName: row.mlsName ?? "MLS",
    street: row.street ?? "",
    unit: row.unit ?? "",
    privateRemarks: row.privateRemarks ?? "",
    drivingDirections: row.drivingDirections ?? "",
    rentEstimateMonthly: row.rentEstimateMonthly ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    syncedAt: row.syncedAt ? new Date(row.syncedAt).toISOString() : null,
    soldPrice: row.soldPrice ?? null,
    soldDate: row.soldDate ? new Date(row.soldDate).toISOString().slice(0, 10) : null,
  };
}

function mapAdminRow(row: Parameters<typeof mapFullDeal>[0] & { externalId?: string }): BuyerDealAdminRow {
  return {
    ...mapFullDeal(row),
    externalId: row.externalId ?? "",
    reviewStatus: (row.reviewStatus ?? "approved") as BuyerDealReviewStatus,
    active: row.active !== false,
    teaserFeatured: Boolean(row.teaserFeatured),
  };
}

function buildSort(sort: BuyerDealFilters["sort"]): Record<string, 1 | -1> {
  switch (sort) {
    case "price-asc":
      return { listPrice: 1 };
    case "price-desc":
      return { listPrice: -1 };
    case "dom":
      return { domDays: 1, investorScore: -1 };
    default:
      return { investorScore: -1, domDays: 1, listPrice: -1 };
  }
}

function applyClientFilters(deals: BuyerDealFull[], filters: BuyerDealFilters): BuyerDealFull[] {
  let out = deals.filter((d) => !isCompOnlyDeal(d.investorTags));
  if (filters.zip?.trim()) {
    const z = filters.zip.trim();
    out = out.filter((d) => d.zip.startsWith(z));
  }
  if (filters.tag?.trim()) {
    const tag = filters.tag.trim().toLowerCase();
    out = out.filter((d) => d.investorTags.some((t) => t.toLowerCase() === tag));
  }
  if (filters.status) {
    out = out.filter((d) => d.status === filters.status);
  }
  if (typeof filters.minScore === "number") {
    out = out.filter((d) => d.investorScore >= filters.minScore!);
  }
  if (typeof filters.maxPrice === "number" && filters.maxPrice > 0) {
    out = out.filter((d) => d.listPrice <= filters.maxPrice!);
  }
  if (filters.sort === "price-asc") out.sort((a, b) => a.listPrice - b.listPrice);
  else if (filters.sort === "price-desc") out.sort((a, b) => b.listPrice - a.listPrice);
  else if (filters.sort === "dom") out.sort((a, b) => (a.domDays ?? 999) - (b.domDays ?? 999));
  return out;
}

export async function ensureBuyerDealsSeeded(): Promise<void> {
  await connectDb();
  const now = new Date();
  for (const row of buyerDealsSeed.deals) {
    const tags = row.investorTags ?? [];
    const reviewStatus = isCompOnlyDeal(tags) ? "approved" : "approved";
    await MlsBuyerDeal.findOneAndUpdate(
      { externalId: row.externalId },
      {
        $set: {
          ...row,
          active: true,
          reviewStatus,
          syncedAt: now,
        },
      },
      { upsert: true },
    );
  }
}

export async function listTeaserDeals(limit = 6): Promise<BuyerDealTeaser[]> {
  await ensureBuyerDealsSeeded();
  const rows = await MlsBuyerDeal.find({
    ...feedQuery({ status: { $in: ["active", "pending"] } }),
  })
    .sort({ teaserFeatured: -1, investorScore: -1, listPrice: -1 })
    .limit(limit * 2)
    .lean();

  return rows
    .filter((r) => !isCompOnlyDeal(r.investorTags as string[] | undefined))
    .slice(0, limit)
    .map(mapTeaser);
}

export async function listFullDeals(filters: BuyerDealFilters = {}): Promise<BuyerDealFull[]> {
  await ensureBuyerDealsSeeded();
  const query: Record<string, unknown> = { ...feedQuery() };
  if (filters.zip?.trim()) query.zip = new RegExp(`^${filters.zip.trim()}`);
  if (filters.tag?.trim()) query.investorTags = filters.tag.trim().toLowerCase();
  if (filters.status) query.status = filters.status;
  if (typeof filters.minScore === "number") query.investorScore = { $gte: filters.minScore };
  if (typeof filters.maxPrice === "number" && filters.maxPrice > 0) {
    query.listPrice = { ...(query.listPrice as object), $lte: filters.maxPrice };
  }

  const rows = await MlsBuyerDeal.find(query)
    .sort(buildSort(filters.sort))
    .lean();

  const mapped = rows
    .map(mapFullDeal)
    .filter((d) => !isCompOnlyDeal(d.investorTags));

  return filters.sort ? applyClientFilters(mapped, { sort: filters.sort }) : mapped;
}

export async function getFullDealById(id: string): Promise<BuyerDealFull | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  await ensureBuyerDealsSeeded();
  const row = await MlsBuyerDeal.findOne({
    _id: new Types.ObjectId(id),
    active: true,
    reviewStatus: "approved",
  }).lean();
  if (!row || isCompOnlyDeal(row.investorTags as string[] | undefined)) return null;
  return mapFullDeal(row);
}

export async function listDealsByIds(ids: string[]): Promise<BuyerDealFull[]> {
  const objectIds = ids.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  if (objectIds.length === 0) return [];
  await ensureBuyerDealsSeeded();
  const rows = await MlsBuyerDeal.find({
    _id: { $in: objectIds },
    active: true,
    reviewStatus: "approved",
  }).lean();
  return rows
    .filter((r) => !isCompOnlyDeal(r.investorTags as string[] | undefined))
    .map(mapFullDeal);
}

export async function listAdminBuyerDeals(): Promise<BuyerDealAdminRow[]> {
  await ensureBuyerDealsSeeded();
  const rows = await MlsBuyerDeal.find({})
    .sort({ reviewStatus: 1, investorScore: -1, updatedAt: -1 })
    .lean();
  return rows.map(mapAdminRow);
}

export async function updateBuyerDealAdmin(
  id: string,
  patch: Partial<{
    reviewStatus: BuyerDealReviewStatus;
    active: boolean;
    teaserFeatured: boolean;
    investorScore: number;
  }>,
): Promise<BuyerDealAdminRow | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDb();
  const row = await MlsBuyerDeal.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true },
  ).lean();
  return row ? mapAdminRow(row) : null;
}

export async function upsertMlsBuyerDeals(
  deals: Array<Record<string, unknown>>,
): Promise<{ upserted: number; pending: number }> {
  await connectDb();
  const now = new Date();
  let upserted = 0;
  let pending = 0;
  for (const raw of deals) {
    const externalId = String(raw.externalId ?? "").trim();
    if (!externalId) continue;
    const existing = await MlsBuyerDeal.findOne({ externalId }).lean();
    const autoApprove = raw.autoApprove === true || raw.reviewStatus === "approved";
    const reviewStatus = autoApprove
      ? "approved"
      : ((raw.reviewStatus as BuyerDealReviewStatus | undefined) ??
        (existing ? undefined : "pending"));
    const set: Record<string, unknown> = {
      ...raw,
      externalId,
      syncedAt: now,
      active: raw.active !== false,
    };
    if (reviewStatus) set.reviewStatus = reviewStatus;
    if (!existing && !autoApprove) {
      set.reviewStatus = "pending";
      set.active = raw.active === true;
      pending += 1;
    }
    await MlsBuyerDeal.findOneAndUpdate({ externalId }, { $set: set }, { upsert: true, new: true });
    upserted += 1;
  }
  return { upserted, pending };
}

export async function compsPoolForZip(zip: string, excludeId?: string) {
  await ensureBuyerDealsSeeded();
  const filter: Record<string, unknown> = {
    active: true,
    zip,
    sqft: { $gt: 0 },
    $or: [{ soldPrice: { $gt: 0 } }, { listPrice: { $gt: 0 } }],
  };
  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }
  const rows = await MlsBuyerDeal.find(filter)
    .sort({ soldDate: -1, syncedAt: -1 })
    .limit(8)
    .lean();
  return rows;
}

export async function getLatestFeedSyncAt(): Promise<string | null> {
  await ensureBuyerDealsSeeded();
  const row = await MlsBuyerDeal.findOne({ reviewStatus: "approved" })
    .sort({ syncedAt: -1 })
    .select({ syncedAt: 1 })
    .lean();
  return row?.syncedAt ? new Date(row.syncedAt).toISOString() : null;
}
