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
    // Giả lập gửi email (sau này thay bằng API thật)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Lưu email vào localStorage
    const existingEmails = JSON.parse(localStorage.getItem("subscribedEmails") || "[]");
    existingEmails.push(email);
    localStorage.setItem("subscribedEmails", JSON.stringify(existingEmails));
    
    console.log("Subscribed email:", email);
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
        className="inline-flex items-center justify-center rounded-lg border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        Subscribe for Deals
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {!subscribed ? (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-gofarm-green/10 rounded-full flex items-center justify-center mb-4">
                    <MailIcon className="w-6 h-6 text-gofarm-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Subscribe for Deals</h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Get exclusive offers, early access to sales, and special discounts delivered to your inbox.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gofarm-green focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gofarm-green text-white py-3 rounded-lg font-semibold hover:bg-gofarm-light-green transition-colors disabled:opacity-50"
                  >
                    {loading ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  No spam, unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-500 mt-2">You've been subscribed successfully.</p>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}