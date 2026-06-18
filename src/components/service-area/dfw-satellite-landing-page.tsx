import type { HomeLocale } from "@/i18n/home-locale";
import {
  MetroRegionalLandingPage,
  metroRegionalMetadata,
} from "@/components/service-area/metro-regional-landing-page";

export function dfwSatelliteMetadata(locale: HomeLocale) {
  return metroRegionalMetadata("dfw", locale);
}

export function DfwSatelliteLandingPage({ locale }: { locale: HomeLocale }) {
  return <MetroRegionalLandingPage metroId="dfw" locale={locale} />;
}
