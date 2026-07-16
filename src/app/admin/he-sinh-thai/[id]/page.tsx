"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import RichEditor, { RichEditorHandle } from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import ImageGrid from "@/components/admin/ImageGrid";

type Sector = { id: string; name: string };

export default function SuaCongTyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<RichEditorHandle>(null);

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
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
    sectorId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/sectors").then(r => r.json()),
      fetch(`/api/cong-ty/${id}`).then(r => r.json()),
    ]).then(([secs, company]) => {
      setSectors(secs);
      setForm({
        name: company.name ?? "",
        shortDesc: company.shortDesc ?? "",
        description: company.description ?? "",
        website: company.website ?? "",
        logo: company.logo ?? "",
        images: Array.isArray(company.images) ? company.images : [],
        order: company.order ?? 0,
        isActive: company.isActive ?? true,
        sectorId: company.sectorId ?? "",
      });
      setLoading(false);
    });
  }, [id]);

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Vui lòng nhập tên công ty"); return; }
    setSaving(true); setError("");
    const res = await fetch(`/api/cong-ty/${id}`, {
      method: "PUT",
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

  async function handleDelete() {
    if (!confirm("Xác nhận xoá công ty này? Thao tác không thể hoàn tác.")) return;
    const res = await fetch(`/api/cong-ty/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/he-sinh-thai");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#6e6e74]">
        <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/he-sinh-thai" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Chỉnh sửa công ty</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5 line-clamp-1">{form.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-200 text-red-500 bg-white rounded-xl hover:bg-red-50">
            <Trash2 size={14} /> Xoá
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-60">
            <Save size={14} />{saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả ngắn</label>
          <textarea
            rows={3}
            value={form.shortDesc}
            onChange={e => set("shortDesc", e.target.value)}
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
    </div>
  );
}
