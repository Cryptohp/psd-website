"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SuaLinhVucPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetch(`/api/sectors/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          order: data.order ?? 0,
          isActive: data.isActive ?? true,
        });
        setLoading(false);
      });
  }, [id]);

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/sectors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/he-sinh-thai");
    } else {
      const err = await res.json().catch(() => ({}));
      alert("Lỗi: " + (err.error ?? "Không thể lưu"));
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#6e6e74]">
        <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/he-sinh-thai" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6e6e74] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Chỉnh sửa lĩnh vực</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5 line-clamp-1">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#111114] mb-1.5">
            Tên lĩnh vực <span className="text-[#e82127]">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={e => set("name", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111114] mb-1.5">Mô tả</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={e => set("description", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] resize-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#111114] mb-1.5">Thứ tự</label>
            <input
              type="number"
              value={form.order}
              onChange={e => set("order", Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127]"
            />
          </div>
          <div className="flex items-end pb-0.5">
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

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Lưu thay đổi
          </button>
          <Link href="/admin/he-sinh-thai" className="text-sm text-[#6e6e74] hover:text-[#111114] transition-colors">
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}
