import { NextResponse } from "next/server";
import { updateDb } from "@/lib/backend/db";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newMessage = {
      id: randomUUID(),
      name,
      email,
      subject,
      message,
      status: "unread" as const,
      createdAt: now,
      updatedAt: now,
    };

    await updateDb(async (db) => {
      if (!db.messages) db.messages = [];
      db.messages.unshift(newMessage);
      return db;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
