"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "awaiting_payment";
  items: number;
  products?: Array<{ id?: string; name: string; price: number; quantity: number; imageSrc?: string }>;
  shippingAddress?: string;
  customerEmail?: string;
}

async function fetchOrders() {
  const response = await fetch("/api/orders", { credentials: "include" });
  if (!response.ok) {
    throw new Error(response.status === 401 ? "unauthorized" : "failed");
  }
  const data = await response.json();
  return (data.orders ?? []) as Order[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const refreshOrders = useCallback(async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
      setError(null);
      window.dispatchEvent(new Event("orders-updated"));
    } catch (err) {
      console.error("Failed to refresh orders:", err);
      setError(err instanceof Error && err.message === "unauthorized" ? "Please sign in to view your orders." : "Unable to load orders.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchOrders();
        if (active) setOrders(data);
      } catch (err) {
        if (active) setError(err instanceof Error && err.message === "unauthorized" ? "Please sign in to view your orders." : "Unable to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleOrdersUpdate = () => { refreshOrders(); };
    window.addEventListener("orders-updated", handleOrdersUpdate);
    return () => window.removeEventListener("orders-updated", handleOrdersUpdate);
  }, [refreshOrders]);

  const showNotificationMsg = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      awaiting_payment: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status];
  };

  const getStatusText = (status: Order["status"]) => {
    const texts = {
      pending: "Pending",
      awaiting_payment: "Awaiting Payment",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status];
  };

  const canCancel = (status: Order["status"]) => status === "pending" || status === "processing" || status === "awaiting_payment";

  const activeOrders = useMemo(() => orders.filter((order) => order.status !== "cancelled"), [orders]);
  const totalActiveOrders = activeOrders.length;
  const totalAllOrders = orders.length;
  const deliveredOrders = activeOrders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const pendingOrders = activeOrders.filter((o) => o.status === "pending" || o.status === "processing" || o.status === "shipped" || o.status === "awaiting_payment").length;

  const confirmCancelOrder = async () => {
    if (!showCancelConfirm || isCancelling) return;
    
    setIsCancelling(true);
    
    try {
      const response = await fetch(`/api/orders/${showCancelConfirm}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      
      if (!response.ok) {
        showNotificationMsg("Unable to cancel order", "error");
        setIsCancelling(false);
        return;
      }
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === showCancelConfirm 
            ? { ...order, status: "cancelled" as const }
            : order
        )
      );
      
      window.dispatchEvent(new Event("order-cancelled"));
      
      showNotificationMsg(`Order ${showCancelConfirm} has been cancelled`, "success");
      setShowCancelConfirm(null);
      
      setTimeout(() => {
        refreshOrders();
        setIsCancelling(false);
      }, 300);
    } catch (error) {
      console.error("Error cancelling order:", error);
      showNotificationMsg("Unable to cancel order", "error");
      setIsCancelling(false);
    }
  };

  const confirmClearAllOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        showNotificationMsg("Unable to clear orders", "error");
        return;
      }
      
      setOrders([]);
      // IMPORTANT: Dispatch orders-cleared instead of order-cancelled
      window.dispatchEvent(new Event("orders-cleared"));
      
      showNotificationMsg("All orders have been cleared", "success");
      setShowClearAllConfirm(false);
    } catch (error) {
      console.error("Error clearing orders:", error);
      showNotificationMsg("Unable to clear orders", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gofarm-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl bg-white p-12 shadow-xl">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Orders unavailable</h2>
            <p className="mb-6 text-gray-500">{error}</p>
            <Link href="/sign-in" className="inline-block rounded-lg bg-gofarm-green px-6 py-3 text-white transition-colors hover:bg-gofarm-light-green">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      {notification.show && (
        <div className="fixed right-4 top-24 z-50 animate-slideIn">
          <div className={`flex items-center gap-2 rounded-lg px-6 py-3 shadow-lg ${notification.type === "success" ? "bg-gofarm-green text-white" : "bg-red-500 text-white"}`}>
            {notification.message}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Stat label="Active Orders" value={totalActiveOrders} tone="blue" />
          <Stat label="Delivered" value={deliveredOrders} tone="green" />
          <Stat label="Processing" value={pendingOrders} tone="yellow" />
          <Stat label="Cancelled" value={cancelledOrders} tone="red" />
        </div>
      </div>

      {showCancelConfirm && (
        <ConfirmDialog
          title="Cancel Order?"
          description="Are you sure you want to cancel this order? This action cannot be undone."
          confirmLabel={isCancelling ? "Cancelling..." : "Yes, Cancel"}
          onConfirm={confirmCancelOrder}
          onCancel={() => setShowCancelConfirm(null)}
          isProcessing={isCancelling}
        />
      )}

      {showClearAllConfirm && (
        <ConfirmDialog
          title="Clear All Orders?"
          description="Are you sure you want to clear all orders? This action cannot be undone."
          confirmLabel="Yes, Clear All"
          onConfirm={confirmClearAllOrders}
          onCancel={() => setShowClearAllConfirm(false)}
          isProcessing={false}
        />
      )}

      <div className="mx-auto max-w-5xl px-4 pb-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
            <div>
              <h1 className="text-2xl font-bold text-gofarm-black">My Orders</h1>
              <p className="mt-1 text-gofarm-gray">
                Track and manage your orders
                {cancelledOrders > 0 && (
                  <span className="ml-2 text-sm text-red-500">
                    ({cancelledOrders} cancelled)
                  </span>
                )}
              </p>
            </div>
            {orders.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-600 transition-colors hover:bg-red-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Orders
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gofarm-black">No orders yet</h3>
              <p className="mb-4 text-gofarm-gray">Start shopping to see your orders here</p>
              <Link href="/shop" className="inline-block rounded-lg bg-gofarm-green px-6 py-2 text-white transition-colors hover:bg-gofarm-light-green">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 transition-colors hover:bg-gray-50">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-gofarm-black">Order #{order.id}</span>
                        <p className="text-sm text-gofarm-gray">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className={`font-semibold ${order.status === "cancelled" ? "text-gray-400 line-through" : "text-gofarm-green"}`}>
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-gofarm-gray">{order.items} items</p>
                      <div className="flex gap-3">
                        <Link href={`/orders/${order.id}`} className="flex items-center gap-1 text-sm font-medium text-gofarm-green hover:underline">
                          View Details
                        </Link>
                        {canCancel(order.status) && (
                          <button
                            onClick={() => setShowCancelConfirm(order.id)}
                            disabled={isCancelling}
                            className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
                  <p className="text-gofarm-gray">
                    📦 Active orders: <span className="font-semibold text-gofarm-black">{totalActiveOrders}</span>
                  </p>
                  <p className="text-gofarm-gray">
                    📋 Total orders (all time): <span className="font-semibold text-gofarm-black">{totalAllOrders}</span>
                  </p>
                  {cancelledOrders > 0 && (
                    <p className="text-red-500">
                      ❌ Cancelled: {cancelledOrders}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "blue" | "green" | "yellow" | "red" }) {
  const styles = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };
  
  const icons = {
    blue: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    green: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    yellow: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    red: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles[tone]}`}>
          {icons[tone]}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  isProcessing,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
          <p className="mb-6 text-sm text-gray-500">{description}</p>
          <div className="flex gap-3">
            <button 
              onClick={onConfirm} 
              disabled={isProcessing}
              className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onCancel} 
              disabled={isProcessing}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}