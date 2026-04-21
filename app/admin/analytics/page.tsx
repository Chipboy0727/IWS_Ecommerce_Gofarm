import type { Metadata } from "next";
import { AdminActionButton, AdminShell, SectionCard, StatCard, BarChart, Pill } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Analytics | GoFarm",
  description: "Analytics screen for GoFarm admin.",
};

export default function AnalyticsPage() {
  return (
    <AdminShell
      activeHref="/admin/analytics"
      title="Analytics"
      subtitle="Deep insight into traffic, stock health, and order performance."
      searchPlaceholder="Search orders, farmers, or metrics..."
      userName="Alex Thompson"
      userRole="Senior Admin"
      userLabel="Agricultural Hub"
      actions={<AdminActionButton tone="primary">Export Report</AdminActionButton>}
    >
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-4">
          <StatCard label="Daily Traffic" value="48.2k" delta="+18%" hint="site sessions" />
          <StatCard label="Conversion" value="4.8%" delta="+0.6%" hint="checkout rate" />
          <StatCard label="Revenue Trend" value="$248k" delta="+12.9%" hint="rolling 30 days" />
          <StatCard label="Return Rate" value="2.1%" delta="-0.4%" hint="lower is better" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SectionCard title="Traffic Overview" subtitle="Daily sessions and purchase intent">
            <BarChart bars={[34, 52, 49, 68, 58, 74, 62]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
          </SectionCard>
          <SectionCard className="bg-[linear-gradient(180deg,#127d12_0%,#0d6f0f_100%)] text-white" title="AI Market Forecast" subtitle="Model confidence and supply signals">
            <div className="space-y-4">
              <div className="text-[28px] font-extrabold tracking-[-0.05em] leading-[1.06]">Demand for organic kale to spike +22%</div>
              <div className="text-[13px] leading-6 text-white/72">Based on urban supply chain delays and seasonal health trends, inventory should be adjusted for premium shelf placement.</div>
              <div className="rounded-[16px] bg-white/10 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Confidence score</div>
                <div className="mt-1 text-[26px] font-bold">94.2%</div>
              </div>
              <Pill tone="green">High confidence</Pill>
            </div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
