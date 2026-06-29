"use client";

import { useState } from "react";
import type { CompsResult } from "@/lib/buyers/comps";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function CompsTool({ initialZip = "" }: { initialZip?: string }) {
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(1600);
  const [zip, setZip] = useState(initialZip);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompsResult | null>(null);

  async function onRun() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/buyers/comps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beds, baths, sqft, zip }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        repUrl?: string;
        result?: CompsResult;
      };
      if (!res.ok || !data.ok || !data.result) {
        setError(data.error ?? "Could not run comps.");
        if (data.repUrl) window.location.href = data.repUrl;
        setBusy(false);
        return;
      }
      setResult(data.result);
    } catch {
      setError("Network error while running comps.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-black/45 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Comps engine
          </p>
          <h2 className="mt-1 text-xl font-semibold text-emerald-50">Run MLS-backed comparables</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">ZIP</span>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
            placeholder="75206"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Beds</span>
          <input
            type="number"
            min={0}
            value={beds}
            onChange={(e) => setBeds(Number(e.target.value))}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Baths</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={baths}
            onChange={(e) => setBaths(Number(e.target.value))}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
          />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="text-white/70">Sqft</span>
          <input
            type="number"
            min={1}
            value={sqft}
            onChange={(e) => setSqft(Number(e.target.value))}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-emerald-50"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

      <button
        type="button"
        disabled={busy}
        onClick={() => void onRun()}
        className="mt-4 rounded-full border border-lime-400/60 bg-lime-500/20 px-5 py-2.5 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
      >
        {busy ? "Running comps..." : "Run comps"}
      </button>

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Suggested value</p>
              <p className="mt-1 text-2xl font-semibold text-lime-300">{money(result.suggestedValue)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Median $/sqft</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-100">{money(result.pricePerSqftMedian)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Comp range</p>
              <p className="mt-1 text-lg font-semibold text-emerald-100">
                {money(result.adjustedRangeLow)} – {money(result.adjustedRangeHigh)}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-wide text-white/50">
                <tr>
                  <th className="px-3 py-2">Comp</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Sqft</th>
                  <th className="px-3 py-2">Adjusted</th>
                  <th className="px-3 py-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.id} className="border-t border-white/5 text-white/80">
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="px-3 py-2 font-mono">{money(row.price)}</td>
                    <td className="px-3 py-2 font-mono">{row.sqft.toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-lime-200">{money(row.adjustedValue)}</td>
                    <td className="px-3 py-2">{row.weightPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
