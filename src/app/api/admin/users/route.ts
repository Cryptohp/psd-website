import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { ALL_ROLES, type Role } from "@/lib/permissions";

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "SUPER_ADMIN") return null;
  return session;
}

/** Danh sách tài khoản */
export async function GET() {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json({ users });
}

/** Tạo tài khoản mới */
export async function POST(req: NextRequest) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }

  const { email, name, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json({ error: "Thiếu email, mật khẩu hoặc vai trò" }, { status: 400 });
  }
  if (!ALL_ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email đã tồn tại" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { email, name: name || null, password: hashPassword(password), role: role as Role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json({ user }, { status: 201 });
}
