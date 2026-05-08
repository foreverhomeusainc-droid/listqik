import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { connectDb } from "@/lib/mongodb";
import { isAdminEmail } from "@/lib/admin";
import { PlanPurchase } from "@/models/PlanPurchase";
import { UpgradePurchase } from "@/models/UpgradePurchase";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  const actorEmail = session?.user?.email?.trim().toLowerCase();
  if (!actorEmail) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!isAdminEmail(actorEmail)) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  await connectDb();

  const [users, plans, upgrades] = await Promise.all([
    User.find().select("_id email name createdAt").lean(),
    PlanPurchase.find({ status: "ACTIVE" })
      .sort({ purchasedAt: -1, createdAt: -1 })
      .lean(),
    UpgradePurchase.find()
      .sort({ purchasedAt: -1, createdAt: -1 })
      .lean(),
  ]);

  const planByUser = new Map<
    string,
    { planId: string; planName: string; purchasedAt: string | null; externalOrderId: string | null }
  >();

  for (const row of plans) {
    const byUserId = row.userId ? String(row.userId) : "";
    const byEmail = row.purchaserEmail?.trim().toLowerCase() ?? "";
    const payload = {
      planId: row.planId,
      planName: row.planName,
      purchasedAt: row.purchasedAt ? new Date(row.purchasedAt).toISOString() : null,
      externalOrderId: row.externalOrderId ?? null,
    };
    if (byUserId && !planByUser.has(byUserId)) planByUser.set(byUserId, payload);
    if (byEmail && !planByUser.has(byEmail)) planByUser.set(byEmail, payload);
  }

  const upgradesByUser = new Map<
    string,
    { slugs: Set<string>; itemsCount: number; lastPurchasedAt: string | null; orders: string[] }
  >();

  for (const row of upgrades) {
    const keys = [
      row.userId ? String(row.userId) : "",
      row.purchaserEmail?.trim().toLowerCase() ?? "",
      row.externalUserId?.trim() ?? "",
    ].filter(Boolean);
    if (keys.length === 0) continue;

    for (const key of keys) {
      const current =
        upgradesByUser.get(key) ??
        { slugs: new Set<string>(), itemsCount: 0, lastPurchasedAt: null, orders: [] };

      for (const slug of row.upgradeSlugs ?? []) {
        const clean = String(slug ?? "").trim();
        if (clean) current.slugs.add(clean);
      }
      current.itemsCount += Array.isArray(row.items) ? row.items.length : 0;
      const purchasedAtIso = row.purchasedAt ? new Date(row.purchasedAt).toISOString() : null;
      if (purchasedAtIso && (!current.lastPurchasedAt || purchasedAtIso > current.lastPurchasedAt)) {
        current.lastPurchasedAt = purchasedAtIso;
      }
      if (row.externalOrderId) current.orders.push(row.externalOrderId);
      upgradesByUser.set(key, current);
    }
  }

  const rows = users.map((user) => {
    const userId = String(user._id);
    const email = user.email?.trim().toLowerCase() ?? "";
    const plan = planByUser.get(userId) ?? planByUser.get(email) ?? null;
    const upgradesInfo = upgradesByUser.get(userId) ?? upgradesByUser.get(email) ?? null;

    return {
      userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
      plan,
      upgrades: {
        hasPaidUpgrades: Boolean(upgradesInfo && upgradesInfo.slugs.size > 0),
        slugs: upgradesInfo ? [...upgradesInfo.slugs].sort() : [],
        itemsCount: upgradesInfo?.itemsCount ?? 0,
        lastPurchasedAt: upgradesInfo?.lastPurchasedAt ?? null,
        externalOrderIds: upgradesInfo ? [...new Set(upgradesInfo.orders)] : [],
      },
    };
  });

  return NextResponse.json({ ok: true, count: rows.length, rows });
}
