export type CalculatorId =
  | "fix-and-flip"
  | "rental"
  | "multifamily"
  | "mortgage"
  | "brrrr"
  | "wholesale";

export type CalculatorAccessLevel = "anonymous" | "scout" | "syndicate";

export type CalculatorMeta = {
  id: CalculatorId;
  slug: string;
  name: string;
  description: string;
  investorFocus: string;
};

export const CALCULATOR_CATALOG: CalculatorMeta[] = [
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
    id: "multifamily",
    slug: "multifamily",
    name: "Multifamily",
    description: "Unit-scaled NOI, cap rate, DSCR, and rent-growth scenarios.",
    investorFocus: "Small multifamily",
  },
  {
    id: "mortgage",
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

export function calculatorBySlug(slug: string): CalculatorMeta | null {
  return CALCULATOR_CATALOG.find((c) => c.slug === slug) ?? null;
}
