export const LOCALE_CHANGE_EVENT = "listqik-locale-change";

export function dispatchLocaleChange(locale: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LOCALE_CHANGE_EVENT, { detail: { locale } }),
  );
}
