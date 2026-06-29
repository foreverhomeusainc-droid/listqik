export type LegacyCalculatorId =
  | "fix-and-flip"
  | "rental"
  | "legacy-multifamily"
  | "legacy-mortgage"
  | "brrrr"
  | "wholesale";

export type LegacyCalculatorMeta = {
  id: LegacyCalculatorId;
  slug: string;
  name: string;
  description: string;
  investorFocus: string;
};

export const LEGACY_CALCULATOR_CATALOG: LegacyCalculatorMeta[] = [
  {
    id: "fix-and-flip",
    slug: "fix-and-flip",
    name: "Fix & Flip Profit",
    description: "ARV, rehab, holding costs, and margin vs traditional 3% listing commission.",
    investorFocus: "Flippers",
  },
  {
    id: "rental",
    slug: "rental",
    name: "SFR Rental",
    description: "Cash flow, cap rate, cash-on-cash, DSCR, and 5/10-year projections.",
    investorFocus: "Buy & hold",
  },
  {
    id: "legacy-multifamily",
    slug: "multifamily",
    name: "Multifamily",
    description: "Unit-scaled NOI, cap rate, DSCR, and rent-growth scenarios.",
    investorFocus: "Small multifamily",
  },
  {
    id: "legacy-mortgage",
    slug: "mortgage",
    name: "Mortgage & Leverage",
    description: "P&I, LTV, DSCR, and full amortization schedule.",
    investorFocus: "Capital planning",
  },
  {
    id: "brrrr",
    slug: "brrrr",
    name: "BRRRR",
    description: "Cash left in deal, equity created, and infinite-return indicator.",
    investorFocus: "BRRRR operators",
  },
  {
    id: "wholesale",
    slug: "wholesale",
    name: "Wholesale",
    description: "Maximum allowable offer, spread, and buyer profit estimate.",
    investorFocus: "Wholesalers",
  },
];

export function legacyCalculatorBySlug(slug: string): LegacyCalculatorMeta | null {
  return LEGACY_CALCULATOR_CATALOG.find((c) => c.slug === slug) ?? null;
}

export function legacyCalculatorById(id: string): LegacyCalculatorMeta | null {
  return LEGACY_CALCULATOR_CATALOG.find((c) => c.id === id) ?? null;
}

export function resolveLegacyCalculator(key: string): LegacyCalculatorMeta | null {
  return legacyCalculatorById(key) ?? legacyCalculatorBySlug(key);
}
