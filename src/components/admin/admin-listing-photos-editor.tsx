"use client";

import { useState } from "react";
import { AdminEditPhotosPanel } from "@/components/admin/admin-edit-photos-panel";
import type { AdminPropertyPhotos } from "@/components/admin/admin-property-photos-upload";

export function AdminListingPhotosEditor({
  listingId,
  heroImageUrl,
  additionalPhotoUrls,
}: {
  listingId: string;
  heroImageUrl?: string;
  additionalPhotoUrls?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<AdminPropertyPhotos>({
    heroImageUrl: heroImageUrl ?? "",
    additionalPhotoUrls: additionalPhotoUrls ?? [],
  });

  const count = (photos.heroImageUrl ? 1 : 0) + photos.additionalPhotoUrls.length;

  async function save(next: AdminPropertyPhotos) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImageUrl: next.heroImageUrl,
          additionalPhotoUrls: next.additionalPhotoUrls,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        listing?: { heroImageUrl?: string; additionalPhotoUrls?: string[] };
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Save failed");
      }
      setPhotos({
        heroImageUrl: data.listing?.heroImageUrl ?? next.heroImageUrl,
        additionalPhotoUrls: data.listing?.additionalPhotoUrls ?? next.additionalPhotoUrls,
      });
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold text-sky-300 underline"
      >
        {open ? "Hide photos" : `Photos (${count})`}
      </button>
      {open ? (
        <AdminEditPhotosPanel
          uploadUrl="/api/admin/listings/upload-image"
          initial={photos}
          busy={busy}
          onSave={save}
          onCancel={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
