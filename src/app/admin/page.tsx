import { Newspaper, Briefcase, Building2, MessageSquare, TrendingUp, Eye, Users, FileText, Network } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [
    totalNews, publishedNews,
    totalProjects, activeProjects,
    totalCompanies, totalSectors,
    openJobs,
    newLeads,
  ] = await Promise.all([
    prisma.newsPost.count(),
    prisma.newsPost.count({ where: { isPublished: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: "IN_PROGRESS" } }),
    prisma.company.count({ where: { isActive: true } }),
    prisma.sector.count({ where: { isActive: true } }),
    prisma.job.count({ where: { isActive: true } }),
    prisma.lead.count({ where: { status: "new" } }),
  ]);
  return { totalNews, publishedNews, totalProjects, activeProjects, totalCompanies, totalSectors, openJobs, newLeads };
}

const quickLinks = [
  { label: "Thêm bài viết mới", href: "/admin/tin-tuc/them-moi", icon: Newspaper },
  { label: "Thêm dự án", href: "/admin/du-an/them-moi", icon: Building2 },
  { label: "Thêm công ty thành viên", href: "/admin/he-sinh-thai/them-moi", icon: Network },
  { label: "Đăng vị trí tuyển dụng", href: "/admin/tuyen-dung/them-moi", icon: Briefcase },
  { label: "Cập nhật ban lãnh đạo", href: "/admin/lanh-dao", icon: Users },
  { label: "Cài đặt website", href: "/admin/cai-dat", icon: FileText },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Tin tức",
      value: stats.totalNews,
      sub: `${stats.publishedNews} đã đăng`,
      icon: Newspaper,
      href: "/admin/tin-tuc",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Dự án",
      value: stats.totalProjects,
      sub: `${stats.activeProjects} đang triển khai`,
      icon: Building2,
      href: "/admin/du-an",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Công ty thành viên",
      value: stats.totalCompanies,
      sub: `${stats.totalSectors} lĩnh vực`,
      icon: Network,
      href: "/admin/he-sinh-thai",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Tuyển dụng",
      value: stats.openJobs,
      sub: "vị trí đang mở",
      icon: Briefcase,
      href: "/admin/tuyen-dung",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Liên hệ mới",
      value: stats.newLeads,
      sub: "chưa xử lý",
      icon: MessageSquare,
      href: "/admin/lien-he",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Dashboard</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">Tổng quan nội dung website PSD Group</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6e6e74]">
          <TrendingUp size={15} className="text-green-500" />
          Số liệu thực tế từ hệ thống
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <Eye size={14} className="text-gray-300 group-hover:text-[#e82127] transition-colors" />
            </div>
            <div className="text-3xl font-bold text-[#111114] mb-0.5">{s.value}</div>
            <div className="text-sm font-medium text-[#111114]">{s.label}</div>
            <div className="text-xs text-[#6e6e74] mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-[#111114] mb-4 text-sm">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-[#6e6e74] hover:text-[#111114] transition-colors group"
            >
              <q.icon size={15} className="group-hover:text-[#e82127] transition-colors flex-shrink-0" />
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
