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

/** Cập nhật tên / vai trò / mật khẩu */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { id } = await params;
  const { name, role, password } = await req.json();

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });

  const data: { name?: string | null; role?: Role; password?: string } = {};

  if (name !== undefined) data.name = name || null;

  if (role !== undefined) {
    if (!ALL_ROLES.includes(role as Role)) {
      return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
    }
    // Không cho tự hạ quyền của chính mình (tránh mất SUPER_ADMIN cuối cùng)
    if (target.email === session.email && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Không thể tự thay đổi vai trò của chính bạn" }, { status: 400 });
    }
    data.role = role as Role;
  }

  if (password) data.password = hashPassword(password);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

/** Xoá tài khoản */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSuperAdmin();
  if (!session) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });

  if (target.email === session.email) {
    return NextResponse.json({ error: "Không thể xoá chính tài khoản của bạn" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
