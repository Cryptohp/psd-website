import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id }, include: { category: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...post,
    status: post.isPublished ? "published" : "draft",
    visible: post.isPublished,
    category: post.category?.name ?? "—",
    image: post.thumbnail,
    publishedAt: post.publishedAt ?? post.createdAt,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    /* Resolve categoryId from name if provided */
    let categoryId: string | null | undefined = undefined;
    if (body.category !== undefined) {
      if (body.category) {
        const cat = await prisma.newsCategory.findFirst({ where: { name: body.category } });
        categoryId = cat?.id ?? null;
      } else {
        categoryId = null;
      }
    }

    const post = await prisma.newsPost.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.image !== undefined ? { thumbnail: body.image } : {}),
        ...(body.thumbnail !== undefined ? { thumbnail: body.thumbnail } : {}),
        ...(body.images !== undefined ? { images: Array.isArray(body.images) ? body.images : [] } : {}),
        ...(body.author !== undefined ? { author: body.author } : {}),
        ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
        ...(body.seoDesc !== undefined ? { seoDesc: body.seoDesc } : {}),
        ...(body.publishedAt !== undefined ? { publishedAt: new Date(body.publishedAt) } : {}),
        ...(body.status !== undefined ? {
          isPublished: body.status === "published",
          ...(body.publishedAt === undefined && body.status === "published" ? { publishedAt: new Date() } : {}),
        } : {}),
        ...(body.visible !== undefined ? { isPublished: body.visible } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
    });
    return NextResponse.json({ ...post, status: post.isPublished ? "published" : "draft", visible: post.isPublished });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("PUT /api/tin-tuc/[id]:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
