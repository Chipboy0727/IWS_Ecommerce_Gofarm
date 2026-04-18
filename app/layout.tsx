import type { Metadata } from "next";
import type { ReactNode } from "react";

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
        {children}
      </body>
    </html>
  );
}
