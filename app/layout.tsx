import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jost",
});
import { CartProvider } from "@/app/context/cart-context";
import { WishlistProvider } from "@/app/context/wishlist-context";
import { OrderProvider } from "@/app/context/order-context";
import SiteShell from "@/components/site-shell";
import { AppToaster } from "@/components/app-toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "gofarm - Your Trusted Online Shopping Destination",
  description: "gofarm storefront migrated to Next.js without changing the original UI.",
  icons: {
    icon: "/images/gfsmallerlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <SiteShell>{children}</SiteShell>
              <AppToaster />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
