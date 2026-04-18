import { NextResponse } from "next/server";
import { loadLocalCatalog } from "@/lib/local-catalog";

export async function GET() {
  const { products, categories } = await loadLocalCatalog();

  return NextResponse.json({
    products,
    categories,
  });
}
