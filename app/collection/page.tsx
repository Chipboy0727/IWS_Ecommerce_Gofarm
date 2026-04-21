"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SiteHeader from "@/components/site-header";
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

// Icons
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function Grid3x3Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="10" y="3" width="5" height="5" rx="1" />
      <rect x="17" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="10" width="5" height="5" rx="1" />
      <rect x="10" y="10" width="5" height="5" rx="1" />
      <rect x="17" y="10" width="5" height="5" rx="1" />
    </svg>
  );
}

function LayoutGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function Grid5Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="3" height="3" rx="0.5" />
      <rect x="7" y="2" width="3" height="3" rx="0.5" />
      <rect x="12" y="2" width="3" height="3" rx="0.5" />
      <rect x="17" y="2" width="3" height="3" rx="0.5" />
      <rect x="2" y="7" width="3" height="3" rx="0.5" />
      <rect x="7" y="7" width="3" height="3" rx="0.5" />
      <rect x="12" y="7" width="3" height="3" rx="0.5" />
      <rect x="17" y="7" width="3" height="3" rx="0.5" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h.01" />
      <path d="M3 12h.01" />
      <path d="M3 19h.01" />
      <path d="M8 5h13" />
      <path d="M8 12h13" />
      <path d="M8 19h13" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

// Product Card Component
function ProductCardComponent({ product, viewMode = "grid" }: { product: LocalProduct; viewMode?: string }) {
  const salePrice = salePriceFor(product);
  const status = product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "New";
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: salePrice,
        imageSrc: product.imageSrc,
        quantity: 1,
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // List view mode
  if (viewMode === "list") {
    return (
      <>
        <div className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white">
          <div className="relative w-24 h-24 shrink-0">
            <img src={product.imageSrc} alt={product.imageAlt} className="w-full h-full object-cover rounded-lg" />
            {product.discount && (
              <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">-{product.discount}%</span>
            )}
          </div>
          <div className="flex-1">
            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-semibold text-gofarm-black hover:text-gofarm-green">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-xs text-gofarm-gray">({product.reviews})</span>
            </div>
            <p className="text-sm text-gofarm-gray mt-1 line-clamp-1">{product.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg font-bold text-gofarm-green">{formatPrice(salePrice)}</span>
              {product.discount && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="ml-auto px-3 py-1 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green text-sm disabled:opacity-50"
              >
                {isAdding ? "..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
        {showToast && <ToastMessage />}
      </>
    );
  }

  // Grid view mode
  return (
    <>
      <div className="transform hover:scale-105 transition-transform duration-300">
        <article className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
          <div className="relative h-52 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
            <Link href={`/shop/${product.slug}`} className="block h-full">
              <img
                src={product.imageSrc}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                alt={product.imageAlt}
                loading="lazy"
              />
            </Link>

            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              <div className="inline-flex items-center rounded-md bg-gofarm-green text-white text-[10px] px-2 py-0.5 shadow-md font-semibold">
                {status}
              </div>
              {product.discount ? (
                <div className="inline-flex items-center rounded-md bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md font-bold">
                  -{product.discount}%
                </div>
              ) : null}
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10">
              <button type="button" className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white">
                <HeartIcon className="w-3 h-3" />
              </button>
              <button type="button" className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white">
                <CompareIcon className="w-3 h-3" />
              </button>
              <button type="button" className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white hover:scale-110 transition-all duration-300">
                <ShareIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-2 space-y-1">
            <Link href={`/shop/${product.slug}`}>
              <h2 className="text-xs font-semibold line-clamp-1 mb-0.5 group-hover:text-gofarm-green transition-colors">
                {product.name}
              </h2>
            </Link>

            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon key={index} className={`w-2.5 h-2.5 ${index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-[9px] text-gofarm-gray">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-gofarm-green text-sm font-bold">{formatPrice(salePrice)}</span>
                {product.discount ? (
                  <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</span>
                ) : null}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full rounded-md bg-gofarm-green text-white px-2 py-1.5 text-[10px] font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </article>
      </div>
      {showToast && <ToastMessage />}
    </>
  );
}

function ToastMessage() {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-gofarm-green text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Added to cart!</span>
      </div>
    </div>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  const categoryRoutes: Record<string, string> = {
    "Ice and Cold": "/category/ice-and-cold",
    "Dry Food": "/category/dry-food",
    "Fast Food": "/category/fast-food",
    Frozen: "/category/frozen",
    Meat: "/category/meat",
    Fish: "/category/fish",
    Vegetables: "/category/vegetables",
  };

  return (
    <div>
      <h3 className="font-semibold text-gofarm-black mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href={
                title === "Quick Links"
                  ? item === "About us"
                    ? "/about"
                    : item === "Contact us"
                      ? "/contact"
                      : item === "Terms & Conditions"
                        ? "/terms"
                        : item === "Privacy Policy"
                          ? "/privacy"
                          : item === "FAQs"
                            ? "/faqs"
                            : "/help"
                  : categoryRoutes[item] ?? "/collection"
              }
              className="text-gofarm-gray hover:text-gofarm-green text-sm font-medium hoverEffect capitalize"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CollectionPage() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<LocalProduct[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, sale, featured, new, hot
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState("grid");
  const [gridCols, setGridCols] = useState(4); // 3, 4, 5 cột
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by search
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Filter by type
    switch (filterType) {
      case "sale":
        result = result.filter(p => p.discount && p.discount > 0);
        break;
      case "featured":
        result = result.filter(p => p.rating >= 4.5);
        break;
      case "new":
        result = result.filter(p => p.status === "new" || p.status === "just added");
        break;
      case "hot":
        result = result.filter(p => p.discount && p.discount >= 15);
        break;
      default:
        break;
    }
    
    // Filter by price
    result = result.filter(p => salePriceFor(p) >= priceRange.min && salePriceFor(p) <= priceRange.max);
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return salePriceFor(a) - salePriceFor(b);
        case "price-desc": return salePriceFor(b) - salePriceFor(a);
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });
    
    setFilteredProducts(result);
    setDisplayCount(20);
  }, [products, searchTerm, filterType, sortBy, priceRange]);

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  // Grid column classes
  const getGridColsClass = () => {
    if (viewMode === "list") return "grid-cols-1";
    switch (gridCols) {
      case 3: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
      case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
    }
  };

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const footerCategories = ["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"];

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gofarm-green"></div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-linear-to-b from-gofarm-light-green/5 via-gofarm-white to-gofarm-light-orange/5 min-h-screen">
      <SiteHeader />

      <main>
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 lg:py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full" />
              <SparklesIcon className="w-8 h-8 text-gofarm-green" />
              <h1 className="text-3xl lg:text-5xl font-bold text-gofarm-black">Product Collection</h1>
              <SparklesIcon className="w-8 h-8 text-gofarm-green" />
              <div className="h-1 w-12 bg-linear-to-l from-gofarm-light-green to-gofarm-green rounded-full" />
            </div>
            <p className="text-gofarm-gray text-lg max-w-2xl mx-auto">Discover our curated collection of premium products</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="inline-flex items-center rounded-md border font-semibold transition-colors shadow-sm bg-gofarm-light-green/20 text-gofarm-green border-gofarm-light-green/30 text-base px-4 py-2">
                {filteredProducts.length} Products
              </div>
            </div>
          </div>

          {/* Toolbar - Row 1: Search, View modes, Sort */}
          <div className="rounded-xl border bg-card text-card-foreground mb-4 border-gofarm-light-green/20 shadow-lg bg-linear-to-br from-gofarm-white via-gofarm-light-orange/5 to-gofarm-light-green/5">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gofarm-gray" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border bg-transparent pl-12 pr-4 py-3 text-base border-gofarm-light-green/30 focus:border-gofarm-green focus:ring-gofarm-green rounded-xl outline-none"
                    placeholder="Search products..."
                  />
                </div>
                
                {/* View mode buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setViewMode("grid"); setGridCols(3); }}
                    className={`h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center ${viewMode === "grid" && gridCols === 3 ? "bg-gofarm-green text-white" : ""}`}
                    title="3 columns"
                  >
                    <Grid3x3Icon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { setViewMode("grid"); setGridCols(4); }}
                    className={`h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center ${viewMode === "grid" && gridCols === 4 ? "bg-gofarm-green text-white" : ""}`}
                    title="4 columns"
                  >
                    <LayoutGridIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { setViewMode("grid"); setGridCols(5); }}
                    className={`h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center ${viewMode === "grid" && gridCols === 5 ? "bg-gofarm-green text-white" : ""}`}
                    title="5 columns"
                  >
                    <Grid5Icon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center ${viewMode === "list" ? "bg-gofarm-green text-white" : ""}`}
                    title="List view"
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gofarm-light-green/30 rounded-xl bg-gofarm-white text-gofarm-black focus:outline-none focus:border-gofarm-green"
                >
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Bar - Row 2: Filter chips */}
          <div className="rounded-xl border bg-card text-card-foreground mb-8 border-gofarm-light-green/20 shadow-lg bg-white">
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gofarm-black">Filter by:</span>
                
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === "all" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  All Products
                </button>
                
                <button
                  onClick={() => setFilterType("sale")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === "sale" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  On Sale
                </button>
                
                <button
                  onClick={() => setFilterType("featured")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === "featured" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  Featured
                </button>
                
                <button
                  onClick={() => setFilterType("new")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === "new" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  New Arrivals
                </button>
                
                <button
                  onClick={() => setFilterType("hot")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === "hot" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  Hot Deals
                </button>

                {/* Price filter toggle */}
                <button
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${showPriceFilter ? "bg-gofarm-green text-white" : "bg-gray-100 text-gofarm-gray hover:bg-gofarm-light-green/20"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Price
                </button>
              </div>

              {/* Price Range Slider */}
              {showPriceFilter && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex justify-between text-sm text-gofarm-gray mb-2">
                        <span>Price Range: ${priceRange.min} - ${priceRange.max}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gofarm-green"
                      />
                    </div>
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 200 })}
                      className="text-sm text-gofarm-green hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={`grid ${getGridColsClass()} gap-4`}>
            {visibleProducts.map((product) => (
              <ProductCardComponent key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 20)}
                className="inline-flex items-center justify-center rounded-xl bg-gofarm-green px-12 py-4 text-white font-semibold shadow-lg shadow-gofarm-green/20 hover:bg-gofarm-light-green transition-colors"
              >
                Load More Products
                <span className="ml-3 text-white/80">({visibleProducts.length} of {filteredProducts.length})</span>
              </button>
            </div>
          )}

          {/* Showing info */}
          <p className="mt-8 text-gofarm-gray text-lg text-center">
            Showing <span className="font-bold text-gofarm-black">{visibleProducts.length}</span> of{" "}
            <span className="font-bold text-gofarm-black">{filteredProducts.length}</span> products
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
            <a href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Visit Us</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">123 Shopping Street, Commerce District, New York, NY 10001, USA</p>
              </div>
            </a>

            <a href="tel:15551234567" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Call Us</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</p>
              </div>
            </a>

            <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Working Hours</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p>
              </div>
            </div>

            <a href="mailto:support@gofarm.com" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Email Us</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">support@gofarm.com</p>
              </div>
            </a>
          </div>

          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="mb-2">
                <Link href="/">
                  <img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" />
                </Link>
              </div>
              <p className="text-gofarm-gray text-sm">Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.</p>
              <div className="flex items-center gap-3.5 text-gofarm-black/60">
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">YouTube</span></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
              </div>
            </div>

            <FooterColumn title="Quick Links" items={quickLinks} />
            <FooterColumn title="Categories" items={footerCategories} />

            <div>
              <h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3>
              <p className="text-gofarm-gray text-sm mb-4">Subscribe to our newsletter to receive updates and exclusive offers.</p>
              <form className="space-y-3">
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green disabled:bg-gofarm-light-gray/50 disabled:cursor-not-allowed transition-all text-gofarm-black placeholder:text-gofarm-gray" />
                <button type="submit" className="w-full bg-gofarm-green text-gofarm-white px-4 py-2 rounded-lg hover:bg-gofarm-light-green transition-colors disabled:bg-gofarm-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="py-6 border-t border-gofarm-light-gray text-center text-sm text-gofarm-gray">
            <p>© 2026 <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">Gofar<span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">m</span></span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}