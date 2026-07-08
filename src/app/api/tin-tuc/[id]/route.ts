import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "tin-tuc.json");

function readPosts() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writePosts(posts: unknown[]) {
  writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = readPosts();
  const post = posts.find((p: { id: string }) => p.id === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const posts = readPosts();
  const idx = posts.findIndex((p: { id: string }) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  posts[idx] = { ...posts[idx], ...body, id };
  writePosts(posts);
  return NextResponse.json(posts[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = readPosts();
  const filtered = posts.filter((p: { id: string }) => p.id !== id);
  if (filtered.length === posts.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  writePosts(filtered);
  return NextResponse.json({ ok: true });
}
