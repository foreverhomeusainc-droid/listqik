"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateBrrrr } from "@/lib/calculators/legacy/brrrr";
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

const SLUG = "brrrr";

export function BrrrrCalculator({ access: accessProp }: { access?: CalculatorAccess | null }) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [purchasePrice, setPurchasePrice] = useState(165_000);
  const [rehabCosts, setRehabCosts] = useState(55_000);
  const [holdingCosts, setHoldingCosts] = useState(9_000);
  const [arv, setArv] = useState(285_000);
  const [refinanceLtvPct, setRefinanceLtvPct] = useState(75);
  const [interestRatePct, setInterestRatePct] = useState(7.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(2_100);
  const [vacancyPct, setVacancyPct] = useState(6);
  const [monthlyExpenses, setMonthlyExpenses] = useState(650);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran) void hook.recordRun().then((ok) => ok && setRan(true));
  }, [hook.loading, hook, ran]);

  const result = useMemo(
    () =>
      calculateBrrrr({
        purchasePrice,
        rehabCosts,
        holdingCosts,
        arv,
        refinanceLtvPct,
        interestRatePct,
        loanTermYears,
        monthlyRent,
        vacancyPct,
        monthlyExpenses,
      }),
    [
      purchasePrice,
      rehabCosts,
      holdingCosts,
      arv,
      refinanceLtvPct,
      interestRatePct,
      loanTermYears,
      monthlyRent,
      vacancyPct,
      monthlyExpenses,
    ],
  );

  if (hook.blocked) {
    return (
      <CalculatorShell kicker="BRRRR" title="BRRRR Analyzer" description="Daily limit reached.">
        <p className="text-sm text-amber-100">Sign in for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="BRRRR"
      title="BRRRR Analyzer"
      description="Buy, rehab, rent, refinance, repeat — with infinite-return indicator when cash left in deal hits zero."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} step={5000} />
          <CalcField label="Rehab costs" value={rehabCosts} onChange={setRehabCosts} step={1000} />
          <CalcField label="Holding costs" value={holdingCosts} onChange={setHoldingCosts} step={500} />
          <CalcField label="ARV" value={arv} onChange={setArv} step={5000} />
          <CalcField label="Refinance LTV %" value={refinanceLtvPct} onChange={setRefinanceLtvPct} min={50} max={80} />
          <CalcField label="Interest rate %" value={interestRatePct} onChange={setInterestRatePct} step={0.125} />
          <CalcField label="Loan term (years)" value={loanTermYears} onChange={setLoanTermYears} min={15} max={30} />
          <CalcField label="Monthly rent" value={monthlyRent} onChange={setMonthlyRent} step={50} />
          <CalcField label="Vacancy %" value={vacancyPct} onChange={setVacancyPct} min={0} max={20} />
          <CalcField label="Monthly expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} step={50} />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "Cash left in deal", value: money(result.cashLeftInDeal), accent: true },
              { label: "Equity created", value: money(result.equityCreated) },
              { label: "Monthly cash flow", value: money(result.monthlyCashFlow) },
              { label: "ROI", value: pct(result.roiPct) },
              {
                label: "Infinite return",
                value: result.infiniteReturn ? "YES — ∞" : "No",
                accent: result.infiniteReturn,
              },
            ]}
          />
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        access={access}
        listingKind="sale"
        price={arv}
        address={address}
        pdfInputs={{ ARV: money(arv), Rehab: money(rehabCosts) }}
        pdfOutputs={{ "Cash left": money(result.cashLeftInDeal), "Infinite return": result.infiniteReturn ? "Yes" : "No" }}
      />
    </CalculatorShell>
  );
}
