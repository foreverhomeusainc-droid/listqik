"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalculatorGatingBanner } from "@/components/calculators/calculator-shell";
import { useCalculatorAccess } from "@/components/calculators/use-calculator-access";
import {
  InvError,
  InvField,
  InvPurpose,
  InvResult,
  InvSelect,
} from "@/components/calculators/investment/investment-ui";
import { ReverseInvestCharts } from "@/components/calculators/investment/reverse-invest-charts";
import { formatCurrency, formatPercent } from "@/lib/calculators/investment/format";
import {
  analyzeReverseInvestment,
  calculateMortgage,
  calculateMultifamilyValuation,
  calculateNoteBuyer,
  calculatePresentValue,
  calculateRentValuation,
  defaultLtvForAge,
  reverseScenarioVariants,
} from "@/lib/calculators/investment/math";
import {
  INVESTMENT_CALCULATOR_CATALOG,
  type InvestmentCalculatorId,
  type InvestmentCalculatorMeta,
} from "@/lib/calculators/types";

const BALLOON_TERM_OPTIONS = [3, 5, 7, 10];
const TERM_PRESETS = [15, 20, 30];

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative shrink-0 px-4 py-3.5 text-sm font-semibold transition ${
        active ? "text-emerald-50" : "text-white/45 hover:text-white/75"
      }`}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-lime-400" />
      ) : null}
    </button>
  );
}

export function InvestmentCalculatorsApp({
  memberBasePath = "/dashboard",
  initialTab = "mortgage",
  showLegacyLink = true,
  legacyLinkHref = "/calculators/legacy",
  catalogIds,
  showHeader = true,
  headerEyebrow = "Investor tools",
  headerTitle = "Investment Calculators",
  headerSubtitle = "Mortgage, reverse invest, note buying, present value, rent home, and multi-family valuation — updated live as you edit inputs.",
}: {
  memberBasePath?: string;
  initialTab?: InvestmentCalculatorId;
  showLegacyLink?: boolean;
  legacyLinkHref?: string;
  catalogIds?: InvestmentCalculatorId[];
  showHeader?: boolean;
  headerEyebrow?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}) {
  const catalog = useMemo((): InvestmentCalculatorMeta[] => {
    if (!catalogIds?.length) return INVESTMENT_CALCULATOR_CATALOG;
    const allowed = new Set(catalogIds);
    return INVESTMENT_CALCULATOR_CATALOG.filter((c) => allowed.has(c.id));
  }, [catalogIds]);

  const defaultTab = catalog[0]?.id ?? "mortgage";
  const validTab = catalog.some((c) => c.id === initialTab) ? initialTab : defaultTab;
  const [tab, setTab] = useState<InvestmentCalculatorId>(validTab);
  const activeSlug = catalog.find((c) => c.id === tab)?.slug ?? catalog[0]?.slug ?? "mortgage";
  const { access, loading, blocked, recordRun } = useCalculatorAccess(activeSlug);
  const [ran, setRan] = useState(false);

  const guestLimited =
    !loading && access && !access.isAuthenticated && !access.canRun;

  useEffect(() => {
    setTab(validTab);
  }, [validTab]);

  useEffect(() => {
    setRan(false);
  }, [tab]);

  useEffect(() => {
    if (!loading && !ran && !blocked && !guestLimited && access?.canRun) {
      void recordRun().then((ok) => ok && setRan(true));
    }
  }, [loading, ran, blocked, guestLimited, access?.canRun, recordRun]);

  // Mortgage state
  const [homePrice, setHomePrice] = useState("450000");
  const [downPayment, setDownPayment] = useState("20");
  const [dpMode, setDpMode] = useState<"percent" | "dollar">("percent");
  const [termYears, setTermYears] = useState(30);
  const [rate, setRate] = useState("6.5");
  const [payment, setPayment] = useState("");
  const [paymentSource, setPaymentSource] = useState<"loan" | "payment">("loan");
  const [balloonEnabled, setBalloonEnabled] = useState(false);
  const [balloonYears, setBalloonYears] = useState(5);

  const balloonOptions = BALLOON_TERM_OPTIONS.filter((y) => y < termYears);
  const effectiveBalloonYears = balloonOptions.includes(balloonYears)
    ? balloonYears
    : balloonOptions[balloonOptions.length - 1] ?? 5;

  const mortgage = useMemo(() => {
    return calculateMortgage({
      homePrice: num(homePrice),
      downPayment: num(downPayment),
      downPaymentMode: dpMode,
      ratePct: num(rate),
      termYears,
      monthlyPayment: paymentSource === "payment" ? num(payment) : undefined,
      source: paymentSource,
      balloonEnabled,
      balloonYears: effectiveBalloonYears,
    });
  }, [
    homePrice,
    downPayment,
    dpMode,
    rate,
    termYears,
    payment,
    paymentSource,
    balloonEnabled,
    effectiveBalloonYears,
  ]);

  // Reverse invest
  const [rmValue, setRmValue] = useState("425000");
  const [rmAppr, setRmAppr] = useState("3");
  const [rmYears, setRmYears] = useState("12");
  const [rmBalance, setRmBalance] = useState("85000");
  const [rmRate, setRmRate] = useState("5.25");
  const [rmOrig, setRmOrig] = useState("3500");
  const [rmClosing, setRmClosing] = useState("1200");
  const [rmAge, setRmAge] = useState("72");
  const [rmLtv, setRmLtv] = useState("52.5");
  const [rmLtvManual, setRmLtvManual] = useState(false);

  const syncLtvFromAge = useCallback(() => {
    if (rmLtvManual) return;
    const ltv = defaultLtvForAge(num(rmAge));
    setRmLtv(ltv.toFixed(1));
  }, [rmAge, rmLtvManual]);

  useEffect(() => {
    syncLtvFromAge();
  }, [rmAge, syncLtvFromAge]);

  const reverseInput = useMemo(
    () => ({
      propertyValue: num(rmValue),
      appreciationPct: num(rmAppr),
      years: num(rmYears) || 12,
      existingBalance: num(rmBalance),
      ratePct: num(rmRate),
      origination: num(rmOrig),
      closing: num(rmClosing),
      ltvPct: num(rmLtv),
    }),
    [rmValue, rmAppr, rmYears, rmBalance, rmRate, rmOrig, rmClosing, rmLtv],
  );

  const reverse = useMemo(() => analyzeReverseInvestment(reverseInput), [reverseInput]);
  const reverseScenarios = useMemo(() => {
    const v = reverseScenarioVariants(reverseInput);
    return {
      conservative: analyzeReverseInvestment(v.conservative),
      expected: reverse,
      optimistic: analyzeReverseInvestment(v.optimistic),
    };
  }, [reverseInput, reverse]);

  // Note buyer
  const [nRate, setNRate] = useState("4.5");
  const [nRemaining, setNRemaining] = useState("15");
  const [nRemainingUnit, setNRemainingUnit] = useState<"years" | "months">("years");
  const [nPayment, setNPayment] = useState("1250");
  const [nYield, setNYield] = useState("8");
  const [nTargetProfit, setNTargetProfit] = useState("");

  const note = useMemo(
    () =>
      calculateNoteBuyer({
        noteRatePct: num(nRate),
        remaining: num(nRemaining),
        remainingUnit: nRemainingUnit,
        payment: num(nPayment),
        buyerYieldPct: num(nYield),
        targetProfit: nTargetProfit.trim() ? num(nTargetProfit) : null,
      }),
    [nRate, nRemaining, nRemainingUnit, nPayment, nYield, nTargetProfit],
  );

  // Present value
  const [pvAmount, setPvAmount] = useState("500");
  const [pvFreq, setPvFreq] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [pvRate, setPvRate] = useState("8");
  const [pvTime, setPvTime] = useState("10");
  const [pvTimeUnit, setPvTimeUnit] = useState<"years" | "periods">("years");

  const pv = useMemo(
    () =>
      calculatePresentValue({
        amount: num(pvAmount),
        frequency: pvFreq,
        ratePct: num(pvRate),
        time: num(pvTime),
        timeUnit: pvTimeUnit,
      }),
    [pvAmount, pvFreq, pvRate, pvTime, pvTimeUnit],
  );

  // Rent home
  const [rhGross, setRhGross] = useState("2200");
  const [rhGrossPeriod, setRhGrossPeriod] = useState<"weekly" | "monthly" | "annual">("monthly");
  const [rhExp, setRhExp] = useState("450");
  const [rhExpPeriod, setRhExpPeriod] = useState<"weekly" | "monthly" | "annual">("monthly");
  const [rhCap, setRhCap] = useState("6.5");

  const rentHome = useMemo(
    () =>
      calculateRentValuation({
        gross: num(rhGross),
        grossPeriod: rhGrossPeriod,
        expenses: num(rhExp),
        expensePeriod: rhExpPeriod,
        capPct: num(rhCap),
      }),
    [rhGross, rhGrossPeriod, rhExp, rhExpPeriod, rhCap],
  );

  // Multifamily
  const [mfUnits, setMfUnits] = useState("8");
  const [mfInOp, setMfInOp] = useState("1");
  const [mfGross, setMfGross] = useState("12000");
  const [mfGrossPeriod, setMfGrossPeriod] = useState<"weekly" | "monthly" | "annual">("monthly");
  const [mfExp, setMfExp] = useState("3200");
  const [mfExpPeriod, setMfExpPeriod] = useState<"weekly" | "monthly" | "annual">("monthly");
  const [mfCap, setMfCap] = useState("6");

  const multifamily = useMemo(
    () =>
      calculateMultifamilyValuation({
        totalUnits: num(mfUnits),
        inOpUnits: num(mfInOp),
        gross: num(mfGross),
        grossPeriod: mfGrossPeriod,
        expenses: num(mfExp),
        expensePeriod: mfExpPeriod,
        capPct: num(mfCap),
      }),
    [mfUnits, mfInOp, mfGross, mfGrossPeriod, mfExp, mfExpPeriod, mfCap],
  );

  if (blocked || guestLimited) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-amber-50">Daily limit reached</h2>
        <p className="mt-2 text-sm text-amber-100/80">
          Create a free account for unlimited calculator runs.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const riskBadge =
    reverse.risk === "red"
      ? "border-red-500/35 bg-red-500/10 text-red-300"
      : reverse.risk === "yellow"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
        : "border-emerald-500/35 bg-emerald-500/10 text-emerald-200";

  return (
    <div className="space-y-6">
      {showHeader ? (
        <header className="rounded-2xl border border-emerald-500/25 bg-black/45 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
                {headerEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-emerald-50 sm:text-4xl">{headerTitle}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                {headerSubtitle}
              </p>
            </div>
            {showLegacyLink ? (
              <Link
                href={legacyLinkHref}
                className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-white/55 hover:border-white/30 hover:text-white/80"
              >
                Legacy calculators (OLD)
              </Link>
            ) : null}
          </div>
        </header>
      ) : null}

      {!loading ? <CalculatorGatingBanner access={access} memberBasePath={memberBasePath} /> : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
        <div
          className="flex overflow-x-auto border-b border-white/10 bg-black/50"
          role="tablist"
        >
          {catalog.map((calc) => (
            <TabButton key={calc.id} active={tab === calc.id} onClick={() => setTab(calc.id)}>
              {calc.tabLabel}
            </TabButton>
          ))}
        </div>

        {tab === "mortgage" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Model a forward purchase mortgage
              — monthly P&amp;I, total interest, and loan cost. Edit monthly payment to back into an
              affordable home price, or enable balloon terms for investor financing.
            </InvPurpose>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <InvField label="Home Price" prefix="$" value={homePrice} onChange={setHomePrice} />
                <div className="space-y-1.5">
                  <InvField
                    label="Down Payment"
                    prefix={dpMode === "dollar" ? "$" : undefined}
                    suffix={dpMode === "percent" ? "%" : undefined}
                    value={downPayment}
                    onChange={setDownPayment}
                    max={dpMode === "percent" ? 100 : undefined}
                  />
                  <select
                    value={dpMode}
                    onChange={(e) => setDpMode(e.target.value as "percent" | "dollar")}
                    className="w-24 rounded-lg border border-white/15 bg-black/50 px-2 py-1.5 text-sm text-white"
                  >
                    <option value="percent">%</option>
                    <option value="dollar">$</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-50/90">Loan term</p>
                  <div className="flex gap-2">
                    {TERM_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTermYears(t)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                          termYears === t
                            ? "border-emerald-500 bg-emerald-600 text-white"
                            : "border-white/15 text-white/50 hover:bg-white/5"
                        }`}
                      >
                        {t} yr
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={termYears}
                    onChange={(e) => setTermYears(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <InvField label="Interest Rate" suffix="%" value={rate} onChange={setRate} step="0.125" />
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={paymentSource === "payment"}
                    onChange={(e) => setPaymentSource(e.target.checked ? "payment" : "loan")}
                    className="accent-emerald-500"
                  />
                  Back-calculate home price from monthly payment
                </label>
                {paymentSource === "payment" ? (
                  <InvField
                    label="Target Monthly P&I Payment"
                    prefix="$"
                    value={payment}
                    onChange={setPayment}
                  />
                ) : null}
                <InvError message={mortgage.error} />
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={balloonEnabled}
                    onChange={(e) => setBalloonEnabled(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Enable balloon payment
                </label>
                {balloonEnabled ? (
                  <InvSelect
                    label="Balloon due"
                    value={String(balloonYears)}
                    onChange={(v) => setBalloonYears(parseInt(v, 10))}
                    options={
                      balloonOptions.length
                        ? balloonOptions.map((y) => ({ value: String(y), label: `${y} years` }))
                        : [{ value: "5", label: "No term available" }]
                    }
                  />
                ) : null}
                {paymentSource === "payment" && mortgage.homePrice > 0 ? (
                  <p className="text-sm text-emerald-300/80">
                    Implied home price: {formatCurrency(mortgage.homePrice, 0)}
                  </p>
                ) : null}
              </div>
              <div className="space-y-3">
                <InvResult label="Monthly P&I" value={formatCurrency(mortgage.monthlyPayment, 2)} accent />
                <div className="grid gap-3 sm:grid-cols-2">
                  <InvResult label="Total Interest" value={formatCurrency(mortgage.totalInterest, 0)} />
                  <InvResult label="Total Loan Cost" value={formatCurrency(mortgage.totalCost, 0)} />
                  <InvResult label="Loan Amount" value={formatCurrency(mortgage.loanAmount, 0)} />
                  <InvResult label="Down Payment" value={formatCurrency(mortgage.downPaymentDollar, 0)} />
                </div>
                {balloonEnabled && mortgage.balloon ? (
                  <div className="mt-4 space-y-3 rounded-xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-emerald-50">Balloon summary</p>
                    <InvError message={mortgage.balloon.error} />
                    {!mortgage.balloon.error ? (
                      <>
                        <InvResult label="Balloon balance" value={formatCurrency(mortgage.balloon.balance, 0)} accent />
                        <p className="text-xs text-white/50">{mortgage.balloon.when}</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <InvResult label="Interest to balloon" value={formatCurrency(mortgage.balloon.interestBeforeBalloon, 0)} />
                          <InvResult label="Total before balloon" value={formatCurrency(mortgage.balloon.totalBeforeBalloon, 0)} />
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {tab === "reverse-invest" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Analyze a private reverse mortgage
              investment — principal advance, projected loan growth, equity cushion, and scenario
              comparison.
            </InvPurpose>
            <div className={`mb-6 rounded-xl border p-4 ${riskBadge}`}>
              <p className="font-semibold">
                {reverse.risk === "red" ? "High Risk" : reverse.risk === "yellow" ? "Moderate Risk" : "Low Risk"}
              </p>
              <p className="mt-1 text-sm opacity-90">
                {reverse.risk === "red"
                  ? "Projected loan exceeds estimated property value."
                  : reverse.risk === "yellow"
                    ? "Limited equity cushion at payoff."
                    : "Property value comfortably exceeds projected loan balance."}
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <InvField label="Property Value" prefix="$" value={rmValue} onChange={setRmValue} />
                <InvField label="Borrower Age" value={rmAge} onChange={setRmAge} />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InvField label="Max LTV %" suffix="%" value={rmLtv} onChange={(v) => { setRmLtvManual(true); setRmLtv(v); }} />
                  </div>
                  {rmLtvManual ? (
                    <button type="button" onClick={() => setRmLtvManual(false)} className="rounded-lg border border-white/15 px-3 py-2.5 text-xs text-white/60 hover:text-white">
                      Reset LTV
                    </button>
                  ) : null}
                </div>
                <InvField label="Appreciation %" suffix="%" value={rmAppr} onChange={setRmAppr} />
                <InvField label="Hold Period (years)" value={rmYears} onChange={setRmYears} />
                <InvField label="Existing Mortgage" prefix="$" value={rmBalance} onChange={setRmBalance} />
                <InvField label="Note Rate %" suffix="%" value={rmRate} onChange={setRmRate} />
                <InvField label="Origination Fee" prefix="$" value={rmOrig} onChange={setRmOrig} />
                <InvField label="Closing Costs" prefix="$" value={rmClosing} onChange={setRmClosing} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InvResult label="Principal Limit" value={formatCurrency(reverse.principalLimit, 0)} accent />
                <InvResult label="Cash to Borrower" value={formatCurrency(reverse.availableCash, 0)} />
                <InvResult label="Future Loan Balance" value={formatCurrency(reverse.futureLoanBalance, 0)} />
                <InvResult label="Future Property Value" value={formatCurrency(reverse.futurePropertyValue, 0)} />
                <InvResult
                  label="Remaining Equity"
                  value={formatCurrency(reverse.remainingEquity, 0)}
                  className={reverse.remainingEquity < 0 ? "text-red-400" : "text-emerald-50"}
                />
                <InvResult label="Equity Cushion" value={formatPercent(reverse.equityCushion, 1)} />
                <InvResult label="Investor Return" value={formatCurrency(reverse.investorReturn, 0)} />
                <InvResult label="Annualized Return" value={formatPercent(reverse.annualizedReturn, 1)} />
                <InvResult label="Net Profit" value={formatCurrency(reverse.netProfit, 0)} />
                <InvResult label="Net ROI" value={formatPercent(reverse.netRoi, 1)} />
              </div>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="p-3 font-medium">Metric</th>
                    <th className="p-3 font-medium">Conservative</th>
                    <th className="p-3 font-medium">Expected</th>
                    <th className="p-3 font-medium">Optimistic</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Future Loan Balance", key: "futureLoanBalance" as const },
                    { label: "Future Property Value", key: "futurePropertyValue" as const },
                    { label: "Remaining Equity", key: "remainingEquity" as const },
                    { label: "Net Profit", key: "netProfit" as const },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-white/5">
                      <td className="p-3 text-white/55">{row.label}</td>
                      {(["conservative", "expected", "optimistic"] as const).map((s) => (
                        <td key={s} className="p-3 font-mono text-emerald-50/90">
                          {formatCurrency(reverseScenarios[s][row.key], 0)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8">
              <ReverseInvestCharts result={reverse} />
            </div>
          </section>
        ) : null}

        {tab === "note-buyer" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Price a seasoned note from required
              yield or a fixed target profit.
            </InvPurpose>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <InvField label="Note Rate" suffix="%" value={nRate} onChange={setNRate} />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Payments Remaining" value={nRemaining} onChange={setNRemaining} />
                  </div>
                  <InvSelect
                    label="Unit"
                    value={nRemainingUnit}
                    onChange={(v) => setNRemainingUnit(v as "years" | "months")}
                    options={[
                      { value: "years", label: "Years" },
                      { value: "months", label: "Months" },
                    ]}
                  />
                </div>
                <InvField label="Monthly Payment" prefix="$" value={nPayment} onChange={setNPayment} />
                <InvField label="Required Yield" suffix="%" value={nYield} onChange={setNYield} />
                <InvField label="Target Profit (optional)" prefix="$" value={nTargetProfit} onChange={setNTargetProfit} type="text" />
                <InvError message={note.error} />
              </div>
              <div className="space-y-3">
                <InvResult label="Purchase Price" value={formatCurrency(note.purchasePrice, 0)} accent />
                <div className="grid gap-3 sm:grid-cols-2">
                  <InvResult label="Est. Remaining Principal" value={formatCurrency(note.estPrincipal, 0)} />
                  <InvResult label="Nominal Received" value={formatCurrency(note.nominal, 0)} />
                  <InvResult label="Discount / Premium" value={formatCurrency(note.spread, 0)} className={note.spread < 0 ? "text-amber-300" : "text-emerald-300"} />
                  <InvResult label="Gross Spread" value={formatCurrency(note.grossSpread, 0)} />
                  <InvResult label="ROI" value={formatPercent(note.roi, 1)} />
                </div>
                {note.impliedYield !== null ? (
                  <InvResult label="Implied Yield" value={formatPercent(note.impliedYield, 2)} />
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {tab === "present-value" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Discount a stream of equal payments
              to present value at your required rate of return.
            </InvPurpose>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <InvField label="Payment Amount" prefix="$" value={pvAmount} onChange={setPvAmount} />
                <InvSelect
                  label="Frequency"
                  value={pvFreq}
                  onChange={(v) => setPvFreq(v as typeof pvFreq)}
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "quarterly", label: "Quarterly" },
                    { value: "annual", label: "Annual" },
                  ]}
                />
                <InvField label="Discount Rate" suffix="%" value={pvRate} onChange={setPvRate} />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Time" value={pvTime} onChange={setPvTime} />
                  </div>
                  <InvSelect
                    label="Unit"
                    value={pvTimeUnit}
                    onChange={(v) => setPvTimeUnit(v as typeof pvTimeUnit)}
                    options={[
                      { value: "years", label: "Years" },
                      { value: "periods", label: "Periods" },
                    ]}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <InvResult label="Present Value" value={formatCurrency(pv.pv, 0)} accent />
                <InvResult label="Nominal Total" value={formatCurrency(pv.nominal, 0)} />
                <InvResult label="Periods" value={String(pv.periods)} />
              </div>
            </div>
          </section>
        ) : null}

        {tab === "rent-home" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Value a single-family rental using
              NOI and a market cap rate.
            </InvPurpose>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Gross Rent" prefix="$" value={rhGross} onChange={setRhGross} />
                  </div>
                  <InvSelect
                    label="Period"
                    value={rhGrossPeriod}
                    onChange={(v) => setRhGrossPeriod(v as typeof rhGrossPeriod)}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "annual", label: "Annual" },
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Operating Expenses" prefix="$" value={rhExp} onChange={setRhExp} />
                  </div>
                  <InvSelect
                    label="Period"
                    value={rhExpPeriod}
                    onChange={(v) => setRhExpPeriod(v as typeof rhExpPeriod)}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "annual", label: "Annual" },
                    ]}
                  />
                </div>
                <InvField label="Cap Rate" suffix="%" value={rhCap} onChange={setRhCap} />
                <InvError message={rentHome.error} />
              </div>
              <div className="space-y-3">
                <InvResult label="NOI" value={formatCurrency(rentHome.noi, 0)} accent />
                <InvResult label="Estimated Value" value={rentHome.valuation !== null ? formatCurrency(rentHome.valuation, 0) : "—"} />
                <InvResult label="GRM" value={rentHome.grm !== null ? `${rentHome.grm.toFixed(2)}×` : "—"} />
              </div>
            </div>
          </section>
        ) : null}

        {tab === "multifamily" ? (
          <section className="p-6 sm:p-8" role="tabpanel">
            <InvPurpose>
              <strong className="text-white/80">Purpose:</strong> Value a multifamily asset with
              in-operation unit adjustment and cap-rate valuation.
            </InvPurpose>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <InvField label="Total Units" value={mfUnits} onChange={setMfUnits} />
                <InvField label="In-Operation Units" value={mfInOp} onChange={setMfInOp} />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Gross Rent" prefix="$" value={mfGross} onChange={setMfGross} />
                  </div>
                  <InvSelect
                    label="Period"
                    value={mfGrossPeriod}
                    onChange={(v) => setMfGrossPeriod(v as typeof mfGrossPeriod)}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "annual", label: "Annual" },
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InvField label="Operating Expenses" prefix="$" value={mfExp} onChange={setMfExp} />
                  </div>
                  <InvSelect
                    label="Period"
                    value={mfExpPeriod}
                    onChange={(v) => setMfExpPeriod(v as typeof mfExpPeriod)}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "annual", label: "Annual" },
                    ]}
                  />
                </div>
                <InvField label="Cap Rate" suffix="%" value={mfCap} onChange={setMfCap} />
                <InvError message={multifamily.error} />
              </div>
              <div className="space-y-3">
                <p className="text-sm text-white/55">{multifamily.operatingUnitsLabel}</p>
                <InvResult label="NOI" value={formatCurrency(multifamily.noi, 0)} accent />
                <InvResult
                  label="NOI per Operating Unit"
                  value={multifamily.noiPerUnit !== null ? formatCurrency(multifamily.noiPerUnit, 0) : "—"}
                />
                <InvResult
                  label="Estimated Value"
                  value={multifamily.valuation !== null ? formatCurrency(multifamily.valuation, 0) : "—"}
                />
                <InvResult
                  label="Value per Unit (all)"
                  value={multifamily.valuePerUnit !== null ? formatCurrency(multifamily.valuePerUnit, 0) : "—"}
                />
                <InvResult label="GRM" value={multifamily.grm !== null ? `${multifamily.grm.toFixed(2)}×` : "—"} />
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
