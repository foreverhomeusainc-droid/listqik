import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { LocationSeoJsonLd } from "@/components/service-area/location-seo-json-ld";
import { getCountyLandingCopy } from "@/i18n/county-landing-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy, localizedCoverageLabel } from "@/i18n/texas-location-copy";
import { locationAlternates } from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
import { startNowSubsonicPricingHref } from "@/lib/stripe-subsonic-landing-promo";
import {
  cityPagePath,
  countyCoverageTier,
  countyPagePath,
  countySeoDescription,
  countySeoTitle,
  formatTexasLocationDisplayName,
  getCountyBySlug,
  isActiveListQikCounty,
  texasIndexPath,
} from "@/lib/texas-location-seo";

function GetListedButton({
  locale,
  label,
  className = "",
  size = "default",
}: {
  locale: HomeLocale;
  label: string;
  className?: string;
  size?: "default" | "large";
}) {
  const sizeClass =
    size === "large"
      ? "min-h-[52px] px-9 text-base sm:min-h-[56px] sm:px-10"
      : "min-h-[48px] px-7 text-sm";

  return (
    <Link
      href={startNowSubsonicPricingHref(locale)}
      className={`inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/30 font-semibold tracking-wide text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400/40 ${sizeClass} ${className}`}
    >
      {label}
    </Link>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">{children}</h2>
  );
}

export async function generateTexasCountyMetadata(
  locale: HomeLocale,
  params: Promise<{ countySlug: string }>,
): Promise<Metadata> {
  const { countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) return {};

  const tier = countyCoverageTier(county.county);
  const enPath = countyPagePath(countySlug, "en");
  const title = countySeoTitle(county.county, locale);
  const description = countySeoDescription(county.county, tier, county.cities.length, locale);
  const hreflang = locationAlternates(enPath);

  return {
    title,
    description,
    alternates: {
      ...hreflang,
      canonical: countyPagePath(countySlug, locale),
    },
    openGraph: { title, description },
  };
}

export async function TexasCountyLocationPage({
  locale,
  params,
}: {
  locale: HomeLocale;
  params: Promise<{ countySlug: string }>;
}) {
  const { countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) notFound();

  const nav = getTexasLocationCopy(locale);
  const copy = getCountyLandingCopy(locale);
  const tier = countyCoverageTier(county.county);
  const active = isActiveListQikCounty(county.county);
  const title = countySeoTitle(county.county, locale);
  const description = countySeoDescription(county.county, tier, county.cities.length, locale);
  const path = countyPagePath(countySlug, locale);

  return (
    <div>
      <LocationSeoJsonLd
        pageTitle={title}
        pageDescription={description}
        canonicalPath={path}
        countyName={county.county}
        breadcrumbs={[
          { name: nav.breadcrumbHome, path: localeSitePath("/", locale) },
          { name: nav.breadcrumbServiceArea, path: localeSitePath("/service-area", locale) },
          { name: nav.breadcrumbTexas, path: texasIndexPath(locale) },
          { name: nav.countyLinkLabel(county.county), path },
        ]}
      />

      {/* Offer-first hero */}
      <section className="relative overflow-hidden border-b border-emerald-500/25 bg-gradient-to-br from-emerald-950 via-black to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]"
        />
        <Container className="relative py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/95 sm:text-sm">
              {copy.heroEyebrow(county.county)}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
              {copy.heroTitle(county.county)}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-emerald-50/90 sm:text-lg">{copy.heroSubtitle}</p>
            <div className="mt-7 flex justify-center">
              <GetListedButton locale={locale} label={copy.getListedNow} size="large" />
            </div>
            <p className="mt-5 text-xs font-medium tracking-wide text-white/55 sm:text-sm">{copy.heroTrustLine}</p>
          </div>

          <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.heroBullets.map((item) => (
              <li
                key={item}
                className="flex h-full items-start gap-3 rounded-xl border border-emerald-500/20 bg-black/35 px-4 py-3 text-left text-sm text-emerald-50/85"
              >
                <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.map((item, index) => (
              <div
                key={item.title}
                className="glass-surface flex h-full flex-col rounded-2xl border border-emerald-500/20 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-950/40 text-lg font-bold text-emerald-200">
                  {index + 1}
                </div>
                <h2 className="text-base font-semibold text-white">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="border-y border-white/10 bg-black/20 py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading>{copy.compareTitle}</SectionHeading>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex h-full flex-col rounded-2xl border border-emerald-400/40 bg-emerald-950/25 p-6">
                <p className="text-xs font-semibold tracking-widest text-emerald-300">{copy.compareListQik.label}</p>
                <p className="mt-3 text-2xl font-semibold text-emerald-100">{copy.compareListQik.fee}</p>
                <p className="mt-2 text-sm text-white/70">{copy.compareListQik.note}</p>
              </div>
              <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-black/30 p-6">
                <p className="text-xs font-semibold tracking-widest text-white/50">{copy.compareTraditional.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white/90">{copy.compareTraditional.fee}</p>
                <p className="mt-2 text-sm text-white/60">{copy.compareTraditional.note}</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <GetListedButton locale={locale} label={copy.getListedNow} />
            </div>
          </div>
        </Container>
      </section>

      {/* Coverage info */}
      <section className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-black py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-xs font-semibold tracking-widest text-emerald-300/80">
              {localizedCoverageLabel(tier, locale).toUpperCase()}
            </p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{copy.infoTitle(county.county)}</h2>
            <p className="text-base leading-relaxed text-emerald-50/85 sm:text-lg">
              {active ? copy.infoActive(county.county) : copy.infoInactive(county.county)}
            </p>
          </div>
        </Container>
      </section>

      {/* MLS portals */}
      <section className="border-b border-white/10 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold tracking-widest text-white/50">{copy.mlsTitle}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {copy.mlsPortals.map((portal) => (
                <span
                  key={portal}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 sm:px-4"
                >
                  {portal}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Property types + FAQ — stacked, balanced grids */}
      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl space-y-14">
            <div>
              <SectionHeading>{copy.propertyTypesTitle}</SectionHeading>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {copy.propertyTypes.map((type) => (
                  <li
                    key={type}
                    className="flex min-h-[3.5rem] items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/15 px-4 py-3 text-center text-sm font-medium leading-snug text-emerald-100/90"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading>{copy.faqTitle}</SectionHeading>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {copy.faqItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-full flex-col rounded-xl border border-white/10 bg-black/25 p-5"
                  >
                    <h3 className="text-sm font-semibold text-emerald-100 sm:text-base">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Cities */}
      {county.cities.length > 0 ? (
        <section className="border-t border-white/10 py-12 sm:py-14">
          <Container>
            <div className="mx-auto max-w-5xl text-center">
              <SectionHeading>{copy.citiesSectionTitle(county.county)}</SectionHeading>
              <p className="mt-3 text-sm text-white/60">{copy.citiesSectionIntro(county.cities.length)}</p>
              <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                {county.cities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={cityPagePath(county.countySlug, city.slug, locale)}
                      className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-950/20 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-400/40 hover:bg-emerald-900/30"
                    >
                      {formatTexasLocationDisplayName(city.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="border-t border-emerald-500/20 bg-emerald-950/20 py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{copy.finalCtaTitle}</h2>
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">{copy.finalCtaBody}</p>
            <div className="flex justify-center pt-2">
              <GetListedButton locale={locale} label={copy.getListedNow} size="large" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
