import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSettingsClient } from "@/components/admin/admin-settings-client";
import { readDb } from "@/lib/backend/db";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/backend/auth";

export const metadata: Metadata = {
  title: "Settings | GoFarm Admin",
  description: "GoFarm admin account settings page.",
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  
  const db = await readDb();
  const currentUser = session ? db.users.find((u) => u.id === session.sub) : null;
  const adminName = currentUser?.name || "Admin";
  const adminRole = currentUser?.role === "admin" ? "System Admin" : "Staff";

  return (
    <AdminShell
      activeHref="/admin/settings"
      title="Settings"
      subtitle="Manage your personal information and admin account security."
      searchPlaceholder="Search settings..."
      userName={adminName}
      userRole={adminRole}
      userLabel="GoFarm Console"
    >
      <AdminSettingsClient />
    </AdminShell>
  );
}