"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to generate reset token");
      }

      setMessage(data.message || "If the email exists, a reset token has been generated.");
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gofarm-light-orange/10">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-gofarm-gray hover:text-gofarm-green transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sign In
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gofarm-green/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-gofarm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.1 0 2-.9 2-2V6a2 2 0 10-4 0v3c0 1.1.9 2 2 2zm0 0v8m-7 0h14" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gofarm-black">Forgot Password</h1>
            <p className="text-gofarm-gray mt-2">Generate a reset token for your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm space-y-2">
              <div>{message}</div>
              {resetToken ? (
                <div className="rounded-md bg-white/70 p-3 font-mono text-xs break-all">
                  Reset token: {resetToken}
                  <div className="mt-2">
                    <Link
                      href={`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`}
                      className="text-gofarm-green font-semibold hover:underline"
                    >
                      Open reset page
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gofarm-black mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20 transition-all"
                placeholder="hello@gofarm.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gofarm-green text-white font-semibold rounded-xl hover:bg-gofarm-light-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Generating token..." : "Send Reset Token"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
