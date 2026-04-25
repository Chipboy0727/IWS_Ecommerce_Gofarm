import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";
import { buildCustomerRows, buildDashboardStats } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

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
      actions={
        <>
          <AdminActionButton tone="secondary">Export CSV</AdminActionButton>
          <AdminActionButton tone="primary">Create Entry</AdminActionButton>
        </>
      }
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
          className="overflow-hidden"
          right={
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <div className="rounded-md bg-[#f2f6ea] px-2 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-[#4f5f4c]">Role: All</div>
              <div className="rounded-md bg-[#f2f6ea] px-2 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-[#4f5f4c]">Status: Active</div>
            </div>
          }
          title="All Users"
          subtitle="Staff members and customers"
        >
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
            <button className="rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-[#0b7312] shadow-sm ring-1 ring-black/5">
              All Users <span className="ml-1 sm:ml-2 rounded bg-[#e7f5d9] px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">{users.length.toLocaleString("en-US")}</span>
            </button>
            <button className="rounded-md bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-[#5b6658]">Staff Members</button>
            <button className="rounded-md bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold text-[#5b6658]">Pending Approval</button>
          </div>

          <div className="overflow-x-auto overflow-hidden rounded-xl sm:rounded-[18px] ring-1 ring-black/5">
            <table className="page-table min-w-[640px] sm:min-w-full">
              <thead>
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px]">User Profile</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px]">Role</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px]">Join Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px]">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="product-row flex items-center gap-2 sm:gap-3">
                        <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#203028] text-[10px] sm:text-[12px] font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-[12px] sm:text-[13px] font-semibold text-[#243322]">{user.name}</div>
                          <div className="text-[10px] sm:text-[12px] text-[#748171] break-all">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <Pill tone={user.role === "Admin" ? "green" : "gray"}>{user.role}</Pill>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] text-[#4d5d4b]">
                      {new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <Pill tone={user.tone}>{user.status.toUpperCase()}</Pill>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[#657265]">
                      <button type="button" className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full hover:bg-[#edf4e0]" aria-label={`Open actions for ${user.name}`}>
                        <IconMore />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-4 text-[11px] sm:text-[12px] text-[#6f7b6d]">
            <div>Showing {users.length > 0 ? `1-${users.length}` : "0"} of {users.length.toLocaleString("en-US")} users</div>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">‹</button>
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-[#0b7312] text-white">1</button>
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">2</button>
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">3</button>
              <span className="px-0.5 sm:px-1 text-[#919d90]">…</span>
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">711</button>
              <button className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">›</button>
            </div>
          </div>
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

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5">
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}