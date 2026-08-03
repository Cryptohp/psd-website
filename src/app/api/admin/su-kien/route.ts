import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { guests: true } } },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, eventCode, description, startTime, checkInTime, rsvpDeadline,
    locationName, locationAddress, mapUrl, dressCode, hotline,
    coverImage, mobileCoverImage, status } = body;

  if (!name || !slug || !eventCode || !startTime) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      name, slug, eventCode, description,
      startTime: new Date(startTime),
      checkInTime: checkInTime ? new Date(checkInTime) : null,
      rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline) : null,
      locationName, locationAddress, mapUrl, dressCode, hotline,
      coverImage, mobileCoverImage,
      status: status ?? "DRAFT",
    },
  });
  return NextResponse.json(event, { status: 201 });
}
