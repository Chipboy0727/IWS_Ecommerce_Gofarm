"use client";

import { ProductCard as SharedProductCard } from "@/components/home/product-card";
import type { LocalProduct } from "@/lib/local-catalog";

interface ProductCardProps {
  product: LocalProduct;
  onShare?: (product: LocalProduct) => void;
  onQuickView?: (product: LocalProduct) => void;
}

export default function ProductCard({ product, onShare }: ProductCardProps) {
  return <SharedProductCard product={product} onShare={onShare} />;
}

