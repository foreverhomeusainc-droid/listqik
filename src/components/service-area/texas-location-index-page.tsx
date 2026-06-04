import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { LocationSeoCta } from "@/components/service-area/location-seo-cta";
import { LocationSeoJsonLd } from "@/components/service-area/location-seo-json-ld";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy } from "@/i18n/texas-location-copy";
import {
  buildLocalizedMetadata,
  localeAlternates,
} from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
import {
  countyPagePath,
  TEXAS_COUNTIES,
  TEXAS_LOCATION_STATS,
  texasIndexPath,
} from "@/lib/texas-location-seo";

export function texasIndexMetadata(locale: HomeLocale): Metadata {
  const copy = getTexasLocationCopy(locale);
  if (locale === "es") {
    return buildLocalizedMetadata("es", "/service-area/texas", copy.meta);
  }
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: localeAlternates("/service-area/texas"),
  };
}

export function TexasLocationIndexPage({ locale }: { locale: HomeLocale }) {
  const copy = getTexasLocationCopy(locale);
  const canonicalPath = texasIndexPath(locale);

  const byLetter = new Map<string, typeof TEXAS_COUNTIES>();
  for (const county of TEXAS_COUNTIES) {
    const letter = county.county[0]?.toUpperCase() ?? "#";
    const bucket = byLetter.get(letter) ?? [];
    bucket.push(county);
    byLetter.set(letter, bucket);
  }

  const letters = [...byLetter.keys()].sort();

  return (
    <div className="py-10 sm:py-14">
      <LocationSeoJsonLd
        pageTitle={copy.meta.title}
        pageDescription={copy.meta.description}
        canonicalPath={canonicalPath}
        breadcrumbs={[
          { name: copy.breadcrumbHome, path: localeSitePath("/", locale) },
          { name: copy.breadcrumbServiceArea, path: localeSitePath("/service-area", locale) },
          { name: copy.breadcrumbTexas, path: canonicalPath },
        ]}
      />
      <Container>
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-semibold tracking-widest text-white/60">{copy.indexEyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.indexTitle}</h1>
            <p className="max-w-3xl text-base text-muted">{copy.indexIntro}</p>
            <p className="text-sm text-white/55">
              {copy.countiesCitiesStats(
                TEXAS_LOCATION_STATS.countyCount,
                TEXAS_LOCATION_STATS.cityCount,
              )}
            </p>
            <LocationSeoCta />
          </header>

          <div className="space-y-8">
            {letters.map((letter) => (
              <section key={letter} className="glass-surface rounded-2xl border border-white/10 p-5">
                <h2 className="text-lg font-semibold text-emerald-100">{letter}</h2>
                <ul className="mt-4 columns-2 gap-x-6 text-sm sm:columns-3 lg:columns-4">
                  {(byLetter.get(letter) ?? []).map((county) => (
                    <li key={county.countySlug} className="mb-2 break-inside-avoid">
                      <Link
                        href={countyPagePath(county.countySlug, locale)}
                        className="text-emerald-200 underline-offset-2 hover:underline"
                      >
                        {copy.countyLinkLabel(county.county)}
                      </Link>
                      <span className="text-white/40">{copy.citiesCountSuffix(county.cities.length)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
