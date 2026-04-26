import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconUsers, IconChart, IconBox } from "@/components/admin/admin-shell";
import { buildCustomerRows, buildDashboardStats } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";
import CustomersTableClient from "@/components/admin/customers-table-client";

export const metadata: Metadata = {
  title: "User Management | GoFarm",
  description: "User management screen for GoFarm admin.",
};

export default async function CustomersPage() {
  const db = await readDb();
  const stats = buildDashboardStats(db);
  const users = buildCustomerRows(db.users);
  const adminCount = db.users.filter((user) => user.role === "admin").length;

  return (
    <AdminShell
      activeHref="/admin/customers"
      title="User Management"
      subtitle="Oversee the growth of your agricultural community. Manage staff permissions and support customer success through centralized controls."
      searchPlaceholder="Search entries, customers, or roles..."
      userName="Alex Rivera"
      userRole="Super Admin"
      userLabel="GoFarm Central"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[260px_260px_1fr]">
          <StatCard label="Total Active Users" value={stats.userCount.toLocaleString("en-US")} delta="Live" deltaTone="green" hint="backend users" />
          <StatCard label="Staff-to-Customer Ratio" value={`1:${Math.max(1, Math.round(stats.userCount / Math.max(1, stats.newCustomers)))}`} delta={`${adminCount} Staff`} deltaTone="pink" hint="staff-to-customer ratio" />
          <div className="rounded-xl sm:rounded-[20px] bg-[linear-gradient(180deg,#0f7d17_0%,#0d6512_100%)] p-4 sm:p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-white/60">System Health</div>
            <div className="mt-1 sm:mt-2 text-2xl sm:text-[28px] font-extrabold tracking-[-0.05em]">Operational</div>
            <div className="mt-3 sm:mt-5 h-1.5 w-full rounded-full bg-white/18">
              <div className="h-1.5 w-[76%] rounded-full bg-white" />
            </div>
          </div>
        </div>

        <SectionCard
          className="overflow-hidden p-4 sm:p-6"
          title="All Users"
          subtitle="Staff members and customers"
        >
          <CustomersTableClient initialUsers={users} />
        </SectionCard>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 xl:grid-cols-2">
          <SectionCard title="Growth Forecast" subtitle="Based on your current retention rate, you are on track to hit 3,000 active customers by mid-next month.">
            <div className="text-[12px] sm:text-[13px] leading-5 sm:leading-6 text-[#60705f]">Projected customer growth is stable and supported by recent engagement in store and product management.</div>
          </SectionCard>
          <SectionCard title="Audit Tip" subtitle="There are 3 staff members who haven't logged in for 30+ days.">
            <div className="text-[12px] sm:text-[13px] leading-5 sm:leading-6 text-[#60705f]">Consider reviewing their access permissions and revalidating device history this week.</div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
