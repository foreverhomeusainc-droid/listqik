import type { HomeLocale } from "@/i18n/home-locale";

export type ServiceAreaCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  intro: string;
  statPrimary: string;
  statExtended: string;
  statTotal: string;
  seoIndexPrefix: string;
  seoCountiesLink: string;
  seoIndexSuffix: string;
  activeCoverageLabel: string;
  activeCoverageTitle: string;
  activeCoverageBody: string;
  marketRefLabel: string;
  marketRefTitle: string;
  marketRefBody: string;
  activeListqikLabel: string;
  activeListqikTitle: string;
  activeListqikBody: string;
  statPrimaryShort: string;
  statExtendedShort: string;
  mapLegendPrimary: string;
  mapLegendExtended: string;
  mapLegendOther: string;
  primaryCountiesTitle: string;
  primaryCountiesMeta: string;
  primaryCountiesBody: string;
  extendedCountiesTitle: string;
  extendedCountiesMeta: string;
  extendedCountiesBody: string;
  fullListBelow: string;
  viewMore: string;
  viewLess: string;
  remainingCounties: string;
  importantNote: string;
  importantNoteBody: string;
  startListing: string;
  contactConcierge: string;
  harEyebrow: string;
  harTitle: string;
  harIntro: string;
  harCompatNote: string;
  harCompatBody: string;
  statHarCore: string;
  statHarExtended: string;
  statHarTotal: string;
  harMapAria: string;
  harLegendCore: string;
  harLegendExtended: string;
  harCoreTitle: string;
  harExtendedTitle: string;
  harExtendedBody1: string;
  harExtendedBody2: string;
  statewideNote: string;
  statewideBody: string;
  countiesWord: string;
};

const COPY: Record<HomeLocale, ServiceAreaCopy> = {
  en: {
    meta: {
      title: "Texas Service Area | ListQik Home Listings",
      description:
        "ListQik Texas service coverage for home sellers: DFW primary counties, extended statewide support, Houston HAR market counties, and dedicated pages for every Texas county and city.",
    },
    eyebrow: "CURRENT SERVICE AREA",
    title: "Texas service coverage plus Houston HAR market context.",
    intro:
      "The Texas map and county lists below still represent ListQik's active coverage, led by Collin, Denton, Dallas, and Tarrant counties. The Houston HAR section is a separate market-reference guide, so it complements the existing map rather than replacing it.",
    statPrimary: "Primary Counties",
    statExtended: "Additional Counties",
    statTotal: "Total Counties",
    seoIndexPrefix: "Local SEO index:",
    seoCountiesLink: "Texas counties",
    seoIndexSuffix: "and {cityCount} cities with dedicated listing pages for search and ads.",
    activeCoverageLabel: "ACTIVE COVERAGE",
    activeCoverageTitle: "DFW primary counties plus extended Texas support",
    activeCoverageBody: "Use this section to answer where ListQik actively serves listings today.",
    marketRefLabel: "MARKET REFERENCE",
    marketRefTitle: "Houston HAR metro and extended market counties",
    marketRefBody: "Use this section for Greater Houston MLS context and HAR market positioning.",
    activeListqikLabel: "ACTIVE LISTQIK COVERAGE",
    activeListqikTitle: "Primary DFW counties and extended Texas service support.",
    activeListqikBody:
      "This is the current service-area dataset powering the map, county counts, and coverage messaging on this page.",
    statPrimaryShort: "Primary",
    statExtendedShort: "Extended",
    mapLegendPrimary: "Primary counties",
    mapLegendExtended: "Extended service counties",
    mapLegendOther: "Other Texas counties",
    primaryCountiesTitle: "Primary counties",
    primaryCountiesMeta: "{count} counties",
    primaryCountiesBody:
      "These are the core counties we want to lead with in messaging and outreach.",
    extendedCountiesTitle: "Extended Texas counties",
    extendedCountiesMeta: "{count} counties",
    extendedCountiesBody:
      "Additional counties pulled from the latest coverage report. These are active counties, not a coming-soon list.",
    fullListBelow: "Full county list available below",
    viewMore: "View more counties ({count})",
    viewLess: "View less counties",
    remainingCounties: "Remaining extended Texas counties",
    importantNote: "Important note:",
    importantNoteBody:
      "If your property is just outside one of these counties, contact us anyway. We can confirm nearby coverage, current broker footprint, and whether there is a workable MLS path for your listing.",
    startListing: "Start Listing",
    contactConcierge: "Contact Concierge",
    harEyebrow: "HOUSTON HAR MARKET AREA",
    harTitle: "Core and extended counties in the Houston HAR footprint.",
    harIntro:
      "These 9 core counties make up the immediate Houston-The Woodlands-Sugar Land metropolitan area. They are the primary focus of HAR's monthly market update reports and represent the densest concentration of MLS activity.",
    harCompatNote: "Compatibility note:",
    harCompatBody:
      "The Houston counties below are a market-reference layer only. They work alongside the Texas service map above and do not replace the existing DFW-led service-area data.",
    statHarCore: "Core HAR Counties",
    statHarExtended: "Extended HAR Counties",
    statHarTotal: "Total HAR Counties",
    harMapAria: "Texas county map showing Houston HAR core and extended market counties",
    harLegendCore: "Core HAR counties",
    harLegendExtended: "Extended HAR market counties",
    harCoreTitle: "9 core counties",
    harExtendedTitle: "Extended HAR market counties",
    harExtendedBody1:
      "Because HAR.com has grown into a large statewide real estate portal, its extended market area includes surrounding and rural counties that feed into the Gulf Coast region, plus adjacent counties monitored by the Houston-Galveston Area Council (H-GAC).",
    harExtendedBody2:
      "Agents frequently use HAR's MLS to list and search properties in these surrounding areas:",
    statewideNote: "Note on statewide searching:",
    statewideBody:
      "While the counties above represent the physical footprint of the Greater Houston real estate market, HAR.com also features property listings across the entire state of Texas, from Dallas to Austin and San Antonio, due to data-sharing agreements with other regional MLS boards.",
    countiesWord: "counties",
  },
  es: {
    meta: {
      title: "Zona de servicio en Texas | ListQik",
      description:
        "Cobertura de ListQik en Texas: condados principales del DFW, apoyo extendido en el estado, condados del mercado HAR en Houston y páginas dedicadas por condado y ciudad.",
    },
    eyebrow: "ZONA DE SERVICIO ACTUAL",
    title: "Cobertura en Texas y contexto del mercado HAR en Houston.",
    intro:
      "El mapa y los condados siguientes reflejan la cobertura activa de ListQik, liderada por Collin, Denton, Dallas y Tarrant. La sección HAR de Houston es una guía de referencia de mercado que complementa el mapa, no lo reemplaza.",
    statPrimary: "Condados principales",
    statExtended: "Condados adicionales",
    statTotal: "Total de condados",
    seoIndexPrefix: "Índice SEO local:",
    seoCountiesLink: "condados de Texas",
    seoIndexSuffix: "y {cityCount} ciudades con páginas dedicadas para búsqueda y anuncios.",
    activeCoverageLabel: "COBERTURA ACTIVA",
    activeCoverageTitle: "Condados principales del DFW y apoyo extendido en Texas",
    activeCoverageBody: "Use esta sección para ver dónde ListQik atiende listados hoy.",
    marketRefLabel: "REFERENCIA DE MERCADO",
    marketRefTitle: "Área metropolitana HAR de Houston y condados extendidos",
    marketRefBody: "Use esta sección para contexto MLS del Gran Houston y posicionamiento HAR.",
    activeListqikLabel: "COBERTURA ACTIVA LISTQIK",
    activeListqikTitle: "Condados principales del DFW y apoyo extendido en Texas.",
    activeListqikBody:
      "Este es el conjunto de datos de zona de servicio que alimenta el mapa, los conteos y el mensaje de cobertura en esta página.",
    statPrimaryShort: "Principal",
    statExtendedShort: "Extendido",
    mapLegendPrimary: "Condados principales",
    mapLegendExtended: "Condados de servicio extendido",
    mapLegendOther: "Otros condados de Texas",
    primaryCountiesTitle: "Condados principales",
    primaryCountiesMeta: "{count} condados",
    primaryCountiesBody:
      "Son los condados centrales que queremos destacar en mensajes y alcance.",
    extendedCountiesTitle: "Condados extendidos en Texas",
    extendedCountiesMeta: "{count} condados",
    extendedCountiesBody:
      "Condados adicionales del último informe de cobertura. Están activos, no son una lista futura.",
    fullListBelow: "Lista completa de condados más abajo",
    viewMore: "Ver más condados ({count})",
    viewLess: "Ver menos condados",
    remainingCounties: "Condados extendidos restantes en Texas",
    importantNote: "Nota importante:",
    importantNoteBody:
      "Si su propiedad queda justo fuera de estos condados, contáctenos igual. Confirmamos cobertura cercana, presencia del corredor y si hay ruta MLS viable para su listado.",
    startListing: "Publicar ahora",
    contactConcierge: "Contactar concierge",
    harEyebrow: "ÁREA DE MERCADO HAR — HOUSTON",
    harTitle: "Condados centrales y extendidos en el mercado HAR de Houston.",
    harIntro:
      "Estos 9 condados centrales forman el área metropolitana Houston-The Woodlands-Sugar Land. Son el foco de los informes mensuales de HAR y la mayor concentración de actividad MLS.",
    harCompatNote: "Nota de compatibilidad:",
    harCompatBody:
      "Los condados de Houston son solo referencia de mercado. Complementan el mapa de Texas y no reemplazan los datos de cobertura liderados por el DFW.",
    statHarCore: "Condados HAR centrales",
    statHarExtended: "Condados HAR extendidos",
    statHarTotal: "Total condados HAR",
    harMapAria: "Mapa de condados de Texas con mercado HAR de Houston",
    harLegendCore: "Condados HAR centrales",
    harLegendExtended: "Condados extendidos del mercado HAR",
    harCoreTitle: "9 condados centrales",
    harExtendedTitle: "Condados extendidos del mercado HAR",
    harExtendedBody1:
      "HAR.com creció como portal estatal; su mercado extendido incluye condados rurales de la Costa del Golfo y condados adyacentes monitoreados por el Houston-Galveston Area Council (H-GAC).",
    harExtendedBody2:
      "Los agentes usan el MLS de HAR con frecuencia para listar y buscar en estas áreas:",
    statewideNote: "Nota sobre búsqueda estatal:",
    statewideBody:
      "Además del Gran Houston, HAR.com muestra listados en todo Texas — Dallas, Austin, San Antonio — por acuerdos de datos con otros MLS regionales.",
    countiesWord: "condados",
  },
};

export function getServiceAreaCopy(locale: HomeLocale): ServiceAreaCopy {
  return COPY[locale];
}
