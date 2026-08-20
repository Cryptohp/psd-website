import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminSession } from "@/lib/auth";

export const metadata = { title: "PSD Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Trang đăng nhập (chưa có session) hiển thị nguyên màn hình, không có sidebar/header.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f4f4f6] flex">
      <AdminSidebar role={session.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader email={session.email} role={session.role} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
