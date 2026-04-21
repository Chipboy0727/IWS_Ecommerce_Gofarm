import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Order Management | GoFarm",
  description: "Order management screen for GoFarm admin.",
};

const rows = [
  { id: "#GF-92841", customer: "Sarah Miller", email: "smiller@organic.email", date: "Oct 24, 2023", amount: "$2,450.00", status: "shipped" },
  { id: "#GF-92840", customer: "Robert Kincaid", email: "kincaid_farms@supply.io", date: "Oct 23, 2023", amount: "$12,890.45", status: "processing" },
  { id: "#GF-92839", customer: "Lisa Hernandez", email: "lisa@greenleaf.dist", date: "Oct 23, 2023", amount: "$840.12", status: "delivered" },
  { id: "#GF-92838", customer: "Liam Bennett", email: "lb@bennettsupply.net", date: "Oct 22, 2023", amount: "$3,122.00", status: "cancelled" },
];

function toneFor(status: string) {
  if (status === "delivered") return "green";
  if (status === "processing") return "amber";
  if (status === "cancelled") return "red";
  return "emerald";
}

export default function OrdersPage() {
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
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-3">
          <StatCard label="Active Orders" value="1,284" delta="+12%" hint="current workload" />
          <StatCard label="Pending Fulfillment" value="42" delta="Alert" hint="awaiting packing" />
          <StatCard label="Gross Revenue (MTD)" value="$142.5k" delta="+24k" hint="month to date" />
        </div>

        <SectionCard className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#edf1e5] px-5 py-4">
            <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">All Statuses</div>
            <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">mm/dd/yyyy</div>
            <button className="ml-auto text-[13px] font-semibold text-[#18851f]">Clear All Filters</button>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#718271]">Showing 25 of 1,284 orders</div>
          </div>

          <div className="overflow-hidden rounded-b-[18px] ring-1 ring-black/5">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0f5e4]">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer Name</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className={index === rows.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                    <td className="px-5 py-5 text-[13px] font-semibold text-[#176e1e]">{row.id}</td>
                    <td className="px-5 py-5">
                      <div className="text-[13px] font-semibold text-[#243322]">{row.customer}</div>
                      <div className="text-[12px] text-[#768473]">{row.email}</div>
                    </td>
                    <td className="px-5 py-5 text-[13px] text-[#4d5d4b]">{row.date}</td>
                    <td className="px-5 py-5 text-[13px] font-semibold text-[#243322]">{row.amount}</td>
                    <td className="px-5 py-5">
                      <Pill tone={toneFor(row.status)}>{row.status.toUpperCase()}</Pill>
                    </td>
                    <td className="px-5 py-5 text-[#657265]">
                      <button className="text-[18px] font-bold leading-none">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 text-[12px] text-[#6f7b6d]">
            <div>Showing 1 - 4 of 1,284</div>
            <div className="flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">1</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea]">2</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea]">3</button>
            </div>
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
