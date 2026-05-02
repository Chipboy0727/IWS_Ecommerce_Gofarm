"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
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

// Toast Message Component
function ToastMessage({ productName, onClose }: { productName: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{productName} added to cart!</span>
      </div>
    </div>
  );
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

// HTML version for static generation
export function productCardHtml(product: LocalProduct) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const formattedSalePrice = formatPrice(salePrice);
  const formattedPrice = formatPrice(product.price);
  
  return `
    <div class="transform hover:scale-105 transition-transform duration-300 h-full">
      <article class="group relative rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-gray-100/50 h-full flex flex-col">
        <div class="relative">
          <a href="/shop/${product.slug}" class="block w-full text-left">
            <div class="relative aspect-square overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-white flex items-center justify-center p-2 sm:p-3 md:p-4">
              <div class="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2">
                <span class="w-fit inline-flex items-center rounded-full bg-gofarm-green px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">${status}</span>
                ${product.discount ? `<span class="w-fit inline-flex items-center rounded-full bg-red-500 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold text-white shadow">-${product.discount}%</span>` : ''}
              </div>
              <img src="${product.imageSrc}" class="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105" alt="${product.imageAlt || product.name}" loading="lazy" />
            </div>
          </a>
          <div class="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
            <button type="button" class="wishlist-btn p-1.5 sm:p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}" aria-label="Add to wishlist">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
            </button>
            <button type="button" class="share-btn p-1.5 sm:p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-slug="${product.slug}" aria-label="Share product">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
            </button>
          </div>
        </div>
        <div class="flex-1 flex flex-col p-2.5 sm:p-3 md:p-4">
          <a href="/shop/${product.slug}" class="block w-full text-left">
            <h3 class="text-sm sm:text-base font-bold text-gofarm-black leading-tight hover:text-gofarm-green transition-colors line-clamp-2 min-h-[40px] sm:min-h-[48px]">
              ${product.name}
            </h3>
          </a>
          <div class="mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
            ${Array.from({ length: 5 }, (_, index) => `<svg class="w-2 h-2 sm:w-2.5 sm:h-2.5 ${index < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}" viewBox="0 0 24 24" fill="${index < Math.round(product.rating) ? "currentColor" : "none"}" stroke="currentColor" strokeWidth="1.5"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>`).join('')}
            <span class="text-gray-500 ml-0.5 sm:ml-1">(${product.reviews})</span>
          </div>
          <div class="mt-2 flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span class="text-base sm:text-lg font-bold text-gofarm-green">${formattedSalePrice}</span>
            ${product.discount ? `<span class="text-xs sm:text-sm text-gray-400 line-through">${formattedPrice}</span>` : ''}
          </div>
          <button class="add-to-cart-btn mt-3 w-full rounded-lg border border-transparent bg-gofarm-green text-white px-2 py-1.5 text-[11px] sm:text-xs font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}">Add to Cart</button>
        </div>
      </article>
    </div>
  `;
}

// React Component version - ĐÃ SỬA RESPONSIVE
export function ProductCard({ product }: { product: LocalProduct }) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProductName, setToastProductName] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: salePrice,
        imageSrc: product.imageSrc,
        slug: product.slug,
      });
      setToastProductName(product.name);
      setShowToast(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: salePrice,
        imageSrc: product.imageSrc,
        slug: product.slug,
      });
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: `${window.location.origin}/shop/${product.slug}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/shop/${product.slug}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="transform hover:scale-105 transition-transform duration-300 h-full">
        <article className="group relative rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-gray-100/50 h-full flex flex-col">
          <div className="relative">
            <button type="button" onClick={handleQuickView} className="block w-full text-left">
              <div className="relative aspect-square overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-white flex items-center justify-center p-2 sm:p-3 md:p-4">
                <div className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2">
                  <span className="w-fit inline-flex items-center rounded-full bg-gofarm-green px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">
                    {status}
                  </span>
                  {(product.discount ?? 0) > 0 && (
                    <span className="w-fit inline-flex items-center rounded-full bg-red-500 px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </button>

            <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
              <button
                type="button"
                onClick={handleWishlist}
                className="p-1.5 sm:p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} filled={isWishlisted} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm bg-white/90 hover:bg-gofarm-green hover:text-white hover:scale-110 transition-all duration-300"
                title="Share product"
              >
                <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-2.5 sm:p-3 md:p-4">
            <button type="button" onClick={handleQuickView} className="block w-full text-left">
              <h3 className="text-sm sm:text-base font-bold text-gofarm-black leading-tight hover:text-gofarm-green transition-colors line-clamp-2 min-h-[40px] sm:min-h-[48px]">
                {product.name}
              </h3>
            </button>

            <div className="mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} filled={i < Math.round(product.rating)} />
              ))}
              <span className="text-gray-500 ml-0.5 sm:ml-1">({product.reviews})</span>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="text-base sm:text-lg font-bold text-gofarm-green">{formatPrice(salePrice)}</span>
              {(product.discount ?? 0) > 0 && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="mt-3 w-full rounded-lg border border-transparent bg-gofarm-green text-white px-2 py-1.5 text-[11px] sm:text-xs font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </article>
      </div>

      {showToast && (
        <ToastMessage productName={toastProductName} onClose={() => setShowToast(false)} />
      )}

      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}