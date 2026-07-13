import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const projects = await prisma.project.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
    },
    include: { sector: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(projects.map(p => ({
    id: p.id,
    title: p.name,
    name: p.name,
    slug: p.slug,
    shortDesc: p.shortDesc,
    description: p.description,
    thumbnail: p.thumbnail,
    images: p.images,
    location: p.location,
    province: p.province,
    scale: p.scale,
    sector: p.sector?.name ?? "",
    sectorId: p.sectorId,
    status: p.status,
    startYear: p.startYear,
    isFeatured: p.isFeatured,
    visible: true,
    order: p.order,
    seoTitle: p.seoTitle,
    seoDesc: p.seoDesc,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const baseSlug = (body.slug || body.title || body.name)
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const project = await prisma.project.create({
    data: {
      name: body.title ?? body.name,
      slug: `${baseSlug}-${Date.now()}`,
      shortDesc: body.shortDesc ?? null,
      description: body.description ?? null,
      thumbnail: body.thumbnail ?? null,
      images: body.images ?? [],
      location: body.location ?? null,
      province: body.province ?? null,
      scale: body.scale ?? null,
      status: body.status ?? "IN_PROGRESS",
      startYear: body.startYear ? Number(body.startYear) : null,
      isFeatured: body.isFeatured ?? false,
      order: body.order ?? 0,
      seoTitle: body.seoTitle ?? null,
      seoDesc: body.seoDesc ?? null,
      ...(body.sectorId ? { sectorId: body.sectorId } : {}),
    },
    include: { sector: true },
  });

  return NextResponse.json({ ...project, title: project.name, sector: project.sector?.name ?? "", visible: true }, { status: 201 });
}
