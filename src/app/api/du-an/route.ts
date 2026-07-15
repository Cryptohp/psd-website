import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");
  const all = searchParams.get("all") === "true";

  const projects = await prisma.project.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
    },
    include: { sector: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  // Get isActive via raw SQL (bypasses Prisma client field validation)
  const activeRows = await prisma.$queryRaw<{ id: string; isActive: boolean }[]>`
    SELECT id, "isActive" FROM "projects"
  `;
  const activeMap = new Map(activeRows.map(r => [r.id, r.isActive]));

  const filtered = all
    ? projects
    : projects.filter(p => activeMap.get(p.id) !== false);

  return NextResponse.json(filtered.map(p => ({
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
    visible: activeMap.get(p.id) ?? true,
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
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      ...(body.sectorId ? { sectorId: body.sectorId } : {}),
    },
    include: { sector: true },
  });

  return NextResponse.json({ ...project, title: project.name, sector: project.sector?.name ?? "", visible: true }, { status: 201 });
}
