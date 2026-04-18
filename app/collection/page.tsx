import Link from "next/link";
import { headers } from "next/headers";
import SiteHeader from "@/components/site-header";
import { ProductCard } from "@/components/home/product-card";
import { loadLocalCatalog, type LocalProduct } from "@/lib/local-catalog";

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

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"];

  return (
    <div className="bg-linear-to-b from-gofarm-light-green/5 via-gofarm-white to-gofarm-light-orange/5 min-h-screen">
      <SiteHeader />

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

          <div className="rounded-xl border bg-card text-card-foreground mb-8 border-gofarm-light-green/20 shadow-lg bg-linear-to-br from-gofarm-white via-gofarm-light-orange/5 to-gofarm-light-green/5">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gofarm-gray" />
                  <input
                    type="text"
                    className="flex h-9 w-full border bg-transparent px-3 shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12 pr-4 py-6 text-base border-gofarm-light-green/30 focus:border-gofarm-green focus:ring-gofarm-green rounded-xl"
                    placeholder="Search products..."
                    defaultValue=""
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center" title="3 columns">
                    <Grid3x3Icon className="w-5 h-5" />
                  </button>
                  <button className="h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center" title="4 columns">
                    <LayoutGridIcon className="w-5 h-5" />
                  </button>
                  <button className="h-12 w-12 rounded-xl bg-gofarm-green text-white inline-flex items-center justify-center" title="5 columns">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="2" y="2" width="4" height="4" />
                      <rect x="10" y="2" width="4" height="4" />
                      <rect x="18" y="2" width="4" height="4" />
                      <rect x="2" y="10" width="4" height="4" />
                      <rect x="10" y="10" width="4" height="4" />
                    </svg>
                  </button>
                  <button className="h-12 w-12 rounded-xl border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 inline-flex items-center justify-center" title="List view">
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
                <select className="px-4 py-3 border border-gofarm-light-green/30 rounded-xl bg-gofarm-white text-gofarm-black focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20">
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <button className="inline-flex items-center justify-center gap-2 border border-gofarm-light-green/30 hover:bg-gofarm-light-green/10 rounded-xl px-6 py-6" type="button">
                  <SlidersIcon className="w-5 h-5 mr-2" />
                  Filters
                </button>
              </div>
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

          <div className="mt-14 text-center">
            <button className="inline-flex items-center justify-center rounded-xl bg-gofarm-green px-12 py-4 text-white font-semibold shadow-lg shadow-gofarm-green/20 hover:bg-gofarm-light-green transition-colors">
              Load More Products
              <span className="ml-3 text-white/80">({Math.min(visibleProducts.length, products.length)} of {products.length})</span>
            </button>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="h-10 w-10 rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-gray hover:bg-gofarm-light-green/10 inline-flex items-center justify-center" aria-label="Previous page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button className="h-12 min-w-12 rounded-xl border border-gofarm-light-green/30 bg-gofarm-green text-white font-semibold px-4">1</button>
              <button className="h-12 min-w-12 rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-black font-semibold px-4 hover:bg-gofarm-light-green/10">2</button>
              <button className="h-10 w-10 rounded-xl border border-gofarm-light-green/30 bg-white text-gofarm-gray hover:bg-gofarm-light-green/10 inline-flex items-center justify-center" aria-label="Next page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <p className="mt-8 text-gofarm-gray text-lg">
              Showing <span className="font-bold text-gofarm-black">{Math.min(visibleProducts.length, products.length)}</span> of{" "}
              <span className="font-bold text-gofarm-black">{products.length}</span> products
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
            <a
              href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Visit Us</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">123 Shopping Street, Commerce District, New York, NY 10001, USA</p>
              </div>
            </a>

            <a href="tel:15551234567" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Call Us</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</p>
              </div>
            </a>

            <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Working Hours</h3>
                <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 transition-colors">Monday - Friday: 9AM - 6PM</p>
              </div>
            </div>

            <a href="mailto:support@gofarm.com" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" aria-hidden="true">
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
                <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">YouTube</span></a>
                <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
                <a href="https://www.youtube.com/@reactjsBD" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Social</span></a>
              </div>
            </div>

            <FooterColumn title="Quick Links" items={quickLinks} />
            <FooterColumn title="Categories" items={categories} />

            <div>
              <h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3>
              <p className="text-gofarm-gray text-sm mb-4">Subscribe to our newsletter to receive updates and exclusive offers.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green disabled:bg-gofarm-light-gray/50 disabled:cursor-not-allowed transition-all text-gofarm-black placeholder:text-gofarm-gray"
                />
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
