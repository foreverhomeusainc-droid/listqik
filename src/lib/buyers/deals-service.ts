import type { BuyerDealFull, BuyerDealTeaser } from "@/lib/buyers/types";
import { Types } from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { MlsBuyerDeal } from "@/models/MlsBuyerDeal";
import buyerDealsSeed from "@/data/buyer-deals-seed.json";

type SeedRow = (typeof buyerDealsSeed.deals)[number];

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
  };
}

export function mapFullDeal(row: {
  _id: { toString(): string };
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
  };
}

export async function ensureBuyerDealsSeeded(): Promise<void> {
  await connectDb();
  const count = await MlsBuyerDeal.countDocuments();
  if (count > 0) return;

  const now = new Date();
  await MlsBuyerDeal.insertMany(
    buyerDealsSeed.deals.map((row: SeedRow) => ({
      ...row,
      active: true,
      syncedAt: now,
    })),
  );
}

export async function listTeaserDeals(limit = 6): Promise<BuyerDealTeaser[]> {
  await ensureBuyerDealsSeeded();
  const rows = await MlsBuyerDeal.find({ active: true, status: { $in: ["active", "pending"] } })
    .sort({ teaserFeatured: -1, investorScore: -1, listPrice: -1 })
    .limit(limit)
    .lean();
  return rows.map(mapTeaser);
}

export async function listFullDeals(): Promise<BuyerDealFull[]> {
  await ensureBuyerDealsSeeded();
  const rows = await MlsBuyerDeal.find({ active: true })
    .sort({ investorScore: -1, domDays: 1, listPrice: -1 })
    .lean();
  return rows.map(mapFullDeal);
}

export async function upsertMlsBuyerDeals(
  deals: Array<Record<string, unknown>>,
): Promise<{ upserted: number }> {
  await connectDb();
  const now = new Date();
  let upserted = 0;
  for (const raw of deals) {
    const externalId = String(raw.externalId ?? "").trim();
    if (!externalId) continue;
    await MlsBuyerDeal.findOneAndUpdate(
      { externalId },
      {
        $set: {
          ...raw,
          externalId,
          syncedAt: now,
          active: raw.active !== false,
        },
      },
      { upsert: true, new: true },
    );
    upserted += 1;
  }
  return { upserted };
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
