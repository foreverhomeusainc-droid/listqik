import type { Metadata } from "next";
import type { HomeLocale } from "@/i18n/home-locale";
import { homeOpenGraphLocale } from "@/lib/site-locale-server";
import { localeSitePath } from "@/lib/locale-site-path";
import { CALCULATOR_CATALOG } from "@/lib/calculators/types";

const CALCULATOR_ES_SITEMAP_SLUGS = CALCULATOR_CATALOG.map((c) => `/es/calculators/${c.slug}` as const);

/** EN path (e.g. `/pricing`) → hreflang alternates for EN + ES URL namespace. */
export function localeAlternates(enPath: string): NonNullable<Metadata["alternates"]> {
  const normalized = enPath.startsWith("/") ? enPath : `/${enPath}`;
  const esPath = localeSitePath(normalized, "es");
  return {
    canonical: normalized,
    languages: {
      "en-US": normalized,
      "es-US": esPath,
      "x-default": normalized,
    },
  };
}

/** Canonical is the `/es/...` path. */
export function localeAlternatesEs(esPath: string): NonNullable<Metadata["alternates"]> {
  const normalized = esPath.startsWith("/") ? esPath : `/${esPath}`;
  const base = normalized === "/es" ? "/" : normalized.replace(/^\/es/, "") || "/";
  const enPath = base.startsWith("/") ? base : `/${base}`;
  return {
    canonical: normalized,
    languages: {
      "en-US": enPath,
      "es-US": normalized,
      "x-default": enPath,
    },
  };
}

export function buildLocalizedMetadata(
  locale: HomeLocale,
  enPath: string,
  meta: { title: string; description: string },
): Metadata {
  const canonical = localeSitePath(enPath, locale);
  const alternates = locale === "es" ? localeAlternatesEs(canonical) : localeAlternates(enPath);

  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: homeOpenGraphLocale(locale),
      url: canonical,
    },
  };
}

/** All marketing routes under `/es` for sitemap.xml */
export const ES_MARKETING_SITEMAP_PATHS = [
  "/es",
  "/es/pricing",
  "/es/about",
  "/es/service-area",
  "/es/full-service",
  "/es/listings",
  "/es/upgrades",
  "/es/start-now",
  "/es/listqik-university",
  "/es/resources",
  "/es/resources/blogs",
  "/es/resources/videos",
  "/es/calculators",
  ...CALCULATOR_ES_SITEMAP_SLUGS,
  "/es/service-area/texas",
  "/es/service-area/texas/dfw",
  "/es/service-area/texas/austin",
  "/es/service-area/texas/san-antonio",
  "/es/service-area/texas/houston",
] as const;

/** hreflang for dynamic location paths under `/service-area/texas/...` */
export function locationAlternates(enPath: string): NonNullable<Metadata["alternates"]> {
  return localeAlternates(enPath);
}
