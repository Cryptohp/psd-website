"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import RichEditor, { RichEditorHandle } from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import ImageGrid from "@/components/admin/ImageGrid";

export default function ThemPhungSuPage() {
  const router = useRouter();
  const editorRef = useRef<RichEditorHandle>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    label: "",
    shortDesc: "",
    description: "",
    thumbnail: "",
    images: [] as string[],
    order: 0,
    isActive: true,
  });

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Vui lòng nhập tên dự án"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/phung-su", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/phung-su");
    } else {
      const err = await res.json().catch(() => ({}));
      setError("Lỗi: " + (err.error ?? "Không thể lưu"));
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/phung-su" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold text-[#111114]">Thêm dự án mới</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Đang lưu..." : "Lưu dự án"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Meta bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Nhãn (tag)</label>
          <input
            value={form.label}
            onChange={e => set("label", e.target.value.toUpperCase())}
            placeholder="VD: VĂN HÓA, DI SẢN..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Thứ tự</label>
          <input
            type="number"
            value={form.order}
            onChange={e => set("order", Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => set("isActive", !form.isActive)}
              className={`w-10 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}
              style={{ height: 22 }}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className="text-sm font-semibold text-[#111114]">Hiển thị</span>
          </label>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tên dự án <span className="text-[#e82127]">*</span></label>
          <input
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="Nhập tên dự án..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả ngắn</label>
          <textarea
            rows={3}
            value={form.shortDesc}
            onChange={e => set("shortDesc", e.target.value)}
            placeholder="Mô tả tóm tắt..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Ảnh đại diện</label>
          <ImageUploader value={form.thumbnail} onChange={v => set("thumbnail", v)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Grid ảnh</label>
          <ImageGrid value={form.images} onChange={v => set("images", v)} onInsert={url => editorRef.current?.insertImage(url)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Nội dung chi tiết</label>
          <RichEditor ref={editorRef} content={form.description} onChange={v => set("description", v)} placeholder="Nội dung đầy đủ về dự án..." />
        </div>
      </div>
    </div>
  );
}
