"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

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

export default function WishlistPage() {
  const { items: wishlist, removeFromWishlist, totalItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({
    show: false,
    message: "",
    type: "",
  });

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"];

  useEffect(() => {
    setLoading(false);
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeFromWishlist(id);
    showNotification(`${name} removed from wishlist`, "success");
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageSrc: item.imageSrc,
      slug: item.slug,
    });
    showNotification(`${item.name} added to cart!`, "success");
  };

  const addAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageSrc: item.imageSrc,
        slug: item.slug,
      });
    });
    showNotification(`${wishlist.length} item(s) added to cart!`, "success");
  };

  const handleClearAllWishlist = () => {
    if (wishlist.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setShowClearConfirm(false);
    showNotification("All items removed from wishlist", "success");
  };

  const cancelClearWishlist = () => {
    setShowClearConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gofarm-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      {/* Confirm Clear Wishlist Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Entire Wishlist?</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to remove <span className="font-semibold">all items</span> from your wishlist? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmClearWishlist} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Yes, Clear All
                </button>
                <button onClick={cancelClearWishlist} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success" ? "bg-gofarm-green text-white" : "bg-red-500 text-white"
          }`}>
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gofarm-black">My Wishlist</h1>
              <p className="text-gofarm-gray mt-2">
                {totalItems} {totalItems === 1 ? "item" : "items"} saved
              </p>
            </div>
            {wishlist.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={addAllToCart}
                  className="px-4 py-2 bg-gofarm-green text-white text-sm font-semibold rounded-lg hover:bg-gofarm-light-green transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M10 17h4" />
                  </svg>
                  Add All to Cart
                </button>
                <button
                  onClick={handleClearAllWishlist}
                  className="px-4 py-2 bg-white border border-red-200 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              </div>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gofarm-black mb-2">Your wishlist is empty</h2>
              <p className="text-gofarm-gray mb-6">Save your favorite items here</p>
              <Link href="/shop" className="inline-block px-6 py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <Link href={`/product/${item.slug}`} className="block overflow-hidden">
                      <img src={item.imageSrc} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <div className="p-4">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-semibold text-gofarm-black hover:text-gofarm-green transition-colors line-clamp-2 min-h-[48px]">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gofarm-green font-bold text-lg mt-2">${item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gofarm-gray ml-1">(5.0)</span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleAddToCart(item)} className="flex-1 py-2 bg-gofarm-green text-white text-sm font-semibold rounded-lg hover:bg-gofarm-light-green transition-colors">
                          Add to Cart
                        </button>
                        <button onClick={() => handleRemoveFromWishlist(item.id, item.name)} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors group" title="Remove from wishlist">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link href="/shop" className="inline-flex items-center gap-2 text-gofarm-green hover:text-gofarm-light-green font-medium transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gofarm-white border-t border-gofarm-light-gray">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b py-8">
            <a href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-gofarm-green transition-colors"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
              <div><h3 className="font-semibold text-gray-900 group-hover:text-gofarm-green transition-colors">Visit Us</h3><p className="text-gray-600 text-sm mt-1">123 Shopping Street, New York, NY 10001</p></div>
            </a>
            <a href="tel:15551234567" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-gofarm-green transition-colors"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
              <div><h3 className="font-semibold text-gray-900 group-hover:text-gofarm-green transition-colors">Call Us</h3><p className="text-gray-600 text-sm mt-1">+1 (555) 123-4567</p></div>
            </a>
            <div className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-gofarm-green transition-colors"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              <div><h3 className="font-semibold text-gray-900 group-hover:text-gofarm-green transition-colors">Working Hours</h3><p className="text-gray-600 text-sm mt-1">Monday - Friday: 9AM - 6PM</p></div>
            </div>
            <a href="mailto:support@gofarm.com" className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors cursor-pointer rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600 group-hover:text-gofarm-green transition-colors"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
              <div><h3 className="font-semibold text-gray-900 group-hover:text-gofarm-green transition-colors">Email Us</h3><p className="text-gray-600 text-sm mt-1">support@gofarm.com</p></div>
            </a>
          </div>
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="mb-2"><Link href="/"><img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" /></Link></div>
              <p className="text-gofarm-gray text-sm">Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.</p>
              <div className="flex items-center gap-3.5">
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">YouTube</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Facebook</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"><span className="sr-only">Instagram</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.205-.012 3.585-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85 0-3.204.012-3.584.07-4.85.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              </div>
            </div>
            <FooterColumn title="Quick Links" items={quickLinks} />
            <FooterColumn title="Categories" items={categories} />
            <div>
              <h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3>
              <p className="text-gofarm-gray text-sm mb-4">Subscribe to our newsletter to receive updates and exclusive offers.</p>
              <form className="space-y-3">
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gofarm-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-light-green focus:border-gofarm-light-green transition-all text-gofarm-black placeholder:text-gofarm-gray" />
                <button type="submit" className="w-full bg-gofarm-green text-gofarm-white px-4 py-2 rounded-lg hover:bg-gofarm-light-green transition-colors flex items-center justify-center gap-2 font-semibold">
                  Subscribe
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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