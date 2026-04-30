"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  products: any[];
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  avatar?: string;
  registeredAt?: string;
}

// Settings Modal Component
function SettingsModal({ isOpen, onClose, userData, onUpdate }: { 
  isOpen: boolean; 
  onClose: () => void; 
  userData: UserData | null;
  onUpdate: (updatedUser: UserData) => void;
}) {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return false;
    }
    
    if (!formData.address.trim()) {
      setError("Street address is required");
      return false;
    }
    if (!formData.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!formData.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError("ZIP code is required");
      return false;
    }
    
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(formData.zipCode)) {
      setError("Please enter a valid ZIP code (5 digits)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = {
        ...formData,
        registeredAt: userData?.registeredAt || new Date().toISOString(),
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      
      setSuccess("Profile updated successfully!");
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-[95%] sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-3 md:mx-4">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gofarm-green to-gofarm-light-green p-4 sm:p-5 text-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold break-words">Edit Profile</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1">Update your personal information</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
          {success && (
            <div className="p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-words">{success}</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-words">{error}</span>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gofarm-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                  placeholder="hello@gofarm.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="pt-1 sm:pt-2">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gofarm-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gofarm-green text-white font-semibold rounded-lg hover:bg-gofarm-light-green transition-all disabled:opacity-50 text-xs sm:text-sm md:text-base"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const memberSince = user?.registeredAt
    ? new Date(user.registeredAt).getFullYear()
    : null;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/sign-in");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const allOrders = JSON.parse(storedOrders);
      const userOrders = allOrders.filter((order: Order) => 
        order.customerEmail === parsedUser.email
      );
      setOrders(userOrders);
    }
    
    setLoading(false);
  }, [router]);

  const handleUpdateUser = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "shipped").length;

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      router.push("/");
      router.refresh();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-gofarm-green"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        
        {/* User Profile Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-5 md:mb-6">
          <div className="bg-gradient-to-r from-gofarm-green to-gofarm-light-green p-4 sm:p-5 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 md:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shrink-0 mx-auto sm:mx-0">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words">{user.name || "User"}</h1>
                <p className="text-white/80 text-xs sm:text-sm md:text-base break-all">{user.email}</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-white/60 mt-1">Member since {new Date().getFullYear()}</p>
              </div>
              <div className="flex flex-row justify-center sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base break-words">{user.name || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base break-words">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base break-words">{user.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base break-words">
                    {user.address && user.city && user.state && user.zipCode 
                      ? `${user.address}, ${user.city}, ${user.state} ${user.zipCode}`
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Total Orders</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Delivered</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{deliveredOrders}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Processing</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">Cancelled</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{cancelledOrders}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
          <Link href="/orders" className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center group-hover:bg-gofarm-green transition-colors shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gofarm-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">My Orders</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">View order history and tracking</p>
              </div>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link href="/wishlist" className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-colors shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">My Wishlist</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">Products you've saved</p>
              </div>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group w-full text-left"
          >
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">Settings</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">Manage your profile</p>
              </div>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/orders" className="text-xs sm:text-sm text-gofarm-green hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base break-all">{order.id}</p>
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-0.5">{order.date}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{order.items} items</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-bold text-gofarm-green text-xs sm:text-sm md:text-base">${order.total.toFixed(2)}</p>
                    <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full mt-1 ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Orders Message */}
        {orders.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4">Start shopping to see your orders here</p>
            <Link href="/shop" className="inline-block px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-gofarm-green text-white rounded-lg hover:bg-gofarm-light-green transition-colors text-xs sm:text-sm md:text-base">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={user}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}
