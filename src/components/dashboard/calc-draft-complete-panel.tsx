"use client";

import { useEffect, useState } from "react";
import { useCalculatorAddress, CalculatorAddressFields } from "@/components/calculators/calculator-shell";

type DraftPreview = {
  id: string;
  calculatorId: string;
  price: number | null;
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  consumedAt: string | null;
};

export function CalcDraftCompletePanel({ draftId }: { draftId: string }) {
  const address = useCalculatorAddress();
  const [draft, setDraft] = useState<DraftPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/calculators/draft/${encodeURIComponent(draftId)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { ok?: boolean; draft?: DraftPreview };
        if (!res.ok || !data.ok || !data.draft) return;
        if (data.draft.consumedAt) return;
        setDraft(data.draft);
        if (data.draft.street) address.setStreet(data.draft.street);
        if (data.draft.unit) address.setUnit(data.draft.unit);
        if (data.draft.city) address.setCity(data.draft.city);
        if (data.draft.state) address.setState(data.draft.state);
        if (data.draft.zip) address.setZip(data.draft.zip);
      } catch {
        setError("Could not load calculator draft.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate address once from draft
  }, [draftId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/calculators/draft/${encodeURIComponent(draftId)}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street: address.street,
          unit: address.unit,
          city: address.city,
          state: address.state,
          zip: address.zip,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; redirectUrl?: string; error?: string };
      if (!res.ok || !data.ok || !data.redirectUrl) {
        setError(data.error ?? "Could not create listing.");
        setBusy(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Could not create listing. Try again.");
      setBusy(false);
    }
  }

  if (!draft) return null;

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-xl border border-sky-400/30 bg-sky-950/20 p-4 space-y-4"
    >
      <div>
        <p className="text-sm font-semibold text-sky-100">Complete your calculator deal</p>
        <p className="mt-1 text-sm text-sky-100/75">
          Your plan is active
          {typeof draft.price === "number" && draft.price > 0
            ? ` — target price ${draft.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}`
            : ""}
          . Add the property address to open listing setup.
        </p>
      </div>
      <CalculatorAddressFields {...address} />
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full border border-lime-400/60 bg-lime-500/20 px-5 py-2.5 text-sm font-semibold text-lime-100 transition hover:bg-lime-500/30 disabled:opacity-60"
      >
        {busy ? "Creating listing..." : "Create listing & continue setup"}
      </button>
    </form>
  );
}
