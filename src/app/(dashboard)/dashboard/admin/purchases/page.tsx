import Link from "next/link";
import { AdminPurchaseHistoryTable } from "@/components/admin/admin-purchase-history-table";
import { buildAdminPurchaseRows } from "@/lib/admin-purchase-rows";
import { connectDb } from "@/lib/mongodb";
import { PlanPurchase } from "@/models/PlanPurchase";
import { UpgradePurchase } from "@/models/UpgradePurchase";
import { User } from "@/models/User";

export default async function AdminPurchasesPage() {
  await connectDb();

  const [plans, upgrades, users] = await Promise.all([
    PlanPurchase.find().sort({ purchasedAt: -1, createdAt: -1 }).lean(),
    UpgradePurchase.find().sort({ purchasedAt: -1, createdAt: -1 }).lean(),
    User.find().select("_id email name").lean(),
  ]);

  const rows = buildAdminPurchaseRows({ plans, upgrades, users });
  const planCount = rows.filter((r) => r.kind === "plan").length;
  const upgradeCount = rows.filter((r) => r.kind === "upgrade").length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-emerald-50">Purchases</h2>
        <p className="text-sm text-white/65">
          All plan checkouts and paid upgrades across the platform, newest first.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <span className="font-semibold text-white/85">{rows.length}</span> total
          </span>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-950/30 px-3 py-1">
            <span className="font-semibold text-emerald-100">{planCount}</span> plans
          </span>
          <span className="rounded-full border border-cyan-500/25 bg-cyan-950/25 px-3 py-1">
            <span className="font-semibold text-cyan-100">{upgradeCount}</span> upgrades
          </span>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-white/15 bg-black/30 p-8 text-center text-sm text-white/65">
          No purchases recorded yet.
        </div>
      ) : (
        <AdminPurchaseHistoryTable rows={rows} />
      )}

      <p className="text-xs text-white/50">
        Coupon codes appear when Stripe or the payment webhook stored them. Older plan purchases may
        show &quot;—&quot; until new checkouts complete after this update.{" "}
        <Link className="text-emerald-300 underline" href="/dashboard/admin/users">
          Manage users
        </Link>
      </p>
    </div>
  );
}
