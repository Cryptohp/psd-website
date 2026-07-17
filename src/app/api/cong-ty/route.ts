import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sectorId = searchParams.get("sectorId");

  const featured = searchParams.get("featured");

  const companies = await prisma.company.findMany({
    where: {
      ...(sectorId ? { sectorId } : {}),
      ...(featured === "true" ? { isFeatured: true, isActive: true } : {}),
    },
    include: { sector: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(companies.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    shortDesc: c.shortDesc,
    description: c.description,
    logo: c.logo,
    website: c.website,
    order: c.order,
    isActive: c.isActive,
    isFeatured: c.isFeatured,
    sectorId: c.sectorId,
    sectorName: c.sector?.name ?? "",
    createdAt: c.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const baseSlug = (body.slug || body.name || "cong-ty")
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const company = await prisma.company.create({
    data: {
      name: body.name,
      slug: `${baseSlug}-${Date.now()}`,
      shortDesc: body.shortDesc ?? null,
      description: body.description ?? null,
      logo: body.logo ?? null,
      website: body.website ?? null,
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
      seoTitle: body.seoTitle ?? null,
      seoDesc: body.seoDesc ?? null,
      ...(body.sectorId ? { sectorId: body.sectorId } : {}),
    },
    include: { sector: true },
  });
  return NextResponse.json({ ...company, sectorName: company.sector?.name ?? "" }, { status: 201 });
}
