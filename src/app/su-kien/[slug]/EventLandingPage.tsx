"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, Phone, Calendar, CheckCircle, XCircle, Users, Shirt, ChevronDown } from "lucide-react";

type Schedule = { id: string; startTime: string; endTime: string | null; title: string; description: string | null; itemType: string | null; sortOrder: number };
type PartnerLogo = { id?: string; name: string; logo: string };
type Question = {
  id: string;
  text: string;
  type: "single" | "multiple";
  required: boolean;
  showFor: "ALL" | "ATTENDING" | "DECLINED";
  options: string[];
};
type EventData = {
  id: string; slug: string; name: string; description: string | null;
  startTime: string | Date; checkInTime: string | Date | null; rsvpDeadline: string | Date | null;
  locationName: string | null; locationAddress: string | null; mapUrl: string | null;
  dressCode: string | null; hotline: string | null;
  coverImage: string | null; mobileCoverImage: string | null;
  settings: {
    heroTheme?: string;
    heroBgImage?: string;
    heroGuestFont?: string;
    heroTitleFont?: string;
    questions?: Question[];
    investorName?: string;
    investorLogo?: string;
    partnerLogos?: PartnerLogo[];
    projectImages?: string[];
  } | null;
  schedules: Schedule[];
};
type GuestData = {
  id: string; publicToken: string; fullName: string; title: string | null;
  position: string | null; organization: string | null; maxCompanions: number;
  rsvp: { attendanceStatus: string; companionCount: number } | null;
} | null;

/* ─── Countdown ────────────────────────────────────────────────────────────── */
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
  const expired = t.d === 0 && t.h === 0 && t.m === 0 && t.s === 0;

  if (expired) return (
    <p className="text-[#c9a84c]/80 text-sm tracking-widest uppercase">Sự kiện đang diễn ra</p>
  );

  return (
    <div className="flex gap-4 justify-center">
      {[{ v: t.d, l: "Ngày" }, { v: t.h, l: "Giờ" }, { v: t.m, l: "Phút" }, { v: t.s, l: "Giây" }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-black/30 border border-[#c9a84c]/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-white tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
                {pad(v)}
              </span>
            </div>
            <div className="absolute inset-0 rounded-lg border border-[#c9a84c]/20 scale-[1.04]" />
          </div>
          <p className="text-[#c9a84c]/70 text-[10px] mt-2 uppercase tracking-[0.2em]">{l}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── RSVP Form ────────────────────────────────────────────────────────────── */
function RSVPForm({ event, guest, onSuccess }: { event: EventData; guest: GuestData; onSuccess: (status: string) => void }) {
  const [status, setStatus] = useState(guest?.rsvp?.attendanceStatus ?? "");
  const [companions, setCompanions] = useState(guest?.rsvp?.companionCount ?? 0);
  const [name, setName] = useState(guest?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const questions: Question[] = (event.settings?.questions ?? []).filter(
    q => q.showFor === "ALL" || q.showFor === status || !status
  );

  function setAnswer(qId: string, value: string, type: "single" | "multiple") {
    if (type === "single") {
      setAnswers(a => ({ ...a, [qId]: value }));
    } else {
      setAnswers(a => {
        const prev = (a[qId] as string[]) ?? [];
        return {
          ...a,
          [qId]: prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
        };
      });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) { setError("Vui lòng chọn xác nhận tham dự"); return; }

    // Validate required questions
    const visibleQs = (event.settings?.questions ?? []).filter(
      q => q.showFor === "ALL" || q.showFor === status
    );
    for (const q of visibleQs) {
      if (q.required) {
        const ans = answers[q.id];
        if (!ans || (Array.isArray(ans) && ans.length === 0)) {
          setError(`Vui lòng trả lời: "${q.text}"`);
          return;
        }
      }
    }

    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/public/su-kien/${event.slug}/rsvp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestToken: guest?.publicToken, fullName: name, phone, attendanceStatus: status, companionCount: companions, note, answers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Lỗi khi gửi"); return; }
      onSuccess(status);
    } catch { setError("Lỗi kết nối. Vui lòng thử lại."); }
    finally { setLoading(false); }
  }

  const deadline = event.rsvpDeadline ? new Date(event.rsvpDeadline) : null;
  const isPast = deadline && new Date() > deadline;

  if (isPast) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <XCircle size={28} className="text-gray-400" />
      </div>
      <p className="font-semibold text-[#333]">Đã hết thời hạn xác nhận</p>
      <p className="text-sm text-[#888] mt-2">Vui lòng liên hệ Ban tổ chức<br />
        {event.hotline && <a href={`tel:${event.hotline}`} className="text-[#c9793c] font-medium">{event.hotline}</a>}
      </p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

      {!guest && (
        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">Họ và tên *</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9793c] transition-colors"
            placeholder="Nguyễn Văn A" />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">Xác nhận tham dự *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: "ATTENDING", label: "Tôi sẽ tham dự", sub: "Xác nhận có mặt", icon: CheckCircle },
            { v: "DECLINED", label: "Xin phép vắng mặt", sub: "Không thể tham dự", icon: XCircle },
          ].map(opt => {
            const Icon = opt.icon;
            const active = status === opt.v;
            const isAttend = opt.v === "ATTENDING";
            return (
              <button key={opt.v} type="button" onClick={() => setStatus(opt.v)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-medium transition-all ${
                  active
                    ? isAttend ? "border-[#c9793c] bg-[#c9793c] text-white shadow-lg shadow-[#c9793c]/20"
                      : "border-[#555] bg-[#555] text-white"
                    : "border-[#e8e8e8] text-[#666] hover:border-[#ccc] bg-white"
                }`}
              >
                <Icon size={22} />
                <span className="text-[13px] font-bold leading-tight text-center">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic questions */}
      {status && questions.length > 0 && questions
        .filter(q => q.showFor === "ALL" || q.showFor === status)
        .map(q => (
          <div key={q.id}>
            <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">
              {q.text}{q.required && <span className="text-[#c9793c] ml-1">*</span>}
            </label>
            {q.type === "single" ? (
              <div className="space-y-2">
                {q.options.map(opt => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button key={opt} type="button" onClick={() => setAnswer(q.id, opt, "single")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${
                        selected
                          ? "border-[#c9793c] bg-[#c9793c]/5 text-[#1a1a2e] font-medium"
                          : "border-[#e8e8e8] text-[#555] hover:border-[#ccc] bg-white"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        selected ? "border-[#c9793c]" : "border-[#ccc]"
                      }`}>
                        {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#c9793c]" />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {q.options.map(opt => {
                  const selected = ((answers[q.id] as string[]) ?? []).includes(opt);
                  return (
                    <button key={opt} type="button" onClick={() => setAnswer(q.id, opt, "multiple")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${
                        selected
                          ? "border-[#c9793c] bg-[#c9793c]/5 text-[#1a1a2e] font-medium"
                          : "border-[#e8e8e8] text-[#555] hover:border-[#ccc] bg-white"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                        selected ? "border-[#c9793c] bg-[#c9793c]" : "border-[#ccc]"
                      }`}>
                        {selected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
                <p className="text-xs text-[#aaa] pl-1">Có thể chọn nhiều</p>
              </div>
            )}
          </div>
        ))
      }

      {status === "ATTENDING" && guest && guest.maxCompanions > 0 && (
        <div>
          <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">
            <Users size={12} className="inline mr-1" />Số người đi cùng (tối đa {guest.maxCompanions})
          </label>
          <div className="relative">
            <select value={companions} onChange={e => setCompanions(Number(e.target.value))}
              className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9793c] appearance-none bg-white"
            >
              {Array.from({ length: guest.maxCompanions + 1 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? "Chỉ mình tôi" : `${i} người đi cùng`}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#666] uppercase tracking-wider mb-2">Ghi chú</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} maxLength={500}
          className="w-full border border-[#e0e0e0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9793c] transition-colors resize-none"
          placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..." />
      </div>

      <button type="submit" disabled={loading || !status}
        className="w-full bg-[#1a1a2e] hover:bg-[#111] disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-colors text-[15px] tracking-wide"
      >
        {loading ? "Đang gửi..." : "Gửi xác nhận"}
      </button>
    </form>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function EventLandingPage({ event, guest }: { event: EventData; guest: GuestData }) {
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState("");

  const startTime = new Date(event.startTime);
  const fmtDate = (d: Date) => d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  const fmtTime = (d: Date) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const guestName = guest ? `${guest.title ? guest.title + " " : ""}${guest.fullName}` : null;
  const alreadyRsvp = guest?.rsvp;

  function handleSuccess(status: string) {
    setRsvpDone(true);
    setRsvpStatus(status);
    if (status === "ATTENDING") {
      window.location.href = `/su-kien/${event.slug}/${guest?.publicToken}/cam-on`;
    }
  }

  const THEME_BG: Record<string, string> = {
    "dark-navy": "#0C1422", "dark-forest": "#0A1A12",
    "dark-wine": "#1A0A0E", "dark-slate": "#111318", "dark-earth": "#120D08",
  };
  const FONT_MAP: Record<string, string> = {
    "be-vietnam": "var(--font-be-vietnam), 'Be Vietnam Pro', sans-serif",
    "georgia": "Georgia, 'Times New Roman', serif",
    "playfair": "'Playfair Display', Georgia, serif",
    "times": "'Times New Roman', Times, serif",
    "garamond": "Garamond, 'Times New Roman', serif",
    "system": "system-ui, sans-serif",
    "arial": "Arial, Helvetica, sans-serif",
  };
  const heroBg = THEME_BG[event.settings?.heroTheme ?? "dark-navy"] ?? "#0C1422";
  const heroBgImage = event.settings?.heroBgImage;
  const guestFont = FONT_MAP[event.settings?.heroGuestFont ?? "be-vietnam"] ?? FONT_MAP["be-vietnam"];
  const titleFont = FONT_MAP[event.settings?.heroTitleFont ?? "be-vietnam"] ?? FONT_MAP["be-vietnam"];

  return (
    <div className="min-h-screen bg-[#f4f2ee]">

      {/* ── COVER IMAGE SCREEN (first screen) ── */}
      {event.coverImage && (
        <div className="relative w-full overflow-hidden flex flex-col items-center justify-end" style={{ minHeight: "100svh" }}>
          <Image src={event.coverImage} alt={event.name} fill className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative z-10 w-full flex flex-col items-center pb-16 px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/70" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
            </div>
            <a href="#hero-section"
              className="flex items-center gap-3 px-8 py-4 border border-[#c9a84c]/60 text-[#F5EFE2] text-sm font-semibold tracking-[0.15em] uppercase hover:bg-[#c9a84c]/10 transition-colors"
              style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.35)" }}
            >
              <span>Xem thư mời</span>
              <span className="text-[#c9a84c]">→</span>
            </a>
            <p className="text-white/30 text-[10px] mt-3 uppercase tracking-[0.2em]">Nhấn để tiếp tục</p>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div id="hero-section" />
      <div className="relative w-full overflow-hidden" style={{ minHeight: "100svh" }}>
        {/* Background */}
        {heroBgImage ? (
          <Image src={heroBgImage} alt={event.name} fill className="object-cover scale-105" priority unoptimized />
        ) : event.coverImage ? (
          <Image src={event.coverImage} alt={event.name} fill className="object-cover scale-105" priority unoptimized />
        ) : (
          <div className="absolute inset-0" style={{ background: heroBg }} />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Gold ornament lines */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20" style={{ minHeight: "100svh" }}>

          {/* Logo */}
          <img src="/logo-horizontal.webp" alt="PSD Group" className="h-7 object-contain mb-10 brightness-0 invert opacity-90" />

          {/* Gold divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] uppercase tracking-[0.35em] font-medium">Trân trọng kính mời</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>

          {/* Guest name */}
          {guestName && (
            <div className="mb-6">
              <h2 className="text-white text-2xl font-semibold tracking-wide" style={{ fontFamily: guestFont }}>{guestName}</h2>
              {guest?.position && <p className="text-white/60 text-sm mt-1">{guest.position}</p>}
              {guest?.organization && <p className="text-white/50 text-sm">{guest.organization}</p>}
            </div>
          )}

          {/* Event title */}
          <h1 className="text-white font-bold leading-[1.2] mb-3 uppercase"
            style={{ fontSize: "clamp(22px, 5.5vw, 36px)", letterSpacing: "0.04em", textShadow: "0 2px 20px rgba(0,0,0,0.5)", fontFamily: titleFont }}
          >
            {event.name}
          </h1>

          {/* Gold diamond divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/70" />
            <div className="w-2 h-2 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/70" />
          </div>

          {/* Date / Location */}
          <div className="mb-8 space-y-1">
            <p className="text-white/80 text-base font-medium tracking-wide">
              {fmtDate(startTime)}
            </p>
            <p className="text-[#c9a84c]/90 text-sm">
              {event.checkInTime ? `Đón khách: ${fmtTime(new Date(event.checkInTime))} · ` : ""}
              Bắt đầu: {fmtTime(startTime)}
            </p>
            {event.locationName && (
              <p className="text-white/50 text-sm">{event.locationName}</p>
            )}
          </div>

          {/* Countdown */}
          <Countdown target={startTime} />

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <div className="w-[1px] h-8 bg-white/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      {/* ── LOGO STRIP ── */}
      {(event.settings?.investorLogo || event.settings?.investorName || (event.settings?.partnerLogos?.length ?? 0) > 0) && (
        <div style={{ background: heroBg }}>
          <div className="mx-auto max-w-lg px-6 py-6 space-y-5">
            {/* Investor */}
            {(event.settings?.investorLogo || event.settings?.investorName) && (
              <div>
                <p className="text-[9px] text-[#C4913A]/50 uppercase tracking-[0.28em] font-medium text-center mb-3">Đơn vị chủ đầu tư</p>
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-3 border border-[#C4913A]/20 px-5 py-3 bg-white/[0.04]">
                    {event.settings.investorLogo && (
                      <img src={event.settings.investorLogo} alt={event.settings.investorName ?? "Chủ đầu tư"}
                        className="h-8 object-contain brightness-0 invert opacity-80"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    {event.settings.investorName && (
                      <span className="text-[#F5EFE2] font-medium text-sm tracking-wide">{event.settings.investorName}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Partners */}
            {(event.settings?.partnerLogos?.length ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-[#C4913A]/15" />
                  <p className="text-[9px] text-[#C4913A]/50 uppercase tracking-[0.28em] font-medium">Đơn vị đồng hành</p>
                  <div className="h-px flex-1 bg-[#C4913A]/15" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {event.settings!.partnerLogos!.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 border border-[#C4913A]/15 px-4 py-3 bg-white/[0.03] min-w-[80px]">
                      {p.logo ? (
                        <img src={p.logo} alt={p.name}
                          className="h-7 object-contain brightness-0 invert opacity-60"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="h-7 flex items-center">
                          <span className="text-[#C4913A]/50 text-xs font-medium">{p.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-[9px] text-[#F5EFE2]/40 tracking-wide text-center leading-tight">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="h-px bg-[#C4913A]/20 mx-0" />
        </div>
      )}

      {/* ── PROJECT IMAGES ── */}
      {(event.settings?.projectImages?.length ?? 0) > 0 && (
        <div className="bg-[#F4F2EE]">
          <div className="flex items-baseline justify-between px-4 pt-5 pb-2">
            <p className="text-[9px] text-[#9A7230] uppercase tracking-[0.28em] font-medium">Phối cảnh dự án</p>
            <span className="text-[11px] text-[#B09870]">{event.settings!.projectImages!.length} hình ảnh</span>
          </div>
          <div className="flex gap-3 px-4 pb-4 overflow-x-auto" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            {event.settings!.projectImages!.map((src, i) => (
              <div key={i} className="flex-shrink-0 rounded-sm overflow-hidden border border-[#E2D4B4]"
                style={{ width: i === 0 ? 260 : 200, height: i === 0 ? 165 : 130, scrollSnapAlign: "start" }}
              >
                <Image src={src} alt={`Phối cảnh ${i + 1}`} width={260} height={165}
                  className="w-full h-full object-cover"
                  unoptimized
                  onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-10 space-y-5">

        {/* Invitation card */}
        {guest && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8e4dc]">
            <div className="bg-[#1a1a2e] px-6 py-5">
              <p className="text-[#c9a84c] text-[10px] uppercase tracking-[0.3em] mb-2">Thư mời tham dự</p>
              <p className="text-white text-base leading-relaxed">
                Trân trọng kính mời <span className="font-bold text-[#c9a84c]">{guestName}</span>
                {guest.position ? `, ${guest.position}` : ""}
                {guest.organization ? ` — ${guest.organization}` : ""}
                {" "}tham dự <span className="font-semibold">{event.name}</span>.
              </p>
            </div>
          </div>
        )}

        {/* Event details */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] overflow-hidden">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9793c] mb-4">Thông tin sự kiện</h3>
            <div className="divide-y divide-[#f0ece4]">
              <div className="flex gap-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center flex-shrink-0">
                  <Calendar size={15} className="text-[#1a1a2e]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{fmtDate(startTime)}</p>
                  <p className="text-xs text-[#888] mt-0.5">
                    {event.checkInTime ? `Đón khách lúc ${fmtTime(new Date(event.checkInTime))} · ` : ""}
                    Bắt đầu {fmtTime(startTime)}
                  </p>
                </div>
              </div>

              {event.locationName && (
                <div className="flex gap-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-[#1a1a2e]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e]">{event.locationName}</p>
                    {event.locationAddress && <p className="text-xs text-[#888] mt-0.5">{event.locationAddress}</p>}
                  </div>
                </div>
              )}

              {event.dressCode && (
                <div className="flex gap-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center flex-shrink-0">
                    <Shirt size={15} className="text-[#1a1a2e]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">Trang phục</p>
                    <p className="text-sm font-semibold text-[#1a1a2e]">{event.dressCode}</p>
                  </div>
                </div>
              )}

              {event.hotline && (
                <div className="flex gap-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center flex-shrink-0">
                    <Phone size={15} className="text-[#1a1a2e]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">Hotline Ban tổ chức</p>
                    <a href={`tel:${event.hotline}`} className="text-sm font-bold text-[#c9793c]">{event.hotline}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.mapUrl && (
            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#f4f2ee] hover:bg-[#eceae4] border-t border-[#e8e4dc] px-6 py-4 text-[#1a1a2e] text-sm font-semibold transition-colors"
            >
              <MapPin size={15} className="text-[#c9793c]" /> Xem bản đồ & chỉ đường
            </a>
          )}
        </div>

        {/* Schedule / Timeline */}
        {event.schedules.length > 0 && (() => {
          const TYPE_META: Record<string, { emoji: string; color: string; bg: string }> = {
            general:   { emoji: "📋", color: "#C4913A", bg: "#FDF6EC" },
            ceremony:  { emoji: "🏛️", color: "#B8382B", bg: "#FEF2F2" },
            speech:    { emoji: "🎤", color: "#1D5FA8", bg: "#EFF6FF" },
            meal:      { emoji: "🍽️", color: "#2E7D52", bg: "#F0FDF4" },
            break:     { emoji: "☕", color: "#6B7280", bg: "#F9FAFB" },
            photo:     { emoji: "📸", color: "#7C3AED", bg: "#F5F3FF" },
            music:     { emoji: "🎵", color: "#BE185D", bg: "#FDF2F8" },
            transport: { emoji: "🚌", color: "#C2610C", bg: "#FFF7ED" },
          };
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9793c] mb-5">Chương trình</h3>
              <div className="relative pl-4">
                {/* vertical line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-[1.5px]"
                  style={{ background: "linear-gradient(to bottom, #c9a84c, #c9a84c44, transparent)" }} />

                <div className="space-y-3">
                  {event.schedules.map((s, i) => {
                    const meta = TYPE_META[s.itemType ?? "general"] ?? TYPE_META.general;
                    const isFirst = i === 0;
                    return (
                      <div key={s.id} className="relative flex gap-3">
                        {/* icon dot */}
                        <div className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center mt-0.5 text-[11px] z-10 border-2"
                          style={{
                            background: isFirst ? meta.color : meta.bg,
                            borderColor: meta.color,
                          }}
                        >
                          {isFirst ? (
                            <span style={{ filter: "brightness(10)" }}>{meta.emoji}</span>
                          ) : (
                            <span>{meta.emoji}</span>
                          )}
                        </div>

                        {/* content card */}
                        <div className="flex-1 min-w-0 rounded-xl border px-3 py-2.5 mb-0.5"
                          style={{ borderColor: meta.color + "30", background: meta.bg }}>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-[11px] font-bold tracking-wider" style={{ color: meta.color }}>
                              {s.startTime}{s.endTime ? ` — ${s.endTime}` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#1a1a2e] leading-snug">{s.title}</p>
                          {s.description && (
                            <p className="text-xs text-[#777] mt-1 leading-relaxed">{s.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Description */}
        {event.description && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9793c] mb-3">Giới thiệu dự án</h3>
            <p className="text-sm text-[#555] leading-[1.8] whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* RSVP */}
        {guest && !rsvpDone && (
          <div id="rsvp-section" className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9793c] mb-1">Xác nhận tham dự</h3>
            {alreadyRsvp ? (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-[#f9f7f3]">
                <CheckCircle size={15} className="text-[#c9793c]" />
                <p className="text-xs text-[#666]">
                  Bạn đã {alreadyRsvp.attendanceStatus === "ATTENDING" ? "xác nhận tham dự" : "từ chối"}.
                  Bạn có thể cập nhật lại bên dưới.
                </p>
              </div>
            ) : (
              event.rsvpDeadline && (
                <p className="text-xs text-[#c9793c] mb-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9793c] flex-shrink-0" />
                  Hạn chót:{" "}
                  {new Date(event.rsvpDeadline).toLocaleDateString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              )
            )}
            <RSVPForm event={event} guest={guest} onSuccess={handleSuccess} />
          </div>
        )}

        {/* Declined confirmation */}
        {rsvpDone && rsvpStatus === "DECLINED" && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#888]" />
            </div>
            <p className="font-bold text-[#333] text-base">Đã ghi nhận phản hồi</p>
            <p className="text-sm text-[#888] mt-2 leading-relaxed">
              Cảm ơn bạn đã thông báo.<br />Rất tiếc khi không được đón tiếp quý khách.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-4 pt-2">
          <img src="/logo-horizontal.webp" alt="PSD Group" className="h-5 object-contain mx-auto mb-3 opacity-30" />
          <p className="text-xs text-[#bbb]">© 2026 PSD Group</p>
          {event.hotline && (
            <a href={`tel:${event.hotline}`} className="text-xs text-[#bbb] underline mt-0.5 block">{event.hotline}</a>
          )}
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      {guest && !rsvpDone && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-bottom pt-3 pb-4"
          style={{ background: "linear-gradient(to top, rgba(244,242,238,1) 70%, rgba(244,242,238,0))" }}
        >
          <button
            onClick={() => document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold py-4 rounded-2xl text-[15px] transition-colors shadow-xl shadow-[#1a1a2e]/30 tracking-wide"
          >
            {alreadyRsvp ? "Cập nhật xác nhận" : "Xác nhận tham dự"}
          </button>
        </div>
      )}
    </div>
  );
}
