"use client";

import { useState, useEffect, useRef } from "react";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type Tab = "profile" | "password" | "about";

export function AdminSettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Password Form State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setProfile(data);
          setName(data.name);
          setEmail(data.email);
          const saved = localStorage.getItem(`gofarm_admin_avatar_${data.id}`);
          if (saved) setAvatar(saved);
        } else {
          setError(data.error || "Unable to load information");
        }
      })
      .catch(() => setError("Server connection error"))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Only image files are accepted (JPG, PNG, WebP)" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Image size is too large, please choose < 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      localStorage.setItem(`gofarm_admin_avatar_${profile?.id}`, base64);
      setAvatar(base64);
      setToast({ type: "success", message: "Profile picture updated!" });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    localStorage.removeItem(`gofarm_admin_avatar_${profile?.id}`);
    setAvatar("");
    setToast({ type: "success", message: "Profile picture removed" });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmittingProfile(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-profile", name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setToast({ type: "success", message: "Information updated successfully!" });
      if (data.user) setProfile({ ...profile!, ...data.user });
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Update failed" });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) return;
    if (newPass !== confirmPass) {
      setToast({ type: "error", message: "New passwords do not match" });
      return;
    }
    if (newPass.length < 8) {
      setToast({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }
    setIsSubmittingPass(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Change failed");
      setToast({ type: "success", message: "Password changed successfully!" });
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Password change failed" });
    } finally {
      setIsSubmittingPass(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-sm text-gofarm-gray">Loading information...</div>;
  if (error || !profile) return <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-100">{error || "Error loading data"}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pt-4">
      {toast && (
        <div 
          style={{ backgroundColor: toast.type === 'success' ? '#00a844' : '#dc2626' }}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all"
        >
          {toast.message}
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ backgroundColor: 'rgba(0, 168, 68, 0.12)' }} className="inline-flex gap-1 rounded-full p-1.5">
        {[
          { key: "profile", label: "Personal Info" },
          { key: "password", label: "Change Password" },
          { key: "about", label: "System Info" }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            style={{
              backgroundColor: tab === t.key ? '#ffffff' : 'transparent',
              color: tab === t.key ? "#00a844" : "#6b7280"
            }}
            className="rounded-full px-6 py-2.5 text-[13px] font-bold transition-all shadow-sm"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-stretch">
        {/* Left Card (Profile/Avatar) */}
        <div className="h-full rounded-[32px] bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="relative">
            <div 
              style={{ borderColor: 'rgba(0, 168, 68, 0.12)', backgroundColor: '#00a844' }}
              className="w-40 h-40 rounded-full flex items-center justify-center border-4 overflow-hidden"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-5xl font-extrabold">{profile.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button 
              onClick={() => fileRef.current?.click()}
              style={{ backgroundColor: '#00a844' }}
              className="absolute bottom-2 right-2 w-8 h-8 text-white rounded-full flex items-center justify-center shadow hover:bg-gofarm-light-green transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <h2 className="mt-8 text-xl font-bold text-gofarm-black">{profile.name}</h2>
          <p className="text-[13px] text-gofarm-gray mt-1 capitalize">{profile.role} Access</p>

          <div className="mt-6 w-full space-y-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
            <button 
              onClick={() => fileRef.current?.click()}
              style={{ backgroundColor: '#00a844' }}
              className="w-full rounded-full text-white py-3 text-[13px] font-bold flex items-center justify-center gap-2 shadow transition-colors hover:opacity-90"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {avatar ? "Change photo" : "Upload photo"}
            </button>
            
            {avatar && (
              <button 
                onClick={handleRemoveAvatar}
                className="w-full text-[#d43c35] hover:underline text-[13px] font-bold block py-1 transition-colors"
              >
                Delete photo
              </button>
            )}
          </div>

          <span className="text-[11px] text-[#a0ad9e] mt-4 block">JPG, PNG, WEBP · MAX 2MB</span>
        </div>

        {/* Right Card (Tab Forms) */}
        <div className="h-full lg:col-span-2 rounded-[32px] bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between min-h-[400px]">
          {tab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                  <div style={{ backgroundColor: 'rgba(0, 168, 68, 0.12)', color: '#00a844' }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gofarm-black">Personal Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      style={{ backgroundColor: '#f9fafb' }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-black font-medium text-sm border-none outline-none transition-all focus:ring-2 focus:ring-gofarm-green"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      style={{ backgroundColor: '#f9fafb' }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-black font-medium text-sm border-none outline-none transition-all focus:ring-2 focus:ring-gofarm-green"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5 flex items-center gap-1">
                      Role 
                      <svg className="w-3.5 h-3.5 text-[#a0ad9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </label>
                    <div 
                      style={{ backgroundColor: "rgba(0, 168, 68, 0.08)" }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-gray font-medium text-sm cursor-not-allowed flex items-center gap-2"
                    >
                      <svg style={{ color: '#00a844' }} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                      </svg>
                      <span className="capitalize">{profile.role}</span>
                    </div>
                    <span className="text-[10px] text-[#a0ad9e] mt-1.5 block pl-4">Administrator roles cannot be changed manually.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">Account Created At</label>
                    <div 
                      style={{ backgroundColor: "rgba(0, 168, 68, 0.08)" }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-gray font-medium text-sm cursor-not-allowed flex items-center gap-2"
                    >
                      <svg style={{ color: '#00a844' }} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })} · {new Date(profile.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmittingProfile}
                  style={{ background: "linear-gradient(90deg, #00a844, #3b9c3c)" }}
                  className="rounded-full hover:brightness-105 text-white w-full md:w-[350px] py-4 text-[14px] font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70"
                >
                  {isSubmittingProfile ? "Saving..." : "Save Changes"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                  <div style={{ backgroundColor: 'rgba(0, 168, 68, 0.12)', color: '#00a844' }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gofarm-black">Change Password</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPass} 
                      onChange={(e) => setCurrentPass(e.target.value)} 
                      style={{ backgroundColor: '#f9fafb' }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-black font-medium text-sm border-none outline-none transition-all focus:ring-2 focus:ring-gofarm-green"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      value={newPass} 
                      onChange={(e) => setNewPass(e.target.value)} 
                      style={{ backgroundColor: '#f9fafb' }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-black font-medium text-sm border-none outline-none transition-all focus:ring-2 focus:ring-gofarm-green"
                      placeholder="Min 8 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1.5">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPass} 
                      onChange={(e) => setConfirmPass(e.target.value)} 
                      style={{ backgroundColor: '#f9fafb' }}
                      className="w-full px-5 py-3.5 rounded-full text-gofarm-black font-medium text-sm border-none outline-none transition-all focus:ring-2 focus:ring-gofarm-green"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmittingPass}
                  style={{ background: "linear-gradient(90deg, #00a844, #3b9c3c)" }}
                  className="rounded-full hover:brightness-105 text-white w-full md:w-[350px] py-4 text-[14px] font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70"
                >
                  {isSubmittingPass ? "Saving..." : "Change Password"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {tab === "about" && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                  <div style={{ backgroundColor: 'rgba(0, 168, 68, 0.12)', color: '#00a844' }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gofarm-black">System Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "System Version", value: "GoFarm v1.0.0" },
                    { label: "Database", value: "MySQL (Production)" },
                    { label: "Framework", value: "Next.js 15 (App Router)" },
                    { label: "Account ID", value: profile.id },
                    { label: "Last Updated", value: new Date(profile.updatedAt).toLocaleString("en-US") }
                  ].map((item) => (
                    <div key={item.label} style={{ backgroundColor: '#f9fafb' }} className="rounded-2xl px-5 py-3.5 flex flex-col">
                      <span className="text-[10px] font-bold text-gofarm-gray tracking-[0.1em] uppercase mb-1">{item.label}</span>
                      <span className="text-[13px] text-gofarm-black font-semibold truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
