import ShopBrowser from "./shop-browser";
import SiteFooter from "@/components/site-footer";
import { loadLocalCatalog } from "@/lib/local-catalog";

export const metadata = {
  title: "Shop | gofarm",
  description: "Browse the gofarm product catalog with filters, sorting, and product details.",
};

export default async function ShopPage() {
  const { products, categories } = await loadLocalCatalog();

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
      <main>
        <ShopBrowser
          products={products}
          categories={categories}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
