"use client";

import Link from "next/link";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

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
];

export function AdminSidebarNav({ activeHref }: { activeHref: string }) {
  return (
    <>
      <nav className="nav-list">
        {navItems.map((item) => {
          const active = activeHref === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-item${active ? " active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-links">
          <Link href="/admin/settings" className="sidebar-link">
            <IconGear className="h-4 w-4" />
            <span className="sidebar-link-text">Settings</span>
          </Link>
          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch (e) {}
              localStorage.removeItem("user");
              localStorage.removeItem("cart");
              localStorage.removeItem("wishlist");
              window.dispatchEvent(new Event("auth-changed"));
              window.location.href = "/";
            }}
            className="sidebar-link w-full text-left bg-transparent border-0 cursor-pointer"
          >
            <IconLogout className="h-4 w-4" />
            <span className="sidebar-link-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const css = `
    .admin-root {
      min-height: 100vh;
      --sidebar-width: 254px;
      background:
        radial-gradient(circle at top left, rgba(255,255,255,.72), transparent 30%),
        linear-gradient(180deg, #edf5de 0%, #eef5df 100%);
      color: #223021;
      font-family: var(--font-jost), Arial, Helvetica, sans-serif;
    }
    .admin-root[data-sidebar-collapsed="true"] {
      --sidebar-width: 0px;
    }
    .admin-layout {
      display: grid;
      min-height: 100vh;
      grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
      transition: grid-template-columns 0.24s ease;
    }
    .admin-layout.is-collapsed {
      grid-template-columns: 1fr;
    }
    .admin-layout.is-collapsed .admin-sidebar {
      display: none;
    }
    .admin-layout.is-collapsed .admin-main {
      padding-left: 28px;
      padding-right: 24px;
    }
    .admin-sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      border-right: 1px solid rgba(36, 49, 31, 0.08);
      background: linear-gradient(180deg, #dce6ca 0%, #e5ecd8 100%);
      padding: 28px 14px 18px 18px;
      z-index: 30;
    }
    .sidebar-inner {
      display: flex;
      height: 100%;
      flex-direction: column;
      padding: 0;
      transition: padding 0.24s ease;
    }
    .brand {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 0 0 8px;
      transition: padding 0.24s ease;
    }
    .brand-copy {
      min-width: 0;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: linear-gradient(180deg, #108916 0%, #0b7312 100%);
      color: #fff;
      box-shadow: 0 10px 24px rgba(10, 120, 24, 0.26);
      flex: 0 0 auto;
    }
    .sidebar-toggle {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.58);
      color: #4f5c4c;
      display: grid;
      place-items: center;
      cursor: pointer;
      flex: 0 0 auto;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.82);
    }
    .brand-title {
      font-size: 24px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #1a8a18;
    }
    .brand-subtitle {
      margin-top: 3px;
      font-size: 16px;
      color: #4f5b4a;
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 34px 0 0;
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
    }
    .nav-list::-webkit-scrollbar {
      width: 4px;
    }
    .nav-list::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 999px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 8px;
      padding: 11px 12px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      color: #4c5949;
      transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.56);
      color: #158218;
    }
    .nav-item.active {
      background: #fff;
      color: #158218;
      box-shadow: 0 8px 18px rgba(26, 57, 19, 0.06);
    }
    .nav-icon {
      color: currentColor;
      display: inline-flex;
      flex: 0 0 auto;
    }
    .nav-icon svg {
      width: 18px;
      height: 18px;
      display: block;
      flex: 0 0 auto;
    }
    .nav-label {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.18s ease, transform 0.18s ease, width 0.18s ease;
    }
    .nav-item.active .nav-icon {
      color: #0b7312;
    }
    .sidebar-footer {
      margin-top: auto;
      padding: 18px 0 0;
    }
    .sidebar-links {
      display: grid;
      gap: 4px;
      color: #4c5949;
      font-size: 15px;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
    }
    .sidebar-link:hover {
      background: rgba(255, 255, 255, 0.55);
    }
    .sidebar-link-text {
      transition: opacity 0.18s ease, transform 0.18s ease, width 0.18s ease;
    }
    .admin-main {
      min-width: 0;
      padding: 14px 16px 16px 0;
    }
    .main-shell {
      min-height: 100%;
    }
    .page-shell {
      width: 100%;
      max-width: 1136px;
      margin: 0 auto;
    }
    .admin-layout.is-collapsed .page-shell {
      max-width: 1136px;
      margin: 0 auto;
    }
    .sidebar-open-btn {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 40;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.72);
      color: #4f5c4c;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(34, 56, 29, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
    .sidebar-open-btn:hover {
      background: rgba(255, 255, 255, 0.92);
    }
    .topbar {
      padding: 0 0 10px;
    }
    .topbar-row {
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 48px;
    }
    .searchbox {
      width: min(500px, 100%);
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 14px;
      background: rgba(236, 243, 224, 0.88);
      padding: 9px 15px;
      color: #6e7d6d;
      border: 1px solid rgba(255, 255, 255, 0.45);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.55);
      min-height: 36px;
    }
    .searchbox span {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .spacer {
      flex: 1;
    }
    .icon-btn {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      color: #616f5f;
      border: 0;
      background: transparent;
      flex: 0 0 auto;
    }
    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.6);
    }
    .userchip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 16px;
      margin-left: 2px;
      border-left: 1px solid rgba(0, 0, 0, 0.07);
    }
    .user-text {
      text-align: right;
      line-height: 1.1;
    }
    .user-name {
      font-size: 12px;
      font-weight: 800;
      color: #263224;
    }
    .user-role {
      margin-top: 4px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #687366;
    }
    .user-label {
      margin-top: 3px;
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #7d8a7b;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(180deg, #105d13 0%, #0f9716 100%);
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 151, 22, 0.22);
      overflow: hidden;
      border: 2px solid rgba(16, 145, 25, 0.35);
    }
    .heading-row {
      margin-top: 12px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .page-title {
      margin: 0;
      font-size: 50px;
      line-height: 0.98;
      font-weight: 800;
      letter-spacing: -0.06em;
      color: #1f2d1d;
    }
    .page-subtitle {
      margin-top: 8px;
      max-width: 56rem;
      font-size: 15px;
      line-height: 1.45;
      color: #576357;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 8px;
    }
    .content {
      padding: 12px 0 20px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 0;
      padding: 11px 18px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, filter 0.15s ease, background 0.15s ease, color 0.15s ease;
      text-decoration: none;
      white-space: nowrap;
    }
    .btn:hover {
      transform: translateY(-1px);
    }
    .btn-primary {
      background: linear-gradient(180deg, #17b516 0%, #0b9a0a 100%);
      color: #fff;
      box-shadow: 0 12px 22px rgba(11, 154, 10, 0.28);
    }
    .btn-primary:hover {
      filter: brightness(0.98);
    }
    .btn-secondary {
      background: #f3f7ea;
      color: #1f391f;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.07);
    }
    .btn-secondary:hover {
      background: #edf4e0;
    }
    .btn-ghost {
      background: #eef5e2;
      color: #0b7312;
    }
    .btn-ghost:hover {
      background: #e4efd5;
    }
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
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 20px 30px rgba(13, 36, 13, 0.03);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .card-body {
      padding: 22px;
    }
    .card-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 22px 0;
    }
    .card-title {
      margin: 0;
      font-size: 22px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.05em;
      color: #253324;
    }
    .card-subtitle {
      margin-top: 6px;
      font-size: 13px;
      line-height: 1.45;
      color: #6f7b6d;
    }
    .stat-card {
      position: relative;
      min-height: 120px;
      border-radius: 20px;
      background: #fff;
      padding: 16px 20px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 20px 30px rgba(13, 36, 13, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }
    .stat-card.active {
      background: linear-gradient(180deg, #0e8b11 0%, #0a7610 100%);
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
      letter-spacing: 0.16em;
      color: #687466;
    }
    .stat-card.active .stat-label {
      color: rgba(255, 255, 255, 0.7);
    }
    .stat-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      background: #e3eed9;
      color: #118116;
      opacity: 0.95;
    }
    .stat-card.active .stat-icon {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .stat-value {
      margin-top: 8px;
      font-size: 36px;
      line-height: 0.98;
      font-weight: 800;
      letter-spacing: -0.06em;
      color: #1f2f1d;
    }
    .stat-card.active .stat-value {
      color: #fff;
    }
    .stat-meta {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #51604f;
    }
    .stat-card.active .stat-meta {
      color: rgba(255, 255, 255, 0.76);
    }
    .pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
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
      height: 304px;
      align-items: flex-end;
      gap: 8px;
      border-radius: 18px;
      background: #fbfdf8;
      padding: 36px 16px 12px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
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
      width: 100%;
      height: 210px;
      align-items: flex-end;
      justify-content: center;
    }
    .chart-back {
      position: absolute;
      bottom: 0;
      width: 100%;
      border-radius: 8px 8px 0 0;
      background: #d9e4ce;
    }
    .chart-front {
      position: relative;
      z-index: 1;
      width: 72%;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(to top, #038f0b, #0ca011, #17b11d);
      box-shadow: 0 10px 20px rgba(5, 120, 15, 0.25);
    }
    .chart-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
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
      padding: 16px 22px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #748171;
    }
    .page-table td {
      padding: 18px 22px;
      vertical-align: middle;
      border-bottom: 1px solid #edf1e5;
    }
    .page-table tr:last-child td {
      border-bottom: 0;
    }
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
    .table-amount {
      font-size: 13px;
      font-weight: 700;
      color: #253323;
    }
    .table-muted {
      font-size: 13px;
      color: #637162;
    }
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
      border: 1px solid rgba(0, 0, 0, 0.05);
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
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    }
    .panel-card-body {
      padding: 16px;
    }
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
      letter-spacing: 0.16em;
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
    .switch.on {
      background: #0f9716;
    }
    .switch span {
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: #fff;
      transition: transform 0.15s ease;
    }
    .switch.on span {
      transform: translateX(16px);
    }
    .warning {
      border-radius: 18px;
      border: 1px solid #f1c4c4;
      background: #f8d9d7;
      padding: 16px 20px;
      font-size: 13px;
      color: #8b4f4d;
    }
    .warning strong {
      display: block;
      margin-bottom: 4px;
    }
    @media (max-width: 1200px) {
      .admin-layout {
        grid-template-columns: 1fr;
      }
      .admin-root {
        --sidebar-width: 1fr;
      }
      .sidebar-toggle {
        display: none;
      }
      .admin-sidebar {
        padding-right: 14px;
        border-right: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .sidebar-inner {
        padding: 0;
      }
      .admin-main {
        padding: 0 14px 14px;
      }
      .page-shell {
        width: 100%;
      }
      .grid-two {
        grid-template-columns: 1fr;
      }
      .grid-stats.cols-4,
      .grid-stats.cols-3,
      .grid-stats.cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .searchbox {
        width: 100%;
      }
    }
    @media (max-width: 760px) {
      .grid-stats.cols-4,
      .grid-stats.cols-3,
      .grid-stats.cols-2 {
        grid-template-columns: 1fr;
      }
      .page-title {
        font-size: 32px;
      }
      .topbar-row {
        flex-wrap: wrap;
      }
      .heading-row {
        flex-direction: column;
      }
    }
  `;

  return (
    <div className="admin-root" data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
      <style>{css}</style>
      <div className={`admin-layout${sidebarCollapsed ? " is-collapsed" : ""}`}>
        {!sidebarCollapsed ? (
          <aside className="admin-sidebar">
            <div className="sidebar-inner">
              <div className="brand">
                <div className="brand-copy">
                  <div className="brand-title">GoFarm</div>
                  <div className="brand-subtitle">Agricultural Admin</div>
                </div>
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={() => setSidebarCollapsed(true)}
                  aria-label="Hide sidebar"
                  aria-pressed={sidebarCollapsed}
                >
                  <IconSidebarCollapse className="h-4 w-4" />
                </button>
              </div>
              <AdminSidebarNav activeHref={activeHref} />
            </div>
          </aside>
        ) : null}

        <main className="admin-main">
          <div className="main-shell">
            <div className="page-shell">
              <header className="topbar">
                <div className="topbar-row">
                  <div className="searchbox">
                    <IconSearch className="h-4 w-4" />
                    <span>{searchPlaceholder}</span>
                  </div>
                  <div className="spacer" />
                  <button className="icon-btn" type="button" aria-label="Notifications">
                    <IconBell className="h-4 w-4" />
                  </button>
                  <button className="icon-btn" type="button" aria-label="Apps">
                    <IconGridDots className="h-4 w-4" />
                  </button>
                  <div className="userchip">
                    <div className="user-text">
                      <div className="user-name">{userName}</div>
                      <div className="user-role">{userRole}</div>
                      {userLabel ? <div className="user-label">{userLabel}</div> : null}
                    </div>
                    <div className="avatar">
                      <IconAvatar className="h-5 w-5" />
                    </div>
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
          </div>
        </main>
      </div>
      {sidebarCollapsed ? (
        <button
          type="button"
          className="sidebar-open-btn"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Show sidebar"
        >
          <IconSidebarExpand className="h-4 w-4" />
        </button>
      ) : null}
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
  style,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  right?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`card ${className}`.trim()} style={style}>
      {title || subtitle || right ? (
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
  deltaTone = "green",
  icon,
  active = false,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaTone?: "green" | "red" | "amber" | "gray" | "pink" | "emerald";
  icon?: ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`stat-card${active ? " active" : ""}`}>
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        {icon ? <div className="stat-icon">{icon}</div> : null}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-meta">
        {delta ? <span className={`pill ${deltaTone}`}>{delta}</span> : null}
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
            <div className="chart-back" style={{ height: `${Math.min(100, height + 22)}%` }} />
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
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" fill="currentColor" />
    </svg>
  );
}

export function IconBox({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 4h12a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2Z" fill="currentColor" />
      <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function IconCart({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 5h2l2 9h10l2-6H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconStore({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 9h16v10H4V9Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 7h18l-2-3H5L3 7Z" fill="currentColor" opacity="0.3" />
      <path d="M8 12h4v7H8v-7Z" fill="currentColor" opacity="0.35" />
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
      <path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconGear({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4.7a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-.7-2 3.4L5.1 11A7 7 0 0 0 5 12c0 .34.03.67.1 1l-2 1.5 2 3.4 2.4-.7c.53.42 1.1.76 1.7 1l.4 2.5h4l.4-2.5c.6-.24 1.17-.58 1.7-1l2.4.7 2-3.4-2-1.5c.07-.33.1-.66.1-1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.6" />
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

export function IconSidebarCollapse({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M15 5 9 12l6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconSidebarExpand({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 5 15 12l-6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
