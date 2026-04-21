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
    <div className="relative min-h-screen overflow-hidden bg-[#081108] text-white">
      <div className="absolute inset-0 bg-[url('/images/image_3.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,30,8,0.18),rgba(0,0,0,0.72)_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,2,0.25),rgba(3,10,2,0.74))]" />

      <div className="relative flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-[360px] rounded-[10px] bg-white px-6 py-8 text-[#263225] shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
            <div className="text-center">
              <div className="text-[17px] font-extrabold tracking-[-0.04em] text-[#0d8711]">Digital Cultivator</div>
              <h1 className="mt-1 text-[24px] font-bold tracking-[-0.05em] text-[#273229]">Admin Access</h1>
              <p className="mx-auto mt-3 max-w-[250px] text-[12px] leading-5 text-[#6b7569]">
                Enter your credentials to manage your agricultural ecosystem.
              </p>
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-[#6e756d]">Work Email</span>
                <div className="flex items-center rounded-[3px] border border-[#e4eadb] bg-[#eef4e6] px-3 py-2.5">
                  <span className="mr-3 text-[#899689]">
                    <IconMail />
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="w-full bg-transparent text-[13px] text-[#72806f] outline-none placeholder:text-[#9ca89b]"
                    placeholder="admin@gofarm.com"
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="block text-[12px] font-medium text-[#6e756d]">Password</span>
                  <button type="button" className="text-[12px] font-semibold text-[#0d8711] hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="flex items-center rounded-[3px] border border-[#e4eadb] bg-[#eef4e6] px-3 py-2.5">
                  <span className="mr-3 text-[#899689]">
                    <IconLock />
                  </span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="w-full bg-transparent text-[13px] text-[#72806f] outline-none placeholder:text-[#9ca89b]"
                    placeholder="••••••••"
                  />
                  <span className="ml-2 text-[#b4c0af]">
                    <IconEye />
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-[13px] text-[#697368]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#d6ddcd] text-[#0d8711] focus:ring-[#0d8711]" />
                <span>Remember this device for 30 days</span>
              </label>

              {error ? <div className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600">{error}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-[4px] bg-[linear-gradient(180deg,#15b316,#079908)] text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(10,146,12,0.34)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Enter Control Center"}
                <span className="ml-2 text-[17px]">→</span>
              </button>
            </form>

            <div className="mt-7 rounded-[10px] bg-[#eff8ea] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#dff2d8] text-[#0f9716]">
                  <IconHeadset />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#667165]">Need Assistance?</div>
                  <div className="mt-1 text-[12px] leading-5 text-[#798477]">Contact IT support for access recovery.</div>
                </div>
              </div>
            </div>

          </div>
        </main>

        <footer className="relative border-t border-white/10 bg-black/35 px-4 py-4 text-[12px] text-white/82 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
            <div className="text-[13px] font-semibold">Digital Cultivator</div>
            <div className="flex flex-wrap gap-8 uppercase tracking-[0.12em] text-white/70">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
            <div className="text-white/55">© 2024 Digital Cultivator. Precision in every seed.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5.5 7.5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <rect x="5.5" y="10.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10.5V8.3a4 4 0 0 1 8 0v2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path d="M4.5 12a7.5 7.5 0 0 1 15 0v4a2 2 0 0 1-2 2h-2v-5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 18h2v-5h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}
