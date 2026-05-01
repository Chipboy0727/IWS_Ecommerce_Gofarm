import { NextResponse, type NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/backend/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await writeDb((db) => {
      const messages = db.messages || [];
      const updatedMessages = messages.map((m: any) => {
        if (m.email.toLowerCase() === email.toLowerCase() && m.status === "replied") {
          return { ...m, userRead: true };
        }
        return m;
      });

      return { ...db, messages: updatedMessages };
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark as Read API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
