import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sectors = await prisma.sector.findMany({
    orderBy: { order: "asc" },
    include: { companies: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(sectors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const baseSlug = (body.slug || body.name || "linh-vuc")
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const sector = await prisma.sector.create({
    data: {
      name: body.name,
      slug: `${baseSlug}-${Date.now()}`,
      description: body.description ?? null,
      icon: body.icon ?? null,
      image: body.image ?? null,
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
      seoTitle: body.seoTitle ?? null,
      seoDesc: body.seoDesc ?? null,
    },
  });
  return NextResponse.json(sector, { status: 201 });
}
