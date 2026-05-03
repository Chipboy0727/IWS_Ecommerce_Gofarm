"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ChatBox from "@/components/chat-box";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
      {!isAdminRoute ? <SiteHeader /> : null}
      <main className="flex-1 w-full">
        {children}
      </main>
      {!isAdminRoute ? <SiteFooter /> : null}
      {!isAdminRoute ? <ChatBox /> : null}
    </div>
  );
}
