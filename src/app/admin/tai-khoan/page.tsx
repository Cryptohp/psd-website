import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersManager from "./UsersManager";

export const metadata = { title: "Quản lý tài khoản" };

export default async function TaiKhoanPage() {
  const session = await getAdminSession();
  if (!session || session.role !== "SUPER_ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const initialUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersManager initialUsers={initialUsers} currentEmail={session.email} />;
}
