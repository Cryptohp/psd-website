"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, GripVertical } from "lucide-react";

type Item = {
  id: string;
  title: string;
  label: string;
  shortDesc: string | null;
  order: number;
  isActive: boolean;
};

export default function AdminPhungSuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/phung-su")
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function toggleVisible(id: string, current: boolean) {
    const res = await fetch(`/api/phung-su/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) setItems(prev => prev.map(p => p.id === id ? { ...p, isActive: !current } : p));
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xác nhận xoá "${title}"? Thao tác không thể hoàn tác.`)) return;
    const res = await fetch(`/api/phung-su/${id}`, { method: "DELETE" });
    if (res.ok) setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111114]">Phụng sự xã hội</h1>
          <p className="text-xs text-[#6e6e74] mt-0.5">{items.length} dự án</p>
        </div>
        <Link
          href="/admin/phung-su/them-moi"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors"
        >
          <Plus size={15} /> Thêm dự án
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#6e6e74]">
            <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-[#6e6e74]">
            <p className="text-sm">Chưa có dự án nào.</p>
            <Link href="/admin/phung-su/them-moi" className="inline-block mt-3 text-sm text-[#e82127] font-medium hover:underline">
              + Thêm dự án đầu tiên
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wider w-8">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wider">Tên dự án</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wider w-32">Nhãn</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wider w-24">Thứ tự</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wider w-24">Trạng thái</th>
                <th className="w-28 px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5 text-[#6e6e74]">
                    <GripVertical size={14} className="opacity-30" />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[#111114] line-clamp-1">{item.title}</p>
                    {item.shortDesc && <p className="text-xs text-[#6e6e74] mt-0.5 line-clamp-1">{item.shortDesc}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-[#e82127] text-[#e82127] rounded">
                      {item.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#6e6e74]">{item.order}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleVisible(item.id, item.isActive)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {item.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {item.isActive ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/phung-su/${item.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6e6e74] hover:text-[#111114] transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors"
                      >
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
