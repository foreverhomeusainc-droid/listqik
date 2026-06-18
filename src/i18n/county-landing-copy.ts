import type { HomeLocale } from "@/i18n/home-locale";
import type { ServiceCoverageTier } from "@/lib/texas-location-seo";
import { formatTexasLocationDisplayName } from "@/lib/texas-location-seo";

export type CountyHeroContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  mlsTrustBadge: string;
};

export type CountyHowItWorksStep = {
  title: string;
  body: string;
};

export type CountyLandingCopy = {
  startYourListing: string;
  getListedNow: string;
  heroEyebrow: (county: string) => string;
  heroTitle: (county: string) => string;
  heroSubtitle: string;
  heroTrustLine: string;
  localProofTitle: (county: string) => string;
  localProofBody: (county: string, cityList: string) => string;
  localProofFallback: (county: string) => string;
  howItWorksTitle: string;
  pricingTransparencyTitle: string;
  pricingIncludesTitle: string;
  pricingIncludes: string[];
  pricingClosingDisclosure: string;
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
    startYourListing: "Start Your Listing",
    getListedNow: "Get Listed Now",
    heroEyebrow: (county) => `Flat-fee MLS listing · ${county} County, TX`,
    heroTitle: (county) => `List your home in ${county} County for $79`,
    heroSubtitle:
      "Keep more of your equity. Get the same MLS exposure traditional listing agents provide—without paying a 3% listing commission.",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Licensed Texas brokerage",
    localProofTitle: (county) => `Serving all of ${county} County`,
    localProofBody: (county, cityList) =>
      `ListQik supports sellers across ${county} County—including ${cityList} and surrounding communities.`,
    localProofFallback: (county) =>
      `ListQik supports sellers with broker-backed MLS listing workflows throughout ${county} County, Texas.`,
    howItWorksTitle: "How it works",
    pricingTransparencyTitle: "Transparent pricing—no surprise listing commission",
    pricingIncludesTitle: "What your $79 Subsonic listing includes",
    pricingIncludes: [
      "Broker-backed MLS listing submission after compliance review",
      "Distribution to Zillow, Realtor.com, Redfin, Trulia, and MLS feeds",
      "Seller intake, disclosures workflow, and listing change support",
      "Buyer-agent inquiries and showing requests routed to you",
    ],
    pricingClosingDisclosure:
      "Subsonic is $79 upfront plus 0.50% at closing on the listing side—published before you pay. Buyer-agent compensation is separate and set by you within MLS rules. No traditional ~3% listing commission.",
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
      fee: "$79 + 0.50% at closing",
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
    startYourListing: "Iniciar su listado",
    getListedNow: "Publicar ahora",
    heroEyebrow: (county) => `Listado MLS tarifa fija · Condado de ${county}, TX`,
    heroTitle: (county) => `Publique su casa en el condado de ${county} por $79`,
    heroSubtitle:
      "Conserve más de su capital. Obtenga la misma exposición MLS que ofrecen los agentes tradicionales—sin pagar una comisión del 3% del listado.",
    heroTrustLine: "Zillow · Realtor.com · Redfin · Trulia · Correduría con licencia en Texas",
    localProofTitle: (county) => `Servimos todo el condado de ${county}`,
    localProofBody: (county, cityList) =>
      `ListQik apoya vendedores en el condado de ${county}—incluyendo ${cityList} y comunidades cercanas.`,
    localProofFallback: (county) =>
      `ListQik apoya vendedores con flujos de listado MLS respaldados por correduría en todo el condado de ${county}, Texas.`,
    howItWorksTitle: "Cómo funciona",
    pricingTransparencyTitle: "Precios transparentes—sin comisión sorpresa del listado",
    pricingIncludesTitle: "Qué incluye su listado Subsonic de $79",
    pricingIncludes: [
      "Envío MLS respaldado por correduría tras revisión de cumplimiento",
      "Distribución en Zillow, Realtor.com, Redfin, Trulia y feeds MLS",
      "Intake del vendedor, divulgaciones y apoyo para cambios del listado",
      "Consultas de agentes compradores y solicitudes de visitas dirigidas a usted",
    ],
    pricingClosingDisclosure:
      "Subsonic cuesta $79 por adelantado más 0.50% al cierre en el lado del listado—publicado antes de pagar. La compensación al agente comprador es aparte y la define usted dentro de las reglas MLS. Sin comisión tradicional de ~3% del listado.",
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
      fee: "$79 + 0.50% al cierre",
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

const SUBTITLE_EN =
  "Keep more of your equity. Get the same MLS exposure traditional listing agents provide—without paying a 3% listing commission.";
const SUBTITLE_ES =
  "Conserve más de su capital. Obtenga la misma exposición MLS que ofrecen los agentes tradicionales—sin pagar una comisión del 3% del listado.";

const HERO_BY_TIER: Record<
  HomeLocale,
  Record<ServiceCoverageTier, (county: string) => CountyHeroContent>
> = {
  en: {
    primary: (county) => ({
      heroEyebrow: `NTREIS MLS flat-fee listing · ${county} County, TX`,
      heroTitle: `List your house on the NTREIS MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed NTREIS MLS listing",
    }),
    extended: (county) => ({
      heroEyebrow: `NTREIS MLS flat-fee listing · ${county} County, TX`,
      heroTitle: `List your house on the NTREIS MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed NTREIS MLS listing",
    }),
    "har-core": (county) => ({
      heroEyebrow: `Houston HAR MLS listing · ${county} County, TX`,
      heroTitle: `List your house on the Houston MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed Houston HAR MLS listing",
    }),
    "har-extended": (county) => ({
      heroEyebrow: `Houston HAR MLS listing · ${county} County, TX`,
      heroTitle: `List your house on the Houston MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed Houston HAR MLS listing",
    }),
    "actris-core": (county) => ({
      heroEyebrow: `ACTRIS MLS flat-fee listing · ${county} County, TX`,
      heroTitle: `List your house on the ACTRIS MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed ACTRIS MLS listing",
    }),
    "actris-extended": (county) => ({
      heroEyebrow: `ACTRIS MLS flat-fee listing · ${county} County, TX`,
      heroTitle: `List your house on the ACTRIS MLS in ${county} County for only $79`,
      heroSubtitle: SUBTITLE_EN,
      mlsTrustBadge: "Broker-backed ACTRIS MLS listing",
    }),
    "sabor-core": (county) => ({
      heroEyebrow: `San Antonio MLS flat-fee listing · ${county} County, TX`,
      heroTitle: "Get on the San Antonio MLS for Just $79 • No High Commission",
      heroSubtitle:
        "Showcase your home to millions of buyers across San Antonio and satellite counties",
      mlsTrustBadge: "Broker-backed San Antonio MLS listing",
    }),
    "sabor-extended": (county) => ({
      heroEyebrow: `San Antonio MLS flat-fee listing · ${county} County, TX`,
      heroTitle: "Get on the San Antonio MLS for Just $79 • No High Commission",
      heroSubtitle:
        "Showcase your home to millions of buyers across San Antonio and satellite counties",
      mlsTrustBadge: "Broker-backed San Antonio MLS listing",
    }),
    statewide: (county) => ({
      heroEyebrow: `Texas flat-fee MLS listing · ${county} County`,
      heroTitle: `List your home on the MLS in ${county} County—start online for $79`,
      heroSubtitle:
        "Broker-backed MLS listing support for Texas sellers. We confirm your MLS path during intake—without a traditional 3% listing commission.",
      mlsTrustBadge: "Licensed Texas brokerage · MLS listing support",
    }),
  },
  es: {
    primary: (county) => ({
      heroEyebrow: `Listado MLS NTREIS tarifa fija · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS NTREIS en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS NTREIS respaldado por correduría",
    }),
    extended: (county) => ({
      heroEyebrow: `Listado MLS NTREIS tarifa fija · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS NTREIS en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS NTREIS respaldado por correduría",
    }),
    "har-core": (county) => ({
      heroEyebrow: `Listado MLS HAR Houston · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS de Houston en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS HAR respaldado por correduría",
    }),
    "har-extended": (county) => ({
      heroEyebrow: `Listado MLS HAR Houston · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS de Houston en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS HAR respaldado por correduría",
    }),
    "actris-core": (county) => ({
      heroEyebrow: `Listado MLS ACTRIS tarifa fija · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS ACTRIS en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS ACTRIS respaldado por correduría",
    }),
    "actris-extended": (county) => ({
      heroEyebrow: `Listado MLS ACTRIS tarifa fija · Condado de ${county}, TX`,
      heroTitle: `Publique su casa en el MLS ACTRIS en el condado de ${county} por solo $79`,
      heroSubtitle: SUBTITLE_ES,
      mlsTrustBadge: "Listado MLS ACTRIS respaldado por correduría",
    }),
    "sabor-core": (county) => ({
      heroEyebrow: `Listado MLS San Antonio tarifa fija · Condado de ${county}, TX`,
      heroTitle: "Publique en el MLS de San Antonio por solo $79 • Sin comisión alta",
      heroSubtitle:
        "Muestre su casa a millones de compradores en San Antonio y condados satélite",
      mlsTrustBadge: "Listado MLS San Antonio con respaldo de correduría",
    }),
    "sabor-extended": (county) => ({
      heroEyebrow: `Listado MLS San Antonio tarifa fija · Condado de ${county}, TX`,
      heroTitle: "Publique en el MLS de San Antonio por solo $79 • Sin comisión alta",
      heroSubtitle:
        "Muestre su casa a millones de compradores en San Antonio y condados satélite",
      mlsTrustBadge: "Listado MLS San Antonio con respaldo de correduría",
    }),
    statewide: (county) => ({
      heroEyebrow: `Listado MLS tarifa fija Texas · Condado de ${county}`,
      heroTitle: `Publique en el MLS en el condado de ${county}—desde $79 en línea`,
      heroSubtitle:
        "Apoyo de listado MLS respaldado por correduría en Texas. Confirmamos su ruta MLS durante el intake—sin comisión tradicional del 3% del listado.",
      mlsTrustBadge: "Correduría con licencia en Texas · apoyo MLS",
    }),
  },
};

const HOW_IT_WORKS: Record<HomeLocale, Record<ServiceCoverageTier, CountyHowItWorksStep[]>> = {
  en: {
    primary: [
      {
        title: "Enter property details online",
        body: "Start Subsonic seller intake with your address, property type, and contact info in minutes.",
      },
      {
        title: "Broker submits to NTREIS",
        body: "After compliance review, your licensed brokerage team prepares your NTREIS MLS listing submission.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent showing requests and offers route directly to you—you control responses and compensation terms.",
      },
    ],
    extended: [
      {
        title: "Enter property details online",
        body: "Start Subsonic seller intake with your address, property type, and contact info in minutes.",
      },
      {
        title: "Broker submits to NTREIS",
        body: "After compliance review, your licensed brokerage team prepares your NTREIS MLS listing submission.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent showing requests and offers route directly to you—you control responses and compensation terms.",
      },
    ],
    "har-core": [
      {
        title: "Enter property details online",
        body: "Complete seller intake with your Houston-area address and property details.",
      },
      {
        title: "Broker submits to Houston MLS",
        body: "After compliance review, your brokerage team submits through the HAR-compatible MLS path for your property.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    "har-extended": [
      {
        title: "Enter property details online",
        body: "Complete seller intake—we confirm the HAR MLS path for your address during onboarding.",
      },
      {
        title: "Broker prepares MLS submission",
        body: "Licensed brokerage support handles Houston-area MLS submission after compliance review.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    "actris-core": [
      {
        title: "Enter property details online",
        body: "Complete seller intake with your Austin-area address and property details.",
      },
      {
        title: "Broker submits to ACTRIS",
        body: "After compliance review, your brokerage team submits through the ACTRIS MLS path for your property.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    "actris-extended": [
      {
        title: "Enter property details online",
        body: "Complete seller intake—we confirm the ACTRIS MLS path for your address during onboarding.",
      },
      {
        title: "Broker prepares MLS submission",
        body: "Licensed brokerage support handles Central Texas ACTRIS MLS submission after compliance review.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    "sabor-core": [
      {
        title: "Enter property details online",
        body: "Complete seller intake with your San Antonio-area address and property details.",
      },
      {
        title: "Broker submits to SABOR",
        body: "After compliance review, your brokerage team submits through the SABOR MLS path for your property.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    "sabor-extended": [
      {
        title: "Enter property details online",
        body: "Complete seller intake—we confirm the SABOR MLS path for your address during onboarding.",
      },
      {
        title: "Broker prepares MLS submission",
        body: "Licensed brokerage support handles San Antonio-area SABOR MLS submission after compliance review.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you within MLS rules.",
      },
    ],
    statewide: [
      {
        title: "Enter property details online",
        body: "Start intake with your property address—we confirm broker and MLS coverage for your county.",
      },
      {
        title: "Broker prepares MLS submission",
        body: "Licensed brokerage support handles MLS submission and required Texas listing compliance.",
      },
      {
        title: "Inquiries come to you",
        body: "Buyer-agent inquiries and offers route directly to you—you set buyer-agent compensation within MLS rules.",
      },
    ],
  },
  es: {
    primary: [
      {
        title: "Ingrese los datos de la propiedad en línea",
        body: "Inicie el intake Subsonic con su dirección, tipo de propiedad y datos de contacto en minutos.",
      },
      {
        title: "La correduría envía a NTREIS",
        body: "Tras la revisión de cumplimiento, su equipo de corretaje con licencia prepara el envío MLS NTREIS.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Solicitudes de visitas y ofertas de agentes compradores se dirigen a usted—usted controla las respuestas.",
      },
    ],
    extended: [
      {
        title: "Ingrese los datos de la propiedad en línea",
        body: "Inicie el intake Subsonic con su dirección, tipo de propiedad y datos de contacto en minutos.",
      },
      {
        title: "La correduría envía a NTREIS",
        body: "Tras la revisión de cumplimiento, su equipo de corretaje con licencia prepara el envío MLS NTREIS.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Solicitudes de visitas y ofertas de agentes compradores se dirigen a usted—usted controla las respuestas.",
      },
    ],
    "har-core": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake con la dirección de su propiedad en el área de Houston.",
      },
      {
        title: "Envío al MLS de Houston",
        body: "Tras la revisión de cumplimiento, su correduría envía por la ruta MLS compatible con HAR.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas de agentes compradores se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    "har-extended": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake—confirmamos la ruta MLS HAR para su dirección durante el onboarding.",
      },
      {
        title: "La correduría prepara el envío MLS",
        body: "Apoyo de corretaje con licencia para el envío MLS en el área de Houston tras revisión de cumplimiento.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    "actris-core": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake con la dirección de su propiedad en el área de Austin.",
      },
      {
        title: "Envío al MLS ACTRIS",
        body: "Tras la revisión de cumplimiento, su correduría envía por la ruta MLS ACTRIS para su propiedad.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    "actris-extended": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake—confirmamos la ruta MLS ACTRIS para su dirección durante el onboarding.",
      },
      {
        title: "La correduría prepara el envío MLS",
        body: "Apoyo de corretaje con licencia para el envío MLS ACTRIS en el centro de Texas tras revisión de cumplimiento.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    "sabor-core": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake con la dirección de su propiedad en el área de San Antonio.",
      },
      {
        title: "Envío al MLS SABOR",
        body: "Tras la revisión de cumplimiento, su correduría envía por la ruta MLS SABOR para su propiedad.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    "sabor-extended": [
      {
        title: "Ingrese los datos en línea",
        body: "Complete el intake—confirmamos la ruta MLS SABOR para su dirección durante el onboarding.",
      },
      {
        title: "La correduría prepara el envío MLS",
        body: "Apoyo de corretaje con licencia para el envío MLS SABOR en el área de San Antonio tras revisión de cumplimiento.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted dentro de las reglas MLS.",
      },
    ],
    statewide: [
      {
        title: "Ingrese los datos en línea",
        body: "Inicie el intake con su dirección—confirmamos corredor y cobertura MLS para su condado.",
      },
      {
        title: "La correduría prepara el envío MLS",
        body: "Apoyo de corretaje con licencia para el envío MLS y cumplimiento de listados en Texas.",
      },
      {
        title: "Las consultas llegan a usted",
        body: "Consultas y ofertas se dirigen a usted—usted define la compensación al agente comprador dentro de las reglas MLS.",
      },
    ],
  },
};

export function getCountyHeroContent(
  tier: ServiceCoverageTier,
  county: string,
  locale: HomeLocale,
): CountyHeroContent {
  return HERO_BY_TIER[locale][tier](county);
}

export function getCountyHowItWorksSteps(
  tier: ServiceCoverageTier,
  locale: HomeLocale,
): CountyHowItWorksStep[] {
  return HOW_IT_WORKS[locale][tier];
}

/** Named cities for local-proof copy (skips ZIP-only placeholders). */
export function prominentCountyCityNames(
  cities: readonly { name: string }[],
  max = 3,
): string[] {
  return cities
    .map((c) => formatTexasLocationDisplayName(c.name))
    .filter((name) => !/^ZIP\s/i.test(name))
    .slice(0, max);
}

export function formatCityListForCopy(cities: string[], locale: HomeLocale): string {
  if (cities.length === 0) return "";
  if (cities.length === 1) return cities[0]!;
  const conj = locale === "es" ? " y " : " and ";
  if (cities.length === 2) return cities.join(conj);
  return `${cities.slice(0, -1).join(", ")}${conj}${cities[cities.length - 1]}`;
}
