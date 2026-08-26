"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Clock, Briefcase, ChevronDown, X, SlidersHorizontal } from "lucide-react";

type Job = {
  slug: string;
  title: string;
  sector: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  deadline: string;
};

const jobs: Job[] = [];

const sectors = ["Tất cả lĩnh vực", "Bất động sản & Hạ tầng", "Sản xuất & Công nghiệp", "Khoáng sản", "Logistics & Cảng biển", "Marketing & Truyền thông", "Tài chính", "Công nghệ thông tin", "Nhân sự"];
const locations = ["Tất cả địa điểm", "Hà Nội", "Hải Phòng", "Hưng Yên", "Hà Nội / HCM"];
const levels = ["Tất cả cấp bậc", "Giám đốc", "Quản lý", "Chuyên viên", "Nhân viên", "Thực tập sinh"];
const types = ["Tất cả loại hình", "Toàn thời gian", "Bán thời gian", "Thực tập"];

const SECTOR_INITIALS: Record<string, string> = {
  "Bất động sản & Hạ tầng": "BĐS",
  "Sản xuất & Công nghiệp": "SX",
  "Khoáng sản": "KS",
  "Logistics & Cảng biển": "LOG",
  "Marketing & Truyền thông": "MKT",
  "Tài chính": "TC",
  "Công nghệ thông tin": "IT",
  "Nhân sự": "NS",
};

function FilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#424d54", display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ position: "relative" as const }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", padding: "10px 36px 10px 14px", fontSize: 13,
            border: "1px solid #e0e0e0", borderRadius: 4, background: "#fff",
            color: value.startsWith("Tất cả") ? "#aaa" : "#1a1a1a",
            appearance: "none" as const, cursor: "pointer", outline: "none",
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

export default function JobListings() {
  const [sector, setSector] = useState("Tất cả lĩnh vực");
  const [location, setLocation] = useState("Tất cả địa điểm");
  const [level, setLevel] = useState("Tất cả cấp bậc");
  const [type, setType] = useState("Tất cả loại hình");

  // pending filter state (apply on button click)
  const [pendingSector, setPendingSector] = useState("Tất cả lĩnh vực");
  const [pendingLocation, setPendingLocation] = useState("Tất cả địa điểm");
  const [pendingLevel, setPendingLevel] = useState("Tất cả cấp bậc");
  const [pendingType, setPendingType] = useState("Tất cả loại hình");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => jobs.filter(j => {
    if (!sector.startsWith("Tất cả") && j.sector !== sector) return false;
    if (!location.startsWith("Tất cả") && j.location !== location) return false;
    if (!level.startsWith("Tất cả") && j.level !== level) return false;
    if (!type.startsWith("Tất cả") && j.type !== type) return false;
    return true;
  }), [sector, location, level, type]);

  const applyFilters = () => {
    setSector(pendingSector);
    setLocation(pendingLocation);
    setLevel(pendingLevel);
    setType(pendingType);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setPendingSector("Tất cả lĩnh vực");
    setPendingLocation("Tất cả địa điểm");
    setPendingLevel("Tất cả cấp bậc");
    setPendingType("Tất cả loại hình");
    setSector("Tất cả lĩnh vực");
    setLocation("Tất cả địa điểm");
    setLevel("Tất cả cấp bậc");
    setType("Tất cả loại hình");
  };

  const filterPanel = (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
      <FilterSelect label="Lĩnh vực" options={sectors} value={pendingSector} onChange={setPendingSector} />
      <FilterSelect label="Địa điểm" options={locations} value={pendingLocation} onChange={setPendingLocation} />
      <FilterSelect label="Cấp bậc" options={levels} value={pendingLevel} onChange={setPendingLevel} />
      <FilterSelect label="Loại hình" options={types} value={pendingType} onChange={setPendingType} />
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button
          onClick={resetFilters}
          style={{
            flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
            border: "1px solid #d0d0d0", borderRadius: 4, background: "#f5f5f5",
            color: "#555", cursor: "pointer",
          }}
        >
          ✕ Hủy
        </button>
        <button
          onClick={applyFilters}
          style={{
            flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
            border: "1px solid #e82127", borderRadius: 4, background: "#e82127",
            color: "#fff", cursor: "pointer",
          }}
        >
          ✓ Áp dụng
        </button>
      </div>
    </div>
  );

  return (
    <section style={{ background: "#f4f4f5", padding: "48px 0 64px" }}>
      <div className="container-psd">

        {/* Mobile filter toggle */}
        <div className="sectors-mobile-nav" style={{ marginBottom: 16 }}>
          <button
            onClick={() => setMobileFilterOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", fontSize: 13, fontWeight: 600,
              border: "1px solid #e0e0e0", borderRadius: 4, background: "#fff",
              color: "#424d54", cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={15} />
            Bộ lọc
            <ChevronDown size={13} style={{ transform: mobileFilterOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
          {mobileFilterOpen && (
            <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: 20, marginTop: 8 }}>
              {filterPanel}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* Sidebar — desktop only */}
          <div className="sectors-desktop-nav" style={{ width: 260, flexShrink: 0, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 4, padding: 24 }}>
            {filterPanel}
          </div>

          {/* Job list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: "#6e6e74", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{filtered.length}</span> vị trí đang tuyển tại PSD Group
            </p>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {filtered.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 4, padding: "40px 24px", textAlign: "center" as const, color: "#aaa", fontSize: 14 }}>
                  {jobs.length === 0
                    ? "Hiện chưa có vị trí tuyển dụng nào. Vui lòng quay lại sau."
                    : "Không tìm thấy vị trí phù hợp. Vui lòng thay đổi bộ lọc."}
                </div>
              ) : filtered.map((job) => (
                <div key={job.slug} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 4, overflow: "hidden" }}>
                  {/* Title row */}
                  <div style={{ padding: "16px 20px 0" }}>
                    <Link
                      href={`/tuyen-dung/${job.slug}`}
                      style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", textDecoration: "none", lineHeight: 1.4, display: "block", marginBottom: 12 }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#e82127"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#1a1a1a"}
                    >
                      {job.title}
                    </Link>
                  </div>

                  {/* Info row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 16px", flexWrap: "wrap" as const }}>
                    {/* Logo placeholder */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 4, flexShrink: 0,
                      background: "#e82127", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.04em",
                    }}>
                      {SECTOR_INITIALS[job.sector] || "PSD"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>PSD Group</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px 18px" }}>
                        <span style={{ fontSize: 12, color: "#e82127", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          💰 Lương: {job.salary}
                        </span>
                        <span style={{ fontSize: 12, color: "#6e6e74", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} /> Địa điểm: {job.location}
                        </span>
                        <span style={{ fontSize: 12, color: "#6e6e74", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> Hạn nộp: {job.deadline}
                        </span>
                        <span style={{ fontSize: 12, color: "#6e6e74", display: "flex", alignItems: "center", gap: 4 }}>
                          <Briefcase size={11} /> {job.type}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/tuyen-dung/${job.slug}`}
                      style={{
                        flexShrink: 0, padding: "8px 18px", fontSize: 12, fontWeight: 700,
                        border: "1px solid #e82127", color: "#e82127", borderRadius: 3,
                        textDecoration: "none", whiteSpace: "nowrap" as const, transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#e82127"; el.style.color = "#fff"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#e82127"; }}
                    >
                      Ứng tuyển »
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
