"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50/30 py-10 sm:py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
            Thank you for your purchase. You will receive a confirmation email shortly with your order details.
          </p>

          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-600">
              Your order has been successfully placed. We'll notify you once it's shipped.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gofarm-green text-white font-semibold rounded-xl hover:bg-gofarm-light-green transition-all text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gofarm-green text-gofarm-green font-semibold rounded-xl hover:bg-gofarm-green hover:text-white transition-all text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}