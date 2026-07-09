"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

export function ListingPhotoGallery({
  images,
  alt,
  badges,
}: {
  images: { src: string; alt: string }[];
  alt: string;
  badges?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={current.src}
          alt={current.alt || alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
          unoptimized={current.src.startsWith("/api/listing-images/")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {badges ? (
          <div className="pointer-events-none absolute left-5 top-5 flex flex-wrap gap-2">{badges}</div>
        ) : null}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-white/90 hover:bg-black/75"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-white/90 hover:bg-black/75"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border ${
                i === index ? "border-emerald-400/60" : "border-white/15"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || alt}
                fill
                className="object-cover"
                unoptimized={img.src.startsWith("/api/listing-images/")}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
