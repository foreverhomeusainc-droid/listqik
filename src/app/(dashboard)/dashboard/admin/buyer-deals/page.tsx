import { AdminBuyerDealsConsole } from "@/components/admin/admin-buyer-deals-console";

export default function AdminBuyerDealsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-emerald-50">Buyer MLS deals</h2>
        <p className="mt-1 text-sm text-white/65">
          Review webhook-ingested inventory before it appears in the buyer feed. Comp-only rows stay
          hidden from the feed automatically.
        </p>
      </header>
      <AdminBuyerDealsConsole />
    </div>
  );
}
