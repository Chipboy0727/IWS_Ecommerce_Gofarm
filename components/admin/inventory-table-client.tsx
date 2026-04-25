"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type InventoryRow = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  capacity: number;
  price: number;
  imageSrc: string;
  imageAlt: string;
  status: {
    label: string;
    tone: "critical" | "warning" | "healthy" | "optimal";
  };
  progress: number;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function toCsv(rows: InventoryRow[]) {
  const headers = ["Name", "SKU", "Category", "Stock", "Capacity", "Status", "Price"];
  const lines = rows.map((row) =>
    [row.name, row.sku, row.category, row.stock, row.capacity, row.status.label, row.price]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function InventoryTableClient({
  initialRows,
  totalProducts,
}: {
  initialRows: InventoryRow[];
  totalProducts: number;
}) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<null | "category" | "stock">(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 4;

  const categories = useMemo(() => {
    return ["all", ...new Set(rows.map((row) => row.category))];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        !search ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || row.category === category;
      const matchesStock = stockFilter === "all" || row.status.tone === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [rows, search, category, stockFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filteredRows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (row: InventoryRow) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    setBusySlug(row.slug);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(row.slug)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }
      setRows((current) => current.filter((item) => item.id !== row.id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <>
      <div className="inventory-toolbar">
        <label className="inventory-search">
          <IconSearch />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search products, SKU or category..."
            className="inventory-input"
          />
        </label>

        <div className="inventory-dropdown-group" ref={menuRef}>
          <div className="inventory-filter-wrap">
            <button
              type="button"
              className={`inventory-filter inventory-filter-select${openMenu === "category" ? " is-open" : ""}`}
              onClick={() => setOpenMenu((current) => (current === "category" ? null : "category"))}
            >
              <IconFilter />
              <span>{category === "all" ? "Category" : category}</span>
              <span className="inventory-select-arrow" aria-hidden="true">
                <IconChevronDown />
              </span>
            </button>
            {openMenu === "category" ? (
              <div className="inventory-menu">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`inventory-menu-item${category === item ? " active" : ""}`}
                    onClick={() => {
                      setCategory(item);
                      setPage(1);
                      setOpenMenu(null);
                    }}
                  >
                    {item === "all" ? "All Categories" : item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="inventory-filter-wrap">
            <button
              type="button"
              className={`inventory-filter inventory-filter-select${openMenu === "stock" ? " is-open" : ""}`}
              onClick={() => setOpenMenu((current) => (current === "stock" ? null : "stock"))}
            >
              <IconFilter />
              <span>
                {stockFilter === "all"
                  ? "Stock Level"
                  : stockFilter.charAt(0).toUpperCase() + stockFilter.slice(1)}
              </span>
              <span className="inventory-select-arrow" aria-hidden="true">
                <IconChevronDown />
              </span>
            </button>
            {openMenu === "stock" ? (
              <div className="inventory-menu">
                {[
                  ["all", "All Levels"],
                  ["critical", "Critical"],
                  ["warning", "Warning"],
                  ["healthy", "Healthy"],
                  ["optimal", "Optimal"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`inventory-menu-item${stockFilter === value ? " active" : ""}`}
                    onClick={() => {
                      setStockFilter(value);
                      setPage(1);
                      setOpenMenu(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <button type="button" className="inventory-filter inventory-filter-button" onClick={exportCsv}>
          <IconExport />
          <span>Export</span>
        </button>
      </div>

      <div className="inventory-table-wrap">
        <table className="inventory-table">
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
            {pageRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="inventory-product">
                    <img src={row.imageSrc} alt={row.imageAlt} />
                    <div>
                      <div className="inventory-product-name">{row.name}</div>
                      <div className="inventory-product-sku">SKU: {row.sku}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="inventory-category-pill">{row.category}</span>
                </td>
                <td>
                  <div className="inventory-stock-wrap">
                    <div className="inventory-stock-bar">
                      <span className={`inventory-stock-fill ${row.status.tone}`} style={{ width: `${row.progress}%` }} />
                    </div>
                    <span className="inventory-stock-text">
                      {row.stock}/{row.capacity}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`inventory-status-pill ${row.status.tone}`}>{row.status.label}</span>
                </td>
                <td>
                  <span className="inventory-price">{formatMoney(row.price)}</span>
                </td>
                <td>
                  <div className="inventory-actions">
                    <Link href="/admin/products" aria-label={`Edit ${row.name}`}>
                      <IconEdit />
                    </Link>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => void handleDelete(row)}
                      aria-label={`Delete ${row.name}`}
                      disabled={busySlug === row.slug}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="inventory-empty">
                  No matching products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="inventory-footer">
        <div>
          Showing {pageRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRows.length)} of{" "}
          {filteredRows.length.toLocaleString("en-US")} filtered products ({totalProducts.toLocaleString("en-US")} total)
        </div>
        <div className="inventory-pagination">
          <button
            type="button"
            className="inventory-page-btn"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
          >
            <IconChevronLeft />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 3).map((item) => (
            <button
              key={item}
              type="button"
              className={`inventory-page-btn${item === currentPage ? " active" : ""}`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="inventory-page-btn"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={currentPage === pageCount}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M5 7h14M8 12h8m-5 5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M12 5v9m0 0-3-3m3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16.5V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M4 20h3.5L18 9.5 14.5 6 4 16.5V20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m13.5 7 3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M5 7h14M9 7V5.7A1.7 1.7 0 0 1 10.7 4h2.6A1.7 1.7 0 0 1 15 5.7V7m-8 0 .8 12a1.8 1.8 0 0 0 1.8 1.7h4.8a1.8 1.8 0 0 0 1.8-1.7L17 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="m14.5 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
