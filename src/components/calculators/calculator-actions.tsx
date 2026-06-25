"use client";

import Link from "next/link";
import { useState } from "react";
import type { CalculatorAccess } from "@/lib/calculators/access";
import type { CalculatorAddressState } from "@/components/calculators/calculator-shell";
import { exportDealMemoPdf, pushDealToListing, type PushListingPayload } from "@/components/calculators/use-calculator-access";

export function CalculatorActions({
  calculatorSlug,
  access,
  listingKind = "sale",
  price,
  propertyType,
  address,
  pushPayload,
  pdfInputs,
  pdfOutputs,
}: {
  calculatorSlug: string;
  access: CalculatorAccess | null;
  listingKind?: "sale" | "rental";
  price?: number;
  propertyType?: string;
  address?: Pick<CalculatorAddressState, "street" | "unit" | "city" | "state" | "zip">;
  pushPayload?: Record<string, unknown>;
  pdfInputs: Record<string, string | number>;
  pdfOutputs: Record<string, string | number>;
}) {
  const [busy, setBusy] = useState<"push" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPush() {
    setBusy("push");
    setError(null);
    const body: PushListingPayload = {
      calculatorSlug,
      listingKind,
      price,
      propertyType,
      street: address?.street,
      unit: address?.unit,
      city: address?.city,
      state: address?.state,
      zip: address?.zip,
      payload: pushPayload,
    };
    const result = await pushDealToListing(body);
    if (!result.ok) {
      setError(result.error);
      if (result.loginUrl) {
        window.location.href = `${result.loginUrl}?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      setBusy(null);
      return;
    }
    window.location.href = result.redirectUrl;
  }

  async function onPdf() {
    setBusy("pdf");
    setError(null);
    const result = await exportDealMemoPdf({
      calculatorSlug,
      inputs: pdfInputs,
      outputs: pdfOutputs,
    });
    if (!result.ok) setError(result.error);
    setBusy(null);
  }

  return (
    <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {access?.canPushToListing ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void onPush()}
            className="rounded-full border border-lime-400/60 bg-lime-500/20 px-5 py-2.5 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
          >
            {busy === "push" ? "Preparing listing..." : "Profit confirmed — Push to Live Listing"}
          </button>
        ) : (
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(`/calculators/${calculatorSlug}`)}`}
            className="inline-flex justify-center rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/30"
          >
            Sign in to push to live listing
          </Link>
        )}
        {access?.canExportPdf ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void onPdf()}
            className="rounded-full border border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/30 disabled:opacity-60"
          >
            {busy === "pdf" ? "Building PDF..." : "Export Deal Memo PDF"}
          </button>
        ) : access?.isAuthenticated ? (
          <Link
            href="/dashboard/velocity-club"
            className="inline-flex justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/35"
          >
            Unlock PDF at Syndicate tier
          </Link>
        ) : null}
      </div>
    </div>
  );
}
