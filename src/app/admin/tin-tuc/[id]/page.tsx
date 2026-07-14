"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import RichEditor from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  label: string;
  status: string;
  visible: boolean;
  excerpt: string;
  content: string;
  image: string;
  imageAlign?: string;
  publishedAt?: string;
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tin-tuc/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...data,
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        });
        setLoading(false);
      })
      .catch(() => { setError("Không tìm thấy bài viết"); setLoading(false); });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  }

  async function handleSave(status: string) {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/tin-tuc/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/tin-tuc");
    } catch {
      setError("Có lỗi xảy ra");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Xác nhận xoá bài viết này?")) return;
    await fetch(`/api/tin-tuc/${id}`, { method: "DELETE" });
    router.push("/admin/tin-tuc");
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-[#6e6e74]">
      <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
    </div>
  );

  if (!form) return (
    <div className="text-center py-24 text-[#6e6e74]">Không tìm thấy bài viết. <Link href="/admin/tin-tuc" className="text-[#e82127]">Quay lại</Link></div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/tin-tuc" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Chỉnh sửa bài viết</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-200 text-red-500 bg-white rounded-xl hover:bg-red-50">
            <Trash2 size={14} /> Xoá
          </button>
          <button onClick={() => handleSave("draft")} disabled={saving} className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74] disabled:opacity-50">
            <Save size={14} className="inline mr-1.5" /> Lưu nháp
          </button>
          <button onClick={() => handleSave("published")} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-50">
            <Eye size={14} />
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </div>

      {/* Phân loại — horizontal bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Danh mục</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            {["Tin tức", "Tin PSD Group", "Tin dự án", "Hoạt động cộng đồng", "Về PSD", "Bền vững", "Hợp tác"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            <option value="draft">Bản nháp</option>
            <option value="published">Đã đăng</option>
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Hiển thị trên trang</label>
          <select
            value={form.visible ? "true" : "false"}
            onChange={(e) => setForm((prev) => prev ? { ...prev, visible: e.target.value === "true" } : prev)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white"
          >
            <option value="true">Hiện</option>
            <option value="false">Ẩn</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Ngày đăng</label>
          <input type="date" name="publishedAt" value={form.publishedAt ?? ""} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white" />
        </div>
      </div>

      {/* Main content — full width */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tiêu đề bài viết *</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Slug URL</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#e82127]">
            <span className="px-3 py-3 text-sm text-[#6e6e74] bg-gray-50 border-r border-gray-200 whitespace-nowrap">/tin-tuc/</span>
            <input name="slug" value={form.slug} onChange={handleChange} className="flex-1 px-3 py-3 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tóm tắt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={4} placeholder="Mô tả ngắn hiển thị trong danh sách bài viết..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-y" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Ảnh đại diện</label>
          <ImageUploader
            value={form.image ?? ""}
            onChange={(url) => setForm((prev) => prev ? { ...prev, image: url } : prev)}
          />
          <div className="mt-3">
            <label className="block text-xs text-[#6e6e74] mb-2">Căn chỉnh ảnh</label>
            <div className="flex gap-2">
              {[
                { value: "left", label: "Trái", icon: "▐█░" },
                { value: "center", label: "Giữa", icon: "░█░" },
                { value: "right", label: "Phải", icon: "░█▌" },
                { value: "full", label: "Full", icon: "███" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => prev ? { ...prev, imageAlign: opt.value } : prev)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                    form.imageAlign === opt.value || (!(form.imageAlign) && opt.value === "full")
                      ? "border-[#e82127] bg-[#e82127]/5 text-[#e82127]"
                      : "border-gray-200 text-[#6e6e74] hover:border-gray-300"
                  }`}
                >
                  <span className="font-mono text-base leading-none">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Nội dung bài viết *</label>
          <RichEditor
            content={form.content}
            placeholder="Nhập nội dung bài viết..."
            onChange={(html) => setForm((prev) => prev ? { ...prev, content: html } : prev)}
          />
        </div>
      </div>
    </div>
  );
}
