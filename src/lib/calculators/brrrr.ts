import { monthlyPrincipalAndInterest } from "@/lib/calculators/mortgage-math";

export type BrrrrInputs = {
  purchasePrice: number;
  rehabCosts: number;
  holdingCosts: number;
  arv: number;
  refinanceLtvPct: number;
  interestRatePct: number;
  loanTermYears: number;
  monthlyRent: number;
  vacancyPct: number;
  monthlyExpenses: number;
};

export type BrrrrResults = {
  totalCashIn: number;
  refinanceLoanAmount: number;
  cashLeftInDeal: number;
  equityCreated: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  roiPct: number;
  infiniteReturn: boolean;
};

export function calculateBrrrr(inputs: BrrrrInputs): BrrrrResults {
  const purchase = Math.max(0, inputs.purchasePrice);
  const rehab = Math.max(0, inputs.rehabCosts);
  const holding = Math.max(0, inputs.holdingCosts);
  const arv = Math.max(0, inputs.arv);
  const ltv = Math.min(100, Math.max(0, inputs.refinanceLtvPct)) / 100;

  const totalCashIn = purchase + rehab + holding;
  const refinanceLoanAmount = arv * ltv;
  const cashLeftInDeal = Math.max(0, totalCashIn - refinanceLoanAmount);

  const monthlyPi = monthlyPrincipalAndInterest(
    refinanceLoanAmount,
    inputs.interestRatePct,
    inputs.loanTermYears,
  );
  const vacancy = Math.min(100, Math.max(0, inputs.vacancyPct)) / 100;
  const effectiveRent = Math.max(0, inputs.monthlyRent) * (1 - vacancy);
  const monthlyCashFlow = effectiveRent - Math.max(0, inputs.monthlyExpenses) - monthlyPi;
  const annualCashFlow = monthlyCashFlow * 12;
  const equityCreated = arv - refinanceLoanAmount;
  const roiPct = cashLeftInDeal > 0 ? (annualCashFlow / cashLeftInDeal) * 100 : 0;
  const infiniteReturn = cashLeftInDeal <= 0 && monthlyCashFlow > 0;

  return {
    totalCashIn,
    refinanceLoanAmount,
    cashLeftInDeal,
    equityCreated,
    monthlyCashFlow,
    annualCashFlow,
    roiPct,
    infiniteReturn,
  };
}
