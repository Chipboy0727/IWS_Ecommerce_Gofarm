"use client";

import { useState, useEffect, useRef } from "react";
import type { LocalProduct } from "@/lib/local-catalog";
import { useCart } from "@/app/context/cart-context";

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

export function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: LocalProduct | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("1 kg");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock multiple images for the gallery
  const mockImages = product ? [
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc
  ] : [];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -100 : 100, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      document.body.style.overflow = "hidden";
      setQuantity(1);
      setActiveTab("description");
      const juice = product.categoryTitle === "Juices" || product.categoryId === "b94b8866-d978-40cc-8641-1e138cfced28";
      setSelectedWeight(juice ? "1 Bottle" : "1 kg");
      setActiveImageIndex(0);
      setIsSuccess(false);
    } else if (!isOpen) {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          id: `${product.id}-${selectedWeight}`, // Unique ID for different weights
          name: `${product.name} (${selectedWeight})`,
          price: currentUnitSalePrice,
          imageSrc: product.imageSrc,
          slug: product.slug,
        });
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isJuice = product.categoryTitle === "Juices" || product.categoryId === "b94b8866-d978-40cc-8641-1e138cfced28";
  const unitLabel = isJuice ? "Select Pack Size" : "Select Weight";
  const units = isJuice ? ["1 Bottle", "2 Bottles", "6 Bottles (Pack)", "12 Bottles (Case)"] : ["500g", "1 kg", "2 kg", "5 kg"];

  const getWeightMultiplier = (value: string) => {
    if (isJuice) {
      const numMatch = value.match(/(\d+)/);
      return numMatch ? parseInt(numMatch[1]) : 1;
    }
    if (value === "500g") return 0.5;
    if (value.includes("kg")) {
      const val = parseFloat(value.replace(" kg", ""));
      return isNaN(val) ? 1 : val;
    }
    return 1;
  };

  const weightMultiplier = getWeightMultiplier(selectedWeight);
  const currentUnitSalePrice = salePrice * weightMultiplier;
  const currentUnitOriginalPrice = product.price * weightMultiplier;
  const totalPrice = currentUnitSalePrice * quantity;
  const totalOriginalPrice = currentUnitOriginalPrice * quantity;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gofarm-green hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
            {/* Top Section: Image & Basic Info */}
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
              {/* Product Image */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4 relative">
                <div className="relative aspect-square rounded-2xl bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center border border-gray-100 overflow-hidden group">
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                    <span className="inline-flex items-center rounded-md bg-gofarm-green px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                      {status}
                    </span>
                    {product.discount ? (
                      <span className="inline-flex items-center rounded-md bg-red-500 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                        -{product.discount}%
                      </span>
                    ) : null}
                  </div>
                  <img
                    src={mockImages[activeImageIndex] || product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-contain drop-shadow-xl transition-opacity duration-300"
                  />

                  {/* Thumbnails Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-20">
                    <div className="relative bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
                      {/* Left Arrow */}
                      <button
                        onClick={() => scroll("left")}
                        className="flex shrink-0 items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-gofarm-gray hover:bg-gofarm-green hover:text-white shadow-md border border-gray-200 transition-all hover:scale-105"
                        aria-label="Previous images"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>

                      {/* Thumbnails List */}
                      <div
                        ref={scrollRef}
                        className="flex-1 flex gap-3 overflow-x-auto snap-x no-scrollbar scroll-smooth"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {mockImages.map((src, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl p-1 sm:p-1.5 cursor-pointer transition-all snap-center ${activeImageIndex === idx
                                ? "border-2 border-gofarm-green bg-white shadow-sm scale-105"
                                : "border-2 border-transparent hover:border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            <img src={src} alt="Thumbnail" className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>

                      {/* Right Arrow */}
                      <button
                        onClick={() => scroll("right")}
                        className="flex shrink-0 items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-gofarm-gray hover:bg-gofarm-green hover:text-white shadow-md border border-gray-200 transition-all hover:scale-105"
                        aria-label="Next images"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gofarm-black mb-2">{product.name}</h2>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-8 h-8 sm:w-10 sm:h-10 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gofarm-gray">{product.reviews} Reviews</span>
                </div>

                <div className="flex items-end gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gofarm-green">{formatPrice(totalPrice)}</span>
                  {product.discount ? (
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-400 line-through mb-0.5 sm:mb-1">{formatPrice(totalOriginalPrice)}</span>
                  ) : null}
                </div>

                {/* Weight Selection */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xs sm:text-sm font-bold text-gofarm-black mb-2 sm:mb-3 uppercase tracking-wider">{unitLabel}</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {units.map(unit => (
                      <button
                        key={unit}
                        onClick={() => setSelectedWeight(unit)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${selectedWeight === unit
                            ? "border-gofarm-green bg-gofarm-green/10 text-gofarm-green"
                            : "border-gray-200 text-gray-600 hover:border-gofarm-green"
                          }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                  {/* Quantity */}
                  <div className="flex items-center justify-center border-2 border-gray-200 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gofarm-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gofarm-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isSuccess}
                    className={`flex-1 text-white font-bold text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isSuccess ? "bg-emerald-500 shadow-emerald-500/30" : "bg-gofarm-green hover:bg-gofarm-light-green shadow-gofarm-green/30"
                    }`}
                  >
                    {isSuccess ? "Added ✓" : isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 text-gofarm-green flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Free Delivery</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Section: Tabs */}
            <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 border-b border-gray-200 mb-6 sm:mb-8">
                {["description", "additional information", "reviews"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 sm:pb-4 text-sm sm:text-base lg:text-lg font-bold capitalize transition-all ${
                      activeTab === tab 
                        ? "text-gofarm-green underline decoration-2 underline-offset-[12px] sm:underline-offset-[16px]" 
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {activeTab === "description" && (
                  <div className="prose max-w-none text-gray-600">
                    <p className="text-sm sm:text-base leading-relaxed">{product.description || "No description available for this product."}</p>
                  </div>
                )}
                {activeTab === "additional information" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex border-b border-gray-100 py-2.5 sm:py-3">
                      <span className="w-1/3 font-bold text-gray-900 text-sm sm:text-base">Origin</span>
                      <span className="text-gray-600 text-sm sm:text-base">{product.origin || "Unknown"}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-2.5 sm:py-3">
                      <span className="w-1/3 font-bold text-gray-900 text-sm sm:text-base">Category</span>
                      <span className="text-gray-600 text-sm sm:text-base">{product.categoryTitle || "Uncategorized"}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-2.5 sm:py-3">
                      <span className="w-1/3 font-bold text-gray-900 text-sm sm:text-base">SKU</span>
                      <span className="text-gray-600 text-sm sm:text-base">{product.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-2.5 sm:py-3">
                      <span className="w-1/3 font-bold text-gray-900 text-sm sm:text-base">Stock</span>
                      <span className="text-gray-600 text-sm sm:text-base">{product.stock !== null ? `${product.stock} items` : "In Stock"}</span>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gofarm-black">{product.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-12 h-12" fill={i < Math.round(product.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < Math.round(product.rating) ? 0 : 2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">Based on {product.reviews} reviews</span>
                      </div>
                    </div>
                    {/* Mock Reviews List */}
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { id: 1, name: "John Doe", date: "October 12, 2025", rating: 5, comment: "Absolutely love this product! The quality is outstanding and delivery was super fast. Highly recommended." },
                        { id: 2, name: "Sarah Smith", date: "September 28, 2025", rating: 4, comment: "Great value for the price. The packaging was a bit dented, but the item itself is perfect." },
                        { id: 3, name: "Michael Johnson", date: "August 15, 2025", rating: 5, comment: "Exactly what I was looking for. Will definitely be purchasing from GoFarm again!" }
                      ].map(review => (
                        <div key={review.id} className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gofarm-green/10 text-gofarm-green rounded-full flex items-center justify-center font-bold text-sm sm:text-lg">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gofarm-black text-sm sm:text-base">{review.name}</h4>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex text-yellow-400">
                               {[...Array(5)].map((_, i) => (
                                 <svg key={i} className="w-8 h-8" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < review.rating ? 0 : 2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                 </svg>
                               ))}
                             </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
