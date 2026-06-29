import {
  LEGACY_CALCULATOR_CATALOG,
  legacyCalculatorBySlug,
  legacyCalculatorById,
  resolveLegacyCalculator,
  type LegacyCalculatorId,
  type LegacyCalculatorMeta,
} from "@/lib/calculators/legacy/types";

export type InvestmentCalculatorId =
  | "mortgage"
  | "reverse-invest"
  | "note-buyer"
  | "present-value"
  | "rent-home"
  | "multifamily";

export type CalculatorId = InvestmentCalculatorId | LegacyCalculatorId;

export type CalculatorAccessLevel = "anonymous" | "scout" | "syndicate";

export type InvestmentCalculatorMeta = {
  id: InvestmentCalculatorId;
  slug: string;
  name: string;
  description: string;
  investorFocus: string;
  tabLabel: string;
};

export type CalculatorMeta = InvestmentCalculatorMeta | LegacyCalculatorMeta;

export const INVESTMENT_CALCULATOR_CATALOG: InvestmentCalculatorMeta[] = [
  {
    id: "mortgage",
    slug: "mortgage",
    name: "Mortgage",
    tabLabel: "Mortgage",
    description: "Forward P&I, back-calculate home price from payment, and balloon terms.",
    investorFocus: "Purchase financing",
  },
  {
    id: "reverse-invest",
    slug: "reverse-invest",
    name: "Reverse Invest",
    tabLabel: "Reverse Invest",
    description: "Private reverse mortgage investor analysis with scenarios and charts.",
    investorFocus: "Note investors",
  },
  {
    id: "note-buyer",
    slug: "note-buyer",
    name: "Note Buyer",
    tabLabel: "Note Buyer",
    description: "Seasoned note pricing from yield or target profit.",
    investorFocus: "Note buyers",
  },
  {
    id: "present-value",
    slug: "present-value",
    name: "Present Value",
    tabLabel: "Present Value",
    description: "Discount future cash flows to present value.",
    investorFocus: "Cash flow modeling",
  },
  {
    id: "rent-home",
    slug: "rent-home",
    name: "Rent Home",
    tabLabel: "Rent Home",
    description: "SFR cap-rate valuation (NOI ÷ cap rate).",
    investorFocus: "SFR valuation",
  },
  {
    id: "multifamily",
    slug: "multifamily",
    name: "Multi-Family",
    tabLabel: "Multi-Family",
    description: "Cap-rate valuation with in-operation unit adjustment.",
    investorFocus: "Multifamily valuation",
  },
];

export const CALCULATOR_CATALOG = INVESTMENT_CALCULATOR_CATALOG;

export const ALL_CALCULATOR_IDS: CalculatorId[] = [
  ...INVESTMENT_CALCULATOR_CATALOG.map((c) => c.id),
  ...LEGACY_CALCULATOR_CATALOG.map((c) => c.id),
];

export function investmentCalculatorBySlug(slug: string): InvestmentCalculatorMeta | null {
  return INVESTMENT_CALCULATOR_CATALOG.find((c) => c.slug === slug) ?? null;
}

export function calculatorBySlug(slug: string): CalculatorMeta | null {
  return investmentCalculatorBySlug(slug) ?? legacyCalculatorBySlug(slug);
}

/** Access API key — investment slugs or legacy catalog ids. */
export function calculatorByAccessKey(key: string): CalculatorMeta | null {
  const inv = investmentCalculatorBySlug(key);
  if (inv) return inv;
  return legacyCalculatorById(key);
}

export { LEGACY_CALCULATOR_CATALOG, legacyCalculatorBySlug, legacyCalculatorById, resolveLegacyCalculator };
