import type { Metadata } from "next";
import { AdminShell, SectionCard, StatCard } from "@/components/admin/admin-shell";
import { readDb } from "@/lib/backend/db";
import StoresTableClient from "@/components/admin/stores-table-client";

export const metadata: Metadata = {
  title: "Store Management | GoFarm",
  description: "Operational hub for GoFarm storefronts and regional outlets.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminStoresPage() {
  const db = await readDb();
  const stores = db.stores;
  
  const activeStores = stores.filter((store) => store.status === "Active").length;
  const maintenanceStores = stores.length - activeStores;

  return (
    <AdminShell
      activeHref="/admin/stores"
      title="Store Management"
      subtitle="Operational hub for global agricultural distribution centers."
      searchPlaceholder="Search stores, regions, or audits..."
      userName="Marcus Thorne"
      userRole="Regional Manager"
      userLabel="GoFarm Central"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <StatCard 
            label="Total Active Outlets" 
            value={activeStores.toLocaleString("en-US")} 
            delta="Live" 
            deltaTone="green" 
            hint="currently operational" 
          />
          <StatCard 
            label="Under Maintenance" 
            value={maintenanceStores.toLocaleString("en-US")} 
            delta="Offline" 
            deltaTone="pink" 
            hint="pending review or repairs" 
          />
        </div>

        <SectionCard
          className="overflow-hidden p-4 sm:p-6"
          title="All Stores"
          subtitle="Manage store information and locations"
        >
          <StoresTableClient initialStores={stores} />
        </SectionCard>
      </div>
    </AdminShell>
  );
}
