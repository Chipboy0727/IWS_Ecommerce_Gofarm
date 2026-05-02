"use client";

import { useState } from "react";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

export default function SubscribeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingEmails = JSON.parse(localStorage.getItem("subscribedEmails") || "[]");
    existingEmails.push(email);
    localStorage.setItem("subscribedEmails", JSON.stringify(existingEmails));
    
    setSubscribed(true);
    setLoading(false);
    
    setTimeout(() => {
      setIsOpen(false);
      setSubscribed(false);
      setEmail("");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-white/60 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        Subscribe for Deals
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl relative">
            {!subscribed ? (
              <>
                <div className="text-center mb-5 sm:mb-6">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <MailIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gofarm-green" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Subscribe for Deals</h3>
                  <p className="text-gray-500 mt-1.5 sm:mt-2 text-xs sm:text-sm px-2">
                    Get exclusive offers, early access to sales, and special discounts delivered to your inbox.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-green focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gofarm-green text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
                
                <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 sm:mt-4">
                  No spam, unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm">You've been subscribed successfully.</p>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}