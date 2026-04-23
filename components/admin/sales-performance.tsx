"use client";

import { useMemo, useState } from "react";
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
  subtitle = "Visualizing yield vs. revenue across Q3",
}: {
  series: SalesSeries;
  title?: string;
  subtitle?: string;
}) {
  const [period, setPeriod] = useState<SalesPeriod>("daily");
  const active = useMemo(() => series[period] ?? series.daily, [period, series]);

  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      right={
        <div className="flex gap-2 rounded-lg bg-[#eef4e2] p-1">
          {periods.map((item) => {
            const selected = period === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setPeriod(item.key)}
                className={[
                  "rounded-md px-4 py-1.5 text-[12px] font-semibold transition",
                  selected ? "bg-white text-[#0b7312] shadow-sm" : "text-[#6f7b6d] hover:text-[#263224]",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      }
    >
      <BarChart bars={active.bars} labels={active.labels} />
    </SectionCard>
  );
}
