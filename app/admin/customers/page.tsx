import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconUsers, IconChart, IconBox } from "@/components/admin/admin-shell";
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
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-3">
          <StatCard label="Total Active Users" value={stats.userCount.toLocaleString("en-US")} delta="Live" deltaTone="green" hint="backend users" icon={<IconUsers />} />
          <StatCard label="Staff-to-Customer Ratio" value={`1:${Math.max(1, Math.round(stats.userCount / Math.max(1, stats.newCustomers)))}`} delta={`${adminCount} Staff`} deltaTone="pink" hint="staff-to-customer ratio" icon={<IconChart />} />
          <StatCard label="System Health" value="Operational" delta="99.9%" deltaTone="green" hint="All systems normal" icon={<IconBox />} />
        </div>

        <SectionCard
          className="overflow-hidden"
          right={
            <div className="flex flex-wrap gap-2">
              <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">Role: All</div>
              <div className="rounded-md bg-[#f2f6ea] px-4 py-2 text-[13px] font-semibold text-[#4f5f4c]">Status: Active</div>
            </div>
          }
          title="All Users"
          subtitle="Staff members and customers"
        >
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <button className="rounded-md bg-white px-4 py-2 text-[13px] font-semibold text-[#0b7312] shadow-sm ring-1 ring-black/5">
              All Users <span className="ml-2 rounded bg-[#e7f5d9] px-2 py-0.5 text-[11px] font-bold">{users.length.toLocaleString("en-US")}</span>
            </button>
            <button className="rounded-md bg-transparent px-4 py-2 text-[13px] font-semibold text-[#5b6658]">Staff Members</button>
            <button className="rounded-md bg-transparent px-4 py-2 text-[13px] font-semibold text-[#5b6658]">Pending Approval</button>
          </div>

          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="page-table min-w-full">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>
                      <div className="product-row">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#203028] text-[12px] font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#243322]">{user.name}</div>
                          <div className="text-[12px] text-[#748171]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Pill tone={user.role === "Admin" ? "green" : "gray"}>{user.role}</Pill>
                    </td>
                    <td className="text-[13px] text-[#4d5d4b]">
                      {new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </td>
                    <td>
                      <Pill tone={user.tone}>{user.status.toUpperCase()}</Pill>
                    </td>
                    <td className="text-[#657265]">
                      <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#edf4e0]" aria-label={`Open actions for ${user.name}`}>
                        <IconMore />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Growth Forecast" subtitle="Based on your current retention rate, you are on track to hit 3,000 active customers by mid-next month.">
            <div className="text-[13px] leading-6 text-[#60705f]">Projected customer growth is stable and supported by recent engagement in store and product management.</div>
          </SectionCard>
          <SectionCard title="Audit Tip" subtitle="There are 3 staff members who haven't logged in for 30+ days.">
            <div className="text-[13px] leading-6 text-[#60705f]">Consider reviewing their access permissions and revalidating device history this week.</div>
          </SectionCard>
        </div>
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
