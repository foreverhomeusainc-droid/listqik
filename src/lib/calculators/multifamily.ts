import { monthlyPrincipalAndInterest } from "@/lib/calculators/mortgage-math";

export type MultifamilyInputs = {
  purchasePrice: number;
  unitCount: number;
  averageRent: number;
  vacancyPct: number;
  expenseRatioPct: number;
  downPaymentPct: number;
  interestRatePct: number;
  loanTermYears: number;
  rentGrowthPct: number;
  capitalImprovements: number;
};

export type MultifamilyResults = {
  grossScheduledRent: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  noi: number;
  capRatePct: number;
  loanAmount: number;
  annualDebtService: number;
  dscr: number;
  cashFlowAnnual: number;
  cashOnCashPct: number;
  valueAddNoi: number;
  exitValuationCap6: number;
  exitValuationCap7: number;
  scenarioRentIncreasePct: number;
  scenarioNoi: number;
};

export function calculateMultifamily(inputs: MultifamilyInputs): MultifamilyResults {
  const units = Math.max(1, Math.round(inputs.unitCount));
  const purchase = Math.max(0, inputs.purchasePrice);
  const avgRent = Math.max(0, inputs.averageRent);
  const vacancy = Math.min(100, Math.max(0, inputs.vacancyPct)) / 100;
  const expenseRatio = Math.min(100, Math.max(0, inputs.expenseRatioPct)) / 100;
  const downPct = Math.min(100, Math.max(0, inputs.downPaymentPct));
  const rentGrowth = inputs.rentGrowthPct / 100;

  const grossScheduledRent = avgRent * units * 12;
  const effectiveGrossIncome = grossScheduledRent * (1 - vacancy);
  const operatingExpenses = effectiveGrossIncome * expenseRatio;
  const noi = effectiveGrossIncome - operatingExpenses;

  const downPayment = purchase * (downPct / 100);
  const loanAmount = purchase - downPayment;
  const monthlyPi = monthlyPrincipalAndInterest(
    loanAmount,
    inputs.interestRatePct,
    inputs.loanTermYears,
  );
  const annualDebtService = monthlyPi * 12;
  const cashFlowAnnual = noi - annualDebtService;
  const capRatePct = purchase > 0 ? (noi / purchase) * 100 : 0;
  const cashOnCashPct = downPayment > 0 ? (cashFlowAnnual / downPayment) * 100 : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;

  const scenarioGross = grossScheduledRent * (1 + rentGrowth);
  const scenarioEgi = scenarioGross * (1 - vacancy);
  const scenarioNoi = scenarioEgi - scenarioEgi * expenseRatio;

  const valueAddNoi = noi + Math.max(0, inputs.capitalImprovements) * 0.08;

  return {
    grossScheduledRent,
    effectiveGrossIncome,
    operatingExpenses,
    noi,
    capRatePct,
    loanAmount,
    annualDebtService,
    dscr,
    cashFlowAnnual,
    cashOnCashPct,
    valueAddNoi,
    exitValuationCap6: noi / 0.06,
    exitValuationCap7: noi / 0.07,
    scenarioRentIncreasePct: inputs.rentGrowthPct,
    scenarioNoi,
  };
}
