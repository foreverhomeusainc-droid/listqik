"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavLink } from "@/components/nav-link";
import { NavServicesDropdown } from "@/components/nav-services-dropdown";
import { getSiteShellChromeCopy, SITE_CHROME_LOCALE } from "@/i18n/site-chrome-copy";
import { localeSitePath } from "@/lib/locale-site-path";

type SiteMobileNavProps = {
  isAuthenticated: boolean;
};

export function SiteMobileNav({ isAuthenticated }: SiteMobileNavProps) {
  const t = getSiteShellChromeCopy().header;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const pricingHref = localeSitePath("/pricing", SITE_CHROME_LOCALE);
  const aboutHref = localeSitePath("/about", SITE_CHROME_LOCALE);
  const universityHref = localeSitePath("/listqik-university", SITE_CHROME_LOCALE);
  const resourcesHref = localeSitePath("/resources/blogs", SITE_CHROME_LOCALE);
  const listingsHref = localeSitePath("/listings", SITE_CHROME_LOCALE);
  const investorsHref = localeSitePath("/investors", SITE_CHROME_LOCALE);
  const buyersHref = localeSitePath("/buyers", SITE_CHROME_LOCALE);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-950/30 text-emerald-100"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="site-mobile-nav-panel"
          className="absolute inset-x-0 top-16 z-50 border-b border-emerald-500/25 bg-black/95 backdrop-blur"
        >
          <nav aria-label={t.navLabel} className="flex flex-col gap-1 px-4 py-4">
            <NavLink href={pricingHref} onClick={() => setOpen(false)}>
              {t.pricing}
            </NavLink>
            <div className="px-3 py-2">
              <NavServicesDropdown />
            </div>
            <NavLink href={aboutHref} onClick={() => setOpen(false)}>
              {t.about}
            </NavLink>
            <NavLink href={universityHref} onClick={() => setOpen(false)}>
              {t.university}
            </NavLink>
            <NavLink href={investorsHref} onClick={() => setOpen(false)}>
              {t.investors}
            </NavLink>
            <NavLink href={buyersHref} onClick={() => setOpen(false)}>
              {t.buyers}
            </NavLink>
            <NavLink href={resourcesHref} onClick={() => setOpen(false)}>
              {t.resources}
            </NavLink>
            <NavLink href={listingsHref} onClick={() => setOpen(false)}>
              {t.viewListings}
            </NavLink>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center rounded-full border border-emerald-400/35 bg-emerald-950/30 px-4 py-2.5 text-sm font-semibold text-emerald-100"
              >
                {t.dashboard}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center rounded-full border border-emerald-400/25 px-4 py-2.5 text-sm font-semibold text-emerald-100/90"
              >
                {t.logIn}
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
