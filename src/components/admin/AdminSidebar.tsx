"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Building2,
  Users,
  MessageSquare,
  Settings,
  Globe,
  ChevronRight,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tin-tuc", label: "Tin tức", icon: Newspaper },
  { href: "/admin/tuyen-dung", label: "Tuyển dụng", icon: Briefcase },
  { href: "/admin/du-an", label: "Dự án", icon: Building2 },
  { href: "/admin/lanh-dao", label: "Ban lãnh đạo", icon: Users },
  { href: "/admin/lien-he", label: "Liên hệ & Leads", icon: MessageSquare },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-60 bg-[#111114] flex flex-col flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <Image src="/logo-psd.png" alt="PSD Group" width={100} height={40} style={{ objectFit: "contain" }} unoptimized />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                active
                  ? "bg-[#e82127] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* View site */}
      <div className="px-3 pb-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <Globe size={15} />
          Xem trang chủ
        </Link>
      </div>
    </aside>
  );
}
