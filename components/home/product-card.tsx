"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import type { LocalProduct } from "@/lib/local-catalog";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-2.5 h-2.5 ${filled ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function ToastMessage({ message, onClose }: { message: string; onClose: () => void }) {
  setTimeout(onClose, 2000);
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

// HTML version for static generation (giữ lại để tương thích)
export function productCardHtml(product: LocalProduct) {
  const salePrice = product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const formattedSalePrice = formatPrice(salePrice);
  const formattedPrice = formatPrice(product.price);
  
  return `
    <div class="transform hover:scale-105 transition-transform duration-300">
      <article class="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300" data-product-id="${product.id}">
        <a href="/shop/${product.slug}" class="block">
          <div class="relative h-52 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <img src="${product.imageSrc}" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt="${product.imageAlt || product.name}" loading="lazy" />
            <div class="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              <div class="inline-flex items-center rounded-md bg-gofarm-green text-white text-[10px] px-2 py-0.5 shadow-md font-semibold">${status}</div>
              ${product.discount ? `<div class="inline-flex items-center rounded-md bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md font-bold">-${product.discount}%</div>` : ''}
            </div>
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
              <button type="button" class="wishlist-btn p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}" aria-label="Add to wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="w-3 h-3"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
              </button>
              <button type="button" class="share-btn p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-slug="${product.slug}" aria-label="Share product">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="w-3 h-3"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
              </button>
            </div>
          </div>
          <div class="p-2 space-y-1">
            <h2 class="text-xs font-semibold line-clamp-1 mb-0.5 group-hover:text-gofarm-green transition-colors">${product.name}</h2>
            <div class="flex items-center gap-1">
              <div class="flex items-center">
                ${Array.from({ length: 5 }, (_, index) => `<svg class="w-2.5 h-2.5 ${index < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}" viewBox="0 0 24 24" fill="${index < Math.round(product.rating) ? "currentColor" : "none"}" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>`).join('')}
              </div>
              <span class="text-[9px] text-gofarm-gray">(${product.reviews})</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="text-gofarm-green text-sm font-bold">${formattedSalePrice}</span>
                ${product.discount ? `<span class="text-[10px] text-gray-400 line-through">${formattedPrice}</span>` : ''}
              </div>
            </div>
          </div>
        </a>
        <button class="add-to-cart-btn w-full rounded-md bg-gofarm-green text-white px-2 py-1.5 text-[10px] font-semibold hover:bg-gofarm-light-green transition-colors mx-2 mb-2" style="width: calc(100% - 16px)" data-product-id="${product.id}" data-product-name="${product.name.replace(/'/g, "\\'")}" data-product-price="${salePrice}" data-product-image="${product.imageSrc}" data-product-slug="${product.slug}">Add to Cart</button>
      </article>
    </div>
  `;
}

// React Component version
export function ProductCard({ product }: { product: LocalProduct }) {
  const salePrice = product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartToast, setShowCartToast] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      imageSrc: product.imageSrc,
      slug: product.slug,
    });
    setShowCartToast(true);
    setIsAddingToCart(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      setShowWishlistToast(true);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: salePrice,
        imageSrc: product.imageSrc,
        slug: product.slug,
      });
      setIsWishlisted(true);
      setShowWishlistToast(true);
    }
  };

  return (
    <>
      <div className="transform hover:scale-105 transition-transform duration-300">
        <article className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300" data-product-id={product.id}>
          <Link href={`/shop/${product.slug}`} className="block">
            <div className="relative h-52 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
              <img src={product.imageSrc} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" alt={product.imageAlt} loading="lazy" />
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                <div className="inline-flex items-center rounded-md bg-gofarm-green text-white text-[10px] px-2 py-0.5 shadow-md font-semibold">{status}</div>
                {product.discount && <div className="inline-flex items-center rounded-md bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md font-bold">-{product.discount}%</div>}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
                <button type="button" onClick={handleWishlist} className={`p-1.5 rounded-full shadow-lg border backdrop-blur-sm hover:scale-110 transition-all duration-300 ${isWishlisted ? 'bg-gofarm-green text-white border-gofarm-green' : 'bg-white/90 text-gofarm-gray border-gofarm-green/20 hover:bg-gofarm-green hover:text-white'}`} aria-label="Add to wishlist">
                  <HeartIcon filled={isWishlisted} />
                </button>
                <button type="button" className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white" aria-label="Share product">
                  <ShareIcon />
                </button>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <h2 className="text-xs font-semibold line-clamp-1 mb-0.5 group-hover:text-gofarm-green transition-colors">{product.name}</h2>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (<StarIcon key={index} filled={index < Math.round(product.rating)} />))}
                </div>
                <span className="text-[9px] text-gofarm-gray">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-gofarm-green text-sm font-bold">{formatPrice(salePrice)}</span>
                  {product.discount && <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
                </div>
              </div>
            </div>
          </Link>
          <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full rounded-md bg-gofarm-green text-white px-2 py-1.5 text-[10px] font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50 mx-2 mb-2" style={{ width: 'calc(100% - 16px)' }}>
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </article>
      </div>
      {showCartToast && <ToastMessage message="Added to cart!" onClose={() => setShowCartToast(false)} />}
      {showWishlistToast && <ToastMessage message={isWishlisted ? "Added to wishlist!" : "Removed from wishlist!"} onClose={() => setShowWishlistToast(false)} />}
    </>
  );
}