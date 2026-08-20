"use client";

import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Cài đặt</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">Thông tin và cấu hình website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Save size={14} />
          {saving ? "Đang lưu..." : saved ? "Đã lưu ✓" : "Lưu thay đổi"}
        </button>
      </div>

      {/* General */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-[#111114]">Thông tin chung</h2>
        {[
          { label: "Tên website", name: "siteName", value: "PSD Group", type: "text" },
          { label: "Mô tả ngắn (SEO)", name: "siteDesc", value: "Tập đoàn đa ngành – Phát triển bền vững", type: "text" },
          { label: "Email liên hệ", name: "contactEmail", value: "info@psdgroup.vn", type: "email" },
          { label: "Số điện thoại", name: "phone", value: "1900 xxxx", type: "text" },
          { label: "Địa chỉ", name: "address", value: "123 Nguyễn Tất Thành, Buôn Ma Thuột, Đắk Lắk", type: "text" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">{f.label}</label>
            <input
              type={f.type}
              defaultValue={f.value}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] focus:ring-1 focus:ring-[#e82127]"
            />
          </div>
        ))}
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-[#111114]">Mạng xã hội</h2>
        {[
          { label: "Facebook", name: "facebook", value: "https://facebook.com/psdgroup" },
          { label: "LinkedIn", name: "linkedin", value: "" },
          { label: "YouTube", name: "youtube", value: "" },
          { label: "Zalo OA", name: "zalo", value: "" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-[#111114] mb-1.5">{f.label}</label>
            <input
              type="url"
              defaultValue={f.value}
              placeholder={`https://...`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127] focus:ring-1 focus:ring-[#e82127]"
            />
          </div>
        ))}
      </div>

      {/* Admin account */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-[#111114]">Tài khoản Admin</h2>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Email admin</label>
          <input
            type="email"
            defaultValue="admin@psdgroup.vn"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Để trống nếu không đổi"
              className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e74] hover:text-[#111114]"
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111114] mb-1.5">Xác nhận mật khẩu</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e82127]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e74] hover:text-[#111114]"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
