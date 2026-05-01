"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gofarm.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061006] text-white">
      <div className="absolute inset-0 bg-[url('/images/image_3.jpg')] bg-cover bg-center scale-105" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,34,10,0.18),rgba(0,0,0,0.72)_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,2,0.22),rgba(3,10,2,0.76))]" />

      <div className="relative flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-3 sm:px-4 py-8 sm:py-10">
          <div className="w-full max-w-[400px] sm:max-w-[432px] rounded-[10px] bg-white px-5 sm:px-7 py-6 sm:py-8 text-gofarm-black shadow-[0_18px_50px_rgba(0,0,0,0.28)] mx-3 sm:mx-0 border border-gray-100">
            <div className="text-center">
              <div className="text-[14px] sm:text-[17px] font-extrabold tracking-[-0.04em] text-gofarm-green">Digital Cultivator</div>
              <h1 className="mt-1 text-[22px] sm:text-[26px] font-bold tracking-[-0.05em] text-gofarm-black">Admin Access</h1>
              <p className="mx-auto mt-2 sm:mt-3 max-w-[250px] sm:max-w-[270px] text-[11px] sm:text-[12px] leading-4 sm:leading-5 text-gofarm-gray">
                Enter your credentials to manage your agricultural ecosystem.
              </p>
            </div>

            <form className="mt-6 sm:mt-8 space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1.5 sm:mb-2 block text-[11px] sm:text-[12px] font-medium text-gofarm-gray">Work Email</span>
                <div className="flex items-center rounded-lg border border-gofarm-light-gray bg-gray-50 px-2.5 sm:px-3 py-2 sm:py-2.5 focus-within:border-gofarm-light-green focus-within:ring-2 focus-within:ring-gofarm-green/20">
                  <span className="mr-2 sm:mr-3 text-gofarm-gray">
                    <IconMail />
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="w-full bg-transparent text-[12px] sm:text-[13px] text-gray-700 outline-none placeholder:text-gofarm-gray"
                    placeholder="admin@gofarm.com"
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-1.5 sm:mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="block text-[11px] sm:text-[12px] font-medium text-gofarm-gray">Password</span>
                  <button type="button" className="text-[11px] sm:text-[12px] font-semibold text-gofarm-green hover:underline text-left sm:text-right">
                    Forgot Password?
                  </button>
                </div>
                <div className="flex items-center rounded-lg border border-gofarm-light-gray bg-gray-50 px-2.5 sm:px-3 py-2 sm:py-2.5 focus-within:border-gofarm-light-green focus-within:ring-2 focus-within:ring-gofarm-green/20">
                  <span className="mr-2 sm:mr-3 text-gofarm-gray">
                    <IconLock />
                  </span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="w-full bg-transparent text-[12px] sm:text-[13px] text-gray-700 outline-none placeholder:text-gofarm-gray"
                    placeholder="••••••••"
                  />
                  <span className="ml-1.5 sm:ml-2 text-gray-400">
                    <IconEye />
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-gray-600">
                <input type="checkbox" className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-gofarm-light-gray text-gofarm-green focus:ring-gofarm-green" />
                <span>Remember this device for 30 days</span>
              </label>

              {error ? <div className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-[11px] sm:text-[12px] font-medium text-red-600">{error}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 sm:h-14 w-full items-center justify-center rounded-lg bg-linear-to-r from-gofarm-green to-emerald-600 text-[14px] sm:text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(0,168,68,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Enter Control Center"}
                <span className="ml-1.5 sm:ml-2 text-[15px] sm:text-[17px]">→</span>
              </button>
            </form>

            <div className="mt-6 sm:mt-8 border-t border-gofarm-light-gray pt-5 sm:pt-6">
              <div className="rounded-[10px] bg-gofarm-light-orange/60 px-3 sm:px-4 py-3 sm:py-4 border border-orange-100/80">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-gofarm-green/10 text-gofarm-green shrink-0">
                    <IconHeadset />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.08em] text-gofarm-gray">Need Assistance?</div>
                    <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-[12px] leading-4 sm:leading-5 text-gofarm-gray">Contact IT support for access recovery.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative border-t border-white/10 bg-black/35 px-3 sm:px-4 py-3 sm:py-4 text-[11px] sm:text-[12px] text-white/82 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <div className="text-[12px] sm:text-[13px] font-semibold order-2 sm:order-1">Digital Cultivator</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 uppercase tracking-[0.12em] text-white/70 text-[10px] sm:text-[12px] order-1 sm:order-2">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
            <div className="text-white/55 text-[10px] sm:text-[12px] order-3">© 2024 Digital Cultivator. Precision in every seed.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5.5 7.5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <rect x="5.5" y="10.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10.5V8.3a4 4 0 0 1 8 0v2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5">
      <path d="M4.5 12a7.5 7.5 0 0 1 15 0v4a2 2 0 0 1-2 2h-2v-5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 18h2v-5h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}