import type { Metadata } from "next";
import { readDb } from "@/lib/backend/db";
import { AdminShell, SectionCard, StatCard } from "@/components/admin/admin-shell";
import ProductManager from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Product management screen for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function ProductsPage() {
  const db = await readDb();
  const products = db.products;
  const lowStockItems = db.products.filter((item) => typeof item.stock === "number" && item.stock <= 25).length;
  const totalRevenue = db.products.reduce((sum, product) => sum + (product.price * Math.max(1, product.reviews || 1)), 0);

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle="Manage your agricultural catalog and monitor stock levels in real-time."
      searchPlaceholder="Search products, SKU or category..."
      userName="Admin User"
      userRole="System Admin"
      userLabel="GoFarm Central"
      actions={null}
    >
      <div className="grid-stats cols-3" style={{ marginBottom: 16 }}>
        <StatCard label="Active Products" value={products.length.toLocaleString("en-US")} delta="+4.2%" hint="from last month" />
        <StatCard label="Low Stock Items" value={lowStockItems.toString()} delta="Alert" hint="requires immediate attention" />
        <div className="stat-card" style={{ background: "linear-gradient(180deg,#127d12 0%,#0f6f11 100%)", color: "#fff" }}>
          <div className="stat-top">
            <div className="stat-label" style={{ color: "rgba(255,255,255,.6)" }}>Catalog Value</div>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="stat-value" style={{ color: "#fff" }}>{formatMoney(totalRevenue)}</div>
          <div className="stat-meta" style={{ color: "rgba(255,255,255,.74)" }}>Estimated from current catalog</div>
        </div>
      </div>

      <ProductManager />

      <div className="grid-stats cols-3" style={{ marginTop: 16 }}>
        <SectionCard title="Quick Edit" subtitle="Use the live API-backed form to adjust product details">
          <div className="table-muted">Edit pricing, stock thresholds, and category assignments directly from this panel.</div>
        </SectionCard>
        <SectionCard title="Alerts" subtitle="Flagged items">
          <div className="stat-value" style={{ marginTop: 0, fontSize: 34 }}>{lowStockItems}</div>
          <div className="stat-meta" style={{ marginTop: 4 }}>Requires attention</div>
        </SectionCard>
        <SectionCard title="Sync Status" subtitle="Catalog replication">
          <div className="stat-value" style={{ marginTop: 0, fontSize: 34 }}>Live</div>
          <div className="stat-meta" style={{ marginTop: 4 }}>Updated in real time</div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
