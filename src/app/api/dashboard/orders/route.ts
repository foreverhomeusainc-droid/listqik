import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { PlanPurchase } from "@/models/PlanPurchase";
import { UpgradePurchase } from "@/models/UpgradePurchase";

function iso(value: unknown) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  await connectDb();
  const userId = new Types.ObjectId(session.user.id);
  const [listings, plans, upgrades] = await Promise.all([
    Listing.find({ userId }).sort({ createdAt: -1 }).lean(),
    PlanPurchase.find({
      $or: [{ userId }, { purchaserEmail: session.user.email.toLowerCase().trim() }],
    })
      .sort({ purchasedAt: -1 })
      .lean(),
    UpgradePurchase.find({
      $or: [
        { userId },
        { purchaserEmail: session.user.email.toLowerCase().trim() },
        { externalUserId: session.user.id },
      ],
    })
      .sort({ purchasedAt: -1, createdAt: -1 })
      .lean(),
  ]);

  const listingOrders = listings.map((row) => ({
    id: row._id.toString(),
    type: "LISTING_ORDER",
    title: `${row.street}, ${row.city}, ${row.state} ${row.zip}`,
    status: row.status,
    planLabel: row.planLabel ?? "",
    total: row.price ?? null,
    purchasedAt: iso(row.orderedOn ?? row.createdAt),
    listedOn: iso(row.listedOn),
    expiresOn: iso(row.expiresOn),
  }));

  const planOrders = plans.map((row) => ({
    id: row._id.toString(),
    type: "PLAN_PURCHASE",
    title: row.planName,
    status: row.status,
    planLabel: row.planName,
    total: null,
    purchasedAt: iso(row.purchasedAt ?? row.createdAt),
    listedOn: null,
    expiresOn: null,
  }));

  const seenUpgradeOrders = new Set<string>();
  const upgradeOrders = upgrades
    .filter((row) => {
      const key = row.externalOrderId ?? `${row._id.toString()}:fallback`;
      if (seenUpgradeOrders.has(key)) return false;
      seenUpgradeOrders.add(key);
      return true;
    })
    .map((row) => ({
      id: row._id.toString(),
      type: "UPGRADE_PURCHASE",
      title:
        row.upgradeSlugs && row.upgradeSlugs.length > 0
          ? `Upgrades: ${row.upgradeSlugs.join(", ")}`
          : "Upgrade Purchase",
      status: row.paymentStatus || "paid",
      planLabel: "",
      total: row.amountTotal ?? null,
      purchasedAt: iso(row.purchasedAt ?? row.createdAt),
      listedOn: null,
      expiresOn: null,
      upgradeSlugs: row.upgradeSlugs ?? [],
      externalOrderId: row.externalOrderId ?? null,
    }));

  return NextResponse.json({ ok: true, orders: [...upgradeOrders, ...listingOrders, ...planOrders] });
}
