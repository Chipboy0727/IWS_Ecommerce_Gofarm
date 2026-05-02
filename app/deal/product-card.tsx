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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

interface ProductCardProps {
  product: LocalProduct;
  onShare?: (product: LocalProduct) => void;
  onQuickView?: (product: LocalProduct) => void;
}

export default function ProductCard({ product, onShare, onQuickView }: ProductCardProps) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "Hot";
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

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
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
    if (onShare) {
      onShare(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <>
      <div className="transform hover:scale-105 transition-transform duration-300">
        <article className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300" data-product-id={product.id}>
          <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden bg-white flex items-center justify-center p-2 sm:p-3 md:p-4">
            <button type="button" onClick={handleQuickView} className="block h-full w-full">
              <img
                src={product.imageSrc}
                className="max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-all duration-500 group-hover:scale-105"
                alt={product.imageAlt}
                loading="lazy"
              />
            </button>

            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              <div className="w-fit inline-flex items-center rounded-md bg-red-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md font-semibold">
                {status}
              </div>
              {product.discount ? (
                <div className="w-fit inline-flex items-center rounded-md bg-red-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md font-bold">
                  -{product.discount}%
                </div>
              ) : null}
            </div>

            {/* Nút Wishlist và Share - NỀN TRẮNG, KHÔNG VIỀN */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
              <button
                type="button"
                onClick={handleWishlist}
                className="p-1.5 sm:p-2 rounded-full shadow-md hover:scale-110 transition-all duration-300 bg-white"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} filled={isWishlisted} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-full shadow-md hover:scale-110 transition-all duration-300 bg-white hover:text-red-500"
                title="Share product"
                aria-label="Share product"
              >
                <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            <Link href={`/shop/${product.slug}`} onClick={handleProductClick} className="block w-full text-left">
              <h2 className="text-xs sm:text-sm font-semibold line-clamp-1 mb-0.5 sm:mb-1 group-hover:text-gofarm-green transition-colors leading-tight">
                {product.name}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon key={index} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${index < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-[8px] sm:text-[10px] text-gofarm-gray">({product.reviews})</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-5">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-gofarm-green text-xs sm:text-base font-bold">{formatPrice(salePrice)}</span>
                {product.discount ? (
                  <span className="line-through text-zinc-500 text-[10px] sm:text-base font-bold">{formatPrice(product.price)}</span>
                ) : null}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full rounded-md border border-gofarm-green/20 bg-gofarm-green text-white px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </article>
      </div>

      {showToast && (
        <ToastMessage 
          productName={toastProductName} 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}