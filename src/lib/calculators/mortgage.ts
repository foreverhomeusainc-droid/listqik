import {
  buildAmortizationSchedule,
  monthlyPrincipalAndInterest,
  type AmortizationRow,
} from "@/lib/calculators/mortgage-math";
import { listQikSavingsUsd } from "@/lib/calculators/listqik-fees";

export type MortgageInputs = {
  loanAmount: number;
  interestRatePct: number;
  termYears: number;
  annualTaxes: number;
  annualInsurance: number;
  monthlyHoa: number;
  propertyValue: number;
};

export type MortgageResults = {
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPaymentTotal: number;
  ltvPct: number;
  annualDebtService: number;
  dscr: number;
  listQikSavingsOnSale: number;
  amortization: AmortizationRow[];
};

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const loan = Math.max(0, inputs.loanAmount);
  const value = Math.max(0, inputs.propertyValue);
  const monthlyPi = monthlyPrincipalAndInterest(loan, inputs.interestRatePct, inputs.termYears);
  const monthlyTax = Math.max(0, inputs.annualTaxes) / 12;
  const monthlyInsurance = Math.max(0, inputs.annualInsurance) / 12;
  const monthlyHoa = Math.max(0, inputs.monthlyHoa);
  const monthlyPaymentTotal = monthlyPi + monthlyTax + monthlyInsurance + monthlyHoa;
  const ltvPct = value > 0 ? (loan / value) * 100 : 0;
  const annualDebtService = monthlyPi * 12;
  const dscr = annualDebtService > 0 ? (value * 0.08) / annualDebtService : 0;

  return {
    monthlyPi,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPaymentTotal,
    ltvPct,
    annualDebtService,
    dscr,
    listQikSavingsOnSale: listQikSavingsUsd(value),
    amortization: buildAmortizationSchedule(loan, inputs.interestRatePct, inputs.termYears, 120),
  };
}
