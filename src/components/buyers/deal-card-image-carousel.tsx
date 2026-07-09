"use client";

import Image from "next/image";
import { useState } from "react";

export function DealCardImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const safe = images.filter(Boolean);
  const current = safe[index] ?? safe[0];
  const hasMultiple = safe.length > 1;

  if (!current) return null;

  function go(delta: number) {
    if (!hasMultiple) return;
    setIndex((i) => (i + delta + safe.length) % safe.length);
  }

  return (
    <>
      <Image
        src={current}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        unoptimized={current.startsWith("http")}
      />
      {hasMultiple ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-2 py-1 text-sm text-white/90 opacity-0 transition hover:bg-black/75 group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/55 px-2 py-1 text-sm text-white/90 opacity-0 transition hover:bg-black/75 group-hover:opacity-100"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-3 flex gap-1">
            {safe.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
