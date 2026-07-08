"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-sm text-[#6e6e74]">
        Xin chào, <span className="font-semibold text-[#111114]">Admin</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-[#6e6e74] transition-colors relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e82127] rounded-full" />
        </button>
        <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-[#6e6e74] transition-colors">
          <User size={17} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6e6e74] hover:bg-gray-100 hover:text-[#e82127] transition-colors"
        >
          <LogOut size={15} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
