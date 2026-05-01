import type { BackendOrder, BackendStore, BackendUser, SeedCatalog } from "@/lib/backend/catalog-seed";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
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

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function toDate(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed) : new Date();
}

function groupTotals<T>(items: T[], getKey: (item: T) => string, getAmount: (item: T) => number) {
  const totals = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    totals.set(key, (totals.get(key) ?? 0) + getAmount(item));
  }
  return totals;
}

function scaleBars(values: number[]) {
  const max = Math.max(...values, 1);
  return values.map((value) => Math.max(8, Math.round((value / max) * 100)));
}

export type SalesPeriod = "daily" | "weekly" | "monthly";

export type SalesSeries = Record<SalesPeriod, { labels: string[]; bars: number[] }>;

export function buildSalesSeries(orders: BackendOrder[]): SalesSeries {
  const now = new Date();

  const dailyDates = Array.from({ length: 7 }, (_, index) => addDays(startOfDay(now), index - 6));
  const dailyLabels = dailyDates.map((date) => date.toLocaleDateString("en-US", { weekday: "short" }));
  const dailyMap = groupTotals(
    orders.filter((order) => order.status !== "cancelled"),
    (order) => startOfDay(toDate(order.date)).toISOString().slice(0, 10),
    (order) => order.total
  );
  const dailyBars = scaleBars(dailyDates.map((date) => dailyMap.get(date.toISOString().slice(0, 10)) ?? 0));

  const weeklyDates = Array.from({ length: 7 }, (_, index) => addDays(startOfDay(now), -((6 - index) * 7)));
  const weeklyLabels = weeklyDates.map((date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const weeklyMap = groupTotals(
    orders.filter((order) => order.status !== "cancelled"),
    (order) => {
      const date = startOfDay(toDate(order.date));
      const weekStart = addDays(date, -date.getDay());
      return weekStart.toISOString().slice(0, 10);
    },
    (order) => order.total
  );
  const weeklyBars = scaleBars(
    weeklyDates.map((date) => {
      const weekStart = addDays(date, -date.getDay()).toISOString().slice(0, 10);
      return weeklyMap.get(weekStart) ?? 0;
    })
  );

  const monthDates = Array.from({ length: 6 }, (_, index) => addMonths(startOfDay(now), index - 5));
  const monthLabels = monthDates.map((date) => date.toLocaleDateString("en-US", { month: "short" }));
  const monthMap = groupTotals(
    orders.filter((order) => order.status !== "cancelled"),
    (order) => {
      const date = startOfDay(toDate(order.date));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    },
    (order) => order.total
  );
  const monthlyBars = scaleBars(
    monthDates.map((date) => monthMap.get(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`) ?? 0)
  );

  return {
    daily: { labels: dailyLabels, bars: dailyBars },
    weekly: { labels: weeklyLabels, bars: weeklyBars },
    monthly: { labels: monthLabels, bars: monthlyBars },
  };
}

export function buildDashboardStats(db: SeedCatalog) {
  const activeOrders = db.orders.filter((order) => order.status !== "cancelled");
  const currentRevenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = new Set(db.orders.map((order) => order.customerEmail.toLowerCase())).size || db.users.filter((user) => user.role === "user").length;
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevMonthDate = new Date(now);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const monthRevenue = (monthKey: string) =>
    db.orders
      .filter((order) => order.status !== "cancelled")
      .filter((order) => {
        const date = toDate(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return key === monthKey;
      })
      .reduce((sum, order) => sum + order.total, 0);

  const currentMonthRevenue = monthRevenue(thisMonth);
  const previousMonthRevenue = monthRevenue(prevMonth);
  const monthOrderCount = (monthKey: string) =>
    db.orders.filter((order) => {
      const date = toDate(order.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return key === monthKey && order.status !== "cancelled";
    }).length;
  const currentMonthOrders = monthOrderCount(thisMonth);
  const previousMonthOrders = monthOrderCount(prevMonth);
  const orderGrowth = previousMonthOrders > 0
    ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100
    : currentMonthOrders > 0
      ? 100
      : 0;
  const uniqueCustomersThisMonth = new Set(
    db.orders
      .filter((order) => {
        const date = toDate(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return key === thisMonth;
      })
      .map((order) => order.customerEmail.toLowerCase())
  ).size;
  const uniqueCustomersPrevMonth = new Set(
    db.orders
      .filter((order) => {
        const date = toDate(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return key === prevMonth;
      })
      .map((order) => order.customerEmail.toLowerCase())
  ).size;
  const customerGrowth = uniqueCustomersPrevMonth > 0
    ? ((uniqueCustomersThisMonth - uniqueCustomersPrevMonth) / uniqueCustomersPrevMonth) * 100
    : uniqueCustomersThisMonth > 0
      ? 100
      : 0;
  const revenueGrowth = previousMonthRevenue > 0
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : currentMonthRevenue > 0
      ? 100
      : 0;

  return {
    totalRevenue: currentRevenue,
    activeOrders: activeOrders.length,
    newCustomers: totalCustomers,
    revenueGrowth,
    orderCount: db.orders.length,
    productCount: db.products.length,
    userCount: db.users.length,
    storeCount: db.stores.length,
    lowStockCount: db.products.filter((product) => typeof product.stock === "number" && product.stock <= 25).length,
    totalRevenueLabel: money(currentRevenue),
    orderGrowth,
    customerGrowth,
  };
}

export function buildRecentOrders(db: SeedCatalog) {
  return [...db.orders]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      product: order.products[0]?.name ?? "Order",
      customer: order.customerName,
      location: order.shippingAddress,
      date: order.date,
      amount: order.total,
      status: order.status === "delivered" ? "completed" : order.status === "cancelled" ? "cancelled" : "processing",
      image: order.products[0]?.imageSrc ?? "/images/logo.svg",
    }));
}

export function buildOrderRows(db: SeedCatalog) {
  return [...db.orders]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((order) => ({
      id: order.id,
      customer: order.customerName,
      email: order.customerEmail,
      date: order.date,
      amount: money(order.total),
      status: order.status,
      items: order.items,
      products: order.products,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    }));
}

export function buildCustomerRows(users: BackendUser[]) {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "Admin" : "Customer",
    joinDate: user.createdAt,
    status: (user as any).status || "Active",
    tone: (user as any).status === "Banned" ? ("red" as const) : ("green" as const),
    avatar: user.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || user.email.slice(0, 2).toUpperCase(),
  }));
}

export function buildStoreRows(stores: BackendStore[]) {
  return stores.map((store) => ({
    ...store,
    tint: store.status === "Maintenance" ? ("red" as const) : ("green" as const),
  }));
}
