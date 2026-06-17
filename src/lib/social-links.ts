import type { HomeLocale } from "@/i18n/home-locale";

export const LISTQIK_YOUTUBE_CHANNEL_URL_EN = "https://www.youtube.com/@listquick";
export const LISTQIK_YOUTUBE_CHANNEL_URL_ES = "https://www.youtube.com/@listquick-x3c";
export const LISTQIK_TIKTOK_URL = "https://www.tiktok.com/@listqik";
export const LISTQIK_INSTAGRAM_URL = "https://www.instagram.com/_listqik";
export const LISTQIK_FACEBOOK_URL = "https://www.facebook.com/share/18j8MvDnGN/";
export const LISTQIK_FACEBOOK_MESSENGER_URL = "https://m.me/1098082650060394";

/** Footer / marketing links — English vs other-language YouTube channels. */
export function getListQikYoutubeChannelUrl(locale: HomeLocale): string {
  return locale === "en" ? LISTQIK_YOUTUBE_CHANNEL_URL_EN : LISTQIK_YOUTUBE_CHANNEL_URL_ES;
}
