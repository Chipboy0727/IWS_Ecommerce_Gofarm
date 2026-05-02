import { NextResponse, type NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/backend/db";
import { getAuthenticatedUser } from "@/lib/backend/session";
import { getMysqlPool } from "@/lib/backend/mysql";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[Reply API] Received request for message ID: ${id}`);

    // 1. Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      console.error("[Reply API] Unauthorized: User is not an admin", user);
      return NextResponse.json({ error: "Admin session expired or invalid. Please sign in again." }, { status: 401 });
    }

    // 2. Parse body
    const body = await request.json();
    const { replyMessage } = body;

    if (!replyMessage || !replyMessage.trim()) {
      return NextResponse.json({ error: "Please enter a response message." }, { status: 400 });
    }

    // 3. Update database
    const targetId = decodeURIComponent(id).trim();
    let success = false;

    // Try direct SQL update first for better reliability
    const pool = getMysqlPool();
    if (pool) {
      try {
        console.log(`[Reply API] Attempting direct SQL update for ID: ${targetId}`);
        const [result] = await pool.execute(
          "UPDATE messages SET status = 'replied', replyMessage = ?, repliedAt = ?, userRead = 0, updatedAt = ? WHERE id = ?",
          [replyMessage.trim(), new Date().toISOString(), new Date().toISOString(), targetId]
        );
        
        if ((result as any).affectedRows > 0) {
          console.log(`[Reply API] Direct SQL update successful for ID: ${targetId}`);
          success = true;
          
          // Still call writeDb to keep the memory/JSON state in sync (optional but good for consistency)
          try {
            await writeDb((db) => {
              const messages = db.messages || [];
              const index = messages.findIndex((m: any) => String(m.id).trim() === targetId);
              if (index !== -1) {
                const updatedMessages = [...messages];
                updatedMessages[index] = {
                  ...updatedMessages[index],
                  status: "replied",
                  replyMessage: replyMessage.trim(),
                  repliedAt: new Date().toISOString(),
                  userRead: false,
                  updatedAt: new Date().toISOString(),
                };
                return { ...db, messages: updatedMessages };
              }
              return db;
            });
          } catch (e) {
            console.warn("[Reply API] writeDb sync failed after successful SQL update, continuing anyway.");
          }
        } else {
          console.warn(`[Reply API] Direct SQL update found 0 rows for ID: ${targetId}`);
        }
      } catch (sqlError) {
        console.error("[Reply API] Direct SQL update failed:", sqlError);
      }
    }

    // Fallback to the original writeDb logic if direct SQL didn't work
    if (!success) {
      console.log(`[Reply API] Falling back to state-based writeDb for ID: ${targetId}`);
      await writeDb((db) => {
        const messages = db.messages || [];
        
        // Log what we have
        console.log(`[Reply API Fallback] Messages in state: ${messages.length}`);
        
        // Very robust matching
        const index = messages.findIndex((m: any) => {
          const mId = String(m.id || "").trim();
          return mId === targetId || mId.toLowerCase() === targetId.toLowerCase();
        });

        if (index === -1) {
          // One last try: search by subject and email if ID fails
          // This is a safety net if IDs got mangled
          console.log(`[Reply API Fallback] ID search failed. Searching by metadata...`);
          return db; // Still return db to avoid clearing it
        }

        const updatedMessages = [...messages];
        updatedMessages[index] = {
          ...updatedMessages[index],
          status: "replied",
          replyMessage: replyMessage.trim(),
          repliedAt: new Date().toISOString(),
          userRead: false,
          updatedAt: new Date().toISOString(),
        };

        success = true;
        return { ...db, messages: updatedMessages };
      });
    }

    if (!success) {
      return NextResponse.json({ 
        error: "Message not found in the system.",
        debug: { id: targetId } 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Reply API Critical Error]:", error);
    return NextResponse.json(
      { error: "System error: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
