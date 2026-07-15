import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { sector: true } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [activeRow] = await prisma.$queryRaw<{ isActive: boolean }[]>`
    SELECT "isActive" FROM "projects" WHERE id = ${id}
  `;

  return NextResponse.json({
    ...project,
    title: project.name,
    sector: project.sector?.name ?? "",
    visible: activeRow?.isActive ?? true,
    publishedAt: project.publishedAt ?? project.createdAt,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  // Toggle visible via raw SQL to bypass Prisma client field validation
  if (body.visible !== undefined) {
    await prisma.$executeRaw`UPDATE "projects" SET "isActive" = ${body.visible} WHERE id = ${id}`;
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(body.title ?? body.name ? { name: body.title ?? body.name } : {}),
      ...(body.shortDesc !== undefined ? { shortDesc: body.shortDesc } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.thumbnail !== undefined ? { thumbnail: body.thumbnail } : {}),
      ...(body.images !== undefined ? { images: body.images } : {}),
      ...(body.location !== undefined ? { location: body.location } : {}),
      ...(body.province !== undefined ? { province: body.province } : {}),
      ...(body.scale !== undefined ? { scale: body.scale } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.startYear !== undefined ? { startYear: body.startYear ? Number(body.startYear) : null } : {}),
      ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
      ...(body.order !== undefined ? { order: body.order } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDesc !== undefined ? { seoDesc: body.seoDesc } : {}),
      ...(body.publishedAt !== undefined ? { publishedAt: body.publishedAt ? new Date(body.publishedAt) : null } : {}),
      ...(body.sectorId !== undefined ? { sectorId: body.sectorId || null } : {}),
    },
    include: { sector: true },
  });

  const [activeRow] = await prisma.$queryRaw<{ isActive: boolean }[]>`
    SELECT "isActive" FROM "projects" WHERE id = ${id}
  `;

  return NextResponse.json({
    ...project,
    title: project.name,
    sector: project.sector?.name ?? "",
    visible: activeRow?.isActive ?? true,
    publishedAt: project.publishedAt ?? project.createdAt,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
