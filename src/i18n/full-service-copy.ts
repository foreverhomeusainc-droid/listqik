import type { HomeLocale } from "@/i18n/home-locale";

export type FullServiceTierId = "market-expert" | "local-expert";

export type FullServiceTierCopy = {
  id: FullServiceTierId;
  commission: string;
  commissionLabel: string;
  name: string;
  description: string;
  features: string[];
  cta: string;
  footnote: string;
  highlight?: boolean;
  badge?: string;
};

export type FullServiceCopy = {
  meta: { title: string; description: string };
  hud: { label: string; live: string };
  header: {
    title: string;
    subtitle: string;
    compareNote: string;
  };
  pricingLink: { label: string; href: string };
  fullServiceLink: { label: string };
  disclaimer: string;
  checkout: {
    loading: string;
    error: string;
    mailtoAlt: string;
    successBanner: string;
    cancelledBanner: string;
  };
  tiers: FullServiceTierCopy[];
};

const COPY: Record<HomeLocale, FullServiceCopy> = {
  en: {
    meta: {
      title: "Full Service Listing Commission | ListQik",
      description:
        "Texas full-service listing representation with licensed local Realtors. Market Expert from 1% commission; Local Expert in-person support from 2% listing commission.",
    },
    hud: { label: "LISTQIK FULL SERVICE", live: "TEXAS · LICENSED BROKERAGE" },
    header: {
      title: "Full-service listing representation",
      subtitle:
        "Choose the level of Realtor involvement you want. Both options include professional marketing, MLS syndication, negotiation, and transaction coordination through a licensed Texas brokerage.",
      compareNote:
        "Prefer a flat-fee listing plan instead? Compare self-directed packages on our pricing page.",
    },
    pricingLink: { label: "View flat-fee pricing plans", href: "/pricing" },
    fullServiceLink: { label: "Full service commissions" },
    disclaimer:
      "Listing commission percentages are quoted at the listing side only and apply to qualifying Texas residential listings placed through ListQik's broker network. Buyer-agent compensation, closing costs, and market-specific MLS fees are separate. Local Expert requires a minimum 2% listing commission. One-time onboarding fees ($199 Market Expert, $299 Local Expert) are charged at signup via Stripe; listing commission is due at closing per your agreement.",
    checkout: {
      loading: "Starting secure checkout…",
      error: "Checkout is unavailable. Please email concierge@listqik.com.",
      mailtoAlt: "Or email concierge@listqik.com",
      successBanner: "Payment received — a ListQik concierge will contact you shortly.",
      cancelledBanner: "Checkout was cancelled. You can try again or email concierge@listqik.com.",
    },
    tiers: [
      {
        id: "market-expert",
        commission: "1%",
        commissionLabel: "listing commission",
        name: "Market Expert",
        badge: "Most popular",
        highlight: true,
        description:
          "Your licensed Realtor handles pricing, marketing, negotiation, and closing using the same data and workflows top-producing teams rely on—efficient, lean, and fully represented.",
        features: [
          "Professional photography and video coordination",
          "MLS plus major portals (Zillow, Realtor.com, Redfin, etc.)",
          "For-sale sign and lockbox coordination",
          "Open house planning and hosting support",
          "Expert offer negotiation",
          "Full transaction management through closing",
          "Comprehensive pricing and market strategy",
        ],
        cta: "Get started at 1%",
        footnote:
          "Best for most sellers—strong savings versus a traditional ~3% listing commission with full professional representation.",
      },
      {
        id: "local-expert",
        commission: "2%",
        commissionLabel: "listing commission",
        name: "Local Expert",
        description:
          "Everything in Market Expert, plus a local Realtor physically present for key moments—walk-throughs, staging guidance, showings, inspections, and closing coordination.",
        features: [
          "Everything in Market Expert, plus:",
          "In-person home walk-through and staging advice",
          "Neighborhood-specific market expertise",
          "Realtor present at showings and inspections",
          "Hands-on closing coordination",
        ],
        cta: "Get started at 2%",
        footnote:
          "Best when you want a local Realtor on-site at every major step—still well below a traditional full commission listing.",
      },
    ],
  },
  es: {
    meta: {
      title: "Comisión de servicio completo | ListQik",
      description:
        "Representación completa de listado en Texas con Realtors locales con licencia. Market Expert desde 1% de comisión; Local Expert con apoyo presencial desde 2% de comisión de listado.",
    },
    hud: { label: "SERVICIO COMPLETO LISTQIK", live: "TEXAS · CORRETAJE CON LICENCIA" },
    header: {
      title: "Representación completa para su listado",
      subtitle:
        "Elija el nivel de participación de su Realtor. Ambas opciones incluyen marketing profesional, sindicación MLS, negociación y coordinación de transacción con una correduría con licencia en Texas.",
      compareNote:
        "¿Prefiere un plan de tarifa fija? Compare los paquetes en nuestra página de precios.",
    },
    pricingLink: { label: "Ver planes de tarifa fija", href: "/pricing" },
    fullServiceLink: { label: "Comisiones de servicio completo" },
    disclaimer:
      "Los porcentajes de comisión de listado aplican solo al lado del vendedor en listados residenciales elegibles en Texas a través de la red de corretaje de ListQik. La compensación al agente del comprador, costos de cierre y tarifas MLS son independientes. Local Expert requiere un mínimo del 2% de comisión de listado. Tarifa única de incorporación ($199 Market Expert, $299 Local Expert) al registrarse; la comisión de listado se paga al cierre según su acuerdo.",
    checkout: {
      loading: "Iniciando pago seguro…",
      error: "El pago no está disponible. Escriba a concierge@listqik.com.",
      mailtoAlt: "O escriba a concierge@listqik.com",
      successBanner: "Pago recibido — un concierge de ListQik se comunicará pronto.",
      cancelledBanner: "Pago cancelado. Puede intentar de nuevo o escribir a concierge@listqik.com.",
    },
    tiers: [
      {
        id: "market-expert",
        commission: "1%",
        commissionLabel: "comisión de listado",
        name: "Market Expert",
        badge: "Más popular",
        highlight: true,
        description:
          "Su Realtor con licencia maneja precios, marketing, negociación y cierre con datos y flujos de trabajo de equipos de alto rendimiento—eficiente y con representación completa.",
        features: [
          "Coordinación de fotografía y video profesional",
          "MLS y portales principales (Zillow, Realtor.com, Redfin, etc.)",
          "Coordinación de letrero y lockbox",
          "Apoyo para casas abiertas",
          "Negociación experta de ofertas",
          "Gestión completa de la transacción hasta el cierre",
          "Estrategia integral de precios y mercado",
        ],
        cta: "Comenzar al 1%",
        footnote:
          "Ideal para la mayoría de vendedores—ahorro frente a una comisión tradicional de ~3% con representación profesional.",
      },
      {
        id: "local-expert",
        commission: "2%",
        commissionLabel: "comisión de listado",
        name: "Local Expert",
        description:
          "Todo lo de Market Expert, más un Realtor local presente en persona en momentos clave—recorridos, staging, showings, inspecciones y coordinación de cierre.",
        features: [
          "Todo lo de Market Expert, más:",
          "Recorrido presencial y consejo de staging",
          "Experiencia de mercado específica del vecindario",
          "Realtor presente en showings e inspecciones",
          "Coordinación presencial del cierre",
        ],
        cta: "Comenzar al 2%",
        footnote:
          "Ideal si desea un Realtor local en cada paso importante—aún por debajo de una comisión tradicional completa.",
      },
    ],
  },
};

export function getFullServiceCopy(locale: HomeLocale): FullServiceCopy {
  return COPY[locale];
}
