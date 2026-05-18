"use client";

import { useHomeLocale } from "@/components/home/home-locale-provider";
import type { HomeLocale } from "@/i18n/home-locale";

export function HomeLanguageToggle() {
  const { locale, copy, setLocale } = useHomeLocale();

  return (
    <div
      className="inline-flex rounded-full border border-emerald-500/35 bg-black/50 p-0.5 font-mono text-[10px] font-bold tracking-wider"
      role="group"
      aria-label={locale === "es" ? "Idioma" : "Language"}
    >
      {(["en", "es"] as HomeLocale[]).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={[
              "min-w-[2.5rem] rounded-full px-2.5 py-1 transition",
              active
                ? "bg-emerald-500/30 text-emerald-100"
                : "text-emerald-200/55 hover:text-emerald-100/90",
            ].join(" ")}
            aria-pressed={active}
          >
            {copy.languageToggle[code]}
          </button>
        );
      })}
    </div>
  );
}
