"use client";

import { HomePageContent } from "@/components/home/home-page-content";

/** Locale is provided by `SiteLocaleProvider` in the site layout (`?lang=`, saved preference, or browser). */
export function HomePageShell() {
  return <HomePageContent />;
}
