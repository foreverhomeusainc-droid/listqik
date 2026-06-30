export type InvestorsCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaDeals: string;
    ctaVelocity: string;
  };
  why: {
    title: string;
    intro: string;
    pillars: { title: string; body: string }[];
  };
  calculators: {
    eyebrow: string;
    title: string;
    intro: string;
    legacyEyebrow: string;
    legacyTitle: string;
    legacyIntro: string;
  };
  deals: {
    eyebrow: string;
    title: string;
    intro: string;
    viewAll: string;
    empty: string;
  };
};

export const INVESTORS_COPY: InvestorsCopy = {
  meta: {
    title: "Investors | ListQik",
    description:
      "Underwrite Texas deals, browse MLS investor inventory, and unlock Velocity Club perks — calculators, buyer deals, and curated listings in one place.",
  },
  hero: {
    eyebrow: "Velocity Club · Investor operators",
    title: "Why investors build their pipeline here",
    subtitle:
      "ListQik is not just a flat-fee listing shop — it is an operating system for Texas investors who want faster underwriting, MLS-sourced acquisitions, tiered loyalty perks, and a broker-backed compliance lane when they are ready to list.",
    ctaDeals: "Browse buyer deals",
    ctaVelocity: "Velocity Club perks",
  },
  why: {
    title: "Why do I want to be here?",
    intro:
      "Whether you flip, wholesale, BRRRR, or buy notes — you need three things: numbers you trust, deals you can act on, and a broker that does not slow you down.",
    pillars: [
      {
        title: "Underwrite in minutes",
        body: "Run reverse-invest, note-buyer, cap-rate, and legacy flip/BRRRR models without exporting to spreadsheets. Push winning deals to a live listing when you are ready to sell.",
      },
      {
        title: "MLS buyer intelligence",
        body: "Teaser inventory on the public site; full addresses, private remarks, and comps after Buyer Representation — built for operators, not retail browsers.",
      },
      {
        title: "Velocity Club tiers",
        body: "Bulk listing credits, rolling volume tiers, automated savings proof, and fast-track compliance queueing for Syndicate+ members.",
      },
      {
        title: "Curated deal flow",
        body: "Deals of the Week are hand-tagged by admin — publish listings to the site, flag featured picks, and rank them for investor discovery.",
      },
    ],
  },
  calculators: {
    eyebrow: "Deal math",
    title: "Investment calculators",
    intro:
      "Model notes, cap rates, and multifamily NOI live. Syndicate+ members get unlimited runs; guests get a daily preview.",
    legacyEyebrow: "Phase 2 archive",
    legacyTitle: "Flip, BRRRR & wholesale analyzers",
    legacyIntro:
      "Legacy deal models with ListQik commission compare, push-to-listing, and deal-memo PDF export for logged-in members.",
  },
  deals: {
    eyebrow: "Deals of the Week",
    title: "Admin-curated investor picks",
    intro:
      "Featured listings tagged in the admin dashboard — publish, mark Deal of the Week, set rank, and optional expiry.",
    viewAll: "View all listings",
    empty: "No featured deals this week. Check back soon or browse full inventory.",
  },
};

export function getInvestorsCopy(): InvestorsCopy {
  return INVESTORS_COPY;
}
