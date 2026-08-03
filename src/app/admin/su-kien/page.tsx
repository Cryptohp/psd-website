"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, ExternalLink, Edit } from "lucide-react";

type Event = {
  id: string; name: string; slug: string; eventCode: string;
  startTime: string; status: string; locationName: string | null;
  _count: { guests: number };
};

export default function AdminEventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/su-kien").then(r => r.json()).then(setEvents).finally(() => setLoading(false));
  }, []);

  const statusLabel: Record<string, string> = { DRAFT: "Nháp", PUBLISHED: "Đã xuất bản", CLOSED: "Đóng", COMPLETED: "Hoàn thành" };
  const statusColor: Record<string, string> = { DRAFT: "bg-gray-100 text-gray-600", PUBLISHED: "bg-green-100 text-green-700", CLOSED: "bg-yellow-100 text-yellow-700", COMPLETED: "bg-blue-100 text-blue-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#111114]">Sự kiện & Thư mời</h1>
          <p className="text-sm text-[#6e6e74] mt-0.5">Quản lý landing page và danh sách khách mời</p>
        </div>
        <Link href="/admin/su-kien/tao-moi"
          className="flex items-center gap-2 bg-[#e82127] hover:bg-[#c91c21] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Tạo sự kiện
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#aaa]">Đang tải...</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-12 text-center">
          <p className="text-[#aaa] mb-4">Chưa có sự kiện nào</p>
          <Link href="/admin/su-kien/tao-moi" className="text-[#e82127] font-medium text-sm">+ Tạo sự kiện đầu tiên</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-2xl border border-[#f0f0f0] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[ev.status]}`}>
                    {statusLabel[ev.status]}
                  </span>
                  <span className="text-xs text-[#aaa] font-mono">{ev.eventCode}</span>
                </div>
                <p className="font-semibold text-[#111114] truncate">{ev.name}</p>
                <div className="flex gap-4 mt-1 text-xs text-[#888]">
                  <span>{new Date(ev.startTime).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                  {ev.locationName && <span>{ev.locationName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-[#666]">
                  <Users size={15} /> <span>{ev._count.guests}</span>
                </div>
                <Link href={`/admin/su-kien/${ev.id}/khach`}
                  className="text-xs font-medium px-3 py-2 bg-[#f5f5f5] hover:bg-[#eee] rounded-lg transition-colors text-[#333]"
                >
                  Khách mời
                </Link>
                <Link href={`/admin/su-kien/${ev.id}`}
                  className="text-xs font-medium px-3 py-2 bg-[#f5f5f5] hover:bg-[#eee] rounded-lg transition-colors text-[#333]"
                >
                  <Edit size={13} />
                </Link>
                {ev.status === "PUBLISHED" && (
                  <a href={`/su-kien/${ev.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium px-3 py-2 bg-[#f5f5f5] hover:bg-[#eee] rounded-lg transition-colors text-[#e82127]"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
