import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/app/context/cart-context";
import { WishlistProvider } from "@/app/context/wishlist-context";
import { OrderProvider } from "@/app/context/order-context";
import SiteShell from "@/components/site-shell";

export const metadata: Metadata = {
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
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <SiteShell>{children}</SiteShell>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
