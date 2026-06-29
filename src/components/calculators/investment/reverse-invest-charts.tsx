"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ReverseInvestResult } from "@/lib/calculators/investment/math";
import { formatCurrency } from "@/lib/calculators/investment/format";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const axisColor = "#64748b";
const gridColor = "rgba(51,65,85,0.35)";

function baseOptions(yPercent = false): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: { color: "#94a3b8", boxWidth: 12, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label(ctx) {
            const v = ctx.parsed.y;
            if (v === null) return "";
            if (yPercent) return `${ctx.dataset.label}: ${v.toFixed(1)}%`;
            return `${ctx.dataset.label}: ${formatCurrency(v, 0)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: axisColor, maxTicksLimit: 13, font: { size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: axisColor,
          font: { size: 10 },
          callback(tickValue) {
            const n = Number(tickValue);
            if (yPercent) return `${n.toFixed(0)}%`;
            if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
            if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`;
            return `$${n}`;
          },
        },
      },
    },
  };
}

export function ReverseInvestCharts({ result }: { result: ReverseInvestResult }) {
  const balanceData = {
    labels: result.labels,
    datasets: [
      {
        label: "Loan Balance",
        data: result.loanSeries,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Property Value",
        data: result.valueSeries,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.06)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const equityData = {
    labels: result.labels,
    datasets: [
      {
        label: "Remaining Equity",
        data: result.equitySeries,
        borderColor: "#818cf8",
        backgroundColor: "rgba(129,140,248,0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const roiData = {
    labels: result.labels,
    datasets: [
      {
        label: "Investor ROI",
        data: result.roiSeries,
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167,139,250,0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        { title: "Balance vs Value", data: balanceData, percent: false },
        { title: "Equity Over Time", data: equityData, percent: false },
        { title: "Investor ROI", data: roiData, percent: true },
      ].map((chart) => (
        <div key={chart.title} className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{chart.title}</p>
          <div className="h-[220px]">
            <Line data={chart.data} options={baseOptions(chart.percent)} />
          </div>
        </div>
      ))}
    </div>
  );
}
