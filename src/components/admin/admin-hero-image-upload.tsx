"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function AdminHeroImageUpload({
  uploadUrl,
  label = "Hero photo",
  onUrlChange,
}: {
  uploadUrl: string;
  label?: string;
  onUrlChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = (await res.json()) as { ok?: boolean; publicUrl?: string; error?: string };
      if (!res.ok || !data.ok || !data.publicUrl) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setPreviewUrl(data.publicUrl);
      onUrlChange(data.publicUrl);
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-white/55">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative aspect-[16/10] w-full max-w-xs overflow-hidden rounded-xl border border-white/15 bg-black/40">
          {previewUrl ? (
            <Image src={previewUrl} alt="Hero preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-white/40">
              No photo yet
            </div>
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-emerald-400/40 bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-900/40 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
          <p className="max-w-xs text-xs text-white/45">JPEG, PNG, WEBP, or HEIC — up to 15 MB.</p>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
