import type { HomeLocale } from "@/i18n/home-locale";

export type HomepageCopy = {
  meta: { title: string; description: string };
  modal: {
    title: string;
    subtitle: string;
    english: string;
    spanish: string;
  };
  languageToggle: { en: string; es: string };
  hud: { left: string; center: string; right: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    startListing: string;
    browseListings: string;
  };
  missionPanels: Array<{ title: string; description: string }>;
  gauges: { speed: string; support: string; savings: string; sublabel: string };
  modules: Array<{ title: string; description: string }>;
  stats: {
    title: string;
    listingsStarted: string;
    savingsIndicator: string;
    activeListings: string;
    cta: string;
  };
  featured: {
    kicker: string;
    title: string;
    subtitle: string;
    openListings: string;
  };
  calculator: {
    kicker: string;
    title: string;
    subtitle: string;
    salePrice: string;
    salePriceSlider: string;
    equityRetained: string;
    model: string;
    modelDetail: string;
    traditionalLeakage: string;
    recaptured: string;
    traditionalPath: string;
    listQikPath: string;
    agentFee: string;
    platformFee: string;
    closingCosts: string;
    mortgagePayoff: string;
    netProceeds: string;
    disclaimer: string;
  };
  comparison: {
    kicker: string;
    title: string;
    subtitle: string;
    swipeHint: string;
    capability: string;
    disclaimer: string;
    rows: Array<{ label: string; listQik: string; houzeo: string; beycome: string; emphasis?: boolean }>;
  };
};

const COPY: Record<HomeLocale, HomepageCopy> = {
  en: {
    meta: {
      title: "ListQik | Texas Home Listing Platform",
      description:
        "List your Texas home with a guided workflow, broker-backed support, and tools built to help you keep more equity.",
    },
    modal: {
      title: "Choose your language",
      subtitle: "Select English or Spanish for the ListQik homepage.",
      english: "English",
      spanish: "Español",
    },
    languageToggle: { en: "EN", es: "ES" },
    hud: { left: "MFD · LISTQIK", center: "HUD · TX", right: "SYS · NOM" },
    hero: {
      badge: "LIVE LISTING MODE",
      title: "List Your Home With Clear Steps",
      subtitle:
        "Create your listing, work with a licensed brokerage, and track your potential savings in one place.",
      startListing: "Start Listing",
      browseListings: "Browse Listings",
    },
    missionPanels: [
      {
        title: "Start Your Listing",
        description: "Enter your property details with clear step-by-step guidance.",
      },
      {
        title: "Check Your Costs",
        description: "See your potential savings and fees before you go live.",
      },
      {
        title: "View Market Listings",
        description: "Browse active listings and compare homes in your area.",
      },
    ],
    gauges: { speed: "SPEED", support: "SUPPORT", savings: "SAVINGS", sublabel: "SCORE" },
    modules: [
      { title: "Fast Setup", description: "Get your listing process started quickly." },
      { title: "Broker Review", description: "A licensed broker reviews your listing details." },
      { title: "Keep More Proceeds", description: "Use simple tools to understand what you keep after fees." },
    ],
    stats: {
      title: "Platform Stats",
      listingsStarted: "LISTINGS STARTED",
      savingsIndicator: "AVERAGE SAVINGS INDICATOR",
      activeListings: "ACTIVE LISTINGS",
      cta: "Start Your Listing",
    },
    featured: {
      kicker: "FEATURED LISTINGS",
      title: "Real listings. Easy to browse.",
      subtitle: "View homes, filter by area, and open full listing details.",
      openListings: "Open listings →",
    },
    calculator: {
      kicker: "NET PROCEEDS CALCULATOR",
      title: "Simulate your equity retention.",
      subtitle:
        "Slide the sale price. Watch retained equity grow. Swap in your exact cost model later without touching UI.",
      salePrice: "Sale price",
      salePriceSlider: "Sale price slider",
      equityRetained: "EQUITY RETAINED",
      model: "Model",
      modelDetail: "ListQik.com 1.0% vs Trad 3.0%",
      traditionalLeakage: "Traditional fee leakage",
      recaptured: "recaptured",
      traditionalPath: "TRADITIONAL PATH",
      listQikPath: "LISTQIK.COM PATH",
      agentFee: "Agent fee",
      platformFee: "Platform fee",
      closingCosts: "Closing costs",
      mortgagePayoff: "Mortgage payoff",
      netProceeds: "Net proceeds",
      disclaimer:
        "Prototype calculator for UI/interaction. Replace percentages and payoff assumptions later with your validated model.",
    },
    comparison: {
      kicker: "COMPARISON SPEC SHEET",
      title: "ListQik.com vs. Houzeo / Beycome",
      subtitle:
        "Built for Texas sellers who want broker-backed compliance with a controller-grade workflow.",
      swipeHint: "Swipe sideways to see the full table.",
      capability: "Capability",
      disclaimer:
        "This is a positioning spec sheet, not a legal claim matrix. Finalize features/pricing before publishing.",
      rows: [
        {
          label: "Local Texas broker support",
          listQik: "Included (TX-specific)",
          houzeo: "Varies / limited",
          beycome: "Limited",
          emphasis: true,
        },
        {
          label: "Rapid deployment SLA",
          listQik: "4-hour rapid deployment",
          houzeo: "Multi-day typical",
          beycome: "Multi-day typical",
          emphasis: true,
        },
        {
          label: "Workflow language",
          listQik: "Deploy listing · Audit compliance",
          houzeo: "List my home",
          beycome: "Sell my home",
        },
        {
          label: "Compliance audit",
          listQik: "AI-assisted + broker review",
          houzeo: "Docs guidance",
          beycome: "Docs guidance",
        },
        {
          label: "Listing performance telemetry",
          listQik: "Events-ready (pixel + UTM)",
          houzeo: "Basic",
          beycome: "Basic",
        },
        {
          label: "Automation hooks",
          listQik: "GHL-ready architecture",
          houzeo: "Limited",
          beycome: "Limited",
        },
      ],
    },
  },
  es: {
    meta: {
      title: "ListQik | Plataforma de listados en Texas",
      description:
        "Publique su casa en Texas con un proceso guiado, respaldo de un corredor con licencia y herramientas para conservar más capital.",
    },
    modal: {
      title: "Elija su idioma",
      subtitle: "Seleccione inglés o español para la página principal de ListQik.",
      english: "English",
      spanish: "Español",
    },
    languageToggle: { en: "EN", es: "ES" },
    hud: { left: "MFD · LISTQIK", center: "HUD · TX", right: "SYS · NOM" },
    hero: {
      badge: "MODO DE LISTADO EN VIVO",
      title: "Publique su casa con pasos claros",
      subtitle:
        "Cree su listado, trabaje con una correduría con licencia y siga sus posibles ahorros en un solo lugar.",
      startListing: "Comenzar listado",
      browseListings: "Ver listados",
    },
    missionPanels: [
      {
        title: "Inicie su listado",
        description: "Ingrese los datos de su propiedad con una guía paso a paso.",
      },
      {
        title: "Revise sus costos",
        description: "Vea sus posibles ahorros y comisiones antes de publicar.",
      },
      {
        title: "Explore listados del mercado",
        description: "Navegue listados activos y compare casas en su zona.",
      },
    ],
    gauges: { speed: "VELOCIDAD", support: "SOPORTE", savings: "AHORRO", sublabel: "PUNTOS" },
    modules: [
      { title: "Configuración rápida", description: "Inicie el proceso de listado rápidamente." },
      { title: "Revisión del corredor", description: "Un corredor con licencia revisa los detalles de su listado." },
      {
        title: "Conserve más ganancias",
        description: "Use herramientas simples para entender lo que conserva después de las comisiones.",
      },
    ],
    stats: {
      title: "Estadísticas de la plataforma",
      listingsStarted: "LISTADOS INICIADOS",
      savingsIndicator: "INDICADOR PROMEDIO DE AHORRO",
      activeListings: "LISTADOS ACTIVOS",
      cta: "Comenzar su listado",
    },
    featured: {
      kicker: "LISTADOS DESTACADOS",
      title: "Listados reales. Fáciles de explorar.",
      subtitle: "Vea casas, filtre por zona y abra los detalles completos del listado.",
      openListings: "Ver listados →",
    },
    calculator: {
      kicker: "CALCULADORA DE GANANCIAS NETAS",
      title: "Simule la retención de su capital.",
      subtitle:
        "Mueva el precio de venta. Observe cómo crece el capital retenido. Más adelante puede usar su modelo de costos exacto.",
      salePrice: "Precio de venta",
      salePriceSlider: "Control de precio de venta",
      equityRetained: "CAPITAL RETENIDO",
      model: "Modelo",
      modelDetail: "ListQik.com 1.0% vs trad. 3.0%",
      traditionalLeakage: "Pérdida por comisión tradicional",
      recaptured: "recuperado",
      traditionalPath: "RUTA TRADICIONAL",
      listQikPath: "RUTA LISTQIK.COM",
      agentFee: "Comisión del agente",
      platformFee: "Comisión de la plataforma",
      closingCosts: "Costos de cierre",
      mortgagePayoff: "Saldo de hipoteca",
      netProceeds: "Ganancias netas",
      disclaimer:
        "Calculadora prototipo para la interfaz. Reemplace porcentajes y supuestos con su modelo validado.",
    },
    comparison: {
      kicker: "HOJA DE COMPARACIÓN",
      title: "ListQik.com vs. Houzeo / Beycome",
      subtitle:
        "Diseñado para vendedores en Texas que quieren cumplimiento respaldado por un corredor y un flujo de trabajo claro.",
      swipeHint: "Deslice horizontalmente para ver la tabla completa.",
      capability: "Capacidad",
      disclaimer:
        "Esta es una hoja de posicionamiento, no una matriz de reclamos legales. Finalice funciones y precios antes de publicar.",
      rows: [
        {
          label: "Soporte de corredor local en Texas",
          listQik: "Incluido (específico de TX)",
          houzeo: "Variable / limitado",
          beycome: "Limitado",
          emphasis: true,
        },
        {
          label: "SLA de implementación rápida",
          listQik: "Implementación en 4 horas",
          houzeo: "Varios días (típico)",
          beycome: "Varios días (típico)",
          emphasis: true,
        },
        {
          label: "Lenguaje del flujo de trabajo",
          listQik: "Publicar listado · Auditar cumplimiento",
          houzeo: "Listar mi casa",
          beycome: "Vender mi casa",
        },
        {
          label: "Auditoría de cumplimiento",
          listQik: "Asistida por IA + revisión del corredor",
          houzeo: "Guía de documentos",
          beycome: "Guía de documentos",
        },
        {
          label: "Telemetría del listado",
          listQik: "Lista para eventos (pixel + UTM)",
          houzeo: "Básica",
          beycome: "Básica",
        },
        {
          label: "Integraciones de automatización",
          listQik: "Arquitectura compatible con GHL",
          houzeo: "Limitada",
          beycome: "Limitada",
        },
      ],
    },
  },
};

export function getHomepageCopy(locale: HomeLocale): HomepageCopy {
  return COPY[locale];
}
