"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

type PaymentMethod = "card" | "qr" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [selectedQR, setSelectedQR] = useState<string>("vietqr");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("default");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [addresses, setAddresses] = useState<any[]>([]);

  // Bank account information for QR
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

  // Load user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsLoggedIn(true);
        setUserData(parsedUser);
        
        // Load saved addresses
        const savedAddresses = localStorage.getItem("userAddresses");
        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        } else if (parsedUser.address) {
          // Add default address from signup
          const defaultAddress = {
            id: "default",
            address: parsedUser.address,
            city: parsedUser.city,
            state: parsedUser.state,
            zipCode: parsedUser.zipCode,
            isDefault: true,
          };
          setAddresses([defaultAddress]);
          localStorage.setItem("userAddresses", JSON.stringify([defaultAddress]));
        }
      } catch (e) {}
    }
  }, []);

  // Save new address
  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert("Please fill all address fields");
      return;
    }
    
    const addressToAdd = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    
    const updatedAddresses = [...addresses, addressToAdd];
    setAddresses(updatedAddresses);
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
    setSelectedAddress(addressToAdd.id);
    setShowAddressForm(false);
    setNewAddress({ address: "", city: "", state: "", zipCode: "" });
  };

  // Get selected address details
  const getSelectedAddressDetails = () => {
    if (selectedAddress === "default" && userData) {
      return {
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
      };
    }
    const addr = addresses.find(a => a.id === selectedAddress);
    return addr || { address: "", city: "", state: "", zipCode: "" };
  };

  // Generate QR Code URL
  const generateQRCodeUrl = () => {
    const amount = finalTotal.toFixed(0);
    const description = `GOFARM${Date.now()}`;
    const template = "compact2";
    return `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const selectedAddr = getSelectedAddressDetails();
    const shippingAddress = `${selectedAddr.address}, ${selectedAddr.city}, ${selectedAddr.state} ${selectedAddr.zipCode}`;
    
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
    
    const existingOrders = localStorage.getItem("orders");
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      
      if (paymentMethod === "qr") {
        alert(`Please scan QR code and transfer ${finalTotal.toFixed(2)} to account ${bankInfo.accountNumber}\nOrder will be confirmed after payment is received.`);
      }
      router.push("/order-success");
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to your cart before checking out</p>
            <Link href="/shop" className="inline-block px-6 py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Please sign in to continue</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to complete your purchase</p>
            <Link href="/sign-in" className="block w-full py-3 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="block w-full py-3 mt-3 border border-gofarm-green text-gofarm-green rounded-lg hover:bg-gofarm-green/10 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddressDetails = getSelectedAddressDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gofarm-green hover:text-gofarm-light-green transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* User Info - Readonly from account */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                    <Link href="/account" className="text-sm text-gofarm-green hover:underline">Edit</Link>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {userData?.name}</p>
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {userData?.email}</p>
                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {userData?.phone}</p>
                  </div>
                </div>

                {/* Shipping Address Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-sm text-gofarm-green hover:underline"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {/* Address Selection */}
                  <div className="space-y-3">
                    {/* Default address from signup */}
                    {userData?.address && (
                      <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:border-gofarm-green transition-all">
                        <input
                          type="radio"
                          name="address"
                          value="default"
                          checked={selectedAddress === "default"}
                          onChange={() => setSelectedAddress("default")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Default Address</p>
                          <p className="text-sm text-gray-600">
                            {userData.address}, {userData.city}, {userData.state} {userData.zipCode}
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Saved addresses */}
                    {addresses.map((addr) => (
                      <label key={addr.id} className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:border-gofarm-green transition-all">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {addr.isDefault ? "Default Address" : "Saved Address"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Add New Address Form */}
                  {showAddressForm && (
                    <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-3">New Address</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gofarm-green"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gofarm-green"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gofarm-green"
                          />
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gofarm-green"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleAddAddress}
                            className="px-4 py-2 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        paymentMethod === "cod" 
                          ? "border-gofarm-green bg-gofarm-green/5" 
                          : "border-gray-200 hover:border-gofarm-green"
                      }`}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm0 0v4" />
                      </svg>
                      <p className="font-medium">Cash on Delivery</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qr")}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        paymentMethod === "qr" 
                          ? "border-gofarm-green bg-gofarm-green/5" 
                          : "border-gray-200 hover:border-gofarm-green"
                      }`}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="font-medium">Bank Transfer (QR)</p>
                    </button>
                  </div>

                  {/* QR Code Payment */}
                  {paymentMethod === "qr" && (
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <div className="flex flex-wrap gap-4 mb-6 justify-center">
                        <button
                          type="button"
                          onClick={() => setSelectedQR("vietqr")}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            selectedQR === "vietqr" 
                              ? "bg-red-500 text-white shadow-md" 
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          🏦 VietQR (TPBank)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedQR("momo")}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
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
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            selectedQR === "zalopay" 
                              ? "bg-blue-500 text-white shadow-md" 
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          💙 ZaloPay
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white p-4 rounded-xl shadow-md inline-block">
                          <img 
                            src={generateQRCodeUrl()}
                            alt="QR Code Payment"
                            className="w-48 h-48"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Transfer ${finalTotal.toFixed(2)} to ${bankInfo.accountNumber}`;
                            }}
                          />
                        </div>
                        
                        <div className="mt-4 p-3 bg-white rounded-lg w-full">
                          <p className="text-sm font-medium text-gray-700">Bank Account Information</p>
                          <div className="mt-2 text-left space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Bank:</span>
                              <span className="font-medium">{bankInfo.bankName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Account Number:</span>
                              <span className="font-mono font-medium text-gofarm-green">{bankInfo.accountNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-bold text-gofarm-green">${finalTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-sm text-gray-600">
                          Scan QR code with <strong>{selectedQR.toUpperCase()}</strong> to pay
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COD Info */}
                  {paymentMethod === "cod" && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-gofarm-green mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Pay when you receive</p>
                          <p className="text-sm text-gray-600 mt-1">
                            You will pay <strong className="text-gofarm-green">${finalTotal.toFixed(2)}</strong> in cash when your order is delivered to <strong>{selectedAddressDetails.address}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gofarm-green text-white font-semibold rounded-xl hover:bg-gofarm-light-green transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100">
                    <img src={item.imageSrc} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-gofarm-green">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center">
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