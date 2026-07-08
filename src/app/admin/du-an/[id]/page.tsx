"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

const mockProjects: Record<string, { title: string; slug: string; sector: string; status: string; location: string; value: string; desc: string }> = {
  "1": { title: "Khu đô thị sinh thái Nam Đà Lạt", slug: "khu-do-thi-sinh-thai-nam-da-lat", sector: "Bất động sản", status: "in_progress", location: "Đà Lạt", value: "850 tỷ", desc: "Dự án khu đô thị sinh thái quy mô lớn tại phía Nam thành phố Đà Lạt." },
  "2": { title: "Nhà máy chế biến nông sản Tây Nguyên", slug: "nha-may-che-bien-nong-san-tay-nguyen", sector: "Nông nghiệp", status: "completed", location: "Đắk Lắk", value: "320 tỷ", desc: "Nhà máy chế biến nông sản công suất lớn phục vụ xuất khẩu." },
  "3": { title: "Tổ hợp thương mại dịch vụ PSD Plaza", slug: "to-hop-thuong-mai-psd-plaza", sector: "Thương mại", status: "in_progress", location: "Buôn Ma Thuột", value: "1.2 nghìn tỷ", desc: "Tổ hợp thương mại – dịch vụ – văn phòng hiện đại tại trung tâm thành phố." },
};

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = mockProjects[id] || mockProjects["1"];
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/admin/du-an");
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/du-an" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Chỉnh sửa dự án</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-200 text-red-500 bg-white rounded-xl hover:bg-red-50">
            <Trash2 size={14} />
            Xoá
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#e82127] hover:bg-[#c91c21] text-white rounded-xl transition-colors">
            <Save size={14} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Tên dự án *</label>
              <input defaultValue={project.title} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Slug URL</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#e82127]">
                <span className="px-3 py-3 text-sm text-[#6e6e74] bg-gray-50 border-r border-gray-200">/du-an/</span>
                <input defaultValue={project.slug} className="flex-1 px-3 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả ngắn</label>
              <textarea rows={3} defaultValue={project.desc} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Nội dung chi tiết</label>
              <textarea rows={10} placeholder="Nội dung đầy đủ về dự án..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-[#111114] text-sm mb-4">Chỉ số tác động</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Diện tích (ha)", value: "" },
                { label: "Tổng vốn đầu tư", value: project.value },
                { label: "Việc làm tạo ra", value: "" },
                { label: "Năm hoàn thành", value: "" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs text-[#6e6e74] mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} placeholder="Nhập giá trị..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-[#111114] text-sm">Phân loại</h3>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Lĩnh vực</label>
              <select defaultValue={project.sector} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
                {["Bất động sản", "Nông nghiệp", "Năng lượng", "Thương mại", "Du lịch", "Xây dựng", "Logistics"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Trạng thái</label>
              <select defaultValue={project.status} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
                <option value="planning">Lên kế hoạch</option>
                <option value="in_progress">Đang triển khai</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Địa điểm</label>
              <input defaultValue={project.location} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-[#111114] text-sm mb-3">Ảnh đại diện</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#e82127] transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🏗️</div>
              <p className="text-xs font-medium text-[#111114]">Thay ảnh</p>
              <p className="text-xs text-[#6e6e74] mt-0.5">PNG, JPG tối đa 2MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
