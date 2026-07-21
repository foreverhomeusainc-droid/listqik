"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPropertyPhotosUpload } from "@/components/admin/admin-property-photos-upload";
import type { AdminPropertyPhotos } from "@/components/admin/admin-property-photos-upload";

export type AdminListingFormData = {
  id: string;
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  title: string;
  neighborhood: string;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  tags: string[];
  propertyType: "SINGLE_FAMILY" | "CONDOMINIUM";
  status: "ACTIVE" | "PENDING" | "SOLD";
  heroImageUrl: string;
  additionalPhotoUrls: string[];
  publicRemarks: string;
  publishedOnSite: boolean;
  dealOfTheWeek: boolean;
  dealOfTheWeekRank: number;
};

export function AdminListingForm({ listing }: { listing: AdminListingFormData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<AdminPropertyPhotos>({
    heroImageUrl: listing.heroImageUrl,
    additionalPhotoUrls: listing.additionalPhotoUrls,
  });
  const [publishedOnSite, setPublishedOnSite] = useState(listing.publishedOnSite);
  const [dealOfTheWeek, setDealOfTheWeek] = useState(listing.dealOfTheWeek);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ((publishedOnSite || dealOfTheWeek) && !photos.heroImageUrl.trim()) {
      setError("Upload a hero photo before publishing or marking Deal of the Week.");
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
      beds: fd.get("beds") ? Number(fd.get("beds")) : null,
      baths: fd.get("baths") ? Number(fd.get("baths")) : null,
      sqft: fd.get("sqft") ? Number(fd.get("sqft")) : null,
      tags,
      propertyType: String(fd.get("propertyType") ?? "SINGLE_FAMILY"),
      status: String(fd.get("status") ?? "ACTIVE"),
      heroImageUrl: photos.heroImageUrl,
      additionalPhotoUrls: photos.additionalPhotoUrls,
      publicRemarks: String(fd.get("publicRemarks") ?? ""),
      publishedOnSite,
      dealOfTheWeek,
      dealOfTheWeekRank: fd.get("dealOfTheWeekRank")
        ? Number(fd.get("dealOfTheWeekRank"))
        : 0,
    };

    const res = await fetch(`/api/admin/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not save listing.");
      return;
    }
    router.push("/dashboard/admin/listings");
    router.refresh();
  }

  async function onDelete() {
    if (!window.confirm("Delete this admin listing permanently?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not delete listing.");
        return;
      }
      router.push("/dashboard/admin/listings");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Street" name="street" required defaultValue={listing.street} />
        <Field label="Unit" name="unit" defaultValue={listing.unit} />
        <Field label="City" name="city" required defaultValue={listing.city} />
        <Field label="State" name="state" defaultValue={listing.state} />
        <Field label="ZIP" name="zip" required defaultValue={listing.zip} />
        <Field label="Neighborhood / area" name="neighborhood" defaultValue={listing.neighborhood} />
        <Field label="Price" name="price" type="number" required defaultValue={String(listing.price)} />
        <Field label="Marketing title" name="title" defaultValue={listing.title} />
        <Field
          label="Beds"
          name="beds"
          type="number"
          defaultValue={listing.beds != null ? String(listing.beds) : ""}
        />
        <Field
          label="Baths"
          name="baths"
          type="number"
          step="0.5"
          defaultValue={listing.baths != null ? String(listing.baths) : ""}
        />
        <Field
          label="Sq ft"
          name="sqft"
          type="number"
          defaultValue={listing.sqft != null ? String(listing.sqft) : ""}
        />
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Property type</label>
          <select
            name="propertyType"
            defaultValue={listing.propertyType}
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
            defaultValue={listing.status}
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

      <Field
        label="Tags (comma-separated)"
        name="tags"
        defaultValue={listing.tags.join(", ")}
      />
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-white/55">Summary</label>
        <textarea
          name="publicRemarks"
          rows={3}
          defaultValue={listing.publicRemarks}
          className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={publishedOnSite}
            onChange={(e) => setPublishedOnSite(e.target.checked)}
            className="accent-emerald-500"
          />
          Publish on listqik.com/listings
        </label>
        <label className="flex items-center gap-2 text-sm text-amber-100/90">
          <input
            type="checkbox"
            checked={dealOfTheWeek}
            onChange={(e) => {
              setDealOfTheWeek(e.target.checked);
              if (e.target.checked) setPublishedOnSite(true);
            }}
            className="accent-amber-500"
          />
          Deal of the Week
        </label>
        <Field
          label="Deal rank"
          name="dealOfTheWeekRank"
          type="number"
          defaultValue={String(listing.dealOfTheWeekRank)}
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/dashboard/admin/listings"
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onDelete()}
          className="rounded-lg border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-950/40 disabled:opacity-60"
        >
          Delete
        </button>
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
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
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
        step={step}
        className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30"
      />
    </div>
  );
}
