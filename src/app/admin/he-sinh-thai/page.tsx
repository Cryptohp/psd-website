"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Loader2, Eye, EyeOff,
  ChevronRight, Building2, Layers,
} from "lucide-react";

type Company = {
  id: string;
  name: string;
  website: string | null;
  logo: string | null;
  order: number;
  isActive: boolean;
  sectorId: string | null;
  sectorName: string;
};

type Sector = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  companies: Company[];
};

export default function HeSinhThaiPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSectorId, setActiveSectorId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sectors")
      .then(r => r.json())
      .then((data: Sector[]) => {
        setSectors(data);
        if (data.length > 0) setActiveSectorId(data[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeSector = sectors.find(s => s.id === activeSectorId) ?? null;

  async function toggleCompany(id: string, current: boolean) {
    setTogglingId(id);
    const res = await fetch(`/api/cong-ty/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setSectors(prev => prev.map(s => ({
        ...s,
        companies: s.companies.map(c => c.id === id ? { ...c, isActive: !current } : c),
      })));
    }
    setTogglingId(null);
  }

  async function deleteCompany(id: string) {
    if (!confirm("Xác nhận xoá công ty này?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/cong-ty/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSectors(prev => prev.map(s => ({
        ...s,
        companies: s.companies.filter(c => c.id !== id),
      })));
    }
    setDeletingId(null);
  }

  async function toggleSector(id: string, current: boolean) {
    const res = await fetch(`/api/sectors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setSectors(prev => prev.map(s => s.id === id ? { ...s, isActive: !current } : s));
    }
  }

  const totalCompanies = sectors.reduce((acc, s) => acc + s.companies.length, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Hệ sinh thái</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">
            {sectors.length} lĩnh vực · {totalCompanies} công ty thành viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/he-sinh-thai/linh-vuc/them-moi"
            className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-[#111114] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Layers size={15} /> Thêm lĩnh vực
          </Link>
          <Link
            href="/admin/he-sinh-thai/them-moi"
            className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Thêm công ty
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#6e6e74]">
          <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* Sector sidebar */}
          <div className="w-56 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <p className="text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Lĩnh vực</p>
            </div>
            <nav className="py-1">
              {sectors.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSectorId(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors border-l-2 ${
                    s.id === activeSectorId
                      ? "border-[#e82127] bg-red-50/50 text-[#e82127] font-semibold"
                      : "border-transparent text-[#374151] hover:bg-gray-50 font-medium"
                  } ${!s.isActive ? "opacity-50" : ""}`}
                >
                  <span className="line-clamp-2 leading-snug">{s.name}</span>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <span className="text-xs text-[#9ca3af]">{s.companies.length}</span>
                    <ChevronRight size={12} className="text-[#9ca3af]" />
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Company table */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {activeSector ? (
              <>
                {/* Sector header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div>
                    <h2 className="font-semibold text-[#111114]">{activeSector.name}</h2>
                    {activeSector.description && (
                      <p className="text-xs text-[#6e6e74] mt-0.5 line-clamp-1">{activeSector.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSector(activeSector.id, activeSector.isActive)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        activeSector.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {activeSector.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                      {activeSector.isActive ? "Hiện" : "Ẩn"}
                    </button>
                    <Link
                      href={`/admin/he-sinh-thai/linh-vuc/${activeSector.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Pencil size={11} /> Sửa lĩnh vực
                    </Link>
                  </div>
                </div>

                {/* Company rows */}
                {activeSector.companies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#6e6e74]">
                    <Building2 size={32} className="mb-3 opacity-30" />
                    <p className="text-sm">Chưa có công ty nào trong lĩnh vực này</p>
                    <Link
                      href={`/admin/he-sinh-thai/them-moi?sectorId=${activeSector.id}`}
                      className="mt-3 text-sm text-[#e82127] hover:underline font-medium"
                    >
                      + Thêm công ty
                    </Link>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">#</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Tên công ty</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Website</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Hiển thị</th>
                        <th className="px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSector.companies.map((c, i) => (
                        <tr
                          key={c.id}
                          className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${!c.isActive ? "opacity-50" : ""}`}
                        >
                          <td className="px-5 py-3.5 text-xs text-[#9ca3af] font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-[#111114]">
                            <span className="line-clamp-2">{c.name}</span>
                          </td>
                          <td className="px-5 py-3.5 text-[#6e6e74] text-xs">
                            {c.website ? (
                              <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="hover:text-[#e82127] transition-colors">
                                {c.website.replace(/^https?:\/\//, "")}
                              </a>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => toggleCompany(c.id, c.isActive)}
                              disabled={togglingId === c.id}
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${
                                c.isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {togglingId === c.id
                                ? <Loader2 size={11} className="animate-spin" />
                                : c.isActive ? <Eye size={11} /> : <EyeOff size={11} />
                              }
                              {c.isActive ? "Hiện" : "Ẩn"}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 justify-end">
                              <Link
                                href={`/admin/he-sinh-thai/${c.id}`}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors"
                              >
                                <Pencil size={14} />
                              </Link>
                              <button
                                onClick={() => deleteCompany(c.id)}
                                disabled={deletingId === c.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors disabled:opacity-50"
                              >
                                {deletingId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-20 text-[#6e6e74] text-sm">
                Chọn một lĩnh vực bên trái
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
