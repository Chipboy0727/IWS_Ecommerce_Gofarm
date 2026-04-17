"use client";

import Link from "next/link";
import { useState } from "react";
import type { LocalCategory, LocalProduct } from "@/lib/local-catalog";

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

function ProductCard({ product }: { product: LocalProduct }) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/shop/${product.slug}`} className="block">
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
      </Link>

      <div className="px-4 pb-4 pt-2">
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-[17px] font-bold text-gofarm-black leading-tight hover:text-gofarm-green transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1 text-[12px] leading-none">
          <span className="text-gofarm-orange">★</span>
          <span className="font-semibold text-gofarm-black">{product.rating.toFixed(1)}</span>
          <span className="text-gofarm-gray">({product.reviews})</span>
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

        <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-[8px] border border-gofarm-light-green/35 bg-white px-4 py-3 text-[15px] font-semibold text-gofarm-black transition-all duration-200 hover:border-gofarm-green hover:bg-gofarm-light-orange/10">
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}

export default function ShopBrowser({
  products,
  categories,
}: {
  products: LocalProduct[];
  categories: LocalCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortMode>("featured");

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

              <div className="text-sm text-gofarm-gray">Showing {filtered.length} of {products.length}</div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-gofarm-light-green/30 bg-white px-6 py-20 text-center">
                <h3 className="text-2xl font-bold text-gofarm-black">No products match your filters</h3>
                <p className="mt-3 text-gofarm-gray">Try a different category or brand.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
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
