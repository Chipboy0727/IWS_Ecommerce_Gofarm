import { NextResponse } from "next/server";
import { getHomeData } from "@/lib/home-data";

export async function GET() {
  const data = await getHomeData();

  return NextResponse.json({
    stats: data.stats,
    categories: data.categories,
    featuredProducts: data.featuredProducts,
  });
}
