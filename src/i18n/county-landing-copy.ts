import type { HomeLocale } from "@/i18n/home-locale";

export type CountyLandingCopy = {
  getListedNow: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: (county: string) => string;
  heroPriceLabel: string;
  heroBullets: string[];
  countyTitle: (county: string) => string;
  citiesIntro: string;
  benefits: { title: string; body: string }[];
  mlsTitle: string;
  mlsPortals: string[];
  infoTitle: (county: string) => string;
  infoActive: (county: string) => string;
  infoInactive: (county: string) => string;
  compareTitle: string;
  compareListQik: { label: string; fee: string; note: string };
  compareTraditional: { label: string; fee: string; note: string };
  propertyTypesTitle: string;
  propertyTypes: string[];
  faqTitle: string;
  faqItems: { title: string; body: string }[];
  citiesSectionTitle: (county: string) => string;
  citiesSectionIntro: (n: number) => string;
  finalCtaTitle: string;
  finalCtaBody: string;
};

const COPY: Record<HomeLocale, CountyLandingCopy> = {
  en: {
    getListedNow: "Get Listed Now",
    heroEyebrow: "TEXAS FLAT-FEE LISTING",
    heroTitle: "Sell your home with clear steps and keep more equity",
    heroSubtitle: (county) =>
      `Broker-backed MLS listing support for sellers in ${county} County, Texas.`,
    heroPriceLabel: "Subsonic plan from $79",
    heroBullets: [
      "One-time flat MLS listing fee",
      "Major portal distribution included",
      "Licensed brokerage compliance review",
      "You control buyer-agent offers",
      "No surprise listing-side commission",
    ],
    countyTitle: (county) => `ListQik listings in ${county} County, Texas`,
    citiesIntro: "Communities we help sellers reach in this county:",
    benefits: [
      {
        title: "Low flat fee",
        body: "Choose Subsonic and pay a simple upfront listing fee—not a 3% listing commission.",
      },
      {
        title: "Keep more equity",
        body: "ListQik.com targets about 1% total listing-side cost vs. ~3% with many traditional brokers.",
      },
      {
        title: "Flexible plans",
        body: "Compare Subsonic, Supersonic, and Hypersonic tiers and add marketing upgrades when you need them.",
      },
    ],
    mlsTitle: "Your listing can appear on major home-search sites",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "MLS feeds"],
    infoTitle: (county) => `Why sellers in ${county} County choose ListQik`,
    infoActive: (county) =>
      `${county} County is in ListQik's published Texas service footprint. Start intake online, compare plans, and work with licensed brokerage support for MLS submission and compliance.`,
    infoInactive: (county) =>
      `ListQik supports Texas sellers statewide. For ${county} County addresses, concierge can confirm broker availability, MLS path, and timing before you checkout.`,
    compareTitle: "Same MLS exposure—without a 6% listing commission stack",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promo + 0.50% at closing",
      note: "Flat upfront fee · broker-backed MLS listing",
    },
    compareTraditional: {
      label: "Traditional listing broker",
      fee: "~3% listing commission",
      note: "Typical full-service listing-side fee at closing",
    },
    propertyTypesTitle: "We list the property types sellers bring us",
    propertyTypes: ["Single-family homes", "Condos & townhomes", "Vacant land", "Investment properties"],
    faqTitle: "Flat-fee listing basics",
    faqItems: [
      {
        title: "What is a flat-fee listing?",
        body: "You pay a published upfront fee for marketing technology and brokerage-regulated listing workflow instead of a percentage listing commission.",
      },
      {
        title: "How does the process work?",
        body: "Pick a plan, complete seller intake, upload photos and disclosures, and your broker team prepares MLS submission after compliance review.",
      },
      {
        title: "Who handles MLS rules?",
        body: "Licensed brokerage support handles MLS submission, required forms, and advertising compliance for Texas listings.",
      },
      {
        title: "How do buyers reach me?",
        body: "Inquiries route to you. You decide how to respond and what buyer-agent compensation to offer within MLS rules.",
      },
    ],
    citiesSectionTitle: (county) => `Cities and towns in ${county} County`,
    citiesSectionIntro: (n) => `${n} communities with dedicated local ListQik pages.`,
    finalCtaTitle: "Ready to list in this county?",
    finalCtaBody: "Open Subsonic pricing, enter your property address, and start your seller intake in minutes.",
  },
  es: {
    getListedNow: "Publicar ahora",
    heroEyebrow: "LISTADO DE TARIFA FIJA EN TEXAS",
    heroTitle: "Venda su casa con pasos claros y conserve más capital",
    heroSubtitle: (county) =>
      `Apoyo MLS respaldado por correduría para vendedores en el condado de ${county}, Texas.`,
    heroPriceLabel: "Plan Subsonic desde $79",
    heroBullets: [
      "Tarifa MLS fija única",
      "Distribución en portales principales",
      "Revisión de cumplimiento con correduría con licencia",
      "Usted controla las ofertas del agente comprador",
      "Sin comisión sorpresa del lado del listado",
    ],
    countyTitle: (county) => `Listados ListQik en el condado de ${county}, Texas`,
    citiesIntro: "Comunidades que apoyamos en este condado:",
    benefits: [
      {
        title: "Tarifa fija baja",
        body: "Elija Subsonic y pague una tarifa de listado clara—no una comisión del 3% del listado.",
      },
      {
        title: "Conserve más capital",
        body: "ListQik.com apunta a ~1% del costo del listado vs. ~3% con muchos corredores tradicionales.",
      },
      {
        title: "Planes flexibles",
        body: "Compare Subsonic, Supersonic e Hypersonic y agregue mejoras de marketing cuando las necesite.",
      },
    ],
    mlsTitle: "Su listado puede aparecer en los principales sitios de búsqueda",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "Feeds MLS"],
    infoTitle: (county) => `Por qué vendedores en el condado de ${county} eligen ListQik`,
    infoActive: (county) =>
      `El condado de ${county} está en la zona de servicio publicada de ListQik en Texas. Inicie el intake en línea, compare planes y trabaje con correduría con licencia para el MLS y cumplimiento.`,
    infoInactive: (county) =>
      `ListQik apoya vendedores en todo Texas. Para direcciones en el condado de ${county}, concierge puede confirmar disponibilidad de corredor, ruta MLS y tiempos antes del pago.`,
    compareTitle: "La misma exposición MLS—sin una comisión del 6%",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promo + 0.50% al cierre",
      note: "Tarifa fija inicial · listado MLS respaldado por correduría",
    },
    compareTraditional: {
      label: "Corredor de listado tradicional",
      fee: "~3% comisión de listado",
      note: "Tarifa típica del lado del listado al cierre",
    },
    propertyTypesTitle: "Listamos los tipos de propiedad que los vendedores traen",
    propertyTypes: ["Casas unifamiliares", "Condominios y townhomes", "Terrenos vacíos", "Propiedades de inversión"],
    faqTitle: "Conceptos básicos del listado de tarifa fija",
    faqItems: [
      {
        title: "¿Qué es un listado de tarifa fija?",
        body: "Paga una tarifa inicial publicada por tecnología de marketing y flujo de listado regulado por correduría en lugar de una comisión porcentual del listado.",
      },
      {
        title: "¿Cómo funciona el proceso?",
        body: "Elija un plan, complete el intake del vendedor, suba fotos y divulgaciones, y su equipo de corretaje prepara el envío MLS tras la revisión de cumplimiento.",
      },
      {
        title: "¿Quién maneja las reglas MLS?",
        body: "El apoyo de corretaje con licencia maneja el envío MLS, formularios requeridos y cumplimiento publicitario para listados en Texas.",
      },
      {
        title: "¿Cómo me contactan los compradores?",
        body: "Las consultas se dirigen a usted. Usted decide cómo responder y qué compensación ofrecer al agente comprador dentro de las reglas MLS.",
      },
    ],
    citiesSectionTitle: (county) => `Ciudades y pueblos en el condado de ${county}`,
    citiesSectionIntro: (n) => `${n} comunidades con páginas locales dedicadas de ListQik.`,
    finalCtaTitle: "¿Listo para publicar en este condado?",
    finalCtaBody: "Abra precios Subsonic, ingrese la dirección de su propiedad e inicie su intake en minutos.",
  },
};

export function getCountyLandingCopy(locale: HomeLocale): CountyLandingCopy {
  return COPY[locale];
}
