"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Loader2, Star } from "lucide-react";

type Project = {
  id: string;
  title: string;
  sector: string;
  status: string;
  visible: boolean;
  isFeatured: boolean;
  location: string;
  scale: string;
};

const statusMap: Record<string, { label: string; cls: string }> = {
  PLANNING: { label: "Lên kế hoạch", cls: "bg-yellow-100 text-yellow-700" },
  IN_PROGRESS: { label: "Đang triển khai", cls: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Hoàn thành", cls: "bg-green-100 text-green-700" },
  ON_HOLD: { label: "Tạm dừng", cls: "bg-gray-100 text-gray-600" },
};

const sectorColors: Record<string, string> = {
  "Bất động sản & Hạ tầng":  "bg-red-50 text-red-700",
  "Sản xuất & Công nghiệp":   "bg-orange-50 text-orange-700",
  "Khoáng sản":               "bg-stone-100 text-stone-700",
  "Logistics & Cảng biển":    "bg-sky-50 text-sky-700",
  "Nông nghiệp & Thủy sản":   "bg-green-50 text-green-700",
  "Du lịch & Nghỉ dưỡng":    "bg-teal-50 text-teal-700",
  "Đầu tư & Dịch vụ":         "bg-purple-50 text-purple-700",
  "Trách nhiệm xã hội":       "bg-pink-50 text-pink-700",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/du-an?all=true")
      .then(r => r.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleFeatured(id: string, current: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/du-an/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !current } : p));
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Lỗi: " + (err.error ?? res.status));
      }
    } catch {
      alert("Không thể kết nối server");
    } finally {
      setTogglingId(null);
    }
  }

  async function toggleVisible(id: string, current: boolean) {
    const res = await fetch(`/api/du-an/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !current }),
    });
    if (res.ok) setProjects(prev => prev.map(p => p.id === id ? { ...p, visible: !current } : p));
  }

  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xoá dự án này?")) return;
    const res = await fetch(`/api/du-an/${id}`, { method: "DELETE" });
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Dự án</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">{projects.length} dự án · {projects.filter(p => p.visible).length} đang hiển thị</p>
        </div>
        <Link href="/admin/du-an/them-moi" className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Thêm dự án
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm dự án..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#6e6e74]">
            <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Tên dự án", "Lĩnh vực", "Địa điểm", "Quy mô", "Trạng thái", "Nổi bật", "Hiển thị", ""].map((h, i) => (
                  <th key={i} className={`text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide whitespace-nowrap ${i === 6 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#6e6e74] text-sm">Chưa có dự án nào</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 last:border-0 transition-colors ${!p.visible ? "opacity-50" : ""}`}>
                  <td className="px-5 py-4 font-medium text-[#111114] max-w-xs"><span className="line-clamp-1">{p.title}</span></td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sectorColors[p.sector] ?? "bg-gray-100 text-gray-600"}`}>{p.sector || "—"}</span>
                  </td>
                  <td className="px-5 py-4 text-[#6e6e74] text-xs whitespace-nowrap">{p.location || "—"}</td>
                  <td className="px-5 py-4 text-[#6e6e74] text-xs whitespace-nowrap">{p.scale || "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[p.status]?.cls ?? "bg-gray-100 text-gray-600"}`}>
                      {statusMap[p.status]?.label ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button onClick={() => toggleFeatured(p.id, p.isFeatured)} disabled={togglingId === p.id} title={p.isFeatured ? "Đang nổi bật — bấm để bỏ" : "Bấm để đặt nổi bật"} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${p.isFeatured ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                      {togglingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} className={p.isFeatured ? "fill-yellow-500 text-yellow-500" : ""} />}
                      {p.isFeatured ? "Nổi bật" : "Thường"}
                    </button>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button onClick={() => toggleVisible(p.id, p.visible)} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${p.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      {p.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.visible ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/du-an/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
