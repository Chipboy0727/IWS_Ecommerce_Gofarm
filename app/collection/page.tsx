"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import type { LocalProduct } from "@/lib/local-catalog";
import ProductShareHandler from "@/components/home/product-share-handler";
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

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

// Toast Message
function ToastMessage({ productName }: { productName: string }) {
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

// Product Card Component - Responsive
function ProductCardComponent({ product, viewMode = "grid", onShare }: {
  product: LocalProduct;
  viewMode?: string;
  onShare?: (product: LocalProduct) => void;
}) {
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
    if (onShare) onShare(product);
  };

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <>
        <div className="flex gap-3 p-3 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white">
          <div className="relative w-20 h-20 shrink-0">
            <img src={product.imageSrc} alt={product.imageAlt} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/shop/${product.slug}`} onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
              <h3 className="font-semibold text-gofarm-black hover:text-gofarm-green text-sm truncate">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 sm:w-6 sm:h-6 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-xs text-gofarm-gray">({product.reviews})</span>
            </div>
            <p className="text-sm text-gofarm-gray mt-1 line-clamp-1 hidden sm:block">{product.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-gofarm-green">${salePrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="bg-red-500 text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow-md animate-pulse">-{product.discount}%</span>
                </>
              )}
              <button onClick={handleAddToCart} disabled={isAdding} className="ml-auto px-3 py-1 bg-gofarm-green text-white rounded-lg text-sm disabled:opacity-50">
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
        {showToast && <ToastMessage productName={toastProductName} />}
        <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // GRID VIEW
  return (
    <>
      <div className="transform hover:scale-105 transition-transform duration-300">
        <article className="group relative border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col">

          <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-3 sm:p-4">
            <Link href={`/shop/${product.slug}`} className="block w-full h-full" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
              <img src={product.imageSrc} className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105" alt={product.imageAlt} loading="lazy" />
            </Link>

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <span className="w-fit inline-flex items-center rounded-full bg-gofarm-green px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-semibold text-white shadow">{status}</span>
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <button onClick={handleWishlist} className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 bg-white/90 hover:bg-gofarm-green hover:text-white transition-all">
                <HeartIcon className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} filled={isWishlisted} />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-full shadow-lg border border-gofarm-green/20 bg-white/90 hover:bg-gofarm-green hover:text-white transition-all">
                <ShareIcon className="w-3 h-3 text-gray-600 hover:text-white" />
              </button>
            </div>
          </div>

          <div className="p-2 sm:p-3 flex-1 flex flex-col">
            <Link href={`/shop/${product.slug}`} onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
              <h2 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-0.5 group-hover:text-gofarm-green transition-colors min-h-[32px] sm:min-h-[40px]">
                {product.name}
              </h2>
            </Link>

            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon key={index} className={`w-5 h-5 sm:w-6 sm:h-6 ${index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs text-gofarm-gray">({product.reviews})</span>
            </div>

            <div className="flex items-center gap-1 mt-1 flex-wrap w-full">
              <span className="text-gofarm-green text-sm sm:text-base font-bold">{formatPrice(salePrice)}</span>
              {(product.discount ?? 0) > 0 && (
                <>
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="ml-auto bg-red-500 text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow-md animate-pulse">-{product.discount}%</span>
                </>
              )}
            </div>

            <button onClick={handleAddToCart} disabled={isAdding} className="w-full rounded-lg bg-gofarm-green text-white px-2 py-1.5 mt-2 text-xs sm:text-sm font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50">
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </article>
      </div>
      {showToast && <ToastMessage productName={toastProductName} />}
      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

// Dual Range Slider Component
const PRICE_GLOBAL_MIN = 0;
const PRICE_GLOBAL_MAX = 200;

function DualRangeSlider({
  min, max, globalMin, globalMax, onChange
}: {
  min: number; max: number;
  globalMin: number; globalMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);

  const pct = (v: number) =>
    ((v - globalMin) / (globalMax - globalMin)) * 100;

  const valueFromPct = (p: number) =>
    Math.round(globalMin + (p / 100) * (globalMax - globalMin));

  const getPctFromEvent = (e: MouseEvent | TouchEvent) => {
    if (!rangeRef.current) return 0;
    const rect = rangeRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  };

  const startDragMin = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingMin.current = true;
    const move = (ev: MouseEvent | TouchEvent) => {
      const p = getPctFromEvent(ev);
      const newMin = Math.min(valueFromPct(p), max - 1);
      onChange(newMin, max);
    };
    const up = () => {
      isDraggingMin.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  };

  const startDragMax = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingMax.current = true;
    const move = (ev: MouseEvent | TouchEvent) => {
      const p = getPctFromEvent(ev);
      const newMax = Math.max(valueFromPct(p), min + 1);
      onChange(min, newMax);
    };
    const up = () => {
      isDraggingMax.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  };

  const minPct = pct(min);
  const maxPct = pct(max);

  return (
    <div className="py-2">
      <div ref={rangeRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer select-none">
        {/* Active track */}
        <div
          className="absolute h-2 bg-gofarm-green rounded-full"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gofarm-green rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${minPct}%` }}
          onMouseDown={startDragMin}
          onTouchStart={startDragMin}
        />
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gofarm-green rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${maxPct}%` }}
          onMouseDown={startDragMax}
          onTouchStart={startDragMax}
        />
      </div>
    </div>
  );
}

function collectionSortToApi(sortBy: string) {
  switch (sortBy) {
    case "name-desc": return { sortBy: "name", sortOrder: "desc" as const };
    case "price-asc": return { sortBy: "price", sortOrder: "asc" as const };
    case "price-desc": return { sortBy: "price", sortOrder: "desc" as const };
    case "rating": return { sortBy: "rating", sortOrder: "desc" as const };
    case "featured": return { sortBy: "featured", sortOrder: "desc" as const };
    default: return { sortBy: "name", sortOrder: "asc" as const };
  }
}

export default function CollectionPage() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState("grid");
  const [gridCols, setGridCols] = useState(4);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  // dragRange is updated immediately during drag; priceRange is debounced for API calls
  const [dragRange, setDragRange] = useState({ min: 0, max: 200 });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [selectedShareProduct, setSelectedShareProduct] = useState<LocalProduct | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ShareModalComponent, setShareModalComponent] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    import("@/app/share/share-modal").then((mod) => setShareModalComponent(() => mod.default));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const isFirstPage = page === 1;

    async function loadProducts() {
      try {
        if (isFirstPage) setLoading(true);
        else setLoadingMore(true);

        const sort = collectionSortToApi(sortBy);
        const params = new URLSearchParams({
          paginated: "true",
          page: String(page),
          limit: "20",
          search: searchTerm,
          filterType,
          minPrice: String(priceRange.min),
          maxPrice: String(priceRange.max),
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
        });

        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        if (cancelled) return;

        const nextProducts = Array.isArray(data.products) ? data.products : [];
        setProducts((current) => isFirstPage ? nextProducts : [...current, ...nextProducts]);
        setMeta({
          total: Number(data.meta?.total ?? nextProducts.length),
          totalPages: Number(data.meta?.totalPages ?? 1),
          hasNextPage: Boolean(data.meta?.hasNextPage),
        });
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    loadProducts();
    return () => { cancelled = true; controller.abort(); };
  }, [page, searchTerm, filterType, sortBy, priceRange.min, priceRange.max]);

  const handleDragRange = useCallback((min: number, max: number) => {
    setDragRange({ min, max });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPriceRange({ min, max });
      setProducts([]);
      setPage(1);
    }, 120);
  }, []);

  const getGridColsClass = () => {
    if (viewMode === "list") return "grid-cols-1";
    switch (gridCols) {
      case 3: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3";
      case 4: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
      case 5: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    }
  };

  const handleShare = (product: LocalProduct) => {
    setSelectedShareProduct(product);
    setShowShareModal(true);
  };

  const shareUrl = selectedShareProduct && typeof window !== "undefined"
    ? `${window.location.origin}/shop/${selectedShareProduct.slug}`
    : "";

  const resetQuery = () => {
    setProducts([]);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetQuery();
  };

  const handleFilterType = (value: string) => {
    setFilterType(value);
    resetQuery();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    resetQuery();
  };

  const handlePriceChange = (nextRange: { min: number; max: number }) => {
    setDragRange(nextRange);
    setPriceRange(nextRange);
    resetQuery();
  };

  const hasMore = meta.hasNextPage;
  const productCount = products.length;
  const totalCount = meta.total;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gofarm-green" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-b from-gofarm-light-green/5 via-white to-gofarm-light-orange/5 min-h-screen">
        <main>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

            {/* Header */}
            <div className="text-center mt-6 sm:mt-10 lg:mt-12 mb-6 sm:mb-8 lg:mb-10">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-0.5 w-8 sm:w-12 bg-gradient-to-r from-gofarm-light-green to-gofarm-green rounded-full" />
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gofarm-green" />
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gofarm-black">Product Collection</h1>
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gofarm-green" />
                <div className="h-0.5 w-8 sm:w-12 bg-gradient-to-l from-gofarm-light-green to-gofarm-green rounded-full" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">Discover our curated collection of premium products</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="inline-flex items-center rounded-md border font-semibold bg-gofarm-light-green/20 text-gofarm-green border-gofarm-light-green/30 text-sm px-3 py-1.5">
                  {totalCount} Products
                </div>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="rounded-xl border bg-white border-gofarm-light-green/20 shadow-lg mb-4">
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex flex-col lg:flex-row gap-3">

                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full border bg-white pl-10 pr-3 py-2 text-sm border-gofarm-light-green/30 focus:border-gofarm-green focus:ring-gofarm-green rounded-lg outline-none shadow-sm transition-all"
                      placeholder="Search products..."
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <button onClick={() => { setViewMode("grid"); setGridCols(3); }} className={`h-9 w-9 rounded-lg border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 flex items-center justify-center transition-colors ${viewMode === "grid" && gridCols === 3 ? "bg-gofarm-green text-white" : "bg-white"}`}>
                      <Grid3x3Icon className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setViewMode("grid"); setGridCols(4); }} className={`h-9 w-9 rounded-lg border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 flex items-center justify-center transition-colors ${viewMode === "grid" && gridCols === 4 ? "bg-gofarm-green text-white" : "bg-white"}`}>
                      <LayoutGridIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setViewMode("grid"); setGridCols(5); }} className={`h-9 w-9 rounded-lg border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 flex items-center justify-center transition-colors ${viewMode === "grid" && gridCols === 5 ? "bg-gofarm-green text-white" : "bg-white"}`}>
                      <Grid5Icon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`h-9 w-9 rounded-lg border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-gofarm-green text-white" : "bg-white"}`}>
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gofarm-light-green/30 rounded-lg bg-white text-sm focus:outline-none focus:border-gofarm-green"
                  >
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="rounded-xl border bg-white border-gofarm-light-green/20 shadow-lg mb-6">
              <div className="p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gofarm-black">Filter by:</span>

                  <button onClick={() => handleFilterType("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === "all" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    All
                  </button>
                  <button onClick={() => handleFilterType("sale")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === "sale" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    Sale
                  </button>
                  <button onClick={() => handleFilterType("featured")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === "featured" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    Featured
                  </button>
                  <button onClick={() => handleFilterType("new")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === "new" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    New
                  </button>
                  <button onClick={() => handleFilterType("hot")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === "hot" ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    Hot
                  </button>

                  <button onClick={() => setShowPriceFilter(!showPriceFilter)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${showPriceFilter ? "bg-gofarm-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gofarm-light-green/20"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Price
                  </button>
                </div>

                {showPriceFilter && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm font-semibold text-gofarm-black mb-3">
                      <span>${dragRange.min}</span>
                      <span className="text-gray-400 text-xs font-normal">Price Range</span>
                      <span>${dragRange.max}</span>
                    </div>
                    <DualRangeSlider
                      min={dragRange.min}
                      max={dragRange.max}
                      globalMin={PRICE_GLOBAL_MIN}
                      globalMax={PRICE_GLOBAL_MAX}
                      onChange={handleDragRange}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-400">${PRICE_GLOBAL_MIN}</span>
                      <button
                        onClick={() => handlePriceChange({ min: PRICE_GLOBAL_MIN, max: PRICE_GLOBAL_MAX })}
                        className="text-xs text-gofarm-green hover:underline font-medium"
                      >
                        Reset
                      </button>
                      <span className="text-xs text-gray-400">${PRICE_GLOBAL_MAX}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4`}>
              {products.map((product) => (
                <ProductCardComponent key={product.id} product={product} viewMode={viewMode as "grid" | "list"} onShare={handleShare} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center rounded-xl bg-gofarm-green px-6 py-2.5 text-white font-semibold shadow-lg shadow-gofarm-green/20 hover:bg-gofarm-light-green transition-colors disabled:opacity-50 text-sm"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                  <span className="ml-2 text-white/80 text-xs">({productCount}/{totalCount})</span>
                </button>
              </div>
            )}

            {/* Product Count */}
            <p className="mt-6 text-gray-500 text-sm text-center">
              Showing <span className="font-bold text-gofarm-black">{productCount}</span> of{" "}
              <span className="font-bold text-gofarm-black">{totalCount}</span> products
            </p>
          </div>
        </main>
      </div>

      {showShareModal && ShareModalComponent && selectedShareProduct && (
        <ShareModalComponent
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={shareUrl}
          title={selectedShareProduct.name}
        />
      )}
    </>
  );
}