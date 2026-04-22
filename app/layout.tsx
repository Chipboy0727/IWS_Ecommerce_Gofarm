import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { OrderProvider } from "@/app/context/OrderContext";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "gofarm - Your Trusted Online Shopping Destination",
  description: "gofarm storefront migrated to Next.js without changing the original UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/css/0k64glnxo6zf5.css" />
        <link rel="stylesheet" href="/css/172o935743au2.css" />
      </head>
      <body
        className="jost_490f54e-module__zngVWW__variable antialiased"
        suppressHydrationWarning
      >
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <SiteHeader />
              {children}
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}