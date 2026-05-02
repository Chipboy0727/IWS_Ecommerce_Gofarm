"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import { SearchModal as ProductSearchModal } from "@/components/search-modal";
import { toast } from "sonner";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/deal", label: "Hot Deal" },
  { href: "/collection", label: "Collection" },
  { href: "/store-list", label: "Local Stores" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
  { href: "/help", label: "Need Help?" },
];

// Promo messages for marquee
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

// Icons - ĐÃ TĂNG KÍCH THƯỚC
function IconCart() {
  return (
    <svg width="24" height="24" className="sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="24" height="24" className="sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg width="24" height="24" className="sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="20" height="20" className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" className="sm:w-[20px] sm:h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="22" height="22" className="sm:w-[24px] sm:h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="24" height="24" className="sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg width="14" height="14" className="sm:w-[16px] sm:h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// Promo Marquee Component
function PromoMarquee() {
  const allMessages = [...promoMessages, ...promoMessages];

  return (
    <div className="bg-linear-to-r from-gofarm-green to-emerald-600 text-white overflow-hidden whitespace-nowrap py-1.5 sm:py-2 relative cursor-default">
      <div className="animate-marquee inline-flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {allMessages.map((promo, idx) => (
          <div key={idx} className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">{promo.icon}</span>
            <span className="text-[10px] sm:text-xs md:text-sm font-medium">{promo.text}</span>
            <span className="text-white/40 text-sm md:text-base lg:text-lg ml-1">•</span>
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-gofarm-green to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-l from-emerald-600 to-transparent pointer-events-none" />
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const isHelp = label === "Need Help?";
  return (
    <Link
      href={href}
      className={[
        "relative group text-sm sm:text-base lg:text-[17px] font-semibold transition-colors duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-1",
        active ? "text-gofarm-green" : "text-gofarm-gray hover:text-gofarm-green",
      ].join(" ")}
    >
      {isHelp && <IconHelp />}
      <span>{label}</span>
      <span
        className={[
          "absolute bottom-0 left-0 h-0.5 bg-gofarm-green transition-all duration-300",
          active ? "w-full" : "w-0 group-hover:w-full"
        ].join(" ")}
      />
    </Link>
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
      <div className="fixed top-0 left-0 z-50 h-full w-[260px] sm:w-[280px] md:w-[300px] bg-white shadow-2xl transform transition-transform">
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-bold text-gofarm-black">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <IconX />
          </button>
        </div>
        <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`text-sm sm:text-base flex items-center gap-2 ${pathname === item.href ? "text-gofarm-green font-semibold" : "text-gofarm-gray"}`}
            >
              {item.label === "Need Help?" && <IconHelp />}
              {item.label}
            </Link>
          ))}
          <div className="border-t pt-3 sm:pt-4 mt-2">
            {isLoggedIn ? (
              <>
                <Link href="/account" onClick={onClose} className="block py-1.5 sm:py-2 text-sm sm:text-base text-gofarm-gray">My Account</Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST" });
                    } catch (e) { }
                    localStorage.removeItem("user");
                    localStorage.removeItem("cart");
                    localStorage.removeItem("wishlist");
                    window.dispatchEvent(new Event("auth-changed"));
                    window.location.href = "/";
                    onClose();
                  }}
                  className="block w-full text-left py-1.5 sm:py-2 text-sm sm:text-base text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={onClose} className="block py-1.5 sm:py-2 text-sm sm:text-base text-gofarm-green font-semibold">Sign In</Link>
                <Link href="/sign-up" onClick={onClose} className="block py-1.5 sm:py-2 text-sm sm:text-base text-gofarm-gray">Sign Up</Link>
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

  // Hide header on admin pages, checkout, cart
  if (pathname.startsWith("/admin") || pathname === "/checkout" || pathname === "/cart") {
    return null;
  }

  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [mounted, setMounted] = useState(false);
  const isRefreshingRef = useRef(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);

  // Load user data - runs once on mount
  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name || userData.email?.split("@")[0] || "User");
        setUserEmail(userData.email || "");
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchUnreadCount = async () => {
        try {
          const res = await fetch(`/api/user/messages/unread-count?email=${encodeURIComponent(userEmail)}`);
          const data = await res.json();
          setUnreadMessages(data.count || 0);
        } catch (e) { }
      };
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  // Load order count from localStorage - runs once when userEmail is set
  useEffect(() => {
    if (userEmail && initialLoadRef.current) {
      initialLoadRef.current = false;
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        try {
          const allOrders = JSON.parse(storedOrders);
          const activeOrders = allOrders.filter(
            (order: any) => order.customerEmail === userEmail && order.status !== "cancelled"
          );
          setOrderCount(activeOrders.length);
        } catch (e) { }
      }

      // Fetch from API on first load
      const fetchInitialOrders = async () => {
        try {
          const response = await fetch("/api/orders", { credentials: "include" });
          if (response.ok) {
            const data = await response.json();
            const orders = data.orders ?? [];
            const activeOrders = orders.filter(
              (order: any) => order.customerEmail === userEmail && order.status !== "cancelled"
            );
            setOrderCount(activeOrders.length);
          }
        } catch (error) {
          toast.error("Failed to fetch orders. Please try again later.");
        }
      };
      fetchInitialOrders();
    }
  }, [userEmail]);

  // Reuse the same order refresh logic across header events.
  const fetchOrdersCount = useCallback(async () => {
    if (!userEmail || isRefreshingRef.current) return;

    isRefreshingRef.current = true;

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    try {
      const response = await fetch("/api/orders", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const orders = data.orders ?? [];
        const activeOrders = orders.filter(
          (order: any) => order.customerEmail === userEmail && order.status !== "cancelled"
        );
        setOrderCount(activeOrders.length);
      }
    } catch (error) {
      toast.error("Failed to fetch orders. Please try again later.");
    } finally {
      refreshTimerRef.current = setTimeout(() => {
        isRefreshingRef.current = false;
      }, 1000);
    }
  }, [userEmail]);

  // Listen for orders-updated event
  useEffect(() => {
    const handleOrdersUpdate = () => {
      fetchOrdersCount();
    };

    window.addEventListener("orders-updated", handleOrdersUpdate);
    return () => {
      window.removeEventListener("orders-updated", handleOrdersUpdate);
    };
  }, [fetchOrdersCount]);

  // Listen for order-cancelled event - decrement by 1
  useEffect(() => {
    const handleOrderCancelled = () => {
      if (userEmail) {
        setOrderCount(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("order-cancelled", handleOrderCancelled);
    return () => window.removeEventListener("order-cancelled", handleOrderCancelled);
  }, [userEmail]);

  // Listen for orders-cleared event - clear all orders
  useEffect(() => {
    const handleOrdersCleared = () => {
      if (userEmail) {
        setOrderCount(0);
      }
    };

    window.addEventListener("orders-cleared", handleOrdersCleared);
    return () => window.removeEventListener("orders-cleared", handleOrdersCleared);
  }, [userEmail]);

  // Listen for auth-changed event
  useEffect(() => {
    const handleAuthChange = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserName(userData.name || userData.email?.split("@")[0] || "User");
          setUserEmail(userData.email || "");
          initialLoadRef.current = true;
          setTimeout(() => fetchOrdersCount(), 500);
        } catch (e) { }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setOrderCount(0);
        initialLoadRef.current = true;
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [fetchOrdersCount]);

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

  const handleLogout = async () => {
    try {
      // Clear the server session cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      toast.error("Logout failed. Please try again.");
    }

    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    // Reset local state
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setOrderCount(0);

    // Notify other components
    window.dispatchEvent(new Event("auth-changed"));

    // Go to home page
    router.push("/");
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        {/* Promo Marquee */}
        <PromoMarquee />

        {/* Main header */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
            <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5 gap-3 sm:gap-4 md:gap-5">

              {/* Logo */}
              <Link href="/" className="shrink-0">
                <img alt="logo" className="w-auto h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16" src="/images/gofarmnamelogo.png" />
              </Link>

              {/* Search bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-lg lg:max-w-2xl xl:max-w-3xl mx-3 sm:mx-4 lg:mx-6">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="group flex items-center w-full gap-2 sm:gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gofarm-light-green rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 transition-all"
                >
                  <span className="text-gray-400 group-hover:text-gofarm-green">
                    <IconSearch />
                  </span>
                  <span className="text-sm sm:text-base text-gray-500 group-hover:text-gray-700 flex-1 text-left">
                    Search products...
                  </span>
                  <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-[11px] sm:text-xs text-gray-500 font-mono">
                    <span>Ctrl</span>
                    <span>K</span>
                  </div>
                </button>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                {/* Search - Mobile */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gofarm-green transition-colors"
                >
                  <IconSearch />
                </button>

                {/* Cart - ĐÃ TĂNG KÍCH THƯỚC BADGE */}
                <Link href="/cart" className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-gofarm-green transition-colors">
                  <IconCart />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gofarm-green text-white text-[10px] sm:text-[11px] md:text-xs font-semibold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] md:min-w-[22px] md:h-[22px] flex items-center justify-center px-1">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist - ĐÃ TĂNG KÍCH THƯỚC BADGE */}
                <Link href="/wishlist" className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-gofarm-green transition-colors">
                  <IconHeart />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] sm:text-[11px] md:text-xs font-semibold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] md:min-w-[22px] md:h-[22px] flex items-center justify-center px-1">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Notifications Bell */}
                <Link href="/account/messages" className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-gofarm-green transition-colors">
                  <IconBell />
                  {mounted && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-[11px] md:text-xs font-semibold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] md:min-w-[22px] md:h-[22px] flex items-center justify-center px-1 animate-bounce">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                {/* Orders - ĐÃ TĂNG KÍCH THƯỚC BADGE */}
                <Link href="/orders" className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-gofarm-green transition-colors">
                  <IconOrders />
                  {mounted && orderCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] sm:text-[11px] md:text-xs font-semibold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] md:min-w-[22px] md:h-[22px] flex items-center justify-center px-1">
                      {orderCount > 99 ? "99+" : orderCount}
                    </span>
                  )}
                </Link>

                {/* User menu - Desktop */}
                <div className="hidden lg:block relative min-w-[100px] flex justify-end">
                  {mounted && isLoggedIn ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl border border-gray-200 hover:border-gofarm-green transition-all"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gofarm-green flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-800 hidden xl:inline">
                          {userName}
                        </span>
                      </button>
                      {isUserDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                          <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                            <div className="p-2.5 sm:p-3 border-b">
                              <p className="font-semibold text-gray-800 text-sm">{userName}</p>
                              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{userEmail}</p>
                            </div>
                            <div className="py-2">
                              <Link href="/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-sm hover:bg-gray-50">
                                <IconUser /> My Profile
                              </Link>
                              <div className="border-t my-1" />
                              <button onClick={handleLogout} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                                <IconLogout /> Sign Out
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : mounted ? (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Link href="/sign-in" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-gofarm-green hover:bg-gofarm-green/10 rounded-lg transition-colors">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <div className="h-10 w-24 bg-gray-100/50 animate-pulse rounded-lg" />
                  )}
                </div>

                {/* Mobile menu button */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
                  <IconMenu />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="hidden md:block bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
            <nav className="flex items-center justify-center gap-5 sm:gap-7 md:gap-9 lg:gap-12 py-1.5 sm:py-2 lg:py-2.5">
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

      <ProductSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}