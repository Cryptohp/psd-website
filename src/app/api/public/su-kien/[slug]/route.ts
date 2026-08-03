import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { schedules: { orderBy: { sortOrder: "asc" } } },
  });
  if (!event) return NextResponse.json({ error: "Không tìm thấy sự kiện" }, { status: 404 });
  return NextResponse.json(event);
}
