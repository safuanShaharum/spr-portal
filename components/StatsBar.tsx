"use client";

import { useEffect, useRef, useState } from "react";
import { PortalStats } from "@/types/dataset";

interface StatsBarProps {
  stats: PortalStats | null;
}

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="font-display text-4xl sm:text-5xl font-bold text-spr-text">
      {count.toLocaleString()}
    </span>
  );
}

const STATIC_STATS = [
  { key: "parlimen", icon: "🏛️", value: 222, label: "Parlimen", description: "Kawasan Parlimen" },
  { key: "dun", icon: "🏢", value: 600, label: "DUN", description: "Dewan Undangan Negeri" },
  { key: "negeri", icon: "🗺️", value: 16, label: "Negeri", description: "Negeri & Wilayah" },
];

export default function StatsBar({ stats }: StatsBarProps) {
  const datasetCount = stats?.total_datasets ?? 0;

  const allStats = [
    ...STATIC_STATS,
    {
      key: "datasets",
      icon: "📊",
      value: datasetCount,
      label: "Dataset",
      description: "Set Data Terbuka",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {allStats.map((stat) => (
            <div
              key={stat.key}
              className="group bg-spr-card border border-spr-border rounded-2xl p-6 sm:p-8 text-center hover:border-spr-primary/50 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-spr-primary/10"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <AnimatedCounter end={stat.value} />
              <div className="text-spr-accent font-semibold text-sm mt-2">
                {stat.label}
              </div>
              <div className="text-spr-text-dim text-xs mt-1">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
