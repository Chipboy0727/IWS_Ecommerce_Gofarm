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
  title: {
    default: "GoFarm | Fresh Farm Products Delivered Fast",
    template: "%s | GoFarm",
  },
  description:
    "GoFarm brings fresh farm products, organic groceries, and local delivery to your doorstep with reliable service and eco-friendly sourcing.",
  keywords: [
    "fresh farm products",
    "organic groceries",
    "local delivery",
    "GoFarm",
    "healthy food",
    "fresh produce",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GoFarm | Fresh Farm Products Delivered Fast",
    description:
      "GoFarm brings fresh farm products, organic groceries, and local delivery to your doorstep with reliable service and eco-friendly sourcing.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "GoFarm",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/gfsmallerlogo.png",
        width: 1200,
        height: 630,
        alt: "GoFarm fresh farm products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoFarm | Fresh Farm Products Delivered Fast",
    description:
      "GoFarm brings fresh farm products, organic groceries, and local delivery to your doorstep with reliable service and eco-friendly sourcing.",
    images: ["/images/gofarm-og.png"],
  },
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
