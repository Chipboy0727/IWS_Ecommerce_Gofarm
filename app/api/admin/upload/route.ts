import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to prevent collisions
    const fileExtension = path.extname(file.name) || ".png";
    const fileName = `${randomUUID()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "images");
    const filePath = path.join(uploadDir, fileName);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the uploaded file to disk.
    await fs.writeFile(filePath, buffer);

    // Return the relative path stored in the database.
    const relativePath = `/images/${fileName}`;
    return NextResponse.json({ url: relativePath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
