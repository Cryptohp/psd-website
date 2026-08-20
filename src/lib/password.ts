import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Băm mật khẩu bằng scrypt (không cần thư viện ngoài).
 * Định dạng lưu: "<salt-hex>:<hash-hex>"
 */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Kiểm tra mật khẩu nhập vào với chuỗi đã băm trong DB. */
export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = scryptSync(plain, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}
