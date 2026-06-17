import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { GhlInlineFormSection } from "@/components/marketing/ghl-inline-form-section";
import { SocialLeadCtaSection } from "@/components/marketing/social-lead-cta-section";
import { SubsonicPricingLink } from "@/components/marketing/subsonic-pricing-link";
import { LocationSeoJsonLd } from "@/components/service-area/location-seo-json-ld";
import {
  formatCityListForCopy,
  getCountyHeroContent,
  getCountyHowItWorksSteps,
  getCountyLandingCopy,
  prominentCountyCityNames,
} from "@/i18n/county-landing-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import { getTexasLocationCopy, localizedCoverageLabel } from "@/i18n/texas-location-copy";
import { locationAlternates } from "@/lib/locale-metadata";
import { localeSitePath } from "@/lib/locale-site-path";
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

function StartListingButton({
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
    <SubsonicPricingLink
      locale={locale}
      className={`inline-flex items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/30 font-semibold tracking-wide text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400/40 ${sizeClass} ${className}`}
    >
      {label}
    </SubsonicPricingLink>
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
  const title = countySeoTitle(county.county, tier, locale);
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
  const hero = getCountyHeroContent(tier, county.county, locale);
  const howItWorks = getCountyHowItWorksSteps(tier, locale);
  const prominentCities = prominentCountyCityNames(county.cities);
  const cityListText = formatCityListForCopy(prominentCities, locale);
  const title = countySeoTitle(county.county, tier, locale);
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

      {/* Above the fold — Quality Score hero */}
      <section className="relative overflow-hidden border-b border-emerald-500/25 bg-gradient-to-br from-emerald-950 via-black to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]"
        />
        <Container className="relative py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300/95 sm:text-sm">
              {hero.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
              {hero.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-emerald-50/90 sm:text-lg">{hero.heroSubtitle}</p>

            <div className="mt-6 flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-950/50 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-100 sm:text-sm">
                <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />
                {hero.mlsTrustBadge}
              </span>
              <StartListingButton locale={locale} label={copy.startYourListing} size="large" />
            </div>

            <p className="mt-5 text-xs font-medium tracking-wide text-white/55 sm:text-sm">{copy.heroTrustLine}</p>
          </div>
        </Container>
      </section>

      {/* Local proof */}
      <section className="border-b border-white/10 bg-black/30 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-lg font-semibold text-emerald-100 sm:text-xl">
              {copy.localProofTitle(county.county)}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/75">
              {prominentCities.length >= 2
                ? copy.localProofBody(county.county, cityListText)
                : copy.localProofFallback(county.county)}
            </p>
            {prominentCities.length > 0 ? (
              <p className="mt-4 text-sm font-medium text-emerald-200/90">
                {prominentCities.join(" · ")}
                {county.cities.length > prominentCities.length
                  ? ` · +${county.cities.length - prominentCities.length} more`
                  : null}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      {/* How it works — 3 steps */}
      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl">
            <SectionHeading>{copy.howItWorksTitle}</SectionHeading>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {howItWorks.map((step, index) => (
                <li
                  key={step.title}
                  className="glass-surface flex h-full flex-col rounded-2xl border border-emerald-500/20 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-950/40 text-lg font-bold text-emerald-200">
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Pricing transparency */}
      <section className="border-y border-white/10 bg-black/20 py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading>{copy.pricingTransparencyTitle}</SectionHeading>
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

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-200/90">
                {copy.pricingIncludesTitle}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/75">
                {copy.pricingIncludes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-emerald-50/85">{copy.pricingClosingDisclosure}</p>
            </div>

            <div className="mt-8 flex justify-center">
              <StartListingButton locale={locale} label={copy.startYourListing} />
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

      {/* Property types + FAQ */}
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
              <StartListingButton locale={locale} label={copy.startYourListing} size="large" />
            </div>
          </div>
        </Container>
      </section>

      <SocialLeadCtaSection locale={locale} />
      <GhlInlineFormSection locale={locale} />
    </div>
  );
}
