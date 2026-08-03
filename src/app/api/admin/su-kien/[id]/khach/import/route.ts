import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Không tìm thấy sự kiện" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Chưa chọn file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });

  const results = { success: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const fullName = (row["full_name"] || row["Họ và tên"] || "").trim();
    if (!fullName) { results.errors.push(`Dòng ${i + 2}: thiếu họ tên`); continue; }

    const guestCode = (row["guest_code"] || row["Mã khách"] || `KH${Date.now()}${i}`).trim();
    const existing = await prisma.guest.findFirst({ where: { eventId: id, guestCode } });
    if (existing) { results.errors.push(`Dòng ${i + 2}: mã ${guestCode} đã tồn tại`); continue; }

    await prisma.guest.create({
      data: {
        eventId: id,
        guestCode,
        fullName,
        title: (row["title"] || row["Danh hiệu"] || "").trim() || null,
        position: (row["position"] || row["Chức vụ"] || "").trim() || null,
        organization: (row["organization"] || row["Đơn vị"] || "").trim() || null,
        phone: (row["phone"] || row["Điện thoại"] || "").trim() || null,
        email: (row["email"] || row["Email"] || "").trim() || null,
        guestGroup: (row["guest_group"] || row["Nhóm"] || "").trim() || null,
        maxCompanions: parseInt(row["max_companions"] || row["Người đi cùng"] || "0") || 0,
        tableName: (row["table_name"] || row["Tên bàn"] || "").trim() || null,
        note: (row["note"] || row["Ghi chú"] || "").trim() || null,
      },
    });
    results.success++;
  }

  return NextResponse.json(results);
}
