"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  products?: any[];
  shippingAddress?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    // Lấy id từ params (đảm bảo params.id là string)
    const orderId = params?.id as string;
    console.log("Order ID from params:", orderId); // Debug
    
    if (!orderId) {
      setLoading(false);
      return;
    }
    
    const savedOrders = localStorage.getItem("orders");
    console.log("Saved orders:", savedOrders); // Debug
    
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      console.log("Found order:", foundOrder); // Debug
      setOrder(foundOrder || null);
    }
    setLoading(false);
  }, [params?.id]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
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
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status];
  };

  const canCancel = () => {
    return order && (order.status === "pending" || order.status === "processing");
  };

  const handleCancelOrder = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = () => {
    if (order) {
      const updatedOrder = { ...order, status: "cancelled" as const };
      setOrder(updatedOrder);
      
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const updatedOrders = orders.map((o: Order) =>
          o.id === order.id ? updatedOrder : o
        );
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      }
      
      showNotification(`Order ${order.id} has been cancelled`, "success");
      setShowCancelConfirm(false);
    }
  };

  const cancelCancelOrder = () => {
    setShowCancelConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gofarm-green"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
            <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
            <Link href="/orders" className="inline-block px-6 py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Tính toán lại tổng tiền từ products nếu có
  const subtotal = order.total / 1.1;
  const tax = order.total - subtotal;
  const shipping = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success" ? "bg-gofarm-green text-white" : "bg-red-500 text-white"
          }`}>
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmCancelOrder} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Yes, Cancel
                </button>
                <button onClick={cancelCancelOrder} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/orders" className="inline-flex items-center gap-2 text-gofarm-green hover:text-gofarm-light-green transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gofarm-black">Order #{order.id}</h1>
                <p className="text-gofarm-gray mt-1">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                {canCancel() && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gofarm-black mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.customerName && (
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                </div>
              )}
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              )}
              {order.customerPhone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gofarm-black mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products && order.products.length > 0 ? (
                order.products.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                    <img src={item.imageSrc} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gofarm-black">{item.name}</h3>
                      <p className="text-sm text-gofarm-gray">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gofarm-green font-semibold mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-gofarm-black">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Order items details not available</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200 bg-gray-50/30">
            <h2 className="text-lg font-semibold text-gofarm-black mb-4">Order Summary</h2>
            <div className="space-y-2 max-w-md">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span className="text-gofarm-green">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gofarm-black mb-4">Shipping Information</h2>
            {order.shippingAddress ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">{order.shippingAddress}</p>
              </div>
            ) : (
              <p className="text-gray-500">Shipping address not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}