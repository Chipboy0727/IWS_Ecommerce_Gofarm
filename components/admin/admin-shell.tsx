import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

type AdminShellProps = {
  activeHref: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
  searchPlaceholder?: string;
  userName?: string;
  userRole?: string;
  userLabel?: string;
};

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <IconGrid /> },
  { href: "/admin/inventory", label: "Inventory", icon: <IconBox /> },
  { href: "/admin/orders", label: "Orders", icon: <IconCart /> },
  { href: "/admin/stores", label: "Stores", icon: <IconStore /> },
  { href: "/admin/customers", label: "Customers", icon: <IconUsers /> },
  { href: "/admin/products", label: "Products", icon: <IconPackage /> },
  { href: "/admin/analytics", label: "Analytics", icon: <IconChart /> },
  { href: "/admin/settings", label: "Settings", icon: <IconGear /> },
];

export function AdminShell({
  activeHref,
  title,
  subtitle,
  children,
  actions,
  searchPlaceholder = "Search...",
  userName = "Admin User",
  userRole = "Super Admin",
  userLabel = "GOFARM CENTRAL",
}: AdminShellProps) {
  const css = `
    .admin-root {
      min-height: 100vh;
      background: #edf5de;
      color: #223021;
      font-family: Arial, Helvetica, sans-serif;
    }
    .admin-layout {
      display: grid;
      min-height: 100vh;
      max-width: 1600px;
      margin: 0 auto;
      grid-template-columns: 238px minmax(0, 1fr);
    }
    .admin-sidebar {
      border-right: 1px solid rgba(0,0,0,.05);
      background: #dbe6cb;
      padding: 16px 0 16px 16px;
    }
    .sidebar-inner {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 28px;
      padding: 8px 12px 8px 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 2px 0 22px 0;
      padding-left: 12px;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      background: #0b8f15;
      color: #fff;
      box-shadow: 0 10px 30px rgba(10,120,24,.28);
    }
    .brand-title {
      font-size: 18px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #156f1c;
    }
    .brand-subtitle {
      margin-top: 3px;
      font-size: 10px;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: #415442;
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-right: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 8px;
      padding: 12px 12px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      color: #546453;
      transition: background .15s ease, color .15s ease, box-shadow .15s ease;
    }
    .nav-item:hover {
      background: rgba(255,255,255,.6);
      color: #16781f;
    }
    .nav-item.active {
      background: #fff;
      color: #16781f;
      box-shadow: 0 8px 20px rgba(35,70,28,.08);
    }
    .nav-icon {
      color: #667865;
      display: inline-flex;
    }
    .nav-item.active .nav-icon { color: #16781f; }
    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
      padding-left: 4px;
      display: grid;
      gap: 10px;
    }
    .cta {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      background: #0f9716;
      color: #fff;
      padding: 12px 16px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 12px 24px rgba(15,151,22,.28);
    }
    .sidebar-links {
      display: grid;
      gap: 4px;
      color: #5d6a5d;
      font-size: 13px;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 8px;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
    }
    .sidebar-link:hover { background: rgba(255,255,255,.6); }
    .admin-main {
      min-width: 0;
      padding: 16px;
    }
    .main-shell {
      min-height: 100%;
      border-radius: 28px;
      background: #eef5de;
      display: flex;
      flex-direction: column;
    }
    .topbar {
      border-bottom: 1px solid rgba(0,0,0,.05);
      padding: 0 28px 18px;
    }
    .topbar-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .searchbox {
      width: 300px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.45);
      padding: 8px 16px;
      color: #6f7d6e;
      box-shadow: 0 1px 2px rgba(0,0,0,.05);
      border: 1px solid rgba(0,0,0,.05);
      min-height: 40px;
    }
    .searchbox span { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .spacer { flex: 1; }
    .icon-btn {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      color: #667664;
      border: 0;
      background: transparent;
    }
    .icon-btn:hover { background: rgba(255,255,255,.6); }
    .userchip {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 4px;
    }
    .user-text { text-align: right; display: none; }
    .user-name { font-size: 12px; font-weight: 700; color: #233021; line-height: 1; }
    .user-label { margin-top: 4px; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: #718271; }
    .user-role { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #5f6d5d; display: none; }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: #0f9716;
      color: #fff;
      box-shadow: 0 10px 20px rgba(15,151,22,.25);
      overflow: hidden;
    }
    .heading-row {
      margin-top: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .page-title {
      margin: 0;
      font-size: 42px;
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -0.05em;
      color: #1f2e1d;
    }
    .page-subtitle {
      margin-top: 6px;
      max-width: 56rem;
      font-size: 15px;
      line-height: 1.5;
      color: #5d6a5d;
    }
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .content {
      padding: 24px 28px 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 0;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: filter .15s ease, background .15s ease, color .15s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: #0f9716;
      color: #fff;
      box-shadow: 0 12px 22px rgba(15,151,22,.28);
    }
    .btn-primary:hover { background: #0d8412; }
    .btn-secondary {
      background: #fff;
      color: #1e301f;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
    }
    .btn-secondary:hover { background: #f9fbf5; }
    .btn-ghost {
      background: #eff6e8;
      color: #2d5f30;
    }
    .btn-ghost:hover { background: #e2efda; }
    .grid-stats {
      display: grid;
      gap: 16px;
    }
    .grid-stats.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .grid-stats.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-stats.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-two {
      display: grid;
      gap: 16px;
      grid-template-columns: minmax(0, 1fr) 320px;
    }
    .card {
      border-radius: 20px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,.04);
      overflow: hidden;
    }
    .card-body { padding: 20px; }
    .card-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 20px 0;
    }
    .card-title {
      margin: 0;
      font-size: 22px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #253324;
    }
    .card-subtitle {
      margin-top: 6px;
      font-size: 13px;
      color: #6e7b6d;
    }
    .stat-card {
      border-radius: 20px;
      background: #fff;
      padding: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,.04);
      border: 1px solid rgba(0,0,0,.05);
    }
    .stat-card.active {
      background: #10890f;
      color: #fff;
    }
    .stat-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .18em;
      color: #7b8779;
    }
    .stat-card.active .stat-label { color: rgba(255,255,255,.7); }
    .stat-value {
      margin-top: 8px;
      font-size: 42px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.05em;
      color: #1f2f1d;
    }
    .stat-card.active .stat-value { color: #fff; }
    .stat-meta {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
    }
    .pill.green { background: #dff4d4; color: #18851f; }
    .pill.emerald { background: #dbf7de; color: #0f7c16; }
    .pill.red { background: #ffd9d5; color: #d43c35; }
    .pill.amber { background: #ffeec9; color: #a36c00; }
    .pill.gray { background: #edf0ea; color: #586456; }
    .pill.pink { background: #f8dbe8; color: #b4467d; }
    .mini-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: grid;
      place-items: center;
    }
    .mini-icon.green { background: #dff4d4; color: #16781f; }
    .mini-icon.pink { background: #f9d9e7; color: #d74f90; }
    .mini-icon.red { background: #fde2dd; color: #d13e35; }
    .mini-icon.amber { background: #fff0c8; color: #c68f00; }
    .chart-wrap {
      display: flex;
      height: 250px;
      align-items: flex-end;
      gap: 8px;
      border-radius: 18px;
      background: #fbfdf8;
      padding: 40px 16px 16px;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.05);
    }
    .chart-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
    .chart-track {
      position: relative;
      display: flex;
      width: 72%;
      height: 175px;
      align-items: flex-end;
      justify-content: center;
    }
    .chart-back {
      position: absolute;
      bottom: 0;
      width: 100%;
      border-radius: 8px 8px 0 0;
      background: #d7e4cd;
    }
    .chart-front {
      position: relative;
      z-index: 1;
      width: 72%;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(to top, #038f0b, #0ca011, #17b11d);
      box-shadow: 0 10px 20px rgba(5,120,15,.25);
    }
    .chart-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .18em;
      color: #6b7869;
    }
    .page-table {
      width: 100%;
      border-collapse: collapse;
    }
    .page-table thead {
      background: #f0f5e4;
    }
    .page-table th {
      padding: 16px 20px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .18em;
      color: #748171;
    }
    .page-table td {
      padding: 18px 20px;
      vertical-align: middle;
      border-bottom: 1px solid #edf1e5;
    }
    .page-table tr:last-child td { border-bottom: 0; }
    .product-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .product-thumb {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }
    .progress {
      width: 96px;
      height: 10px;
      border-radius: 999px;
      background: #dfe9d0;
      overflow: hidden;
    }
    .progress > span {
      display: block;
      height: 100%;
      border-radius: inherit;
    }
    .status-green { background: #0f7c16; }
    .status-amber { background: #d59b00; }
    .status-red { background: #d6403b; }
    .table-amount { font-size: 13px; font-weight: 700; color: #253323; }
    .table-muted { font-size: 13px; color: #637162; }
    .icon-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #657265;
    }
    .icon-actions button {
      border: 0;
      background: transparent;
      padding: 0;
      cursor: pointer;
      color: inherit;
    }
    .panel-note {
      padding: 14px 20px;
      border-radius: 18px;
      background: #eaf5db;
      border: 1px solid rgba(0,0,0,.05);
      font-size: 13px;
      color: #60705f;
    }
    .panel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .panel-card {
      border-radius: 18px;
      background: #fafcf7;
      overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.05);
    }
    .panel-card-body { padding: 16px; }
    .field-slab {
      border-radius: 10px;
      background: #eef4e7;
      padding: 14px 16px;
      font-size: 13px;
      color: #263225;
    }
    .field-label {
      margin-bottom: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .16em;
      color: #82907f;
    }
    .field-multiline {
      min-height: 82px;
      line-height: 1.6;
    }
    .switch {
      width: 36px;
      height: 20px;
      border-radius: 999px;
      padding: 2px;
      background: #d6ddcd;
    }
    .switch.on { background: #0f9716; }
    .switch span {
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: #fff;
      transition: transform .15s ease;
    }
    .switch.on span { transform: translateX(16px); }
    .warning {
      border-radius: 18px;
      border: 1px solid #f1c4c4;
      background: #f8d9d7;
      padding: 16px 20px;
      font-size: 13px;
      color: #8b4f4d;
    }
    .warning strong { display: block; margin-bottom: 4px; }
    .hidden-md { display: none; }
    @media (max-width: 1200px) {
      .admin-layout { grid-template-columns: 1fr; }
      .admin-sidebar { padding-right: 16px; border-right: 0; border-bottom: 1px solid rgba(0,0,0,.05); }
      .sidebar-inner { padding: 8px 0 0; }
      .admin-main { padding: 0 16px 16px; }
      .topbar { padding-left: 18px; padding-right: 18px; }
      .content { padding-left: 18px; padding-right: 18px; }
      .grid-two { grid-template-columns: 1fr; }
      .grid-stats.cols-4, .grid-stats.cols-3, .grid-stats.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .searchbox { width: 100%; }
    }
    @media (max-width: 760px) {
      .grid-stats.cols-4, .grid-stats.cols-3, .grid-stats.cols-2 { grid-template-columns: 1fr; }
      .page-title { font-size: 28px; }
      .topbar-row { flex-wrap: wrap; }
      .user-text, .user-role { display: none !important; }
      .hidden-md { display: inline-flex; }
    }
  `;

  return (
    <div className="admin-root">
      <style>{css}</style>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="sidebar-inner">
            <div className="brand">
              <div className="brand-logo">
                <IconLeaf className="h-5 w-5" />
              </div>
              <div>
                <div className="brand-title">GoFarm</div>
                <div className="brand-subtitle">Agricultural Admin</div>
              </div>
            </div>

            <nav className="nav-list">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`nav-item${active ? " active" : ""}`}>
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <Link href="/admin/products" className="cta">
                + Add New Product
              </Link>
              <div className="sidebar-links">
                <Link href="/contact" className="sidebar-link">
                  <IconHelp className="h-4 w-4" />
                  <span>Support</span>
                </Link>
                <Link href="/admin/login" className="sidebar-link">
                  <IconLogout className="h-4 w-4" />
                  <span>Log Out</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="main-shell">
            <header className="topbar">
              <div className="topbar-row">
                <div className="searchbox">
                  <IconSearch className="h-4 w-4" />
                  <span>{searchPlaceholder}</span>
                </div>
                <div className="spacer" />
                <button className="icon-btn" type="button">
                  <IconBell className="h-4 w-4" />
                </button>
                <button className="icon-btn" type="button">
                  <IconGridDots className="h-4 w-4" />
                </button>
                <div className="userchip">
                  <div className="user-text hidden-md">
                    <div className="user-name">{userName}</div>
                    <div className="user-label">{userLabel}</div>
                  </div>
                  <div className="avatar">
                    <IconAvatar className="h-5 w-5" />
                  </div>
                  <div className="user-role hidden-md">{userRole}</div>
                </div>
              </div>

              <div className="heading-row">
                <div>
                  <h1 className="page-title">{title}</h1>
                  <p className="page-subtitle">{subtitle}</p>
                </div>
                {actions ? <div className="actions">{actions}</div> : null}
              </div>
            </header>

            <div className="content">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminActionButton({
  children,
  tone = "primary",
  ...props
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`btn btn-${tone}`} {...props}>
      {children}
    </button>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  right,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle || right) ? (
        <div className="card-header">
          <div>
            {title ? <h2 className="card-title">{title}</h2> : null}
            {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
          </div>
          {right}
        </div>
      ) : null}
      <div className="card-body">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon,
  active = false,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  icon?: ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`stat-card${active ? " active" : ""}`}>
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        {icon ? <div>{icon}</div> : null}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-meta">
        {delta ? <span className="pill green">{delta}</span> : null}
        {hint ? <span>{hint}</span> : null}
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "red" | "amber" | "gray" | "pink" | "emerald";
}) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export function MiniIconCard({
  icon,
  tone = "green",
}: {
  icon: ReactNode;
  tone?: "green" | "pink" | "red" | "amber";
}) {
  return <div className={`mini-icon ${tone}`}>{icon}</div>;
}

export function BarChart({
  bars,
  labels,
}: {
  bars: number[];
  labels: string[];
}) {
  return (
    <div className="chart-wrap">
      {bars.map((height, index) => (
        <div key={`${labels[index]}-${index}`} className="chart-bar">
          <div className="chart-track">
            <div className="chart-back" style={{ height: `${Math.min(100, height + 28)}%` }} />
            <div className="chart-front" style={{ height: `${height}%` }} />
          </div>
          <div className="chart-label">{labels[index]}</div>
        </div>
      ))}
    </div>
  );
}

export function IconLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18.5 5.5C12.7 5.8 8 8.8 6 14.2c-1 2.7-1.1 4.7-1 5.8 1.1.1 3.1 0 5.8-1 5.4-2 8.4-6.7 8.7-12.5.1-1.1-.8-2-2-2z" fill="currentColor" />
      <path d="M7.5 16.5c2.7-4.4 5.9-7.4 10-10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconGrid({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor" />
    </svg>
  );
}

export function IconBox({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 8.5 12 13 3 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6.8 12 3l8 3.8-8 3.8-8-3.8z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function IconCart({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 5h2l2.2 9.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 1.9-1.4L21 8H7.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconStore({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 10h16v9H4v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 8h18v2H3V8z" fill="currentColor" opacity="0.2" />
      <path d="M7 12h4v7H7z" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function IconUsers({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8.5 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm7 1.3a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z" fill="currentColor" opacity="0.6" />
      <path d="M3.8 19.5c.5-3.4 2.9-5.1 4.7-5.1s4.2 1.7 4.7 5.1m2.8-3.2c.4-2.3 2.1-3.5 3.4-3.5 1.1 0 2.7.9 3.1 2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPackage({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7.2 12 3l8 4.2v9.6L12 21l-8-4.2V7.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
      <path d="M4 7.2 12 11.4l8-4.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

export function IconChart({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 15v-5m5 5V8m5 7v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 15.5 11.2 10.8 14.2 12.6 18 7.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGear({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 13.4v-2.8l-2-.7a5.8 5.8 0 0 0-.8-1.9l1-1.8-2-2-1.8 1a5.8 5.8 0 0 0-1.9-.8l-.7-2h-2.8l-.7 2a5.8 5.8 0 0 0-1.9.8l-1.8-1-2 2 1 1.8a5.8 5.8 0 0 0-.8 1.9l-2 .7v2.8l2 .7c.2.7.5 1.3.8 1.9l-1 1.8 2 2 1.8-1c.6.3 1.2.6 1.9.8l.7 2h2.8l.7-2c.7-.2 1.3-.5 1.9-.8l1.8 1 2-2-1-1.8c.4-.6.6-1.2.8-1.9l2-.7z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}

export function IconSearch({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 18.5a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" fill="currentColor" />
      <path d="M6.5 16h11c-1-1.1-1.5-2.5-1.5-4.8V10a4 4 0 1 0-8 0v1.2c0 2.3-.5 3.7-1.5 4.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGridDots({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 5h3v3H5V5zm5 0h3v3h-3V5zm5 0h3v3h-3V5zM5 10h3v3H5v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3zM5 15h3v3H5v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3z" fill="currentColor" />
    </svg>
  );
}

export function IconAvatar({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="9" r="3.6" fill="currentColor" opacity="0.9" />
      <path d="M5.5 20.2c.8-3.5 3.6-5.6 6.5-5.6s5.7 2.1 6.5 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconHelp({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.8 9.3a2.3 2.3 0 1 1 3.9 1.7c-.8.7-1.5 1.2-1.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconLogout({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h6A1.5 1.5 0 0 1 19 5.5v13A1.5 1.5 0 0 1 17.5 20h-6A1.5 1.5 0 0 1 10 18.5V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.8 12h9.4m0 0-2.6-2.6m2.6 2.6-2.6 2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

