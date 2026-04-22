"use client";

import { useState } from "react";
import type { LocalProduct } from "@/lib/local-catalog";
import { ProductModal } from "@/components/product-modal";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export function productCardHtml(product: LocalProduct) {
  const salePrice =
    product.discount && product.discount > 0
      ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
      : product.price;
  const stars = Array.from({ length: 5 }, (_, index) => index < Math.round(product.rating));
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";

  return `
    <article class="group rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative h-[330px] bg-white flex items-center justify-center overflow-hidden px-4 pt-4">
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gofarm-green text-white shadow">${product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New"}</span>
          ${
            product.discount
              ? `<span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow">-${product.discount}%</span>`
              : ""
          }
        </div>
        <img
          src="${product.imageSrc}"
          alt="${product.imageAlt}"
          class="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_22px_22px_rgba(0,0,0,0.08)]"
          loading="lazy"
        >
        <div class="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-.06-.06a5.5 5.5 0 0 0-7.78 7.78l.06.06L12 21l7.78-7.55.06-.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </button>
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Compare product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path d="M16 3h5v5" />
              <path d="M4 20 20 4" />
              <path d="M8 21H3v-5" />
            </svg>
          </button>
          <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gofarm-green hover:text-gofarm-green" aria-label="Share product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51 15.42 17.49" />
              <path d="M15.41 6.51 8.59 10.49" />
            </svg>
          </button>
        </div>
      </div>
      <div class="px-4 pb-4 pt-2">
        <h4 class="text-[17px] font-bold text-gofarm-black leading-tight mb-1 line-clamp-1">${product.name}</h4>
        <div class="flex items-center gap-1 text-[12px] leading-none">
          ${stars.map((active) => `<span class="${active ? "text-yellow-400" : "text-gray-300"}">&#9733;</span>`).join("")}
          <span class="ml-1 text-gofarm-gray">(${product.reviews})</span>
        </div>
        <div class="flex items-end gap-2 mt-2 mb-4 flex-nowrap">
          <span class="text-[22px] font-bold text-gofarm-green leading-none">${formatPrice(salePrice)}</span>
          ${
            product.discount
              ? `<span class="text-[18px] font-semibold text-gray-500 line-through leading-none">${formatPrice(product.price)}</span>`
              : ""
          }
          ${
            product.discount
              ? `<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">-${product.discount}%</span>`
              : ""
          }
        </div>
      </div>
        <button class="w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-3 text-[15px] font-semibold text-gofarm-black whitespace-nowrap transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>&#128722;</span>
          <span>Add to Cart</span>
        </button>
    </article>
  `;
}

export function ProductCard({ product }: { product: LocalProduct }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        dangerouslySetInnerHTML={{ __html: productCardHtml(product) }} 
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          setIsModalOpen(true);
        }}
        className="cursor-pointer"
      />
      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
