import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.$queryRaw<
      { id: string; title: string; label: string; shortDesc: string | null; description: string | null; thumbnail: string | null; images: string[]; order: number; isActive: boolean; createdAt: Date; updatedAt: Date }[]
    >`SELECT * FROM "social_projects" ORDER BY "order" ASC`;
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body.title ?? "";
    const label = body.label ?? "";
    const shortDesc = body.shortDesc ?? null;
    const description = body.description ?? null;
    const thumbnail = body.thumbnail ?? null;
    const images: string[] = body.images ?? [];
    const order = body.order ?? 0;
    const isActive = body.isActive ?? true;

    const rows = await prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO "social_projects" (id, title, label, "shortDesc", description, thumbnail, images, "order", "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, ${title}, ${label}, ${shortDesc}, ${description}, ${thumbnail}, ${images}::text[], ${order}, ${isActive}, NOW(), NOW())
      RETURNING id
    `;
    const item = await prisma.$queryRaw`SELECT * FROM "social_projects" WHERE id = ${rows[0].id}`;
    return NextResponse.json((item as unknown[])[0], { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
