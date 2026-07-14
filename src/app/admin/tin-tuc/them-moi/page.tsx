"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import RichEditor from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Tin tức",
    label: "TIN TỨC",
    excerpt: "",
    content: "",
    image: "",
    imageAlign: "full",
    status: "draft",
    visible: true,
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tin-tuc/categories")
      .then(r => r.json())
      .then((data: { name: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map(c => c.name);
          setCategories(names);
          setForm(prev => ({ ...prev, category: names[0], label: names[0].toUpperCase() }));
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) next.slug = toSlug(value);
      if (name === "category") next.label = value.toUpperCase();
      return next;
    });
  }

  async function handleSave(status: string) {
    if (!form.title.trim()) { setError("Vui lòng nhập tiêu đề"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/tin-tuc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      router.push("/admin/tin-tuc");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/tin-tuc" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Thêm bài viết mới</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">Điền đầy đủ thông tin bên dưới</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74] transition-colors disabled:opacity-50"
          >
            <Save size={14} /> Lưu nháp
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Eye size={14} />
            {saving ? "Đang lưu..." : "Đăng bài"}
          </button>
        </div>
      </div>

      {/* Phân loại — horizontal bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Danh mục</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            {categories.map((c) => (
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
          <select name="visible" value={form.visible ? "true" : "false"} onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.value === "true" }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            <option value="true">Hiện</option>
            <option value="false">Ẩn</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Ngày đăng</label>
          <input type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white" />
        </div>
      </div>

      {/* Main content — full width */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tiêu đề bài viết *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Nhập tiêu đề..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Slug URL</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#e82127]">
            <span className="px-3 py-3 text-sm text-[#6e6e74] bg-gray-50 border-r border-gray-200 whitespace-nowrap">/tin-tuc/</span>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="ten-bai-viet" className="flex-1 px-3 py-3 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tóm tắt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={4} placeholder="Mô tả ngắn hiển thị trong danh sách bài viết..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-y" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Ảnh đại diện</label>
          <ImageUploader value={form.image} onChange={(url) => setForm((prev) => ({ ...prev, image: url }))} />
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
                  onClick={() => setForm((prev) => ({ ...prev, imageAlign: opt.value }))}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                    form.imageAlign === opt.value
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
          <RichEditor placeholder="Nhập nội dung bài viết..." onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
        </div>
      </div>
    </div>
  );
}
