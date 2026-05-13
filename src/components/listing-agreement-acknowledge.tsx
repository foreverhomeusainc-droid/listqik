"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ListingSummary = {
  id: string;
  status?: string;
};

type ListingsResponse = {
  ok?: boolean;
  listings?: ListingSummary[];
  error?: string;
};

/**
 * "I understand" gate shown on /listing-agreement.
 *
 * On acknowledgment we look up the seller's listings and forward them to the
 * first INCOMPLETE setup wizard (or the dashboard if no incomplete listing
 * exists yet). The agreement page itself enforces auth, so an unauthenticated
 * request shouldn't get here.
 */
export function ListingAgreementAcknowledge() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  async function onAcknowledge() {
    if (!confirmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const ackRes = await fetch("/api/auth/acknowledge-user-agreement", { method: "POST" });
      const ackData = (await ackRes.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!ackRes.ok || !ackData?.ok) {
        setError(ackData?.error ?? "Could not record your acknowledgment. Please try again.");
        setBusy(false);
        return;
      }

      const res = await fetch("/api/dashboard/listings", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as ListingsResponse | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not load your listings. Please try again.");
        setBusy(false);
        return;
      }
      const listings = Array.isArray(data.listings) ? data.listings : [];
      const incomplete = listings.find((listing) => listing.status === "INCOMPLETE");
      const target = incomplete ?? listings[0];
      if (target?.id) {
        router.push(`/dashboard/listings/${target.id}/setup`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Network error while recording your acknowledgment. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-4 text-sm text-emerald-50">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-emerald-400"
        />
        <span>
          I have read this User Agreement and understand that ListQik provides marketing &amp;
          technology services while Central Metro Realty is the Broker of Record fulfilling
          brokerage acts under Texas law.
        </span>
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          disabled={!confirmed || busy}
          onClick={() => {
            void onAcknowledge();
          }}
          className="rounded-full border border-emerald-400/60 bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Loading listing setup..." : "I understand — continue to listing setup"}
        </button>
      </div>
    </div>
  );
}
