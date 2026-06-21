import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/backend/session";
import { jsonError, sanitizeString } from "@/lib/backend/http";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return jsonError("Unauthorized. Admin access required.", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return jsonError("No file uploaded", 400);
    }

    if (!file.type || !ALLOWED_IMAGE_TYPES[file.type]) {
      return jsonError("Only PNG, JPEG, WEBP, and GIF image uploads are allowed.", 415);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.byteLength === 0) {
      return jsonError("Uploaded file is empty.", 400);
    }

    if (buffer.byteLength > MAX_UPLOAD_SIZE) {
      return jsonError("Uploaded file is too large. Maximum size is 5 MB.", 413);
    }

    const fileExtension = ALLOWED_IMAGE_TYPES[file.type];
    const fileName = `${randomUUID()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "images");
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const relativePath = `/images/${fileName}`;
    return NextResponse.json({ url: relativePath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return jsonError("Failed to upload file", 500);
  }
}
