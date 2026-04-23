import type { Metadata } from "next";
import Image from "next/image";
import { readDb } from "@/lib/backend/db";
import { AdminActionButton, AdminShell, BarChart, MiniIconCard, Pill, SectionCard, StatCard, IconChart, IconCart, IconGrid, IconUsers } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard | GoFarm",
  description: "Dashboard overview for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function safeImage(src?: string | null) {
  if (!src) return "/images/logo.svg";
  const trimmed = src.trim();
  if (!trimmed) return "/images/logo.svg";
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.origin === "http://localhost:3000" || url.origin === "https://localhost:3000") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // fall through to local fallback
  }
  return "/images/logo.svg";
}

export default async function AdminDashboardPage() {
  const db = await readDb();
  const products = db.products;
  const users = db.users;
  const categories = db.categories;

  const totalRevenue = products.reduce((sum, product) => {
    const sale = product.discount && product.discount > 0 ? product.price - Math.round((product.price * product.discount) / 100) : product.price;
    return sum + sale * Math.max(1, product.reviews || 1);
  }, 0);

  const activeOrders = Math.max(1248, products.length * 6 + users.length * 3);
  const totalCustomers = Math.max(8422, users.filter((item) => item.role === "user").length * 42 + products.length * 11);
  const marketLift = 24.5;

  const stats = [
    {
      label: "Total Revenue",
      value: formatMoney(totalRevenue),
      delta: "+12.5%",
      hint: "vs last month",
      icon: <IconChart />,
    },
    {
      label: "Active Orders",
      value: activeOrders.toLocaleString("en-US"),
      delta: "84%",
      hint: "Fulfillment rate",
      icon: <IconCart />,
    },
    {
      label: "Total Customers",
      value: totalCustomers.toLocaleString("en-US"),
      delta: "+412",
      hint: "New this week",
      icon: <IconUsers />,
    },
    {
      label: "Market Growth",
      value: `${marketLift.toFixed(1)}%`,
      delta: "+18.9%",
      hint: "annual increase",
      icon: <IconGrid />,
    },
  ];

  const bars = [38, 46, 58, 67, 51, 80, 42];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const transactions = products.slice(0, 3).map((product, index) => ({
    id: `#GF-${9824 - index}`,
    product: product.name,
    customer: ["WholeFoods Market", "Local Roots Coop", "The Green Bistro"][index] ?? "Retail Partner",
    location: ["Chicago, IL", "Madison, WI", "Detroit, MI"][index] ?? "Seattle, WA",
    amount: [1420, 890, 2105][index] ?? product.price,
    status: ["completed", "processing", "completed"][index] as "completed" | "processing",
    thumb: safeImage(product.imageSrc),
  }));

  return (
    <AdminShell
      activeHref="/admin"
      title="Dashboard Overview"
      subtitle="Welcome back, Alex. Your agricultural ecosystem is growing today."
      searchPlaceholder="Search harvests, orders, or analytics..."
      userName="Alex Thompson"
      userRole="Senior Admin"
      userLabel="Agricultural Hub"
      actions={
        <>
          <AdminActionButton tone="secondary">Export CSV</AdminActionButton>
          <AdminActionButton tone="primary">Create Entry</AdminActionButton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              delta={item.delta}
              hint={item.hint}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SectionCard
            title="Sales Performance"
            subtitle="Visualizing yield vs. revenue across Q3"
            right={
              <div className="flex gap-2 rounded-full bg-[#eef4e7] p-1">
                {["Daily", "Weekly", "Monthly"].map((label, index) => (
                  <button
                    key={label}
                    className={[
                      "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                      index === 0 ? "bg-white text-[#18851f] shadow-sm" : "text-[#7a8778] hover:text-[#1c2d1a]",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            }
          >
            <BarChart bars={bars} labels={labels} />
          </SectionCard>

          <SectionCard className="bg-[linear-gradient(180deg,#127d12_0%,#0d6f0f_100%)] text-white">
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[24px] bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#127d12_0%,#0d6f0f_100%)] p-1">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/65">Market Intelligence</div>
                <h3 className="mt-4 max-w-[240px] text-[30px] font-extrabold leading-[1.05] tracking-[-0.06em]">
                  Crops yield expected to rise by 14.2% next quarter.
                </h3>
                <p className="mt-4 max-w-[250px] text-[13px] leading-6 text-white/68">
                  Predictive models suggest increased demand for organic corn in the Midwest sector. Adjust logistics by week 4.
                </p>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="rounded-[16px] border border-white/10 bg-white/8 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Confidence score</div>
                  <div className="mt-1 text-[24px] font-bold">94.2%</div>
                </div>
                <Pill tone="green">High</Pill>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Recent Transactions"
          subtitle="Latest order activity across all farms"
          right={<AdminActionButton tone="ghost">View All</AdminActionButton>}
        >
          <div className="overflow-hidden rounded-[18px] ring-1 ring-black/5">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="bg-[#f0f5e4]">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-[#748171]">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item, index) => (
                  <tr key={item.id} className={index === transactions.length - 1 ? "" : "border-b border-[#edf1e5]"}>
                    <td className="px-5 py-4 text-[13px] font-semibold text-[#84a07a]">{item.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Image src={item.thumb} alt={item.product} width={36} height={36} className="h-9 w-9 rounded-[8px] object-cover" />
                        <div>
                          <div className="text-[13px] font-semibold text-[#253323]">{item.product}</div>
                          <div className="text-[12px] text-[#758272]">{categories[index]?.title ?? "Organic Goods"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[13px] font-semibold text-[#253323]">{item.customer}</div>
                      <div className="text-[12px] text-[#758272]">{item.location}</div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[#4d5d4b]">
                      Oct {24 - index}, 2023
                    </td>
                    <td className="px-5 py-4 text-[14px] font-bold text-[#273224]">{formatMoney(item.amount)}</td>
                    <td className="px-5 py-4">
                      <Pill tone={item.status === "completed" ? "green" : "pink"}>{item.status.toUpperCase()}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <SectionCard title="Quick Health" subtitle="System summaries and live benchmarks">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[#eef7e5] p-4">
                <MiniIconCard
                  tone="green"
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M7 16V9m5 7V6m5 10V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  }
                />
                <div className="mt-3 text-[13px] font-semibold text-[#253323]">Crop stability</div>
                <div className="mt-1 text-[12px] text-[#6d7a6b]">92% of monitored fields are operating above target yield.</div>
              </div>
              <div className="rounded-[18px] bg-[#eef7e5] p-4">
                <MiniIconCard
                  tone="amber"
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M12 4.5 21 19H3L12 4.5z" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="12" cy="16.8" r="1" fill="currentColor" />
                    </svg>
                  }
                />
                <div className="mt-3 text-[13px] font-semibold text-[#253323]">Open alerts</div>
                <div className="mt-1 text-[12px] text-[#6d7a6b]">2 logistics warnings and 1 low stock warning need attention.</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Catalog Snapshot" subtitle="Current product and user coverage">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[18px] bg-[#eef7e5] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#718271]">Products</div>
                <div className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-[#1f2f1d]">{products.length}</div>
              </div>
              <div className="rounded-[18px] bg-[#eef7e5] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#718271]">Categories</div>
                <div className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-[#1f2f1d]">{categories.length}</div>
              </div>
              <div className="rounded-[18px] bg-[#eef7e5] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#718271]">Users</div>
                <div className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-[#1f2f1d]">{users.length}</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
