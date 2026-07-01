"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateMultifamily } from "@/lib/calculators/legacy/multifamily";
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

const SLUG = "legacy-multifamily";

export function MultifamilyCalculator({ access: accessProp }: { access?: CalculatorAccess | null }) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [purchasePrice, setPurchasePrice] = useState(850_000);
  const [unitCount, setUnitCount] = useState(4);
  const [averageRent, setAverageRent] = useState(1_250);
  const [vacancyPct, setVacancyPct] = useState(7);
  const [expenseRatioPct, setExpenseRatioPct] = useState(38);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [interestRatePct, setInterestRatePct] = useState(7.1);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [rentGrowthPct, setRentGrowthPct] = useState(5);
  const [capitalImprovements, setCapitalImprovements] = useState(40_000);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran && !hook.blocked && !hook.guestLimited && hook.access?.canRun) {
      void hook.recordRun().then((ok) => ok && setRan(true));
    }
  }, [hook.loading, hook.blocked, hook.guestLimited, hook.access?.canRun, hook.recordRun, ran]);

  const result = useMemo(
    () =>
      calculateMultifamily({
        purchasePrice,
        unitCount,
        averageRent,
        vacancyPct,
        expenseRatioPct,
        downPaymentPct,
        interestRatePct,
        loanTermYears,
        rentGrowthPct,
        capitalImprovements,
      }),
    [
      purchasePrice,
      unitCount,
      averageRent,
      vacancyPct,
      expenseRatioPct,
      downPaymentPct,
      interestRatePct,
      loanTermYears,
      rentGrowthPct,
      capitalImprovements,
    ],
  );

  if (hook.blocked || hook.guestLimited) {
    return (
      <CalculatorShell kicker="Multifamily" title="Multifamily Investment" description="Daily limit reached.">
        <p className="text-sm text-amber-100">Sign in for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="Multifamily"
      title="Multifamily Investment"
      description="Scale NOI across units, model rent growth, and estimate value-add exit valuations."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="Unit count" value={unitCount} onChange={setUnitCount} min={2} max={20} step={1} />
          <CalcField label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} step={10000} />
          <CalcField label="Average rent / unit" value={averageRent} onChange={setAverageRent} step={50} />
          <CalcField label="Vacancy %" value={vacancyPct} onChange={setVacancyPct} min={0} max={25} />
          <CalcField label="Expense ratio %" value={expenseRatioPct} onChange={setExpenseRatioPct} min={20} max={60} />
          <CalcField label="Down payment %" value={downPaymentPct} onChange={setDownPaymentPct} min={10} max={50} />
          <CalcField label="Interest rate %" value={interestRatePct} onChange={setInterestRatePct} step={0.125} />
          <CalcField label="Loan term (years)" value={loanTermYears} onChange={setLoanTermYears} min={15} max={30} />
          <CalcField label="CapEx budget" value={capitalImprovements} onChange={setCapitalImprovements} step={5000} />
          <CalcField
            label={`Rent growth scenario (+${rentGrowthPct}%)`}
            value={rentGrowthPct}
            onChange={setRentGrowthPct}
            type="range"
            min={0}
            max={15}
            step={1}
          />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "NOI", value: money(result.noi), accent: true },
              { label: "Cap rate", value: pct(result.capRatePct) },
              { label: "DSCR", value: result.dscr.toFixed(2) },
              { label: "Annual cash flow", value: money(result.cashFlowAnnual) },
              { label: "Cash-on-cash", value: pct(result.cashOnCashPct) },
              { label: `Scenario NOI (+${rentGrowthPct}%)`, value: money(result.scenarioNoi) },
              { label: "Exit @ 6% cap", value: money(result.exitValuationCap6) },
              { label: "Exit @ 7% cap", value: money(result.exitValuationCap7) },
            ]}
          />
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        loginCallbackPath="/calculators/legacy/multifamily"
        access={access}
        listingKind="rental"
        price={purchasePrice}
        propertyType="multi-family"
        address={address}
        pdfInputs={{ Units: unitCount, "Purchase price": money(purchasePrice) }}
        pdfOutputs={{ NOI: money(result.noi), "Cap rate": pct(result.capRatePct) }}
      />
    </CalculatorShell>
  );
}
