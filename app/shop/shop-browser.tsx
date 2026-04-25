"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
import { ProductCard as SharedProductCard } from "@/components/home/product-card";
import ProductShareHandler from "@/components/home/product-share-handler";
import { ProductModal } from "@/components/product-modal";

type SortMode = "name" | "featured" | "price-asc" | "price-desc" | "rating";

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

// Toast Component
function ToastMessage({ message, onClose }: { message: string; onClose: () => void }) {
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
        <span>{message}</span>
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

function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }: { 
  product: LocalProduct; 
  onAddToCart: (product: LocalProduct) => Promise<void>;
  onToggleWishlist: (product: LocalProduct) => void;
  isWishlisted: boolean;
  onQuickView: (product: LocalProduct) => void;
}) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    await onAddToCart(product);
    setIsAdding(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleWishlist(product);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <article className="group rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
      <div className="relative">
        <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left">
          <div className="relative aspect-square overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-white flex items-center justify-center p-2 sm:p-3 md:p-4">
            <div className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2">
              <span className="inline-flex items-center rounded-full bg-gofarm-green px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">
                {status}
              </span>
              {product.discount ? (
                <span className="inline-flex items-center rounded-full bg-red-500 px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">
                  -{product.discount}%
                </span>
              ) : null}
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
            <HeartIcon 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "text-red-500" : "text-gray-600"}`} 
              filled={isWishlisted} 
            />
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
        <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left">
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
          {product.discount ? (
            <>
              <span className="text-xs sm:text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              <span className="inline-flex items-center rounded-md bg-red-50 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-red-500">
                -{product.discount}%
              </span>
            </>
          ) : null}
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
  );
}

function FilterOption({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-2 sm:gap-3 text-left py-0.5">
      <span
        className={[
          "flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border transition-colors shrink-0",
          active ? "border-gofarm-green bg-gofarm-green" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {active && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span className={["flex-1 text-xs sm:text-sm break-words", active ? "text-gofarm-black font-medium" : "text-gray-600"].join(" ")}>
        {label}
      </span>
      <span className="inline-flex min-w-[28px] sm:min-w-[32px] items-center justify-center rounded-full bg-gray-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-gray-600 shrink-0">
        {count}
      </span>
    </button>
  );
}

export default function ShopBrowser({
  products,
  categories,
}: {
  products: LocalProduct[];
  categories: LocalCategory[];
}) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortMode>("featured");
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const itemsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeBrand, sortBy, products]);

  useEffect(() => {
    const status: Record<string, boolean> = {};
    products.forEach(product => {
      status[product.id] = isInWishlist(product.id);
    });
    setWishlistStatus(status);
  }, [products, isInWishlist]);

  const brands = Array.from(
    products.reduce((map, product) => {
      const key = product.brand ?? "Unbranded";
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>()).entries()
  )
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const filtered = [...products]
    .filter((product) => activeCategory === "all" || product.categoryId === activeCategory)
    .filter((product) => activeBrand === "all" || (product.brand ?? "Unbranded") === activeBrand)
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc":
          return salePriceFor(a) - salePriceFor(b);
        case "price-desc":
          return salePriceFor(b) - salePriceFor(a);
        case "rating":
          return b.rating - a.rating;
        case "featured":
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = async (product: LocalProduct) => {
    const salePrice = salePriceFor(product);
    await addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      imageSrc: product.imageSrc,
      slug: product.slug,
    });
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  const handleToggleWishlist = (product: LocalProduct) => {
    if (wishlistStatus[product.id]) {
      removeFromWishlist(product.id);
      setWishlistStatus(prev => ({ ...prev, [product.id]: false }));
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: salePriceFor(product),
        imageSrc: product.imageSrc,
        slug: product.slug,
      });
      setWishlistStatus(prev => ({ ...prev, [product.id]: true }));
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <ToastMessage message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-12 sm:pb-16">
        
        {/* Header */}
        <section className="pt-6 sm:pt-8 lg:pt-10">
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 shadow-sm">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-gofarm-black">
              Shop Products
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
              Discover amazing products tailored to your needs
            </p>
          </div>
        </section>

        {/* Mobile Filter Button */}
        <div className="mt-3 sm:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gofarm-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters & Sort
          </button>
        </div>

        {/* Main Content */}
        <section className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:w-[260px] xl:w-[280px] lg:shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-4">
              <h2 className="text-lg font-bold text-gofarm-black">Filters</h2>
            </div>

            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gofarm-black">Categories</h3>
                <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {categories.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                <FilterOption
                  active={activeCategory === "all"}
                  label="All"
                  count={products.length}
                  onClick={() => setActiveCategory("all")}
                />
                {categories.map((category) => (
                  <FilterOption
                    key={category.id}
                    active={activeCategory === category.id}
                    label={category.title}
                    count={category.count}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gofarm-black">Brands</h3>
                <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {brands.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                <FilterOption
                  active={activeBrand === "all"}
                  label="All"
                  count={products.length}
                  onClick={() => setActiveBrand("all")}
                />
                {brands.map((brand) => (
                  <FilterOption
                    key={brand.title}
                    active={activeBrand === brand.title}
                    label={brand.title}
                    count={brand.count}
                    onClick={() => setActiveBrand(brand.title)}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filters Modal */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gofarm-black">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gofarm-black mb-3">Categories</h3>
                    <div className="space-y-3">
                      <FilterOption
                        active={activeCategory === "all"}
                        label="All"
                        count={products.length}
                        onClick={() => { setActiveCategory("all"); setMobileFiltersOpen(false); }}
                      />
                      {categories.map((category) => (
                        <FilterOption
                          key={category.id}
                          active={activeCategory === category.id}
                          label={category.title}
                          count={category.count}
                          onClick={() => { setActiveCategory(category.id); setMobileFiltersOpen(false); }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gofarm-black mb-3">Brands</h3>
                    <div className="space-y-3">
                      <FilterOption
                        active={activeBrand === "all"}
                        label="All"
                        count={products.length}
                        onClick={() => { setActiveBrand("all"); setMobileFiltersOpen(false); }}
                      />
                      {brands.map((brand) => (
                        <FilterOption
                          key={brand.title}
                          active={activeBrand === brand.title}
                          label={brand.title}
                          count={brand.count}
                          onClick={() => { setActiveBrand(brand.title); setMobileFiltersOpen(false); }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <section className="order-2 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gofarm-black">{filtered.length} Products Found</h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <span className="text-xs text-gray-500">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortMode)}
                    className="bg-transparent text-xs font-medium outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </label>

                <div className="text-xs text-gray-500">
                  Showing {Math.min(filtered.length, currentPage * itemsPerPage)} of {filtered.length}
                </div>
              </div>
            </div>

            <div className="px-3 py-4">
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {paginatedProducts.map((product) => (
                      <SharedProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {(() => {
                        const maxVisible = 5;
                        let startPage = Math.max(1, currentPage - 2);
                        let endPage = Math.min(totalPages, currentPage + 2);

                        if (startPage === 1) {
                          endPage = Math.min(totalPages, startPage + maxVisible - 1);
                        } else if (endPage === totalPages) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        return (
                          <>
                            {startPage > 1 && (
                              <>
                                <button
                                  onClick={() => setCurrentPage(1)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                                    currentPage === 1 ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "hover:bg-gray-100"
                                  }`}
                                >
                                  1
                                </button>
                                {startPage > 2 && <span className="px-1 text-gray-400">...</span>}
                              </>
                            )}

                            {pages.map(number => (
                              <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                                  currentPage === number ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "hover:bg-gray-100"
                                }`}
                              >
                                {number}
                              </button>
                            ))}

                            {endPage < totalPages && (
                              <>
                                {endPage < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
                                <button
                                  onClick={() => setCurrentPage(totalPages)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                                    currentPage === totalPages ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "hover:bg-gray-100"
                                  }`}
                                >
                                  {totalPages}
                                </button>
                              </>
                            )}
                          </>
                        );
                      })()}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-gofarm-light-green/30 bg-white px-4 py-12 sm:py-16 text-center">
                  <h3 className="text-base sm:text-lg font-bold text-gofarm-black">No products match your filters</h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500">Try a different category or brand.</p>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ProductShareHandler products={products} />
    </>
  );
}