"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

const mockJobs: Record<string, { title: string; dept: string; type: string; location: string; status: string; deadline: string; salary: string }> = {
  "1": { title: "Giám đốc Tài chính (CFO)", dept: "Tài chính", type: "Toàn thời gian", location: "Đắk Lắk", status: "open", deadline: "2024-08-31", salary: "Thoả thuận" },
  "2": { title: "Kế toán trưởng", dept: "Tài chính", type: "Toàn thời gian", location: "Đắk Lắk", status: "open", deadline: "2024-08-31", salary: "20 - 30 triệu" },
  "3": { title: "Quản lý Dự án Bất động sản", dept: "Bất động sản", type: "Toàn thời gian", location: "Đà Lạt", status: "open", deadline: "2024-08-15", salary: "25 - 40 triệu" },
};

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const job = mockJobs[id] || mockJobs["1"];
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/admin/tuyen-dung");
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/tuyen-dung" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-gray-200 text-[#6e6e74]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Chỉnh sửa vị trí tuyển dụng</h1>
            <p className="text-xs text-[#6e6e74] mt-0.5">ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-200 text-red-500 bg-white rounded-xl hover:bg-red-50">
            <Trash2 size={14} /> Xoá
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
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Tên vị trí *</label>
              <input defaultValue={job.title} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Mô tả công việc *</label>
              <textarea rows={6} placeholder="Mô tả chi tiết công việc, trách nhiệm..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Yêu cầu ứng viên</label>
              <textarea rows={6} placeholder="Kinh nghiệm, bằng cấp, kỹ năng yêu cầu..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111114] mb-1.5">Quyền lợi</label>
              <textarea rows={4} placeholder="Lương thưởng, bảo hiểm, phúc lợi..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] resize-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-semibold text-[#111114] text-sm">Thông tin vị trí</h3>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Phòng ban</label>
              <select defaultValue={job.dept} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
                {["Tài chính", "Bất động sản", "Marketing", "Nông nghiệp", "Công nghệ", "Nhân sự", "Vận hành"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Loại hình</label>
              <select defaultValue={job.type} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
                <option>Toàn thời gian</option>
                <option>Bán thời gian</option>
                <option>Thực tập</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Địa điểm</label>
              <input defaultValue={job.location} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Mức lương</label>
              <input defaultValue={job.salary} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Hạn nộp hồ sơ</label>
              <input type="date" defaultValue={job.deadline} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]" />
            </div>
            <div>
              <label className="block text-xs text-[#6e6e74] mb-1.5">Trạng thái</label>
              <select defaultValue={job.status} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] bg-white">
                <option value="open">Đang mở</option>
                <option value="closed">Đóng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
