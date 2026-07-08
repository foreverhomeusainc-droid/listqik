import Link from "next/link";
import { AdminCreateBuyerDealForm } from "@/components/admin/admin-create-buyer-deal-form";

export default function AdminCreateBuyerDealPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link href="/dashboard/admin/buyer-deals" className="text-xs text-emerald-300 hover:underline">
          ← Buyer deals
        </Link>
        <h2 className="mt-2 text-lg font-semibold text-emerald-50">Add buyer deal</h2>
        <p className="mt-1 max-w-2xl text-sm text-white/65">
          Curate a deal card for /buyers — photo, list price, approximate market value, and Deal of
          the Week. No seller MLS compliance or county/legal fields.
        </p>
      </header>
      <AdminCreateBuyerDealForm />
    </div>
  );
}
