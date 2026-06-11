"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { isTrackableMarketingPath, trackLandingEvent } from "@/lib/landing-analytics";

export function LandingPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !isTrackableMarketingPath(pathname)) return;

    const key = `${pathname}?${searchParams.toString()}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    trackLandingEvent({
      eventType: "page_view",
      path: pathname,
    });
  }, [pathname, searchParams]);

  return null;
}
