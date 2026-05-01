import { NextResponse, type NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ count: 0 });
    }

    const targetEmail = email.trim().toLowerCase();
    const db = await readDb();
    const allMessages = db.messages || [];
    
    // Count messages with robust email normalization
    const unreadCount = allMessages.filter((m: any) => 
      (m.email || "").trim().toLowerCase() === targetEmail && 
      m.status === "replied" && 
      m.userRead !== true
    ).length;

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Unread Count API Error:", error);
    return NextResponse.json({ count: 0 });
  }
}
