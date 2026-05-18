"use client";

import { useHomeLocale } from "@/components/home/home-locale-provider";

export function HomeLanguageModal() {
  const { showLanguageModal, copy, setLocale, ready } = useHomeLocale();

  if (!ready || !showLanguageModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-language-modal-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/35 bg-[#050a08] p-6 shadow-[0_0_48px_rgba(16,185,129,0.2)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-200">
            LISTQIK · TX
          </div>
          <div className="space-y-2">
            <h2 id="home-language-modal-title" className="text-xl font-semibold text-emerald-50 sm:text-2xl">
              {copy.modal.title}
            </h2>
            <p className="text-sm text-white/65">{copy.modal.subtitle}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className="min-h-[52px] rounded-xl border border-emerald-400/60 bg-emerald-500/20 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
            >
              {copy.modal.english}
            </button>
            <button
              type="button"
              onClick={() => setLocale("es")}
              className="min-h-[52px] rounded-xl border border-emerald-400/40 bg-black/40 px-4 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-950/50"
            >
              {copy.modal.spanish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
