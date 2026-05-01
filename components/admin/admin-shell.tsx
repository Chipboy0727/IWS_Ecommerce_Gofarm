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
  hideHeading?: boolean;
  userName?: string;
  userRole?: string;
  userLabel?: string;
};

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <IconGrid /> },
  { href: "/admin/inventory", label: "Inventory", icon: <IconBox /> },
  { href: "/admin/orders", label: "Orders", icon: <IconCart /> },
  { href: "/admin/stores", label: "Stores", icon: <IconStore /> },
  { href: "/admin/customers", label: "Users", icon: <IconUsers /> },
  { href: "/admin/products", label: "Products", icon: <IconPackage /> },
  { href: "/admin/messages", label: "Messages", icon: <IconMessage /> },
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
  hideHeading = false,
  userName = "Admin User",
  userRole = "Super Admin",
  userLabel = "GOFARM CENTRAL",
}: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const hideElements = true;

  const css = `
    .admin-root {
      min-height: 100vh;
      --sidebar-width: 254px;
      --gf-primary: #00a844;
      --gf-primary-hover: #3b9c3c;
      --gf-primary-dark: #008038;
      --gf-orange: #fe8f18;
      --gf-surface: #ffffff;
      --gf-bg: #f9fafb;
      --gf-bg-warm: #fff7ee;
      --gf-text: #111827;
      --gf-text-muted: #6b7280;
      --gf-text-soft: #9ca3af;
      --admin-border: #e5e7eb;
      --admin-border-muted: rgba(17, 24, 39, 0.06);
      background:
        radial-gradient(ellipse 120% 70% at 0% 0%, rgba(0, 168, 68, 0.07), transparent 52%),
        radial-gradient(ellipse 90% 60% at 100% 0%, rgba(254, 143, 24, 0.08), transparent 48%),
        linear-gradient(180deg, #ffffff 0%, #f9fafb 45%, #fffdfb 100%);
      color: var(--gf-text);
      font-family: var(--font-jost), Arial, Helvetica, sans-serif;
    }
    .admin-root .page-table button {
      border-style: none;
      border-width: 0;
      border-color: transparent;
    }
    .admin-root input:not([type="checkbox"]):not([type="radio"]),
    .admin-root select,
    .admin-root textarea {
      border-color: var(--admin-border);
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
    .admin-sidebar.desktop-hidden {
      display: none;
    }
    .admin-layout.is-collapsed .admin-main {
      padding-left: 28px;
      padding-right: 24px;
    }
    .admin-sidebar {
      align-self: stretch;
      min-height: max(100%, 100vh);
      border-right: 1px solid var(--admin-border);
      background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
      padding: 28px 14px 18px 18px;
      z-index: 30;
      box-shadow: 4px 0 24px rgba(17, 24, 39, 0.04);
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
      background: linear-gradient(180deg, var(--gf-primary) 0%, var(--gf-primary-dark) 100%);
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 168, 68, 0.28);
      flex: 0 0 auto;
    }
    .sidebar-toggle {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 999px;
      background: #f3f4f6;
      color: var(--gf-text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
      flex: 0 0 auto;
      box-shadow: inset 0 0 0 1px var(--admin-border-muted);
    }
    .sidebar-toggle:hover {
      background: #e5e7eb;
      color: var(--gf-primary);
    }
    .brand-title {
      font-size: 24px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--gf-primary);
    }
    .brand-subtitle {
      margin-top: 3px;
      font-size: 16px;
      color: var(--gf-text-muted);
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
      border-radius: 10px;
      padding: 11px 12px;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      color: var(--gf-text-muted);
      transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }
    .nav-item:hover {
      background: #f3f4f6;
      color: var(--gf-primary);
    }
    .nav-item.active {
      background: rgba(0, 168, 68, 0.1);
      color: var(--gf-primary);
      box-shadow: inset 0 0 0 1px rgba(0, 168, 68, 0.18);
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
      color: var(--gf-primary);
    }
    .sidebar-footer {
      margin-top: auto;
      padding: 18px 0 0;
    }
    .sidebar-links {
      display: grid;
      gap: 4px;
      color: var(--gf-text-muted);
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
      background: #f3f4f6;
      color: var(--gf-primary);
    }
    .sidebar-link-text {
      transition: opacity 0.18s ease, transform 0.18s ease, width 0.18s ease;
    }
    .admin-main {
      min-width: 0;
      padding: 32px;
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
      background: #ffffff;
      color: var(--gf-text-muted);
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(17, 24, 39, 0.08), inset 0 0 0 1px var(--admin-border);
    }
    .sidebar-open-btn:hover {
      background: #f9fafb;
      color: var(--gf-primary);
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
      border-radius: 12px;
      background: #f9fafb;
      padding: 9px 15px;
      color: var(--gf-text-muted);
      border: 1px solid #e5e7eb;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
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
      color: var(--gf-text-muted);
      border: 0;
      background: transparent;
      flex: 0 0 auto;
    }
    .icon-btn:hover {
      background: #f3f4f6;
      color: var(--gf-primary);
    }
    .userchip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 16px;
      margin-left: 2px;
      border-left: 1px solid var(--admin-border-muted);
    }
    .user-text {
      text-align: right;
      line-height: 1.1;
    }
    .user-name {
      font-size: 12px;
      font-weight: 800;
      color: var(--gf-text);
    }
    .user-role {
      margin-top: 4px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gf-text-soft);
    }
    .user-label {
      margin-top: 3px;
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gf-text-muted);
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(180deg, var(--gf-primary-dark) 0%, var(--gf-primary) 100%);
      color: #fff;
      box-shadow: 0 10px 22px rgba(0, 168, 68, 0.28);
      overflow: hidden;
      border: 2px solid rgba(0, 168, 68, 0.35);
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
      color: var(--gf-text);
    }
    .page-subtitle {
      margin-top: 8px;
      max-width: 56rem;
      font-size: 15px;
      line-height: 1.45;
      color: var(--gf-text-muted);
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
      background: linear-gradient(180deg, var(--gf-primary) 0%, var(--gf-primary-dark) 100%);
      color: #fff;
      box-shadow: 0 12px 24px rgba(0, 168, 68, 0.3);
    }
    .btn-primary:hover {
      filter: brightness(1.05);
    }
    .btn-secondary {
      background: #ffffff;
      color: var(--gf-text);
      box-shadow: inset 0 0 0 1px var(--admin-border);
    }
    .btn-secondary:hover {
      background: var(--gf-bg-warm);
      border-color: rgba(0, 168, 68, 0.2);
    }
    .btn-ghost {
      background: rgba(0, 168, 68, 0.08);
      color: var(--gf-primary);
    }
    .btn-ghost:hover {
      background: rgba(0, 168, 68, 0.14);
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
      background: var(--gf-surface);
      box-shadow: 0 1px 3px rgba(17, 24, 39, 0.06), 0 12px 32px rgba(17, 24, 39, 0.04);
      overflow: hidden;
      border: 1px solid var(--admin-border);
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
      color: var(--gf-text);
    }
    .card-subtitle {
      margin-top: 6px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--gf-text-muted);
    }
    .stat-card {
      position: relative;
      min-height: 120px;
      border-radius: 20px;
      background: var(--gf-surface);
      padding: 16px 20px;
      box-shadow: 0 1px 3px rgba(17, 24, 39, 0.06), 0 12px 32px rgba(17, 24, 39, 0.04);
      border: 1px solid var(--admin-border);
      overflow: hidden;
    }
    .stat-card.active {
      background: linear-gradient(135deg, var(--gf-primary-hover) 0%, var(--gf-primary) 45%, var(--gf-primary-dark) 100%);
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
      color: var(--gf-text-soft);
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
      background: rgba(0, 168, 68, 0.12);
      color: var(--gf-primary);
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
      color: var(--gf-text);
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
      color: var(--gf-text-muted);
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
    .pill.green { background: rgba(0, 168, 68, 0.14); color: var(--gf-primary-dark); }
    .pill.emerald { background: rgba(0, 168, 68, 0.12); color: var(--gf-primary); }
    .pill.red { background: #ffd9d5; color: #d43c35; }
    .pill.amber { background: #ffeec9; color: #a36c00; }
    .pill.gray { background: #f3f4f6; color: var(--gf-text-muted); }
    .pill.pink { background: #f8dbe8; color: #b4467d; }
    .mini-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: grid;
      place-items: center;
    }
    .mini-icon.green { background: rgba(0, 168, 68, 0.14); color: var(--gf-primary); }
    .mini-icon.pink { background: #f9d9e7; color: #d74f90; }
    .mini-icon.red { background: #fde2dd; color: #d13e35; }
    .mini-icon.amber { background: #fff0c8; color: #c68f00; }
    .chart-wrap {
      display: flex;
      height: 304px;
      align-items: flex-end;
      gap: 8px;
      border-radius: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
      padding: 36px 16px 12px;
      box-shadow: inset 0 0 0 1px var(--admin-border);
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
      background: #e5e7eb;
    }
    .chart-front {
      position: relative;
      z-index: 1;
      width: 72%;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(to top, var(--gf-primary-dark), var(--gf-primary), var(--gf-primary-hover));
      box-shadow: 0 10px 22px rgba(0, 168, 68, 0.28);
    }
    .chart-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gf-text-muted);
    }
    .page-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 640px;
    }
    .page-table thead {
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }
    .page-table th {
      padding: 16px 22px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--gf-text-muted);
      white-space: nowrap;
    }
    .page-table td {
      padding: 18px 22px;
      vertical-align: middle;
      border-bottom: 1px solid var(--admin-border);
    }
    .page-table tr:last-child td {
      border-bottom: 0;
    }
    .page-table th.page-table-col-actions,
    .page-table td.page-table-col-actions {
      text-align: center;
      padding-top: 16px;
      padding-bottom: 16px;
      padding-left: 22px;
      padding-right: 6px !important;
      vertical-align: middle;
    }
    .page-table th.page-table-col-actions .page-table-actions-head {
      display: flex;
      justify-content: center;
      width: 100%;
      transform: translateX(-6px);
    }
    .page-table td.page-table-col-actions .page-table-actions-cell {
      display: flex;
      justify-content: center;
      width: 100%;
      transform: translateX(-6px);
    }
    /* Shared list toolbar — matches storefront CTAs: solid #00a844, hover #3b9c3c */
    .admin-root .pm-add-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 46px;
      border: 0;
      border-radius: 12px;
      padding: 0 16px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      font-weight: 800;
      background-color: #00a844;
      background-image: none;
      box-shadow: 0 14px 28px rgba(0, 168, 68, 0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    }
    .admin-root a.pm-add-button,
    .admin-root a.pm-add-button:visited {
      text-decoration: none;
      color: #fff;
    }
    .admin-root .pm-add-button:hover {
      transform: translateY(-1px);
      background-color: #3b9c3c;
      box-shadow: 0 18px 34px rgba(0, 168, 68, 0.35);
    }
    .admin-root .pm-add-button:active {
      transform: translateY(0);
      background-color: #008038;
    }
    .admin-root .pm-add-icon {
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.2);
      line-height: 1;
      font-size: 14px;
    }
    .pm-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 0 16px;
    }
    .pm-search {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 0 16px;
      border-radius: 10px;
      background: #ffffff;
      color: var(--gf-text-muted);
      font-size: 17px;
      border: 1px solid var(--admin-border);
      box-shadow: 0 4px 14px rgba(17, 24, 39, 0.04);
      transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
      cursor: text;
    }
    .pm-search:focus-within {
      border-color: rgba(0, 168, 68, 0.45);
      box-shadow: 0 0 0 3px rgba(0, 168, 68, 0.12), 0 8px 20px rgba(17, 24, 39, 0.06);
    }
    .pm-input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--gf-text);
      font-size: 16px;
    }
    .pm-input::placeholder {
      color: var(--gf-text-soft);
    }
    .admin-list-toolbar.pm-toolbar {
      flex-wrap: wrap;
    }
    .admin-list-toolbar.pm-toolbar .pm-add-button {
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .admin-list-toolbar.pm-toolbar .pm-add-button {
        width: 100%;
        justify-content: center;
      }
    }
    .table-scroll-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .admin-data-table-shell {
      overflow-x: auto;
      overflow: hidden;
      border-radius: 14px;
      background: var(--gf-surface);
      border: 1px solid var(--admin-border);
      box-shadow: 0 10px 40px -24px rgba(17, 24, 39, 0.18);
      outline: none;
    }
    .admin-data-table-shell .page-table {
      border: 0;
      outline: none;
    }
    .admin-icon-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      width: 100%;
      color: var(--gf-text-muted);
    }
    .admin-icon-actions a,
    .admin-icon-actions button {
      border: 0;
      background: transparent;
      padding: 0;
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .admin-icon-actions .admin-icon-actions-danger {
      color: #db3d30;
    }
    .admin-icon-actions .admin-icon-actions-accent {
      color: var(--gf-primary);
    }
    .admin-icon-actions .admin-icon-actions-warn {
      color: #b45309;
    }
    .admin-icon-actions .admin-icon-actions-muted {
      color: var(--gf-text-muted);
    }
    .admin-icon-actions .admin-icon-actions-violet {
      color: #6d28d9;
    }
    .admin-icon-actions .admin-icon-actions-indigo {
      color: #4338ca;
    }
    @media (min-width: 640px) {
      .admin-data-table-shell {
        border-radius: 18px;
      }
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
      background: #e5e7eb;
      overflow: hidden;
    }
    .progress > span {
      display: block;
      height: 100%;
      border-radius: inherit;
    }
    .status-green { background: var(--gf-primary); }
    .status-amber { background: #d59b00; }
    .status-red { background: #d6403b; }
    .table-amount {
      font-size: 13px;
      font-weight: 700;
      color: var(--gf-text);
    }
    .table-muted {
      font-size: 13px;
      color: var(--gf-text-muted);
    }
    .icon-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--gf-text-muted);
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
      background: var(--gf-bg-warm);
      border: 1px solid rgba(254, 143, 24, 0.22);
      font-size: 13px;
      color: var(--gf-text-muted);
    }
    .panel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .panel-card {
      border-radius: 18px;
      background: #f9fafb;
      overflow: hidden;
      box-shadow: inset 0 0 0 1px var(--admin-border);
    }
    .panel-card-body {
      padding: 16px;
    }
    .field-slab {
      border-radius: 10px;
      background: #f3f4f6;
      padding: 14px 16px;
      font-size: 13px;
      color: var(--gf-text);
    }
    .field-label {
      margin-bottom: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--gf-text-muted);
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
      background: #d1d5db;
    }
    .switch.on {
      background: var(--gf-primary);
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
    .mobile-topbar {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(12px);
      z-index: 45;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid var(--admin-border);
      box-shadow: 0 1px 3px rgba(17, 24, 39, 0.05);
    }
    .mobile-hamburger-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--admin-border);
      background: #fff;
      border-radius: 10px;
      color: var(--gf-text);
      cursor: pointer;
    }
    .mobile-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-user {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-avatar {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: rgba(0, 168, 68, 0.1);
      border: 1px solid var(--admin-border);
      color: var(--gf-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }
    .sidebar-overlay {
      display: none;
    }
    @media (max-width: 1200px) {
      .mobile-topbar {
        display: flex;
      }
      .topbar-row {
        display: none !important;
      }
      .admin-layout {
        grid-template-columns: 1fr !important;
      }
      .admin-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 272px;
        height: 100vh;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        border-right: 1px solid var(--admin-border);
        box-shadow: none;
      }
      .admin-sidebar.is-mobile-open {
        transform: translateX(0);
        box-shadow: 8px 0 30px rgba(0, 0, 0, 0.12);
      }
      .sidebar-overlay {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 49;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(2px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.28s ease;
      }
      .sidebar-overlay.is-visible {
        opacity: 1;
        pointer-events: auto;
      }
      .sidebar-toggle {
        display: none;
      }
      .sidebar-open-btn {
        display: none !important;
      }
      .admin-main {
        padding: 0 14px 14px;
        padding-top: 64px;
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
        font-size: 28px;
      }
      .topbar-row {
        flex-wrap: wrap;
      }
      .heading-row {
        flex-direction: column;
      }
      .admin-main {
        padding: 0 10px 10px;
        padding-top: 58px;
      }
      .page-table th {
        padding: 10px 12px;
        font-size: 9px;
        letter-spacing: 0.12em;
      }
      .page-table td {
        padding: 12px;
        font-size: 12px;
      }
      .page-table th.page-table-col-actions,
      .page-table td.page-table-col-actions {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 12px;
        padding-right: 4px !important;
      }
      .page-table th.page-table-col-actions .page-table-actions-head,
      .page-table td.page-table-col-actions .page-table-actions-cell {
        transform: translateX(-4px);
      }
      .product-row {
        gap: 8px;
      }
      .product-thumb {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      .card-body {
        padding: 14px;
      }
      .card-header {
        padding: 14px 14px 0;
      }
      .card-title {
        font-size: 18px;
      }
      .stat-card {
        min-height: 100px;
        padding: 14px 16px;
      }
      .stat-value {
        font-size: 26px;
      }
      .stat-icon {
        width: 34px;
        height: 34px;
        border-radius: 8px;
      }
    }
  `;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-root" data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
      <style>{css}</style>

      {/* Mobile Header */}
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mobile-logo">
          <img src="/images/gofarmnamelogo.png" alt="GoFarm Logo" style={{ height: "24px", width: "auto" }} />
        </div>

        <div className="mobile-user">
          <div className="mobile-avatar">
            {userName ? userName.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </header>

      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay${mobileOpen ? " is-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={`admin-layout${sidebarCollapsed ? " is-collapsed" : ""}`}>
        <aside className={`admin-sidebar${mobileOpen ? " is-mobile-open" : ""}${sidebarCollapsed ? " desktop-hidden" : ""}`}>
          <div className="sidebar-inner">
            <div className="brand">
              <div className="brand-copy">
                <img src="/images/gofarmnamelogo.png" alt="GoFarm Logo" style={{ height: "32px", width: "auto", display: "block" }} />
                <div className="brand-subtitle" style={{ marginTop: "4px" }}>Agricultural Admin</div>
              </div>
              <button
                type="button"
                className="sidebar-toggle"
                onClick={() => { setSidebarCollapsed(true); setMobileOpen(false); }}
                aria-label="Hide sidebar"
              >
                <IconSidebarCollapse className="h-4 w-4" />
              </button>
            </div>
            <AdminSidebarNav activeHref={activeHref} />
          </div>
        </aside>

        <main className="admin-main">
          <div className="main-shell">
            <div className="page-shell">
              <header className="topbar">
                <div className="topbar-row">
                  {!hideElements && (
                    <div className="searchbox">
                      <IconSearch className="h-4 w-4" />
                      <span>{searchPlaceholder}</span>
                    </div>
                  )}
                  <div className="spacer" />
                  {!hideElements && (
                    <>
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
                    </>
                  )}
                </div>

                {!hideHeading ? (
                  <div className="heading-row">
                    <div>
                      <h1 className="page-title">{title}</h1>
                      <p className="page-subtitle">{subtitle}</p>
                    </div>
                    {actions ? <div className="actions">{actions}</div> : null}
                  </div>
                ) : null}
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

export function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" className={`shrink-0 ${className}`.trim()}>
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

export function IconMessage({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4h16v12H7l-3 3V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
