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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  let posts = readPosts();
  if (category && category !== "all") posts = posts.filter((p: { category: string }) => p.category === category);
  if (status) posts = posts.filter((p: { status: string }) => p.status === status);

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = readPosts();

  const newPost = {
    ...body,
    id: Date.now().toString(),
    views: 0,
    createdAt: new Date().toISOString(),
    date: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
  };

  posts.unshift(newPost);
  writePosts(posts);

  return NextResponse.json(newPost, { status: 201 });
}
