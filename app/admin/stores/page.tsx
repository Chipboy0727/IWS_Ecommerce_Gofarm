import type { Metadata } from "next";
import Image from "next/image";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Store Management | GoFarm",
  description: "Store management screen for GoFarm admin.",
};

const stores = [
  {
    name: "Old Oak Valley Market",
    address: "1242 Harvest Lane, Portland, OR",
    manager: "Sarah Jenkins",
    contact: "(503) 555-0129",
    image: "/images/image_5.jpg",
    status: "Active",
    tone: "green",
  },
  {
    name: "North Ridge Logistics",
    address: "88 Industrial Way, Salem, OR",
    manager: "Robert Chen",
    contact: "(503) 555-0882",
    image: "/images/image_7.jpg",
    status: "Maintenance",
    tone: "red",
  },
  {
    name: "GoFarm Boutique - Bend",
    address: "44 High Desert Dr, Bend, OR",
    manager: "Elena Rossi",
    contact: "(541) 555-0442",
    image: "/images/image_3.jpg",
    status: "Active",
    tone: "green",
  },
];

export default function StoresPage() {
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
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
          <SectionCard className="overflow-hidden p-0">
            <div className="relative h-[260px] overflow-hidden rounded-[24px] bg-[#071307] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(65,160,80,0.35),transparent_30%),radial-gradient(circle_at_72%_58%,rgba(45,122,55,0.45),transparent_25%),linear-gradient(135deg,#091509_0%,#124517_45%,#071307_100%)]" />
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-5 top-5 rounded-[12px] bg-white/85 px-4 py-3 text-[#224028] shadow">
                <div className="text-[15px] font-bold">Network Distribution</div>
                <div className="mt-1 text-[12px] text-[#6a7669]">12 Active Regions + 4 Pending</div>
              </div>
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 rounded-full bg-[#d42b7e] opacity-25 blur-md" />
                <div className="absolute inset-1 rounded-full bg-[#d42b7e]" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[12px] text-white/75">
                <span>Network map style preview</span>
                <span>Live store telemetry</span>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-4">
            <StatCard label="Total Inventory Value" value="$1.2M" delta="+8.4%" hint="across locations" />
            <StatCard label="Deliveries in Transit" value="28" delta="+3" hint="active routes" />
          </div>
        </div>

        <SectionCard title="Regional Storefronts" subtitle="Manage locations and maintenance schedules." right={<div className="text-[12px] font-semibold text-[#18851f]">View All</div>}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stores.map((store) => (
              <article key={store.name} className="overflow-hidden rounded-[18px] bg-[#fafcf7] ring-1 ring-black/5">
                <div className="relative h-[180px] overflow-hidden">
                  <Image src={store.image} alt={store.name} fill className="object-cover" />
                  <div className="absolute left-3 top-3">
                    <Pill tone={store.tone === "green" ? "green" : "red"}>{store.status}</Pill>
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
