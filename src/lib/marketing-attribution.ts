/** Query params forwarded from landing pages to pricing/checkout for Ads attribution. */
export const MARKETING_TRACKING_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export function appendMarketingSearchParams(baseHref: string, currentSearch: string): string {
  const [pathAndQuery, hash = ""] = baseHref.split("#");
  const [pathname, existingQuery = ""] = pathAndQuery.split("?");
  const merged = new URLSearchParams(existingQuery);

  const incoming = new URLSearchParams(currentSearch.startsWith("?") ? currentSearch.slice(1) : currentSearch);
  for (const key of MARKETING_TRACKING_PARAM_KEYS) {
    const value = incoming.get(key);
    if (value) merged.set(key, value);
  }

  const query = merged.toString();
  const href = query ? `${pathname}?${query}` : pathname;
  return hash ? `${href}#${hash}` : href;
}
