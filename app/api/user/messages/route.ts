import { NextResponse, type NextRequest } from "next/server";
import { readDb } from "@/lib/backend/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const targetEmail = email.trim().toLowerCase();
    const db = await readDb();
    const allMessages = db.messages || [];
    
    // Filter messages by customer email with robust normalization
    const userMessages = allMessages.filter((m: any) => 
      (m.email || "").trim().toLowerCase() === targetEmail
    );

    // Sort by newest first
    userMessages.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ messages: userMessages });
  } catch (error) {
    console.error("User Messages API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
