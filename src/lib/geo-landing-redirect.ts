import type { HomeLocale } from "@/i18n/home-locale";
import { resolveGoogleGeoCriteriaId } from "@/lib/google-geo-target";
import { appendMarketingSearchParams } from "@/lib/marketing-attribution";
import { countyPagePath } from "@/lib/texas-location-seo";

export const GEO_LOC_PARAM = "loc";

export function isGoogleGeoCriteriaPathSegment(segment: string): boolean {
  return /^\d{5,}$/.test(segment);
}

/**
 * Build a county lander URL from a ValueTrack location ID, preserving Ads attribution params.
 * Returns null when the criteria ID cannot be mapped.
 */
export function buildCountyRedirectFromGeoLoc(
  loc: string | null | undefined,
  locale: HomeLocale,
  currentSearch: string,
): string | null {
  const resolved = resolveGoogleGeoCriteriaId(loc);
  if (!resolved) return null;

  const baseHref = countyPagePath(resolved.countySlug, locale);
  const withAttribution = appendMarketingSearchParams(baseHref, currentSearch);

  const [pathAndQuery, hash = ""] = withAttribution.split("#");
  const [pathname, existingQuery = ""] = pathAndQuery.split("?");
  const merged = new URLSearchParams(existingQuery);
  merged.delete(GEO_LOC_PARAM);
  merged.set("utm_content", resolved.countySlug);

  const query = merged.toString();
  const href = query ? `${pathname}?${query}` : pathname;
  return hash ? `${href}#${hash}` : href;
}

export function extractGeoLocFromSearch(search: string): string | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return params.get(GEO_LOC_PARAM);
}
