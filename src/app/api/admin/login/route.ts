import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import type { Role } from "@/lib/permissions";

type AdminAccount = { email: string; password: string };

/**
 * Tài khoản "dự phòng" khai trong biến môi trường — luôn có vai trò SUPER_ADMIN.
 * Dùng để không bao giờ bị khoá ngoài (kể cả khi DB chưa có user nào).
 * - Tài khoản 1: ADMIN_EMAIL / ADMIN_PASSWORD
 * - Tài khoản thêm: ADMIN_EMAIL_2 / ADMIN_PASSWORD_2, ... (tối đa _10)
 */
function getEnvAccounts(): AdminAccount[] {
  const accounts: AdminAccount[] = [
    {
      email: process.env.ADMIN_EMAIL || "admin@psdgroup.vn",
      password: process.env.ADMIN_PASSWORD || "psd@Admin2024",
    },
  ];
  for (let i = 2; i <= 10; i++) {
    const email = process.env[`ADMIN_EMAIL_${i}`];
    const password = process.env[`ADMIN_PASSWORD_${i}`];
    if (email && password) accounts.push({ email, password });
  }
  return accounts;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  let sessionEmail: string | null = null;
  let role: Role | null = null;

  // 1) Ưu tiên tài khoản trong database (có phân quyền theo vai trò)
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && verifyPassword(password, user.password)) {
    sessionEmail = user.email;
    role = user.role as Role;
  } else {
    // 2) Dự phòng: tài khoản biến môi trường -> SUPER_ADMIN
    const acc = getEnvAccounts().find(
      (a) => a.email === email && a.password === password
    );
    if (acc) {
      sessionEmail = acc.email;
      role = "SUPER_ADMIN";
    }
  }

  if (!sessionEmail || !role) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  const token = await signAdminToken({ email: sessionEmail, role });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
