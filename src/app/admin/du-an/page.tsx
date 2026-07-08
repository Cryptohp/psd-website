"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";

const initialProjects = [
  { id: 1, title: "Khu đô thị sinh thái Nam Đà Lạt", sector: "Bất động sản", status: "in_progress", visible: true, location: "Đà Lạt", value: "850 tỷ" },
  { id: 2, title: "Nhà máy chế biến nông sản Tây Nguyên", sector: "Nông nghiệp", status: "completed", visible: true, location: "Đắk Lắk", value: "320 tỷ" },
  { id: 3, title: "Tổ hợp thương mại dịch vụ PSD Plaza", sector: "Thương mại", status: "in_progress", visible: true, location: "Buôn Ma Thuột", value: "1.2 nghìn tỷ" },
  { id: 4, title: "Dự án điện mặt trời Krông Pắc", sector: "Năng lượng", status: "planning", visible: false, location: "Đắk Lắk", value: "480 tỷ" },
  { id: 5, title: "Khu nghỉ dưỡng sinh thái Lâm Đồng", sector: "Du lịch", status: "planning", visible: true, location: "Lâm Đồng", value: "620 tỷ" },
  { id: 6, title: "Xưởng sản xuất vật liệu xây dựng", sector: "Xây dựng", status: "completed", visible: true, location: "Đắk Lắk", value: "90 tỷ" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  in_progress: { label: "Đang triển khai", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "Hoàn thành", cls: "bg-green-100 text-green-700" },
  planning: { label: "Lên kế hoạch", cls: "bg-yellow-100 text-yellow-700" },
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggleVisible(id: number) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Dự án</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">{projects.length} dự án · {projects.filter((p) => p.visible).length} đang hiển thị</p>
        </div>
        <Link href="/admin/du-an/them-moi" className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Thêm dự án
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm dự án..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["Tên dự án", "Lĩnh vực", "Địa điểm", "Đầu tư", "Trạng thái", "Hiển thị", ""].map((h, i) => (
                <th key={i} className={`text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide whitespace-nowrap ${i === 6 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 last:border-0 transition-colors ${!p.visible ? "opacity-50" : ""}`}>
                <td className="px-5 py-4 font-medium text-[#111114] max-w-xs">
                  <span className="line-clamp-1">{p.title}</span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">{p.sector}</span>
                </td>
                <td className="px-5 py-4 text-[#6e6e74] text-xs whitespace-nowrap">{p.location}</td>
                <td className="px-5 py-4 text-[#111114] font-medium text-xs whitespace-nowrap">{p.value}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[p.status].cls}`}>
                    {statusMap[p.status].label}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleVisible(p.id)}
                    title={p.visible ? "Đang hiện — nhấn để ẩn" : "Đang ẩn — nhấn để hiện"}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      p.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {p.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {p.visible ? "Hiện" : "Ẩn"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/du-an/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
