import type { HomeLocale } from "@/i18n/home-locale";

export type CountyLandingCopy = {
  getListedNow: string;
  heroEyebrow: (county: string) => string;
  heroTitle: (county: string) => string;
  heroSubtitle: string;
  heroTrustLine: string;
  heroBullets: string[];
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
    heroEyebrow: (county) => `Flat-fee MLS listing · ${county} County, TX`,
    heroTitle: (county) => `List your home in ${county} County for $79`,
    heroSubtitle:
      "Broker-backed MLS listing for Texas sellers. Keep more equity at closing—without a 3% listing commission.",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Licensed Texas brokerage",
    heroBullets: [
      "Subsonic plan from $79 (promo applied at checkout)",
      "MLS distribution to major home-search portals",
      "You stay in control of offers and buyer-agent terms",
    ],
    benefits: [
      {
        title: "Low flat fee",
        body: "Pay a simple upfront listing fee—not a 3% listing commission.",
      },
      {
        title: "Keep more equity",
        body: "ListQik targets about 1% total listing-side cost vs. ~3% with many traditional brokers.",
      },
      {
        title: "Start online today",
        body: "Pick a plan, enter your address, and begin seller intake in minutes.",
      },
    ],
    mlsTitle: "Your listing can appear on major home-search sites",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "MLS feeds"],
    infoTitle: (county) => `ListQik support in ${county} County`,
    infoActive: (county) =>
      `${county} County is in ListQik's published Texas service footprint. Complete intake online and work with licensed brokerage support for MLS submission and compliance.`,
    infoInactive: (county) =>
      `ListQik supports Texas sellers statewide. Start online now—we'll confirm broker and MLS path for your ${county} County address during intake.`,
    compareTitle: "Same MLS exposure—without a 6% commission stack",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promo + 0.50% at closing",
      note: "Flat upfront fee · broker-backed MLS listing",
    },
    compareTraditional: {
      label: "Traditional listing broker",
      fee: "~3% listing commission",
      note: "Typical listing-side fee at closing",
    },
    propertyTypesTitle: "Property types we list",
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
    citiesSectionIntro: (n) => `${n} communities in this county.`,
    finalCtaTitle: "Ready to list?",
    finalCtaBody: "Enter your property address and start Subsonic seller intake—it takes just a few minutes.",
  },
  es: {
    getListedNow: "Publicar ahora",
    heroEyebrow: (county) => `Listado MLS tarifa fija · Condado de ${county}, TX`,
    heroTitle: (county) => `Publique su casa en el condado de ${county} por $79`,
    heroSubtitle:
      "Listado MLS respaldado por correduría en Texas. Conserve más capital al cierre—sin comisión del 3% del listado.",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Correduría con licencia en Texas",
    heroBullets: [
      "Plan Subsonic desde $79 (promo aplicada al pagar)",
      "Distribución MLS en portales principales",
      "Usted controla ofertas y compensación al agente comprador",
    ],
    benefits: [
      {
        title: "Tarifa fija baja",
        body: "Pague una tarifa de listado clara—no una comisión del 3% del listado.",
      },
      {
        title: "Conserve más capital",
        body: "ListQik apunta a ~1% del costo del listado vs. ~3% con muchos corredores tradicionales.",
      },
      {
        title: "Empiece en línea hoy",
        body: "Elija un plan, ingrese su dirección e inicie el intake en minutos.",
      },
    ],
    mlsTitle: "Su listado puede aparecer en los principales sitios de búsqueda",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "Feeds MLS"],
    infoTitle: (county) => `Apoyo ListQik en el condado de ${county}`,
    infoActive: (county) =>
      `El condado de ${county} está en la zona de servicio publicada de ListQik en Texas. Complete el intake en línea y trabaje con correduría con licencia para el MLS y cumplimiento.`,
    infoInactive: (county) =>
      `ListQik apoya vendedores en todo Texas. Inicie en línea ahora—confirmaremos corredor y ruta MLS para su dirección en el condado de ${county} durante el intake.`,
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
    propertyTypesTitle: "Tipos de propiedad que listamos",
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
    citiesSectionIntro: (n) => `${n} comunidades en este condado.`,
    finalCtaTitle: "¿Listo para publicar?",
    finalCtaBody: "Ingrese la dirección de su propiedad e inicie el intake Subsonic—solo toma unos minutos.",
  },
};

export function getCountyLandingCopy(locale: HomeLocale): CountyLandingCopy {
  return COPY[locale];
}
