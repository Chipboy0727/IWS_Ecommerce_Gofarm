import type { Metadata } from "next";
import StoresLiveView, { type LiveAuditRow, type LiveStoreRow } from "@/components/admin/stores-live-view";
import { buildDashboardStats, buildStoreRows } from "@/lib/backend/admin-analytics";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Store Management | GoFarm",
  description: "Operational hub for GoFarm storefronts and regional outlets.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function compactMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toLocaleString("en-US");
}

function toDate(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed) : new Date();
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function formatDelta(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.round(delta);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

export default async function AdminStoresPage() {
  const db = await readDb();
  const stats = buildDashboardStats(db);
  const stores = buildStoreRows(db.stores);
  const activeOrders = db.orders.filter((order) => order.status !== "cancelled");
  const activeStores = stores.filter((store) => store.status === "Active").length;
  const maintenanceStores = stores.length - activeStores;
  const restockAlerts = stats.lowStockCount + maintenanceStores;

  const latestOrderDate = activeOrders.reduce((latest, order) => {
    const date = toDate(order.date).getTime();
    return date > latest ? date : latest;
  }, 0);
  const anchorDate = latestOrderDate > 0 ? new Date(latestOrderDate) : new Date();
  const currentWindowStart = addDays(startOfDay(anchorDate), -6);
  const previousWindowStart = addDays(currentWindowStart, -7);

  const inCurrentWindow = (value: string) => {
    const date = startOfDay(toDate(value));
    return date >= currentWindowStart && date <= startOfDay(anchorDate);
  };

  const inPreviousWindow = (value: string) => {
    const date = startOfDay(toDate(value));
    return date >= previousWindowStart && date < currentWindowStart;
  };

  const weeklyFootfall = activeOrders
    .filter((order) => inCurrentWindow(order.date))
    .reduce((sum, order) => sum + order.items, 0);

  const liveStores: LiveStoreRow[] = stores.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    city: store.city,
    country: store.country,
    manager: store.manager,
    contact: store.contact || store.phone,
    imageSrc: store.imageSrc,
    status: store.status,
    tint: store.tint,
    updatedAt: store.updatedAt,
  }));

  const auditRows: LiveAuditRow[] = stores.map((store) => {
    const cityKey = normalizeText(store.city);
    const storeKey = normalizeText(store.name);
    const storeOrders = activeOrders.filter((order) => {
      const address = normalizeText(order.shippingAddress);
      return address.includes(cityKey) || address.includes(storeKey);
    });

    const currentTraffic = storeOrders
      .filter((order) => inCurrentWindow(order.date))
      .reduce((sum, order) => sum + order.items, 0);
    const previousTraffic = storeOrders
      .filter((order) => inPreviousWindow(order.date))
      .reduce((sum, order) => sum + order.items, 0);

    return {
      id: store.id,
      manager: store.manager,
      traffic: currentTraffic.toLocaleString("en-US"),
      delta: formatDelta(currentTraffic, previousTraffic),
      deltaTone: currentTraffic >= previousTraffic ? "text-[#309a37]" : "text-[#d95b57]",
      lastAudit: store.updatedAt,
    };
  });

  return (
    <StoresLiveView
      stores={liveStores}
      auditRows={auditRows}
      weeklyFootfallLabel={compactMetric(weeklyFootfall)}
      restockAlerts={restockAlerts}
      activeStores={activeStores}
      maintenanceStores={maintenanceStores}
    />
  );
}
