"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, MapPin, Calendar, Download } from "lucide-react";
import QRCode from "qrcode";

type Props = {
  guest: { fullName: string; title: string | null; position: string | null; organization: string | null; publicToken: string };
  event: { name: string; slug: string; startTime: string | Date; locationName: string | null; mapUrl: string | null; hotline: string | null };
  rsvp: { attendanceStatus: string; companionCount: number };
};

export default function SuccessPage({ guest, event, rsvp }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTime = new Date(event.startTime);
  const isAttending = rsvp.attendanceStatus === "ATTENDING";

  const qrValue = typeof window !== "undefined"
    ? `${window.location.origin}/su-kien/${event.slug}/${guest.publicToken}/cam-on`
    : guest.publicToken;

  useEffect(() => {
    if (!isAttending || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, qrValue, {
      width: 220, margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
  }, [isAttending, qrValue]);

  function downloadQR() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `QR-${guest.publicToken}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <CheckCircle size={48} className="mx-auto text-[#e82127] mb-3" />
          <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">
            {isAttending ? "Đã xác nhận tham dự!" : "Đã ghi nhận phản hồi"}
          </h1>
          <p className="text-sm text-[#666]">
            {guest.title ? `${guest.title} ` : ""}<strong>{guest.fullName}</strong>
            {guest.position ? ` · ${guest.position}` : ""}
          </p>
          {guest.organization && <p className="text-sm text-[#888]">{guest.organization}</p>}
        </div>

        {/* Event info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold text-[#1a1a1a] text-sm mb-3 uppercase tracking-wider">{event.name}</p>
          <div className="space-y-2">
            <div className="flex gap-2 text-sm text-[#555]">
              <Calendar size={15} className="text-[#e82127] flex-shrink-0 mt-0.5" />
              <span>{startTime.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })} · {startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {event.locationName && (
              <div className="flex gap-2 text-sm text-[#555]">
                <MapPin size={15} className="text-[#e82127] flex-shrink-0 mt-0.5" />
                <span>{event.locationName}</span>
              </div>
            )}
          </div>
          {isAttending && rsvp.companionCount > 0 && (
            <p className="text-sm text-[#666] mt-3 bg-[#f5f5f5] rounded-lg px-3 py-2">
              Bao gồm <strong>{rsvp.companionCount}</strong> người đi cùng
            </p>
          )}
        </div>

        {/* QR Code */}
        {isAttending && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-sm font-semibold text-[#333] mb-1">Mã QR Check-in</p>
            <p className="text-xs text-[#999] mb-4">Xuất trình mã này tại lễ tân khi đến sự kiện</p>
            <div className="flex justify-center mb-4">
              <canvas ref={canvasRef} className="rounded-xl" />
            </div>
            <p className="text-xs text-[#bbb] mb-4 font-mono">{guest.publicToken}</p>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 mx-auto text-sm text-[#e82127] font-medium border border-[#e82127] rounded-xl px-4 py-2 hover:bg-[#e82127] hover:text-white transition-colors"
            >
              <Download size={14} /> Lưu mã QR
            </button>
          </div>
        )}

        {/* Map */}
        {event.mapUrl && isAttending && (
          <a href={event.mapUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white rounded-2xl p-4 shadow-sm text-[#e82127] font-medium text-sm"
          >
            <MapPin size={16} /> Xem bản đồ & chỉ đường
          </a>
        )}

        {/* Back */}
        <a href={`/su-kien/${event.slug}/${guest.publicToken}`}
          className="block text-center text-sm text-[#999] py-2"
        >
          ← Quay lại thư mời
        </a>

        <p className="text-center text-xs text-[#ccc] pb-4">© 2026 PSD Group</p>
      </div>
    </div>
  );
}
