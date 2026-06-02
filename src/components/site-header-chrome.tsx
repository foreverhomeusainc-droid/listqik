"use client";

import Link from "next/link";
import { HeaderSignOutButton } from "@/components/auth/header-sign-out-button";
import { Container } from "@/components/container";
import { NavLink } from "@/components/nav-link";
import { NavServicesDropdown } from "@/components/nav-services-dropdown";
import { useSiteLocale } from "@/components/site-locale-provider";
import { localeSitePath } from "@/lib/locale-site-path";

type SiteHeaderChromeProps = {
  isAuthenticated: boolean;
};

export function SiteHeaderChrome({ isAuthenticated }: SiteHeaderChromeProps) {
  const { locale, chrome, ready } = useSiteLocale();
  const t = chrome.header;
  const homeHref = localeSitePath("/", locale);
  const pricingHref = localeSitePath("/pricing", locale);
  const aboutHref = localeSitePath("/about", locale);
  const universityHref = localeSitePath("/listqik-university", locale);
  const resourcesHref = localeSitePath("/resources/blogs", locale);
  const listingsHref = localeSitePath("/listings", locale);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-500/25 bg-black/55 backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent"
      />
      <Container className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={homeHref} className="group inline-flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/35 bg-emerald-950/35 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
            >
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-200">
                LQ
              </span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-emerald-100">ListQik</span>
          </Link>
        </div>

        <nav
          aria-label={ready ? t.navLabel : locale === "es" ? "Principal" : "Primary"}
          className="hidden items-center gap-1 md:flex"
        >
          <NavLink href={pricingHref}>{ready ? t.pricing : locale === "es" ? "Precios" : "Pricing"}</NavLink>
          <NavServicesDropdown />
          <NavLink href={aboutHref}>{ready ? t.about : locale === "es" ? "Nosotros" : "About"}</NavLink>
          <NavLink href={universityHref}>
            {ready ? t.university : locale === "es" ? "Universidad" : "University"}
          </NavLink>
          <NavLink href={resourcesHref}>
            {ready ? t.resources : locale === "es" ? "Recursos" : "Resources"}
          </NavLink>
        </nav>

        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/35 bg-emerald-950/30 px-3 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-900/35 sm:inline-flex"
              >
                {ready ? t.dashboard : locale === "es" ? "Panel" : "Dashboard"}
              </Link>
              <HeaderSignOutButton
                label={ready ? t.logOut : locale === "es" ? "Cerrar sesión" : "Log out"}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/25 px-3 text-sm font-semibold tracking-wide text-emerald-100/90 transition hover:border-emerald-300/50 sm:inline-flex"
              >
                {ready ? t.logIn : locale === "es" ? "Iniciar sesión" : "Log in"}
              </Link>
              <Link
                href={listingsHref}
                className="hidden min-h-[40px] items-center rounded-full border border-emerald-400/35 bg-emerald-950/30 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-900/35 lg:inline-flex"
              >
                {ready ? t.viewListings : locale === "es" ? "Ver propiedades" : "View Listings"}
              </Link>
              <Link
                href={pricingHref}
                className="inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
              >
                {ready ? t.startListing : locale === "es" ? "Publicar ahora" : "Start Listing"}
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
