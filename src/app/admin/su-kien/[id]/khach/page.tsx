"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Upload, Download, Copy, CheckCircle, XCircle, Clock, Users } from "lucide-react";

type Guest = {
  id: string; guestCode: string; fullName: string; title: string | null;
  position: string | null; organization: string | null; phone: string | null;
  publicToken: string;
  rsvp: { attendanceStatus: string; companionCount: number; answers: Record<string, string | string[]> | null } | null;
  checkIn: { checkInStatus: string } | null;
};
type EventMeta = { id: string; name: string; slug: string; status: string };

const STATUS_LABEL: Record<string, string> = { ATTENDING: "Tham dự", DECLINED: "Từ chối", PENDING: "Chưa rõ" };
const STATUS_COLOR: Record<string, string> = {
  ATTENDING: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

export default function GuestListPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventMeta | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/su-kien/${id}`).then(r => r.json()),
      fetch(`/api/admin/su-kien/${id}/khach`).then(r => r.json()),
    ]).then(([ev, gs]) => { setEvent(ev); setGuests(gs); }).finally(() => setLoading(false));
  }, [id]);

  function copyLink(token: string) {
    if (!event) return;
    navigator.clipboard.writeText(`${siteUrl}/su-kien/${event.slug}/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(""), 2000);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    setImportResult(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/su-kien/${id}/khach/import`, { method: "POST", body: fd });
    const data = await res.json();
    setImportResult(data);
    setImportLoading(false);
    if (data.success > 0) {
      fetch(`/api/admin/su-kien/${id}/khach`).then(r => r.json()).then(setGuests);
    }
    e.target.value = "";
  }

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvp?.attendanceStatus === "ATTENDING").length,
    declined: guests.filter(g => g.rsvp?.attendanceStatus === "DECLINED").length,
    noReply: guests.filter(g => !g.rsvp).length,
    checkedIn: guests.filter(g => g.checkIn?.checkInStatus === "CHECKED_IN").length,
  };

  if (loading) return <div className="text-center py-12 text-[#aaa]">Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/su-kien" className="text-[#6e6e74] hover:text-[#111]"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-[#111114]">Khách mời</h1>
          {event && <p className="text-sm text-[#6e6e74]">{event.name}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5 mt-4">
        {[
          { label: "Tổng", value: stats.total, icon: <Users size={14} /> },
          { label: "Tham dự", value: stats.attending, color: "text-green-600" },
          { label: "Từ chối", value: stats.declined, color: "text-red-500" },
          { label: "Chưa phản hồi", value: stats.noReply, color: "text-yellow-600" },
          { label: "Đã check-in", value: stats.checkedIn, color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#f0f0f0] p-3 text-center">
            <p className={`text-2xl font-bold ${s.color ?? "text-[#111]"}`}>{s.value}</p>
            <p className="text-xs text-[#888] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setShowAddForm(v => !v)}
          className="flex items-center gap-1.5 text-sm font-medium bg-[#e82127] text-white px-4 py-2 rounded-xl hover:bg-[#c91c21] transition-colors"
        >
          <Plus size={15} /> Thêm khách
        </button>
        <button onClick={() => fileRef.current?.click()} disabled={importLoading}
          className="flex items-center gap-1.5 text-sm font-medium bg-white border border-[#ddd] px-4 py-2 rounded-xl hover:bg-[#f5f5f5] transition-colors text-[#333]"
        >
          <Upload size={15} /> {importLoading ? "Đang import..." : "Import Excel"}
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
        <a href={`/api/admin/su-kien/${id}/khach/export`}
          className="flex items-center gap-1.5 text-sm font-medium bg-white border border-[#ddd] px-4 py-2 rounded-xl hover:bg-[#f5f5f5] transition-colors text-[#333]"
        >
          <Download size={15} /> Xuất Excel
        </a>
        {event && (
          <a href={`/check-in/${event.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium bg-white border border-[#ddd] px-4 py-2 rounded-xl hover:bg-[#f5f5f5] transition-colors text-[#333]"
          >
            Trang Check-in ↗
          </a>
        )}
      </div>

      {/* Import result */}
      {importResult && (
        <div className="mb-4 bg-white rounded-xl border border-[#f0f0f0] p-4 text-sm">
          <p className="font-semibold text-green-700">✓ Import thành công: {importResult.success} khách</p>
          {importResult.errors.length > 0 && (
            <div className="mt-2 text-red-600 space-y-0.5">
              {importResult.errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Add form */}
      {showAddForm && event && (
        <AddGuestForm eventId={id} onAdded={g => { setGuests(gs => [...gs, g]); setShowAddForm(false); }} />
      )}

      {/* Guest table */}
      <div className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden">
        {guests.length === 0 ? (
          <div className="text-center py-12 text-[#aaa] text-sm">Chưa có khách mời nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase">Mã</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase">Họ tên</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase hidden sm:table-cell">Đơn vị</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase">RSVP</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase hidden lg:table-cell">Phản hồi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888] uppercase hidden md:table-cell">Check-in</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {guests.map(g => (
                  <tr key={g.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#888]">{g.guestCode}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#111]">{g.title ? `${g.title} ` : ""}{g.fullName}</p>
                      {g.position && <p className="text-xs text-[#888]">{g.position}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#666] hidden sm:table-cell">{g.organization ?? "—"}</td>
                    <td className="px-4 py-3">
                      {g.rsvp ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[g.rsvp.attendanceStatus]}`}>
                          {STATUS_LABEL[g.rsvp.attendanceStatus]}
                          {g.rsvp.companionCount > 0 ? ` +${g.rsvp.companionCount}` : ""}
                        </span>
                      ) : (
                        <span className="text-xs text-[#bbb]">Chưa phản hồi</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {g.rsvp?.answers && Object.keys(g.rsvp.answers).length > 0 ? (
                        <div className="group relative">
                          <span className="text-xs text-[#c9793c] font-medium cursor-pointer underline decoration-dotted">
                            {Object.keys(g.rsvp.answers).length} câu
                          </span>
                          <div className="absolute left-0 top-6 z-20 hidden group-hover:block bg-[#1a1a2e] text-white text-xs rounded-xl p-3 w-64 shadow-xl space-y-2">
                            {Object.entries(g.rsvp.answers).map(([k, v]) => (
                              <div key={k}>
                                <p className="text-white/50 text-[10px] mb-0.5">Câu hỏi #{k}</p>
                                <p>{Array.isArray(v) ? v.join(", ") : v}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-[#ccc]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {g.checkIn?.checkInStatus === "CHECKED_IN"
                        ? <CheckCircle size={16} className="text-green-500" />
                        : <Clock size={16} className="text-[#ccc]" />}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => copyLink(g.publicToken)}
                        className="flex items-center gap-1 text-xs text-[#e82127] hover:text-[#c91c21] font-medium"
                        title="Sao chép link thư mời"
                      >
                        {copied === g.publicToken ? <CheckCircle size={13} /> : <Copy size={13} />}
                        {copied === g.publicToken ? "Đã copy" : "Link"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AddGuestForm({ eventId, onAdded }: { eventId: string; onAdded: (g: Guest) => void }) {
  const [form, setForm] = useState({ fullName: "", title: "", position: "", organization: "", phone: "", guestGroup: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/su-kien/${eventId}/khach`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Lỗi"); setLoading(false); return; }
    onAdded(data);
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e82127]/30 p-5 mb-4">
      <h3 className="text-sm font-semibold text-[#333] mb-4">Thêm khách mới</h3>
      {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {[
          { k: "fullName", label: "Họ và tên *", required: true },
          { k: "title", label: "Danh hiệu (Ông/Bà/...)" },
          { k: "position", label: "Chức vụ" },
          { k: "organization", label: "Đơn vị" },
          { k: "phone", label: "Điện thoại" },
          { k: "guestGroup", label: "Nhóm khách" },
        ].map(f => (
          <div key={f.k}>
            <label className="block text-xs font-medium text-[#666] mb-1">{f.label}</label>
            <input
              value={(form as Record<string, string>)[f.k]}
              onChange={e => set(f.k, e.target.value)}
              required={f.required}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e82127]"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="bg-[#e82127] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Thêm khách"}
        </button>
      </div>
    </form>
  );
}
