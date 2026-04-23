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

    // Tạo tên file duy nhất để tránh trùng lặp
    const fileExtension = path.extname(file.name) || ".png";
    const fileName = `${randomUUID()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "images");
    const filePath = path.join(uploadDir, fileName);

    // Đảm bảo thư mục tồn tại
    await fs.mkdir(uploadDir, { recursive: true });

    // Ghi file
    await fs.writeFile(filePath, buffer);

    // Trả về đường dẫn tương đối để lưu vào database
    const relativePath = `/images/${fileName}`;
    return NextResponse.json({ url: relativePath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
