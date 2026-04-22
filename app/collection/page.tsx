import Link from "next/link";
import { headers } from "next/headers";
import { ProductCard } from "@/components/home/product-card";
import { loadLocalCatalog, type LocalProduct } from "@/lib/local-catalog";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Collection | gofarm",
  description: "Browse the product collection at gofarm.",
};

export const dynamic = "force-dynamic";

function SparklesIcon({ className }: { className?: string }) {
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
      aria-hidden="true"
    >
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      aria-hidden="true"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function Grid3x3Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function LayoutGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 5h.01" />
      <path d="M3 12h.01" />
      <path d="M3 19h.01" />
      <path d="M8 5h13" />
      <path d="M8 12h13" />
      <path d="M8 19h13" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 5H3" />
      <path d="M12 19H3" />
      <path d="M14 3v4" />
      <path d="M16 17v4" />
      <path d="M21 12h-9" />
      <path d="M21 19h-5" />
      <path d="M21 5h-7" />
      <path d="M8 10v4" />
      <path d="M8 12H3" />
    </svg>
  );
}



export default async function CollectionPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";

  let products: LocalProduct[] = [];

  try {
    const response = await fetch(new URL("/api/products", baseUrl), {
      cache: "no-store",
    });
    if (response.ok) {
      const data = (await response.json()) as {
        products?: LocalProduct[];
      };
      products = data.products ?? [];
    }
  } catch {
    products = [];
  }

  if (products.length === 0) {
    const fallback = await loadLocalCatalog();
    products = fallback.products;
  }

  const visibleProducts = products.slice(0, 25);



  return (
    <div className="bg-linear-to-b from-gofarm-light-green/5 via-gofarm-white to-gofarm-light-orange/5 min-h-screen">
      <main>
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 py-8 lg:py-12">
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
                {products.length} Products
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-gofarm-light-green/30 bg-white p-3 shadow-sm lg:flex-row">
            <div className="relative w-full flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gofarm-gray" />
              <input
                type="text"
                className="h-12 w-full rounded-xl border border-gofarm-light-green/30 bg-transparent pl-14 pr-4 text-sm text-gofarm-black transition-colors placeholder:text-gray-400 focus:border-gofarm-green focus:outline-none focus:ring-1 focus:ring-gofarm-green"
                placeholder="Search products..."
                defaultValue=""
              />
            </div>
            
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <div className="flex gap-2">
                <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-black transition-colors hover:bg-gofarm-light-green/10" title="3 columns">
                  <Grid3x3Icon className="h-5 w-5" />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-black transition-colors hover:bg-gofarm-light-green/10" title="4 columns">
                  <LayoutGridIcon className="h-5 w-5" />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-gofarm-green text-white shadow-sm transition-colors" title="5 columns">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="2" width="4" height="4" />
                    <rect x="10" y="2" width="4" height="4" />
                    <rect x="18" y="2" width="4" height="4" />
                    <rect x="2" y="10" width="4" height="4" />
                    <rect x="10" y="10" width="4" height="4" />
                  </svg>
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-black transition-colors hover:bg-gofarm-light-green/10" title="List view">
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>

              <select className="h-12 cursor-pointer rounded-xl border border-gofarm-light-green/30 bg-white px-4 text-sm font-medium text-gofarm-black outline-none transition-colors hover:border-gofarm-light-green/60 focus:border-gofarm-green focus:ring-1 focus:ring-gofarm-green">
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gofarm-light-green/30 bg-white px-5 text-sm font-semibold text-gofarm-black transition-colors hover:bg-gofarm-light-green/10" type="button">
                <SlidersIcon className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {visibleProducts.length > 0
              ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
              : Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="group rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-[330px] bg-white flex items-center justify-center overflow-hidden px-4 pt-4">
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground shadow">
                        New
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground shadow">
                        -10%
                      </span>
                    </div>
                    <div className="animate-pulse bg-muted h-[240px] w-[180px] rounded-lg" />
                  </div>
                  <div className="px-4 pb-4 pt-2">
                    <div className="animate-pulse bg-muted rounded-md h-5 w-3/4 mb-2" />
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <span key={starIndex} className="text-gray-300 text-[12px]">
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-gofarm-gray text-sm">(0)</span>
                    </div>
                    <div className="flex items-end gap-2 mt-2 mb-4 flex-wrap">
                      <div className="animate-pulse bg-muted rounded-md h-7 w-20" />
                      <div className="animate-pulse bg-muted rounded-md h-5 w-16" />
                      <div className="animate-pulse bg-muted rounded-md h-5 w-10" />
                    </div>
                    <div className="h-12 rounded-[8px] bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-12 mb-12 text-center">
            <button className="inline-flex items-center justify-center rounded-xl bg-gofarm-green px-12 py-4 text-white font-semibold shadow-lg shadow-gofarm-green/20 hover:bg-gofarm-light-green transition-colors">
              Load More Products
              <span className="ml-3 text-white/80">({Math.min(visibleProducts.length, products.length)} of {products.length})</span>
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
