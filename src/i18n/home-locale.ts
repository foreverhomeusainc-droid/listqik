import { dispatchLocaleChange } from "@/lib/locale-events";

export type HomeLocale = "en" | "es";

export const HOME_LOCALE_STORAGE_KEY = "listqik-home-locale";

export function isHomeLocale(value: string | null | undefined): value is HomeLocale {
  return value === "en" || value === "es";
}

export function readStoredHomeLocale(): HomeLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HOME_LOCALE_STORAGE_KEY);
    return isHomeLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function storeHomeLocale(locale: HomeLocale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HOME_LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
  document.documentElement.lang = locale;
  dispatchLocaleChange(locale);
}
