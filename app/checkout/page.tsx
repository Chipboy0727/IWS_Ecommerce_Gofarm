"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart-context";

type PaymentMethod = "card" | "qr" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [selectedQR, setSelectedQR] = useState<string>("vietqr");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressError, setAddressError] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const bankInfo = {
    accountNumber: "0383953075",
    accountName: "NGUYEN VAN A",
    bankName: "TPBank",
    bankCode: "TPB",
  };

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + shipping + tax;

  useEffect(() => {
    const user = localStorage.getItem("user");
    
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/sign-in");
      return;
    }

    setIsCheckingAuth(false);
    try {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      
      const savedAddresses = localStorage.getItem("userAddresses");
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        const defaultAddr = parsedAddresses.find((a: any) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        } else if (parsedAddresses.length > 0) {
          setSelectedAddress(parsedAddresses[0].id);
        }
      } else if (parsedUser.address) {
        const defaultAddress = {
          id: "default",
          address: parsedUser.address,
          city: parsedUser.city,
          state: parsedUser.state,
          zipCode: parsedUser.zipCode,
          isDefault: true,
          fromUserData: true,
        };
        setAddresses([defaultAddress]);
        setSelectedAddress("default");
        localStorage.setItem("userAddresses", JSON.stringify([defaultAddress]));
      }
    } catch (e) {
      console.error("Error loading user data:", e);
    }
  }, [router]);

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert("Please fill all address fields");
      return;
    }
    
    const addressToAdd = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
      fromUserData: false,
    };
    
    const updatedAddresses = [...addresses, addressToAdd];
    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    setSelectedAddress(addressToAdd.id);
    setAddressError("");
    setShowAddressForm(false);
    setNewAddress({ address: "", city: "", state: "", zipCode: "" });
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(a => a.id === addressId);
    if (addressToDelete?.fromUserData) {
      alert("Cannot delete your default address from account. Please update it in your account settings.");
      return;
    }
    setShowDeleteConfirm(addressId);
  };

  const confirmDeleteAddress = () => {
    if (!showDeleteConfirm) return;
    
    const updatedAddresses = addresses.filter(addr => addr.id !== showDeleteConfirm);
    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    
    if (selectedAddress === showDeleteConfirm) {
      if (updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0].id);
      } else {
        setSelectedAddress("");
      }
    }
    
    setShowDeleteConfirm(null);
  };

  const cancelDeleteAddress = () => {
    setShowDeleteConfirm(null);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    setSelectedAddress(addressId);
  };

  const getSelectedAddressDetails = () => {
    if (!selectedAddress) return null;
    const addr = addresses.find(a => a.id === selectedAddress);
    return addr || null;
  };

  const generateQRCodeUrl = () => {
    const amount = finalTotal.toFixed(0);
    const description = `GOFARM${Date.now()}`;
    const template = "compact2";
    return `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
  };

  const isAddressSelected = () => {
    return selectedAddress && selectedAddress.trim() !== "" && getSelectedAddressDetails() !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAddressSelected()) {
      setAddressError("Please select or add a shipping address");
      return;
    }
    
    setAddressError("");
    
    const user = localStorage.getItem("user");
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/sign-in");
      return;
    }
    
    setIsProcessing(true);
    
    const selectedAddr = getSelectedAddressDetails();
    const shippingAddress = `${selectedAddr?.address}, ${selectedAddr?.city}, ${selectedAddr?.state} ${selectedAddr?.zipCode}`;
    
    const paymentMethodDisplay = 
      paymentMethod === "card" ? "Credit Card" : 
      paymentMethod === "qr" ? `QR Code (${selectedQR.toUpperCase()})` : 
      "Cash on Delivery";
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      total: finalTotal,
      status: paymentMethod === "qr" ? "awaiting_payment" : "pending" as const,
      items: cartItems.length,
      products: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageSrc: item.imageSrc,
        slug: item.slug,
      })),
      shippingAddress: shippingAddress,
      customerName: userData?.name || "Guest",
      customerEmail: userData?.email || "guest@example.com",
      customerPhone: userData?.phone || "",
      paymentMethod: paymentMethodDisplay,
    };
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Failed to create order");
      }

      window.dispatchEvent(new Event("orders-updated"));

      setTimeout(() => {
        clearCart();
        setIsProcessing(false);

        if (paymentMethod === "qr") {
          alert(`Please scan QR code and transfer ${finalTotal.toFixed(2)} to account ${bankInfo.accountNumber}\nOrder will be confirmed after payment is received.`);
        }
        router.push("/order-success");
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      alert(error instanceof Error ? error.message : "Failed to create order");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin rounded-full border-b-2 border-gofarm-green" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-5 md:mb-6">Add some items to your cart before checking out</p>
            <Link href="/shop" className="inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors text-xs sm:text-sm md:text-base">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddressDetails = getSelectedAddressDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8 md:py-10 lg:py-12">
      
      {/* Delete Address Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="mx-2 sm:mx-3 w-full max-w-[90%] sm:max-w-sm rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 md:p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Delete Address?</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4 sm:mb-5 md:mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
              <div className="flex gap-2 sm:gap-3">
                <button onClick={confirmDeleteAddress} className="flex-1 rounded-lg bg-red-500 px-3 sm:px-4 py-1.5 sm:py-2 text-white transition-colors hover:bg-red-600 text-xs sm:text-sm md:text-base">Yes, Delete</button>
                <button onClick={cancelDeleteAddress} className="flex-1 rounded-lg bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 transition-colors hover:bg-gray-200 text-xs sm:text-sm md:text-base">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        
        {/* Back to Cart */}
        <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8">
          <Link href="/cart" className="inline-flex items-center gap-1 sm:gap-2 text-gofarm-green hover:text-gofarm-light-green transition-colors text-xs sm:text-sm md:text-base">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cart
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
          
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-5 sm:mb-6 md:mb-7">Checkout</h1>
              
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
                
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Contact Information</h2>
                    <Link href="/account" className="text-[11px] sm:text-xs md:text-sm text-gofarm-green hover:underline">Edit</Link>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
                    <p className="text-gray-700 break-words"><span className="font-medium">Name:</span> {userData?.name}</p>
                    <p className="text-gray-700 break-all"><span className="font-medium">Email:</span> {userData?.email}</p>
                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {userData?.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Shipping Address</h2>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-[11px] sm:text-xs md:text-sm text-gofarm-green hover:underline text-left"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {addressError && (
                    <div className="mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[11px] sm:text-xs md:text-sm flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="break-words">{addressError}</span>
                    </div>
                  )}

                  <div className="space-y-2.5 sm:space-y-3">
                    {addresses.length === 0 ? (
                      <div className="text-center p-5 sm:p-6 border rounded-lg sm:rounded-xl bg-gray-50">
                        <p className="text-xs sm:text-sm md:text-base text-gray-500">No addresses saved. Please add a shipping address.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${
                            selectedAddress === addr.id 
                              ? "border-gofarm-green bg-gofarm-green/5" 
                              : "border-gray-200 hover:border-gofarm-green"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddress === addr.id}
                              onChange={() => {
                                setSelectedAddress(addr.id);
                                setAddressError("");
                              }}
                              className="mt-0.5 sm:mt-1 shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                                  {addr.isDefault ? "Default Address" : "Saved Address"}
                                </p>
                                {addr.fromUserData && (
                                  <span className="text-[10px] sm:text-[11px] bg-blue-100 text-blue-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                                    From Account
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mt-1 break-words">
                                {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-2 ml-5 sm:ml-0">
                              {!addr.fromUserData && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    className="text-[11px] sm:text-xs text-gofarm-green hover:underline"
                                  >
                                    Set Default
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="text-[11px] sm:text-xs text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Address Form */}
                  {showAddressForm && (
                    <div className="mt-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">New Address</h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:border-gofarm-green text-xs sm:text-sm md:text-base"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:border-gofarm-green text-xs sm:text-sm md:text-base"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:border-gofarm-green text-xs sm:text-sm md:text-base"
                          />
                          <div className="col-span-2 sm:col-span-1">
                            <input
                              type="text"
                              placeholder="ZIP Code"
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:border-gofarm-green text-xs sm:text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={handleAddAddress}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green text-xs sm:text-sm md:text-base"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-100 text-xs sm:text-sm md:text-base"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Method</h2>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-center transition-all ${
                        paymentMethod === "cod" 
                          ? "border-gofarm-green bg-gofarm-green/5" 
                          : "border-gray-200 hover:border-gofarm-green"
                      }`}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-auto mb-1.5 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm0 0v4" />
                      </svg>
                      <p className="font-medium text-[11px] sm:text-xs md:text-sm">Cash on Delivery</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qr")}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-center transition-all ${
                        paymentMethod === "qr" 
                          ? "border-gofarm-green bg-gofarm-green/5" 
                          : "border-gray-200 hover:border-gofarm-green"
                      }`}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-auto mb-1.5 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="font-medium text-[11px] sm:text-xs md:text-sm">Bank Transfer (QR)</p>
                    </button>
                  </div>

                  {/* QR Payment Details */}
                  {paymentMethod === "qr" && (
                    <div className="p-4 sm:p-5 md:p-6 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center">
                        <button
                          type="button"
                          onClick={() => setSelectedQR("vietqr")}
                          className={`px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                            selectedQR === "vietqr" 
                              ? "bg-red-500 text-white shadow-md" 
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          🏦 VietQR
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedQR("momo")}
                          className={`px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                            selectedQR === "momo" 
                              ? "bg-purple-500 text-white shadow-md" 
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          💜 Momo
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedQR("zalopay")}
                          className={`px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                            selectedQR === "zalopay" 
                              ? "bg-blue-500 text-white shadow-md" 
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          💙 ZaloPay
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md inline-block">
                          <img 
                            src={generateQRCodeUrl()}
                            alt="QR Code Payment"
                            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Transfer ${finalTotal.toFixed(2)} to ${bankInfo.accountNumber}`;
                            }}
                          />
                        </div>
                        
                        <div className="mt-3 sm:mt-4 p-3 bg-white rounded-lg w-full max-w-full overflow-x-auto">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">Bank Account Information</p>
                          <div className="mt-1.5 sm:mt-2 text-left space-y-0.5 sm:space-y-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between text-[11px] sm:text-xs md:text-sm gap-1 sm:gap-0">
                              <span className="text-gray-500">Bank:</span>
                              <span className="font-medium">{bankInfo.bankName}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-[11px] sm:text-xs md:text-sm gap-1 sm:gap-0">
                              <span className="text-gray-500">Account Number:</span>
                              <span className="font-mono font-medium text-gofarm-green text-[11px] sm:text-xs md:text-sm break-all">{bankInfo.accountNumber}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between text-[11px] sm:text-xs md:text-sm gap-1 sm:gap-0">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-bold text-gofarm-green">${finalTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs md:text-sm text-gray-600">
                          Scan QR code with <strong>{selectedQR.toUpperCase()}</strong> to pay
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COD Info */}
                  {paymentMethod === "cod" && selectedAddressDetails && (
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gofarm-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Pay when you receive</p>
                          <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1 break-words">
                            You will pay <strong className="text-gofarm-green">${finalTotal.toFixed(2)}</strong> in cash when your order is delivered to <strong className="break-words">{selectedAddressDetails?.address}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !isAddressSelected()}
                  className="w-full py-2.5 sm:py-3 bg-gofarm-green text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gofarm-light-green transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Place Order • $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 sticky top-20 md:top-24">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-2.5 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 py-2 border-b border-gray-100">
                    <img src={item.imageSrc} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex justify-between text-[11px] sm:text-xs md:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs md:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs md:text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base md:text-lg font-bold pt-2 sm:pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-gofarm-green">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Checkout */}
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 text-center">
                  🔒 Your payment information is secure. All transactions are encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}