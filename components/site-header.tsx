"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/deal", label: "Hot Deal" },
  { href: "/collection", label: "Collection" },
  { href: "/compare", label: "Compare" },
  { href: "/stores", label: "Local Stores" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function IconCart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "text-sm lg:text-[15px] font-semibold transition-colors duration-200",
        active ? "text-gofarm-green" : "text-gofarm-gray hover:text-gofarm-green",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-gofarm-white/95 backdrop-blur-md border-b border-gofarm-light-gray shadow-sm">
      <div className="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="font-medium">Get the Full Production Code!</span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-yellow-200 transition-colors"
            href="https://buymeacoffee.com/reactbd/e/484104"
          >
            {"Buy Now ->"}
          </a>
        </div>
      </div>

      <div className="border-b border-gofarm-light-gray">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4">
          <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
            <Link href="/" className="shrink-0">
              <img alt="logo" loading="lazy" width="150" height="150" className="w-auto h-8" src="/images/logo.svg" />
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl">
              <button
                className="group flex items-center w-full gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gofarm-light-green rounded-lg px-3 py-2 transition-all duration-200 min-w-[200px]"
                aria-label="Open search (Ctrl+K)"
                type="button"
              >
                <span className="text-gray-400 group-hover:text-gofarm-green transition-colors duration-200">
                  <IconSearch />
                </span>
                <span className="sm:text-xs md:text-md text-gray-500 group-hover:text-gray-700 transition-colors duration-200 flex-1 text-left">
                  Search <span className="hidden md:inline-block">products...</span>
                </span>
                <div className="flex items-center gap-1 bg-white border border-gray-200 group-hover:border-gray-300 px-2 py-1 rounded text-xs text-gray-500 font-mono shrink-0 transition-colors duration-200">
                  <span>Ctrl</span>
                  <span>K</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/cart" className="group relative text-gofarm-black">
                  <IconCart />
                  <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px]">
                    0
                  </span>
                </Link>
                <Link href="/wishlist" className="group relative text-gofarm-black">
                  <IconHeart />
                  <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-3.5 h-3.5">
                    0
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2.5 py-2 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gofarm-gray"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </Link>
              </div>

              <div className="hidden md:flex lg:hidden items-center gap-2">
                <Link href="/cart" className="group relative text-gofarm-black">
                  <IconCart />
                  <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px]">
                    0
                  </span>
                </Link>
                <Link href="/wishlist" className="group relative text-gofarm-black">
                  <IconHeart />
                  <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-3.5 h-3.5">
                    0
                  </span>
                </Link>
                <div className="flex items-center gap-2 py-2 px-2.5 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>

              <div className="flex md:hidden items-center gap-1">
                <Link href="/cart" className="group relative text-gofarm-black">
                  <IconCart />
                  <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px]">
                    0
                  </span>
                </Link>
                <div className="flex items-center py-2 px-2 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gofarm-white">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4">
          <div className="flex items-center justify-between py-2 lg:py-3 gap-4">
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 overflow-x-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>
            <div className="md:hidden text-sm font-semibold text-gofarm-green">gofarm</div>
            <div className="text-sm font-semibold text-gofarm-gray">Need Help?</div>
          </div>
        </div>
      </div>
    </header>
  );
}
