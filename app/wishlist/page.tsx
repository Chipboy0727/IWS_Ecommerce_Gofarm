"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";

export default function WishlistPage() {
  const { items: wishlist, removeFromWishlist, totalItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  // Auto-select items when selectAll changes
  useEffect(() => {
    if (selectAll) {
      const allIds = new Set(wishlist.map(item => item.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  }, [selectAll, wishlist]);

  // Update selectAll when selections change
  useEffect(() => {
    if (wishlist.length > 0 && selectedItems.size === wishlist.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, wishlist]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleToggleItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Move selected items to cart
  const handleMoveSelectedToCart = () => {
    if (selectedItems.size === 0) return;
    
    const selectedProducts = wishlist.filter(item => selectedItems.has(item.id));
    selectedProducts.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageSrc: item.imageSrc,
        slug: item.slug,
      });
      removeFromWishlist(item.id);
    });
    showNotification(`${selectedItems.size} item(s) moved to cart!`, "success");
    setSelectedItems(new Set());
    setSelectAll(false);
  };

  // Move single item to cart
  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageSrc: item.imageSrc,
      slug: item.slug,
    });
    removeFromWishlist(item.id);
    showNotification(`${item.name} moved to cart!`, "success");
  };

  // Remove single item
  const handleRemoveItem = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from wishlist?`)) {
      removeFromWishlist(id);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      showNotification(`${name} removed from wishlist`, "success");
    }
  };

  // Clear all wishlist
  const handleClearAllWishlist = () => {
    if (wishlist.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setSelectedItems(new Set());
    setSelectAll(false);
    setShowClearConfirm(false);
    showNotification("All items removed from wishlist", "success");
  };

  const cancelClearWishlist = () => {
    setShowClearConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gofarm-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      {/* Confirm Clear Wishlist Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-3 sm:mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">Clear Entire Wishlist?</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">Are you sure you want to remove all items from your wishlist? This action cannot be undone.</p>
              <div className="flex gap-2 sm:gap-3">
                <button onClick={confirmClearWishlist} className="flex-1 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Yes, Clear All</button>
                <button onClick={cancelClearWishlist} className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-20 sm:top-24 right-3 sm:right-4 z-50 animate-slideIn">
          <div className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs sm:text-sm ${
            notification.type === "success" ? "bg-gofarm-green text-white" : "bg-red-500 text-white"
          }`}>
            {notification.type === "success" ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-gray-200 p-4 sm:p-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gofarm-black">My Wishlist</h1>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gofarm-gray">
                  {totalItems} {totalItems === 1 ? "item" : "items"} saved
                  {selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
                </p>
              </div>
              {wishlist.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleMoveSelectedToCart}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gofarm-green text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-gofarm-light-green transition-colors flex items-center gap-1.5 sm:gap-2"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M10 17h4" />
                      </svg>
                      Move to Cart ({selectedItems.size})
                    </button>
                  )}
                  <button
                    onClick={handleClearAllWishlist}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-red-200 bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 transition-colors hover:bg-red-100 text-xs sm:text-sm"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {wishlist.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gofarm-black mb-1.5 sm:mb-2">Your wishlist is empty</h2>
                <p className="text-sm sm:text-base text-gofarm-gray mb-5 sm:mb-6">Save your favorite items here</p>
                <Link href="/shop" className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors text-sm sm:text-base">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {/* Select All Bar */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-gofarm-green focus:ring-gofarm-green"
                    />
                    <span className="font-medium text-gofarm-black text-sm sm:text-base">Select All</span>
                    <span className="text-xs sm:text-sm text-gray-500">({wishlist.length} items)</span>
                  </label>
                  {selectedItems.size > 0 && (
                    <p className="text-xs sm:text-sm text-gofarm-green font-medium">{selectedItems.size} selected</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {wishlist.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <div key={item.id} className={`group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 ${isSelected ? 'ring-2 ring-gofarm-green' : ''}`}>
                        {/* Checkbox overlay on image */}
                        <div className="relative">
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(item.id)}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-white bg-white/80 text-gofarm-green focus:ring-gofarm-green shadow-sm cursor-pointer"
                            />
                          </div>
                          <Link href={`/shop/${item.slug}`} className="block overflow-hidden">
                            <img src={item.imageSrc} alt={item.name} className="w-full h-36 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                          </Link>
                        </div>
                        <div className="p-3 sm:p-4">
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="font-semibold text-gofarm-black hover:text-gofarm-green transition-colors line-clamp-2 min-h-[40px] sm:min-h-[48px] text-sm sm:text-base break-words">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-gofarm-green font-bold text-base sm:text-lg mt-1.5 sm:mt-2">${item.price.toFixed(2)}</p>
                          
                          <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 mt-1.5 sm:mt-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-[10px] sm:text-xs text-gofarm-gray ml-0.5 sm:ml-1">(5.0)</span>
                          </div>

                          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                            <button 
                              onClick={() => handleMoveToCart(item)} 
                              className="flex-1 py-1.5 sm:py-2 bg-gofarm-green text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-gofarm-light-green transition-colors"
                            >
                              Move to Cart
                            </button>
                            <button 
                              onClick={() => handleRemoveItem(item.id, item.name)} 
                              className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors group" 
                              title="Remove from wishlist"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 sm:mt-10 text-center">
                  <Link href="/shop" className="inline-flex items-center gap-1.5 sm:gap-2 text-gofarm-green hover:text-gofarm-light-green font-medium transition-colors text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer is rendered by root layout */}
    </div>
  );
}