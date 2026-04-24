import type { Metadata } from "next";
import Image from "next/image";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconChart, IconCart, IconGrid, IconUsers } from "@/components/admin/admin-shell";
import { SalesPerformanceCard } from "@/components/admin/sales-performance";
import { buildDashboardStats, buildRecentOrders, buildSalesSeries } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Admin Dashboard | GoFarm",
  description: "Dashboard overview for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

export default async function AdminDashboardPage() {
  const db = await readDb();
  const stats = buildDashboardStats(db);
  const series = buildSalesSeries(db.orders);
  const transactions = buildRecentOrders(db);
  const statCards = [
    {
      label: "Total Revenue",
      value: formatMoney(stats.totalRevenue),
      delta: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`,
      deltaTone: stats.revenueGrowth >= 0 ? ("green" as const) : ("red" as const),
      hint: "vs last month",
      icon: <IconChart />,
    },
    {
      label: "Active Orders",
      value: stats.activeOrders.toLocaleString("en-US"),
      delta: `${stats.orderGrowth >= 0 ? "+" : ""}${stats.orderGrowth.toFixed(1)}%`,
      deltaTone: stats.orderGrowth >= 0 ? ("green" as const) : ("red" as const),
      hint: "live orders",
      icon: <IconCart />,
    },
    {
      label: "New Customers",
      value: stats.newCustomers.toLocaleString("en-US"),
      delta: `${stats.customerGrowth >= 0 ? "+" : ""}${stats.customerGrowth.toFixed(1)}%`,
      deltaTone: stats.customerGrowth >= 0 ? ("green" as const) : ("red" as const),
      hint: "this month",
      icon: <IconUsers />,
    },
    {
      label: "Market Growth",
      value: `${Math.max(0, stats.revenueGrowth).toFixed(1)}%`,
      delta: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`,
      deltaTone: stats.revenueGrowth >= 0 ? ("green" as const) : ("red" as const),
      hint: "revenue growth",
      icon: <IconGrid />,
    },
  ];

  return (
    <AdminShell
      activeHref="/admin"
      title="Dashboard Overview"
      subtitle="Welcome back, Alex. Your agricultural ecosystem is growing today."
      searchPlaceholder="Search orders, farmers, or metrics..."
      userName="Alex Thompson"
      userRole="Senior Admin"
      userLabel="GoFarm Central"
      actions={
        <>
          <AdminActionButton tone="secondary">Export CSV</AdminActionButton>
          <AdminActionButton tone="primary">Create Entry</AdminActionButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-4">
          {statCards.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              delta={item.delta}
              deltaTone={item.deltaTone}
              hint={item.hint}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_302px]">
          <SalesPerformanceCard series={series} />

          <SectionCard className="bg-[linear-gradient(180deg,#0f7d17_0%,#0d6512_100%)] text-white">
            <div className="flex min-h-[344px] h-full flex-col justify-between rounded-[20px] bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.10),transparent_32%),linear-gradient(180deg,#0f7d17_0%,#0d6512_100%)] p-0">
              <div className="p-1">
                <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/75">Market Intelligence</div>
                <h3 className="mt-5 max-w-[240px] text-[31px] font-extrabold leading-[1.04] tracking-[-0.06em]">
                  Crops yield expected to rise by 14.2% next quarter.
                </h3>
                <p className="mt-4 max-w-[245px] text-[13px] leading-6 text-white/68">
                  Predictive models suggest increased demand for organic corn in the Midwest sector. Adjust logistics by week 4.
                </p>
              </div>
              <div className="p-1">
                <div className="rounded-[16px] bg-white/10 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Confidence score</div>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <div className="text-[24px] font-bold">94.2%</div>
                    <Pill tone="green">High</Pill>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Recent Transactions"
          subtitle="Latest order activity across all farms"
          right={<AdminActionButton tone="ghost">View All</AdminActionButton>}
        >
          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="page-table min-w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td className="text-[13px] font-semibold text-[#86a07b]">{item.id}</td>
                    <td>
                      <div className="product-row">
                        <Image src={item.image} alt={item.product} width={40} height={40} className="product-thumb" />
                        <div>
                          <div className="text-[13px] font-semibold text-[#253323]">{item.product}</div>
                          <div className="text-[12px] text-[#758272]">Order #{item.id.slice(-4)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-[13px] font-semibold text-[#253323]">{item.customer}</div>
                      <div className="text-[12px] text-[#758272]">{item.location}</div>
                    </td>
                    <td className="text-[13px] text-[#4d5d4b]">{item.date}</td>
                    <td className="table-amount">{formatMoney(item.amount)}</td>
                    <td>
                      <Pill tone={item.status === "completed" ? "green" : item.status === "cancelled" ? "red" : "pink"}>
                        {item.status === "completed" ? "COMPLETED" : item.status === "cancelled" ? "CANCELLED" : "PROCESSING"}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
