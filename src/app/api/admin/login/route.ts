import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME } from "@/lib/auth";

type AdminAccount = { email: string; password: string };

/**
 * Danh sách tài khoản admin, lấy từ biến môi trường.
 * - Tài khoản 1: ADMIN_EMAIL / ADMIN_PASSWORD (mặc định, tương thích cũ)
 * - Tài khoản thêm: ADMIN_EMAIL_2 / ADMIN_PASSWORD_2, _3, ... (tối đa _10)
 * Mỗi tài khoản có email + mật khẩu riêng.
 */
function getAdminAccounts(): AdminAccount[] {
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

  const account = getAdminAccounts().find(
    (a) => a.email === email && a.password === password
  );

  if (!account) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  const token = await signAdminToken({ email: account.email });

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
