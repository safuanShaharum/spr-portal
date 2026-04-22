"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getPartiLogo } from "@/lib/parti-logo";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

interface BarItem {
  label: string;
  value: number;
  color: string;
  pct: string;
}

interface Props {
  items: BarItem[];
  title: string;
}

export default function HBarChart({ items, title }: Props) {
  const data = {
    labels: items.map((i) => i.label),
    datasets: [{
      data: items.map((i) => i.value),
      backgroundColor: items.map((i) => i.color),
      borderRadius: 4,
      barThickness: 28,
    }],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1A1A2E",
        bodyColor: "#5A5A72",
        borderColor: "#E2E2EA",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
      datalabels: {
        anchor: "end" as const,
        align: "right" as const,
        offset: 6,
        font: { size: 11, weight: "bold" as const },
        color: "#1A1A2E",
        formatter: (value: number, ctx: { dataIndex: number }) => {
          const pct = items[ctx.dataIndex]?.pct || "";
          return `${value} (${pct})`;
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        max: Math.max(...items.map((i) => i.value)) * 1.35, // extra space for labels
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: 500 as const }, color: "#1A1A2E" },
      },
    },
  };

  return (
    <div className="bg-white border border-spr-border rounded-xl p-6 h-full">
      <h3 className="text-base font-semibold text-spr-navy mb-4">{title}</h3>
      <div style={{ height: items.length * 44 + 20 }}>
        <Bar data={data} options={options} />
      </div>
      {/* Inline legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-1.5">
            {getPartiLogo(i.label) ? (
              <img src={getPartiLogo(i.label)!} alt={i.label} width={16} height={16} className="object-contain rounded-sm shrink-0" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: i.color }} />
            )}
            <span className="text-xs text-spr-text-secondary">{i.label}</span>
            <span className="text-xs font-bold text-spr-navy">{i.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
