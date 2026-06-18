import type { HomeLocale } from "@/i18n/home-locale";
import { DFW_SATELLITE_COUNTY_NAMES, DFW_SATELLITE_COUNTY_SLUGS } from "@/lib/dfw-satellite-campaign";
import {
  AUSTIN_SATELLITE_COUNTY_NAMES,
  countyNamesToSlugs,
  SAN_ANTONIO_SATELLITE_COUNTY_NAMES,
} from "@/lib/metro-regional-counties";
import { countyPagePath } from "@/lib/texas-location-seo";

/** Public marketing site origin for Google Ads final URLs. */
export const LISTQIK_MARKETING_ORIGIN = "https://listqik.com";

export type MetroRegionalId = "dfw" | "austin" | "san-antonio";

export type MetroRegionalCampaignConfig = {
  id: MetroRegionalId;
  landingPath: string;
  satelliteCountyNames: readonly string[];
  satelliteCountySlugs: readonly string[];
  utmCampaignEn: string;
  utmCampaignEs: string;
  utmSource: string;
  utmMedium: string;
};

export {
  ACTRIS_CORE_COUNTY_NAMES,
  ACTRIS_EXTENDED_COUNTY_NAMES,
  SABOR_CORE_COUNTY_NAMES,
  SABOR_EXTENDED_COUNTY_NAMES,
} from "@/lib/metro-regional-counties";

const METRO_CONFIGS: Record<MetroRegionalId, MetroRegionalCampaignConfig> = {
  dfw: {
    id: "dfw",
    landingPath: "/service-area/texas/dfw",
    satelliteCountyNames: DFW_SATELLITE_COUNTY_NAMES,
    satelliteCountySlugs: DFW_SATELLITE_COUNTY_SLUGS,
    utmCampaignEn: "dfw-satellite-en",
    utmCampaignEs: "dfw-satellite-es",
    utmSource: "google",
    utmMedium: "cpc",
  },
  austin: {
    id: "austin",
    landingPath: "/service-area/texas/austin",
    satelliteCountyNames: AUSTIN_SATELLITE_COUNTY_NAMES,
    satelliteCountySlugs: countyNamesToSlugs(AUSTIN_SATELLITE_COUNTY_NAMES),
    utmCampaignEn: "austin-regional-en",
    utmCampaignEs: "austin-regional-es",
    utmSource: "google",
    utmMedium: "cpc",
  },
  "san-antonio": {
    id: "san-antonio",
    landingPath: "/service-area/texas/san-antonio",
    satelliteCountyNames: SAN_ANTONIO_SATELLITE_COUNTY_NAMES,
    satelliteCountySlugs: countyNamesToSlugs(SAN_ANTONIO_SATELLITE_COUNTY_NAMES),
    utmCampaignEn: "san-antonio-regional-en",
    utmCampaignEs: "san-antonio-regional-es",
    utmSource: "google",
    utmMedium: "cpc",
  },
};

const SLUG_SETS: Record<MetroRegionalId, Set<string>> = {
  dfw: new Set(DFW_SATELLITE_COUNTY_SLUGS),
  austin: new Set(METRO_CONFIGS.austin.satelliteCountySlugs),
  "san-antonio": new Set(METRO_CONFIGS["san-antonio"].satelliteCountySlugs),
};

export function getMetroRegionalConfig(metroId: MetroRegionalId): MetroRegionalCampaignConfig {
  return METRO_CONFIGS[metroId];
}

export function listMetroRegionalIds(): MetroRegionalId[] {
  return ["dfw", "austin", "san-antonio"];
}

export function isMetroRegionalSatelliteCountySlug(
  metroId: MetroRegionalId,
  countySlug: string,
): boolean {
  return SLUG_SETS[metroId].has(countySlug);
}

export function metroRegionalAdsTrackingUrl(
  metroId: MetroRegionalId,
  locale: HomeLocale = "en",
): string {
  const config = getMetroRegionalConfig(metroId);
  const base =
    locale === "es"
      ? `${LISTQIK_MARKETING_ORIGIN}/es${config.landingPath}`
      : `${LISTQIK_MARKETING_ORIGIN}${config.landingPath}`;
  const utmCampaign = locale === "es" ? config.utmCampaignEs : config.utmCampaignEn;
  const params = new URLSearchParams({
    loc: "{loc_physical_ms}",
    utm_source: config.utmSource,
    utm_medium: config.utmMedium,
    utm_campaign: utmCampaign,
  });
  return `${base}?${params.toString()}`;
}

export function buildMetroRegionalCountyFinalUrl(
  metroId: MetroRegionalId,
  countySlug: string,
  locale: HomeLocale,
): string {
  const config = getMetroRegionalConfig(metroId);
  const utmCampaign = locale === "es" ? config.utmCampaignEs : config.utmCampaignEn;
  const path = countyPagePath(countySlug, locale);
  const params = new URLSearchParams({
    utm_source: config.utmSource,
    utm_medium: config.utmMedium,
    utm_campaign: utmCampaign,
    utm_content: countySlug,
  });
  return `${LISTQIK_MARKETING_ORIGIN}${path}?${params.toString()}`;
}

export function getMetroRegionalCountyLinks(metroId: MetroRegionalId, locale: HomeLocale = "en") {
  const config = getMetroRegionalConfig(metroId);
  return config.satelliteCountyNames.map((countyName, index) => {
    const countySlug = config.satelliteCountySlugs[index]!;
    return {
      countyName,
      countySlug,
      path: countyPagePath(countySlug, locale),
      finalUrl: buildMetroRegionalCountyFinalUrl(metroId, countySlug, locale),
    };
  });
}

/** All satellite county slugs across DFW, Austin, and San Antonio regional campaigns. */
export function allMetroRegionalSatelliteCountySlugs(): readonly string[] {
  return listMetroRegionalIds().flatMap((id) => [...getMetroRegionalConfig(id).satelliteCountySlugs]);
}
