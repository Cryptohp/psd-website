import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

  const guests = await prisma.guest.findMany({
    where: { eventId: id },
    include: { rsvp: true, checkIn: true },
    orderBy: { createdAt: "asc" },
  });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://psd-website-sand.vercel.app";

  const rows = guests.map((g) => ({
    "Mã khách": g.guestCode,
    "Họ và tên": g.fullName,
    "Danh hiệu": g.title ?? "",
    "Chức vụ": g.position ?? "",
    "Đơn vị": g.organization ?? "",
    "Điện thoại": g.phone ?? "",
    "Email": g.email ?? "",
    "Nhóm": g.guestGroup ?? "",
    "Tên bàn": g.tableName ?? "",
    "RSVP": g.rsvp?.attendanceStatus ?? "Chưa phản hồi",
    "Người đi cùng": g.rsvp?.companionCount ?? 0,
    "Tham dự tiệc": g.rsvp?.attendParty ? "Có" : "Không",
    "Check-in": g.checkIn?.checkInStatus === "CHECKED_IN" ? "Đã check-in" : "Chưa",
    "Thời gian check-in": g.checkIn?.checkInTime?.toLocaleString("vi-VN") ?? "",
    "Link thư mời": `${origin}/su-kien/${event.slug}/${g.publicToken}`,
    "Ghi chú": g.note ?? "",
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Khách mời");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${event.eventCode}_khach_${date}.xlsx"`,
    },
  });
}
