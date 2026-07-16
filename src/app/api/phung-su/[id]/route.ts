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

  // Support partial updates (e.g. toggle isActive only)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.label !== undefined) data.label = body.label;
  if (body.shortDesc !== undefined) data.shortDesc = body.shortDesc ?? null;
  if (body.description !== undefined) data.description = body.description ?? null;
  if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail ?? null;
  if (body.images !== undefined) data.images = body.images;
  if (body.order !== undefined) data.order = body.order;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  const item = await prisma.socialProject.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.socialProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
