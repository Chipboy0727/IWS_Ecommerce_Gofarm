import type { Metadata } from "next";
import Image from "next/image";
import { readDb } from "@/lib/backend/db";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard } from "@/components/admin/admin-shell";

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

function stockTone(stock: number) {
  if (stock <= 25) return "red";
  if (stock <= 100) return "amber";
  return "green";
}

function stockPercent(stock: number) {
  if (stock <= 25) return 8;
  if (stock <= 100) return 28;
  if (stock <= 300) return 48;
  if (stock <= 700) return 72;
  return 88;
}

export default async function ProductsPage() {
  const db = await readDb();
  const products = db.products.slice(0, 4);
  const totalUnits = 12482;
  const lowStockItems = db.products.filter((item) => typeof item.stock === "number" && item.stock <= 25).length || 18;

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle="Manage your agricultural catalog and monitor stock levels in real-time."
      searchPlaceholder="Search products, SKU or category..."
      userName="Admin User"
      userRole="System Admin"
      userLabel="GoFarm Central"
      actions={<AdminActionButton tone="primary">+ Add New Product</AdminActionButton>}
    >
      <div className="grid-stats cols-3" style={{ marginBottom: 16 }}>
        <StatCard label="Total Active Units" value={totalUnits.toLocaleString("en-US")} delta="+4.2%" hint="from last month" />
        <StatCard label="Low Stock Items" value={lowStockItems.toString()} delta="Alert" hint="requires immediate attention" />
        <div className="stat-card" style={{ background: "linear-gradient(180deg,#127d12 0%,#0f6f11 100%)", color: "#fff" }}>
          <div className="stat-top">
            <div className="stat-label" style={{ color: "rgba(255,255,255,.6)" }}>Inventory Growth</div>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="stat-value" style={{ color: "#fff" }}>24.5%</div>
          <div className="stat-meta" style={{ color: "rgba(255,255,255,.74)" }}>Annual increase in variety</div>
        </div>
      </div>

      <SectionCard
        right={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn btn-secondary">Category</button>
            <button type="button" className="btn btn-secondary">Stock Level</button>
            <button type="button" className="btn btn-secondary">Export</button>
          </div>
        }
      >
        <div style={{ marginBottom: 16, borderRadius: 16, background: "#eef4e7", padding: "14px 16px", color: "#6b7869", fontSize: 13 }}>
          Search products, SKU or category...
        </div>

        <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)" }}>
          <table className="page-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = typeof product.stock === "number" ? product.stock : 0;
                const tone = stockTone(stock);
                const status = tone === "green" ? "OPTIMAL" : tone === "amber" ? "WARNING" : "CRITICAL";
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-row">
                        <Image
                          src={product.imageSrc ?? "/images/logo.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="product-thumb"
                        />
                        <div>
                          <div style={{ maxWidth: 180, fontSize: 13, fontWeight: 700, lineHeight: 1.4, color: "#243322" }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#748171" }}>SKU: {product.slug.slice(0, 8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td><div className="table-muted">{product.categoryTitle ?? "General"}</div></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="progress">
                          <span className={tone === "green" ? "status-green" : tone === "amber" ? "status-amber" : "status-red"} style={{ width: `${stockPercent(stock)}%` }} />
                        </div>
                        <div className="table-amount">{stock}/1000</div>
                      </div>
                    </td>
                    <td>
                      <Pill tone={tone}>{status}</Pill>
                    </td>
                    <td><div className="table-amount">{formatMoney(product.price)}</div></td>
                    <td>
                      <div className="icon-actions">
                        <button type="button" aria-label="Edit product">
                          <IconEdit />
                        </button>
                        <button type="button" aria-label="Delete product">
                          <IconDelete />
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

      <div className="grid-stats cols-3" style={{ marginTop: 16 }}>
        <SectionCard title="Quick Edit" subtitle="Use the inline actions to adjust product details">
          <div className="table-muted">Edit pricing, stock thresholds, and category assignments directly from this panel.</div>
        </SectionCard>
        <SectionCard title="Alerts" subtitle="Flagged items">
          <div className="stat-value" style={{ marginTop: 0, fontSize: 34 }}>18</div>
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

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m13 6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 7h14M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7m-8 0 .8 12a1.8 1.8 0 0 0 1.8 1.7h4.6a1.8 1.8 0 0 0 1.8-1.7L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
