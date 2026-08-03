"use client";

import { useState, useRef } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, Camera } from "lucide-react";

type CheckInResult = {
  status: "SUCCESS" | "ALREADY_CHECKED_IN" | "INVALID";
  message: string;
  guest?: {
    fullName: string; title: string | null; position: string | null;
    organization: string | null; rsvp: { companionCount: number } | null;
  };
};

export default function CheckInScanner({ event }: { event: { id: string; name: string; slug: string } }) {
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function doCheckIn(t: string) {
    if (!t.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "INVALID", message: "Lỗi kết nối" });
    } finally {
      setLoading(false);
      setToken("");
      inputRef.current?.focus();
    }
  }

  const statusColor = {
    SUCCESS: "bg-green-50 border-green-300",
    ALREADY_CHECKED_IN: "bg-yellow-50 border-yellow-300",
    INVALID: "bg-red-50 border-red-300",
  };
  const statusIcon = {
    SUCCESS: <CheckCircle size={28} className="text-green-500" />,
    ALREADY_CHECKED_IN: <AlertCircle size={28} className="text-yellow-500" />,
    INVALID: <XCircle size={28} className="text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Check-in</p>
          <h1 className="text-lg font-bold leading-tight">{event.name}</h1>
        </div>

        {/* Token input (auto-filled by QR scanner / keyboard) */}
        <div className="bg-white/5 rounded-2xl p-5 mb-4">
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Quét QR hoặc nhập mã</label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doCheckIn(token)}
              placeholder="Token khách..."
              autoFocus
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50"
            />
            <button
              onClick={() => doCheckIn(token)}
              disabled={loading || !token.trim()}
              className="bg-[#e82127] hover:bg-[#c91c21] disabled:opacity-40 px-5 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? "..." : "OK"}
            </button>
          </div>
          <p className="text-white/30 text-xs mt-2">Dùng máy quét QR → mã tự điền, nhấn Enter</p>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl border p-5 mb-4 ${statusColor[result.status]}`}>
            <div className="flex gap-3 items-start">
              {statusIcon[result.status]}
              <div className="flex-1">
                <p className="font-bold text-[#1a1a1a] text-[15px]">{result.message}</p>
                {result.guest && (
                  <div className="mt-2 text-[#333] text-sm space-y-0.5">
                    <p className="font-semibold">{result.guest.title ? `${result.guest.title} ` : ""}{result.guest.fullName}</p>
                    {result.guest.position && <p className="text-[#555]">{result.guest.position}</p>}
                    {result.guest.organization && <p className="text-[#666]">{result.guest.organization}</p>}
                    {result.guest.rsvp?.companionCount ? (
                      <p className="text-[#e82127] font-medium mt-1">+{result.guest.rsvp.companionCount} người đi cùng</p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual search */}
        <div className="bg-white/5 rounded-2xl p-5">
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Tìm theo tên / SĐT</label>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm khách..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50"
            />
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 rounded-xl transition-colors">
              <Search size={16} className="text-white/60" />
            </button>
          </div>
          {search.length >= 2 && <GuestSearch eventId={event.id} query={search} onSelect={t => doCheckIn(t)} />}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">PSD Group · {event.slug}</p>
      </div>
    </div>
  );
}

function GuestSearch({ eventId, query, onSelect }: { eventId: string; query: string; onSelect: (token: string) => void }) {
  const [guests, setGuests] = useState<{ id: string; fullName: string; position: string | null; publicToken: string; checkIn: { checkInStatus: string } | null }[]>([]);

  useState(() => {
    fetch(`/api/admin/su-kien/${eventId}/khach`)
      .then(r => r.json())
      .then((data: typeof guests) => setGuests(data));
  });

  const filtered = guests.filter(g =>
    g.fullName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  if (!filtered.length) return <p className="text-white/30 text-sm mt-2">Không tìm thấy</p>;

  return (
    <div className="mt-2 space-y-1">
      {filtered.map(g => (
        <button key={g.id} onClick={() => onSelect(g.publicToken)}
          className="w-full text-left bg-white/10 hover:bg-white/15 rounded-xl px-4 py-3 flex justify-between items-center transition-colors"
        >
          <div>
            <p className="text-sm font-medium text-white">{g.fullName}</p>
            {g.position && <p className="text-xs text-white/50">{g.position}</p>}
          </div>
          {g.checkIn?.checkInStatus === "CHECKED_IN" && (
            <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}
