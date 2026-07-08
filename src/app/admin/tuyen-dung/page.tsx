"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";

const initialJobs = [
  { id: 1, title: "Giám đốc Tài chính (CFO)", dept: "Tài chính", type: "Toàn thời gian", location: "Đắk Lắk", status: "open", visible: true, deadline: "31/08/2024" },
  { id: 2, title: "Kế toán trưởng", dept: "Tài chính", type: "Toàn thời gian", location: "Đắk Lắk", status: "open", visible: true, deadline: "31/08/2024" },
  { id: 3, title: "Quản lý Dự án Bất động sản", dept: "Bất động sản", type: "Toàn thời gian", location: "Đà Lạt", status: "open", visible: true, deadline: "15/08/2024" },
  { id: 4, title: "Chuyên viên Marketing Digital", dept: "Marketing", type: "Toàn thời gian", location: "Hà Nội", status: "closed", visible: false, deadline: "01/07/2024" },
  { id: 5, title: "Kỹ sư Nông nghiệp", dept: "Nông nghiệp", type: "Toàn thời gian", location: "Đắk Lắk", status: "open", visible: true, deadline: "30/09/2024" },
  { id: 6, title: "Lập trình viên Backend Node.js", dept: "Công nghệ", type: "Toàn thời gian", location: "Remote", status: "open", visible: true, deadline: "30/09/2024" },
];

const statusLabel: Record<string, { label: string; cls: string }> = {
  open: { label: "Đang mở", cls: "bg-green-100 text-green-700" },
  closed: { label: "Đã đóng", cls: "bg-gray-100 text-gray-600" },
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.dept.toLowerCase().includes(search.toLowerCase())
  );

  function toggleVisible(id: number) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, visible: !j.visible } : j)));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Tuyển dụng</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">
            {jobs.filter((j) => j.status === "open").length} vị trí đang mở · {jobs.filter((j) => j.visible).length} đang hiển thị
          </p>
        </div>
        <Link href="/admin/tuyen-dung/them-moi" className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Thêm vị trí
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm vị trí, phòng ban..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["Vị trí", "Phòng ban", "Loại", "Địa điểm", "Trạng thái", "Hiển thị", "Hạn nộp", ""].map((h, i) => (
                <th key={i} className={`text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide whitespace-nowrap ${i === 7 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr key={job.id} className={`border-b border-gray-50 hover:bg-gray-50/50 last:border-0 transition-colors ${!job.visible ? "opacity-50" : ""}`}>
                <td className="px-5 py-4 font-medium text-[#111114]">{job.title}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{job.dept}</span>
                </td>
                <td className="px-5 py-4 text-[#6e6e74] whitespace-nowrap text-xs">{job.type}</td>
                <td className="px-5 py-4 text-[#6e6e74] whitespace-nowrap text-xs">{job.location}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusLabel[job.status].cls}`}>
                    {statusLabel[job.status].label}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleVisible(job.id)}
                    title={job.visible ? "Đang hiện — nhấn để ẩn" : "Đang ẩn — nhấn để hiện"}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      job.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {job.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {job.visible ? "Hiện" : "Ẩn"}
                  </button>
                </td>
                <td className="px-5 py-4 text-[#6e6e74] whitespace-nowrap text-xs">{job.deadline}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/tuyen-dung/${job.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
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
