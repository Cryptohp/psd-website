import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await prisma.$queryRaw<unknown[]>`SELECT * FROM "social_projects" WHERE id = ${id}`;
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Fetch current record first for partial updates
    const current = await prisma.$queryRaw<Record<string, unknown>[]>`SELECT * FROM "social_projects" WHERE id = ${id}`;
    if (!current.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const c = current[0];

    const title       = body.title       !== undefined ? body.title       : c.title;
    const label       = body.label       !== undefined ? body.label       : c.label;
    const shortDesc   = body.shortDesc   !== undefined ? body.shortDesc   : c.shortDesc;
    const description = body.description !== undefined ? body.description : c.description;
    const thumbnail   = body.thumbnail   !== undefined ? body.thumbnail   : c.thumbnail;
    const images: string[] = body.images !== undefined ? body.images      : (c.images as string[]);
    const order       = body.order       !== undefined ? body.order       : c.order;
    const isActive    = body.isActive    !== undefined ? body.isActive    : c.isActive;

    await prisma.$executeRaw`
      UPDATE "social_projects"
      SET title=${title}, label=${label}, "shortDesc"=${shortDesc}, description=${description},
          thumbnail=${thumbnail}, images=${images}::text[], "order"=${order}, "isActive"=${isActive}, "updatedAt"=NOW()
      WHERE id=${id}
    `;
    const rows = await prisma.$queryRaw<unknown[]>`SELECT * FROM "social_projects" WHERE id = ${id}`;
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.$executeRaw`DELETE FROM "social_projects" WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
