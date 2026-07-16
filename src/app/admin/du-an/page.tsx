"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Loader2, Star, ChevronRight, Building2 } from "lucide-react";

type Project = {
  id: string;
  title: string;
  sector: string;
  sectorId: string | null;
  status: string;
  visible: boolean;
  isFeatured: boolean;
  location: string;
  scale: string;
};

type Sector = {
  id: string;
  name: string;
  isActive: boolean;
};

const statusMap: Record<string, { label: string; cls: string }> = {
  PLANNING:    { label: "Lên kế hoạch",    cls: "bg-yellow-100 text-yellow-700" },
  IN_PROGRESS: { label: "Đang triển khai", cls: "bg-blue-100 text-blue-700" },
  COMPLETED:   { label: "Hoàn thành",      cls: "bg-green-100 text-green-700" },
  ON_HOLD:     { label: "Tạm dừng",        cls: "bg-gray-100 text-gray-600" },
};

const ALL_ID = "__all__";
const NONE_ID = "__none__";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSectorId, setActiveSectorId] = useState<string>(ALL_ID);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/du-an?all=true").then(r => r.json()),
      fetch("/api/sectors").then(r => r.json()),
    ]).then(([proj, sec]) => {
      setProjects(proj);
      setSectors(sec);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchSector =
      activeSectorId === ALL_ID ? true :
      activeSectorId === NONE_ID ? !p.sectorId :
      p.sectorId === activeSectorId;
    return matchSearch && matchSector;
  });

  const countBySector = (sectorId: string) =>
    projects.filter(p => p.sectorId === sectorId).length;

  async function toggleFeatured(id: string, current: boolean) {
    setTogglingId(id);
    const res = await fetch(`/api/du-an/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) setProjects(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !current } : p));
    else { const e = await res.json().catch(() => ({})); alert("Lỗi: " + (e.error ?? res.status)); }
    setTogglingId(null);
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
    setDeletingId(id);
    const res = await fetch(`/api/du-an/${id}`, { method: "DELETE" });
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  }

  const activeSectorName =
    activeSectorId === ALL_ID ? "Tất cả dự án" :
    activeSectorId === NONE_ID ? "Chưa phân lĩnh vực" :
    sectors.find(s => s.id === activeSectorId)?.name ?? "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Dự án</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">
            {projects.length} dự án · {projects.filter(p => p.visible).length} đang hiển thị
          </p>
        </div>
        <Link
          href="/admin/du-an/them-moi"
          className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Thêm dự án
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#6e6e74]">
          <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* Sector sidebar */}
          <div className="w-52 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Lĩnh vực</p>
            </div>
            <nav className="py-1">
              {/* All */}
              <button
                onClick={() => setActiveSectorId(ALL_ID)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors border-l-2 ${
                  activeSectorId === ALL_ID
                    ? "border-[#e82127] bg-red-50/50 text-[#e82127] font-semibold"
                    : "border-transparent text-[#374151] hover:bg-gray-50 font-medium"
                }`}
              >
                <span>Tất cả</span>
                <span className="text-xs text-[#9ca3af]">{projects.length}</span>
              </button>

              {sectors.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSectorId(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors border-l-2 ${
                    s.id === activeSectorId
                      ? "border-[#e82127] bg-red-50/50 text-[#e82127] font-semibold"
                      : "border-transparent text-[#374151] hover:bg-gray-50 font-medium"
                  }`}
                >
                  <span className="line-clamp-2 leading-snug">{s.name}</span>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    <span className="text-xs text-[#9ca3af]">{countBySector(s.id)}</span>
                    <ChevronRight size={11} className="text-[#9ca3af]" />
                  </div>
                </button>
              ))}

              {/* Unassigned */}
              {projects.some(p => !p.sectorId) && (
                <button
                  onClick={() => setActiveSectorId(NONE_ID)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors border-l-2 ${
                    activeSectorId === NONE_ID
                      ? "border-[#e82127] bg-red-50/50 text-[#e82127] font-semibold"
                      : "border-transparent text-[#9ca3af] hover:bg-gray-50"
                  }`}
                >
                  <span className="italic">Chưa phân loại</span>
                  <span className="text-xs text-[#9ca3af]">{projects.filter(p => !p.sectorId).length}</span>
                </button>
              )}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Search + sector label */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm dự án..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white"
                />
              </div>
              <span className="text-sm text-[#6e6e74]">
                <span className="font-semibold text-[#111114]">{activeSectorName}</span>
                {" "}· {filtered.length} dự án
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#6e6e74]">
                  <Building2 size={32} className="mb-3 opacity-30" />
                  <p className="text-sm">Chưa có dự án nào trong lĩnh vực này</p>
                  <Link href="/admin/du-an/them-moi" className="mt-3 text-sm text-[#e82127] hover:underline font-medium">
                    + Thêm dự án
                  </Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["Tên dự án", "Địa điểm", "Quy mô", "Trạng thái", "Nổi bật", "Hiển thị", ""].map((h, i) => (
                        <th key={i} className={`text-left px-4 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide whitespace-nowrap ${i === 6 ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 last:border-0 transition-colors ${!p.visible ? "opacity-50" : ""}`}>
                        <td className="px-4 py-3.5 font-medium text-[#111114] max-w-xs">
                          <div className="line-clamp-2 leading-snug">{p.title}</div>
                          {activeSectorId === ALL_ID && p.sector && (
                            <span className="text-[10px] text-[#9ca3af] mt-0.5 block">{p.sector}</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-[#6e6e74] text-xs whitespace-nowrap">{p.location || "—"}</td>
                        <td className="px-4 py-3.5 text-[#6e6e74] text-xs whitespace-nowrap">{p.scale || "—"}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[p.status]?.cls ?? "bg-gray-100 text-gray-600"}`}>
                            {statusMap[p.status]?.label ?? p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <button
                            onClick={() => toggleFeatured(p.id, p.isFeatured)}
                            disabled={togglingId === p.id}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${p.isFeatured ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                          >
                            {togglingId === p.id ? <Loader2 size={11} className="animate-spin" /> : <Star size={11} className={p.isFeatured ? "fill-yellow-500 text-yellow-500" : ""} />}
                            {p.isFeatured ? "Nổi bật" : "Thường"}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <button
                            onClick={() => toggleVisible(p.id, p.visible)}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${p.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            {p.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                            {p.visible ? "Hiện" : "Ẩn"}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 justify-end">
                            <Link href={`/admin/du-an/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              {deletingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
        </div>
      )}
    </div>
  );
}
