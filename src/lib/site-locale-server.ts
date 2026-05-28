import { cookies } from "next/headers";
import { HOME_LOCALE_COOKIE_KEY, type HomeLocale, isHomeLocale } from "@/i18n/home-locale";

export async function getRequestHomeLocale(langParam?: string | null): Promise<HomeLocale> {
  if (isHomeLocale(langParam)) return langParam;
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(HOME_LOCALE_COOKIE_KEY)?.value;
  if (isHomeLocale(fromCookie)) return fromCookie;
  return "en";
}

export function homeOpenGraphLocale(locale: HomeLocale): string {
  return locale === "es" ? "es_US" : "en_US";
}
