"use client";

import { useState, useMemo } from "react";
import { Pill } from "@/components/admin/admin-shell";
import { InvIconBan, InvIconEdit, InvIconTrash, InvIconUnban } from "@/components/admin/inventory-style-actions";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: string;
  tone: "green" | "gray" | "red" | "yellow" | "blue" | "pink";
  avatar: string;
};

export default function CustomersTableClient({ initialUsers }: { initialUsers: CustomerRow[] }) {
  const [users, setUsers] = useState<CustomerRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Users");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = !search || 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = roleFilter === "All Users" || 
        (roleFilter === "Staff Members" && user.role === "Admin") ||
        (roleFilter === "Customers" && user.role === "Customer");
        
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Customer");
    setFormError("");
    setIsEditing(false);
    setEditId("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: CustomerRow) => {
    resetForm();
    setIsEditing(true);
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const url = isEditing ? `/api/users/${editId}` : "/api/users";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: role.toLowerCase() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const newUser: CustomerRow = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role === "admin" ? "Admin" : "Customer",
        joinDate: data.createdAt,
        status: "Active",
        tone: "green",
        avatar: data.name
          .split(" ")
          .slice(0, 2)
          .map((part: string) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || data.email.slice(0, 2).toUpperCase(),
      };

      if (isEditing) {
        setUsers(users.map(u => u.id === data.id ? newUser : u));
      } else {
        setUsers([newUser, ...users]);
      }
      
      closeModal();
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }
      
      setUsers(users.filter(u => u.id !== id));
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  const handleToggleBan = async (id: string, userName: string, currentStatus: string) => {
    const newStatus = currentStatus === "Banned" ? "Active" : "Banned";
    const actionName = currentStatus === "Banned" ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${actionName} ${userName}?`)) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: users.find(u => u.id === id)?.email || "", status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${actionName} user`);
      }
      
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus, tone: newStatus === "Banned" ? "red" : "green" } : u));
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
          placeholder="Search name or email..." 
          className="px-4 py-2 border border-[#d4e0ca] rounded-md text-sm w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#0b7312]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button 
          onClick={openAddModal}
          style={{ backgroundColor: '#0b7312', color: 'white' }}
          className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm hover:bg-[#0a6610] hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7312]/40 focus-visible:ring-offset-1 transition-all duration-200 whitespace-nowrap"
        >
          + Create Account
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
        {["All Users", "Staff Members", "Customers"].map((filterName) => (
          <button
            key={filterName}
            onClick={() => {
              setRoleFilter(filterName);
              setPage(1);
            }}
            className={`rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold transition-colors ${
              roleFilter === filterName 
                ? "bg-white text-[#0b7312] shadow-sm border border-[#dbead2]" 
                : "bg-transparent text-[#5b6658] hover:bg-[#edf5e7]"
            }`}
          >
            {filterName}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-data-table-shell">
        <table className="page-table min-w-[640px] sm:min-w-full w-full font-medium">
          <thead>
            <tr className="border-b border-[#e3ebdf] bg-gradient-to-r from-[#f8fbf4] to-[#f2f8ec]">
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#5b6658]">User Profile</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#5b6658]">Role</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#5b6658]">Join Date</th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#5b6658]">Status</th>
              <th className="page-table-col-actions w-[180px] py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-[#5b6658]">
                <div className="page-table-actions-head">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#eef2eb] last:border-0 hover:bg-gradient-to-r hover:from-[#fbfdf8] hover:to-[#f4faef] transition-all duration-200">
                <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#203028] text-[10px] sm:text-[12px] font-bold text-white shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] sm:text-[13px] font-bold text-[#243322] truncate">{user.name}</div>
                      <div className="text-[10px] sm:text-[12px] text-[#748171] truncate">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                  <Pill tone={user.role === "Admin" ? "green" : "gray"}>{user.role}</Pill>
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[13px] text-[#4d5d4b] whitespace-nowrap">
                  {new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                </td>
                <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">
                  <Pill tone={user.tone}>{user.status.toUpperCase()}</Pill>
                </td>
                <td className="page-table-col-actions w-[180px] py-2.5 sm:py-3 whitespace-nowrap">
                  <div className="page-table-actions-cell">
                    <div className="admin-icon-actions">
                      <button
                        type="button"
                        onClick={() => handleToggleBan(user.id, user.name, user.status)}
                        className={user.status === "Banned" ? "admin-icon-actions-accent" : "admin-icon-actions-danger"}
                        title={user.status === "Banned" ? "Unban User" : "Ban User"}
                        aria-label={user.status === "Banned" ? `Unban ${user.name}` : `Ban ${user.name}`}
                      >
                        {user.status === "Banned" ? <InvIconUnban /> : <InvIconBan />}
                      </button>
                      <button type="button" onClick={() => openEditModal(user)} title="Edit user" aria-label={`Edit ${user.name}`}>
                        <InvIconEdit />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-actions-danger"
                        onClick={() => handleDelete(user.id, user.name)}
                        title="Delete user"
                        aria-label={`Delete ${user.name}`}
                      >
                        <InvIconTrash />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {pageUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#748171]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#6f7b6d] px-2">
          <div>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f6ea] hover:bg-[#e4ebd8] disabled:opacity-50"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              let pageNum = i + 1;
              if (pageCount > 5) {
                if (page > 3 && page < pageCount - 2) pageNum = page - 2 + i;
                else if (page >= pageCount - 2) pageNum = pageCount - 4 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    backgroundColor: page === pageNum ? '#0b7312' : '',
                    color: page === pageNum ? '#ffffff' : ''
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    page !== pageNum 
                      ? "bg-white ring-1 ring-[#dbead2] hover:bg-[#edf5e7] text-[#243322]" 
                      : "font-bold"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f2f6ea] hover:bg-[#e4ebd8] disabled:opacity-50"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* User CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-[#e3ebdf] flex justify-between items-center bg-[#fdfefc]">
              <h3 className="text-lg font-bold text-[#1a2519]">
                {isEditing ? "Edit User" : "Create New User"}
              </h3>
              <button 
                onClick={closeModal} 
                className="text-[#6f7b6d] hover:text-[#243322] rounded-full p-1 hover:bg-[#edf5e7] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {formError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3b4739] mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#d4e0ca] rounded-lg outline-none focus:ring-2 focus:ring-[#0b7312]/30 focus:border-[#0b7312]"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#3b4739] mb-1.5">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#d4e0ca] rounded-lg outline-none focus:ring-2 focus:ring-[#0b7312]/30 focus:border-[#0b7312]"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#3b4739] mb-1.5">
                    {isEditing ? "New Password (leave blank to keep current)" : "Password"}
                  </label>
                  <input 
                    required={!isEditing}
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#d4e0ca] rounded-lg outline-none focus:ring-2 focus:ring-[#0b7312]/30 focus:border-[#0b7312]"
                    placeholder={isEditing ? "••••••••" : "Create a password"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3b4739] mb-1.5">Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className="w-full px-3 py-2 border border-[#d4e0ca] rounded-lg outline-none focus:ring-2 focus:ring-[#0b7312]/30 focus:border-[#0b7312] bg-white appearance-none"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-[#5b6658] hover:bg-[#f0f5e4] rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#0b7312', color: 'white' }}
                  className="px-6 py-2 text-sm font-semibold rounded-lg hover:bg-[#09610f] hover:shadow-md active:scale-[0.99] transition-all duration-200 disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

