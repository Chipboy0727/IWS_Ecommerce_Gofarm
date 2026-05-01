import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminShell, Pill, SectionCard, StatCard, IconChart, IconCart, IconGrid, IconUsers } from "@/components/admin/admin-shell";
import { SalesPerformanceCard } from "@/components/admin/sales-performance";
import { buildDashboardStats, buildRecentOrders, buildSalesSeries } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/backend/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard | GoFarm",
  description: "Dashboard overview for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  
  const db = await readDb();
  const currentUser = session ? db.users.find((u) => u.id === session.sub) : null;
  const adminName = currentUser?.name || "Admin";
  const adminRole = currentUser?.role === "admin" ? "Senior Admin" : "Staff";

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
      subtitle={`Welcome back, ${adminName}. Your agricultural ecosystem is growing today.`}
      searchPlaceholder="Search orders, farmers, or metrics..."
      userName={adminName}
      userRole={adminRole}
      userLabel="GoFarm Central"
      actions={null}
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
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

        <div>
          <SalesPerformanceCard series={series} />
        </div>

        <SectionCard
          title="Recent Transactions"
          subtitle="Latest order activity across all farms"
          right={
            <Link href="/admin/orders" className="btn btn-ghost">
              View All
            </Link>
          }
        >
          <div className="admin-data-table-shell">
            <table className="page-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th className="hidden sm:table-cell">Customer</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td className="text-[10px] sm:text-[13px] font-semibold text-[#86a07b]" style={{ maxWidth: 120, wordBreak: 'break-all' }}>{item.id}</td>
                    <td>
                      <div className="product-row">
                        <Image src={item.image} alt={item.product} width={40} height={40} className="product-thumb" />
                        <div style={{ minWidth: 0 }}>
                          <div className="text-[11px] sm:text-[13px] font-semibold text-[#253323] truncate" style={{ maxWidth: 140 }}>{item.product}</div>
                          <div className="text-[10px] sm:text-[12px] text-[#758272]">Order #{item.id.slice(-4)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="text-[11px] sm:text-[13px] font-semibold text-[#253323]">{item.customer}</div>
                      <div className="text-[10px] sm:text-[12px] text-[#758272] truncate" style={{ maxWidth: 160 }}>{item.location}</div>
                    </td>
                    <td className="hidden md:table-cell text-[11px] sm:text-[13px] text-[#4d5d4b] whitespace-nowrap">{item.date}</td>
                    <td className="table-amount whitespace-nowrap" style={{ fontSize: 'inherit' }}>{formatMoney(item.amount)}</td>
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
