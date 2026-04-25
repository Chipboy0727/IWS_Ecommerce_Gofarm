import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard, StatCard, IconBox, IconPackage, IconChart } from "@/components/admin/admin-shell";
import { readDb } from "@/lib/backend/db";

export const metadata: Metadata = {
  title: "Product Management | GoFarm",
  description: "Product management screen for GoFarm admin.",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function salePrice(price: number, discount: number | null) {
  if (!discount || discount <= 0) return price;
  return Math.max(0, price - Math.round((price * discount) / 100));
}

function stockTone(stock: number | null) {
  if (stock === null) return "gray" as const;
  if (stock <= 10) return "red" as const;
  if (stock <= 25) return "amber" as const;
  return "green" as const;
}

function stockLabel(stock: number | null) {
  if (stock === null) return "UNTRACKED";
  if (stock <= 10) return "LOW";
  if (stock <= 25) return "WATCH";
  return "HEALTHY";
}

export default async function ProductsPage() {
  const db = await readDb();
  const products = [...db.products].sort((a, b) => {
    const updatedA = Date.parse(a.updatedAt ?? a.createdAt ?? "") || 0;
    const updatedB = Date.parse(b.updatedAt ?? b.createdAt ?? "") || 0;
    return updatedB - updatedA;
  });

  const activeProducts = products.length.toLocaleString("en-US");
  const lowStockCount = products.filter((product) => typeof product.stock === "number" && product.stock <= 10).length;
  const categoryCount = new Set(products.map((product) => product.categoryTitle || "Uncategorized")).size;
  const avgRating = products.length > 0
    ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
    : "0.0";

  return (
    <AdminShell
      activeHref="/admin/products"
      title="Product Management"
      subtitle="Browse the live product catalog, review pricing, and monitor stock health."
      searchPlaceholder="Search products, brands, categories..."
      userName="Admin User"
      userRole="Catalog Manager"
      userLabel="GoFarm Central"
      actions={
        <>
          <AdminActionButton tone="secondary">Export Catalog</AdminActionButton>
          <AdminActionButton tone="primary">Add Product</AdminActionButton>
        </>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Products" value={activeProducts} delta="Live" deltaTone="green" hint="in catalog" icon={<IconPackage />} />
          <StatCard label="Low Stock" value={String(lowStockCount)} delta="Action" deltaTone="red" hint="needs restock" icon={<IconBox />} />
          <StatCard label="Categories" value={String(categoryCount)} delta="Catalog" deltaTone="emerald" hint="active groups" icon={<IconChart />} />
          <StatCard label="Avg Rating" value={avgRating} delta="Quality" deltaTone="pink" hint="customer feedback" />
        </div>

        <SectionCard
          title="Live Product Catalog"
          subtitle="Current products from the backend database"
          className="overflow-hidden"
          right={<div className="text-[11px] sm:text-[12px] font-semibold text-[#0b7312]">Showing {products.length.toLocaleString("en-US")} items</div>}
        >
          <div className="overflow-hidden rounded-b-[18px] ring-1 ring-black/5">
            <div className="max-h-[420px] overflow-auto">
            <table className="page-table min-w-[900px] sm:min-w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const tone = stockTone(product.stock);
                  const currentPrice = salePrice(product.price, product.discount);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-row">
                          <img src={product.imageSrc} alt={product.imageAlt} className="product-thumb" />
                          <div>
                            <div className="text-[13px] font-semibold text-[#253323]">{product.name}</div>
                            <div className="text-[12px] text-[#758272]">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-muted">{product.categoryTitle ?? "Uncategorized"}</td>
                      <td className="table-muted">{product.brand ?? "No brand"}</td>
                      <td>
                        <div className="text-[13px] font-semibold text-[#253323]">{formatMoney(currentPrice)}</div>
                        {product.discount ? (
                          <div className="text-[12px] text-[#758272] line-through">{formatMoney(product.price)}</div>
                        ) : null}
                      </td>
                      <td className="table-muted">
                        {product.rating.toFixed(1)} ({product.reviews})
                      </td>
                      <td className="table-muted">{product.stock ?? "n/a"}</td>
                      <td>
                        <Pill tone={tone}>{stockLabel(product.stock)}</Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
