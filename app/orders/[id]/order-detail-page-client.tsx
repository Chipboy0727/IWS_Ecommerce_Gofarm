"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "awaiting_payment";
  items: number;
  products?: Array<{ id?: string; name: string; price: number; quantity: number; imageSrc?: string }>;
  shippingAddress?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

async function loadOrder(id: string) {
  const response = await fetch(`/api/orders/${id}`, { credentials: "include" });
  if (!response.ok) {
    throw new Error(response.status === 401 ? "unauthorized" : "not-found");
  }
  const data = await response.json();
  return data.order as Order | null;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const orderId = params?.id;
    if (!orderId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const nextOrder = await loadOrder(orderId);
        if (active) setOrder(nextOrder);
      } catch (err) {
        if (active) {
          setError(err instanceof Error && err.message === "unauthorized" ? "Please sign in to view this order." : "Order not found.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [params?.id]);

  const canCancel = () => order && (order.status === "pending" || order.status === "processing" || order.status === "awaiting_payment");

  const confirmCancelOrder = async () => {
    if (!order) return;
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (!response.ok) {
      setError("Unable to cancel this order.");
      return;
    }
    const data = await response.json();
    setOrder(data.order as Order);
    setShowCancelConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-b-2 border-gofarm-green" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-3 sm:px-4 text-center">
          <div className="rounded-2xl bg-white p-8 sm:p-12 shadow-xl">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">{error === "Please sign in to view this order." ? "Sign in required" : "Order not found"}</h2>
            <p className="mb-5 sm:mb-6 text-sm sm:text-base text-gray-500">{error ?? "The order you're looking for doesn't exist."}</p>
            <Link href={error ? "/sign-in" : "/orders"} className="inline-block rounded-lg bg-gofarm-green px-5 sm:px-6 py-2.5 sm:py-3 text-white transition-colors hover:bg-gofarm-light-green text-sm sm:text-base">
              {error ? "Sign In" : "Back to Orders"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = order.total / 1.1;
  const tax = order.total - subtotal;
  const shipping: number = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8 lg:py-12">
      {showCancelConfirm && (
        <ConfirmDialog
          title="Cancel Order?"
          description="Are you sure you want to cancel this order? This action cannot be undone."
          confirmLabel="Yes, Cancel"
          onConfirm={confirmCancelOrder}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}

      <div className="mx-auto max-w-4xl px-3 sm:px-4">
        <div className="mb-5 sm:mb-6">
          <Link href="/orders" className="inline-flex items-center gap-1.5 sm:gap-2 text-gofarm-green transition-colors hover:text-gofarm-light-green text-sm sm:text-base">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gofarm-black">Order #{order.id}</h1>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gofarm-gray">Placed on {order.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <StatusPill status={order.status} />
                {canCancel() && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="rounded-lg bg-red-500 px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-white transition-colors hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 bg-gray-50/50 p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gofarm-black">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Info label="Full Name" value={order.customerName} />
              <Info label="Email" value={order.customerEmail} />
              <Info label="Phone" value={order.customerPhone} />
            </div>
          </div>

          <div className="border-b border-gray-200 p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gofarm-black">Order Items</h2>
            <div className="space-y-3 sm:space-y-4">
              {order.products && order.products.length > 0 ? (
                order.products.map((item, idx) => (
                  <div key={item.id ?? idx} className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-b border-gray-100 py-3 last:border-0">
                    <img src={item.imageSrc ?? "/images/logo.svg"} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gofarm-black text-sm sm:text-base">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gofarm-gray">Quantity: {item.quantity}</p>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-gofarm-green">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-gofarm-black text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-500">Order items details not available</p>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 bg-gray-50/30 p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gofarm-black">Order Summary</h2>
            <div className="max-w-md space-y-1.5 sm:space-y-2">
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
              <SummaryRow label="Tax (10%)" value={`$${tax.toFixed(2)}`} />
              <div className="flex justify-between border-t border-gray-200 pt-2 sm:pt-3 text-base sm:text-lg font-bold">
                <span>Total</span>
                <span className="text-gofarm-green">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gofarm-black">Shipping Information</h2>
            {order.shippingAddress ? (
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-700 break-words">{order.shippingAddress}</p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">Shipping address not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    awaiting_payment: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  const labels = {
    pending: "Pending",
    awaiting_payment: "Awaiting Payment",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return <span className={`rounded-full border px-2.5 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold ${styles[status]}`}>{labels[status]}</span>;
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{value ?? "Not available"}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs sm:text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="mx-3 sm:mx-4 w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="text-center">
          <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="mb-5 sm:mb-6 text-xs sm:text-sm text-gray-500">{description}</p>
          <div className="flex gap-2 sm:gap-3">
            <button onClick={onConfirm} className="flex-1 rounded-lg bg-red-500 px-3 sm:px-4 py-2 text-white transition-colors hover:bg-red-600 text-sm">Confirm</button>
            <button onClick={onCancel} className="flex-1 rounded-lg bg-gray-100 px-3 sm:px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}