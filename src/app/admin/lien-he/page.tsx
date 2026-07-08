"use client";

import { useState } from "react";
import { Search, Mail, Phone, CheckCircle, Clock, XCircle } from "lucide-react";

const mockLeads = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", phone: "0901234567", subject: "Hợp tác kinh doanh", message: "Tôi muốn tìm hiểu về cơ hội hợp tác phân phối vật liệu xây dựng tại khu vực miền Trung...", status: "new", date: "04/07/2024" },
  { id: 2, name: "Trần Thị Bình", email: "binh.tran@company.vn", phone: "0912345678", subject: "Đầu tư dự án", message: "Chúng tôi quan tâm đến dự án khu đô thị sinh thái Nam Đà Lạt và muốn tìm hiểu thêm...", status: "contacted", date: "03/07/2024" },
  { id: 3, name: "Lê Minh Cường", email: "cuong.le@email.com", phone: "0923456789", subject: "Tư vấn bất động sản", message: "Tôi cần tư vấn về các sản phẩm bất động sản của PSD Group tại Đắk Lắk...", status: "new", date: "02/07/2024" },
  { id: 4, name: "Phạm Thị Dung", email: "dung.pham@biz.vn", phone: "0934567890", subject: "Hợp tác nông nghiệp", message: "Công ty chúng tôi muốn thảo luận về khả năng cung cấp nguyên liệu nông sản cho nhà máy...", status: "resolved", date: "01/07/2024" },
  { id: 5, name: "Hoàng Văn Em", email: "em.hoang@gmail.com", phone: "0945678901", subject: "Tuyển dụng", message: "Tôi muốn hỏi thêm về vị trí Quản lý Dự án đang tuyển dụng...", status: "new", date: "30/06/2024" },
  { id: 6, name: "Vũ Thị Phương", email: "phuong.vu@corp.com", phone: "0956789012", subject: "Hỗ trợ kỹ thuật", message: "Cần hỗ trợ về thủ tục đăng ký mua căn hộ tại dự án PSD Plaza...", status: "contacted", date: "29/06/2024" },
];

const statusMap: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  new: { label: "Mới", cls: "bg-blue-100 text-blue-700", icon: Clock },
  contacted: { label: "Đã liên hệ", cls: "bg-yellow-100 text-yellow-700", icon: Phone },
  resolved: { label: "Đã xử lý", cls: "bg-green-100 text-green-700", icon: CheckCircle },
};

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof mockLeads)[0] | null>(null);

  const filtered = mockLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Liên hệ & Leads</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">
            {mockLeads.filter((l) => l.status === "new").length} liên hệ mới chưa xử lý
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e74]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên, email, chủ đề..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#e82127] bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Người gửi", "Chủ đề", "Trạng thái", "Ngày"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const S = statusMap[lead.status];
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`border-b border-gray-50 cursor-pointer last:border-0 transition-colors ${
                      selected?.id === lead.id ? "bg-red-50/40" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#111114] text-sm">{lead.name}</div>
                      <div className="text-xs text-[#6e6e74]">{lead.email}</div>
                    </td>
                    <td className="px-5 py-4 text-[#6e6e74] text-xs whitespace-nowrap">{lead.subject}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${S.cls}`}>{S.label}</span>
                    </td>
                    <td className="px-5 py-4 text-[#6e6e74] text-xs whitespace-nowrap">{lead.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 sticky top-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#111114]">{selected.name}</h3>
                  <p className="text-xs text-[#6e6e74] mt-0.5">{selected.date}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#6e6e74] hover:text-[#111114]">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#6e6e74]">
                  <Mail size={14} />
                  <a href={`mailto:${selected.email}`} className="hover:text-[#e82127]">{selected.email}</a>
                </div>
                <div className="flex items-center gap-2 text-[#6e6e74]">
                  <Phone size={14} />
                  <a href={`tel:${selected.phone}`} className="hover:text-[#e82127]">{selected.phone}</a>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#6e6e74] uppercase tracking-wide mb-1">Chủ đề</div>
                <div className="text-sm font-medium text-[#111114]">{selected.subject}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#6e6e74] uppercase tracking-wide mb-1">Nội dung</div>
                <p className="text-sm text-[#6e6e74] leading-relaxed bg-gray-50 rounded-xl p-3">{selected.message}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Mail size={14} />
                  Phản hồi
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-[#6e6e74] text-sm font-medium py-2.5 rounded-xl transition-colors">
                  <CheckCircle size={14} />
                  Đã xử lý
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-[#6e6e74] text-sm">
              <div className="text-3xl mb-3">📬</div>
              <p>Chọn một liên hệ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
