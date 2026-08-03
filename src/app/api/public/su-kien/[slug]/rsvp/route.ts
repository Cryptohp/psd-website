import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  const { guestToken, fullName, phone, attendanceStatus, companionCount, attendParty, specialRequest, note, answers } = body;

  if (!guestToken || !attendanceStatus) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const guest = await prisma.guest.findFirst({
    where: { publicToken: guestToken, event: { slug }, isActive: true },
    include: { event: true },
  });
  if (!guest) return NextResponse.json({ error: "Link không hợp lệ" }, { status: 404 });

  const deadline = guest.event.rsvpDeadline;
  if (deadline && new Date() > deadline) {
    return NextResponse.json({ error: "Đã hết thời hạn xác nhận" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

  const rsvp = await prisma.rsvp.upsert({
    where: { guestId: guest.id },
    create: {
      guestId: guest.id,
      eventId: guest.eventId,
      attendanceStatus: attendanceStatus as "ATTENDING" | "DECLINED" | "PENDING",
      companionCount: companionCount ?? 0,
      attendParty: attendParty ?? false,
      specialRequest: specialRequest ?? null,
      note: note ?? null,
      answers: answers ?? null,
      ipAddress: ip,
    },
    update: {
      attendanceStatus: attendanceStatus as "ATTENDING" | "DECLINED" | "PENDING",
      companionCount: companionCount ?? 0,
      attendParty: attendParty ?? false,
      specialRequest: specialRequest ?? null,
      note: note ?? null,
      answers: answers ?? null,
      confirmedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (fullName && fullName !== guest.fullName) {
    await prisma.guest.update({ where: { id: guest.id }, data: { fullName } });
  }
  if (phone && phone !== guest.phone) {
    await prisma.guest.update({ where: { id: guest.id }, data: { phone } });
  }

  return NextResponse.json({ ok: true, rsvpId: rsvp.id, token: guest.publicToken });
}
