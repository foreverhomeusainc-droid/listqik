import { monthlyPrincipalAndInterest } from "@/lib/calculators/mortgage-math";

export type RentalInputs = {
  purchasePrice: number;
  downPaymentPct: number;
  interestRatePct: number;
  loanTermYears: number;
  monthlyRent: number;
  annualTaxes: number;
  annualInsurance: number;
  vacancyPct: number;
  maintenancePct: number;
  managementPct: number;
};

export type RentalYearProjection = {
  year: number;
  cashFlow: number;
  cumulativeCashFlow: number;
};

export type RentalResults = {
  loanAmount: number;
  downPayment: number;
  monthlyPi: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  noi: number;
  capRatePct: number;
  cashOnCashPct: number;
  dscr: number;
  projection5: RentalYearProjection[];
  projection10: RentalYearProjection[];
};

export function calculateRental(inputs: RentalInputs): RentalResults {
  const purchase = Math.max(0, inputs.purchasePrice);
  const downPct = Math.min(100, Math.max(0, inputs.downPaymentPct));
  const downPayment = purchase * (downPct / 100);
  const loanAmount = purchase - downPayment;
  const monthlyPi = monthlyPrincipalAndInterest(
    loanAmount,
    inputs.interestRatePct,
    inputs.loanTermYears,
  );

  const vacancy = Math.min(100, Math.max(0, inputs.vacancyPct)) / 100;
  const maint = Math.min(100, Math.max(0, inputs.maintenancePct)) / 100;
  const mgmt = Math.min(100, Math.max(0, inputs.managementPct)) / 100;

  const grossRent = Math.max(0, inputs.monthlyRent);
  const effectiveRent = grossRent * (1 - vacancy);
  const monthlyTax = Math.max(0, inputs.annualTaxes) / 12;
  const monthlyIns = Math.max(0, inputs.annualInsurance) / 12;
  const monthlyMaint = grossRent * maint;
  const monthlyMgmt = grossRent * mgmt;
  const monthlyOpex = monthlyTax + monthlyIns + monthlyMaint + monthlyMgmt;

  const monthlyCashFlow = effectiveRent - monthlyOpex - monthlyPi;
  const annualCashFlow = monthlyCashFlow * 12;
  const annualDebtService = monthlyPi * 12;
  const noi = (effectiveRent - monthlyOpex) * 12;
  const capRatePct = purchase > 0 ? (noi / purchase) * 100 : 0;
  const cashOnCashPct = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;

  function project(years: number): RentalYearProjection[] {
    const rows: RentalYearProjection[] = [];
    let cumulative = 0;
    for (let y = 1; y <= years; y += 1) {
      cumulative += annualCashFlow;
      rows.push({ year: y, cashFlow: annualCashFlow, cumulativeCashFlow: cumulative });
    }
    return rows;
  }

  return {
    loanAmount,
    downPayment,
    monthlyPi,
    monthlyCashFlow,
    annualCashFlow,
    noi,
    capRatePct,
    cashOnCashPct,
    dscr,
    projection5: project(5),
    projection10: project(10),
  };
}
