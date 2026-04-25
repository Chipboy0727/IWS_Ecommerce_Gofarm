import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import OrdersTableClient, { OrdersHeaderActions, type OrderAdminRow } from "@/components/admin/orders-table-client";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Order Log | GoFarm",
  description: "Order management screen for GoFarm admin.",
};

function moneyCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function growthLabel(value: number) {
  return `${value >= 0 ? "+" : ""}${Math.round(value)}%`;
}

function buildRows(db: Awaited<ReturnType<typeof readDb>>): OrderAdminRow[] {
  return [...db.orders]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((order) => ({
      id: order.id,
      customer: order.customerName,
      email: order.customerEmail,
      date: order.date,
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(order.total),
      amountValue: order.total,
      status: order.status,
      items: order.items,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    }));
}

export default async function OrdersPage() {
  const db = await readDb();
  const rows = buildRows(db);
  const activeOrders = rows.filter((row) => row.status !== "cancelled").length;
  const pendingFulfillment = rows.filter((row) => row.status === "pending" || row.status === "processing" || row.status === "awaiting_payment").length;
  const grossRevenue = rows.filter((row) => row.status !== "cancelled").reduce((sum, row) => sum + row.amountValue, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonth = previousMonthDate.toISOString().slice(0, 7);
  const currentMonthRevenue = rows
    .filter((row) => row.status !== "cancelled" && row.date.slice(0, 7) === currentMonth)
    .reduce((sum, row) => sum + row.amountValue, 0);
  const previousMonthRevenue = rows
    .filter((row) => row.status !== "cancelled" && row.date.slice(0, 7) === previousMonth)
    .reduce((sum, row) => sum + row.amountValue, 0);
  const revenueGrowth = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 24;

  const css = `
    .orders-page-title {
      color: #1f7d16;
    }
    .orders-action-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 46px;
      padding: 0 16px;
      border-radius: 8px;
      border: 0;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
      cursor: pointer;
    }
    .orders-action-button:hover {
      transform: translateY(-1px);
    }
    .orders-action-secondary {
      background: linear-gradient(180deg, #ffffff 0%, #f5f9ee 100%);
      color: #334630;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 18px rgba(97, 116, 69, 0.08);
    }
    .orders-action-primary {
      background: linear-gradient(180deg, #22a715 0%, #168e10 100%);
      color: #fff;
      box-shadow: 0 14px 24px rgba(29, 145, 24, 0.22);
    }
    .orders-grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .orders-stat-card {
      border-radius: 18px;
      background: #fff;
      padding: 18px 20px;
      box-shadow: 0 16px 30px rgba(50, 78, 40, 0.05);
      min-height: 126px;
    }
    .orders-stat-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .orders-stat-icon {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 10px;
    }
    .orders-stat-icon.green { background: #dff2d4; color: #247b1e; }
    .orders-stat-icon.pink { background: #ffdceb; color: #c34d8a; }
    .orders-stat-icon.olive { background: #d8f1cb; color: #2b7c22; }
    .orders-stat-chip {
      border-radius: 999px;
      min-height: 24px;
      padding: 0 9px;
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
    }
    .orders-stat-chip.green { background: #d9f2c4; color: #35852a; }
    .orders-stat-chip.pink { background: #ffd7e8; color: #b64b87; }
    .orders-stat-label {
      margin-top: 14px;
      font-size: 14px;
      color: #4f5f4c;
    }
    .orders-stat-value {
      margin-top: 6px;
      font-size: 22px;
      font-weight: 800;
      color: #233021;
      letter-spacing: -0.04em;
    }
    .orders-panel {
      border-radius: 24px;
      background: rgba(255,255,255,0.84);
      box-shadow: 0 18px 34px rgba(46, 71, 35, 0.05);
      overflow: hidden;
    }
    .orders-filterbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 20px;
      border-bottom: 1px solid #edf1e5;
    }
    .orders-filter-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .orders-filter-wrap {
      position: relative;
    }
    .orders-filter-button,
    .orders-date-filter {
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 0 14px;
      border-radius: 10px;
      background: linear-gradient(180deg, #ffffff 0%, #f4f8ee 100%);
      color: #475a43;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06), 0 8px 16px rgba(88, 109, 65, 0.06);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .orders-filter-button {
      border: 0;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      min-width: 150px;
      justify-content: space-between;
    }
    .orders-filter-button:hover,
    .orders-date-filter:hover {
      transform: translateY(-1px);
      box-shadow: inset 0 0 0 1px rgba(35,123,30,0.08), 0 12px 20px rgba(88, 109, 65, 0.09);
    }
    .orders-filter-button.is-open {
      box-shadow: inset 0 0 0 1px rgba(35,123,30,0.18), 0 12px 20px rgba(88, 109, 65, 0.12);
    }
    .orders-filter-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 210px;
      padding: 6px;
      border-radius: 14px;
      background: rgba(255,255,255,0.98);
      border: 1px solid rgba(174, 193, 153, 0.55);
      box-shadow: 0 18px 30px rgba(87, 109, 64, 0.14);
      z-index: 20;
    }
    .orders-filter-menu-item {
      width: 100%;
      border: 0;
      background: transparent;
      border-radius: 10px;
      padding: 10px 12px;
      text-align: left;
      color: #486143;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .orders-filter-menu-item:hover {
      background: #edf6e4;
      color: #257529;
    }
    .orders-filter-menu-item.active {
      background: linear-gradient(180deg, #25a01d 0%, #1e8e18 100%);
      color: #fff;
    }
    .orders-date-filter input {
      border: 0;
      outline: 0;
      background: transparent;
      color: #475a43;
      font-size: 14px;
      font-weight: 700;
    }
    .orders-clear-button {
      border: 0;
      background: transparent;
      color: #218118;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: color 0.18s ease, transform 0.18s ease;
    }
    .orders-clear-button:hover {
      color: #166a12;
      transform: translateY(-1px);
    }
    .orders-filter-count {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #62725e;
      white-space: nowrap;
    }
    .orders-table-wrap {
      overflow-x: auto;
    }
    .orders-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }
    .orders-table thead {
      background: #f0f5e4;
    }
    .orders-table th {
      padding: 14px 22px;
      text-align: left;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #748171;
    }
    .orders-table td {
      padding: 18px 22px;
      border-bottom: 1px solid #edf1e5;
      vertical-align: middle;
    }
    .orders-table tbody tr:last-child td {
      border-bottom: 0;
    }
    .orders-id-cell span {
      color: #178214;
      font-weight: 800;
      line-height: 1.45;
      display: inline-block;
      min-width: 112px;
      word-break: normal;
      overflow-wrap: anywhere;
    }
    .orders-customer {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .orders-customer-avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: #e6edd8;
      color: #4a5d45;
      font-size: 11px;
      font-weight: 800;
      flex: 0 0 auto;
    }
    .orders-customer-name {
      font-size: 14px;
      font-weight: 700;
      color: #223021;
    }
    .orders-customer-email {
      margin-top: 2px;
      font-size: 11px;
      color: #72806f;
    }
    .orders-date-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: #4d5d4b;
      font-size: 14px;
      min-width: 90px;
    }
    .orders-amount-cell {
      font-size: 14px;
      font-weight: 800;
      color: #233021;
      white-space: nowrap;
    }
    .orders-status-pill {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 0 10px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }
    .orders-status-pill.shipped { background: #afe58e; color: #33772b; }
    .orders-status-pill.processing { background: #c9f0a7; color: #2d7d26; }
    .orders-status-pill.delivered { background: #e7eddf; color: #5d6858; }
    .orders-status-pill.cancelled { background: #ffd9d5; color: #c43f35; }
    .orders-status-pill.pending { background: #fff0bf; color: #976a08; }
    .orders-status-pill.awaiting_payment { background: #ffe5b8; color: #9d6810; }
    .orders-row-actions {
      position: relative;
      display: inline-flex;
      justify-content: center;
      width: 100%;
    }
    .orders-more-button {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      border: 0;
      background: transparent;
      color: #657265;
      cursor: pointer;
      transition: background 0.18s ease, transform 0.18s ease;
    }
    .orders-more-button:hover {
      background: #eef4e2;
      transform: translateY(-1px);
    }
    .orders-row-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 160px;
      padding: 6px;
      border-radius: 12px;
      background: rgba(255,255,255,0.98);
      border: 1px solid rgba(171, 190, 150, 0.5);
      box-shadow: 0 16px 28px rgba(90, 109, 65, 0.14);
      z-index: 20;
    }
    .orders-row-menu button {
      width: 100%;
      border: 0;
      background: transparent;
      border-radius: 9px;
      padding: 10px 12px;
      text-align: left;
      color: #465f41;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .orders-row-menu button:hover {
      background: #eef6e4;
      color: #24752a;
    }
    .orders-empty {
      padding: 28px 18px;
      text-align: center;
      color: #687767;
      font-size: 14px;
    }
    .orders-pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 22px 18px;
      color: #677565;
      font-size: 13px;
    }
    .orders-pagination {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .orders-page-btn {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      border: 0;
      background: #fff;
      color: #566452;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    .orders-page-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: inset 0 0 0 1px rgba(25,126,24,0.12), 0 8px 16px rgba(92, 111, 70, 0.08);
    }
    .orders-page-btn.active {
      background: #1a7e19;
      color: #fff;
      box-shadow: none;
    }
    .orders-page-btn:disabled {
      opacity: 0.45;
      cursor: default;
    }
    .orders-page-dots {
      padding: 0 2px;
      color: #8c9889;
      font-weight: 700;
    }
    @media (max-width: 1200px) {
      .orders-grid {
        grid-template-columns: 1fr;
      }
      .orders-filterbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    @media (max-width: 760px) {
      .orders-filter-left {
        width: 100%;
      }
      .orders-filter-wrap,
      .orders-filter-button,
      .orders-date-filter {
        width: 100%;
      }
      .orders-pagination-bar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  return (
    <AdminShell
      activeHref="/admin/orders"
      title="Order Log"
      subtitle="Real-time agricultural supply chain fulfillment."
      searchPlaceholder="Search orders, customers..."
      userName="Admin User"
      userRole="Regional Manager"
      userLabel=""
      actions={<OrdersHeaderActions rows={rows} />}
    >
      <style>{css}</style>
      <div className="space-y-6">
        <div className="orders-grid">
          <div className="orders-stat-card">
            <div className="orders-stat-top">
              <div className="orders-stat-icon green"><IconTruck /></div>
              <div className="orders-stat-chip green">+12%</div>
            </div>
            <div className="orders-stat-label">Active Orders</div>
            <div className="orders-stat-value">{activeOrders.toLocaleString("en-US")}</div>
          </div>

          <div className="orders-stat-card">
            <div className="orders-stat-top">
              <div className="orders-stat-icon pink"><IconClipboard /></div>
              <div className="orders-stat-chip pink">Alert</div>
            </div>
            <div className="orders-stat-label">Pending Fulfillment</div>
            <div className="orders-stat-value">{pendingFulfillment.toLocaleString("en-US")}</div>
          </div>

          <div className="orders-stat-card">
            <div className="orders-stat-top">
              <div className="orders-stat-icon olive"><IconCash /></div>
              <div className="orders-stat-chip green">{growthLabel(revenueGrowth)}</div>
            </div>
            <div className="orders-stat-label">Gross Revenue (MTD)</div>
            <div className="orders-stat-value">{moneyCompact(grossRevenue)}</div>
          </div>
        </div>

        <section className="orders-panel">
          <OrdersTableClient initialRows={rows} totalCount={rows.length} />
        </section>
      </div>
    </AdminShell>
  );
}

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M3 7h11v8H3V7Zm11 3h3l2 2v3h-5v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.7" fill="currentColor" />
      <circle cx="17" cy="17" r="1.7" fill="currentColor" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M9 4.5h6l.8 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.2L9 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 9h.01M17 15h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
