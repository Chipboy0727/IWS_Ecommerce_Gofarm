
import type { LocalProduct } from "@/lib/local-catalog";
import { productCardHtmlServer } from "@/lib/product-card-html";
import { ProductCard } from "@/components/home/product-card";

export function featuredProductsGridHtml(products: LocalProduct[]) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(productCardHtmlServer).join("")}
    </div>
  `;
}

export function FeaturedProductsGrid({ products }: { products: LocalProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}