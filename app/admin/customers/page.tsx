import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconUsers, IconChart, IconBox } from "@/components/admin/admin-shell";
import { buildCustomerRows, buildDashboardStats } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/backend/auth";
import CustomersTableClient from "@/components/admin/customers-table-client";

export const metadata: Metadata = {
  title: "User Management | GoFarm",
  description: "User management screen for GoFarm admin.",
};

export default async function CustomersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  
  const db = await readDb();
  const currentUser = session ? db.users.find((u) => u.id === session.sub) : null;
  const adminName = currentUser?.name || "Admin";
  const adminRole = currentUser?.role === "admin" ? "Super Admin" : "Staff";

  const stats = buildDashboardStats(db);
  const users = buildCustomerRows(db.users);
  const adminCount = db.users.filter((user) => user.role === "admin").length;

  return (
    <AdminShell
      activeHref="/admin/customers"
      title="User Management"
      subtitle="Oversee the growth of your agricultural community. Manage staff permissions and support customer success through centralized controls."
      searchPlaceholder="Search entries, customers, or roles..."
      userName={adminName}
      userRole={adminRole}
      userLabel="GoFarm Central"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <StatCard label="Total Active Users" value={stats.userCount.toLocaleString("en-US")} delta="Live" deltaTone="green" hint="backend users" />
          <StatCard label="Staff-to-Customer Ratio" value={`1:${Math.max(1, Math.round(stats.userCount / Math.max(1, stats.newCustomers)))}`} delta={`${adminCount} Staff`} deltaTone="pink" hint="staff-to-customer ratio" />
        </div>

        <SectionCard
          className="overflow-hidden p-4 sm:p-6"
          title="All Users"
          subtitle="Staff members and customers"
        >
          <CustomersTableClient initialUsers={users} />
        </SectionCard>
      </div>
    </AdminShell>
  );
}
