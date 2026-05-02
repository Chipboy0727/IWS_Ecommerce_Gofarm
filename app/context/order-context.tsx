"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
}

interface OrderContextType {
  orders: Order[];
  totalOrders: number;
  pendingOrders: number;
  addOrder: (order: Order) => void;
  cancelOrder: (id: string) => void;
  clearAllOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse orders:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
    // Notify the header whenever the order list changes.
    window.dispatchEvent(new Event("orders-updated"));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: "cancelled" as const } : order
    ));
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;

  return (
    <OrderContext.Provider value={{ orders, totalOrders, pendingOrders, addOrder, cancelOrder, clearAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
}
