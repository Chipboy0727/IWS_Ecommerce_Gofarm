"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { LocalProduct } from "@/lib/local-catalog";
import { ProductCard } from "@/components/home/product-card";

type BrowserCategory = {
  id: string;
  label: string;
  products: LocalProduct[];
};

type SortMode = "name" | "price-asc" | "price-desc" | "rating";
type ViewMode = "compact" | "comfortable" | "expanded";

const SORT_LABELS: Record<SortMode, string> = {
  name: "Name (A-Z)",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
};

function salePriceFor(product: LocalProduct) {
  return product.discount && product.discount > 0
    ? Math.max(0, product.price - Math.round((product.price * product.discount) / 100))
    : product.price;
}

function ViewIcon({ mode }: { mode: ViewMode }) {
  if (mode === "compact") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="3" y="4" width="7" height="7" rx="1.5" />
        <rect x="14" y="4" width="7" height="7" rx="1.5" />
        <rect x="3" y="13" width="7" height="7" rx="1.5" />
        <rect x="14" y="13" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (mode === "comfortable") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="4" y="4" width="16" height="4" rx="1.5" />
        <rect x="4" y="10" width="16" height="4" rx="1.5" />
        <rect x="4" y="16" width="16" height="4" rx="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="4" y="5" width="16" height="3" rx="1.5" />
      <rect x="4" y="10.5" width="16" height="3" rx="1.5" />
      <rect x="4" y="16" width="16" height="3" rx="1.5" />
    </svg>
  );
}

export function HomeProductBrowser({
  products,
  categories,
}: {
  products: LocalProduct[];
  categories: BrowserCategory[];
}) {
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const firstNonEmptyCategory = categories.find((category) => category.products.length > 0)?.id ?? "all";
  const [activeCategory, setActiveCategory] = useState(firstNonEmptyCategory);
  const [sortBy, setSortBy] = useState<SortMode>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("compact");

  useEffect(() => {
    setMounted(true);
    setPortalTarget(document.getElementById("home-product-browser-root"));
  }, []);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const source = categoryMap.get(activeCategory)?.products ?? products;
    return [...source].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return salePriceFor(a) - salePriceFor(b);
        case "price-desc":
          return salePriceFor(b) - salePriceFor(a);
        case "rating":
          return b.rating - a.rating || b.reviews - a.reviews;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [activeCategory, categoryMap, products, sortBy]);

  const gridClassName =
    viewMode === "expanded"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      : viewMode === "comfortable"
        ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4";

  if (!mounted || !portalTarget) return null;

  return createPortal(
    <section className="mx-auto max-w-(--breakpoint-xl) px-4 pb-12 sm:pb-16">
      <div
        className="rounded-[48px] bg-white p-3 sm:rounded-[52px] sm:p-4"
        style={{
          border: "none",
          outline: "none",
          borderRadius: "52px",
          boxShadow: "0 20px 48px rgba(19, 93, 33, 0.08)",
        }}
      >
        <div
          className="overflow-hidden rounded-[40px] bg-linear-to-br from-white via-[#fdfffd] to-[#f7fbf8] px-5 py-5 sm:rounded-[44px] sm:px-6 sm:py-6 lg:px-7 lg:py-7"
          style={{
            border: "none",
            borderRadius: "44px",
          }}
        >
        <div className="flex flex-col gap-4 pb-4 sm:pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gofarm-black sm:text-[11px]">Fresh Picks</p>
              <h2 className="mt-2 text-[1.2rem] font-bold tracking-tight text-gofarm-black sm:text-[1.35rem] lg:text-[1.55rem] leading-tight">
                More products you may like
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="inline-flex self-start rounded-full border border-gofarm-green/60 bg-white px-4 py-2 text-sm font-semibold text-gofarm-green transition-colors hover:bg-gofarm-green hover:text-white"
            >
              See all
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pb-1">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={[
                    "inline-flex items-center rounded-full border px-4 py-2 text-[15px] font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:border-gofarm-green focus-visible:shadow-[0_0_0_3px_rgba(37,168,67,0.12)]",
                    active
                      ? "border-gofarm-green bg-gofarm-green text-white shadow-sm"
                      : "border-gofarm-light-green/50 bg-white text-[#5f6f86] hover:-translate-y-0.5 hover:border-gofarm-green hover:bg-gofarm-light-green/5 hover:text-gofarm-green hover:shadow-md",
                  ].join(" ")}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <div className="mx-1 border-t border-gofarm-light-gray/70"></div>
          <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="mr-1 text-sm font-semibold text-gofarm-black">View:</span>
            {(["compact", "comfortable", "expanded"] as ViewMode[]).map((mode) => {
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={[
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:border-gofarm-green focus-visible:shadow-[0_0_0_3px_rgba(37,168,67,0.12)]",
                    active
                      ? "border-gofarm-green bg-gofarm-green text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-gofarm-green hover:bg-gofarm-light-green/5 hover:text-gofarm-green hover:shadow-md",
                  ].join(" ")}
                  aria-label={`Change product view to ${mode}`}
                >
                  <ViewIcon mode={mode} />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setActiveCategory(firstNonEmptyCategory);
                setSortBy("name");
                setViewMode("compact");
              }}
              className="inline-flex h-9 items-center rounded-xl border border-gofarm-light-green/50 bg-white px-4 text-sm font-semibold text-[#6B7A90] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gofarm-green hover:bg-gofarm-light-green/5 hover:text-gofarm-green hover:shadow-md focus-visible:outline-none focus-visible:border-gofarm-green focus-visible:shadow-[0_0_0_3px_rgba(37,168,67,0.12)]"
            >
              Filters
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <label className="sr-only" htmlFor="home-product-sort">
              Sort products
            </label>
            <select
              id="home-product-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortMode)}
              className="h-9 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gofarm-black shadow-sm outline-none transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-green/5 hover:shadow-md focus:border-gofarm-green focus:shadow-[0_0_0_3px_rgba(37,168,67,0.12)] min-w-[190px]"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="inline-flex items-center rounded-full border border-gofarm-light-green/50 bg-[#fffdf6] px-3 py-1 text-sm font-semibold text-gofarm-green">
              {filteredProducts.length} products
            </span>
          </div>
        </div>
        </div>
        </div>
      </div>

      <div className="pt-8">
        {filteredProducts.length > 0 ? (
          <div className={gridClassName}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gofarm-light-green/40 bg-white px-6 py-12 text-center text-gofarm-gray shadow-sm">
            No products found for this category.
          </div>
        )}
      </div>
    </section>,
    portalTarget
  );
}
