import type { HomeLocale } from "@/i18n/home-locale";

/** Strip `/es` prefix so nav active states work on Spanish URL paths. */
export function stripEsSitePrefix(pathname: string): string {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Prefix marketing paths for the `/es` URL namespace. */
export function localeSitePath(path: string, locale: HomeLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "es") {
    return normalized === "/" ? "/es" : `/es${normalized}`;
  }
  return normalized;
}
