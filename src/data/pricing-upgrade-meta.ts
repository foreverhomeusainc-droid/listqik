import type { PlanId } from "@/types/pricing-wizard";

/** Stable keys for upgrades; map to GHL product IDs via `GHL_UPGRADE_PRODUCT_IDS` or list all store products. */
export type UpgradeMeta = {
  slug: string;
  name: string;
  description: string;
  toggleAddLabel: string;
  toggleRemoveLabel: string;
  recommendedFor: PlanId[];
};

export const pricingUpgradeMeta: UpgradeMeta[] = [
  {
    slug: "premium-photography-spotlight-listing",
    name: "Premium Photography & Spotlight Listing",
    description:
      "Professional photography, floor plan, and virtual tour package with spotlight placement.",
    toggleAddLabel: "Add spotlight package",
    toggleRemoveLabel: "Remove spotlight package",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "smart-market-analysis",
    name: "Smart Market Analysis (SMA)",
    description: "Expert pricing analysis using recent sales, active listings, and local trends.",
    toggleAddLabel: "Add market analysis",
    toggleRemoveLabel: "Remove market analysis",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "comparative-market-analysis",
    name: "Comparative Market Analysis (CMA)",
    description:
      "Pricing estimate from recent comparable sales nearby, with feature adjustments—supports appraisal-ready pricing and data-backed negotiations.",
    toggleAddLabel: "Add CMA",
    toggleRemoveLabel: "Remove CMA",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "supply-and-demand-audit",
    name: "Supply and Demand Audit",
    description:
      "Local inventory vs buyer demand: absorption rate, list-to-sale ratio, and crowded price brackets—sets your Day 1 pricing and negotiation strategy.",
    toggleAddLabel: "Add supply & demand audit",
    toggleRemoveLabel: "Remove supply & demand audit",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "property-positioning-inspection-virtual",
    name: "Property Positioning Inspection (Virtual)",
    description:
      "Pre-listing marketing audit: curb appeal, visual flow, staging priorities, and feature-to-price positioning—so photos and showings compete at the top of your bracket.",
    toggleAddLabel: "Add positioning inspection",
    toggleRemoveLabel: "Remove positioning inspection",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "active-competition-analysis-virtual",
    name: "Active Competition Analysis (Virtual)",
    description:
      "Analysis of 3–5 rival active listings: first impressions, value gaps, days on market, and seller incentives—stay priced and marketed against today's competition.",
    toggleAddLabel: "Add active competition analysis",
    toggleRemoveLabel: "Remove active competition analysis",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "comprehensive-analysis-bundle",
    name: "Comprehensive Analysis (All 4 Packages)",
    description:
      "Bundle includes Comparative Market Analysis, Supply and Demand Audit, Property Positioning Inspection (Virtual), and Active Competition Analysis (Virtual).",
    toggleAddLabel: "Add comprehensive analysis bundle",
    toggleRemoveLabel: "Remove comprehensive analysis bundle",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "real-time-showing-management",
    name: "Real-Time Showing Management",
    description: "Instant showing request alerts with approve, decline, and reschedule controls.",
    toggleAddLabel: "Add showing management",
    toggleRemoveLabel: "Remove showing management",
    recommendedFor: ["subsonic", "supersonic"],
  },
  {
    slug: "open-house-directional-signs-set-of-5",
    name: "Open House Directional Signs (Set of 5)",
    description: "Directional open house sign set with shipping and handling included.",
    toggleAddLabel: "Add directional signs",
    toggleRemoveLabel: "Remove directional signs",
    recommendedFor: ["subsonic", "supersonic"],
  },
  {
    slug: "professional-yard-sign",
    name: "Professional Yard Sign",
    description: "Two-sided yard sign with your contact phone number and shipping included.",
    toggleAddLabel: "Add yard sign",
    toggleRemoveLabel: "Remove yard sign",
    recommendedFor: ["subsonic", "supersonic"],
  },
  {
    slug: "yard-sign-open-house-signs-bundle",
    name: "Yard Sign + Open House Directional Signs Bundle",
    description: "Bundle option for both the yard sign and directional sign pack.",
    toggleAddLabel: "Add sign bundle",
    toggleRemoveLabel: "Remove sign bundle",
    recommendedFor: ["subsonic", "supersonic"],
  },
  {
    slug: "lockbox",
    name: "Lockbox",
    description: "Combination lockbox for secure key access during showings.",
    toggleAddLabel: "Add lockbox",
    toggleRemoveLabel: "Remove lockbox",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "upgrade-listing-to-maximum-photos",
    name: "Upgrade Listing to Maximum Photos",
    description:
      "Request broker-facilitated max-photo submission where listing rules allow for stronger listing coverage.",
    toggleAddLabel: "Add max photos upgrade",
    toggleRemoveLabel: "Remove max photos upgrade",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "add-a-video-owner-provided",
    name: "Add a Video (Owner Provided)",
    description:
      "Publish your owner-provided listing video where supported by brokerage policy and listing rules.",
    toggleAddLabel: "Add owner-provided video",
    toggleRemoveLabel: "Remove owner-provided video",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "unlimited-open-house-announcements",
    name: "Unlimited Open House Announcements",
    description:
      "Publish unlimited open house announcements across broker-managed listing feeds and public listing channels.",
    toggleAddLabel: "Add unlimited open houses",
    toggleRemoveLabel: "Remove unlimited open houses",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "list-in-an-additional-mls",
    name: "Additional Listing Territory Coordination",
    description:
      "Expand reach with broker-facilitated submission in an additional listing territory.",
    toggleAddLabel: "Add listing territory coordination",
    toggleRemoveLabel: "Remove listing territory coordination",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "personal-transaction-coordinator-service",
    name: "Personal Transaction Coordinator Service",
    description: "Dedicated coordination support from contract to closing milestones.",
    toggleAddLabel: "Add transaction coordinator",
    toggleRemoveLabel: "Remove transaction coordinator",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "contract-preparation-review",
    name: "Contract Preparation & Review",
    description: "Full contract, addendum, and disclosure preparation and review support.",
    toggleAddLabel: "Add contract prep service",
    toggleRemoveLabel: "Remove contract prep service",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
  {
    slug: "open-house-announcement",
    name: "Open House Announcement",
    description:
      "Single open house announcement across broker-syndicated and public portal channels.",
    toggleAddLabel: "Add open house announcement",
    toggleRemoveLabel: "Remove open house announcement",
    recommendedFor: ["subsonic", "supersonic", "hypersonic"],
  },
];
