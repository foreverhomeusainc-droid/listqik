"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyerRepAcknowledge() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  async function onAcknowledge() {
    if (!confirmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/acknowledge-buyer-rep", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string; nextUrl?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not record your acknowledgment.");
        setBusy(false);
        return;
      }
      router.push(data.nextUrl ?? "/dashboard/buyers");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer gap-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 text-sm text-sky-50">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-sky-400"
        />
        <span>
          I authorize Central Metro Realty (Broker) to represent me as a buyer/tenant under Texas
          law, I have reviewed the IABS and Buyer Representation terms above, and I understand
          brokerage duties and fee negotiability.
        </span>
      </label>
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!confirmed || busy}
          onClick={() => void onAcknowledge()}
          className="rounded-full border border-sky-400/60 bg-sky-500/20 px-6 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-500/30 disabled:opacity-60"
        >
          {busy ? "Recording..." : "I agree — unlock buyer deals"}
        </button>
        <Link
          href="/buyers"
          className="inline-flex justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/35"
        >
          Back to teaser
        </Link>
      </div>
    </div>
  );
}
