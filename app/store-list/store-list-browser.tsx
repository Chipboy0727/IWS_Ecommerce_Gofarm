"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreItem } from "@/lib/store-list-data";

// ==================== ICONS ====================
function IconStore({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </svg>
  );
}

function IconMapPin({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a1 1 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconX({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconExternal({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconStar({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// ==================== STORE CARD ====================
function StoreCard({ store }: { store: StoreItem }) {
  const openGoogleMaps = () => {
    const address = encodeURIComponent(`${store.address}, ${store.city}, ${store.country}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gofarm-green/0 via-gofarm-green/10 to-gofarm-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gofarm-green/15 to-gofarm-light-green/10">
            <IconStore className="h-5 w-5 sm:h-6 sm:w-6 text-gofarm-green" />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < 4 ? "text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="rounded-full bg-green-100 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-medium text-green-700">
              Open
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-gofarm-green transition-colors line-clamp-1">
          {store.name}
        </h3>
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <IconMapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
          <p className="text-[10px] sm:text-xs text-gray-500">{store.city}, {store.country}</p>
        </div>

        <div className="space-y-1.5 sm:space-y-2 text-sm border-t border-gray-100 pt-2.5 sm:pt-3">
          <div className="flex items-start gap-1.5 sm:gap-2 text-gray-600">
            <IconMapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 shrink-0 text-gofarm-green" />
            <span className="text-[10px] sm:text-xs line-clamp-2">{store.address}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
            <IconPhone className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-gofarm-green" />
            <a href={`tel:${store.phone}`} className="text-[10px] sm:text-xs hover:text-gofarm-green transition-colors">
              {store.phone}
            </a>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
            <IconClock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-gofarm-green" />
            <span className="text-[10px] sm:text-xs line-clamp-1">{store.hours}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 sm:pt-5">
          <button
            onClick={openGoogleMaps}
            className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gray-900 px-2.5 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold text-white transition-all hover:bg-gofarm-green hover:gap-2 sm:hover:gap-3"
          >
            <IconMapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Get Directions
            <IconExternal className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAP PANEL ====================
function MapPanel({ stores }: { stores: StoreItem[] }) {
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(stores[0] || null);

  const openGoogleMaps = (store: StoreItem) => {
    const address = encodeURIComponent(`${store.address}, ${store.city}, ${store.country}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
  };

  const getDirections = (store: StoreItem) => {
    const address = encodeURIComponent(`${store.address}, ${store.city}, ${store.country}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, "_blank");
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 sm:px-5 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gofarm-green/10">
            <IconGlobe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gofarm-green" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">Store Locations Map</h2>
            <p className="text-[10px] sm:text-xs text-gray-500">{stores.length} stores available</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 max-h-64 md:max-h-96 overflow-y-auto md:w-[40%] shrink-0">
          <div className="p-2 sm:p-3">
            <div className="space-y-1 sm:space-y-1.5">
              {stores.map((store, idx) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full text-left rounded-xl p-2.5 sm:p-3 transition-all duration-200 ${selectedStore?.id === store.id
                    ? "bg-gofarm-green text-white shadow-md"
                    : "bg-white hover:bg-gofarm-green/5 border border-gray-100 hover:border-gofarm-green/30"
                    }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold ${selectedStore?.id === store.id
                      ? "bg-white/20 text-white"
                      : "bg-gofarm-green/10 text-gofarm-green"
                      }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold text-xs sm:text-sm ${selectedStore?.id === store.id ? "text-white" : "text-gray-900"}`}>
                        {store.name}
                      </p>
                      <p className={`text-[10px] sm:text-xs ${selectedStore?.id === store.id ? "text-white/70" : "text-gray-500"}`}>
                        {store.city}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 flex-1">
          {selectedStore ? (
            <div className="text-center">
              <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gofarm-green/10 mx-auto">
                <IconStore className="h-7 w-7 sm:h-8 sm:w-8 text-gofarm-green" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">{selectedStore.name}</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 break-words">{selectedStore.address}</p>

              <div className="flex flex-col gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => openGoogleMaps(selectedStore)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gofarm-green px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-gofarm-light-green"
                >
                  <IconMapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Open in Google Maps
                  <IconExternal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
                <button
                  onClick={() => getDirections(selectedStore)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-2 border-gofarm-green bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gofarm-green transition-all hover:bg-gofarm-green hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Directions
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
                  <div className="text-left">
                    <p className="text-gray-400 mb-0.5">📞 Phone</p>
                    <a href={`tel:${selectedStore.phone}`} className="text-gofarm-green hover:underline text-[10px] sm:text-xs break-words">
                      {selectedStore.phone}
                    </a>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 mb-0.5">✉️ Email</p>
                    <a href={`mailto:${selectedStore.email}`} className="text-gofarm-green hover:underline text-[10px] sm:text-xs truncate block">
                      {selectedStore.email}
                    </a>
                  </div>
                  <div className="sm:col-span-2 text-left">
                    <p className="text-gray-400 mb-0.5">🕒 Hours</p>
                    <p className="text-gray-600 text-[10px] sm:text-xs break-words">{selectedStore.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <IconMapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">Select a store to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function StoreListBrowser({ stores }: { stores: StoreItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [isLocating, setIsLocating] = useState(false);

  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        let nearestStore = stores[0];
        let minDistance = Infinity;

        stores.forEach(store => {
          if (store.lat && store.lng) {
            // Simplified distance calculation for relative comparison
            const dist = Math.sqrt(
              Math.pow(store.lat - latitude, 2) +
              Math.pow(store.lng - longitude, 2)
            );
            if (dist < minDistance) {
              minDistance = dist;
              nearestStore = store;
            }
          }
        });

        if (nearestStore) {
          setSearchQuery(nearestStore.name);
          setSelectedCountry("all");
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Unable to retrieve your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const countries = useMemo(() => {
    return ["all", ...new Set(stores.map(s => s.country))];
  }, [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = searchQuery === "" ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === "all" || store.country === selectedCountry;
      return matchesSearch && matchesCountry;
    });
  }, [stores, searchQuery, selectedCountry]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
  };

  const hasFilters = searchQuery !== "" || selectedCountry !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* Hero Section */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <button
            onClick={handleFindNearMe}
            disabled={isLocating}
            className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-gofarm-green shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait"
          >
            {isLocating ? (
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <IconMapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            {isLocating ? "Finding nearest store..." : "Find near store"}
          </button>
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Store Locations
          </h1>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-gray-500 px-3">
            Visit us at any of our locations across the country
          </p>
        </div>

        {/* Search and Filter Bar - ĐÃ SỬA LỖI ĐÈ CHỮ */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md">

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4.5 pointer-events-none">
                  <IconSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by store name or city..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition-all focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Country Select - ĐÃ SỬA LỖI ĐÈ CHỮ */}
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4.5 pointer-events-none">
                  <IconGlobe className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-8 text-sm outline-none transition-all focus:border-gofarm-green focus:ring-2 focus:ring-gofarm-green/20"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IconChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Clear Button */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <IconX className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Result count */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Found <span className="font-semibold text-gofarm-green">{filteredStores.length}</span> stores
            </p>
          </div>
        </div>

        {/* Results */}
        {filteredStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12 sm:py-16 text-center shadow-sm">
            <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100">
              <IconStore className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-semibold text-gray-900">No stores found</h3>
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 px-3">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="rounded-xl bg-gofarm-green px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-gofarm-light-green"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
            <MapPanel stores={filteredStores} />
          </>
        )}

        {/* CTA Section */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-gradient-to-r from-gofarm-green/5 via-white to-gofarm-light-green/5 p-5 sm:p-6 text-center">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Need help finding a store?</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Contact us and we'll point you to the nearest location.</p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-gofarm-green px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-gofarm-light-green hover:scale-105"
            >
              Contact Support
            </Link>
            <Link
              href="/shop"
              className="rounded-xl border-2 border-gofarm-green bg-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gofarm-green transition-all hover:bg-gofarm-green hover:text-white hover:scale-105"
            >
              Shop Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}