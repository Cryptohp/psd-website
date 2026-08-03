"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, Clock, Phone, Calendar, ChevronDown, CheckCircle, XCircle, Users } from "lucide-react";

type Schedule = { id: string; startTime: string; endTime: string | null; title: string; description: string | null; sortOrder: number };
type EventData = {
  id: string; slug: string; name: string; description: string | null;
  startTime: string | Date; checkInTime: string | Date | null; rsvpDeadline: string | Date | null;
  locationName: string | null; locationAddress: string | null; mapUrl: string | null;
  dressCode: string | null; hotline: string | null;
  coverImage: string | null; mobileCoverImage: string | null;
  schedules: Schedule[];
};
type GuestData = {
  id: string; publicToken: string; fullName: string; title: string | null;
  position: string | null; organization: string | null; maxCompanions: number;
  rsvp: { attendanceStatus: string; companionCount: number } | null;
} | null;

function Countdown({ target }: { target: Date }) {
  const calc = useCallback(() => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);

  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  const pad = (n: number) => String(n).padStart(2, "0");
  if (t.d === 0 && t.h === 0 && t.m === 0 && t.s === 0)
    return <p className="text-white/70 text-sm">Sự kiện đã bắt đầu</p>;

  return (
    <div className="flex gap-3 justify-center">
      {[{ v: t.d, l: "Ngày" }, { v: t.h, l: "Giờ" }, { v: t.m, l: "Phút" }, { v: t.s, l: "Giây" }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-2 min-w-[52px]">
            <span className="text-2xl font-bold text-white tabular-nums">{pad(v)}</span>
          </div>
          <p className="text-white/60 text-[10px] mt-1 uppercase tracking-wider">{l}</p>
        </div>
      ))}
    </div>
  );
}

function RSVPForm({ event, guest, onSuccess }: { event: EventData; guest: GuestData; onSuccess: (status: string) => void }) {
  const [status, setStatus] = useState(guest?.rsvp?.attendanceStatus ?? "");
  const [companions, setCompanions] = useState(guest?.rsvp?.companionCount ?? 0);
  const [name, setName] = useState(guest?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) { setError("Vui lòng chọn xác nhận tham dự"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/public/su-kien/${event.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestToken: guest?.publicToken,
          fullName: name,
          phone,
          attendanceStatus: status,
          companionCount: companions,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Lỗi khi gửi"); return; }
      onSuccess(status);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  const deadline = event.rsvpDeadline ? new Date(event.rsvpDeadline) : null;
  const isPast = deadline && new Date() > deadline;

  if (isPast) return (
    <div className="text-center py-6 text-[#888]">
      <XCircle size={36} className="mx-auto mb-3 text-[#ccc]" />
      <p className="font-medium">Đã hết thời hạn xác nhận</p>
      <p className="text-sm mt-1">Vui lòng liên hệ Ban tổ chức: {event.hotline}</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>}

      {!guest && (
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1">Họ và tên *</label>
          <input
            value={name} onChange={e => setName(e.target.value)} required
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127]"
            placeholder="Nguyễn Văn A"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#333] mb-2">Xác nhận tham dự *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: "ATTENDING", label: "Tôi sẽ tham dự", icon: <CheckCircle size={18} /> },
            { v: "DECLINED", label: "Tôi không thể tham dự", icon: <XCircle size={18} /> },
          ].map(opt => (
            <button
              key={opt.v} type="button"
              onClick={() => setStatus(opt.v)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                status === opt.v
                  ? opt.v === "ATTENDING" ? "border-[#e82127] bg-[#e82127] text-white" : "border-[#666] bg-[#666] text-white"
                  : "border-[#e0e0e0] text-[#666] hover:border-[#bbb]"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {status === "ATTENDING" && guest && guest.maxCompanions > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1">
            <Users size={14} className="inline mr-1" />
            Số người đi cùng (tối đa {guest.maxCompanions})
          </label>
          <select
            value={companions} onChange={e => setCompanions(Number(e.target.value))}
            className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127]"
          >
            {Array.from({ length: guest.maxCompanions + 1 }, (_, i) => (
              <option key={i} value={i}>{i} người</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#333] mb-1">Ghi chú (không bắt buộc)</label>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          rows={2} maxLength={500}
          className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e82127] resize-none"
          placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
        />
      </div>

      <button
        type="submit" disabled={loading || !status}
        className="w-full bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors text-[15px]"
      >
        {loading ? "Đang gửi..." : "Xác nhận"}
      </button>
    </form>
  );
}

export default function EventLandingPage({ event, guest }: { event: EventData; guest: GuestData }) {
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [showRsvp, setShowRsvp] = useState(false);

  const startTime = new Date(event.startTime);
  const fmt = (d: Date) => d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const fmtTime = (d: Date) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const alreadyRsvp = guest?.rsvp;
  const guestName = guest ? `${guest.title ? guest.title + " " : ""}${guest.fullName}` : null;

  function handleSuccess(status: string) {
    setRsvpDone(true);
    setRsvpStatus(status);
    setShowRsvp(false);
    if (status === "ATTENDING") {
      window.location.href = `/su-kien/${event.slug}/${guest?.publicToken}/cam-on`;
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero */}
      <div className="relative w-full" style={{ minHeight: 420 }}>
        {event.coverImage ? (
          <Image src={event.coverImage} alt={event.name} fill className="object-cover" priority unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#8c0c12] to-[#1a1a2e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 py-16" style={{ minHeight: 420 }}>
          <img src="/logo-horizontal.webp" alt="PSD Group" className="h-8 object-contain mb-6 brightness-0 invert" />
          <div className="inline-block border border-white/30 rounded-full px-4 py-1 text-white/70 text-xs uppercase tracking-widest mb-4">
            Trân trọng kính mời
          </div>
          {guestName && (
            <h2 className="text-white text-xl font-semibold mb-2">{guestName}</h2>
          )}
          {guest?.position && <p className="text-white/70 text-sm mb-1">{guest.position}</p>}
          {guest?.organization && <p className="text-white/60 text-sm mb-4">{guest.organization}</p>}
          <h1 className="text-white font-bold leading-tight mb-2 uppercase tracking-wide" style={{ fontSize: "clamp(20px, 5vw, 32px)" }}>
            {event.name}
          </h1>
          <div className="w-12 h-[2px] bg-[#e82127] my-4" />
          <div className="flex flex-col gap-1 text-white/80 text-sm mb-6">
            <span>{fmt(startTime)} · {fmtTime(startTime)}</span>
            {event.locationName && <span>{event.locationName}</span>}
          </div>
          <Countdown target={startTime} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Thông tin sự kiện */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-4 uppercase tracking-wider">Thông tin sự kiện</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Calendar size={18} className="text-[#e82127] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#333]">{fmt(startTime)}</p>
                <p className="text-sm text-[#666]">
                  {event.checkInTime ? `Đón khách: ${fmtTime(new Date(event.checkInTime))} · ` : ""}
                  Bắt đầu: {fmtTime(startTime)}
                </p>
              </div>
            </div>
            {event.locationName && (
              <div className="flex gap-3">
                <MapPin size={18} className="text-[#e82127] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#333]">{event.locationName}</p>
                  {event.locationAddress && <p className="text-sm text-[#666]">{event.locationAddress}</p>}
                </div>
              </div>
            )}
            {event.dressCode && (
              <div className="flex gap-3">
                <Clock size={18} className="text-[#e82127] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#666]">Trang phục: {event.dressCode}</p>
              </div>
            )}
            {event.hotline && (
              <div className="flex gap-3">
                <Phone size={18} className="text-[#e82127] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#666]">Hotline BTC: <a href={`tel:${event.hotline}`} className="text-[#e82127] font-medium">{event.hotline}</a></p>
              </div>
            )}
          </div>
          {event.mapUrl && (
            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-[#e82127] text-sm font-medium"
            >
              <MapPin size={14} /> Xem bản đồ & chỉ đường
            </a>
          )}
        </div>

        {/* Chương trình */}
        {event.schedules.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-4 uppercase tracking-wider">Chương trình</h3>
            <div className="space-y-4">
              {event.schedules.map((s, i) => (
                <div key={s.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e82127] flex-shrink-0 mt-1" />
                    {i < event.schedules.length - 1 && <div className="w-px flex-1 bg-[#e8e8e8] mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-[#e82127] font-semibold mb-0.5">
                      {s.startTime}{s.endTime ? ` – ${s.endTime}` : ""}
                    </p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{s.title}</p>
                    {s.description && <p className="text-sm text-[#666] mt-0.5">{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mô tả sự kiện */}
        {event.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-3 uppercase tracking-wider">Giới thiệu</h3>
            <p className="text-sm text-[#555] leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* RSVP */}
        {guest && !rsvpDone && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-1 uppercase tracking-wider">Xác nhận tham dự</h3>
            {alreadyRsvp && (
              <p className="text-sm text-[#888] mb-4">
                Bạn đã {alreadyRsvp.attendanceStatus === "ATTENDING" ? "xác nhận tham dự" : "từ chối"}.
                Bạn có thể cập nhật lại bên dưới.
              </p>
            )}
            {event.rsvpDeadline && (
              <p className="text-xs text-[#e82127] mb-4">
                Hạn chót xác nhận: {new Date(event.rsvpDeadline).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <RSVPForm event={event} guest={guest} onSuccess={handleSuccess} />
          </div>
        )}

        {rsvpDone && rsvpStatus === "DECLINED" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <XCircle size={40} className="mx-auto text-[#999] mb-3" />
            <p className="font-semibold text-[#333]">Đã ghi nhận phản hồi của bạn</p>
            <p className="text-sm text-[#888] mt-1">Cảm ơn bạn đã thông báo. Hẹn gặp lại ở sự kiện khác!</p>
          </div>
        )}

        <p className="text-center text-xs text-[#bbb] pb-6">© 2026 PSD Group · {event.hotline && <a href={`tel:${event.hotline}`} className="underline">{event.hotline}</a>}</p>
      </div>

      {/* Sticky CTA */}
      {guest && !rsvpDone && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-[#eee] shadow-lg">
          <button
            onClick={() => {
              setShowRsvp(true);
              document.querySelector("#rsvp-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full max-w-sm mx-auto block bg-[#e82127] hover:bg-[#c91c21] text-white font-bold py-4 rounded-xl text-[15px] transition-colors"
          >
            {alreadyRsvp ? "Cập nhật xác nhận" : "Xác nhận tham dự"}
          </button>
        </div>
      )}
    </div>
  );
}
