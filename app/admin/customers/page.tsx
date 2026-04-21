import type { Metadata } from "next";
import { readDb } from "@/lib/backend/db";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "User Management | GoFarm",
  description: "User management screen for GoFarm admin.",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function CustomersPage() {
  const db = await readDb();
  const users = db.users.slice(0, 4);

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
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[260px_260px_1fr]">
          <StatCard label="Total Active Users" value="2,842" delta="+12%" hint="current community" />
          <StatCard label="Staff-to-Customer Ratio" value="1:203" delta="14 Staff" hint="balanced support" />
          <div className="rounded-[20px] bg-[linear-gradient(180deg,#127d12_0%,#0f6f11_100%)] p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="text-[12px] uppercase tracking-[0.2em] text-white/60">System Health</div>
            <div className="mt-2 text-[28px] font-extrabold tracking-[-0.05em]">Operational</div>
            <div className="mt-5 h-1.5 w-full rounded-full bg-white/18">
              <div className="h-1.5 w-[76%] rounded-full bg-white" />
            </div>
          </div>
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
          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0f5e4]">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                  <th className="px-5 py-4">User Profile</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Join Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={index === users.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0f9716] text-[12px] font-bold text-white">{initials(user.name)}</div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#243322]">{user.name}</div>
                          <div className="text-[12px] text-[#748171]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone={user.role === "admin" ? "green" : "gray"}>{user.role.toUpperCase()}</Pill>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[#4d5d4b]">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                    <td className="px-5 py-4">
                      <Pill tone="green">ACTIVE</Pill>
                    </td>
                    <td className="px-5 py-4 text-[#657265]">
                      <button className="text-[18px] font-bold leading-none">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 text-[12px] text-[#6f7b6d]">
            <div>Showing 1-4 of 2,842 users</div>
            <div className="flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">1</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea]">2</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea]">3</button>
            </div>
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
