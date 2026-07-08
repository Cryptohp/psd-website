import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    mkdirSync(UPLOAD_DIR, { recursive: true });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

    const ext = extname(file.name).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (!allowed.includes(ext)) return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WEBP, GIF" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File tối đa 5MB" }, { status: 400 });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
