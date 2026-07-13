import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const leaders = await prisma.leader.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(leaders.map(l => ({ ...l, visible: l.isActive })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const leader = await prisma.leader.create({
    data: {
      name: body.name,
      title: body.title,
      bio: body.bio ?? null,
      avatar: body.avatar ?? null,
      order: body.order ?? 0,
      isActive: body.visible !== false,
    },
  });

  return NextResponse.json({ ...leader, visible: leader.isActive }, { status: 201 });
}
