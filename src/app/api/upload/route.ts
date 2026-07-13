import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowed.includes(ext)) return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WEBP, GIF" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File tối đa 5MB" }, { status: 400 });

    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
