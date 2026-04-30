"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart-context";

// Mock product data with stock information
const getProductStock = (productId: string): number => {
  const stockMap: Record<string, number> = {
    "prod_001": 50,
    "prod_002": 10,
    "prod_003": 0,
    "prod_004": 25,
    "prod_005": 3,
    "prod_006": 100,
  };
  return stockMap[productId] ?? 999;
};

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showReviewOrder, setShowReviewOrder] = useState(false);
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});
  const [showStockWarning, setShowStockWarning] = useState(false);
  
  // Selected items for checkout
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Check stock for each item when quantity changes
  useEffect(() => {
    const errors: Record<string, string> = {};
    cartItems.forEach((item) => {
      const stock = getProductStock(item.id);
      if (item.quantity > stock) {
        errors[item.id] = `Only ${stock} items available in stock`;
      } else if (stock === 0) {
        errors[item.id] = "This product is currently out of stock";
      }
    });
    setStockErrors(errors);
  }, [cartItems]);

  // Update selectAll when selections change
  useEffect(() => {
    const validItems = cartItems.filter(item => getProductStock(item.id) > 0);
    if (validItems.length === 0) {
      setSelectAll(false);
    } else {
      const allSelected = validItems.every(item => selectedItems.has(item.id));
      setSelectAll(allSelected);
    }
  }, [selectedItems, cartItems]);

  // Handle Select All
  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allIds = new Set(
        cartItems
          .filter(item => getProductStock(item.id) > 0)
          .map(item => item.id)
      );
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
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

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const stock = getProductStock(id);
    if (quantity > stock) {
      alert(`Cannot add more than ${stock} items. Only ${stock} left in stock.`);
      return;
    }
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    setShowConfirm(id);
  };

  const confirmRemove = (id: string) => {
    removeFromCart(id);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setShowConfirm(null);
  };

  const cancelRemove = () => {
    setShowConfirm(null);
  };

  const handleClearCart = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setSelectedItems(new Set());
    setSelectAll(false);
    setShowClearConfirm(false);
  };

  const cancelClearCart = () => {
    setShowClearConfirm(false);
  };

  const applyPromo = () => {
    const subtotal = getSelectedSubtotal();
    if (promoCode.toUpperCase() === "SAVE10" && !promoApplied) {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === "SAVE20" && !promoApplied) {
      setDiscount(subtotal * 0.2);
      setPromoApplied(true);
    } else {
      alert("Invalid promo code or already applied");
    }
  };

  // Calculate totals based on selected items only
  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems.has(item.id));
  };

  const getSelectedSubtotal = () => {
    return getSelectedItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getSelectedTotalItems = () => {
    return getSelectedItems().reduce((sum, item) => sum + item.quantity, 0);
  };

  const subtotal = getSelectedSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.1;
  const finalTotal = subtotal - discount + shipping + tax;
  const selectedCount = selectedItems.size;
  const selectedTotalItems = getSelectedTotalItems();

  // Check if any selected item has stock issue
  const hasStockIssues = () => {
    return getSelectedItems().some(item => stockErrors[item.id]);
  };

  const handleProceedToCheckout = () => {
    if (selectedCount === 0) {
      alert("Please select at least one item to checkout");
      return;
    }

    if (hasStockIssues()) {
      setShowStockWarning(true);
      return;
    }

    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", "/cart");
      router.push("/sign-in");
    } else {
      setShowReviewOrder(true);
    }
  };

  const confirmOrder = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/sign-in");
      return;
    }
    
    localStorage.setItem("checkoutItems", JSON.stringify(getSelectedItems()));
    setShowReviewOrder(false);
    router.push("/checkout");
  };

  const cancelOrder = () => {
    setShowReviewOrder(false);
  };

  const closeStockWarning = () => {
    setShowStockWarning(false);
  };

  const selectedItemsList = getSelectedItems();
  const availableItemsCount = cartItems.filter(item => getProductStock(item.id) > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      {/* Stock Warning Modal */}
      {showStockWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl mx-3 sm:mx-0">
            <div className="p-4 sm:p-6 text-center">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Stock Issue</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Some selected items have stock issues:</p>
              <div className="bg-red-50 rounded-lg p-2.5 sm:p-3 mb-4 sm:mb-6 text-left max-h-32 overflow-y-auto">
                {Object.entries(stockErrors).map(([id, error]) => {
                  const item = cartItems.find(i => i.id === id);
                  if (item && selectedItems.has(id)) {
                    return (
                      <p key={id} className="text-xs sm:text-sm text-red-600 mb-1">
                        • {item?.name}: {error}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={closeStockWarning}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gofarm-green text-white rounded-xl font-semibold hover:bg-gofarm-light-green transition-colors text-sm sm:text-base"
              >
                Update Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Review Order */}
      {showReviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl mx-3 sm:mx-0">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gofarm-black">Review Your Order</h2>
              <button onClick={cancelOrder} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-gofarm-black mb-2 sm:mb-3 text-sm sm:text-base">Order Items ({selectedTotalItems})</h3>
                <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
                  {selectedItemsList.map((item) => {
                    const stock = getProductStock(item.id);
                    const isLowStock = stock > 0 && stock <= 5;
                    return (
                      <div key={item.id} className="flex gap-2 sm:gap-3 py-2 border-b border-gray-100">
                        <img src={item.imageSrc} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-medium text-gofarm-black text-sm sm:text-base">{item.name}</p>
                          <p className="text-xs sm:text-sm text-gofarm-gray">Quantity: {item.quantity}</p>
                          {isLowStock && stock > 0 && (
                            <p className="text-[10px] sm:text-xs text-orange-500 mt-1">⚠️ Only {stock} left in stock</p>
                          )}
                        </div>
                        <p className="font-semibold text-gofarm-green text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gofarm-black mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-red-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-gofarm-black text-sm sm:text-base">Total</span>
                      <span className="text-gofarm-green text-base sm:text-lg">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <p className="text-xs sm:text-sm font-medium text-blue-800">Shipping Information</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Standard shipping (3-5 business days)</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">You'll enter delivery address on next step</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={cancelOrder}
                className="order-2 sm:order-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Back to Cart
              </button>
              <button
                onClick={confirmOrder}
                className="order-1 sm:order-2 px-4 py-2 bg-gofarm-green text-white rounded-xl font-semibold hover:bg-gofarm-light-green transition-colors text-sm sm:text-base"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-3 sm:mx-0 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Remove Item?</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">Are you sure you want to remove this item from your cart?</p>
              <div className="flex gap-2 sm:gap-3">
                <button onClick={() => confirmRemove(showConfirm)} className="flex-1 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base">Yes, Remove</button>
                <button onClick={cancelRemove} className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear Cart Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-3 sm:mx-0 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Clear Entire Cart?</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">Are you sure you want to remove all items from your cart?</p>
              <div className="flex gap-2 sm:gap-3">
                <button onClick={confirmClearCart} className="flex-1 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base">Yes, Clear All</button>
                <button onClick={cancelClearCart} className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gofarm-black">Shopping Cart</h1>
              <p className="text-sm sm:text-base text-gofarm-gray mt-1 sm:mt-2">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                {selectedCount > 0 && ` (${selectedCount} selected)`}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-red-200 text-red-500 text-xs sm:text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gofarm-black mb-2">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-gofarm-gray mb-5 sm:mb-6">Looks like you haven't added any items yet</p>
              <Link href="/shop" className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors text-sm sm:text-base">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Select All Header */}
                  <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-gofarm-green focus:ring-gofarm-green"
                      />
                      <span className="font-medium text-gofarm-black text-sm sm:text-base">Select All</span>
                      <span className="text-xs sm:text-sm text-gray-500">({availableItemsCount} items available)</span>
                    </label>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => {
                      const stock = getProductStock(item.id);
                      const isOutOfStock = stock === 0;
                      const isLowStock = stock > 0 && stock <= 5;
                      const hasError = stockErrors[item.id];
                      const isSelected = selectedItems.has(item.id);
                      
                      return (
                        <div key={item.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-gray-50 transition-colors ${hasError ? "bg-red-50/30" : ""} ${isOutOfStock ? "opacity-60" : ""}`}>
                          {/* Checkbox */}
                          <div className="pt-0 sm:pt-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(item.id)}
                              disabled={isOutOfStock}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-gofarm-green focus:ring-gofarm-green disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          
                          <img src={item.imageSrc} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" />
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-gofarm-black text-sm sm:text-base">{item.name}</h3>
                            <p className="text-gofarm-green font-semibold mt-0.5 sm:mt-1 text-sm sm:text-base">${item.price.toFixed(2)}</p>
                            
                            {isOutOfStock && (
                              <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></span>
                                Out of stock - Cannot purchase
                              </p>
                            )}
                            {isLowStock && !isOutOfStock && (
                              <p className="text-[10px] sm:text-xs text-orange-500 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500"></span>
                                Only {stock} left in stock
                              </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                                disabled={isOutOfStock}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gofarm-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                                disabled={isOutOfStock}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gofarm-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                              <button onClick={() => handleRemoveItem(item.id)} className="ml-auto sm:ml-0 text-red-500 hover:text-red-600 text-xs sm:text-sm flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-gofarm-green text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 sm:mt-10">
                  <Link href="/shop" className="inline-flex items-center gap-1 sm:gap-2 text-gofarm-green hover:text-gofarm-light-green font-medium transition-colors text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-gofarm-black mb-3 sm:mb-4">Order Summary</h2>
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="flex gap-1.5 sm:gap-2">
                      <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 text-xs sm:text-sm" />
                      <button onClick={applyPromo} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gofarm-black rounded-lg hover:bg-gofarm-green hover:text-white transition-colors text-xs sm:text-sm font-medium">Apply</button>
                    </div>
                    {promoApplied && <p className="text-[10px] sm:text-xs text-gofarm-green mt-1.5 sm:mt-2">✓ Promo code applied!</p>}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gofarm-gray">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gofarm-gray">Discount</span>
                        <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gofarm-gray">Shipping</span>
                      <span className="font-semibold">{shipping === 0 ? <span className="text-gofarm-green">Free</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gofarm-gray">Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    
                    {subtotal > 0 && subtotal < 50 && (
                      <div className="bg-gofarm-light-green/10 p-2.5 sm:p-3 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-gofarm-green">🚚 Add ${(50 - subtotal).toFixed(2)} more to get free shipping!</p>
                      </div>
                    )}

                    {hasStockIssues() && selectedCount > 0 && (
                      <div className="bg-red-50 p-2.5 sm:p-3 rounded-lg border border-red-200">
                        <p className="text-[10px] sm:text-xs text-red-600 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Some selected items have stock issues.
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                      <div className="flex justify-between">
                        <span className="text-base sm:text-lg font-bold text-gofarm-black">Total</span>
                        <span className="text-lg sm:text-xl font-bold text-gofarm-green">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={selectedCount === 0 || hasStockIssues()}
                    className="w-full mt-8 sm:mt-10 py-2.5 sm:py-3 bg-gofarm-green text-white font-semibold rounded-xl hover:bg-gofarm-light-green transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Proceed to Checkout ({selectedCount} items)
                  </button>

                  <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gofarm-gray">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}