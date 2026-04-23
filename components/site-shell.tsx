"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? <SiteHeader /> : null}
      {children}
      {!isAdminRoute ? <SiteFooter /> : null}
    </>
  );
}
