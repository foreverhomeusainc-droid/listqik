import Link from "next/link";
import { AdminCreateListingForm } from "@/components/admin/admin-create-listing-form";

export default function AdminCreateListingPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link href="/dashboard/admin/listings" className="text-xs text-emerald-300 hover:underline">
          ← All listings
        </Link>
        <h2 className="mt-2 text-lg font-semibold text-emerald-50">Add public listing</h2>
        <p className="mt-1 max-w-2xl text-sm text-white/65">
          Create inventory that appears on{" "}
          <a href="/listings" className="text-emerald-300 underline" target="_blank" rel="noreferrer">
            listqik.com/listings
          </a>
          . Seller-paid listings auto-publish when finalized as Active; use this form for admin-curated
          inventory and broker specials.
        </p>
      </header>
      <AdminCreateListingForm />
    </div>
  );
}
