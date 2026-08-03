import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const guests = await prisma.guest.findMany({
    where: { eventId: id },
    include: { rsvp: true, checkIn: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(guests);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { guestCode, fullName, title, position, organization, phone, email, guestGroup, maxCompanions, tableName, note } = body;

  if (!fullName) return NextResponse.json({ error: "Họ tên không được để trống" }, { status: 400 });

  const code = guestCode || `KH${Date.now()}`;
  const guest = await prisma.guest.create({
    data: {
      eventId: id,
      guestCode: code,
      fullName, title, position, organization, phone, email,
      guestGroup, maxCompanions: maxCompanions ?? 0, tableName, note,
    },
  });
  return NextResponse.json(guest, { status: 201 });
}
