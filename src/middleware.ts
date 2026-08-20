import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { canAccessPath, type Role } from "@/lib/permissions";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "psd-admin-secret-fallback"
);

async function getSession(request: NextRequest): Promise<{ email: string; role: Role } | null> {
  const token = request.cookies.get("psd_admin_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.email || !payload.role) return null;
    return { email: payload.email as string, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);

  // Khu vực check-in: chỉ cần đăng nhập (mọi vai trò)
  if (pathname.startsWith("/check-in")) {
    const session = await getSession(request);
    return session ? NextResponse.next() : NextResponse.redirect(loginUrl);
  }

  // Khu vực admin: cần đăng nhập + đúng vai trò cho từng mục
  if (pathname.startsWith("/admin")) {
    const session = await getSession(request);
    if (!session) return NextResponse.redirect(loginUrl);

    if (!canAccessPath(session.role, pathname)) {
      // Không đủ quyền -> đưa về Dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/check-in/:path*"],
};
