import Link from "next/link";
import type { AdminPurchaseRow } from "@/lib/admin-purchase-rows";

type AdminPurchaseHistoryTableProps = {
  rows: AdminPurchaseRow[];
  showBuyerColumn?: boolean;
  showProfileLink?: boolean;
};

export function AdminPurchaseHistoryTable({
  rows,
  showBuyerColumn = true,
  showProfileLink = true,
}: AdminPurchaseHistoryTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/30 p-6 text-center text-sm text-white/65">
        No purchases recorded for this account.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
      <table className="min-w-[900px] w-full text-left text-sm text-white/90">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Type</th>
            {showBuyerColumn ? <th className="px-3 py-2">Buyer</th> : null}
            <th className="px-3 py-2">Plan / upgrades</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Coupon</th>
            <th className="px-3 py-2">Payment</th>
            <th className="px-3 py-2">Order ref</th>
            {showProfileLink ? <th className="px-3 py-2">Profile</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10 align-top">
              <td className="whitespace-nowrap px-3 py-2 text-xs text-white/75">
                {row.purchasedAtLabel}
              </td>
              <td className="px-3 py-2">
                <span
                  className={[
                    "inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    row.kind === "plan"
                      ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100"
                      : "border-cyan-400/35 bg-cyan-500/15 text-cyan-100",
                  ].join(" ")}
                >
                  {row.kind}
                </span>
              </td>
              {showBuyerColumn ? (
                <td className="px-3 py-2">
                  <div className="font-medium text-white">{row.userName ?? "—"}</div>
                  <div className="text-xs text-white/55">{row.purchaserEmail}</div>
                </td>
              ) : null}
              <td className="max-w-xs px-3 py-2">
                <div className="font-medium text-emerald-50">{row.summary}</div>
                <div className="mt-0.5 text-xs text-white/55">{row.detail}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-2">{row.amountLabel}</td>
              <td className="px-3 py-2 text-xs">{row.couponCode}</td>
              <td className="px-3 py-2 text-xs capitalize">{row.paymentStatus}</td>
              <td className="max-w-[180px] px-3 py-2">
                <div className="truncate font-mono text-[11px] text-white/55" title={row.orderRef}>
                  {row.orderRef}
                </div>
                {row.checkoutSessionId ? (
                  <Link
                    className="mt-1 inline-block text-[11px] text-cyan-300 underline"
                    href="/dashboard/admin/checkouts"
                    title={row.checkoutSessionId}
                  >
                    Checkouts
                  </Link>
                ) : null}
              </td>
              {showProfileLink ? (
                <td className="px-3 py-2">
                  {row.userId ? (
                    <Link
                      className="text-emerald-300 underline"
                      href={`/dashboard/admin/users/${row.userId}`}
                    >
                      Open
                    </Link>
                  ) : (
                    <span className="text-white/45">—</span>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
