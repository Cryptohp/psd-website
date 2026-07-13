"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

type Project = { id: string; title: string; slug: string; thumbnail: string | null; sector: string; shortDesc: string | null };
type Sector = { id: string; name: string; slug: string };

const SECTOR_HERO: Record<string, string> = {
  "Bất động sản & Hạ tầng": "/linh-vuc-bat-dong-san.png",
  "Sản xuất & Công nghiệp": "/linh-vuc-san-xuat-cong-nghiep.png",
  "Khoáng sản": "/linh-vuc-khoang-san.png",
  "Logistics & Cảng biển": "/linh-vuc-logistics.png",
  "Nông nghiệp & Thủy sản": "/linh-vuc-nong-nghiep.png",
  "Du lịch & Nghỉ dưỡng": "/linh-vuc-du-lich.png",
  "Đầu tư & Dịch vụ": "/linh-vuc-dau-tu-dich-vu.png",
  "Trách nhiệm xã hội": "/linh-vuc-trach-nhiem-xa-hoi.png",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [activeSector, setActiveSector] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/sectors").then(r => r.json()),
      fetch("/api/du-an").then(r => r.json()),
    ]).then(([sectorData, projectData]: [Sector[], Project[]]) => {
      if (Array.isArray(sectorData)) {
        setSectors(sectorData);
        if (sectorData.length > 0) setActiveSector(sectorData[0].name);
      }
      if (Array.isArray(projectData)) setProjects(projectData);
    }).catch(() => {});
  }, []);

  const filtered = activeSector ? projects.filter(p => p.sector === activeSector) : projects;
  const heroImage = SECTOR_HERO[activeSector] ?? "/linh-vuc-bat-dong-san.png";

  return (
    <div className="relative min-h-screen bg-white">

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "clamp(280px, 40vw, 560px)", overflow: "hidden", background: "#111", marginTop: 68 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector + "-hero"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image src={heroImage} alt={activeSector} fill style={{ objectFit: "cover", opacity: 0.6 }} priority />
          </motion.div>
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector + "-text"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ position: "absolute", bottom: "clamp(36px, 6vw, 72px)", left: "clamp(24px, 5vw, 72px)", right: "clamp(24px, 5vw, 72px)" }}
          >
            <p className="vin-font" style={{ fontSize: "clamp(11px, 1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e82127", marginBottom: 10 }}>
              Dự án tiêu biểu
            </p>
            <h1 className="vin-font" style={{ fontSize: "clamp(24px, 3.2vw, 48px)", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.15 }}>
              {activeSector || "Tất cả dự án"}
            </h1>
          </motion.div>
        </AnimatePresence>
      </section>

      <Breadcrumb items={[{ label: "Dự án" }]} />

      {/* ── TABS — Mobile ── */}
      {sectors.length > 0 && (
        <div className="sectors-mobile-nav" style={{ background: "#f2f2f2", position: "relative" }}>
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="vin-font"
            style={{ width: "100%", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#fff", background: "#e82127", border: "none", cursor: "pointer" }}
          >
            <span>{activeSector}</span>
            <span style={{ fontSize: 9, transform: mobileMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
          </button>
          {mobileMenuOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", borderTop: "2px solid #e82127" }}>
              {sectors.map(s => (
                <button key={s.id} onClick={() => { setActiveSector(s.name); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="vin-font"
                  style={{ width: "100%", display: "block", padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: activeSector === s.name ? "#e82127" : "#424d54", background: activeSector === s.name ? "#fff8f8" : "transparent", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TABS — Desktop ── */}
      {sectors.length > 0 && (
        <nav className="sectors-desktop-nav" style={{ background: "#f2f2f2", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", width: "100%" }}>
            {sectors.map(s => (
              <button key={s.id} onClick={() => { setActiveSector(s.name); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="vin-font"
                style={{ flex: 1, padding: "0 12px", height: 52, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: activeSector === s.name ? "#fff" : "#424d54", background: activeSector === s.name ? "#e82127" : "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s", borderRight: "1px solid rgba(0,0,0,0.08)" }}
                onMouseEnter={e => { if (activeSector !== s.name) (e.currentTarget as HTMLElement).style.color = "#e82127"; }}
                onMouseLeave={e => { if (activeSector !== s.name) (e.currentTarget as HTMLElement).style.color = "#424d54"; }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ── PROJECT GRID ── */}
      <section style={{ background: "#f8f8f8", padding: "56px clamp(20px, 5vw, 80px) 72px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              {activeSector && (
                <h2 className="vin-font" style={{ fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e82127", marginBottom: 32 }}>
                  Dự án tiêu biểu — {activeSector}
                </h2>
              )}

              {filtered.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center" }}>
                  <p style={{ fontSize: 15, color: "#aaa", fontStyle: "italic" }}>Đang cập nhật...</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      style={{ background: "#fff", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}
                    >
                      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#e0e0e0" }}>
                        {p.thumbnail ? (
                          <Image src={p.thumbnail} alt={p.title} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} className="hover:scale-105" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#d0d0d0" }} />
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
                      </div>
                      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
                          {p.title}
                        </h3>
                        <Link
                          href={`/du-an/${p.slug}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e82127", textDecoration: "none", borderTop: "1px solid #f0f0f0", paddingTop: 16 }}
                          className="group"
                        >
                          Xem chi tiết <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

    </div>
  );
}
