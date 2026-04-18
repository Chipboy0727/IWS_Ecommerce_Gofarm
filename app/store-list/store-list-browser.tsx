"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreItem } from "@/lib/store-list-data";

function IconStore({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </svg>
  );
}

function IconMapPin({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a1 1 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function IconFilter({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
    </svg>
  );
}

function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconCart({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2A2 2 0 0 0 9.35 17h7.65a2 2 0 0 0 1.96-1.57L21 8H6" />
    </svg>
  );
}

function StoreCard({ store }: { store: StoreItem }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gofarm-light-green/20 bg-white shadow-lg transition-shadow hover:shadow-xl">
      <div className="relative h-40 overflow-hidden bg-linear-to-br from-gofarm-light-green/10 via-white to-gofarm-light-orange/10 sm:h-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.12),transparent_62%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconMapPin className="h-24 w-24 text-slate-500/70 sm:h-28 sm:w-28" />
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-gofarm-green px-3 py-1 text-xs font-semibold text-white shadow-sm">
          Open
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gofarm-black">{store.name}</h3>
            <p className="mt-1 truncate text-sm text-gofarm-gray">
              {store.city}, {store.country}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gofarm-gray">
          <div className="flex items-start gap-2">
            <IconMapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconPhone className="h-4 w-4 shrink-0" />
            <span>{store.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconMail className="h-4 w-4 shrink-0" />
            <span className="truncate">{store.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 shrink-0" />
            <span>{store.hours}</span>
          </div>
        </div>

        <div className="mt-5">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gofarm-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gofarm-light-green"
          >
            Get Directions
          </a>
        </div>
      </div>
    </article>
  );
}

function MapPanel({ stores }: { stores: StoreItem[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gofarm-light-green/20 shadow-lg">
      <div className="bg-linear-to-br from-gofarm-light-green/10 via-white to-gofarm-light-orange/10 p-6">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gofarm-black">
          <IconGlobe className="h-6 w-6 shrink-0 text-gofarm-green" />
          Store Locations Map
        </h2>
        <p className="text-gofarm-gray">View all our store locations on the map below</p>
      </div>

      <div className="relative h-[600px] bg-gray-100">
        <svg viewBox="0 0 1200 620" className="block h-full w-full">
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8ad4e5" />
              <stop offset="100%" stopColor="#71c8de" />
            </linearGradient>
          </defs>
          <rect width="1200" height="620" fill="url(#sea)" />
          <path d="M140 500 C200 430, 240 380, 280 320 C320 260, 380 220, 440 210 C500 200, 560 250, 620 285 C680 320, 720 350, 760 388 C800 426, 860 430, 920 390 C980 350, 1040 300, 1110 250 L1110 620 L140 620 Z" fill="#f4e6b4" opacity="0.88" />
          <path d="M0 600 C120 560, 170 510, 250 470 C330 430, 370 390, 400 340 C430 290, 520 250, 620 260 C720 270, 790 310, 870 340 C950 370, 1030 370, 1200 330 L1200 620 L0 620 Z" fill="#efe0ac" opacity="0.35" />
          <path d="M180 370 C260 340, 350 330, 420 300" stroke="#9dbd78" strokeWidth="18" strokeLinecap="round" opacity="0.75" />
          <path d="M520 380 C610 320, 700 295, 820 300" stroke="#87b46e" strokeWidth="20" strokeLinecap="round" opacity="0.82" />
          <path d="M810 180 C900 220, 960 250, 1030 330" stroke="#9fc279" strokeWidth="16" strokeLinecap="round" opacity="0.7" />
          <path d="M280 110 C380 150, 470 170, 560 160" stroke="#c8d7a5" strokeWidth="14" strokeLinecap="round" opacity="0.65" />

          {stores.map((store) => (
            <g key={store.id} transform={`translate(${store.pinX}%, ${store.pinY}%)`}>
              <circle cx="0" cy="0" r="16" fill={store.tint === "red" ? "#ef4444" : "#16a34a"} />
              <circle cx="0" cy="0" r="6" fill="#fff" />
            </g>
          ))}
        </svg>

        <div className="absolute left-4 top-4 max-h-[200px] overflow-y-auto rounded-lg bg-white/95 p-3 text-xs shadow-lg backdrop-blur">
          <p className="mb-2 font-semibold text-gray-900">Store Locations:</p>
          <div className="space-y-1">
            {stores.slice(0, 3).map((store, index) => (
              <div key={store.id} className="flex items-start gap-2 rounded p-2 transition-colors hover:bg-gray-100">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${store.tint === "red" ? "bg-red-500" : "bg-gofarm-green"}`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{store.name}</p>
                  <p className="text-gray-600">
                    {store.city}, {store.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-gofarm-light-green/20 bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gofarm-black">
                Showing {stores.length} {stores.length === 1 ? "store" : "stores"}
              </p>
              <p className="text-sm text-gofarm-gray">Click on store names in the list to view on Google Maps</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stores.slice(0, 3).map((store) => (
                <span key={store.id} className="rounded-full border border-gofarm-light-green/30 bg-gofarm-light-green/20 px-3 py-1 text-xs font-semibold text-gofarm-green">
                  {store.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-gofarm-black">{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm font-medium text-gofarm-gray transition-colors hover:text-gofarm-green">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-gofarm-light-gray bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-2">
              <Link href="/">
                <img alt="logo" loading="lazy" width="150" height="150" className="h-8 w-32" src="/images/logo.svg" />
              </Link>
            </div>
            <p className="text-sm text-gofarm-gray">
              Discover fresh, organic farm products at GoFarm, your trusted online destination for quality agricultural products and exceptional customer service.
            </p>
          </div>
          <FooterColumn title="Quick Links" items={["About us", "Contact us", "Terms & Conditions", "Privacy Policy", "FAQs", "Help"]} />
          <FooterColumn title="Categories" items={["Ice and Cold", "Dry Food", "Fast Food", "Frozen", "Meat", "Fish", "Vegetables"]} />
          <div>
            <h4 className="mb-4 font-semibold text-gofarm-black">Newsletter</h4>
            <p className="mb-4 text-sm text-gofarm-gray">Subscribe to our newsletter to receive updates and exclusive offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gofarm-light-gray px-4 py-2 text-gofarm-black outline-none focus:border-gofarm-light-green focus:ring-2 focus:ring-gofarm-light-green"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-gofarm-green px-4 py-2 font-semibold text-white transition-colors hover:bg-gofarm-light-green"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gofarm-light-gray py-6 text-center text-sm text-gofarm-gray">
          (c) 2026 gofarm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FloatingBuyButton() {
  return (
    <a
      href="https://buymeacoffee.com/reactbd/e/484104"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-20 z-50 group"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-linear-to-r from-green-500 to-emerald-500 animate-pulse opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-green-600 to-emerald-600 px-5 py-3.5 text-white shadow-lg transition-all duration-300 group-hover:scale-105">
          <span className="absolute inset-0 -translate-y-full bg-gofarm-orange transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <IconCart className="relative z-10 h-5 w-5 shrink-0" />
          <span className="relative z-10 whitespace-nowrap text-sm font-semibold">Buy Production Code</span>
        </div>
      </div>
    </a>
  );
}

export default function StoreListBrowser({ stores }: { stores: StoreItem[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All Countries");

  const countries = useMemo(() => ["All Countries", ...Array.from(new Set(stores.map((store) => store.country)))], [stores]);

  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((store) => {
      const matchesCountry = country === "All Countries" || store.country === country;
      const matchesQuery =
        !q ||
        [store.name, store.address, store.email, store.city, store.country, store.hours]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCountry && matchesQuery;
    });
  }, [country, query, stores]);

  return (
    <div className="relative">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-linear-to-r from-gofarm-light-green to-gofarm-green" />
          <IconStore className="h-8 w-8 shrink-0 text-gofarm-green" />
          <h1 className="text-3xl font-bold text-gofarm-black lg:text-5xl">Our Store Locations</h1>
          <IconMapPin className="h-8 w-8 shrink-0 text-gofarm-green" />
          <div className="h-1 w-12 rounded-full bg-linear-to-l from-gofarm-light-green to-gofarm-green" />
        </div>
        <p className="mx-auto max-w-2xl text-lg text-gofarm-gray">Find a GoFarm store near you and visit us today</p>
        <div className="mt-4">
          <div className="inline-flex items-center rounded-md border border-gofarm-light-green/30 bg-gofarm-light-green/20 px-4 py-2 text-base font-semibold text-gofarm-green shadow-sm">
            {filteredStores.length} {filteredStores.length === 1 ? "Store" : "Stores"} Found
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-gofarm-light-green/20 bg-linear-to-br from-white via-gofarm-light-orange/5 to-gofarm-light-green/5 p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 space-y-2">
              <label htmlFor="search" className="text-sm font-medium text-gofarm-black">
                Search Stores
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gofarm-gray">
                  <IconSearch className="h-5 w-5 shrink-0" />
                </span>
                <input
                  id="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by store name, city, or address..."
                  className="h-12 w-full rounded-xl border border-gofarm-light-green/30 bg-white pl-12 pr-10 text-base outline-none transition-colors placeholder:text-gray-400 focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green"
                />
              </div>
            </div>

            <div className="space-y-2 lg:w-64">
              <label htmlFor="country" className="text-sm font-medium text-gofarm-black">
                Filter by Country
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gofarm-green">
                  <IconGlobe className="h-4 w-4 shrink-0 text-gofarm-green" />
                </span>
                <select
                  id="country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="h-12 w-full rounded-xl border border-gofarm-light-green/30 bg-white pl-11 pr-10 text-sm outline-none transition-colors focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green"
                >
                  {countries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-gofarm-light-green/30 bg-white px-6 text-sm font-medium text-gofarm-black shadow-sm transition-colors hover:bg-gofarm-light-green/10 lg:w-auto"
              >
                <IconFilter className="h-5 w-5 shrink-0" />
                <span className="ml-2">More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </section>

      <section className="mt-8">
        <MapPanel stores={filteredStores} />
      </section>

      <section className="mt-8 grid gap-4 border-t border-gofarm-light-gray pt-2 sm:grid-cols-2 xl:grid-cols-4">
        <a
          href="https://maps.google.com/?q=123%20Shopping%20Street%2C%20Commerce%20District%2C%20New%20York%2C%20NY%2010001%2C%20USA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50"
        >
          <IconMapPin className="h-6 w-6 shrink-0 text-gofarm-gray" />
          <div>
            <h3 className="font-semibold text-gray-900">Visit Us</h3>
            <p className="mt-1 text-sm text-gray-600">123 Shopping Street, Commerce District, New York, NY 10001, USA</p>
          </div>
        </a>
        <a href="tel:15551234567" className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50">
          <IconPhone className="h-6 w-6 shrink-0 text-gofarm-gray" />
          <div>
            <h3 className="font-semibold text-gray-900">Call Us</h3>
            <p className="mt-1 text-sm text-gray-600">+1 (555) 123-4567</p>
          </div>
        </a>
        <div className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50">
          <IconClock className="h-6 w-6 shrink-0 text-gofarm-gray" />
          <div>
            <h3 className="font-semibold text-gray-900">Working Hours</h3>
            <p className="mt-1 text-sm text-gray-600">Monday - Friday: 9AM - 6PM</p>
          </div>
        </div>
        <a href="mailto:support@gofarm.com" className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50">
          <IconMail className="h-6 w-6 shrink-0 text-gofarm-gray" />
          <div>
            <h3 className="font-semibold text-gray-900">Email Us</h3>
            <p className="mt-1 text-sm text-gray-600">support@gofarm.com</p>
          </div>
        </a>
      </section>

      <section className="mt-10 rounded-2xl bg-white px-6 py-8 text-center shadow-[0_16px_35px_rgba(37,168,67,0.12)]">
        <h3 className="text-2xl font-extrabold text-gofarm-green">Need help finding a store?</h3>
        <p className="mt-2 text-sm text-gofarm-gray">Use the filters above or contact us and we&apos;ll point you to the nearest location.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-md bg-gofarm-green px-5 py-2.5 text-sm font-semibold text-white">
            Contact Us
          </Link>
          <Link href="/shop" className="inline-flex items-center justify-center rounded-md border border-gofarm-green px-5 py-2.5 text-sm font-semibold text-gofarm-green">
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingBuyButton />
    </div>
  );
}
