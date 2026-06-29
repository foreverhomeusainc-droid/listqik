import type { HomeLocale } from "@/i18n/home-locale";

export type SiteChromeCopy = {
  header: {
    navLabel: string;
    pricing: string;
    services: string;
    fullService: string;
    about: string;
    serviceArea: string;
    listings: string;
    portfolio: string;
    resources: string;
    university: string;
    calculators: string;
    buyers: string;
    dashboard: string;
    logIn: string;
    viewListings: string;
    startListing: string;
    logOut: string;
  };
  footer: {
    tagline: string;
    brokerSupport: string;
    product: string;
    resources: string;
    legal: string;
    pricing: string;
    listings: string;
    portfolio: string;
    blogs: string;
    videos: string;
    university: string;
    iabs: string;
    consumerProtection: string;
    mlsFines: string;
    mlsRules: string;
    fairHousing: string;
    privacy: string;
    terms: string;
    copyright: string;
    status: string;
    operational: string;
    centralMetroAlt: string;
    youtubeAriaLabel: string;
    tiktokAriaLabel: string;
    instagramAriaLabel: string;
    facebookAriaLabel: string;
    messengerAriaLabel: string;
  };
};

const SITE_CHROME_COPY: SiteChromeCopy = {
  header: {
    navLabel: "Primary",
    pricing: "Pricing",
    services: "Services",
    fullService: "Full Service",
    about: "About",
    serviceArea: "Service Area",
    listings: "Listings",
    portfolio: "Portfolio",
    resources: "Resources",
    university: "University",
    calculators: "Calculators",
    buyers: "Buyer Deals",
    dashboard: "Dashboard",
    logIn: "Log in",
    viewListings: "View Listings",
    startListing: "Start Listing",
    logOut: "Log out",
  },
  footer: {
    tagline:
      "A technical utility for deploying listings fast while retaining more equity.",
    brokerSupport: "Local Texas broker support · 4-hour rapid deployment",
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    pricing: "Pricing",
    listings: "Listings",
    portfolio: "Portfolio",
    blogs: "Blogs",
    videos: "Videos",
    university: "ListQik University",
    iabs: "Information About Brokerage Services (IABS)",
    consumerProtection: "Consumer Protection Notice",
    mlsFines: "MLS Rule Schedule of Fines",
    mlsRules: "MLS Rules and Regulations",
    fairHousing: "Fair Housing",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "All rights reserved.",
    status: "Status:",
    operational: "Operational",
    centralMetroAlt: "Central Metro Realty",
    youtubeAriaLabel: "ListQik on YouTube",
    tiktokAriaLabel: "ListQik on TikTok",
    instagramAriaLabel: "ListQik on Instagram",
    facebookAriaLabel: "ListQik on Facebook",
    messengerAriaLabel: "ListQik on Messenger",
  },
};

/** Site shell (header, footer, primary nav) is always English. */
export const SITE_CHROME_LOCALE: HomeLocale = "en";

export function getSiteShellChromeCopy(): SiteChromeCopy {
  return SITE_CHROME_COPY;
}
