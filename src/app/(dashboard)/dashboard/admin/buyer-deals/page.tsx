import Link from "next/link";
import { AdminBuyerDealsConsole } from "@/components/admin/admin-buyer-deals-console";

export default function AdminBuyerDealsPage() {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-emerald-50">Buyer MLS deals</h2>
          <p className="mt-1 text-sm text-white/65">
            Curate deal cards for /buyers or review webhook-ingested MLS inventory.
          </p>
        </div>
        <Link
          href="/dashboard/admin/buyer-deals/new"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          + Add buyer deal
        </Link>
      </header>
      <AdminBuyerDealsConsole />
    </div>
  );
}
