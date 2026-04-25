import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import InventoryTableClient, { type InventoryRow } from "@/components/admin/inventory-table-client";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Inventory management screen for GoFarm admin.",
};

function formatUnits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function buildSku(slug: string, index: number) {
  const compact = slug.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6) || "ITEM";
  return `GF-${compact}-${String(index + 1).padStart(3, "0")}`;
}

function buildCapacity(stock: number) {
  if (stock <= 25) return Math.max(120, Math.ceil(stock * 4));
  if (stock <= 100) return Math.max(200, Math.ceil(stock * 2.5));
  return Math.max(500, Math.ceil(stock * 1.18));
}

function getInventoryStatus(stock: number | null) {
  if (stock === null || stock <= 10) return { label: "CRITICAL", tone: "critical" as const };
  if (stock <= 40) return { label: "WARNING", tone: "warning" as const };
  if (stock <= 120) return { label: "HEALTHY", tone: "healthy" as const };
  return { label: "OPTIMAL", tone: "optimal" as const };
}

function categoryLabel(value: string | null) {
  if (!value) return "General";
  if (value.toLowerCase() === "juice") return "Juices";
  return value;
}

export default async function InventoryPage() {
  const db = await readDb();
  const products = [...db.products].sort((a, b) => {
    const stockA = typeof a.stock === "number" ? a.stock : -1;
    const stockB = typeof b.stock === "number" ? b.stock : -1;
    if (stockA !== stockB) return stockA - stockB;
    return a.name.localeCompare(b.name);
  });

  const rows: InventoryRow[] = products.map((product, index) => {
    const stock = typeof product.stock === "number" ? product.stock : 0;
    const capacity = buildCapacity(stock);
    const status = getInventoryStatus(product.stock);
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: buildSku(product.slug, index),
      category: categoryLabel(product.categoryTitle),
      stock,
      capacity,
      price: product.price,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt || product.name,
      status,
      progress: Math.max(8, Math.min(100, Math.round((stock / capacity) * 100))),
    };
  });

  const totalUnits = products.reduce((sum, product) => sum + (typeof product.stock === "number" ? product.stock : 0), 0);
  const lowStockCount = products.filter((product) => typeof product.stock !== "number" || product.stock <= 40).length;
  const categoryCount = new Set(products.map((product) => categoryLabel(product.categoryTitle))).size;
  const growth = products.length === 0 ? 0 : Math.min(99.9, (categoryCount / products.length) * 100 + 18.5);

  const css = `
    .page-title {
      font-size: 42px;
      line-height: 0.98;
    }
    .page-subtitle {
      display: none;
    }
    .actions {
      padding-top: 0;
    }
    .inventory-add-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      height: 44px;
      border-radius: 8px;
      background: linear-gradient(180deg, #139f12 0%, #138d11 100%);
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 8px 16px rgba(17, 140, 16, 0.18);
    }
    .inventory-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .inventory-stat-card {
      background: #fff;
      border-radius: 12px;
      min-height: 138px;
      padding: 22px 24px;
      box-shadow: 0 14px 28px rgba(48, 76, 37, 0.05);
    }
    .inventory-stat-card.green {
      background: linear-gradient(180deg, #1d9c13 0%, #188b12 100%);
      color: #fff;
    }
    .inventory-stat-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }
    .inventory-stat-label {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #6f7b6c;
    }
    .inventory-stat-card.green .inventory-stat-label {
      color: rgba(255, 255, 255, 0.76);
    }
    .inventory-stat-icon {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 6px;
      background: #d8f0c8;
      color: #2c9721;
    }
    .inventory-stat-icon.red {
      background: #ffe0da;
      color: #d24437;
    }
    .inventory-stat-card.green .inventory-stat-icon {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    .inventory-stat-value {
      margin-top: 18px;
      font-size: 46px;
      line-height: 0.95;
      font-weight: 800;
      letter-spacing: -0.06em;
      color: #207e1e;
    }
    .inventory-stat-card.red .inventory-stat-value {
      color: #b72727;
    }
    .inventory-stat-card.green .inventory-stat-value {
      color: #fff;
    }
    .inventory-stat-meta {
      margin-top: 8px;
      font-size: 14px;
      color: #556152;
    }
    .inventory-stat-card.green .inventory-stat-meta {
      color: rgba(255, 255, 255, 0.72);
    }
    .inventory-table-card {
      background: rgba(255, 255, 255, 0.86);
      border-radius: 22px;
      box-shadow: 0 18px 36px rgba(48, 76, 37, 0.05);
      overflow: hidden;
    }
    .inventory-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 22px 24px 16px;
    }
    .inventory-search {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 0 16px;
      border-radius: 8px;
      background: linear-gradient(180deg, #e8f0dc 0%, #e2ecd3 100%);
      color: #6f7d6c;
      font-size: 17px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 8px 16px rgba(112, 137, 83, 0.06);
      transition: box-shadow 0.18s ease, transform 0.18s ease;
    }
    .inventory-search:focus-within {
      box-shadow: inset 0 0 0 1px rgba(25, 136, 22, 0.18), 0 10px 22px rgba(57, 130, 47, 0.12);
    }
    .inventory-input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: #4f5f4b;
      font-size: 16px;
    }
    .inventory-input::placeholder {
      color: #7a8677;
    }
    .inventory-dropdown-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .inventory-filter-wrap {
      position: relative;
      flex: 0 0 auto;
    }
    .inventory-filter {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 14px;
      border-radius: 12px;
      background: linear-gradient(180deg, #f4f8ed 0%, #eaf2de 100%);
      color: #4f604b;
      font-size: 15px;
      text-decoration: none;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.82), 0 10px 18px rgba(117, 139, 89, 0.08);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    .inventory-filter:hover {
      transform: translateY(-1px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 22px rgba(98, 125, 69, 0.12);
      background: linear-gradient(180deg, #f7fbf0 0%, #edf5e2 100%);
    }
    .inventory-filter:focus-within {
      box-shadow: inset 0 0 0 1px rgba(23, 137, 29, 0.22), 0 12px 22px rgba(98, 125, 69, 0.12);
    }
    .inventory-filter-select {
      min-width: 190px;
      position: relative;
      justify-content: space-between;
      border: 1px solid transparent;
      padding-right: 40px;
    }
    .inventory-filter-select.is-open {
      border-color: rgba(47, 151, 42, 0.24);
      background: linear-gradient(180deg, #f8fcf3 0%, #eef7e5 100%);
      box-shadow: inset 0 0 0 1px rgba(23, 137, 29, 0.08), 0 16px 28px rgba(98, 125, 69, 0.14);
    }
    .inventory-filter-button {
      border: 0;
      cursor: pointer;
      font-weight: 700;
    }
    .inventory-select-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #73916c;
      pointer-events: none;
      transition: transform 0.18s ease, color 0.18s ease;
    }
    .inventory-filter-select.is-open .inventory-select-arrow {
      transform: translateY(-50%) rotate(180deg);
      color: #2d8c2f;
    }
    .inventory-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 100%;
      min-width: 190px;
      padding: 6px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(173, 191, 152, 0.55);
      box-shadow: 0 14px 24px rgba(93, 118, 67, 0.12), 0 4px 10px rgba(93, 118, 67, 0.06);
      backdrop-filter: blur(16px);
      overflow: hidden;
      box-sizing: border-box;
      z-index: 20;
      animation: inventoryMenuIn 0.18s ease;
    }
    .inventory-menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      border: 0;
      background: transparent;
      border-radius: 9px;
      padding: 9px 12px;
      color: #4d6247;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.25;
      text-align: left;
      cursor: pointer;
      transition: background 0.16s ease, color 0.16s ease;
    }
    .inventory-menu-item:hover {
      background: linear-gradient(180deg, #f3f9ea 0%, #ebf5df 100%);
      color: #24752a;
    }
    .inventory-menu-item.active {
      background: linear-gradient(180deg, #25a01d 0%, #1e8e18 100%);
      color: #fff;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
    }
    @keyframes inventoryMenuIn {
      from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .inventory-table {
      width: 100%;
      border-collapse: collapse;
    }
    .inventory-table thead {
      background: #ebf1dc;
    }
    .inventory-table th {
      padding: 14px 18px;
      text-align: left;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #51604e;
    }
    .inventory-table td {
      padding: 16px 18px;
      border-bottom: 1px solid #edf2e5;
      vertical-align: middle;
    }
    .inventory-table tr:last-child td {
      border-bottom: 0;
    }
    .inventory-product {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .inventory-product img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      background: #fff;
    }
    .inventory-product-name {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.28;
      color: #2b3428;
    }
    .inventory-product-sku {
      margin-top: 4px;
      font-size: 12px;
      color: #72806e;
      line-height: 1.3;
    }
    .inventory-category-pill,
    .inventory-status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 26px;
      padding: 0 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .inventory-category-pill {
      background: linear-gradient(180deg, #edf5e3 0%, #e1ebd5 100%);
      color: #63845f;
    }
    .inventory-status-pill.optimal {
      background: #baf28f;
      color: #38862f;
    }
    .inventory-status-pill.healthy {
      background: #e7eed7;
      color: #66775d;
    }
    .inventory-status-pill.warning {
      background: #baf28f;
      color: #588f31;
    }
    .inventory-status-pill.critical {
      background: #ffdeda;
      color: #c9443a;
    }
    .inventory-stock-wrap {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .inventory-stock-bar {
      width: 116px;
      height: 6px;
      border-radius: 999px;
      background: #e2ebdc;
      overflow: hidden;
      flex: 0 0 auto;
    }
    .inventory-stock-fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: #1f7c1a;
      min-width: 30px;
    }
    .inventory-stock-fill.critical {
      background: #c4362d;
      min-width: 10px;
    }
    .inventory-stock-fill.warning {
      background: #38b12d;
      min-width: 32px;
    }
    .inventory-stock-fill.healthy {
      background: #2ea126;
      min-width: 34px;
    }
    .inventory-stock-text,
    .inventory-price {
      font-size: 14px;
      font-weight: 700;
      color: #394337;
    }
    .inventory-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #445540;
    }
    .inventory-actions a,
    .inventory-actions button {
      border: 0;
      background: transparent;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }
    .inventory-actions .danger {
      color: #db3d30;
    }
    .inventory-empty {
      text-align: center;
      color: #64725f;
      font-size: 14px;
      padding: 28px 18px;
    }
    .inventory-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 18px 18px 20px;
      color: #64725f;
      font-size: 14px;
    }
    .inventory-pagination {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .inventory-page-btn {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 4px;
      border: 0;
      background: #fff;
      color: #51604c;
      box-shadow: inset 0 0 0 1px rgba(45, 58, 40, 0.08);
      cursor: pointer;
    }
    .inventory-page-btn:disabled {
      opacity: 0.45;
      cursor: default;
    }
    .inventory-page-btn.active {
      background: #1a7e19;
      color: #fff;
      box-shadow: none;
    }
    @media (max-width: 1200px) {
      .inventory-stats {
        grid-template-columns: 1fr;
      }
      .inventory-toolbar {
        flex-wrap: wrap;
      }
      .inventory-dropdown-group {
        width: 100%;
        flex-wrap: wrap;
      }
      .inventory-filter-wrap {
        flex: 1 1 calc(50% - 8px);
      }
      .inventory-filter-select,
      .inventory-menu {
        width: 100%;
        min-width: 0;
      }
      .inventory-search {
        width: 100%;
        flex: 1 1 100%;
      }
    }
    @media (max-width: 900px) {
      .page-title {
        font-size: 34px;
      }
      .inventory-table-wrap {
        overflow-x: auto;
      }
      .inventory-table {
        min-width: 960px;
      }
      .inventory-footer {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  return (
    <AdminShell
      activeHref="/admin/inventory"
      title="Product Management"
      subtitle=""
      searchPlaceholder="Search products, SKU or category..."
      userName="Admin"
      userRole="Inventory Admin"
      userLabel=""
      actions={
        <Link href="/admin/products" className="inventory-add-button">
          <IconPlus />
          <span>Add New Product</span>
        </Link>
      }
    >
      <style>{css}</style>
      <div className="space-y-6">
        <section className="inventory-stats">
          <div className="inventory-stat-card">
            <div className="inventory-stat-header">
              <div className="inventory-stat-label">Total Active Units</div>
              <div className="inventory-stat-icon">
                <IconClipboard />
              </div>
            </div>
            <div className="inventory-stat-value">{formatUnits(totalUnits)}</div>
            <div className="inventory-stat-meta">~ {categoryCount} active categories</div>
          </div>

          <div className="inventory-stat-card red">
            <div className="inventory-stat-header">
              <div className="inventory-stat-label">Low Stock Items</div>
              <div className="inventory-stat-icon red">
                <IconWarning />
              </div>
            </div>
            <div className="inventory-stat-value">{lowStockCount}</div>
            <div className="inventory-stat-meta">Requires immediate attention</div>
          </div>

          <div className="inventory-stat-card green">
            <div className="inventory-stat-header">
              <div className="inventory-stat-label">Inventory Growth</div>
              <div className="inventory-stat-icon">
                <IconTrend />
              </div>
            </div>
            <div className="inventory-stat-value">{growth.toFixed(1)}%</div>
            <div className="inventory-stat-meta">Annual increase in variety</div>
          </div>
        </section>

        <section className="inventory-table-card">
          <InventoryTableClient initialRows={rows} totalProducts={products.length} />
        </section>
      </div>
    </AdminShell>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M9 4.5h6l.8 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.2L9 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M12 4 21 20H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M5 16.5 10 11l3 3 6-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 7h-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
