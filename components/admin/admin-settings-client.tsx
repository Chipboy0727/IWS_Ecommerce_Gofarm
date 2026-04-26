"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type Tab = "profile" | "password" | "about";

// ─── Icons ──────────────────────────────────────────────────────────────────

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconEye({ show }: { show: boolean }) {
  if (show) return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldInput({
  label, value, onChange, type = "text", placeholder = "", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;
  return (
    <div>
      <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#82907f]">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[10px] bg-[#f2f7ea] border border-[#e0e8d4] px-4 py-2.5 text-[13px] text-[#263225] outline-none focus:border-[#0b7312] focus:ring-2 focus:ring-[#0b7312]/20 transition placeholder-[#a0ad9e]"
          style={{ paddingRight: type === "password" ? "42px" : undefined }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9888] hover:text-[#0b7312]"
          >
            <IconEye show={show} />
          </button>
        )}
      </div>
    </div>
  );
}

function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", top: "24px", right: "24px", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 18px", borderRadius: "14px", fontSize: "13px", fontWeight: 600,
        boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
        background: type === "success" ? "#0b7312" : "#d43c35",
        color: "#fff",
        animation: "slideIn 0.25s ease",
      }}
    >
      {type === "success" ? <IconCheck /> : <IconAlert />}
      {message}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Too weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["#d43c35", "#e67e22", "#f39c12", "#27ae60", "#0b7312"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i < score ? colors[score] : "#e0e8d4" }} />
        ))}
      </div>
      <p className="text-[11px]" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ profile, onUpdate, avatar, onAvatarChange }: {
  profile: AdminProfile;
  onUpdate: (p: AdminProfile) => void;
  avatar: string;
  onAvatarChange: (src: string) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Only image files are accepted (JPG, PNG, WebP)" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Image is too large, please choose a file smaller than 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      localStorage.setItem(`gofarm_admin_avatar_${profile.id}`, base64);
      onAvatarChange(base64);
      setToast({ type: "success", message: "Profile picture updated successfully!" });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    localStorage.removeItem(`gofarm_admin_avatar_${profile.id}`);
    onAvatarChange("");
    setToast({ type: "success", message: "Profile picture removed" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "update-profile", name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setToast({ type: "success", message: "Updated successfully!" });
      if (data.user) onUpdate({ ...profile, ...data.user });
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Avatar uploader */}
        <div>
          <label className="block mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#82907f]">Profile Picture</label>
          <div className="flex items-center gap-5">
            {/* Preview */}
            <div
              style={{
                width: 80, height: 80, borderRadius: 20, flexShrink: 0, overflow: "hidden",
                border: "2px solid #e0e8d4", background: "linear-gradient(180deg,#105d13,#0b7312)",
                display: "grid", placeItems: "center",
              }}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{ background: "linear-gradient(180deg,#17b516,#0b9a0a)", color: "#fff" }}
                className="inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[12px] font-bold"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V6m0 0-4 4m4-4 4 4" /><path d="M4.5 18.5h15" opacity=".5" />
                </svg>
                {avatar ? "Change photo" : "Upload photo"}
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#fde2dd] px-4 py-2 text-[12px] font-bold text-[#d43c35]"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" />
                  </svg>
                  Delete photo
                </button>
              )}
              <p className="text-[11px] text-[#a0ad9e]">JPG, PNG, WebP · Max 2MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Full Name" value={name} onChange={setName} placeholder="Enter full name" required />
          <FieldInput label="Email Address" value={email} onChange={setEmail} type="email" placeholder="admin@gofarm.io" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#82907f]">Role</label>
            <div className="w-full rounded-[10px] bg-[#eef4e7] border border-[#e0e8d4] px-4 py-2.5 text-[13px] text-[#536451] cursor-not-allowed capitalize">
              {profile.role} — cannot be changed
            </div>
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#82907f]">Account Created At</label>
            <div className="w-full rounded-[10px] bg-[#eef4e7] border border-[#e0e8d4] px-4 py-2.5 text-[13px] text-[#536451]">
              {new Date(profile.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            style={{ background: "linear-gradient(180deg, #17b516 0%, #0b9a0a 100%)", color: "#fff", opacity: loading ? 0.7 : 1 }}
            className="inline-flex items-center gap-2 rounded-[10px] px-6 py-2.5 text-[13px] font-bold shadow-md transition"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
            ) : <IconCheck />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────

function PasswordTab() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !newPass || !confirm) return;
    if (newPass !== confirm) {
      setToast({ type: "error", message: "New passwords do not match" });
      return;
    }
    if (newPass.length < 8) {
      setToast({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "change-password", currentPassword: current, newPassword: newPass, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Change failed");
      setToast({ type: "success", message: "Password changed successfully!" });
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  const mismatch = confirm.length > 0 && newPass !== confirm;

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <FieldInput label="Current Password" value={current} onChange={setCurrent} type="password" placeholder="••••••••" required />

        <div>
          <FieldInput label="New Password" value={newPass} onChange={setNewPass} type="password" placeholder="Min 8 characters" required />
          <PasswordStrength password={newPass} />
        </div>

        <div>
          <FieldInput label="Confirm New Password" value={confirm} onChange={setConfirm} type="password" placeholder="Re-enter new password" required />
          {mismatch && <p className="mt-1.5 text-[11px] text-red-500">Passwords do not match</p>}
        </div>

        <div className="rounded-[10px] bg-[#fffbeb] border border-[#fde68a] px-4 py-3 text-[12px] text-[#92400e] flex gap-2">
          <IconAlert />
          <span>After changing your password, you will need to log in again on other devices.</span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || mismatch}
            style={{ background: loading || mismatch ? "#ccc" : "linear-gradient(180deg, #17b516 0%, #0b9a0a 100%)", color: "#fff" }}
            className="inline-flex items-center gap-2 rounded-[10px] px-6 py-2.5 text-[13px] font-bold shadow-md transition"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </div>
      </form>
    </>
  );
}

// ─── About Tab ───────────────────────────────────────────────────────────────

function AboutTab({ profile }: { profile: AdminProfile }) {
  const info = [
    { label: "System Version", value: "GoFarm v1.0.0" },
    { label: "Database", value: "MySQL (Production)" },
    { label: "Framework", value: "Next.js 15 (App Router)" },
    { label: "Account ID", value: profile.id },
    { label: "Last Updated", value: new Date(profile.updatedAt).toLocaleString("en-US") },
  ];
  return (
    <div className="space-y-3">
      {info.map((item) => (
        <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-[10px] bg-[#f4f8ee] px-4 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#82907f]">{item.label}</span>
          <span className="text-[13px] text-[#253323] font-mono break-all">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminSettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setProfile(data);
          // Load saved avatar from localStorage
          const saved = localStorage.getItem(`gofarm_admin_avatar_${data.id}`);
          if (saved) setAvatar(saved);
        } else {
          setError(data.error || "Unable to load information");
        }
      })
      .catch(() => setError("Server connection error"))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Personal Info", icon: <IconUser /> },
    { key: "password", label: "Change Password", icon: <IconLock /> },
    { key: "about", label: "System Info", icon: <IconInfo /> },
  ];

  return (
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      ` }} />

      {/* Avatar + info banner */}
      {profile && (
        <div className="flex items-center gap-4 rounded-[20px] bg-white border border-[#edf1e5] p-5 shadow-sm">
          <div style={{ width: 60, height: 60, borderRadius: 16, flexShrink: 0, overflow: "hidden", border: "2px solid #e0e8d4", background: "linear-gradient(180deg,#105d13,#0b7312)", display: "grid", placeItems: "center" }}>
            {avatar ? (
              <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{profile.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-[#1f2d1d] tracking-tight">{profile.name}</div>
            <div className="text-[13px] text-[#6f7b6d]">{profile.email}</div>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#dff4d4] px-2.5 py-0.5 text-[11px] font-bold text-[#18851f] uppercase tracking-wide">
              {profile.role}
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 rounded-[16px] bg-[#eef4e2] p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold transition-all"
            style={{
              background: tab === t.key ? "#fff" : "transparent",
              color: tab === t.key ? "#0b7312" : "#6f7b6d",
              boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content card */}
      <div className="rounded-[20px] bg-white border border-[#edf1e5] p-6 shadow-sm">
        {loading && (
          <div className="py-10 text-center text-[13px] text-[#6f7b6d]">Loading information...</div>
        )}
        {error && (
          <div className="rounded-[12px] bg-[#fde2dd] border border-[#f1c4c4] px-4 py-3 text-[13px] text-[#8b4f4d]">{error}</div>
        )}
        {!loading && !error && profile && (
          <>
            {tab === "profile" && (
              <ProfileTab
                profile={profile}
                onUpdate={setProfile}
                avatar={avatar}
                onAvatarChange={setAvatar}
              />
            )}
            {tab === "password" && <PasswordTab />}
            {tab === "about" && <AboutTab profile={profile} />}
          </>
        )}
      </div>
    </div>
  );
}
