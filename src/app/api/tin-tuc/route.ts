import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const slug = searchParams.get("slug");

  if (slug) {
    const post = await prisma.newsPost.findFirst({ where: { slug }, include: { category: true } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt,
      content: post.content, thumbnail: post.thumbnail, author: post.author,
      category: post.category?.name ?? "Tin tức",
      status: post.isPublished ? "published" : "draft",
      visible: post.isPublished,
      image: post.thumbnail,
      date: new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
    });
  }

  const posts = await prisma.newsPost.findMany({
    where: {
      ...(status === "published" ? { isPublished: true } : status === "draft" ? { isPublished: false } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    thumbnail: p.thumbnail,
    author: p.author,
    category: p.category?.name ?? "Tin tức",
    label: (p.category?.name ?? "Tin tức").toUpperCase(),
    status: p.isPublished ? "published" : "draft",
    visible: p.isPublished,
    views: 0,
    date: new Date(p.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
    image: p.thumbnail,
    seoTitle: p.seoTitle,
    seoDesc: p.seoDesc,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  })));
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const baseSlug = (body.slug || body.title)
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const post = await prisma.newsPost.create({
    data: {
      title: body.title,
      slug: `${baseSlug}-${Date.now()}`,
      excerpt: body.excerpt ?? null,
      content: body.content ?? "",
      thumbnail: body.image ?? body.thumbnail ?? null,
      author: body.author ?? null,
      isPublished: body.status === "published",
      publishedAt: body.status === "published" ? new Date() : null,
      seoTitle: body.seoTitle ?? null,
      seoDesc: body.seoDesc ?? null,
    },
  });

  return NextResponse.json({
    ...post,
    status: post.isPublished ? "published" : "draft",
    visible: post.isPublished,
    category: "Tin tức",
    views: 0,
  }, { status: 201 });
}
