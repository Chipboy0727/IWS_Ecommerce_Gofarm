"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type OrderAdminRow = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: string;
  amountValue: number;
  status: string;
  items: number;
  shippingAddress: string;
  paymentMethod: string;
};

function toCsv(rows: OrderAdminRow[]) {
  const headers = ["Order ID", "Customer", "Email", "Date", "Amount", "Status", "Items", "Payment Method"];
  const lines = rows.map((row) =>
    [row.id, row.customer, row.email, row.date, row.amountValue, row.status, row.items, row.paymentMethod]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

function formatDateCell(value: string) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return { top: value, bottom: "" };
  const date = new Date(parsed);
  return {
    top: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    bottom: String(date.getFullYear()),
  };
}

function matchesDate(rowDate: string, selectedDate: string) {
  if (!selectedDate) return true;
  const parsed = Date.parse(rowDate);
  if (!Number.isFinite(parsed)) return false;
  return new Date(parsed).toISOString().slice(0, 10) === selectedDate;
}

function statusLabel(status: string) {
  if (status === "awaiting_payment") return "Awaiting Payment";
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function OrdersHeaderActions({ rows }: { rows: OrderAdminRow[] }) {
  const exportManifest = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders-manifest.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button type="button" className="orders-action-button orders-action-secondary" onClick={exportManifest}>
        <IconExport />
        <span>Export Manifest</span>
      </button>
      <Link href="/checkout" className="orders-action-button orders-action-primary">
        <IconPlus />
        <span>Create New Order</span>
      </Link>
    </>
  );
}

export default function OrdersTableClient({
  initialRows,
  totalCount,
}: {
  initialRows: OrderAdminRow[];
  totalCount: number;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const rowMenuRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 4;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!filterRef.current?.contains(target)) setMenuOpen(false);
      if (!rowMenuRef.current?.contains(target)) setActiveRowId(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      const matchesSearch =
        !search ||
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.customer.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || row.status === status;
      return matchesSearch && matchesStatus && matchesDate(row.date, date);
    });
  }, [initialRows, search, status, date]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setDate("");
    setPage(1);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="orders-filterbar">
        <div className="orders-filter-left">
          <div className="orders-filter-wrap" ref={filterRef}>
            <button
              type="button"
              className={`orders-filter-button${menuOpen ? " is-open" : ""}`}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <IconFilter />
              <span>{status === "all" ? "All Statuses" : statusLabel(status)}</span>
              <IconChevronDown />
            </button>
            {menuOpen ? (
              <div className="orders-filter-menu">
                {[
                  ["all", "All Statuses"],
                  ["pending", "Pending"],
                  ["processing", "Processing"],
                  ["shipped", "Shipped"],
                  ["delivered", "Delivered"],
                  ["cancelled", "Cancelled"],
                  ["awaiting_payment", "Awaiting Payment"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`orders-filter-menu-item${status === value ? " active" : ""}`}
                    onClick={() => {
                      setStatus(value);
                      setPage(1);
                      setMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <label className="orders-date-filter">
            <IconCalendar />
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <button type="button" className="orders-clear-button" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>

        <div className="orders-filter-count">
          Showing {filteredRows.length.toLocaleString("en-US")} of {totalCount.toLocaleString("en-US")} orders
        </div>
      </div>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const dateCell = formatDateCell(row.date);
              const initials = row.customer
                .split(" ")
                .map((part) => part[0] ?? "")
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr key={row.id}>
                  <td className="orders-id-cell">
                    <span>{row.id}</span>
                  </td>
                  <td>
                    <div className="orders-customer">
                      <div className="orders-customer-avatar">{initials}</div>
                      <div>
                        <div className="orders-customer-name">{row.customer}</div>
                        <div className="orders-customer-email">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="orders-date-cell">
                    <span>{dateCell.top}</span>
                    <span>{dateCell.bottom}</span>
                  </td>
                  <td className="orders-amount-cell">{row.amount}</td>
                  <td>
                    <span className={`orders-status-pill ${row.status}`}>{statusLabel(row.status).toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="orders-row-actions" ref={activeRowId === row.id ? rowMenuRef : undefined}>
                      <button
                        type="button"
                        className="orders-more-button"
                        aria-label={`Open actions for ${row.id}`}
                        onClick={() => setActiveRowId((current) => (current === row.id ? null : row.id))}
                      >
                        <IconMore />
                      </button>
                      {activeRowId === row.id ? (
                        <div className="orders-row-menu">
                          <button
                            type="button"
                            onClick={() => {
                              window.alert(
                                `Order ${row.id}\nCustomer: ${row.customer}\nItems: ${row.items}\nPayment: ${row.paymentMethod}\nAddress: ${row.shippingAddress}`
                              );
                              setActiveRowId(null);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await navigator.clipboard.writeText(row.id);
                              setActiveRowId(null);
                            }}
                          >
                            Copy ID
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="orders-empty">
                  No matching orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="orders-pagination-bar">
        <div>
          Showing {pageRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRows.length)} of{" "}
          {filteredRows.length.toLocaleString("en-US")}
        </div>
        <div className="orders-pagination">
          <button type="button" className="orders-page-btn" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            <IconChevronLeft />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 3).map((item) => (
            <button
              key={item}
              type="button"
              className={`orders-page-btn${item === currentPage ? " active" : ""}`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
          {pageCount > 3 ? <span className="orders-page-dots">...</span> : null}
          <button
            type="button"
            className="orders-page-btn"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </>
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

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M7 4.5v3M17 4.5v3M4.5 9h15M6.3 6h11.4A1.8 1.8 0 0 1 19.5 7.8v10A1.8 1.8 0 0 1 17.7 19.6H6.3a1.8 1.8 0 0 1-1.8-1.8v-10A1.8 1.8 0 0 1 6.3 6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

function IconMore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}
