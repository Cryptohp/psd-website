import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadToR2, isR2Configured } from "@/lib/r2";

export const runtime = "nodejs";

// Ảnh hiển thị lớn nhất trên web ~1600px là đủ nét
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

export async function POST(req: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json({ error: "Chưa cấu hình lưu trữ ảnh (R2)" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowed.includes(ext)) return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WEBP, GIF" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File tối đa 5MB" }, { status: 400 });

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const rand = Math.random().toString(36).slice(2);

    // GIF (có thể là ảnh động) — giữ nguyên để không mất animation
    if (ext === "gif") {
      const url = await uploadToR2(`uploads/${Date.now()}-${rand}.gif`, inputBuffer, "image/gif");
      return NextResponse.json({ url });
    }

    // Ảnh tĩnh — thu nhỏ + nén sang WebP để giảm mạnh dung lượng/băng thông
    const optimized = await sharp(inputBuffer)
      .rotate() // tự xoay theo EXIF
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const url = await uploadToR2(`uploads/${Date.now()}-${rand}.webp`, optimized, "image/webp");
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
