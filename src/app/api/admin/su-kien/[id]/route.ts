import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { schedules: { orderBy: { sortOrder: "asc" } }, _count: { select: { guests: true } } },
  });
  if (!event) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { name, slug, eventCode, description, startTime, checkInTime, rsvpDeadline,
    locationName, locationAddress, mapUrl, dressCode, hotline,
    coverImage, mobileCoverImage, status } = body;

  const event = await prisma.event.update({
    where: { id },
    data: {
      name, slug, eventCode, description,
      startTime: startTime ? new Date(startTime) : undefined,
      checkInTime: checkInTime ? new Date(checkInTime) : null,
      rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline) : null,
      locationName, locationAddress, mapUrl, dressCode, hotline,
      coverImage, mobileCoverImage, status,
    },
  });
  return NextResponse.json(event);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
