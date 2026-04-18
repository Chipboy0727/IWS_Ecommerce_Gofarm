import Link from "next/link";
import type { HomeStat } from "@/lib/home-data";

export function HomeHero({ stats }: { stats: HomeStat[] }) {
  return (
    <section className="relative overflow-hidden border-b border-gofarm-light-gray bg-linear-to-br from-white via-white to-gofarm-light-orange/20">
      <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-r from-gofarm-green/10 via-transparent to-gofarm-light-orange/20" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-gofarm-green/10 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gofarm-light-orange/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-(--breakpoint-xl) gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-gofarm-light-green/20 bg-white px-4 py-2 text-sm font-semibold text-gofarm-green shadow-sm">
            RESTful API + decoupled frontend
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-gofarm-black sm:text-5xl lg:text-6xl">
              Fresh groceries, cleaner architecture.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gofarm-gray sm:text-lg">
              Browse a structured grocery storefront built with React components and API-backed data instead of HTML string injection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-gofarm-green px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gofarm-green/20 transition-colors hover:bg-gofarm-light-green"
            >
              Shop now
            </Link>
            <Link
              href="/deal"
              className="inline-flex items-center justify-center rounded-full border border-gofarm-light-green/25 bg-white px-6 py-3 text-sm font-semibold text-gofarm-black transition-colors hover:border-gofarm-green hover:text-gofarm-green"
            >
              View deals
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gofarm-gray">{stat.label}</div>
                <div className="mt-2 text-3xl font-bold text-gofarm-black">{stat.value}</div>
                <div className="mt-1 text-sm text-gofarm-gray">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-gofarm-light-green/15 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] bg-linear-to-br from-gofarm-light-orange/30 via-white to-gofarm-light-green/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gofarm-gray">Weekly highlight</div>
                  <div className="mt-2 text-2xl font-bold text-gofarm-black">Seasonal baskets</div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gofarm-gray">Up to</div>
                  <div className="text-3xl font-extrabold text-gofarm-green">30%</div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="h-28 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_65%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,253,244,0.9))]" />
                  <div className="mt-4 text-sm font-semibold text-gofarm-black">Farm fresh produce</div>
                  <div className="text-xs text-gofarm-gray">Delivered from local suppliers</div>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="h-28 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.2),_transparent_65%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,247,237,0.95))]" />
                  <div className="mt-4 text-sm font-semibold text-gofarm-black">Daily essentials</div>
                  <div className="text-xs text-gofarm-gray">Ready for quick checkout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
