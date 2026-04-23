import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";
import { buildDashboardStats, buildOrderRows } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Order Management | GoFarm",
  description: "Order management screen for GoFarm admin.",
};

function toneFor(status: string) {
  if (status === "delivered") return "gray";
  if (status === "processing" || status === "awaiting_payment") return "green";
  if (status === "cancelled") return "red";
  return "green";
}

function statusLabel(status: string) {
  if (status === "shipped") return "SHIPPED";
  if (status === "processing") return "PROCESSING";
  if (status === "awaiting_payment") return "AWAITING PAYMENT";
  if (status === "delivered") return "DELIVERED";
  return status === "cancelled" ? "CANCELLED" : "PENDING";
}

export default async function OrdersPage() {
  const db = await readDb();
  const stats = buildDashboardStats(db);
  const rows = buildOrderRows(db);
  const activeOrders = rows.filter((row) => row.status !== "cancelled");
  const pendingOrders = rows.filter((row) => row.status === "pending" || row.status === "processing" || row.status === "awaiting_payment").length;

  return (
    <AdminShell
      activeHref="/admin/orders"
      title="Order Log"
      subtitle="Real-time agricultural supply chain fulfillment."
      searchPlaceholder="Search orders, customers..."
      userName="Admin User"
      userRole="Regional Manager"
      userLabel="GoFarm Central"
      actions={
        <>
          <AdminActionButton tone="secondary">Export Manifest</AdminActionButton>
          <AdminActionButton tone="primary">Create New Order</AdminActionButton>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-3">
          <StatCard label="Active Orders" value={activeOrders.length.toLocaleString("en-US")} delta="Live" deltaTone="green" hint="current workload" />
          <StatCard label="Pending Fulfillment" value={pendingOrders.toString()} delta="Alert" deltaTone="pink" hint="awaiting packing" />
          <StatCard label="Gross Revenue (MTD)" value={`$${Math.round(stats.totalRevenue / 1000)}k`} delta={`${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`} deltaTone={stats.revenueGrowth >= 0 ? "green" : "red"} hint="month to date" />
        </div>

        <SectionCard className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#edf1e5] px-5 py-4">
            <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">All Statuses</div>
            <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">Live backend data</div>
            <button className="ml-auto text-[13px] font-semibold text-[#0b7312]">Clear All Filters</button>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#718271]">Showing {rows.length} of {rows.length.toLocaleString("en-US")} orders</div>
          </div>

          <div className="overflow-hidden rounded-b-[18px] ring-1 ring-black/5">
            <table className="page-table min-w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-[13px] font-semibold text-[#0b7312]">{row.id}</td>
                    <td>
                      <div className="text-[13px] font-semibold text-[#243322]">{row.customer}</div>
                      <div className="text-[12px] text-[#768473]">{row.email}</div>
                    </td>
                    <td className="text-[13px] text-[#4d5d4b]">{row.date}</td>
                    <td className="table-amount">{row.amount}</td>
                    <td>
                      <Pill tone={toneFor(row.status)}>{statusLabel(row.status)}</Pill>
                    </td>
                    <td className="text-[#657265]">
                      <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#edf4e0]" aria-label={`Open actions for ${row.id}`}>
                        <IconMore />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 text-[12px] text-[#6f7b6d]">
            <div>Showing 1 - {rows.length} of {rows.length.toLocaleString("en-US")}</div>
            <div className="flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">â€¹</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#0b7312] text-white">1</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">2</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">3</button>
              <span className="px-1 text-[#919d90]">â€¦</span>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">›</button>
            </div>
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}
