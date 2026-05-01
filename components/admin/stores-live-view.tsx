"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell, IconBell, IconStore, Pill } from "@/components/admin/admin-shell";

export type LiveStoreRow = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  manager: string;
  contact: string;
  imageSrc: string;
  status: "Active" | "Maintenance";
  tint: "green" | "red";
  updatedAt: string;
};

export type LiveAuditRow = {
  id: string;
  manager: string;
  traffic: string;
  delta: string;
  deltaTone: string;
  lastAudit: string;
};

type StoresLiveViewProps = {
  stores: LiveStoreRow[];
  auditRows: LiveAuditRow[];
  weeklyFootfallLabel: string;
  restockAlerts: number;
  activeStores: number;
  maintenanceStores: number;
};

type CoordMap = Record<string, { lat: number; lon: number }>;

const FALLBACK_BY_CITY: Record<string, { lat: number; lon: number }> = {
  portland: { lat: 45.5152, lon: -122.6784 },
  salem: { lat: 44.9429, lon: -123.0351 },
  bend: { lat: 44.0582, lon: -121.3153 },
};

function normalizeCity(city: string) {
  return city.trim().toLowerCase();
}

function mercatorY(lat: number) {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

function timeAgoLabel(value: string) {
  const then = Date.parse(value);
  if (!Number.isFinite(then)) return "Recently";
  const diffHours = Math.max(1, Math.round((Date.now() - then) / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return diffDays <= 1 ? "Yesterday" : `${diffDays}d ago`;
}

export default function StoresLiveView({
  stores,
  auditRows,
  weeklyFootfallLabel,
  restockAlerts,
  activeStores,
  maintenanceStores,
}: StoresLiveViewProps) {
  const router = useRouter();

  if (stores.length === 0) {
    return (
      <AdminShell
        activeHref="/admin/stores"
        title="Store Management"
        subtitle="Operational hub for global agricultural distribution centers."
        searchPlaceholder="Search stores, regions, or audits..."
        userName="Marcus Thorne"
        userRole="Regional Manager"
        userLabel="GoFarm Central"
        hideHeading
      >
        <div className="rounded-[24px] border border-black/5 bg-white p-8 text-center text-gofarm-gray">
          No store records are available in the current database.
        </div>
      </AdminShell>
    );
  }

  const [selectedId, setSelectedId] = useState(stores[0]?.id ?? "");
  const [coords, setCoords] = useState<CoordMap>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function loadCoords() {
      const entries = await Promise.all(
        stores.map(async (store) => {
          const fallback = FALLBACK_BY_CITY[normalizeCity(store.city)];
          try {
            const query = encodeURIComponent(`${store.address}, ${store.city}, ${store.country}`);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`, {
              headers: { Accept: "application/json" },
            });
            const result = (await response.json()) as Array<{ lat: string; lon: string }>;
            const first = result[0];
            if (first && !cancelled) {
              return [store.id, { lat: Number(first.lat), lon: Number(first.lon) }] as const;
            }
          } catch {}

          if (fallback) {
            return [store.id, fallback] as const;
          }

          return [store.id, { lat: 45.2, lon: -122.4 }] as const;
        })
      );

      if (!cancelled) {
        setCoords(Object.fromEntries(entries));
      }
    }

    loadCoords();
    return () => {
      cancelled = true;
    };
  }, [stores]);

  const mappedStores = useMemo(
    () =>
      stores.map((store) => ({
        ...store,
        coord: coords[store.id] ?? FALLBACK_BY_CITY[normalizeCity(store.city)] ?? { lat: 45.2, lon: -122.4 },
      })),
    [coords, stores]
  );

  const selectedStore = mappedStores.find((store) => store.id === selectedId) ?? mappedStores[0];

  const mapBounds = useMemo(() => {
    const latitudes = mappedStores.map((store) => store.coord.lat);
    const longitudes = mappedStores.map((store) => store.coord.lon);
    const minLat = Math.min(...latitudes) - 0.18;
    const maxLat = Math.max(...latitudes) + 0.18;
    const minLon = Math.min(...longitudes) - 0.24;
    const maxLon = Math.max(...longitudes) + 0.24;
    return { minLat, maxLat, minLon, maxLon };
  }, [mappedStores]);

  const mapUrl = useMemo(() => {
    const { minLat, maxLat, minLon, maxLon } = mapBounds;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik`;
  }, [mapBounds]);

  const markerPositions = useMemo(() => {
    const { minLat, maxLat, minLon, maxLon } = mapBounds;
    const minY = mercatorY(minLat);
    const maxY = mercatorY(maxLat);

    return mappedStores.map((store) => {
      const left = ((store.coord.lon - minLon) / (maxLon - minLon)) * 100;
      const top = ((maxY - mercatorY(store.coord.lat)) / (maxY - minY)) * 100;
      return { ...store, left, top };
    });
  }, [mapBounds, mappedStores]);

  return (
    <AdminShell
      activeHref="/admin/stores"
      title="Store Management"
      subtitle="Operational hub for global agricultural distribution centers."
      searchPlaceholder="Search stores, regions, or audits..."
      userName="Marcus Thorne"
      userRole="Regional Manager"
      userLabel="GoFarm Central"
      hideHeading
    >
      <div className="space-y-6 text-gofarm-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">Admin • Hub</div>
            <h1 className="mt-2 text-[24px] font-extrabold tracking-[-0.05em] text-gofarm-black">Store Management</h1>
            <p className="mt-1 text-[13px] text-gofarm-gray">Operational hub for global agricultural distribution centers.</p>
          </div>
          <div className="pt-1">
            <Link href="/admin/stores" className="pm-add-button">
              <span className="pm-add-icon">+</span>
              <span>Add New Location</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_260px]">
          <section className="rounded-[24px] border border-black/5 bg-white p-2 shadow-[0_16px_34px_rgba(34,58,27,0.08)]">
            <div style={{ backgroundColor: '#73cdd8' }} className="relative h-[320px] overflow-hidden rounded-[20px]">
              <iframe title="Live store map" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" />
              <div style={{ background: 'linear-gradient(180deg, rgba(115,205,216,0.04), rgba(115,205,216,0.12))' }} className="absolute inset-0" />
              <div className="absolute left-4 top-4 rounded-[16px] bg-white/96 px-4 py-3 shadow-[0_12px_28px_rgba(26,55,29,0.12)]">
                <div className="text-[14px] font-bold text-gofarm-black">Regional Coverage</div>
                <div className="mt-1 text-[10px] text-gofarm-gray">
                  {activeStores} Active Nodes | {maintenanceStores} Pending
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-gofarm-gray">
                  <span style={{ backgroundColor: "#00a844" }} className="h-3 w-3 rounded-full" />
                  <span style={{ backgroundColor: "rgba(0, 168, 68, 0.38)" }} className="h-3 w-3 rounded-full" />
                  <span style={{ backgroundColor: '#f68ab7' }} className="h-3 w-3 rounded-full" />
                  <span className="ml-1">{coords[selectedStore?.id ?? ""] ? "Live mapping" : "Locating..."}</span>
                </div>
              </div>

              {markerPositions.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedId(store.id)}
                  className="absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-white shadow-md"
                  style={{
                    left: `${store.left}%`,
                    top: `${store.top}%`,
                    background: store.status === "Maintenance" ? "#f269a0" : "#00a844",
                  }}
                  aria-label={`Select ${store.name}`}
                >
                  <span className="block h-2.5 w-2.5 rounded-full bg-white/90" />
                </button>
              ))}

              {selectedStore ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-gofarm-black shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
                >
                  <IconStore className="h-4 w-4 text-gofarm-green" />
                  {selectedStore.name}
                </a>
              ) : null}
            </div>
          </section>

          <div className="grid gap-4">
            <section
              style={{ background: "linear-gradient(180deg, #00a844 0%, #008038 100%)" }}
              className="rounded-[22px] p-5 text-white shadow-[0_16px_32px_rgba(0,168,68,0.25)]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">Weekly Footfall</div>
              <div className="mt-2 text-[38px] font-extrabold leading-none tracking-[-0.08em]">{weeklyFootfallLabel}</div>
              <div className="mt-2 text-[11px] text-white/72">Calculated from real 7-day order volume</div>
            </section>

            <section className="rounded-[22px] bg-gradient-to-b from-gray-50 to-gofarm-light-orange/30 p-5 shadow-[0_16px_32px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-gofarm-green shadow-sm">
                  <IconBell className="h-5 w-5" />
                </div>
                <div className="text-gofarm-gray">...</div>
              </div>
              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gofarm-gray">Restock Alerts</div>
              <div className="mt-3 flex items-end gap-2">
                <div className="text-[34px] font-extrabold leading-none tracking-[-0.07em] text-gofarm-black">
                  {String(restockAlerts).padStart(2, "0")}
                </div>
                <div className="pb-1 text-[13px] font-semibold text-gofarm-gray">Urgent</div>
              </div>
              <div style={{ backgroundColor: "#e5e7eb" }} className="mt-5 h-1.5 overflow-hidden rounded-full">
                <div style={{ backgroundColor: "#00a844" }} className="h-full w-[68%] rounded-full" />
              </div>
            </section>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[16px] font-extrabold tracking-[-0.03em] text-gofarm-black">Active Outlets</h2>
            <Link href="/admin/stores" className="text-[12px] font-semibold text-gofarm-green hover:text-gofarm-light-green">
              View All +
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {mappedStores.map((store) => (
              <article key={store.id} className="rounded-[20px] border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-[14px] bg-gray-100">
                      <img src={store.imageSrc} alt={store.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold tracking-[-0.03em] text-gofarm-black">{store.name}</div>
                      <div className="mt-1 text-[12px] text-gofarm-gray">• {store.address}</div>
                    </div>
                  </div>
                  <Pill tone={store.status === "Active" ? "green" : "gray"}>
                    {store.status === "Active" ? "OPEN NOW" : "CLOSING SOON"}
                  </Pill>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="text-[12px] font-semibold text-gofarm-gray">{store.contact}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gofarm-green/12 text-gofarm-green hover:bg-gofarm-green/20"
                  >
                    +
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_16px_34px_rgba(34,58,27,0.05)]">
          <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-gofarm-black">Regional Audit Logs</h2>
              <p className="mt-1 text-[12px] text-gofarm-gray">Real-time performance and compliance tracking</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-gofarm-gray">
                  <th className="px-5 py-4">Store Identity</th>
                  <th className="px-5 py-4">Contact Point</th>
                  <th className="px-5 py-4">Operational Status</th>
                  <th className="px-5 py-4">Daily Traffic</th>
                  <th className="px-5 py-4">Last Audit</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {mappedStores.map((store, index) => {
                  const audit = auditRows[index] ?? {
                    id: store.id,
                    manager: store.manager,
                    traffic: "0",
                    delta: "0%",
                    deltaTone: "text-gofarm-gray",
                    lastAudit: store.updatedAt,
                  };

                  return (
                    <tr key={store.id} className="border-t border-gray-100">
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              backgroundColor: store.tint === "green" ? "rgba(0, 168, 68, 0.12)" : "#fde3df",
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${
                              store.tint === "green" ? "text-gofarm-green" : "text-[#d6524a]"
                            }`}
                          >
                            <IconStore className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-gofarm-black">{store.name}</div>
                            <div className="mt-0.5 text-[11px] text-gray-500">{store.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-[13px] text-gofarm-gray">{audit.manager}</td>
                      <td className="px-5 py-5">
                        <Pill tone={store.tint === "green" ? "green" : "red"}>
                          {store.status === "Active" ? "VERIFIED" : "MAINTENANCE"}
                        </Pill>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-[13px]">
                          <span className="font-bold text-gofarm-black">{audit.traffic}</span>
                          <span className={`text-[11px] font-semibold ${audit.deltaTone}`}>{audit.delta}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-[13px] text-gofarm-gray">{timeAgoLabel(audit.lastAudit)}</td>
                      <td className="px-5 py-5 text-right text-gray-400">{">"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gofarm-gray">
            Load More Records
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
