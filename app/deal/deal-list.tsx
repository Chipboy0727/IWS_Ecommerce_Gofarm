"use client";

import { useState } from "react";
import ProductCard from "./product-card";
import { ProductModal } from "@/components/product-modal";
import type { LocalProduct } from "@/lib/local-catalog";

export default function DealList({ products }: { products: LocalProduct[] }) {
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}