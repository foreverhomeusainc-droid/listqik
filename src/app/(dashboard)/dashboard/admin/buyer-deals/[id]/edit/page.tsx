import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBuyerDealForm } from "@/components/admin/admin-buyer-deal-form";
import { getBuyerDealAdminById } from "@/lib/buyers/deals-service";

export default async function AdminEditBuyerDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getBuyerDealAdminById(id);
  if (!deal) notFound();

  return (
    <div className="space-y-6">
      <header>
        <Link href="/dashboard/admin/buyer-deals" className="text-xs text-emerald-300 hover:underline">
          ← Buyer deals
        </Link>
        <h2 className="mt-2 text-lg font-semibold text-emerald-50">Edit buyer deal</h2>
        <p className="mt-1 text-sm text-white/65">
          {deal.city}, {deal.state} {deal.zip}
        </p>
      </header>
      <AdminBuyerDealForm deal={deal} />
    </div>
  );
}
