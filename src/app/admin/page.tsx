import { Newspaper, Briefcase, Building2, MessageSquare, TrendingUp, Eye, Users, FileText } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Bài viết", value: "24", sub: "+3 tháng này", icon: Newspaper, href: "/admin/tin-tuc", color: "bg-blue-50 text-blue-600" },
  { label: "Vị trí tuyển dụng", value: "8", sub: "4 đang mở", icon: Briefcase, href: "/admin/tuyen-dung", color: "bg-green-50 text-green-600" },
  { label: "Dự án", value: "12", sub: "6 đang triển khai", icon: Building2, href: "/admin/du-an", color: "bg-orange-50 text-orange-600" },
  { label: "Liên hệ mới", value: "7", sub: "Chưa xử lý", icon: MessageSquare, href: "/admin/lien-he", color: "bg-red-50 text-red-600" },
];

const quickLinks = [
  { label: "Thêm bài viết mới", href: "/admin/tin-tuc/them-moi", icon: Newspaper },
  { label: "Đăng vị trí mới", href: "/admin/tuyen-dung/them-moi", icon: Briefcase },
  { label: "Thêm dự án", href: "/admin/du-an/them-moi", icon: Building2 },
  { label: "Xem leads liên hệ", href: "/admin/lien-he", icon: MessageSquare },
  { label: "Cập nhật ban lãnh đạo", href: "/admin/lanh-dao", icon: Users },
  { label: "Cài đặt website", href: "/admin/cai-dat", icon: FileText },
];

const recentActivity = [
  { action: "Bài viết mới được tạo", subject: "PSD Group mở rộng lĩnh vực năng lượng tái tạo", time: "2 giờ trước", type: "create" },
  { action: "Liên hệ mới", subject: "Nguyễn Văn A — Hợp tác kinh doanh", time: "4 giờ trước", type: "lead" },
  { action: "Đơn ứng tuyển", subject: "Trần Thị B — Kế toán trưởng", time: "6 giờ trước", type: "apply" },
  { action: "Dự án cập nhật", subject: "Khu đô thị sinh thái Nam Đà Lạt", time: "1 ngày trước", type: "update" },
  { action: "Bài viết được chỉnh sửa", subject: "Hành trình 10 năm phát triển của PSD Group", time: "2 ngày trước", type: "edit" },
];

const typeColor: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  lead: "bg-blue-100 text-blue-700",
  apply: "bg-purple-100 text-purple-700",
  update: "bg-orange-100 text-orange-700",
  edit: "bg-gray-100 text-gray-700",
};

export default function AdminDashboard() {
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
          Cập nhật lần cuối: hôm nay
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#111114] mb-4 text-sm">Thao tác nhanh</h2>
          <div className="space-y-1">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-[#6e6e74] hover:text-[#111114] transition-colors group"
              >
                <q.icon size={15} className="group-hover:text-[#e82127] transition-colors" />
                {q.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#111114] mb-4 text-sm">Hoạt động gần đây</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${typeColor[a.type]}`}>
                  {a.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111114] truncate">{a.subject}</p>
                  <p className="text-xs text-[#6e6e74] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
