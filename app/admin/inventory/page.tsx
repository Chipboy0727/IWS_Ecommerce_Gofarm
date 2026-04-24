import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconGear, IconBox } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Inventory Management | GoFarm",
  description: "Inventory management screen for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

const products = [
  {
    name: "Heritage Tomato Seeds",
    sku: "GF-SEED-291",
    category: "Seeds",
    stock: 820,
    capacity: 1000,
    price: 12.5,
    status: "Optimal",
    tone: "green" as const,
    image: "/images/image_5.jpg",
  },
  {
    name: "Bio-Active Growth Booster",
    sku: "GF-FERT-442",
    category: "Fertilizers",
    stock: 45,
    capacity: 300,
    price: 89,
    status: "Critical",
    tone: "red" as const,
    image: "/images/image_6.jpg",
  },
  {
    name: "Titan Forged Hand Trowel",
    sku: "GF-TOOL-088",
    category: "Tools",
    stock: 112,
    capacity: 260,
    price: 34.99,
    status: "Warning",
    tone: "amber" as const,
    image: "/images/image_7.jpg",
  },
  {
    name: "AgroSensor Node V2",
    sku: "GF-TECH-101",
    category: "Tech",
    stock: 560,
    capacity: 600,
    price: 145,
    status: "Optimal",
    tone: "green" as const,
    image: "/images/image_4.jpg",
  },
];

function stockWidth(stock: number, capacity: number) {
  return Math.max(10, Math.min(100, Math.round((stock / capacity) * 100)));
}

export default function InventoryPage() {
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
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.1fr]">
          <StatCard label="Total SKU" value="1,284" delta="+12%" deltaTone="green" hint="current catalog" icon={<IconBox />} />
          <StatCard label="Critical Stock" value="12" delta="Alert" deltaTone="red" hint="needs restock" icon={<IconGear />} />
          <div className="rounded-[20px] bg-[linear-gradient(180deg,#127d12_0%,#0f6f11_100%)] p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="text-[12px] uppercase tracking-[0.2em] text-white/60">Inventory Growth</div>
            <div className="mt-4 text-[44px] font-extrabold tracking-[-0.06em]">24.5%</div>
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
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <button className="rounded-full bg-[#0b7312] px-4 py-2 text-[12px] font-semibold text-white">All Products</button>
            <button className="rounded-full bg-[#eef4e7] px-4 py-2 text-[12px] font-semibold text-[#536451]">Seeds</button>
            <button className="rounded-full bg-[#eef4e7] px-4 py-2 text-[12px] font-semibold text-[#536451]">Fertilizers</button>
            <button className="rounded-full bg-[#eef4e7] px-4 py-2 text-[12px] font-semibold text-[#536451]">Tools</button>
          </div>

          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="page-table min-w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Inventory</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const width = stockWidth(product.stock, product.capacity);
                  return (
                    <tr key={product.sku}>
                      <td>
                        <div className="product-row">
                          <img src={product.image} alt={product.name} className="product-thumb" />
                          <div>
                            <div className="max-w-[190px] text-[13px] font-semibold leading-5 text-[#243322]">{product.name}</div>
                            <div className="text-[12px] text-[#748171]">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-[13px] text-[#637162]">{product.sku}</td>
                      <td>
                        <Pill tone={product.tone === "green" ? "green" : product.tone === "red" ? "red" : "amber"}>{product.category}</Pill>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="progress">
                            <span
                              className={product.tone === "green" ? "status-green" : product.tone === "red" ? "status-red" : "status-amber"}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <div className="text-[13px] font-semibold text-[#243322]">{product.stock}/{product.capacity}</div>
                        </div>
                      </td>
                      <td className="table-amount">{formatMoney(product.price)}</td>
                      <td>
                        <Pill tone={product.tone}>{product.status.toUpperCase()}</Pill>
                      </td>
                      <td>
                        <div className="icon-actions">
                          <button type="button" aria-label={`Edit ${product.name}`}>
                            <IconPen />
                          </button>
                          <button type="button" aria-label={`Delete ${product.name}`}>
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

          <div className="flex items-center justify-between px-2 pt-4 text-[12px] text-[#6f7b6d]">
            <div>Showing 1-4 of 1,284 entries</div>
            <div className="flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">‹</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#0b7312] text-white">1</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">2</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">3</button>
              <span className="px-1 text-[#919d90]">…</span>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-white ring-1 ring-black/10">321</button>
              <button className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f6ea] text-[#7f8d7d]">›</button>
            </div>
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
