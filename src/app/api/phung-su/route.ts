import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.socialProject.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.socialProject.create({
    data: {
      title: body.title,
      label: body.label ?? "",
      shortDesc: body.shortDesc ?? null,
      description: body.description ?? null,
      thumbnail: body.thumbnail ?? null,
      images: body.images ?? [],
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
