import type { LocalProduct } from "@/lib/local-catalog";
import { ProductCard, productCardHtml } from "@/components/home/product-card";

export function featuredProductsGridHtml(products: LocalProduct[]) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      ${products.map(productCardHtml).join("")}
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
