"use client";

import { useSiteLocale } from "@/components/site-locale-provider";
import {
  getLegalPageMetaCopy,
  type LegalSlug,
} from "@/i18n/legal-page-copy";

type LegalPageHeaderProps = {
  slug: string;
  updatedAt: string;
  fallbackTitle: string;
};

export function LegalPageHeader({ slug, updatedAt, fallbackTitle }: LegalPageHeaderProps) {
  const { locale, ready } = useSiteLocale();
  const meta = getLegalPageMetaCopy(locale);
  const title =
    slug === "privacy" || slug === "terms"
      ? meta.titles[slug as LegalSlug]
      : fallbackTitle;

  return (
    <header
      className={[
        "space-y-3 transition-opacity duration-200",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div className="text-xs font-semibold tracking-widest text-white/60">
        {meta.resourcesLegal}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-muted">
        {meta.updated}{" "}
        <span className="font-mono text-white/70">{updatedAt}</span>
      </p>
    </header>
  );
}
