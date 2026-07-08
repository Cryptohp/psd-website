"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Loader2 } from "lucide-react";

type Post = {
  id: string;
  title: string;
  category: string;
  status: string;
  visible: boolean;
  views: number;
  date: string;
};

const statusLabel: Record<string, { label: string; cls: string }> = {
  published: { label: "Đã đăng", cls: "bg-green-100 text-green-700" },
  draft: { label: "Bản nháp", cls: "bg-gray-100 text-gray-600" },
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tin-tuc")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleVisible(id: string, current: boolean) {
    const res = await fetch(`/api/tin-tuc/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !current }),
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, visible: !current } : p));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xoá bài viết này?")) return;
    const res = await fetch(`/api/tin-tuc/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Tin tức</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">
            {posts.length} bài viết · {posts.filter(p => p.visible).length} đang hiển thị
          </p>
        </div>
        <Link href="/admin/tin-tuc/them-moi" className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Thêm bài viết
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm bài viết..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white"
        />
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Tiêu đề</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide whitespace-nowrap">Danh mục</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Trạng thái</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Hiển thị</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Lượt xem</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Ngày</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[#6e6e74] text-sm">Không có bài viết nào</td></tr>
              ) : filtered.map((post) => (
                <tr key={post.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0 ${!post.visible ? "opacity-50" : ""}`}>
                  <td className="px-5 py-4">
                    <span className="font-medium text-[#111114] line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusLabel[post.status]?.cls ?? "bg-gray-100 text-gray-600"}`}>
                      {statusLabel[post.status]?.label ?? post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleVisible(post.id, post.visible)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        post.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {post.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {post.visible ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-[#6e6e74] whitespace-nowrap">
                    <div className="flex items-center gap-1"><Eye size={13} />{post.views.toLocaleString()}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6e6e74] whitespace-nowrap">{post.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/tin-tuc/${post.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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
