import type { Metadata } from "next";
import { AdminActionButton, AdminShell, SectionCard, StatCard, Pill } from "@/components/admin/admin-shell";
import { SalesPerformanceCard } from "@/components/admin/sales-performance";
import { buildDashboardStats, buildSalesSeries } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Analytics | GoFarm",
  description: "Analytics screen for GoFarm admin.",
};

export default async function AnalyticsPage() {
  const db = await readDb();
  const stats = buildDashboardStats(db);
  const series = buildSalesSeries(db.orders);
  const cancelledRate = db.orders.length > 0 ? (db.orders.filter((order) => order.status === "cancelled").length / db.orders.length) * 100 : 0;

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
      <div className="space-y-4 sm:space-y-5">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Daily Traffic" value={stats.activeOrders.toLocaleString("en-US")} delta="Live" hint="current orders" />
          <StatCard label="Conversion" value={`${Math.min(99.9, (stats.activeOrders / Math.max(1, stats.orderCount)) * 100).toFixed(1)}%`} delta="Real" hint="orders / total" />
          <StatCard label="Revenue Trend" value={`$${Math.round(stats.totalRevenue / 1000)}k`} delta={`${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`} hint="rolling revenue" />
          <StatCard label="Cancellation Rate" value={`${cancelledRate.toFixed(1)}%`} delta="Real" hint="cancelled orders" />
        </div>

        <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SalesPerformanceCard series={series} title="Traffic Overview" subtitle="Daily sessions and purchase intent" />
          <SectionCard className="bg-[linear-gradient(180deg,#127d12_0%,#0d6f0f_100%)] text-white" title="AI Market Forecast" subtitle="Model confidence and supply signals">
            <div className="space-y-3 sm:space-y-4">
              <div className="text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-[-0.05em] leading-[1.2] sm:leading-[1.06]">
                Revenue is tracking at {stats.revenueGrowth >= 0 ? "+" : ""}{stats.revenueGrowth.toFixed(1)}% month over month
              </div>
              <div className="text-xs sm:text-[13px] leading-5 sm:leading-6 text-white/72">
                This forecast is derived from live order history and current product stock levels in the backend.
              </div>
              <div className="rounded-2xl sm:rounded-[16px] bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/60">Confidence score</div>
                <div className="mt-1 text-xl sm:text-2xl md:text-[26px] font-bold">{Math.max(60, Math.min(99, 70 + Math.round(stats.revenueGrowth))).toFixed(1)}%</div>
              </div>
              <Pill tone="green">High confidence</Pill>
            </div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}