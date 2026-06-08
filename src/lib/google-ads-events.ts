declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const INTAKE_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_INTAKE_SEND_TO?.trim();

/** Fire when Subsonic intake opens from a landing promo (county page, start-now, etc.). */
export function fireSubsonicIntakeStartedConversion(): void {
  if (typeof window === "undefined") return;

  const storageKey = "google-ads-intake-started";
  try {
    if (window.sessionStorage.getItem(storageKey) === "sent") return;
  } catch {
    /* ignore */
  }

  const gtag = window.gtag;
  if (typeof gtag !== "function") return;

  if (INTAKE_SEND_TO) {
    gtag("event", "conversion", { send_to: INTAKE_SEND_TO });
  }

  gtag("event", "subsonic_intake_started", {
    event_category: "listing_intake",
    event_label: "start-now-promo",
  });

  try {
    window.sessionStorage.setItem(storageKey, "sent");
  } catch {
    /* ignore */
  }
}
