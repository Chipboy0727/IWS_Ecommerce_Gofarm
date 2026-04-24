"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import type { LocalProduct } from "@/lib/local-catalog";

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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("1 kg");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        const weightMultiplier = getWeightMultiplier(selectedWeight);
        const currentUnitSalePrice = salePriceFor(product) * weightMultiplier;
        
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
        setQuantity(1);
      }, 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -100 : 100, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-gofarm-green rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link href="/shop" className="inline-block bg-gofarm-green text-white px-6 py-3 rounded-lg hover:bg-gofarm-light-green">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const mockImages = [
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc,
    product.imageSrc
  ];
  const weights = ["500g", "1 kg", "2 kg", "5 kg"];

  const getWeightMultiplier = (weight: string) => {
    if (weight === "500g") return 0.5;
    if (weight.includes("kg") || weight.includes("1 kg")) {
      const value = parseFloat(weight.replace(" kg", ""));
      return isNaN(value) ? 1 : value;
    }
    return 1;
  };

  const weightMultiplier = getWeightMultiplier(selectedWeight);
  const currentUnitSalePrice = salePrice * weightMultiplier;
  const currentUnitOriginalPrice = product.price * weightMultiplier;
  const totalPrice = currentUnitSalePrice * quantity;
  const totalOriginalPrice = currentUnitOriginalPrice * quantity;


  return (
    <main className="min-h-screen bg-linear-to-br from-white via-white to-gofarm-light-orange/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-gofarm-green">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gofarm-green">Shop</Link>
            <span>/</span>
            <span className="text-gofarm-green font-semibold">{product.name}</span>
          </div>

          {/* Product Detail Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Product Image */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl bg-gray-50 p-8 flex items-center justify-center border border-gray-100 overflow-hidden group">
                  <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                    <span className="inline-flex items-center rounded-md bg-gofarm-green px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {status}
                    </span>
                    {product.discount ? (
                      <span className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        -{product.discount}%
                      </span>
                    ) : null}
                  </div>
                  <img
                    src={mockImages[activeImageIndex] || product.imageSrc}
                    alt={product.imageAlt || product.name}
                    className="w-full h-full object-contain drop-shadow-xl transition-opacity duration-300"
                  />
                </div>

                {/* Thumbnails */}
                <div className="relative bg-white rounded-2xl p-3 flex items-center gap-3 shadow-md border border-gray-100">
                  <button
                    onClick={() => scroll("left")}
                    className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-gofarm-gray hover:bg-gofarm-green hover:text-white shadow-md border border-gray-200 transition-all hover:scale-105"
                    aria-label="Previous images"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div
                    ref={scrollRef}
                    className="flex-1 flex gap-3 overflow-x-auto snap-x no-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {mockImages.map((src, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`shrink-0 w-16 h-16 rounded-xl p-1.5 cursor-pointer transition-all snap-center ${
                          activeImageIndex === idx
                            ? "border-2 border-gofarm-green bg-white shadow-sm scale-105"
                            : "border-2 border-transparent hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <img src={src} alt="Thumbnail" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => scroll("right")}
                    className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-gofarm-gray hover:bg-gofarm-green hover:text-white shadow-md border border-gray-200 transition-all hover:scale-105"
                    aria-label="Next images"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h1 className="text-4xl font-extrabold text-gofarm-black mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gofarm-gray">({product.reviews} Reviews)</span>
                </div>

                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-extrabold text-gofarm-green">{formatPrice(totalPrice)}</span>
                  {product.discount ? (
                    <span className="text-xl font-bold text-gray-400 line-through mb-1">{formatPrice(totalOriginalPrice)}</span>
                  ) : null}
                </div>

                {/* Weight Selection */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gofarm-black mb-3 uppercase tracking-wider">Select Weight</h3>
                  <div className="flex flex-wrap gap-3">
                    {weights.map(weight => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedWeight === weight
                            ? "border-gofarm-green bg-gofarm-green/10 text-gofarm-green"
                            : "border-gray-200 text-gray-600 hover:border-gofarm-green"
                        }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  {/* Quantity */}
                  <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gofarm-black transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gofarm-black transition-colors"
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
                    className={`flex-1 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isSuccess ? "bg-emerald-500 shadow-emerald-500/30" : "bg-gofarm-green hover:bg-gofarm-light-green shadow-gofarm-green/30"
                    }`}
                  >
                    {isSuccess ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {isSuccess ? "Added ✓" : isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-700">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-gofarm-green flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-700">Free Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex gap-8 border-b border-gray-200 mb-8 flex-wrap">
                {["description", "additional information", "reviews"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-lg font-bold capitalize transition-all ${
                      activeTab === tab
                        ? "text-gofarm-green underline decoration-2 underline-offset-[16px]"
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
                    <p className="text-base leading-relaxed">{product.description || "No description available for this product."}</p>
                  </div>
                )}
                {activeTab === "additional information" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex border-b border-gray-100 py-3">
                      <span className="w-1/3 font-bold text-gray-900">Brand</span>
                      <span className="text-gray-600">{product.brand || "Unbranded"}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-3">
                      <span className="w-1/3 font-bold text-gray-900">Category</span>
                      <span className="text-gray-600">{product.categoryTitle || "Uncategorized"}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-3">
                      <span className="w-1/3 font-bold text-gray-900">SKU</span>
                      <span className="text-gray-600">{product.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex border-b border-gray-100 py-3">
                      <span className="w-1/3 font-bold text-gray-900">Stock</span>
                      <span className="text-gray-600">{product.stock !== null ? `${product.stock} items` : "In Stock"}</span>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-5xl font-extrabold text-gofarm-black">{product.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5"
                              fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={i < Math.round(product.rating) ? 0 : 2}
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Based on {product.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          id: 1,
                          name: "John Doe",
                          date: "October 12, 2025",
                          rating: 5,
                          comment: "Absolutely love this product! The quality is outstanding and delivery was super fast. Highly recommended."
                        },
                        {
                          id: 2,
                          name: "Sarah Smith",
                          date: "September 28, 2025",
                          rating: 4,
                          comment: "Great value for the price. The packaging was a bit dented, but the item itself is perfect."
                        },
                        {
                          id: 3,
                          name: "Michael Johnson",
                          date: "August 15, 2025",
                          rating: 5,
                          comment: "Exactly what I was looking for. Will definitely be purchasing from GoFarm again!"
                        }
                      ].map(review => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gofarm-green/10 text-gofarm-green rounded-full flex items-center justify-center font-bold text-lg">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gofarm-black">{review.name}</h4>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4"
                                  fill={i < review.rating ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={i < review.rating ? 0 : 2}
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                  />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
