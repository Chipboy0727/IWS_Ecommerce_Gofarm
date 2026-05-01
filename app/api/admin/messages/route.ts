import { NextResponse, type NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";
import { requireAdmin } from "@/lib/backend/session";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await readDb();
    const messages = db.messages || [];

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Admin Messages API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
