"use client";

import Link from "next/link";
import { HeaderSignOutButton } from "@/components/auth/header-sign-out-button";
import { Container } from "@/components/container";
import { ListQikLogo } from "@/components/listqik-logo";
import { NavLink } from "@/components/nav-link";
import { NavServicesDropdown } from "@/components/nav-services-dropdown";
import { getSiteShellChromeCopy, SITE_CHROME_LOCALE } from "@/i18n/site-chrome-copy";
import { localeSitePath } from "@/lib/locale-site-path";

type SiteHeaderChromeProps = {
  isAuthenticated: boolean;
};

export function SiteHeaderChrome({ isAuthenticated }: SiteHeaderChromeProps) {
  const t = getSiteShellChromeCopy().header;
  const homeHref = localeSitePath("/", SITE_CHROME_LOCALE);
  const pricingHref = localeSitePath("/pricing", SITE_CHROME_LOCALE);
  const aboutHref = localeSitePath("/about", SITE_CHROME_LOCALE);
  const universityHref = localeSitePath("/listqik-university", SITE_CHROME_LOCALE);
  const resourcesHref = localeSitePath("/resources/blogs", SITE_CHROME_LOCALE);
  const listingsHref = localeSitePath("/listings", SITE_CHROME_LOCALE);
  const calculatorsHref = localeSitePath("/calculators", SITE_CHROME_LOCALE);
  const buyersHref = localeSitePath("/buyers", SITE_CHROME_LOCALE);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-500/25 bg-black/55 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
      />
      <Container className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={homeHref} className="group inline-flex items-center">
            <ListQikLogo variant="header" priority />
          </Link>
        </div>

        <nav aria-label={t.navLabel} className="hidden items-center gap-1 md:flex">
          <NavLink href={pricingHref}>{t.pricing}</NavLink>
          <NavServicesDropdown />
          <NavLink href={aboutHref}>{t.about}</NavLink>
          <NavLink href={universityHref}>{t.university}</NavLink>
          <NavLink href={calculatorsHref}>{t.calculators}</NavLink>
          <NavLink href={buyersHref}>{t.buyers}</NavLink>
          <NavLink href={resourcesHref}>{t.resources}</NavLink>
        </nav>

        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/35 bg-emerald-950/30 px-3 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-900/35 sm:inline-flex"
              >
                {t.dashboard}
              </Link>
              <HeaderSignOutButton label={t.logOut} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/25 px-3 text-sm font-semibold tracking-wide text-emerald-100/90 transition hover:border-emerald-300/50 sm:inline-flex"
              >
                {t.logIn}
              </Link>
              <Link
                href={listingsHref}
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/35 bg-emerald-950/30 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-900/35 lg:inline-flex"
              >
                {t.viewListings}
              </Link>
              <Link
                href={pricingHref}
                className="inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
              >
                {t.startListing}
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
