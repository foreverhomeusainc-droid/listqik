import type { HomeLocale } from "@/i18n/home-locale";

/** Prefix marketing paths for the `/es` URL namespace. */
export function localeSitePath(path: string, locale: HomeLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "es") {
    return normalized === "/" ? "/es" : `/es${normalized}`;
  }
  return normalized;
}
