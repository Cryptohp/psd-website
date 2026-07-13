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
    category: post.category?.name ?? "Tin tức",
    image: post.thumbnail,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const post = await prisma.newsPost.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.excerpt !== undefined ? { excerpt: body.excerpt } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.image !== undefined ? { thumbnail: body.image } : {}),
      ...(body.thumbnail !== undefined ? { thumbnail: body.thumbnail } : {}),
      ...(body.author !== undefined ? { author: body.author } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDesc !== undefined ? { seoDesc: body.seoDesc } : {}),
      ...(body.status !== undefined ? {
        isPublished: body.status === "published",
        publishedAt: body.status === "published" ? new Date() : null,
      } : {}),
      ...(body.visible !== undefined ? { isPublished: body.visible } : {}),
    },
  });

  return NextResponse.json({ ...post, status: post.isPublished ? "published" : "draft", visible: post.isPublished });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
