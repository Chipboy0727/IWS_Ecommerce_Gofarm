import { loadLocalCatalog } from "@/lib/local-catalog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap() {
  const { products } = await loadLocalCatalog();
  const productUrls = products
    .filter((product) => product.slug)
    .map((product) => ({ url: `${baseUrl}/product/${product.slug}`, lastModified: new Date() }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/deal`, lastModified: new Date() },
    { url: `${baseUrl}/faqs`, lastModified: new Date() },
    { url: `${baseUrl}/store-list`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    ...productUrls,
  ];
}
