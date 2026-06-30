"use client";

import { Container } from "@/components/container";
import { DealsOfTheWeekSection } from "@/components/listings/deals-of-the-week-section";
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
          <DealsOfTheWeekSection
            className="mt-10"
            deals={dealsOfTheWeek}
            locale={locale}
            eyebrow={copy.dealsEyebrow}
            title={copy.dealsTitle}
            intro={copy.dealsIntro}
          />
        ) : null}

        <div className="mt-8">
          <ListingsExplorer listings={listings} />
        </div>
      </Container>
    </div>
  );
}
