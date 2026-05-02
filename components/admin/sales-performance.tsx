"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, SectionCard } from "@/components/admin/admin-shell";
import type { SalesPeriod, SalesSeries } from "@/lib/backend/admin-analytics";

const periods: { key: SalesPeriod; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export function SalesPerformanceCard({
  series,
  title = "Sales Performance",
  subtitle,
}: {
  series: SalesSeries;
  title?: string;
  subtitle?: string;
}) {
  const [period, setPeriod] = useState<SalesPeriod>("daily");
  const [displayPeriod, setDisplayPeriod] = useState<SalesPeriod>("daily");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (period === displayPeriod) return;

    setIsAnimating(true);
    const switchTimer = window.setTimeout(() => {
      setDisplayPeriod(period);
    }, 120);
    const endTimer = window.setTimeout(() => {
      setIsAnimating(false);
    }, 360);

    return () => {
      window.clearTimeout(switchTimer);
      window.clearTimeout(endTimer);
    };
  }, [period, displayPeriod]);

  const active = useMemo(() => series[displayPeriod] ?? series.daily, [displayPeriod, series]);

  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      right={
        <div className="flex gap-2 rounded-lg bg-gofarm-light-orange/50 p-1">
          {periods.map((item) => {
            const selected = period === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setPeriod(item.key)}
                className={[
                  "rounded-md px-4 py-1.5 text-[12px] font-semibold transition-all duration-200",
                  selected
                    ? "bg-white text-gofarm-green shadow-sm shadow-gofarm-green/50"
                    : "text-gofarm-gray hover:bg-white/60 hover:text-gofarm-black",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div
        className={[
          "transition-all duration-300 ease-out",
          isAnimating ? "translate-y-1 opacity-70" : "translate-y-0 opacity-100",
        ].join(" ")}
      >
        <BarChart bars={active.bars} labels={active.labels} />
      </div>
    </SectionCard>
  );
}
