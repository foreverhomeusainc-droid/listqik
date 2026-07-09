"use client";

import { useEffect, useState } from "react";
import {
  AdminPropertyPhotosUpload,
  type AdminPropertyPhotos,
} from "@/components/admin/admin-property-photos-upload";

export function AdminEditPhotosPanel({
  uploadUrl,
  initial,
  busy = false,
  onSave,
  onCancel,
}: {
  uploadUrl: string;
  initial: AdminPropertyPhotos;
  busy?: boolean;
  onSave: (photos: AdminPropertyPhotos) => Promise<void>;
  onCancel?: () => void;
}) {
  const [photos, setPhotos] = useState<AdminPropertyPhotos>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhotos(initial);
  }, [initial]);

  const dirty =
    photos.heroImageUrl !== initial.heroImageUrl ||
    photos.additionalPhotoUrls.join("|") !== initial.additionalPhotoUrls.join("|");

  async function handleSave() {
    if (!photos.heroImageUrl.trim()) {
      setError("Hero photo is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(photos);
    } catch {
      setError("Could not save photos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-black/40 p-4">
      <AdminPropertyPhotosUpload uploadUrl={uploadUrl} value={photos} onChange={setPhotos} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || saving || !dirty}
          onClick={() => void handleSave()}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save photos"}
        </button>
        {onCancel ? (
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white"
          >
            Close
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
