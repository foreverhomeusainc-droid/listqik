import type { HomeLocale } from "@/i18n/home-locale";

export type AboutCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  intro: string;
  optimizeTitle: string;
  cards: { title: string; body: string }[];
  styleTitle: string;
  styleBody: string;
};

const COPY: Record<HomeLocale, AboutCopy> = {
  en: {
    meta: {
      title: "About | ListQik",
      description:
        "Learn how ListQik.com and Resolution Realty Group help Texas sellers list through a licensed brokerage with broker-backed guidance.",
    },
    eyebrow: "ABOUT LISTQIK",
    title: "A simpler way to list your Texas home.",
    intro:
      "ListQik.com helps homeowners list with clear steps, broker-backed support, and tools that make each part of the process easier to understand.",
    optimizeTitle: "What we optimize for",
    cards: [
      {
        title: "Keep more from your sale",
        body: "Compare fee scenarios and estimate what you may keep with the built-in calculator.",
      },
      {
        title: "Faster setup",
        body: "Move from listing details to review and publish in a guided flow.",
      },
      {
        title: "Clear compliance support",
        body: "Your listing goes through broker-backed review to help avoid common issues.",
      },
    ],
    styleTitle: "Our writing style",
    styleBody:
      "We use simple, direct wording so homeowners can quickly understand what to do next.",
  },
  es: {
    meta: {
      title: "Nosotros | ListQik",
      description:
        "Conozca cómo ListQik.com y Resolution Realty Group ayudan a vendedores en Texas con un corretaje con licencia y orientación profesional.",
    },
    eyebrow: "ACERCA DE LISTQIK",
    title: "Una forma más simple de publicar su casa en Texas.",
    intro:
      "ListQik.com ayuda a los propietarios a publicar con pasos claros, soporte respaldado por un corretaje y herramientas que facilitan cada parte del proceso.",
    optimizeTitle: "En qué nos enfocamos",
    cards: [
      {
        title: "Conserve más de su venta",
        body: "Compare escenarios de tarifas y estime lo que podría conservar con la calculadora integrada.",
      },
      {
        title: "Configuración más rápida",
        body: "Pase de los detalles del listado a la revisión y publicación en un flujo guiado.",
      },
      {
        title: "Soporte de cumplimiento claro",
        body: "Su listado pasa por una revisión respaldada por el corretaje para ayudar a evitar problemas comunes.",
      },
    ],
    styleTitle: "Nuestro estilo de comunicación",
    styleBody:
      "Usamos un lenguaje simple y directo para que los propietarios entiendan rápidamente qué hacer a continuación.",
  },
};

export function getAboutCopy(locale: HomeLocale): AboutCopy {
  return COPY[locale] ?? COPY.en;
}
