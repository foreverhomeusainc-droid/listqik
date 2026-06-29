export type CompSubject = {
  beds: number;
  baths: number;
  sqft: number;
  zip: string;
};

export type CompRow = {
  id: string;
  label: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  soldDate?: string | null;
  distanceMiles?: number | null;
};

export type CompsResult = {
  suggestedValue: number;
  pricePerSqftMedian: number;
  compCount: number;
  adjustedRangeLow: number;
  adjustedRangeHigh: number;
  rows: Array<CompRow & { adjustedValue: number; weightPct: number }>;
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function compWeight(subject: CompSubject, comp: CompRow): number {
  return (
    1 /
    (1 +
      Math.abs(comp.beds - subject.beds) +
      Math.abs(comp.baths - subject.baths) * 0.5 +
      (comp.distanceMiles ?? 0) * 0.2)
  );
}

function bedBathAdjustment(subject: CompSubject, comp: CompRow): number {
  const bedDelta = subject.beds - comp.beds;
  const bathDelta = subject.baths - comp.baths;
  return bedDelta * 0.03 + bathDelta * 0.015;
}

export function runComps(subject: CompSubject, comparables: CompRow[]): CompsResult {
  const usable = comparables.filter((c) => c.sqft > 0 && c.price > 0);
  if (usable.length === 0) {
    return {
      suggestedValue: 0,
      pricePerSqftMedian: 0,
      compCount: 0,
      adjustedRangeLow: 0,
      adjustedRangeHigh: 0,
      rows: [],
    };
  }

  const pricePerSqftMedian = median(usable.map((c) => c.price / c.sqft));

  const weighted = usable.map((comp) => {
    const basePpsf = comp.price / comp.sqft;
    const sizeAdj = (pricePerSqftMedian - basePpsf) * 0.35;
    const featureAdj = bedBathAdjustment(subject, comp);
    const distancePenalty =
      typeof comp.distanceMiles === "number" && comp.distanceMiles > 0
        ? Math.min(0.08, comp.distanceMiles * 0.01)
        : 0;
    const adjustedPpsf = basePpsf + sizeAdj + featureAdj * basePpsf - distancePenalty * basePpsf;
    const adjustedValue = Math.round(adjustedPpsf * subject.sqft);
    const weight = compWeight(subject, comp);
    return { ...comp, adjustedValue, weight, weightPct: 0 };
  });

  const weightSum = weighted.reduce((sum, row) => sum + row.weight, 0);
  const rows = weighted.map((row) => ({
    ...row,
    weightPct: weightSum > 0 ? Math.round((row.weight / weightSum) * 100) : 0,
  }));

  const suggestedValue = Math.round(
    rows.reduce((sum, row) => sum + row.adjustedValue * row.weight, 0) / (weightSum || 1),
  );

  const values = rows.map((r) => r.adjustedValue).sort((a, b) => a - b);

  return {
    suggestedValue,
    pricePerSqftMedian: Math.round(pricePerSqftMedian),
    compCount: rows.length,
    adjustedRangeLow: values[0] ?? suggestedValue,
    adjustedRangeHigh: values[values.length - 1] ?? suggestedValue,
    rows: rows.map(({ weight, ...rest }) => rest),
  };
}
