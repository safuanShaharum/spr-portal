"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getPartiLogo } from "@/lib/parti-logo";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  centerLabel: string;
  centerSub: string;
  title: string;
  subtitle: string;
}

export default function DonutChart({ segments, centerLabel, centerSub, title, subtitle }: Props) {
  const data = {
    labels: segments.map((s) => s.label),
    datasets: [{
      data: segments.map((s) => s.value),
      backgroundColor: segments.map((s) => s.color),
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1A1A2E",
        bodyColor: "#5A5A72",
        borderColor: "#E2E2EA",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => `${ctx.label}: ${ctx.raw} kerusi`,
        },
      },
      datalabels: { color: "#fff", font: { size: 11, weight: "bold" as const } },
    },
  };

  return (
    <div className="bg-white border border-spr-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-spr-navy">{title}</h3>
      <p className="text-sm text-spr-text-muted mb-6">{subtitle}</p>

      <div className="relative h-[260px]">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-spr-navy">{centerLabel}</span>
          <span className="text-xs text-spr-text-muted">{centerSub}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6 justify-center">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            {getPartiLogo(s.label) ? (
              <img src={getPartiLogo(s.label)!} alt={s.label} width={16} height={16} className="object-contain rounded-sm" />
            ) : (
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            )}
            <span className="text-xs text-spr-text-secondary">{s.label}</span>
            <span className="text-xs font-bold text-spr-navy">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
