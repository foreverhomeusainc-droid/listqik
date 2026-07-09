"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPropertyPhotosUpload } from "@/components/admin/admin-property-photos-upload";
import type { AdminPropertyPhotos } from "@/components/admin/admin-property-photos-upload";

export function AdminCreateListingForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<AdminPropertyPhotos>({
    heroImageUrl: "",
    additionalPhotoUrls: [],
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photos.heroImageUrl.trim()) {
      setError("Upload a hero photo first.");
      return;
    }
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const tagsRaw = String(fd.get("tags") ?? "");
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      street: String(fd.get("street") ?? ""),
      unit: String(fd.get("unit") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? "TX"),
      zip: String(fd.get("zip") ?? ""),
      price: Number(fd.get("price")),
      title: String(fd.get("title") ?? ""),
      neighborhood: String(fd.get("neighborhood") ?? ""),
      beds: fd.get("beds") ? Number(fd.get("beds")) : undefined,
      baths: fd.get("baths") ? Number(fd.get("baths")) : undefined,
      sqft: fd.get("sqft") ? Number(fd.get("sqft")) : undefined,
      tags,
      propertyType: String(fd.get("propertyType") ?? "SINGLE_FAMILY"),
      status: String(fd.get("status") ?? "ACTIVE"),
      heroImageUrl: photos.heroImageUrl,
      additionalPhotoUrls: photos.additionalPhotoUrls,
      publicRemarks: String(fd.get("publicRemarks") ?? ""),
      publishedOnSite: fd.get("publishedOnSite") === "on",
      dealOfTheWeek: fd.get("dealOfTheWeek") === "on",
      dealOfTheWeekRank: fd.get("dealOfTheWeekRank")
        ? Number(fd.get("dealOfTheWeekRank"))
        : 0,
    };

    const res = await fetch("/api/admin/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; publicUrl?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not create listing.");
      return;
    }
    router.push("/dashboard/admin/listings");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Street" name="street" required />
        <Field label="Unit" name="unit" />
        <Field label="City" name="city" required defaultValue="Austin" />
        <Field label="State" name="state" defaultValue="TX" />
        <Field label="ZIP" name="zip" required />
        <Field label="Neighborhood / area" name="neighborhood" placeholder="78704" />
        <Field label="Price" name="price" type="number" required />
        <Field label="Marketing title" name="title" placeholder="South Lamar Glass Loft" />
        <Field label="Beds" name="beds" type="number" />
        <Field label="Baths" name="baths" type="number" step="0.5" />
        <Field label="Sq ft" name="sqft" type="number" />
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Property type</label>
          <select
            name="propertyType"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          >
            <option value="SINGLE_FAMILY">Single family</option>
            <option value="CONDOMINIUM">Condo</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Display status</label>
          <select
            name="status"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      <AdminPropertyPhotosUpload
        uploadUrl="/api/admin/listings/upload-image"
        value={photos}
        onChange={setPhotos}
      />

      <Field label="Tags (comma-separated)" name="tags" placeholder="walkable, modern, investor" />
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Summary</label>
        <textarea
          name="publicRemarks"
          rows={3}
          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          placeholder="Public marketing blurb for the listing card…"
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="publishedOnSite" defaultChecked className="accent-emerald-500" />
          Publish on listqik.com/listings
        </label>
        <label className="flex items-center gap-2 text-sm text-amber-100/90">
          <input type="checkbox" name="dealOfTheWeek" className="accent-amber-500" />
          Deal of the Week
        </label>
        <Field label="Deal rank" name="dealOfTheWeekRank" type="number" defaultValue="10" />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create listing"}
        </button>
        <Link
          href="/dashboard/admin/listings"
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/55">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30"
      />
    </div>
  );
}
