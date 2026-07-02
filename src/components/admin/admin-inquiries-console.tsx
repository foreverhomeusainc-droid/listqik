"use client";

import { useEffect, useState } from "react";
import { REPRESENTATION_DURATION_OPTIONS } from "@/lib/buyers/representation-intake";
import type { SiteInquiryKind, SiteInquiryRow, SiteInquiryStatus } from "@/lib/inquiries/types";

function durationLabel(value: string) {
  return REPRESENTATION_DURATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminInquiriesConsole({ initialKind }: { initialKind?: SiteInquiryKind | "all" }) {
  const [filter, setFilter] = useState<SiteInquiryKind | "all">(initialKind ?? "all");
  const [inquiries, setInquiries] = useState<SiteInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(kind: SiteInquiryKind | "all") {
    setLoading(true);
    const q = kind === "all" ? "" : `?kind=${kind}`;
    const res = await fetch(`/api/admin/inquiries${q}`, { cache: "no-store" });
    const data = (await res.json()) as { ok?: boolean; inquiries?: SiteInquiryRow[] };
    setInquiries(data.inquiries ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load(filter);
  }, [filter]);

  async function setStatus(id: string, status: SiteInquiryStatus) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json()) as { ok?: boolean; inquiry?: SiteInquiryRow };
      if (data.ok && data.inquiry) {
        setInquiries((rows) => rows.map((r) => (r.id === id ? data.inquiry! : r)));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "listing-request", "comps-request"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              filter === key
                ? "border border-emerald-400/50 bg-emerald-500/15 text-emerald-50"
                : "border border-white/15 text-white/60 hover:border-white/30"
            }`}
          >
            {key === "all" ? "All" : key === "listing-request" ? "Listing + buyer rep" : "Comps"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load(filter)}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80"
        >
          Refresh
        </button>
      </div>

      {loading ? <p className="text-sm text-white/50">Loading inquiries…</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/15 bg-black/30">
        <table className="min-w-full text-left text-sm text-white/90">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/70">
            <tr>
              <th className="px-3 py-2">Received</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((row) => (
              <tr key={row.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-3 whitespace-nowrap text-xs">{formatDate(row.createdAt)}</td>
                <td className="px-3 py-3 text-xs capitalize">{row.kind.replace("-", " ")}</td>
                <td className="px-3 py-3">
                  <p className="font-medium text-emerald-50">{row.name}</p>
                  <p className="text-xs text-white/60">{row.email}</p>
                  {row.phone ? <p className="text-xs text-white/50">{row.phone}</p> : null}
                </td>
                <td className="px-3 py-3 max-w-md text-xs text-white/75">
                  {row.listing?.title ? (
                    <p>
                      <span className="text-white/50">Listing: </span>
                      {row.listing.title}
                      {row.listing.city ? ` · ${row.listing.city}` : ""}
                    </p>
                  ) : null}
                  {row.message ? <p className="mt-1">{row.message}</p> : null}
                  {row.buyerRepresentation ? (
                    <div className="mt-2 space-y-0.5 rounded-lg border border-sky-400/20 bg-sky-950/20 p-2">
                      <p className="font-semibold text-sky-100/90">Buyer rep intake</p>
                      <p>
                        {row.buyerRepresentation.city}, {row.buyerRepresentation.zip} ·{" "}
                        {row.buyerRepresentation.propertyType}
                      </p>
                      <p>{row.buyerRepresentation.mailingAddress}</p>
                      <p>
                        Start {row.buyerRepresentation.representationStart} ·{" "}
                        {durationLabel(row.buyerRepresentation.representationDuration)}
                      </p>
                    </div>
                  ) : null}
                  {row.compsRequest ? (
                    <p className="mt-1">
                      Comps: {row.compsRequest.zip} · {row.compsRequest.beds} bd ·{" "}
                      {row.compsRequest.baths} ba · {row.compsRequest.sqft?.toLocaleString()} sqft
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  <select
                    value={row.status}
                    disabled={busyId === row.id}
                    onChange={(e) => void setStatus(row.id, e.target.value as SiteInquiryStatus)}
                    className="rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-xs text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && inquiries.length === 0 ? (
          <p className="p-6 text-sm text-white/50">No inquiries yet.</p>
        ) : null}
      </div>
    </div>
  );
}
