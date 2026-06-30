import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/data/types";
import type { HomeLocale } from "@/i18n/home-locale";

type DealsOfTheWeekSectionProps = {
  deals: Listing[];
  locale?: HomeLocale;
  eyebrow: string;
  title: string;
  intro: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  emptyMessage?: string;
  className?: string;
};

export function DealsOfTheWeekSection({
  deals,
  locale = "en",
  eyebrow,
  title,
  intro,
  viewAllHref,
  viewAllLabel = "View all listings",
  emptyMessage,
  className = "",
}: DealsOfTheWeekSectionProps) {
  return (
    <section className={className} id="deals-of-the-week">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/65">{intro}</p>
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 justify-center rounded-full border border-amber-400/45 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-950/30"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>

      {deals.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {deals.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} locale={locale} />
          ))}
        </div>
      ) : emptyMessage ? (
        <p className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-6 text-sm text-white/55">
          {emptyMessage}
        </p>
      ) : null}
    </section>
  );
}
