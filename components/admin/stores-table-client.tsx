"use client";

import { useState } from "react";
import { Pill, IconStore } from "@/components/admin/admin-shell";
import type { BackendStore } from "@/lib/backend/db";

export default function StoresTableClient({ initialStores }: { initialStores: BackendStore[] }) {
  const [stores, setStores] = useState(initialStores);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [statusFilter, setStatusFilter] = useState("All Stores");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<BackendStore | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    manager: "",
    status: "Active"
  });

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) || store.city.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === "All Stores") return matchesSearch;
    if (statusFilter === "Active") return matchesSearch && store.status === "Active";
    if (statusFilter === "Maintenance") return matchesSearch && store.status === "Maintenance";
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const pageStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);

  const openAddModal = () => {
    setFormData({ name: "", address: "", city: "", phone: "", email: "", manager: "", status: "Active" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (store: BackendStore) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      phone: store.phone,
      email: store.email,
      manager: store.manager,
      status: store.status
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create store");
      setStores([data, ...stores]);
      setIsAddModalOpen(false);
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    try {
      const response = await fetch(`/api/stores/${editingStore.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update store");
      setStores(stores.map(s => s.id === editingStore.id ? data : s));
      setIsEditModalOpen(false);
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const response = await fetch(`/api/stores/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete store");
      setStores(stores.filter(s => s.id !== id));
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Maintenance" : "Active";
    if (!window.confirm(`Change status of ${name} to ${newStatus}?`)) return;
    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update status");
      setStores(stores.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  return (
    <>
      {/* Top Search & Create Entry Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
        <input 
          type="text" 
          placeholder="Search stores or cities..." 
          className="px-4 py-2 border rounded-md text-sm w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#0b7312]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button 
          onClick={openAddModal}
          style={{ backgroundColor: '#0b7312', color: 'white' }}
          className="rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:bg-[#0a6610] transition-colors whitespace-nowrap"
        >
          + Add New Location
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
        {["All Stores", "Active", "Maintenance"].map((filterName) => (
          <button
            key={filterName}
            onClick={() => {
              setStatusFilter(filterName);
              setPage(1);
            }}
            className={`rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold transition-colors ${
              statusFilter === filterName 
                ? "bg-white text-[#0b7312] shadow-sm ring-1 ring-black/5" 
                : "bg-transparent text-[#5b6658] hover:bg-black/5"
            }`}
          >
            {filterName}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-hidden rounded-xl sm:rounded-[18px] ring-1 ring-black/5 bg-white">
        <table className="page-table min-w-[640px] sm:min-w-full w-full">
          <thead>
            <tr className="border-b border-black/5">
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px] font-semibold text-[#5b6658]">Store Info</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px] font-semibold text-[#5b6658]">Location</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px] font-semibold text-[#5b6658]">Manager</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[12px] font-semibold text-[#5b6658]">Status</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-[11px] sm:text-[12px] font-semibold text-[#5b6658]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageStores.map((store) => (
              <tr key={store.id} className="border-b border-black/5 last:border-0 hover:bg-[#f9faf7] transition-colors">
                <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: store.status === "Active" ? '#e6f7de' : '#fde3df', color: store.status === "Active" ? '#159720' : '#d6524a' }} 
                      className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-[12px] shrink-0 hover:opacity-80 transition-opacity"
                      title="View on map"
                    >
                      <IconStore className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                    <div className="min-w-0">
                      <div className="text-[12px] sm:text-[13px] font-bold text-[#243322] truncate">{store.name}</div>
                      <div className="text-[10px] sm:text-[12px] text-[#748171] truncate">{store.phone || store.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] text-[#4d5d4b] whitespace-nowrap">
                  {store.city}, {store.country}
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] text-[#4d5d4b] whitespace-nowrap">
                  {store.manager}
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                  <Pill tone={store.status === "Active" ? "green" : "red"}>{store.status}</Pill>
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right whitespace-nowrap">
                  <button 
                    onClick={() => handleToggleStatus(store.id, store.name, store.status)}
                    className="text-[11px] sm:text-[12px] font-semibold text-[#0b7312] hover:text-[#085a0e] mr-3"
                  >
                    {store.status === "Active" ? "Set Maintenance" : "Set Active"}
                  </button>
                  <button 
                    onClick={() => openEditModal(store)}
                    className="text-[11px] sm:text-[12px] font-semibold text-[#0b7312] hover:text-[#085a0e] mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(store.id, store.name)}
                    className="text-[11px] sm:text-[12px] font-semibold text-[#d32f2f] hover:text-[#b71c1c]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pageStores.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#748171]">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="text-sm font-semibold text-[#0b7312] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr; Previous
          </button>
          <span className="text-[13px] font-medium text-[#748171]">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="text-sm font-semibold text-[#0b7312] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#223021] mb-4">Add New Store Location</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">Store Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">Address *</label>
                <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">City *</label>
                <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5b6658] mb-1">Manager</label>
                  <input type="text" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5b6658] mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-[#5b6658] hover:bg-[#f0f5e4] rounded-lg transition-colors">Cancel</button>
                <button type="submit" style={{ backgroundColor: '#0b7312' }} className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow hover:bg-[#0a6610] transition-colors">Create Store</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#223021] mb-4">Edit Store Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">Store Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">Address *</label>
                <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5b6658] mb-1">City *</label>
                <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5b6658] mb-1">Manager</label>
                  <input type="text" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5b6658] mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0b7312]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-[#5b6658] hover:bg-[#f0f5e4] rounded-lg transition-colors">Cancel</button>
                <button type="submit" style={{ backgroundColor: '#0b7312' }} className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow hover:bg-[#0a6610] transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
