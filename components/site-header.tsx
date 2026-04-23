"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/deal", label: "Hot Deal" },
  { href: "/collection", label: "Collection" },
  { href: "/store-list", label: "Local Stores" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Need Help?" },
];

// Promo messages for marquee - chỉ text, không link
const promoMessages = [
  { icon: "🛍️", text: "Discover fresh and clean produce!" },
  { icon: "🚚", text: "Free shipping on orders over $50!" },
  { icon: "🔥", text: "Hot Deals - Up to 30% off!" },
  { icon: "✨", text: "New customers get 15% off first order!" },
  { icon: "🎁", text: "Buy 2 Get 1 Free on selected items!" },
  { icon: "⭐", text: "Join our loyalty program & earn points!" },
  { icon: "🌿", text: "100% Organic & Fresh Guaranteed!" },
  { icon: "🎉", text: "Weekend Flash Sale - Extra 10% off!" },
];

// Icons
function IconCart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// Promo Marquee Component - chỉ text chạy, không link, không click
function PromoMarquee() {
  const allMessages = [...promoMessages, ...promoMessages];

  return (
    <div className="bg-linear-to-r from-gofarm-green to-emerald-600 text-white overflow-hidden whitespace-nowrap py-2.5 relative cursor-default">
      <div className="animate-marquee inline-flex items-center gap-10">
        {allMessages.map((promo, idx) => (
          <div key={idx} className="inline-flex items-center gap-3">
            <span className="text-xl">{promo.icon}</span>
            <span className="font-medium">{promo.text}</span>
            <span className="text-white/40 text-lg ml-2">•</span>
          </div>
        ))}
      </div>
      
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gofarm-green to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-emerald-600 to-transparent pointer-events-none" />
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const isHelp = label === "Need Help?";
  return (
    <Link
      href={href}
      className={[
        "text-base lg:text-[17px] font-semibold transition-colors duration-200 inline-flex items-center gap-1.5",
        active ? "text-gofarm-green" : "text-gofarm-gray hover:text-gofarm-green",
      ].join(" ")}
    >
      {isHelp && <IconHelp />}
      {label}
    </Link>
  );
}

// Search Modal
function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&limit=10`);
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleProductClick = (slug: string) => {
    router.push(`/shop/${slug}`);
    onClose();
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length === 1) {
      handleProductClick(results[0].slug);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-x-0 top-0 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-3 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-gofarm-green"
            />
            <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2">
              <IconX />
            </button>
          </div>

          {searchTerm.length > 0 && (
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Found {results.length} results</p>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <img src={product.imageSrc} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gofarm-green">${product.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile Menu
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gofarm-black">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <IconX />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`text-base flex items-center gap-2 ${pathname === item.href ? "text-gofarm-green font-semibold" : "text-gofarm-gray"}`}
            >
              {item.label === "Need Help?" && <IconHelp />}
              {item.label}
            </Link>
          ))}
          <div className="border-t pt-4 mt-2">
            {isLoggedIn ? (
              <>
                <Link href="/account" onClick={onClose} className="block py-2 text-gofarm-gray">My Account</Link>
                <Link href="/orders" onClick={onClose} className="block py-2 text-gofarm-gray">My Orders</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("cart");
                    localStorage.removeItem("wishlist");
                    window.location.href = "/";
                  }}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={onClose} className="block py-2 text-gofarm-green font-semibold">Sign In</Link>
                <Link href="/sign-up" onClick={onClose} className="block py-2 text-gofarm-gray">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Main Header Component
export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [, forceUpdate] = useState(0);

  // Load user data
  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserName(userData.name || userData.email?.split("@")[0] || "User");
          setUserEmail(userData.email || "");
        } catch (e) {}
      }
    };
    loadUser();
  }, []);

  // Listen for auth-changed event (đăng nhập/đăng xuất từ trang khác)
  useEffect(() => {
    const handleAuthChange = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserName(userData.name || userData.email?.split("@")[0] || "User");
          setUserEmail(userData.email || "");
        } catch (e) {}
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setOrderCount(0);
      }
      forceUpdate(prev => prev + 1);
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  // Function to get active orders count (not cancelled)
  const getActiveOrdersCount = useCallback(() => {
    if (!userEmail) return 0;
    
    const storedOrders = localStorage.getItem("orders");
    if (!storedOrders) return 0;
    
    try {
      const allOrders = JSON.parse(storedOrders);
      // Chỉ lấy đơn hàng của user hiện tại và chưa bị hủy
      const activeOrders = allOrders.filter(
        (order: any) => order.customerEmail === userEmail && order.status !== "cancelled"
      );
      return activeOrders.length;
    } catch (e) {
      return 0;
    }
  }, [userEmail]);

  // Load order count when userEmail changes or when orders-updated event fires
  useEffect(() => {
    if (userEmail) {
      setOrderCount(getActiveOrdersCount());
    }
  }, [userEmail, getActiveOrdersCount]);

  // Listen for orders-updated event
  useEffect(() => {
    const handleOrdersUpdate = () => {
      if (userEmail) {
        setOrderCount(getActiveOrdersCount());
      }
      forceUpdate(prev => prev + 1);
    };
    
    window.addEventListener("orders-updated", handleOrdersUpdate);
    return () => window.removeEventListener("orders-updated", handleOrdersUpdate);
  }, [userEmail, getActiveOrdersCount]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    setIsLoggedIn(false);
    setUserEmail("");
    setOrderCount(0);
    router.push("/");
  };

  // Ẩn Header nếu đang ở trang Admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-gofarm-white/95 backdrop-blur-md border-b border-gofarm-light-gray shadow-sm">
        {/* Promo Marquee */}
        <PromoMarquee />

        {/* Main header */}
        <div className="border-b border-gofarm-light-gray">
          <div className="max-w-(--breakpoint-xl) mx-auto px-4">
            <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <img alt="logo" className="w-auto h-8" src="/images/logo.svg" />
              </Link>

              {/* Search bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="group flex items-center w-full gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gofarm-light-green rounded-lg px-3 py-2 transition-all"
                >
                  <span className="text-gray-400 group-hover:text-gofarm-green">
                    <IconSearch />
                  </span>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 flex-1 text-left">
                    Search products...
                  </span>
                  <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-500 font-mono">
                    <span>Ctrl</span>
                    <span>K</span>
                  </div>
                </button>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Cart */}
                <Link href="/cart" className="relative hover:text-gofarm-green transition-colors">
                  <IconCart />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gofarm-green text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist */}
                <Link href="/wishlist" className="relative hover:text-gofarm-green transition-colors">
                  <IconHeart />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Orders - Hiển thị số đơn chưa hủy */}
                <Link href="/orders" className="relative hover:text-gofarm-green transition-colors">
                  <IconOrders />
                  {orderCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {orderCount > 99 ? "99+" : orderCount}
                    </span>
                  )}
                </Link>

                {/* User menu - Desktop */}
                <div className="hidden lg:block relative">
                  {isLoggedIn ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-gray-200 hover:border-gofarm-green transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-gofarm-green flex items-center justify-center text-white font-semibold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gofarm-black hidden xl:inline">
                          {userName}
                        </span>
                      </button>
                      {isUserDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                            <div className="p-3 border-b">
                              <p className="font-semibold text-gofarm-black">{userName}</p>
                            </div>
                            <div className="py-2">
                              <Link href="/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50">
                                <IconUser /> My Account
                              </Link>
                            
                              <div className="border-t my-1" />
                              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                                <IconLogout /> Sign Out
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link href="/sign-in" className="px-4 py-2 text-[15px] font-semibold text-gofarm-green hover:bg-gofarm-green/10 rounded-lg transition-colors">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="px-4 py-2 text-[15px] font-semibold bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <IconMenu />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="hidden md:block bg-gofarm-white">
          <div className="max-w-(--breakpoint-xl) mx-auto px-4">
            <nav className="flex items-center justify-center gap-8 lg:gap-10 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}