import { AdminInquiriesConsole } from "@/components/admin/admin-inquiries-console";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-emerald-50">Listing &amp; buyer inquiries</h2>
        <p className="mt-1 text-sm text-white/65">
          Requests from public listing pages (with Buyer Representation intake) and manual comps
          leads — stored in your database, not GHL.
        </p>
      </header>
      <AdminInquiriesConsole />
    </div>
  );
}
