"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import RichEditor, { RichEditorHandle } from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import ImageGrid from "@/components/admin/ImageGrid";

type Sector = { id: string; name: string };

function ThemCongTyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultSectorId = searchParams.get("sectorId") ?? "";
  const editorRef = useRef<RichEditorHandle>(null);

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    shortDesc: "",
    description: "",
    website: "",
    logo: "",
    images: [] as string[],
    order: 0,
    isActive: true,
    sectorId: defaultSectorId,
  });

  useEffect(() => {
    fetch("/api/sectors")
      .then(r => r.json())
      .then(setSectors);
  }, []);

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Vui lòng nhập tên công ty"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/cong-ty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/he-sinh-thai");
    } else {
      const err = await res.json().catch(() => ({}));
      setError("Lỗi: " + (err.error ?? "Không thể lưu"));
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/he-sinh-thai" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6e6e74] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Thêm công ty thành viên</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">Điền thông tin công ty mới</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meta bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-[#6e6e74] mb-1.5">Lĩnh vực hoạt động</label>
            <select
              value={form.sectorId}
              onChange={e => set("sectorId", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white"
            >
              <option value="">— Chọn lĩnh vực —</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-[#6e6e74] mb-1.5">Thứ tự</label>
            <input
              type="number"
              value={form.order}
              onChange={e => set("order", Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127]"
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
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Tên công ty <span className="text-[#e82127]">*</span></label>
            <input
              required
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Công ty TNHH ..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={form.shortDesc}
              onChange={e => set("shortDesc", e.target.value)}
              placeholder="Giới thiệu ngắn về công ty..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Website</label>
            <input
              value={form.website}
              onChange={e => set("website", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Ảnh bìa công ty</label>
            <ImageUploader value={form.logo} onChange={v => set("logo", v)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Grid ảnh công ty</label>
            <ImageGrid value={form.images} onChange={v => set("images", v)} onInsert={url => editorRef.current?.insertImage(url)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">Nội dung chi tiết</label>
            <RichEditor ref={editorRef} content={form.description} onChange={v => set("description", v)} placeholder="Nội dung đầy đủ về công ty..." />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Lưu công ty
          </button>
          <Link href="/admin/he-sinh-thai" className="text-sm text-[#6e6e74] hover:text-[#111114] transition-colors">
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ThemCongTyPage() {
  return (
    <Suspense>
      <ThemCongTyForm />
    </Suspense>
  );
}
