"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  InvIconAlert,
  InvIconCheck,
  InvIconEye,
  InvIconInfo,
  InvIconPackage,
  InvIconPrint,
  InvIconTruck,
  InvIconX,
} from "@/components/admin/inventory-style-actions";

export type OrderAdminRow = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  amount: string;
  amountValue: number;
  status: string;
  items: number;
  shippingAddress: string;
  paymentMethod: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageSrc: string;
  }[];
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
  if (status === "pending") return "Pending";
  if (status === "processing") return "Processing";
  if (status === "preparing") return "Preparing";
  if (status === "shipped") return "Shipped";
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
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
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderAdminRow | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ id: string; status: string; title: string; message: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; message: string } | null>(null);
  const [failedOrderModal, setFailedOrderModal] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement | null>(null);
  const rowMenuRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 4;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!filterRef.current?.contains(target)) setMenuOpen(false);
      if (!rowMenuRef.current?.contains(target)) setActiveRowId(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        !search ||
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.customer.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || row.status === status;
      return matchesSearch && matchesStatus && matchesDate(row.date, date);
    });
  }, [rows, search, status, date]);

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

  const requestUpdateStatus = (id: string, newStatus: string, title: string, message: string) => {
    setConfirmModal({ id, status: newStatus, title, message });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      const { order } = await res.json();
      setRows((current) => current.map((r) => (r.id === orderId ? { ...r, status: order.status } : r)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: order.status } : null);
      }
      setToastMessage({ title: "Success", message: "Order status updated successfully." });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const commitUpdateStatus = async () => {
    if (!confirmModal) return;
    await handleUpdateStatus(confirmModal.id, confirmModal.status);
    setConfirmModal(null);
  };

  const renderActions = (row: OrderAdminRow) => {
    const btnDetails = (
      <button
        type="button"
        onClick={() => setSelectedOrder(row)}
        className="admin-icon-actions-muted"
        title="Order details"
        aria-label={`Details for order ${row.id}`}
      >
        <InvIconEye />
      </button>
    );

    if (row.status === "pending") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-accent"
            title="Confirm order"
            aria-label={`Confirm order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "processing", "Confirm Order", "Are you sure you want to confirm this order?")}
          >
            <InvIconCheck />
          </button>
          <button
            type="button"
            className="admin-icon-actions-danger"
            title="Reject order"
            aria-label={`Reject order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "cancelled", "Reject Order", "Are you sure you want to reject this order?")}
          >
            <InvIconX />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "processing") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-violet"
            title="Prepare goods"
            aria-label={`Prepare order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "preparing", "Prepare Goods", "Change order status to Preparing?")}
          >
            <InvIconPackage />
          </button>
          <button
            type="button"
            className="admin-icon-actions-danger"
            title="Cancel order"
            aria-label={`Cancel order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "cancelled", "Cancel Order", "Are you sure you want to cancel this order?")}
          >
            <InvIconX />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "preparing") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-warn"
            title="Mark shipped"
            aria-label={`Ship order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "shipped", "Hand over to Shipper", "Change order status to Shipped?")}
          >
            <InvIconTruck />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "shipped") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-accent"
            title="Mark delivered"
            aria-label={`Deliver order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "delivered", "Mark Delivered", "Confirm this order has been successfully delivered?")}
          >
            <InvIconCheck />
          </button>
          <button
            type="button"
            className="admin-icon-actions-muted"
            title="Mark delivery failed"
            aria-label={`Failed delivery ${row.id}`}
            onClick={() => setFailedOrderModal(row.id)}
          >
            <InvIconAlert />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "delivered") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-indigo"
            title="Print"
            aria-label={`Print order ${row.id}`}
            onClick={() => window.print()}
          >
            <InvIconPrint />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "cancelled") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-muted"
            title="Cancellation reason"
            aria-label={`Reason for cancelled order ${row.id}`}
            onClick={() => alert("Cancel Reason: Customer changed their mind or delivery failed.")}
          >
            <InvIconInfo />
          </button>
          {btnDetails}
        </div>
      );
    }

    if (row.status === "awaiting_payment") {
      return (
        <div className="admin-icon-actions">
          <button
            type="button"
            className="admin-icon-actions-accent"
            title="Confirm payment"
            aria-label={`Mark paid ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "processing", "Confirm Payment", "Change order status to Processing?")}
          >
            <InvIconCheck />
          </button>
          <button
            type="button"
            className="admin-icon-actions-danger"
            title="Cancel order"
            aria-label={`Cancel order ${row.id}`}
            onClick={() => requestUpdateStatus(row.id, "cancelled", "Cancel Order", "Are you sure you want to cancel this order?")}
          >
            <InvIconX />
          </button>
          {btnDetails}
        </div>
      );
    }

    return <div className="admin-icon-actions">{btnDetails}</div>;
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
                  ["preparing", "Preparing"],
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
          {mounted && `Showing ${filteredRows.length.toLocaleString("en-US")} of ${totalCount.toLocaleString("en-US")} orders`}
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
            {mounted && pageRows.map((row) => {
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
                    {renderActions(row)}
                  </td>
                </tr>
              );
            })}
            {mounted && pageRows.length === 0 ? (
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-400 font-mono mt-1" style={{ fontSize: '9px', wordBreak: 'break-all', letterSpacing: '0.02em' }}>ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <IconClose />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Info</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gofarm-light-green/20 text-gofarm-green flex items-center justify-center font-bold text-sm">
                        {selectedOrder.customer.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedOrder.shippingAddress || "No address provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Notes</h3>
                    <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-100 italic">No notes from customer.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">{formatDateCell(selectedOrder.date).top}, {formatDateCell(selectedOrder.date).bottom}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="font-bold text-gofarm-green">{selectedOrder.amount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Status</h3>
                    <select
                      className={`w-full p-2.5 rounded-lg border text-sm font-semibold transition-colors focus:ring-2 outline-none
                        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedOrder.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500/20' : ''}
                        ${selectedOrder.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20' : ''}
                        ${selectedOrder.status === 'shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 focus:ring-indigo-500/20' : ''}
                        ${selectedOrder.status === "delivered" ? "bg-gofarm-green/5 text-gofarm-green border-gofarm-green/25 focus:ring-gofarm-green/20" : ""}
                        ${selectedOrder.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500/20' : ''}
                        ${selectedOrder.status === 'awaiting_payment' ? 'bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500/20' : ''}
                      `}
                      value={selectedOrder.status}
                      disabled={isUpdating}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="preparing">Preparing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="awaiting_payment">Awaiting Payment</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items ({selectedOrder.items})</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-right">Price</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-gray-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.products && selectedOrder.products.length > 0 ? (
                        selectedOrder.products.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 flex items-center gap-3">
                              <img src={item.imageSrc} alt={item.name} className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                              <span className="font-medium text-gray-900">{item.name}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center text-gray-900 font-medium">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No items data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-gray-600">{confirmModal.message}</p>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={commitUpdateStatus}
                className="px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-center min-w-[70px]"
                style={{ backgroundColor: "#00a844", color: "#ffffff" }}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {failedOrderModal && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delivery Failed</h3>
              <p className="text-sm text-gray-600 mb-4">How do you want to handle this order?</p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(failedOrderModal, "preparing");
                    setFailedOrderModal(null);
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                  style={{ backgroundColor: '#9333ea', color: '#ffffff' }}
                >
                  Return to Preparing (Retry Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(failedOrderModal, "cancelled");
                    setFailedOrderModal(null);
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                >
                  Cancel this order
                </button>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setFailedOrderModal(null)}
                className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="px-6 py-4 rounded-lg shadow-xl flex items-center gap-3" style={{ backgroundColor: "#00a844", color: "#ffffff" }}>
            <div className="rounded-full p-1" style={{ backgroundColor: "#3b9c3c" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">{toastMessage.title}</p>
              <p className="text-xs text-white/90 mt-0.5">{toastMessage.message}</p>
            </div>
          </div>
        </div>
      )}
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



function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
