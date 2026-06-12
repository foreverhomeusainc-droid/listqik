import type { HomeLocale } from "@/i18n/home-locale";
import { countyPagePath } from "@/lib/texas-location-seo";

/** Public marketing site origin for Google Ads final URLs. */
export const LISTQIK_MARKETING_ORIGIN = "https://listqik.com";

/**
 * DFW Satellite counties — from the extended-service pop report, ranked by population
 * (highest first among North Texas / DFW-orbit counties). Used for Google Ads geo
 * targeting and ValueTrack county resolution. Excludes primary DFW core (Collin,
 * Dallas, Denton, Tarrant) which run in separate campaigns.
 */
export const DFW_SATELLITE_COUNTY_NAMES = [
  "Ellis",
  "Johnson",
  "Kaufman",
  "Grayson",
  "Rockwall",
  "Hunt",
  "Henderson",
  "Wise",
  "Hood",
  "Navarro",
  "Cherokee",
  "Fannin",
] as const;

export type DfwSatelliteCountyName = (typeof DFW_SATELLITE_COUNTY_NAMES)[number];

export const DFW_SATELLITE_COUNTY_SLUGS = DFW_SATELLITE_COUNTY_NAMES.map(
  (name) => `${name.toLowerCase().replace(/\s+/g, "-")}-county`,
) as readonly string[];

const DFW_SATELLITE_SLUG_SET = new Set<string>(DFW_SATELLITE_COUNTY_SLUGS);

export function isDfwSatelliteCountySlug(countySlug: string): boolean {
  return DFW_SATELLITE_SLUG_SET.has(countySlug);
}

export const DFW_SATELLITE_CAMPAIGN = {
  id: "dfw-satellite-en",
  name: "DFW Satellite Counties English",
  locale: "en" as const satisfies HomeLocale,
  utmCampaign: "dfw-satellite-en",
  utmSource: "google",
  utmMedium: "cpc",
} as const;

export const DFW_SATELLITE_CAMPAIGN_ES = {
  id: "dfw-satellite-es",
  name: "DFW Satellite Counties Spanish",
  locale: "es" as const satisfies HomeLocale,
  utmCampaign: "dfw-satellite-es",
  utmSource: "google",
  utmMedium: "cpc",
} as const;

/** Regional landing path — ValueTrack `loc` appended at click time in Google Ads. */
export const DFW_SATELLITE_LANDING_PATH = "/service-area/texas/dfw";

/**
 * Google Ads tracking template / final URL suffix.
 * Campaign: one MLS ad group, phrase/exact regional keywords, presence geo on 12 counties.
 */
export function dfwSatelliteAdsTrackingUrl(locale: HomeLocale = "en"): string {
  const base = locale === "es" ? `${LISTQIK_MARKETING_ORIGIN}/es${DFW_SATELLITE_LANDING_PATH}` : `${LISTQIK_MARKETING_ORIGIN}${DFW_SATELLITE_LANDING_PATH}`;
  const utmCampaign =
    locale === "es" ? DFW_SATELLITE_CAMPAIGN_ES.utmCampaign : DFW_SATELLITE_CAMPAIGN.utmCampaign;
  const params = new URLSearchParams({
    loc: "{loc_physical_ms}",
    utm_source: DFW_SATELLITE_CAMPAIGN.utmSource,
    utm_medium: DFW_SATELLITE_CAMPAIGN.utmMedium,
    utm_campaign: utmCampaign,
  });
  return `${base}?${params.toString()}`;
}

/** Phrase-match keyword set for the single regional MLS ad group. */
export const DFW_SATELLITE_MLS_KEYWORDS = [
  "flat fee mls texas",
  "texas flat fee mls",
  "ntreis flat fee listing",
  "flat fee mls listing",
  "$79 mls listing",
  "texas flat fee broker",
  "discount real estate broker texas",
  "best flat fee mls listing",
] as const;

/** Regional RSA headlines — no county names (geo resolved on landing page). */
export const DFW_SATELLITE_MLS_HEADLINES = [
  "Texas Flat Fee MLS",
  "NTREIS MLS Listing For $79",
  "Flat Fee MLS Listing",
  "List On Texas MLS Today",
  "NTREIS MLS Access",
  "Get Listed On MLS Fast",
  "Texas MLS From Just $79",
  "$79 MLS Listing Texas",
  "No Hidden Listing Fees",
  "List Your Home On MLS",
  "Texas Flat Fee Listing",
  "Full MLS Exposure",
  "Fast Texas MLS Listing",
  "Broker-Backed NTREIS MLS",
] as const;

export const DFW_SATELLITE_MLS_DESCRIPTIONS = [
  "List your Texas home on the MLS for just $79. Transparent pricing.",
  "Get NTREIS MLS exposure with our affordable flat fee listing.",
  "Fast, transparent Texas MLS listings designed for homeowners.",
  "Start your Texas MLS listing today and get maximum exposure.",
] as const;

/** Campaign-level negative keywords to control broad regional spend. */
export const DFW_SATELLITE_NEGATIVE_KEYWORDS = [
  "houston",
  "harris county",
  "har",
  "san antonio",
  "austin",
  "rent",
  "rental",
  "apartment",
  "jobs",
  "salary",
  "license",
  "course",
  "training",
  "free mls",
  "craigslist",
  "homes for sale",
  "zillow homes",
] as const;

export function buildDfwSatelliteCountyFinalUrl(
  countySlug: string,
  locale: HomeLocale,
  utmCampaign: string,
): string {
  const path = countyPagePath(countySlug, locale);
  const params = new URLSearchParams({
    utm_source: DFW_SATELLITE_CAMPAIGN.utmSource,
    utm_medium: DFW_SATELLITE_CAMPAIGN.utmMedium,
    utm_campaign: utmCampaign,
    utm_content: countySlug,
  });
  return `${LISTQIK_MARKETING_ORIGIN}${path}?${params.toString()}`;
}

export function getDfwSatelliteCountyLinks(locale: HomeLocale = "en") {
  const utmCampaign =
    locale === "es" ? DFW_SATELLITE_CAMPAIGN_ES.utmCampaign : DFW_SATELLITE_CAMPAIGN.utmCampaign;
  return DFW_SATELLITE_COUNTY_NAMES.map((countyName, index) => {
    const countySlug = DFW_SATELLITE_COUNTY_SLUGS[index]!;
    return {
      countyName,
      countySlug,
      path: countyPagePath(countySlug, locale),
      finalUrl: buildDfwSatelliteCountyFinalUrl(countySlug, locale, utmCampaign),
    };
  });
}
