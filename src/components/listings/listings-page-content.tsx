"use client";

import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { ListingsExplorer } from "@/components/listings-explorer";
import { useSiteLocale } from "@/components/site-locale-provider";
import type { Listing } from "@/data/types";
import { getListingsCopy } from "@/i18n/listings-copy";

export function ListingsPageContent({
  listings,
  dealsOfTheWeek = [],
}: {
  listings: Listing[];
  dealsOfTheWeek?: Listing[];
}) {
  const { locale, ready } = useSiteLocale();
  const copy = getListingsCopy(locale);

  return (
    <div
      className={[
        "py-10 transition-opacity duration-200 sm:py-14",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <Container>
        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-widest text-white/60">
            {copy.eyebrow}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {copy.title}
          </h1>
          <p className="text-base text-muted">{copy.intro}</p>
        </div>

        {dealsOfTheWeek.length > 0 ? (
          <section className="mt-10 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">
                {copy.dealsEyebrow}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                {copy.dealsTitle}
              </h2>
              <p className="mt-1 text-sm text-white/55">{copy.dealsIntro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dealsOfTheWeek.map((l) => (
                <ListingCard key={`deal-${l.slug}`} listing={l} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8">
          <ListingsExplorer listings={listings} />
        </div>
      </Container>
    </div>
  );
}
