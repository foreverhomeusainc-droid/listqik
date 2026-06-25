"use client";

import { useState } from "react";
import type { OnboardingState, InvestorPersona } from "@/lib/loyalty/onboarding";

type Props = {
  onboarding: OnboardingState;
  listingsUntilNext: number | null;
  nextTierName: string | null;
  onUpdated: () => void;
};

const PERSONA_OPTIONS: Array<{ id: InvestorPersona; label: string; hint: string }> = [
  { id: "flipper", label: "Flipper", hint: "Fix-and-flip velocity" },
  { id: "wholesaler", label: "Wholesaler", hint: "Assignment & disposition" },
  { id: "landlord", label: "Landlord", hint: "Rentals & cash flow" },
];

export function VelocityClubOnboarding({ onboarding, listingsUntilNext, nextTierName, onUpdated }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!onboarding.activeStep) return null;

  async function post(action: string, persona?: InvestorPersona) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/velocity-club/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, persona }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save onboarding step.");
        return;
      }
      onUpdated();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-lime-400/25 bg-lime-950/15 p-5 sm:p-6">
      {onboarding.activeStep === "welcome" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300/80">Day 1</p>
          <h3 className="mt-2 text-lg font-semibold text-emerald-50">Welcome to the Inner Circle</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            You stepped out of the traditional 6% trap. Velocity Club tracks your listing velocity,
            defends your margins, and unlocks fast-track perks as your pipeline grows.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>Scout&apos;s Starter Kit: listing checklist + comps workflow (Resources)</li>
            <li>Automated savings tracker on every published listing</li>
            <li>Tier progress tied to rolling 12-month volume + credit bank</li>
          </ul>
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void post("complete_welcome")}
            className="mt-4 rounded-full border border-lime-400/60 bg-lime-500/20 px-4 py-2 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Enter Velocity Club"}
          </button>
        </>
      ) : null}

      {onboarding.activeStep === "persona" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300/80">Day 2</p>
          <h3 className="mt-2 text-lg font-semibold text-emerald-50">What&apos;s your pipeline?</h3>
          <p className="mt-2 text-sm text-white/75">
            We&apos;ll tailor perks and nudges to how you actually move inventory.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {PERSONA_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={busy}
                onClick={() => void post("set_persona", option.id)}
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-left transition hover:border-emerald-400/40 hover:bg-emerald-950/30 disabled:opacity-60"
              >
                <p className="font-semibold text-emerald-100">{option.label}</p>
                <p className="mt-1 text-xs text-white/55">{option.hint}</p>
              </button>
            ))}
          </div>
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
        </>
      ) : null}

      {onboarding.activeStep === "progress" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300/80">Day 3</p>
          <h3 className="mt-2 text-lg font-semibold text-emerald-50">
            {listingsUntilNext !== null && nextTierName
              ? `${listingsUntilNext} effective listing${listingsUntilNext === 1 ? "" : "s"} to ${nextTierName}`
              : "Climb the Velocity tiers"}
          </h3>
          <p className="mt-2 text-sm text-white/75">
            Publish listings or buy pipeline credits to raise your effective count. Volume Velocity
            Syndicate unlocks Fast-Track compliance queueing at 4 effective listings.
          </p>
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void post("mark_progress_seen")}
            className="mt-4 rounded-full border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/30 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Got it"}
          </button>
        </>
      ) : null}

      {onboarding.activeStep === "fast_track_unlock" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300/80">Surprise unlock</p>
          <h3 className="mt-2 text-lg font-semibold text-lime-100">Fast-Track trial granted</h3>
          <p className="mt-2 text-sm text-white/75">
            Your first listing is live. Your <strong className="text-lime-200">next</strong> listing
            will jump the compliance queue automatically.
          </p>
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void post("mark_fast_track_seen")}
            className="mt-4 rounded-full border border-lime-400/60 bg-lime-500/20 px-4 py-2 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Activate my edge"}
          </button>
        </>
      ) : null}
    </section>
  );
}
