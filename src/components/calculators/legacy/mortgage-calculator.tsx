"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateMortgage } from "@/lib/calculators/legacy/mortgage";
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

const SLUG = "legacy-mortgage";

export function MortgageCalculator({ access: accessProp }: { access?: CalculatorAccess | null }) {
  const hook = useCalculatorAccess(SLUG);
  const access = accessProp ?? hook.access;
  const address = useCalculatorAddress();
  const [loanAmount, setLoanAmount] = useState(320_000);
  const [interestRatePct, setInterestRatePct] = useState(6.75);
  const [termYears, setTermYears] = useState(30);
  const [annualTaxes, setAnnualTaxes] = useState(6_200);
  const [annualInsurance, setAnnualInsurance] = useState(1_800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [propertyValue, setPropertyValue] = useState(400_000);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!hook.loading && !ran && !hook.blocked && !hook.guestLimited && hook.access?.canRun) {
      void hook.recordRun().then((ok) => ok && setRan(true));
    }
  }, [hook.loading, hook.blocked, hook.guestLimited, hook.access?.canRun, hook.recordRun, ran]);

  const result = useMemo(
    () =>
      calculateMortgage({
        loanAmount,
        interestRatePct,
        termYears,
        annualTaxes,
        annualInsurance,
        monthlyHoa,
        propertyValue,
      }),
    [loanAmount, interestRatePct, termYears, annualTaxes, annualInsurance, monthlyHoa, propertyValue],
  );

  if (hook.blocked || hook.guestLimited) {
    return (
      <CalculatorShell kicker="Capital" title="Mortgage & Leverage" description="Daily limit reached.">
        <p className="text-sm text-amber-100">Sign in for unlimited runs.</p>
      </CalculatorShell>
    );
  }

  return (
    <CalculatorShell
      kicker="Capital"
      title="Mortgage & Leverage"
      description="Principal & interest, LTV, DSCR, and amortization — with ListQik listing savings on exit."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CalcField label="Loan amount" value={loanAmount} onChange={setLoanAmount} step={5000} />
          <CalcField label="Property value" value={propertyValue} onChange={setPropertyValue} step={5000} />
          <CalcField label="Interest rate %" value={interestRatePct} onChange={setInterestRatePct} min={0} max={15} step={0.125} />
          <CalcField label="Term (years)" value={termYears} onChange={setTermYears} min={5} max={40} step={1} />
          <CalcField label="Annual taxes" value={annualTaxes} onChange={setAnnualTaxes} step={100} />
          <CalcField label="Annual insurance" value={annualInsurance} onChange={setAnnualInsurance} step={100} />
          <CalcField label="Monthly HOA" value={monthlyHoa} onChange={setMonthlyHoa} step={25} />
        </div>
        <div className="space-y-4">
          <ResultGrid
            rows={[
              { label: "Monthly P&I", value: money(result.monthlyPi), accent: true },
              { label: "Total monthly payment", value: money(result.monthlyPaymentTotal) },
              { label: "LTV", value: pct(result.ltvPct) },
              { label: "DSCR (8% NOI proxy)", value: result.dscr.toFixed(2) },
              { label: "ListQik savings on sale", value: money(result.listQikSavingsOnSale) },
            ]}
          />
          <div className="max-h-48 overflow-auto rounded-xl border border-white/10 bg-black/35 p-3 text-xs">
            <p className="mb-2 font-semibold text-emerald-200/80">Amortization (first 24 months)</p>
            {result.amortization.slice(0, 24).map((row) => (
              <div key={row.month} className="flex justify-between gap-2 border-b border-white/5 py-1 tabular-nums text-white/70">
                <span>Mo {row.month}</span>
                <span>{money(row.payment)}</span>
                <span>Bal {money(row.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CalculatorAddressFields {...address} />
      <CalculatorActions
        calculatorSlug={SLUG}
        loginCallbackPath="/calculators/legacy/mortgage"
        access={access}
        price={propertyValue}
        address={address}
        pdfInputs={{ "Loan amount": money(loanAmount), "Property value": money(propertyValue) }}
        pdfOutputs={{ "Monthly payment": money(result.monthlyPaymentTotal), LTV: pct(result.ltvPct) }}
      />
    </CalculatorShell>
  );
}
