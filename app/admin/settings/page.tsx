import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSettingsClient } from "@/components/admin/admin-settings-client";

export const metadata: Metadata = {
  title: "Settings | GoFarm Admin",
  description: "GoFarm admin account settings page.",
};

export default function SettingsPage() {
  return (
    <AdminShell
      activeHref="/admin/settings"
      title="Settings"
      subtitle="Manage your personal information and admin account security."
      searchPlaceholder="Search settings..."
      userName="Admin"
      userRole="System Admin"
      userLabel="GoFarm Console"
    >
      <AdminSettingsClient />
    </AdminShell>
  );
}