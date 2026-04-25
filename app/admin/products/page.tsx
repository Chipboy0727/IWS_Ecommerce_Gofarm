import type { Metadata } from "next";
import { readDb } from "@/lib/backend/db";
import { AdminShell, SectionCard, StatCard, IconBox, IconGear } from "@/components/admin/admin-shell";
import ProductManager from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Product management screen for GoFarm admin.",
};

export default async function ProductsPage() {
  const db = await readDb();
  const products = db.products;
  const lowStockItems = db.products.filter((item) => typeof item.stock === "number" && item.stock <= 25).length;

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle="Manage your agricultural catalog and monitor stock levels in real-time."
      searchPlaceholder="Search products, SKU or category..."
      userName="Admin User"
      userRole="System Admin"
      userLabel="Agricultural Admin"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Active Units" value={products.length.toLocaleString("en-US")} delta="+4.2%" deltaTone="green" hint="from last month" icon={<IconBox />} />
          <StatCard label="Low Stock Items" value={lowStockItems.toString()} delta="Alert" deltaTone="red" hint="requires immediate attention" icon={<IconGear />} />
          <StatCard label="Inventory Growth" value="24.5%" delta="+1.8%" deltaTone="green" hint="Annual increase in variety" icon={<IconBox />} />
        </div>

        <ProductManager />

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
