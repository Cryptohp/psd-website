import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leader = await prisma.leader.findUnique({ where: { id } });
  if (!leader) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...leader, visible: leader.isActive });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const leader = await prisma.leader.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.bio !== undefined ? { bio: body.bio } : {}),
      ...(body.avatar !== undefined ? { avatar: body.avatar } : {}),
      ...(body.order !== undefined ? { order: body.order } : {}),
      ...(body.visible !== undefined ? { isActive: body.visible } : {}),
    },
  });

  return NextResponse.json({ ...leader, visible: leader.isActive });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.leader.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
