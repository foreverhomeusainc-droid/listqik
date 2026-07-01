"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CompsAccess } from "@/lib/buyers/comps-access";

export function CompsAccessGate({
  open,
  onClose,
  zip,
  beds,
  baths,
  sqft,
  source,
}: {
  open: boolean;
  onClose: () => void;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  source: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/buyers/comps/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          zip,
          beds,
          baths,
          sqft,
          consent: true,
          source,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not submit request.");
        return;
      }
      setSuccess(data.message ?? "Request received.");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-amber-400/30 bg-[#0a120e] p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-amber-50">Premium feature</h3>
        <p className="mt-2 text-sm text-white/75">
          Sign in with a Syndicate+ Velocity Club account for instant MLS comps — or submit your
          property info below and our team will manually email you custom comps for free!
        </p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/buyers")}`}
          className="mt-4 inline-flex rounded-full border border-sky-400/50 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-50 transition hover:bg-sky-500/30"
        >
          Sign in
        </Link>

        {success ? (
          <p className="mt-4 text-sm text-lime-200">{success}</p>
        ) : (
          <form onSubmit={(e) => void onSubmit(e)} className="mt-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Free manual comps request
            </p>
            <label className="block space-y-1 text-sm">
              <span className="text-white/70">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/70">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
              />
            </label>
            <p className="text-xs text-white/45">
              Property: {zip || "—"} · {beds} bd · {baths} ba · {sqft.toLocaleString()} sqft
            </p>
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full border border-lime-400/50 bg-lime-500/15 px-4 py-2 text-sm font-semibold text-lime-100 disabled:opacity-60"
              >
                {busy ? "Submitting…" : "Email me comps"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function useCompsAccess() {
  const [access, setAccess] = useState<CompsAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/buyers/comps/access", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; access?: CompsAccess };
        if (data.access) setAccess(data.access);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { access, loading };
}
