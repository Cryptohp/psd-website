import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token, note } = await req.json();
  if (!token) return NextResponse.json({ error: "Thiếu token" }, { status: 400 });

  const guest = await prisma.guest.findFirst({
    where: { publicToken: token, isActive: true },
    include: { event: true, rsvp: true, checkIn: true },
  });

  if (!guest) return NextResponse.json({ status: "INVALID", message: "Mã không hợp lệ" }, { status: 404 });
  if (guest.rsvp?.attendanceStatus !== "ATTENDING") {
    return NextResponse.json({ status: "INVALID", message: "Khách không xác nhận tham dự", guest }, { status: 400 });
  }

  const existing = guest.checkIn;
  if (existing?.checkInStatus === "CHECKED_IN") {
    return NextResponse.json({
      status: "ALREADY_CHECKED_IN",
      message: "Đã check-in lúc " + existing.checkInTime?.toLocaleString("vi-VN"),
      guest,
      checkIn: existing,
    });
  }

  const checkIn = await prisma.checkIn.upsert({
    where: { guestId: guest.id },
    create: {
      guestId: guest.id,
      eventId: guest.eventId,
      checkInStatus: "CHECKED_IN",
      checkInTime: new Date(),
      checkedInBy: session.email,
      note: note ?? null,
    },
    update: {
      checkInStatus: "CHECKED_IN",
      checkInTime: new Date(),
      checkedInBy: session.email,
      note: note ?? null,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ status: "SUCCESS", message: "Check-in thành công", guest, checkIn });
}
