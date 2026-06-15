import type { HomeLocale } from "@/i18n/home-locale";

export type GhlFormCopy = {
  sectionKicker: string;
  title: string;
  subtitle: string;
};

const COPY: Record<HomeLocale, GhlFormCopy> = {
  en: {
    sectionKicker: "Contact",
    title: "Questions before you list?",
    subtitle: "Send us a message and a licensed Texas brokerage team member will follow up.",
  },
  es: {
    sectionKicker: "Contacto",
    title: "¿Preguntas antes de publicar?",
    subtitle: "Envíenos un mensaje y un miembro del equipo de correduría con licencia en Texas le responderá.",
  },
};

export function getGhlFormCopy(locale: HomeLocale): GhlFormCopy {
  return COPY[locale];
}
