"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminHeroImageUpload } from "@/components/admin/admin-hero-image-upload";
import { BuyerDealCard } from "@/components/buyers/buyer-deal-card";
import type { BuyerDealStatus, BuyerDealTeaser } from "@/lib/buyers/types";

type PreviewState = {
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  approximateMarketValue: number;
  beds: number;
  baths: number;
  sqft: number;
  domDays: number;
  status: BuyerDealStatus;
  publicRemarks: string;
  tags: string;
  dealFeatured: boolean;
};

export function AdminCreateBuyerDealForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState("");

  const [preview, setPreview] = useState<PreviewState>({
    city: "Houston",
    state: "Texas",
    zip: "77008",
    listPrice: 525000,
    approximateMarketValue: 572000,
    beds: 3,
    baths: 2,
    sqft: 1920,
    domDays: 24,
    status: "active",
    publicRemarks:
      "Heights-adjacent single-family home with curb appeal and room to expand. Listed under recent neighborhood sales.",
    tags: "flip, heights-adjacent",
    dealFeatured: true,
  });

  const previewDeal: BuyerDealTeaser = useMemo(
    () => ({
      id: "preview",
      city: preview.city,
      state: preview.state,
      zip: preview.zip,
      listPrice: preview.listPrice,
      approximateMarketValue: preview.approximateMarketValue || null,
      beds: preview.beds,
      baths: preview.baths,
      sqft: preview.sqft,
      propertyType: "single-family",
      status: preview.status,
      investorTags: preview.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publicRemarks: preview.publicRemarks,
      heroImageUrl,
      domDays: preview.domDays,
      investorScore: 75,
      arvEstimate: null,
      dealFeatured: preview.dealFeatured,
    }),
    [preview, heroImageUrl],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!heroImageUrl) {
      setError("Upload a hero photo first.");
      return;
    }
    setBusy(true);
    setError(null);

    const tags = preview.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/buyer-deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: preview.city,
        state: preview.state,
        zip: preview.zip,
        listPrice: preview.listPrice,
        approximateMarketValue: preview.approximateMarketValue || null,
        beds: preview.beds,
        baths: preview.baths,
        sqft: preview.sqft,
        domDays: preview.domDays,
        investorTags: tags,
        publicRemarks: preview.publicRemarks,
        heroImageUrl,
        status: preview.status,
        dealFeatured: preview.dealFeatured,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not create deal.");
      return;
    }
    router.push("/dashboard/admin/buyer-deals");
    router.refresh();
  }

  function setField<K extends keyof PreviewState>(key: K, value: PreviewState[K]) {
    setPreview((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
        <AdminHeroImageUpload
          uploadUrl="/api/admin/buyer-deals/upload-image"
          onUrlChange={setHeroImageUrl}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" value={preview.city} onChange={(v) => setField("city", v)} required />
          <Field label="State" value={preview.state} onChange={(v) => setField("state", v)} />
          <Field label="ZIP" value={preview.zip} onChange={(v) => setField("zip", v)} required />
          <Field
            label="List price (starts at)"
            type="number"
            value={String(preview.listPrice)}
            onChange={(v) => setField("listPrice", Number(v) || 0)}
            required
          />
          <Field
            label="Approx. market value"
            type="number"
            value={String(preview.approximateMarketValue)}
            onChange={(v) => setField("approximateMarketValue", Number(v) || 0)}
          />
          <Field
            label="Days on market"
            type="number"
            value={String(preview.domDays)}
            onChange={(v) => setField("domDays", Number(v) || 0)}
          />
          <Field
            label="Beds"
            type="number"
            value={String(preview.beds)}
            onChange={(v) => setField("beds", Number(v) || 0)}
          />
          <Field
            label="Baths"
            type="number"
            step="0.5"
            value={String(preview.baths)}
            onChange={(v) => setField("baths", Number(v) || 0)}
          />
          <Field
            label="Sq ft"
            type="number"
            value={String(preview.sqft)}
            onChange={(v) => setField("sqft", Number(v) || 0)}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Status</label>
            <select
              value={preview.status}
              onChange={(e) =>
                setField("status", e.target.value as BuyerDealStatus)
              }
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <Field
          label="Tags (comma-separated)"
          value={preview.tags}
          onChange={(v) => setField("tags", v)}
          placeholder="flip, value-add"
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Summary</label>
          <textarea
            rows={3}
            value={preview.publicRemarks}
            onChange={(e) => setField("publicRemarks", e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            placeholder="Short buyer-facing description…"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-amber-100/90">
          <input
            type="checkbox"
            checked={preview.dealFeatured}
            onChange={(e) => setField("dealFeatured", e.target.checked)}
            className="accent-amber-500"
          />
          Deal of the Week
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {busy ? "Publishing…" : "Publish buyer deal"}
          </button>
          <Link
            href="/dashboard/admin/buyer-deals"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">Live preview</p>
        <BuyerDealCard deal={previewDeal} mode="preview" dealLabel="Deal of the Week" />
        <p className="text-xs text-white/45">
          This is what buyers see on /buyers before they sign Buyer Representation. No county, legal
          description, or seller MLS fields required.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/55">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30"
      />
    </div>
  );
}
