import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sector = await prisma.sector.findUnique({
    where: { id },
    include: { companies: { orderBy: { order: "asc" } } },
  });
  if (!sector) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sector);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const sector = await prisma.sector.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.icon !== undefined ? { icon: body.icon } : {}),
      ...(body.image !== undefined ? { image: body.image } : {}),
      ...(body.order !== undefined ? { order: Number(body.order) } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDesc !== undefined ? { seoDesc: body.seoDesc } : {}),
    },
  });
  return NextResponse.json(sector);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.sector.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
