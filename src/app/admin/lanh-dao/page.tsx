"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

const initialLeaders = [
  { id: 1, name: "Nguyễn Minh Khoa", title: "Chủ tịch HĐQT kiêm Tổng Giám đốc", order: 1, visible: true },
  { id: 2, name: "Trần Thị Thu Hương", title: "Phó Tổng Giám đốc Tài chính", order: 2, visible: true },
  { id: 3, name: "Lê Văn Đức", title: "Phó Tổng Giám đốc Vận hành", order: 3, visible: true },
  { id: 4, name: "Phạm Quốc Bảo", title: "Giám đốc Phát triển Kinh doanh", order: 4, visible: false },
];

export default function AdminLeadersPage() {
  const [leaders, setLeaders] = useState(initialLeaders);

  function toggleVisible(id: number) {
    setLeaders((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111114]">Ban lãnh đạo</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">{leaders.length} thành viên · {leaders.filter((l) => l.visible).length} đang hiển thị</p>
        </div>
        <button className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Thêm thành viên
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 grid grid-cols-12 gap-4">
          <div className="col-span-1" />
          <div className="col-span-1 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">STT</div>
          <div className="col-span-4 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Họ tên</div>
          <div className="col-span-3 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Chức danh</div>
          <div className="col-span-2 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide">Hiển thị</div>
          <div className="col-span-1 text-xs font-semibold text-[#6e6e74] uppercase tracking-wide text-right">Hành động</div>
        </div>
        {leaders.map((l) => (
          <div key={l.id} className={`px-5 py-4 border-b border-gray-50 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors ${!l.visible ? "opacity-50" : ""}`}>
            <div className="col-span-1 text-[#6e6e74] cursor-grab">
              <GripVertical size={16} />
            </div>
            <div className="col-span-1 text-sm font-bold text-[#e82127]">{l.order}</div>
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-[#6e6e74] flex-shrink-0">
                  {l.name.charAt(0)}
                </div>
                <span className="font-medium text-[#111114] text-sm">{l.name}</span>
              </div>
            </div>
            <div className="col-span-3 text-sm text-[#6e6e74]">{l.title}</div>
            <div className="col-span-2">
              <button
                onClick={() => toggleVisible(l.id)}
                title={l.visible ? "Đang hiện — nhấn để ẩn" : "Đang ẩn — nhấn để hiện"}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                  l.visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {l.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                {l.visible ? "Hiện" : "Ẩn"}
              </button>
            </div>
            <div className="col-span-1 flex items-center gap-1 justify-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-[#6e6e74] hover:text-blue-600 transition-colors">
                <Pencil size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#6e6e74] hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
