import type { ReactNode } from "react";
import { Suspense } from "react";
import { GhlExternalTracking } from "@/components/analytics/ghl-external-tracking";
import { LandingPageTracker } from "@/components/analytics/landing-page-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteLocaleProvider } from "@/components/site-locale-provider";

export default function EsSiteLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SiteLocaleProvider initialLocale="es">
        <Suspense fallback={null}>
          <LandingPageTracker />
        </Suspense>
        <SiteHeader />
        {children}
        <SiteFooter />
        <GhlExternalTracking />
      </SiteLocaleProvider>
    </Suspense>
  );
}

