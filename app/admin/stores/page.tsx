import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";
import { buildStoreRows } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Store Management | GoFarm",
  description: "Store management screen for GoFarm admin.",
};

export default async function StoresPage() {
  const db = await readDb();
  const stores = buildStoreRows(db.stores);
  const activeStores = stores.filter((store) => store.status === "Active").length;
  const maintenanceStores = stores.filter((store) => store.status === "Maintenance").length;

  return (
    <AdminShell
      activeHref="/admin/stores"
      title="Store Management"
      subtitle="Manage physical locations and maintenance schedules."
      searchPlaceholder="Search locations..."
      userName="Admin User"
      userRole="Regional Manager"
      userLabel="GoFarm Central"
      actions={<AdminActionButton tone="primary">Register New Store</AdminActionButton>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
          <SectionCard className="overflow-hidden p-0">
            <div className="relative h-[300px] overflow-hidden rounded-[24px] bg-[#081007] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_28%,rgba(34,119,51,0.7),transparent_28%),radial-gradient(circle_at_75%_65%,rgba(29,137,66,0.45),transparent_24%),linear-gradient(135deg,#0a1609_0%,#165a23_45%,#081007_100%)]" />
              <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-5 top-5 rounded-[12px] bg-white/88 px-4 py-3 text-[#224028] shadow">
                <div className="text-[15px] font-bold">Network Distribution</div>
                <div className="mt-1 text-[12px] text-[#6a7669]">{activeStores} Active Regions • {maintenanceStores} Maintenance</div>
              </div>
              <div className="absolute left-[38%] top-[30%] h-4 w-4 rounded-full bg-[#0d8b11] shadow-[0_0_0_8px_rgba(13,139,17,0.16)]" />
              <div className="absolute left-[63%] top-[55%] h-4 w-4 rounded-full bg-[#d31d7d] shadow-[0_0_0_8px_rgba(211,29,125,0.16)]" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[12px] text-white/70">
                <span>Regional store network</span>
                <span>Live telemetry</span>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-4">
            <StatCard label="Total Inventory Value" value={`$${Math.round(db.products.reduce((sum, product) => sum + product.price, 0) / 1000)}k`} delta="Live" deltaTone="green" hint="across locations" />
            <StatCard label="Deliveries in Transit" value={`${db.orders.filter((order) => order.status === "processing" || order.status === "shipped").length}`} delta="Live" deltaTone="green" hint="active routes" />
          </div>
        </div>

        <SectionCard title="Regional Storefronts" subtitle="Manage physical locations and maintenance schedules." right={<div className="text-[12px] font-semibold text-[#0b7312]">View All</div>}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stores.map((store) => (
              <article key={store.id} className="overflow-hidden rounded-[18px] bg-[#fafcf7] ring-1 ring-black/5">
                <div className="relative h-[222px] overflow-hidden">
                  <img src={store.imageSrc} alt={store.name} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3">
                    <Pill tone={store.tint}>{store.status}</Pill>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[17px] font-bold tracking-[-0.03em] text-[#243322]">{store.name}</h3>
                  <div className="mt-2 text-[13px] text-[#72806f]">{store.address}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                    <div>
                      <div className="text-[#9aa795]">Manager</div>
                      <div className="mt-1 font-semibold text-[#243322]">{store.manager}</div>
                    </div>
                    <div>
                      <div className="text-[#9aa795]">Contact</div>
                      <div className="mt-1 font-semibold text-[#243322]">{store.contact}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <div className="rounded-[18px] bg-[#eaf5db] px-5 py-4 text-[13px] text-[#60705f] ring-1 ring-black/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>Maintenance window scheduled for Salem Facility tomorrow at 02:00 AM PST.</div>
            <div className="flex gap-2">
              <button className="rounded-md bg-white px-4 py-2 font-semibold text-[#40503f]">Dismiss</button>
              <button className="rounded-md bg-[#0f9716] px-4 py-2 font-semibold text-white">View Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
