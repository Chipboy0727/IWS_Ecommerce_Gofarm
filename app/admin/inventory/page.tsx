import type { Metadata } from "next";
import Image from "next/image";
import { readDb } from "@/lib/backend/db";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconGear, IconBox } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Inventory Management | GoFarm",
  description: "Inventory management screen for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function stockTone(stock: number) {
  if (stock <= 25) return "red";
  if (stock <= 100) return "amber";
  return "green";
}

function stockWidth(stock: number) {
  if (stock <= 25) return 14;
  if (stock <= 100) return 42;
  if (stock <= 300) return 64;
  return 84;
}

export default async function InventoryPage() {
  const db = await readDb();
  const products = db.products.slice(0, 10);
  const totalSku = db.products.length;
  const critical = db.products.filter((item) => typeof item.stock === "number" && item.stock <= 25).length;

  return (
    <AdminShell
      activeHref="/admin/inventory"
      title="Inventory Management"
      subtitle="Monitor stock levels, manage product details, and optimize your supply chain."
      searchPlaceholder="Search inventory..."
      userName="Admin User"
      userRole="System Admin"
      userLabel="Admin Console"
      actions={
        <>
          <AdminActionButton tone="secondary">Export CSV</AdminActionButton>
          <AdminActionButton tone="primary">Create Entry</AdminActionButton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.5fr]">
          <StatCard label="Total SKU" value={totalSku.toLocaleString("en-US")} delta="+12%" hint="current catalog" icon={<IconBox />} />
          <StatCard label="Critical Stock" value={critical.toString()} delta="Alert" hint="needs restock" icon={<IconGear />} />
          <div className="rounded-[20px] bg-[linear-gradient(180deg,#127d12_0%,#0f6f11_100%)] p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="text-[12px] uppercase tracking-[0.2em] text-white/60">Inventory Growth</div>
            <div className="mt-4 text-[42px] font-extrabold tracking-[-0.06em]">24.5%</div>
            <div className="mt-1 text-[13px] text-white/74">Annual increase in variety</div>
          </div>
        </div>

        <SectionCard
          className="overflow-hidden"
          right={
            <div className="flex gap-2">
              <button className="rounded-full bg-[#eef4e7] px-4 py-2 text-[12px] font-semibold text-[#58715a]">Filter</button>
              <button className="rounded-full bg-[#eef4e7] px-4 py-2 text-[12px] font-semibold text-[#58715a]">Sort</button>
            </div>
          }
          title="All Products"
          subtitle="Live inventory across core produce and supplies"
        >
          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0f5e4]">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Inventory</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const stock = typeof product.stock === "number" ? product.stock : 0;
                  const width = stockWidth(stock);
                  return (
                    <tr key={product.id} className={index === products.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Image src={product.imageSrc ?? "/images/logo.svg"} alt={product.name} width={40} height={40} className="h-10 w-10 rounded-[10px] object-cover" />
                          <div>
                            <div className="max-w-[190px] text-[13px] font-semibold leading-5 text-[#243322]">{product.name}</div>
                            <div className="text-[12px] text-[#748171]">{product.brand ?? "GoFarm Supply"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#637162]">GF-{product.slug.slice(0, 5).toUpperCase()}</td>
                      <td className="px-5 py-4 text-[13px] text-[#637162]">{product.categoryTitle ?? "General"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-[96px] rounded-full bg-[#dfe9d0]">
                            <div
                              className={[
                                "h-2.5 rounded-full",
                                stockTone(stock) === "green"
                                  ? "bg-[#0f7c16]"
                                  : stockTone(stock) === "amber"
                                    ? "bg-[#d59b00]"
                                    : "bg-[#d6403b]",
                              ].join(" ")}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <div className="text-[13px] font-semibold text-[#243322]">{stock}/1000</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#253323]">{formatMoney(product.price)}</td>
                      <td className="px-5 py-4">
                        <Pill tone={stockTone(stock) === "green" ? "green" : stockTone(stock) === "amber" ? "amber" : "red"}>
                          {stockTone(stock) === "green" ? "OPTIMAL" : stockTone(stock) === "amber" ? "WARNING" : "CRITICAL"}
                        </Pill>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-[#60705f]">
                          <button className="hover:text-[#0f9716]">
                            <IconPen />
                          </button>
                          <button className="hover:text-[#d63d35]">
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-3">
          <SectionCard className="bg-[#e8f6dd]" title="Restock Velocity" subtitle="Based on current sales data, you should reorder soon.">
            <div className="text-[13px] leading-6 text-[#60705f]">
              Reorder Bio-Active Growth Booster within the next 48 hours to avoid out-of-stock status.
            </div>
          </SectionCard>
          <SectionCard title="Warehouse Cap." subtitle="Operational load">
            <div className="text-[34px] font-extrabold tracking-[-0.05em] text-[#1f2f1d]">68%</div>
            <div className="mt-1 text-[12px] text-[#657364]">Utilized</div>
          </SectionCard>
          <SectionCard title="Compliance" subtitle="ISO and inspection status">
            <div className="text-[34px] font-extrabold tracking-[-0.05em] text-[#1f2f1d]">Active</div>
            <div className="mt-1 text-[12px] text-[#657364]">ISO 22000</div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}

function IconPen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m13 6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 7h14M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7m-8 0 .8 12a1.8 1.8 0 0 0 1.8 1.7h4.6a1.8 1.8 0 0 0 1.8-1.7L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
