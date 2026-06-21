import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart/
Disallow: /checkout/
Disallow: /orders/
Disallow: /account/
Disallow: /wishlist/
Disallow: /sign-in/
Disallow: /sign-up/
Disallow: /reset-password/
Disallow: /forgot-password/
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;

export function GET() {
  return new NextResponse(robotsText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
