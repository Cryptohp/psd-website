import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id }, include: { sector: true } });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...company, sectorName: company.sector?.name ?? "" });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.shortDesc !== undefined ? { shortDesc: body.shortDesc } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.logo !== undefined ? { logo: body.logo } : {}),
        ...(body.website !== undefined ? { website: body.website } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
        ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
        ...(body.seoDesc !== undefined ? { seoDesc: body.seoDesc } : {}),
        ...(body.images !== undefined ? { images: body.images } : {}),
        ...(body.sectorId !== undefined ? { sectorId: body.sectorId || null } : {}),
      },
      include: { sector: true },
    });
    return NextResponse.json({ ...company, sectorName: company.sector?.name ?? "" });
  } catch (err) {
    console.error("[PUT /api/cong-ty/[id]]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
