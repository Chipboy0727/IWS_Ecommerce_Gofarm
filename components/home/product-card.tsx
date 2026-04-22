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

function salePriceFor(product: LocalProduct) {
  return product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
}

// Icon Heart
function HeartIcon({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

// Icon Compare
function CompareIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

// Icon Share
function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

// Star Icon
function StarIcon({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
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
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <article className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <button type="button" onClick={() => setIsModalOpen(true)} className="block w-full text-left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-white">
              <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                <span className="inline-flex items-center rounded-full bg-gofarm-green px-3 py-1 text-xs font-semibold text-white shadow">
                  {status}
                </span>
                {product.discount ? (
                  <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
                    -{product.discount}%
                  </span>
                ) : null}
              </div>

              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </button>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
            <button
              type="button"
              onClick={handleWishlist}
              className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white"
              title="Add to wishlist"
            >
              <HeartIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white"
              title="Compare product"
            >
              <CompareIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white hover:scale-110 transition-all duration-300"
              title="Share product"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          <button type="button" onClick={() => setIsModalOpen(true)} className="block w-full text-left">
            <h3 className="text-[17px] font-bold text-gofarm-black leading-tight hover:text-gofarm-green transition-colors">
              {product.name}
            </h3>
          </button>

          <div className="mt-1 flex items-center gap-1 text-[12px] leading-none">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} filled={i < Math.round(product.rating)} />
            ))}
            <span className="text-gofarm-gray ml-1">({product.reviews})</span>
          </div>

          <div className="mt-2 flex items-end gap-2 flex-wrap">
            <span className="text-[22px] font-bold text-gofarm-green leading-none">{formatPrice(salePrice)}</span>
            {product.discount ? (
              <>
                <span className="text-[18px] font-semibold text-gray-500 line-through leading-none">
                  {formatPrice(product.price)}
                </span>
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">
                  -{product.discount}%
                </span>
              </>
            ) : null}
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 w-full rounded-md border border-gofarm-green/20 bg-gofarm-green text-white px-3 py-2 text-xs font-semibold hover:bg-gofarm-light-green transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </article>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
