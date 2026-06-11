import geoTargetMap from "@/data/google-geo-target-map.json";
import { DFW_SATELLITE_COUNTY_SLUGS, isDfwSatelliteCountySlug } from "@/lib/dfw-satellite-campaign";

export type GoogleGeoTargetEntry = {
  countySlug: string;
  countyName: string;
  targetType: "County" | "City";
  googleName: string;
};

export type ResolvedGoogleGeoTarget = GoogleGeoTargetEntry & {
  criteriaId: string;
};

const CRITERIA_MAP = geoTargetMap.byCriteriaId as Record<string, GoogleGeoTargetEntry>;

/** Normalize ValueTrack `loc` / `{loc_physical_ms}` values from Google Ads clicks. */
export function normalizeGoogleGeoCriteriaId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return trimmed;
}

export function resolveGoogleGeoCriteriaId(
  raw: string | null | undefined,
): ResolvedGoogleGeoTarget | null {
  const criteriaId = normalizeGoogleGeoCriteriaId(raw);
  if (!criteriaId) return null;

  const entry = CRITERIA_MAP[criteriaId];
  if (!entry) return null;

  return { criteriaId, ...entry };
}

/** Prefer DFW satellite counties; otherwise accept any Texas county we can map. */
export function resolveDfwSatelliteGeoCriteriaId(
  raw: string | null | undefined,
): ResolvedGoogleGeoTarget | null {
  const resolved = resolveGoogleGeoCriteriaId(raw);
  if (!resolved) return null;
  if (!isDfwSatelliteCountySlug(resolved.countySlug)) return null;
  return resolved;
}

export function getDfwSatelliteCountyCriteriaIds(): Record<string, string> {
  return geoTargetMap.satelliteCountyCriteriaIds as Record<string, string>;
}

export function listDfwSatelliteCountySlugs(): readonly string[] {
  return DFW_SATELLITE_COUNTY_SLUGS;
}
