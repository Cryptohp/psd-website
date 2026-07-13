"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import RichEditor from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewLeaderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", title: "", bio: "", avatar: "", order: "0", visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Vui lòng nhập họ tên"); return; }
    if (!form.title.trim()) { setError("Vui lòng nhập chức danh"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/lanh-dao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      router.push("/admin/lanh-dao");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/lanh-dao" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Thêm thành viên</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">Ban lãnh đạo PSD Group</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/lanh-dao")} className="px-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl hover:bg-gray-50 text-[#6e6e74]">Huỷ</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors disabled:opacity-60">
            <Save size={14} />{saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Họ và tên *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Chức danh *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Chủ tịch HĐQT kiêm Tổng Giám đốc" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Tiểu sử</label>
              <RichEditor content={form.bio} onChange={v => setForm(p => ({ ...p, bio: v }))} placeholder="Giới thiệu về thành viên..." />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-[#111114] text-sm">Cài đặt</h3>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Thứ tự hiển thị</label>
              <input name="order" value={form.order} onChange={handleChange} type="number" min="0" placeholder="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))} className="accent-[#e82127]" />
              <span className="text-sm text-[#111114]">Hiển thị công khai</span>
            </label>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-[#111114] text-sm mb-3">Ảnh đại diện</h3>
            <ImageUploader value={form.avatar} onChange={v => setForm(p => ({ ...p, avatar: v }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
