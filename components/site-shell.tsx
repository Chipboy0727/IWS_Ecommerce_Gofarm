"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      {!isAdminRoute ? <SiteHeader /> : null}
      <main className="flex-1 w-full">
        {children}
      </main>
      {!isAdminRoute ? <SiteFooter /> : null}
    </div>
  );
}
