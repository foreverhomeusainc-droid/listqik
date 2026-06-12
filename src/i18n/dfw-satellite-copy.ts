import type { HomeLocale } from "@/i18n/home-locale";

export type DfwSatelliteCopy = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  brokerDisclosureTitle: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  mlsTrustBadge: string;
  startYourListing: string;
  heroTrustLine: string;
  countiesTitle: string;
  countiesIntro: string;
  howItWorksTitle: string;
  howItWorksSteps: { title: string; body: string }[];
  pricingTransparencyTitle: string;
  compareListQik: { label: string; fee: string; note: string };
  compareTraditional: { label: string; fee: string; note: string };
  pricingIncludesTitle: string;
  pricingIncludes: string[];
  pricingClosingDisclosure: string;
  mlsTitle: string;
  mlsPortals: string[];
  faqTitle: string;
  faqItems: { title: string; body: string }[];
  finalCtaTitle: string;
  finalCtaBody: string;
};

const COPY: Record<HomeLocale, DfwSatelliteCopy> = {
  en: {
    metaTitle: "DFW Flat Fee MLS Listing — $79 NTREIS | ListQik",
    metaDescription:
      "List your home on the NTREIS MLS for $79. Broker-backed flat-fee listings for DFW satellite counties across North Texas.",
    breadcrumbLabel: "DFW satellite counties",
    heroEyebrow: "NTREIS MLS flat-fee listing · DFW satellite counties",
    heroTitle: "List your home on the NTREIS MLS for only $79",
    heroSubtitle:
      "Keep more of your equity. One regional campaign serves homeowners across DFW satellite counties—broker-backed MLS exposure without a traditional 3% listing commission.",
    mlsTrustBadge: "Broker-backed NTREIS MLS listing",
    startYourListing: "Start Your Listing",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Licensed Texas brokerage",
    brokerDisclosureTitle: "Licensed brokerage disclosure",
    countiesTitle: "North Texas counties in our DFW campaign",
    countiesIntro:
      "These counties are from our extended-service population report—ranked by size around the DFW metro. Select your county for local cities and NTREIS listing details.",
    howItWorksTitle: "How it works",
    howItWorksSteps: [
      {
        title: "Start online",
        body: "Choose Subsonic, complete seller intake, and upload property details from any DFW satellite county.",
      },
      {
        title: "Broker compliance review",
        body: "Licensed Texas brokerage staff review your listing package before MLS submission.",
      },
      {
        title: "MLS goes live",
        body: "After approval, your listing syndicates to NTREIS MLS feeds and major portals like Zillow and Realtor.com.",
      },
    ],
    pricingTransparencyTitle: "Transparent pricing—no surprise listing commission",
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
    pricingIncludesTitle: "What your $79 Subsonic listing includes",
    pricingIncludes: [
      "Broker-backed MLS listing submission after compliance review",
      "Distribution to Zillow, Realtor.com, Redfin, Trulia, and MLS feeds",
      "Seller intake, disclosures workflow, and listing change support",
      "Buyer-agent inquiries and showing requests routed to you",
    ],
    pricingClosingDisclosure:
      "Subsonic is $79 upfront (promo applied at checkout) plus 0.50% at closing on the listing side—published before you pay. Buyer-agent compensation is separate and set by you within MLS rules.",
    mlsTitle: "Your listing can appear on major home-search sites",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "NTREIS MLS"],
    faqTitle: "DFW flat-fee listing basics",
    faqItems: [
      {
        title: "Which MLS does ListQik use in this area?",
        body: "DFW satellite counties are served through the NTREIS MLS footprint with broker-backed listing support.",
      },
      {
        title: "Do I need a traditional listing agent?",
        body: "You get brokerage-regulated MLS workflow and technology support without paying a typical ~3% listing commission.",
      },
      {
        title: "How does Google Ads location targeting work?",
        body: "When you click from a regional ad, we route you to the county page that matches your area when location data is available.",
      },
      {
        title: "What if my county is not listed?",
        body: "Start intake online—we confirm broker and MLS path for your property address during onboarding.",
      },
    ],
    finalCtaTitle: "Ready to list in your DFW county?",
    finalCtaBody: "Start your Subsonic listing online for $79 and keep more of your equity at closing.",
  },
  es: {
    metaTitle: "Listado MLS tarifa fija DFW — $79 NTREIS | ListQik",
    metaDescription:
      "Publique su casa en el MLS NTREIS por $79. Listados de tarifa fija con respaldo de correduría para condados satélite del DFW en el norte de Texas.",
    breadcrumbLabel: "Condados satélite del DFW",
    heroEyebrow: "Listado MLS NTREIS tarifa fija · Condados satélite del DFW",
    heroTitle: "Publique su casa en el MLS NTREIS por solo $79",
    heroSubtitle:
      "Conserve más de su capital. Una campaña regional sirve a vendedores en condados satélite del DFW—exposición MLS con respaldo de correduría sin la comisión tradicional del 3% del listado.",
    mlsTrustBadge: "Listado MLS NTREIS con respaldo de correduría",
    startYourListing: "Iniciar su listado",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Correduría con licencia en Texas",
    brokerDisclosureTitle: "Divulgación de correduría con licencia",
    countiesTitle: "Condados del norte de Texas en nuestra campaña DFW",
    countiesIntro:
      "Estos condados provienen de nuestro informe de población de servicio extendido—ordenados por tamaño alrededor del metro DFW. Elija su condado para ver ciudades y detalles del listado NTREIS.",
    howItWorksTitle: "Cómo funciona",
    howItWorksSteps: [
      {
        title: "Comience en línea",
        body: "Elija Subsonic, complete la admisión del vendedor y cargue los detalles de la propiedad desde cualquier condado satélite del DFW.",
      },
      {
        title: "Revisión de cumplimiento",
        body: "Personal de correduría con licencia en Texas revisa su paquete de listado antes del envío al MLS.",
      },
      {
        title: "MLS en vivo",
        body: "Tras la aprobación, su listado se distribuye a los feeds del MLS NTREIS y portales principales como Zillow y Realtor.com.",
      },
    ],
    pricingTransparencyTitle: "Precios transparentes—sin comisión sorpresa de listado",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promoción + 0.50% al cierre",
      note: "Tarifa fija inicial · listado MLS con respaldo de correduría",
    },
    compareTraditional: {
      label: "Agente de listado tradicional",
      fee: "~3% comisión de listado",
      note: "Comisión típica del lado del listado al cierre",
    },
    pricingIncludesTitle: "Qué incluye su listado Subsonic de $79",
    pricingIncludes: [
      "Envío de listado MLS con respaldo de correduría tras revisión de cumplimiento",
      "Distribución a Zillow, Realtor.com, Redfin, Trulia y feeds MLS",
      "Admisión del vendedor, flujo de divulgaciones y soporte de cambios",
      "Consultas de agentes compradores y solicitudes de visitas dirigidas a usted",
    ],
    pricingClosingDisclosure:
      "Subsonic cuesta $79 por adelantado (promoción en el pago) más 0.50% al cierre en el lado del listado—publicado antes de pagar. La compensación al agente comprador es separada y la define usted según las reglas del MLS.",
    mlsTitle: "Su listado puede aparecer en los principales sitios de búsqueda",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "MLS NTREIS"],
    faqTitle: "Conceptos básicos del listado de tarifa fija DFW",
    faqItems: [
      {
        title: "¿Qué MLS usa ListQik en esta zona?",
        body: "Los condados satélite del DFW se atienden a través del MLS NTREIS con respaldo de correduría.",
      },
      {
        title: "¿Necesito un agente de listado tradicional?",
        body: "Obtiene flujo de trabajo MLS regulado por correduría y soporte tecnológico sin pagar la comisión típica del ~3% del listado.",
      },
      {
        title: "¿Cómo funciona la segmentación geográfica en anuncios?",
        body: "Al hacer clic desde un anuncio regional, le dirigimos a la página del condado que coincide con su zona cuando hay datos de ubicación disponibles.",
      },
      {
        title: "¿Qué pasa si mi condado no aparece?",
        body: "Inicie la admisión en línea—confirmamos la ruta de correduría y MLS para su dirección durante el registro.",
      },
    ],
    finalCtaTitle: "¿Listo para publicar en su condado del DFW?",
    finalCtaBody: "Inicie su listado Subsonic en línea por $79 y conserve más de su capital al cierre.",
  },
};

export function getDfwSatelliteCopy(locale: HomeLocale): DfwSatelliteCopy {
  return COPY[locale];
}
