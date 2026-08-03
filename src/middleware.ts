import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "psd-admin-secret-fallback"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  if (pathname.startsWith("/check-in")) {
    const token = request.cookies.get("psd_admin_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));
    try { await jwtVerify(token, SECRET); return NextResponse.next(); }
    catch { return NextResponse.redirect(new URL("/admin/login", request.url)); }
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("psd_admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/check-in/:path*"],
};
