"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const quickLinks = ["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"];
  const categories = ["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Chuyển hướng thông minh dựa trên vai trò (role)
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login demo. Please configure OAuth in production.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      <div className="py-12 lg:py-16">
        <div className="max-w-md mx-auto px-4">
          {/* Back to Home Link */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gofarm-gray hover:text-gofarm-green transition-colors group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Card Sign In */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gofarm-green/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gofarm-black">Welcome Back</h1>
              <p className="text-gofarm-gray mt-2">Sign in to continue to GoFarm</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gofarm-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gofarm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                    placeholder="hello@gofarm.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gofarm-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gofarm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gofarm-gray hover:text-gofarm-green transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gofarm-green focus:ring-gofarm-green/20" />
                  <span className="text-sm text-gofarm-gray">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-gofarm-green hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gofarm-green text-white font-semibold rounded-xl hover:bg-gofarm-light-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gofarm-gray">Or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gofarm-green/30 transition-all group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm text-gofarm-black group-hover:text-gofarm-green transition-colors">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gofarm-green/30 transition-all group"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                <span className="text-sm text-gofarm-black group-hover:text-gofarm-green transition-colors">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gofarm-gray">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-gofarm-green font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
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
              <div className="mb-2">
                <Link href="/">
                  <img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" />
                </Link>
              </div>
              <p className="text-gofarm-gray text-sm">Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.</p>
              <div className="flex items-center gap-3.5">
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green">
                  <span className="sr-only">YouTube</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 border rounded-full hoverEffect border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.205-.012 3.585-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85 0-3.204.012-3.584.07-4.85.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069z"/></svg>
                </a>
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