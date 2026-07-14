"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import RichEditor from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import ImageGrid from "@/components/admin/ImageGrid";

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

type Sector = { id: string; name: string };

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", shortDesc: "", description: "",
    thumbnail: "", images: [] as string[], location: "", province: "", scale: "",
    status: "IN_PROGRESS", startYear: "", isFeatured: false, sectorId: "",
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sectors").then(r => r.json()).then(setSectors).catch(() => {});
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) next.slug = toSlug(value);
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Vui lòng nhập tên dự án"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/du-an", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      router.push("/admin/du-an");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/du-an" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Thêm dự án mới</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">Điền đầy đủ thông tin bên dưới</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/du-an")} className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74]">Huỷ</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-60">
            <Save size={14} />{saving ? "Đang lưu..." : "Lưu dự án"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Meta bar — full width */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Lĩnh vực</label>
          <select name="sectorId" value={form.sectorId} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            <option value="">-- Chọn lĩnh vực --</option>
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
            <option value="PLANNING">Lên kế hoạch</option>
            <option value="IN_PROGRESS">Đang triển khai</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="ON_HOLD">Tạm dừng</option>
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Địa điểm</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Tỉnh/Thành phố..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Quy mô / Vốn đầu tư</label>
          <input name="scale" value={form.scale} onChange={handleChange} placeholder="VD: 500 tỷ đồng" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div className="flex-1 min-w-[110px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Năm bắt đầu</label>
          <input name="startYear" value={form.startYear} onChange={handleChange} type="number" placeholder="2024" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-[#6e6e74] mb-1.5">Ngày đăng</label>
          <input type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="accent-[#e82127] w-4 h-4" />
            <span className="text-sm text-[#111114] whitespace-nowrap">Nổi bật</span>
          </label>
        </div>
      </div>

      {/* Main content — full width */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Tên dự án *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Nhập tên dự án..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Slug URL</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#e82127]">
            <span className="px-3 py-3 text-sm text-[#6e6e74] bg-gray-50 border-r border-gray-200 whitespace-nowrap">/du-an/</span>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="ten-du-an" className="flex-1 px-3 py-3 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả ngắn</label>
          <textarea name="shortDesc" value={form.shortDesc} onChange={handleChange} rows={3} placeholder="Mô tả tóm tắt dự án..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Ảnh đại diện</label>
          <ImageUploader value={form.thumbnail} onChange={v => setForm(p => ({ ...p, thumbnail: v }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Grid ảnh dự án</label>
          <ImageGrid value={form.images} onChange={v => setForm(p => ({ ...p, images: v }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Nội dung chi tiết</label>
          <RichEditor content={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="Nội dung đầy đủ về dự án..." />
        </div>
      </div>
    </div>
  );
}
