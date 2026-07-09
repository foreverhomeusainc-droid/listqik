"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ADMIN_MAX_ADDITIONAL_PHOTOS } from "@/lib/admin-photo-urls";

export type AdminPropertyPhotos = {
  heroImageUrl: string;
  additionalPhotoUrls: string[];
};

export function AdminPropertyPhotosUpload({
  uploadUrl,
  value,
  onChange,
  maxAdditional = ADMIN_MAX_ADDITIONAL_PHOTOS,
}: {
  uploadUrl: string;
  value: AdminPropertyPhotos;
  onChange: (next: AdminPropertyPhotos) => void;
  maxAdditional?: number;
}) {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const galleryFull = value.additionalPhotoUrls.length >= maxAdditional;

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(uploadUrl, { method: "POST", body: formData });
    const data = (await res.json()) as { ok?: boolean; publicUrl?: string; error?: string };
    if (!res.ok || !data.ok || !data.publicUrl) {
      setError(data.error ?? "Upload failed.");
      return null;
    }
    return data.publicUrl;
  }

  async function onHeroFile(file: File) {
    setUploadingHero(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      if (url) onChange({ ...value, heroImageUrl: url });
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploadingHero(false);
    }
  }

  async function onGalleryFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    const slots = maxAdditional - value.additionalPhotoUrls.length;
    if (slots <= 0) {
      setError(`Maximum ${maxAdditional} additional photos.`);
      return;
    }

    setUploadingGallery(true);
    setError(null);
    const uploaded: string[] = [];
    try {
      for (const file of list.slice(0, slots)) {
        const url = await uploadFile(file);
        if (url) uploaded.push(url);
      }
      if (uploaded.length) {
        onChange({
          ...value,
          additionalPhotoUrls: [...value.additionalPhotoUrls, ...uploaded],
        });
      }
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGallery(url: string) {
    onChange({
      ...value,
      additionalPhotoUrls: value.additionalPhotoUrls.filter((u) => u !== url),
    });
  }

  function setAsHero(url: string) {
    const rest = value.additionalPhotoUrls.filter((u) => u !== url);
    const demote = value.heroImageUrl?.trim();
    onChange({
      heroImageUrl: url,
      additionalPhotoUrls: demote ? [demote, ...rest] : rest,
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-white/55">
          Hero photo <span className="text-rose-300/90">*</span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="relative aspect-[16/10] w-full max-w-xs overflow-hidden rounded-xl border border-white/15 bg-black/40">
            {value.heroImageUrl ? (
              <Image
                src={value.heroImageUrl}
                alt="Hero preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-white/40">
                No hero yet
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={heroInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onHeroFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploadingHero || uploadingGallery}
              onClick={() => heroInputRef.current?.click()}
              className="rounded-lg border border-emerald-400/40 bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-900/40 disabled:opacity-60"
            >
              {uploadingHero ? "Uploading…" : value.heroImageUrl ? "Replace hero" : "Upload hero"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/55">
            Additional photos
          </label>
          <span className="text-xs text-white/45">
            {value.additionalPhotoUrls.length} / {maxAdditional}
          </span>
        </div>

        {value.additionalPhotoUrls.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {value.additionalPhotoUrls.map((url) => (
              <div
                key={url}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15 bg-black/40"
              >
                <Image src={url} alt="Gallery" fill className="object-cover" unoptimized />
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/70 p-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setAsHero(url)}
                    className="flex-1 rounded px-1 py-0.5 text-[10px] font-semibold text-emerald-200 hover:bg-white/10"
                  >
                    Set hero
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGallery(url)}
                    className="rounded px-1 py-0.5 text-[10px] font-semibold text-rose-300 hover:bg-white/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40">Optional — kitchen, backyard, street view, etc.</p>
        )}

        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void onGalleryFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={uploadingHero || uploadingGallery || galleryFull}
          onClick={() => galleryInputRef.current?.click()}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 disabled:opacity-50"
        >
          {uploadingGallery ? "Uploading…" : galleryFull ? "Gallery full" : "Add photos"}
        </button>
      </div>

      <p className="text-xs text-white/45">JPEG, PNG, WEBP, or HEIC — up to 15 MB each.</p>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
