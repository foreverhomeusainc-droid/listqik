"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateRental } from "@/lib/calculators/rental";
import { CalculatorActions } from "@/components/calculators/calculator-actions";
import {
  CalcField,
  CalculatorAddressFields,
  CalculatorShell,
  money,
  pct,
  ResultGrid,
  useCalculatorAddress,
} from "@/components/calculators/calculator-shell";
import { useCalculatorAccess } from "@/components/calculators/use-calculator-access";
import type { CalculatorAccess } from "@/lib/calculators/access";

const SLUG = "rental";

export function RentalCalculator({ access: accessProp }: { access?: CalculatorAccess | null }) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [purchasePrice, setPurchasePrice] = useState(225_000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRatePct, setInterestRatePct] = useState(7.25);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(1_950);
  const [annualTaxes, setAnnualTaxes] = useState(4_800);
  const [annualInsurance, setAnnualInsurance] = useState(1_400);
  const [vacancyPct, setVacancyPct] = useState(6);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [managementPct, setManagementPct] = useState(8);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran) void hook.recordRun().then((ok) => ok && setRan(true));
  }, [hook.loading, hook, ran]);

  const result = useMemo(
    () =>
      calculateRental({
        purchasePrice,
        downPaymentPct,
        interestRatePct,
        loanTermYears,
        monthlyRent,
        annualTaxes,
        annualInsurance,
        vacancyPct,
        maintenancePct,
        managementPct,
      }),
    [
      purchasePrice,
      downPaymentPct,
      interestRatePct,
      loanTermYears,
      monthlyRent,
      annualTaxes,
      annualInsurance,
      vacancyPct,
      maintenancePct,
      managementPct,
    ],
  );

  if (hook.blocked) {
    return (
      <CalculatorShell kicker="Yield" title="SFR Rental" description="Daily limit reached.">
        <p className="text-sm text-amber-100">Sign in for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="Yield"
      title="Single Family Rental"
      description="Cash flow, cap rate, cash-on-cash, DSCR, and 5/10-year cumulative projections."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} step={5000} />
          <CalcField label="Down payment %" value={downPaymentPct} onChange={setDownPaymentPct} min={0} max={100} />
          <CalcField label="Interest rate %" value={interestRatePct} onChange={setInterestRatePct} step={0.125} />
          <CalcField label="Loan term (years)" value={loanTermYears} onChange={setLoanTermYears} min={15} max={30} />
          <CalcField label="Monthly rent" value={monthlyRent} onChange={setMonthlyRent} step={50} />
          <CalcField label="Annual taxes" value={annualTaxes} onChange={setAnnualTaxes} step={100} />
          <CalcField label="Annual insurance" value={annualInsurance} onChange={setAnnualInsurance} step={100} />
          <CalcField label="Vacancy %" value={vacancyPct} onChange={setVacancyPct} min={0} max={30} />
          <CalcField label="Maintenance %" value={maintenancePct} onChange={setMaintenancePct} min={0} max={30} />
          <CalcField label="Management %" value={managementPct} onChange={setManagementPct} min={0} max={30} />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "Monthly cash flow", value: money(result.monthlyCashFlow), accent: true },
              { label: "Cap rate", value: pct(result.capRatePct) },
              { label: "Cash-on-cash", value: pct(result.cashOnCashPct) },
              { label: "DSCR", value: result.dscr.toFixed(2) },
              { label: "NOI (annual)", value: money(result.noi) },
              { label: "Down payment", value: money(result.downPayment) },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <ProjectionTable title="5-year" rows={result.projection5} />
            <ProjectionTable title="10-year" rows={result.projection10} />
          </div>
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        access={access}
        listingKind="rental"
        price={purchasePrice}
        address={address}
        pdfInputs={{ "Purchase price": money(purchasePrice), Rent: money(monthlyRent) }}
        pdfOutputs={{ "Monthly cash flow": money(result.monthlyCashFlow), "Cap rate": pct(result.capRatePct) }}
      />
    </CalculatorShell>
  );
}

function ProjectionTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ year: number; cumulativeCashFlow: number }>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-xs">
      <p className="font-semibold text-emerald-200/80">{title} cumulative</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-lime-300">
        {money(rows[rows.length - 1]?.cumulativeCashFlow ?? 0)}
      </p>
    </div>
  );
}
