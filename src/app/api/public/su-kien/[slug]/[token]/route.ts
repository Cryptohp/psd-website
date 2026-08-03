import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params;
  const guest = await prisma.guest.findFirst({
    where: { publicToken: token, event: { slug }, isActive: true },
    include: {
      event: { include: { schedules: { orderBy: { sortOrder: "asc" } } } },
      rsvp: true,
      checkIn: true,
    },
  });
  if (!guest) return NextResponse.json({ error: "Link không hợp lệ hoặc đã hết hạn" }, { status: 404 });
  return NextResponse.json(guest);
}
