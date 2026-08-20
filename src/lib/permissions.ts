/**
 * Phân quyền admin theo vai trò (RBAC).
 * 4 vai trò khớp với enum UserRole trong prisma/schema.prisma.
 */
export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "HR";

/** Nhãn tiếng Việt hiển thị cho từng vai trò */
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Quản trị tối cao",
  ADMIN: "Quản trị viên",
  EDITOR: "Biên tập nội dung",
  HR: "Nhân sự",
};

export const ALL_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "HR"];

/**
 * Quyền truy cập theo tiền tố đường dẫn.
 * Đường dẫn /admin (dashboard) và bất kỳ path nào không khớp tiền tố nào
 * đều được phép cho mọi vai trò đã đăng nhập.
 */
export const ROUTE_ACCESS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin/tai-khoan", roles: ["SUPER_ADMIN"] },
  { prefix: "/admin/cai-dat", roles: ["SUPER_ADMIN", "ADMIN"] },
  { prefix: "/admin/lien-he", roles: ["SUPER_ADMIN", "ADMIN"] },
  { prefix: "/admin/tuyen-dung", roles: ["SUPER_ADMIN", "ADMIN", "HR"] },
  { prefix: "/admin/tin-tuc", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { prefix: "/admin/du-an", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { prefix: "/admin/he-sinh-thai", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { prefix: "/admin/phung-su", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { prefix: "/admin/lanh-dao", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { prefix: "/admin/su-kien", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
];

/**
 * Kiểm tra 1 vai trò có được vào đường dẫn admin hay không.
 * Không khớp tiền tố nào (vd /admin dashboard) => cho phép.
 */
export function canAccessPath(role: Role, pathname: string): boolean {
  const rule = ROUTE_ACCESS.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/")
  );
  if (!rule) return true;
  return rule.roles.includes(role);
}
