export function clamp0(n: number): number {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function toAnnual(amount: number, period: "weekly" | "monthly" | "annual"): number {
  if (period === "weekly") return amount * 52;
  if (period === "monthly") return amount * 12;
  return amount;
}

export function remainingBalance(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  paymentsMade: number,
): number {
  if (principal <= 0 || paymentsMade <= 0) return principal;
  if (monthlyRate <= 0) return Math.max(0, principal - monthlyPayment * paymentsMade);
  const factor = Math.pow(1 + monthlyRate, paymentsMade);
  return Math.max(0, principal * factor - monthlyPayment * ((factor - 1) / monthlyRate));
}

export function paymentFromLoan(loanAmount: number, ratePct: number, termYears: number): number {
  if (loanAmount <= 0) return 0;
  if (ratePct <= 0) return loanAmount / (termYears * 12);
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  const factor = Math.pow(1 + r, n);
  return (loanAmount * r * factor) / (factor - 1);
}

export function loanFromPayment(monthly: number, ratePct: number, termYears: number): number {
  if (monthly <= 0) return 0;
  if (ratePct <= 0) return monthly * termYears * 12;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
}

export function pvOfAnnuity(pmt: number, annualRatePct: number, periods: number): number {
  if (pmt <= 0 || periods <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r <= 0) return pmt * periods;
  return pmt * ((1 - Math.pow(1 + r, -periods)) / r);
}

export function yieldFromPurchasePrice(
  pmt: number,
  months: number,
  purchasePrice: number,
): number | null {
  if (pmt <= 0 || months <= 0 || purchasePrice <= 0) return null;
  const nominal = pmt * months;
  if (purchasePrice >= nominal) return 0;
  let lo = 0;
  let hi = 0.06;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const pv = mid <= 1e-12 ? nominal : pmt * ((1 - Math.pow(1 + mid, -months)) / mid);
    if (pv > purchasePrice) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 12 * 100;
}

export type MortgageDpMode = "percent" | "dollar";

export function downPaymentDollar(
  price: number,
  dpRaw: number,
  mode: MortgageDpMode,
): number {
  return mode === "percent" ? Math.min(price, price * (dpRaw / 100)) : Math.min(price, dpRaw);
}

export function homePriceFromLoan(
  loanAmount: number,
  dpRaw: number,
  mode: MortgageDpMode,
): number {
  if (mode === "percent") {
    if (dpRaw >= 100) return 0;
    return loanAmount / (1 - dpRaw / 100);
  }
  return loanAmount + dpRaw;
}

export type MortgageInput = {
  homePrice: number;
  downPayment: number;
  downPaymentMode: MortgageDpMode;
  ratePct: number;
  termYears: number;
  monthlyPayment?: number;
  source: "loan" | "payment";
  balloonEnabled: boolean;
  balloonYears: number;
};

export type MortgageResult = {
  homePrice: number;
  downPaymentDollar: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  error?: string;
  balloon?: {
    balance: number;
    when: string;
    interestBeforeBalloon: number;
    totalBeforeBalloon: number;
    error?: string;
  };
};

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const rate = clamp0(input.ratePct);
  let price = clamp0(input.homePrice);
  const dpRaw = clamp0(input.downPayment);
  let loanAmount = 0;
  let downDollar = 0;
  let monthly = 0;
  let error: string | undefined;

  if (input.source === "payment") {
    monthly = clamp0(input.monthlyPayment ?? 0);
    if (monthly <= 0) {
      return {
        homePrice: price,
        downPaymentDollar: 0,
        loanAmount: 0,
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: 0,
      };
    }
    if (input.downPaymentMode === "percent" && dpRaw >= 100) {
      return {
        homePrice: price,
        downPaymentDollar: 0,
        loanAmount: 0,
        monthlyPayment: monthly,
        totalInterest: 0,
        totalCost: 0,
        error: "Down payment must be less than 100% to back-calculate home price.",
      };
    }
    if (rate <= 0) {
      error = "Enter an interest rate greater than 0% to back-calculate from payment.";
    }
    loanAmount = loanFromPayment(monthly, rate, input.termYears);
    price = homePriceFromLoan(loanAmount, dpRaw, input.downPaymentMode);
    downDollar = downPaymentDollar(price, dpRaw, input.downPaymentMode);
    loanAmount = Math.max(0, price - downDollar);
  } else {
    downDollar = downPaymentDollar(price, dpRaw, input.downPaymentMode);
    loanAmount = Math.max(0, price - downDollar);
    monthly = paymentFromLoan(loanAmount, rate, input.termYears);
    if (loanAmount > 0 && rate <= 0) {
      error = "Enter an interest rate greater than 0%.";
    }
  }

  let totalInterest = 0;
  let totalCost = loanAmount;
  if (loanAmount > 0) {
    const n = input.termYears * 12;
    totalCost = monthly * n;
    totalInterest = totalCost - loanAmount;
  }

  const result: MortgageResult = {
    homePrice: Math.round(price),
    downPaymentDollar: downDollar,
    loanAmount,
    monthlyPayment: monthly,
    totalInterest,
    totalCost,
    error,
  };

  if (input.balloonEnabled && loanAmount > 0) {
    const balloonYears = input.balloonYears;
    const validBalloon =
      Number.isFinite(balloonYears) && balloonYears > 0 && balloonYears < input.termYears;
    if (!validBalloon) {
      result.balloon = {
        balance: 0,
        when: "",
        interestBeforeBalloon: 0,
        totalBeforeBalloon: 0,
        error: `Balloon term must be shorter than the loan term (${input.termYears} years).`,
      };
    } else {
      const balloonMonths = balloonYears * 12;
      const r = rate / 100 / 12;
      const balloonBalance = remainingBalance(loanAmount, r, monthly, balloonMonths);
      const paymentsBeforeBalloon = monthly * balloonMonths;
      const totalBeforeBalloon = paymentsBeforeBalloon + balloonBalance;
      const interestBeforeBalloon = totalBeforeBalloon - loanAmount;
      result.balloon = {
        balance: balloonBalance,
        when: `Due at month ${balloonMonths} (${balloonYears}-year balloon on a ${input.termYears}-year amortization)`,
        interestBeforeBalloon,
        totalBeforeBalloon,
      };
    }
  }

  return result;
}

const LTV_ANCHORS: [number, number][] = [
  [62, 40],
  [65, 45],
  [70, 50],
  [75, 55],
  [80, 60],
  [85, 65],
];

export function defaultLtvForAge(age: number): number {
  age = Math.max(62, Math.min(100, age));
  if (age >= 85) return 65;
  for (let i = 0; i < LTV_ANCHORS.length - 1; i++) {
    const [a1, l1] = LTV_ANCHORS[i];
    const [a2, l2] = LTV_ANCHORS[i + 1];
    if (age >= a1 && age <= a2) {
      return l1 + ((age - a1) / (a2 - a1)) * (l2 - l1);
    }
  }
  return 65;
}

export type ReverseInvestInput = {
  propertyValue: number;
  appreciationPct: number;
  years: number;
  existingBalance: number;
  ratePct: number;
  origination: number;
  closing: number;
  ltvPct: number;
};

export type ReverseInvestResult = {
  principalLimit: number;
  availableCash: number;
  futureLoanBalance: number;
  futurePropertyValue: number;
  remainingEquity: number;
  investorReturn: number;
  equityCushion: number;
  grossRoi: number;
  netProfit: number;
  netRoi: number;
  annualizedReturn: number;
  labels: string[];
  loanSeries: number[];
  valueSeries: number[];
  equitySeries: number[];
  roiSeries: number[];
  risk: "green" | "yellow" | "red";
  appreciationPct: number;
  years: number;
  ratePct: number;
};

export function analyzeReverseInvestment(params: ReverseInvestInput): ReverseInvestResult {
  const propertyValue = clamp0(params.propertyValue);
  const appreciation = params.appreciationPct / 100;
  const years = Math.max(1, Math.floor(params.years));
  const existingBalance = clamp0(params.existingBalance);
  const rate = params.ratePct / 100;
  const origination = clamp0(params.origination);
  const closing = clamp0(params.closing);
  const ltv = clamp0(params.ltvPct) / 100;

  const principalLimit = propertyValue * ltv;
  const availableCash = Math.max(0, principalLimit - existingBalance);
  const futureLoanBalance = principalLimit * Math.pow(1 + rate, years);
  const futurePropertyValue = propertyValue * Math.pow(1 + appreciation, years);
  const remainingEquity = futurePropertyValue - futureLoanBalance;
  const investorReturn = futureLoanBalance - principalLimit;
  const equityCushion = futurePropertyValue > 0 ? (remainingEquity / futurePropertyValue) * 100 : 0;
  const grossRoi = principalLimit > 0 ? (investorReturn / principalLimit) * 100 : 0;
  const netProfit = investorReturn - origination - closing;
  const totalInvested = principalLimit + origination + closing;
  const netRoi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
  const annualizedReturn =
    principalLimit > 0 && years > 0
      ? (Math.pow(futureLoanBalance / principalLimit, 1 / years) - 1) * 100
      : 0;

  const labels: string[] = [];
  const loanSeries: number[] = [];
  const valueSeries: number[] = [];
  const equitySeries: number[] = [];
  const roiSeries: number[] = [];

  for (let y = 0; y <= years; y++) {
    labels.push(`Yr ${y}`);
    const loan = principalLimit * Math.pow(1 + rate, y);
    const prop = propertyValue * Math.pow(1 + appreciation, y);
    loanSeries.push(loan);
    valueSeries.push(prop);
    equitySeries.push(prop - loan);
    roiSeries.push(principalLimit > 0 ? ((loan - principalLimit) / principalLimit) * 100 : 0);
  }

  let risk: "green" | "yellow" | "red" = "green";
  if (remainingEquity <= 0) risk = "red";
  else if (equityCushion < 20) risk = "yellow";

  return {
    principalLimit,
    availableCash,
    futureLoanBalance,
    futurePropertyValue,
    remainingEquity,
    investorReturn,
    equityCushion,
    grossRoi,
    netProfit,
    netRoi,
    annualizedReturn,
    labels,
    loanSeries,
    valueSeries,
    equitySeries,
    roiSeries,
    risk,
    appreciationPct: params.appreciationPct,
    years,
    ratePct: params.ratePct,
  };
}

export function reverseScenarioVariants(base: ReverseInvestInput) {
  return {
    conservative: {
      ...base,
      appreciationPct: base.appreciationPct - 1.5,
      years: base.years + 3,
      ratePct: base.ratePct + 1,
    },
    expected: { ...base },
    optimistic: {
      ...base,
      appreciationPct: base.appreciationPct + 1.5,
      years: Math.max(1, base.years - 2),
      ratePct: Math.max(0, base.ratePct - 0.75),
    },
  };
}

export type NoteBuyerInput = {
  noteRatePct: number;
  remaining: number;
  remainingUnit: "years" | "months";
  payment: number;
  buyerYieldPct: number;
  targetProfit: number | null;
};

export type NoteBuyerResult = {
  purchasePrice: number;
  estPrincipal: number;
  nominal: number;
  spread: number;
  spreadPct: number;
  grossSpread: number;
  roi: number;
  impliedYield: number | null;
  error?: string;
};

export function calculateNoteBuyer(input: NoteBuyerInput): NoteBuyerResult {
  const noteRate = clamp0(input.noteRatePct);
  const buyerYield = clamp0(input.buyerYieldPct);
  const months =
    input.remainingUnit === "years"
      ? Math.floor(clamp0(input.remaining) * 12)
      : Math.floor(clamp0(input.remaining));
  const pmt = clamp0(input.payment);
  const useTargetProfit = input.targetProfit !== null && input.targetProfit > 0;
  const targetProfit = useTargetProfit ? clamp0(input.targetProfit!) : 0;

  if (months <= 0 || pmt <= 0) {
    return {
      purchasePrice: 0,
      estPrincipal: 0,
      nominal: 0,
      spread: 0,
      spreadPct: 0,
      grossSpread: 0,
      roi: 0,
      impliedYield: null,
      error: "Enter a monthly payment and number of payments remaining.",
    };
  }

  const estPrincipal = pvOfAnnuity(pmt, noteRate, months);
  const nominal = pmt * months;
  let purchasePrice = 0;
  let impliedYield: number | null = null;

  if (useTargetProfit) {
    if (targetProfit >= nominal) {
      return {
        purchasePrice: 0,
        estPrincipal,
        nominal,
        spread: 0,
        spreadPct: 0,
        grossSpread: 0,
        roi: 0,
        impliedYield: null,
        error: "Target profit cannot equal or exceed total cash received.",
      };
    }
    purchasePrice = nominal - targetProfit;
    if (purchasePrice <= 0) {
      return {
        purchasePrice: 0,
        estPrincipal,
        nominal,
        spread: 0,
        spreadPct: 0,
        grossSpread: 0,
        roi: 0,
        impliedYield: null,
        error: "Target profit produces an invalid purchase price.",
      };
    }
    impliedYield = yieldFromPurchasePrice(pmt, months, purchasePrice);
  } else {
    if (buyerYield <= 0) {
      return {
        purchasePrice: 0,
        estPrincipal,
        nominal,
        spread: 0,
        spreadPct: 0,
        grossSpread: 0,
        roi: 0,
        impliedYield: null,
        error: "Required yield must be greater than 0%, or enter a target profit.",
      };
    }
    purchasePrice = pvOfAnnuity(pmt, buyerYield, months);
  }

  const spread = estPrincipal - purchasePrice;
  const spreadPct = estPrincipal > 0 ? (spread / estPrincipal) * 100 : 0;
  const grossSpread = nominal - purchasePrice;
  const roi = purchasePrice > 0 ? (grossSpread / purchasePrice) * 100 : 0;

  return {
    purchasePrice,
    estPrincipal,
    nominal,
    spread,
    spreadPct,
    grossSpread,
    roi,
    impliedYield,
  };
}

export type PresentValueInput = {
  amount: number;
  frequency: "monthly" | "quarterly" | "annual";
  ratePct: number;
  time: number;
  timeUnit: "years" | "periods";
};

export type PresentValueResult = { pv: number; nominal: number; periods: number };

export function calculatePresentValue(input: PresentValueInput): PresentValueResult {
  const pmt = clamp0(input.amount);
  const annualRate = clamp0(input.ratePct);
  const time = clamp0(input.time);
  const periodsPerYear = input.frequency === "monthly" ? 12 : input.frequency === "quarterly" ? 4 : 1;
  const periodRate = annualRate / 100 / periodsPerYear;

  let n: number;
  if (input.timeUnit === "years") {
    n = time * periodsPerYear;
  } else {
    n =
      input.frequency === "monthly"
        ? time
        : input.frequency === "quarterly"
          ? time / 3
          : time / 12;
  }
  n = Math.max(0, Math.floor(n));

  let pv = 0;
  let nominal = 0;
  if (pmt > 0 && n > 0) {
    nominal = pmt * n;
    if (periodRate <= 0) pv = nominal;
    else pv = pmt * ((1 - Math.pow(1 + periodRate, -n)) / periodRate);
  }

  return { pv, nominal, periods: n };
}

export type RentValuationInput = {
  gross: number;
  grossPeriod: "weekly" | "monthly" | "annual";
  expenses: number;
  expensePeriod: "weekly" | "monthly" | "annual";
  capPct: number;
};

export type RentValuationResult = {
  noi: number;
  annualGross: number;
  valuation: number | null;
  grm: number | null;
  error?: string;
};

export function calculateRentValuation(input: RentValuationInput): RentValuationResult {
  const gross = clamp0(input.gross);
  const exp = clamp0(input.expenses);
  const cap = clamp0(input.capPct);
  const annualGross = toAnnual(gross, input.grossPeriod);
  const annualExp = toAnnual(exp, input.expensePeriod);
  const noi = annualGross - annualExp;

  if (cap <= 0) {
    return { noi, annualGross, valuation: null, grm: null, error: "Cap rate must be greater than 0%." };
  }

  const valuation = noi / (cap / 100);
  const grm = annualGross > 0 ? valuation / annualGross : null;
  return { noi, annualGross, valuation, grm };
}

export type MultifamilyValuationInput = RentValuationInput & {
  totalUnits: number;
  inOpUnits: number;
};

export type MultifamilyValuationResult = RentValuationResult & {
  operatingUnits: number;
  operatingUnitsLabel: string;
  noiPerUnit: number | null;
  valuePerUnit: number | null;
};

export function calculateMultifamilyValuation(
  input: MultifamilyValuationInput,
): MultifamilyValuationResult {
  const totalUnits = Math.max(1, Math.floor(input.totalUnits));
  let inOpUnits = Math.max(0, Math.floor(input.inOpUnits));
  let error: string | undefined;

  if (inOpUnits > totalUnits) {
    error = "In-op units cannot exceed total number of units.";
    inOpUnits = totalUnits;
  }

  const operatingUnits = totalUnits - inOpUnits;
  const occupancyFactor = operatingUnits / totalUnits;

  const gross = clamp0(input.gross);
  const exp = clamp0(input.expenses);
  const cap = clamp0(input.capPct);
  const annualGrossFull = toAnnual(gross, input.grossPeriod);
  const annualGrossEffective = annualGrossFull * occupancyFactor;
  const annualExp = toAnnual(exp, input.expensePeriod);
  const noi = annualGrossEffective - annualExp;

  const operatingUnitsLabel =
    `${operatingUnits} of ${totalUnits}` + (inOpUnits > 0 ? ` (${inOpUnits} in-op)` : "");

  if (cap <= 0) {
    return {
      noi,
      annualGross: annualGrossEffective,
      valuation: null,
      grm: null,
      operatingUnits,
      operatingUnitsLabel,
      noiPerUnit: operatingUnits > 0 ? noi / operatingUnits : null,
      valuePerUnit: null,
      error: "Cap rate must be greater than 0%.",
    };
  }

  const valuation = noi / (cap / 100);
  const grm = annualGrossEffective > 0 ? valuation / annualGrossEffective : null;

  return {
    noi,
    annualGross: annualGrossEffective,
    valuation,
    grm,
    operatingUnits,
    operatingUnitsLabel,
    noiPerUnit: operatingUnits > 0 ? noi / operatingUnits : null,
    valuePerUnit: totalUnits > 0 ? valuation / totalUnits : null,
    error,
  };
}
