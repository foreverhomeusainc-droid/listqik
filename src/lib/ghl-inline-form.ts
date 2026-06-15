import type { HomeLocale } from "@/i18n/home-locale";

export type GhlInlineFormConfig = {
  formId: string;
  formName: string;
  iframeSrc: string;
  embedScriptSrc: string;
  heightPx: number;
};

const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

const GHL_INLINE_FORMS: Record<HomeLocale, GhlInlineFormConfig> = {
  en: {
    formId: "XJQeeqDnR1fLyqDY02JJ",
    formName: "ListQik GHL Form",
    iframeSrc: "https://api.leadconnectorhq.com/widget/form/XJQeeqDnR1fLyqDY02JJ",
    embedScriptSrc: EMBED_SCRIPT_SRC,
    heightPx: 972,
  },
  es: {
    formId: "fz3273iBCRPwnH5mp0Lz",
    formName: "ListQik GHL Form - ES",
    iframeSrc: "https://api.leadconnectorhq.com/widget/form/fz3273iBCRPwnH5mp0Lz",
    embedScriptSrc: EMBED_SCRIPT_SRC,
    heightPx: 1024,
  },
};

/** @deprecated Use getGhlInlineForm(locale) for locale-aware embeds. */
export const GHL_INLINE_FORM = GHL_INLINE_FORMS.en;

export function getGhlInlineForm(locale: HomeLocale): GhlInlineFormConfig {
  return GHL_INLINE_FORMS[locale] ?? GHL_INLINE_FORMS.en;
}

export function ghlInlineFormIframeId(formId: string): string {
  return `inline-${formId}`;
}
