import type { HomeLocale } from "@/i18n/home-locale";

/** Query param value: `/pricing?plan=subsonic&promo=start-now` (attribution + auto-intake). */
export const START_NOW_SUBSONIC_PROMO = "start-now";

export function isStartNowSubsonicPromo(value: string | undefined | null): boolean {
  return value?.trim().toLowerCase() === START_NOW_SUBSONIC_PROMO;
}

export function startNowSubsonicPricingHref(locale?: HomeLocale): string {
  const query = `?plan=subsonic&promo=${START_NOW_SUBSONIC_PROMO}`;
  if (locale === "es") return `/es/pricing${query}`;
  return `/pricing${query}`;
}

/** True when URL should auto-select Subsonic and open step 1 (property address) intake. */
export function shouldOpenSubsonicIntakeFromSearchParams(
  params: Pick<URLSearchParams, "get">,
): boolean {
  const plan = params.get("plan")?.trim().toLowerCase();
  return plan === "subsonic" && isStartNowSubsonicPromo(params.get("promo"));
}
