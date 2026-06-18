import type { DfwSatelliteCopy } from "@/i18n/dfw-satellite-copy";
import { getDfwSatelliteCopy } from "@/i18n/dfw-satellite-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import type { MetroRegionalId } from "@/lib/metro-regional-campaign";

export type MetroRegionalCopy = DfwSatelliteCopy;

const AUSTIN_COPY: Record<HomeLocale, MetroRegionalCopy> = {
  en: {
    metaTitle: "Austin Flat Fee MLS Listing — $79 ACTRIS | ListQik",
    metaDescription:
      "List your home on the ACTRIS MLS for $79. Broker-backed flat-fee listings for Austin-area counties across Central Texas.",
    breadcrumbLabel: "Austin area counties",
    heroEyebrow: "ACTRIS MLS flat-fee listing · Austin area counties",
    heroTitle: "List your home on the ACTRIS MLS for only $79",
    heroSubtitle:
      "Keep more of your equity. One regional campaign serves homeowners across Austin-area counties—broker-backed MLS exposure without a traditional 3% listing commission.",
    mlsTrustBadge: "Broker-backed ACTRIS MLS listing",
    startYourListing: "Start Your Listing",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Licensed Texas brokerage",
    brokerDisclosureTitle: "Licensed brokerage disclosure",
    countiesTitle: "Central Texas counties in our Austin campaign",
    countiesIntro:
      "These counties surround the Austin metro in the ACTRIS MLS footprint. Select your county for local cities and ACTRIS listing details.",
    howItWorksTitle: "How it works",
    howItWorksSteps: [
      {
        title: "Start online",
        body: "Choose Subsonic, complete seller intake, and upload property details from any Austin-area county.",
      },
      {
        title: "Broker compliance review",
        body: "Licensed Texas brokerage staff review your listing package before MLS submission.",
      },
      {
        title: "MLS goes live",
        body: "After approval, your listing syndicates to ACTRIS MLS feeds and major portals like Zillow and Realtor.com.",
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
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "ACTRIS MLS"],
    faqTitle: "Austin flat-fee listing basics",
    faqItems: [
      {
        title: "Which MLS does ListQik use in this area?",
        body: "Austin-area counties are served through the ACTRIS MLS footprint with broker-backed listing support.",
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
    finalCtaTitle: "Ready to list in your Austin-area county?",
    finalCtaBody: "Start your Subsonic listing online for $79 and keep more of your equity at closing.",
  },
  es: {
    metaTitle: "Listado MLS tarifa fija Austin — $79 ACTRIS | ListQik",
    metaDescription:
      "Publique su casa en el MLS ACTRIS por $79. Listados de tarifa fija con respaldo de correduría para condados del área de Austin en el centro de Texas.",
    breadcrumbLabel: "Condados del área de Austin",
    heroEyebrow: "Listado MLS ACTRIS tarifa fija · Condados del área de Austin",
    heroTitle: "Publique su casa en el MLS ACTRIS por solo $79",
    heroSubtitle:
      "Conserve más de su capital. Una campaña regional sirve a vendedores en condados del área de Austin—exposición MLS con respaldo de correduría sin la comisión tradicional del 3% del listado.",
    mlsTrustBadge: "Listado MLS ACTRIS con respaldo de correduría",
    startYourListing: "Iniciar su listado",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Correduría con licencia en Texas",
    brokerDisclosureTitle: "Divulgación de correduría con licencia",
    countiesTitle: "Condados del centro de Texas en nuestra campaña Austin",
    countiesIntro:
      "Estos condados rodean el metro de Austin en el área ACTRIS MLS. Elija su condado para ver ciudades y detalles del listado ACTRIS.",
    howItWorksTitle: "Cómo funciona",
    howItWorksSteps: [
      {
        title: "Comience en línea",
        body: "Elija Subsonic, complete la admisión del vendedor y cargue los detalles de la propiedad desde cualquier condado del área de Austin.",
      },
      {
        title: "Revisión de cumplimiento",
        body: "Personal de corretaje con licencia en Texas revisa su paquete de listado antes del envío MLS.",
      },
      {
        title: "El MLS se publica",
        body: "Tras la aprobación, su listado se distribuye a los feeds MLS ACTRIS y portales como Zillow y Realtor.com.",
      },
    ],
    pricingTransparencyTitle: "Precios transparentes—sin comisión sorpresa del listado",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promo + 0.50% al cierre",
      note: "Tarifa fija inicial · listado MLS con respaldo de correduría",
    },
    compareTraditional: {
      label: "Agente de listado tradicional",
      fee: "~3% comisión del listado",
      note: "Tarifa típica del lado del listado al cierre",
    },
    pricingIncludesTitle: "Qué incluye su listado Subsonic de $79",
    pricingIncludes: [
      "Envío MLS con respaldo de correduría tras revisión de cumplimiento",
      "Distribución a Zillow, Realtor.com, Redfin, Trulia y feeds MLS",
      "Intake del vendedor, flujo de divulgaciones y apoyo para cambios",
      "Consultas de agentes compradores y solicitudes de visitas dirigidas a usted",
    ],
    pricingClosingDisclosure:
      "Subsonic cuesta $79 por adelantado (promo en el checkout) más 0.50% al cierre en el lado del listado—publicado antes de pagar. La compensación al agente comprador es aparte y la define usted dentro de las reglas MLS.",
    mlsTitle: "Su listado puede aparecer en los principales sitios de búsqueda",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "MLS ACTRIS"],
    faqTitle: "Conceptos básicos del listado tarifa fija Austin",
    faqItems: [
      {
        title: "¿Qué MLS usa ListQik en esta área?",
        body: "Los condados del área de Austin se atienden a través del área MLS ACTRIS con apoyo de listado respaldado por correduría.",
      },
      {
        title: "¿Necesito un agente de listado tradicional?",
        body: "Obtiene flujo MLS regulado por corretaje y apoyo tecnológico sin pagar una comisión típica del ~3% del listado.",
      },
      {
        title: "¿Cómo funciona la segmentación por ubicación en Google Ads?",
        body: "Al hacer clic desde un anuncio regional, lo dirigimos a la página del condado que coincide con su área cuando hay datos de ubicación.",
      },
      {
        title: "¿Y si mi condado no está en la lista?",
        body: "Inicie el intake en línea—confirmamos corredor y ruta MLS para su dirección durante el onboarding.",
      },
    ],
    finalCtaTitle: "¿Listo para publicar en su condado del área de Austin?",
    finalCtaBody: "Inicie su listado Subsonic en línea por $79 y conserve más de su capital al cierre.",
  },
};

const SAN_ANTONIO_COPY: Record<HomeLocale, MetroRegionalCopy> = {
  en: {
    metaTitle: "San Antonio MLS Listing for $79 | ListQik",
    metaDescription:
      "Showcase your home to millions of buyers across San Antonio and satellite counties. Get on the San Antonio MLS for just $79 with broker-backed flat-fee listing support.",
    breadcrumbLabel: "San Antonio satellite counties",
    heroEyebrow: "San Antonio MLS flat-fee listing · satellite counties",
    heroTitle: "Get on the San Antonio MLS for Just $79 • No High Commission",
    heroSubtitle:
      "Showcase your home to millions of buyers across San Antonio and satellite counties",
    mlsTrustBadge: "Broker-backed San Antonio MLS listing",
    startYourListing: "Start Your Listing",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Licensed Texas brokerage",
    brokerDisclosureTitle: "Licensed brokerage disclosure",
    countiesTitle: "San Antonio satellite counties in our regional campaign",
    countiesIntro:
      "These counties surround the San Antonio metro. Select your county for local cities and San Antonio MLS listing details.",
    howItWorksTitle: "How it works",
    howItWorksSteps: [
      {
        title: "Start online",
        body: "Choose Subsonic, complete seller intake, and upload property details from any San Antonio-area county.",
      },
      {
        title: "Broker compliance review",
        body: "Licensed Texas brokerage staff review your listing package before MLS submission.",
      },
      {
        title: "MLS goes live",
        body: "After approval, your listing syndicates to SABOR MLS feeds and major portals like Zillow and Realtor.com.",
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
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "SABOR MLS"],
    faqTitle: "San Antonio flat-fee listing basics",
    faqItems: [
      {
        title: "Which MLS does ListQik use in this area?",
        body: "San Antonio-area counties are served through the SABOR MLS footprint with broker-backed listing support.",
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
    finalCtaTitle: "Ready to list in your San Antonio-area county?",
    finalCtaBody: "Start your Subsonic listing online for $79 and keep more of your equity at closing.",
  },
  es: {
    metaTitle: "MLS San Antonio por $79 | ListQik",
    metaDescription:
      "Muestre su casa a millones de compradores en San Antonio y condados satélite. Publique en el MLS de San Antonio por solo $79 con respaldo de correduría.",
    breadcrumbLabel: "Condados satélite de San Antonio",
    heroEyebrow: "Listado MLS San Antonio tarifa fija · condados satélite",
    heroTitle: "Publique en el MLS de San Antonio por solo $79 • Sin comisión alta",
    heroSubtitle:
      "Muestre su casa a millones de compradores en San Antonio y condados satélite",
    mlsTrustBadge: "Listado MLS San Antonio con respaldo de correduría",
    startYourListing: "Iniciar su listado",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Correduría con licencia en Texas",
    brokerDisclosureTitle: "Divulgación de correduría con licencia",
    countiesTitle: "Condados satélite de San Antonio en nuestra campaña regional",
    countiesIntro:
      "Estos condados rodean el metro de San Antonio. Elija su condado para ver ciudades y detalles del listado MLS de San Antonio.",
    howItWorksTitle: "Cómo funciona",
    howItWorksSteps: [
      {
        title: "Comience en línea",
        body: "Elija Subsonic, complete la admisión del vendedor y cargue los detalles de la propiedad desde cualquier condado del área de San Antonio.",
      },
      {
        title: "Revisión de cumplimiento",
        body: "Personal de corretaje con licencia en Texas revisa su paquete de listado antes del envío MLS.",
      },
      {
        title: "El MLS se publica",
        body: "Tras la aprobación, su listado se distribuye a los feeds MLS SABOR y portales como Zillow y Realtor.com.",
      },
    ],
    pricingTransparencyTitle: "Precios transparentes—sin comisión sorpresa del listado",
    compareListQik: {
      label: "ListQik Subsonic",
      fee: "$79 promo + 0.50% al cierre",
      note: "Tarifa fija inicial · listado MLS con respaldo de correduría",
    },
    compareTraditional: {
      label: "Agente de listado tradicional",
      fee: "~3% comisión del listado",
      note: "Tarifa típica del lado del listado al cierre",
    },
    pricingIncludesTitle: "Qué incluye su listado Subsonic de $79",
    pricingIncludes: [
      "Envío MLS con respaldo de correduría tras revisión de cumplimiento",
      "Distribución a Zillow, Realtor.com, Redfin, Trulia y feeds MLS",
      "Intake del vendedor, flujo de divulgaciones y apoyo para cambios",
      "Consultas de agentes compradores y solicitudes de visitas dirigidas a usted",
    ],
    pricingClosingDisclosure:
      "Subsonic cuesta $79 por adelantado (promo en el checkout) más 0.50% al cierre en el lado del listado—publicado antes de pagar. La compensación al agente comprador es aparte y la define usted dentro de las reglas MLS.",
    mlsTitle: "Su listado puede aparecer en los principales sitios de búsqueda",
    mlsPortals: ["Zillow", "Realtor.com", "Redfin", "Trulia", "MLS SABOR"],
    faqTitle: "Conceptos básicos del listado tarifa fija San Antonio",
    faqItems: [
      {
        title: "¿Qué MLS usa ListQik en esta área?",
        body: "Los condados del área de San Antonio se atienden a través del área MLS SABOR con apoyo de listado respaldado por correduría.",
      },
      {
        title: "¿Necesito un agente de listado tradicional?",
        body: "Obtiene flujo MLS regulado por corretaje y apoyo tecnológico sin pagar una comisión típica del ~3% del listado.",
      },
      {
        title: "¿Cómo funciona la segmentación por ubicación en Google Ads?",
        body: "Al hacer clic desde un anuncio regional, lo dirigimos a la página del condado que coincide con su área cuando hay datos de ubicación.",
      },
      {
        title: "¿Y si mi condado no está en la lista?",
        body: "Inicie el intake en línea—confirmamos corredor y ruta MLS para su dirección durante el onboarding.",
      },
    ],
    finalCtaTitle: "¿Listo para publicar en su condado del área de San Antonio?",
    finalCtaBody: "Inicie su listado Subsonic en línea por $79 y conserve más de su capital al cierre.",
  },
};

export function getMetroRegionalCopy(metroId: MetroRegionalId, locale: HomeLocale): MetroRegionalCopy {
  if (metroId === "dfw") return getDfwSatelliteCopy(locale);
  if (metroId === "austin") return AUSTIN_COPY[locale];
  return SAN_ANTONIO_COPY[locale];
}
