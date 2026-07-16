import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.socialProject.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.socialProject.update({
    where: { id },
    data: {
      title: body.title,
      label: body.label,
      shortDesc: body.shortDesc ?? null,
      description: body.description ?? null,
      thumbnail: body.thumbnail ?? null,
      images: body.images ?? [],
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.socialProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
