"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";
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

function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }: { 
  product: LocalProduct; 
  onAddToCart: (product: LocalProduct) => void;
  onToggleWishlist: (product: LocalProduct) => void;
  isWishlisted: boolean;
  onQuickView: (product: LocalProduct) => void;
}) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleWishlist(product);
  };

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left">
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

        {/* Action Buttons - Wishlist, Compare, Share */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
          <button
            type="button"
            onClick={handleWishlist}
            className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
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
        <button type="button" onClick={() => onQuickView(product)} className="block w-full text-left">
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

        {/* Button Add to Cart - Màu xanh giống collection */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-md border border-gofarm-green/20 bg-gofarm-green text-white px-3 py-2 text-xs font-semibold hover:bg-gofarm-light-green transition-colors"
        >
          Add to Cart
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
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 text-left">
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
          active ? "border-gofarm-green bg-gofarm-green" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <span className={["flex-1 text-[15px]", active ? "text-gofarm-black font-medium" : "text-gofarm-gray"].join(" ")}>
        {label}
      </span>
      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gofarm-gray">
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
  const itemsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeBrand, sortBy, products]);

  // Load wishlist status
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

  const handleAddToCart = (product: LocalProduct) => {
    const salePrice = salePriceFor(product);
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice,
      imageSrc: product.imageSrc,
      slug: product.slug,
    });
  };

  const handleToggleWishlist = (product: LocalProduct) => {
    const salePrice = salePriceFor(product);
    if (wishlistStatus[product.id]) {
      removeFromWishlist(product.id);
      setWishlistStatus(prev => ({ ...prev, [product.id]: false }));
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: salePrice,
        imageSrc: product.imageSrc,
        slug: product.slug,
      });
      setWishlistStatus(prev => ({ ...prev, [product.id]: true }));
    }
  };

  return (
    <div className="max-w-(--breakpoint-xl) mx-auto px-4 pb-16">
      <section className="pt-8 lg:pt-10">
        <div className="rounded-[18px] border border-gray-200 bg-white px-6 py-8 shadow-[0_1px_10px_rgba(15,23,42,0.05)]">
          <h1 className="text-[42px] font-extrabold tracking-tight text-gofarm-black">Shop Products</h1>
          <p className="mt-3 text-[15px] text-gofarm-gray">Discover amazing products tailored to your needs</p>
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="order-1 lg:sticky lg:top-28 lg:w-[320px] lg:shrink-0 rounded-[18px] border border-gray-200 bg-white shadow-[0_1px_10px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-5">
            <h2 className="text-[22px] font-bold text-gofarm-black">Filters</h2>
          </div>

          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gofarm-black">Categories</h3>
              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gofarm-gray">
                {categories.length}
              </span>
            </div>

            <div className="mt-5 space-y-4">
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

          <div className="px-5 py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gofarm-black">Brands</h3>
              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gofarm-gray">
                {brands.length}
              </span>
            </div>

            <div className="mt-5 space-y-4">
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

        <section className="order-2 min-w-0 flex-1 rounded-[18px] border border-gray-200 bg-white shadow-[0_1px_10px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gofarm-black">{filtered.length} Products Found</h2>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <span className="text-sm text-gofarm-gray">Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortMode)}
                  className="bg-transparent text-sm font-medium outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating">Rating</option>
                </select>
              </label>

              <div className="text-sm text-gofarm-gray">Showing {Math.min(filtered.length, currentPage * itemsPerPage)} of {filtered.length}</div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistStatus[product.id] || false}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3 text-lg text-gray-500">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center hover:text-gofarm-green hover:bg-gofarm-green/5 rounded-xl disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
                                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-2 transition-colors ${
                                  currentPage === 1 ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "font-medium hover:text-gofarm-green hover:bg-gofarm-green/5"
                                }`}
                              >
                                1
                              </button>
                              {startPage > 2 && <span className="px-1 tracking-widest text-gray-400">...</span>}
                            </>
                          )}

                          {pages.map(number => {
                            if (number === 1 && startPage > 1) return null;
                            if (number === totalPages && endPage < totalPages) return null;

                            return (
                              <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-2 transition-colors ${
                                  currentPage === number ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "font-medium hover:text-gofarm-green hover:bg-gofarm-green/5"
                                }`}
                              >
                                {number}
                              </button>
                            );
                          })}

                          {endPage < totalPages && (
                            <>
                              {endPage < totalPages - 1 && <span className="px-1 tracking-widest text-gray-400">...</span>}
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-2 transition-colors ${
                                  currentPage === totalPages ? "bg-gofarm-green/10 text-gofarm-green font-bold" : "font-medium hover:text-gofarm-green hover:bg-gofarm-green/5"
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
                      className="flex h-10 w-10 items-center justify-center hover:text-gofarm-green hover:bg-gofarm-green/5 rounded-xl disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-gofarm-light-green/30 bg-white px-6 py-20 text-center">
                <h3 className="text-2xl font-bold text-gofarm-black">No products match your filters</h3>
                <p className="mt-3 text-gofarm-gray">Try a different category or brand.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}