import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@/lib/permissions";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "psd-admin-secret-fallback"
);

const COOKIE_NAME = "psd_admin_token";

export type AdminSession = { email: string; role: Role };

export async function signAdminToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.email || !payload.role) return null;
    return { email: payload.email as string, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
