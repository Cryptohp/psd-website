"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

type Project = { title: string; slug: string; image: string };
type Sector = { id: string; label: string; tabLabel: string; heroImage: string; projects: Project[] };

const sectors: Sector[] = [
  {
    id: "bat-dong-san",
    label: "Bất động sản & Hạ tầng",
    tabLabel: "Hạ tầng",
    heroImage: "/linh-vuc-bat-dong-san.png",
    projects: [
      { title: "Khu nhà ở thông minh Yên Mỹ", slug: "khu-nha-o-thong-minh-yen-my", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Khu nhà ở Ngọc Lâm (Long Biên, Hà Nội)", slug: "khu-nha-o-ngoc-lam", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Nhà ở xã hội Sơn Đồng – Hải An (Hà Nội)", slug: "nha-o-xa-hoi-son-dong", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Nhà ở xã hội Tây Tựu – Hải An (Hà Nội)", slug: "nha-o-xa-hoi-tay-tuu", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Nhà ở xã hội Nam Hồ Linh Đàm", slug: "nha-o-xa-hoi-nam-ho-linh-dam", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Nhà ở xã hội Ngọc Hồi (Hà Nội)", slug: "nha-o-xa-hoi-ngoc-hoi", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Khu nhà ở thấp tầng An Thượng – Hoài Đức", slug: "khu-nha-o-an-thuong", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Dự án Đào Trí", slug: "du-an-dao-tri", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Dự án Nguyễn Duy Trinh", slug: "du-an-nguyen-duy-trinh", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Khu nhà ở cao tầng Long Trường", slug: "khu-nha-o-long-truong", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Dự án Traco 1 (Hà Nội)", slug: "du-an-traco-1", image: "/linh-vuc-bat-dong-san.png" },
      { title: "Bất động sản Thanh Hóa", slug: "bat-dong-san-thanh-hoa", image: "/linh-vuc-bat-dong-san.png" },
    ],
  },
  {
    id: "san-xuat-cong-nghiep",
    label: "Sản xuất & Công nghiệp",
    tabLabel: "Công nghiệp",
    heroImage: "/linh-vuc-san-xuat-cong-nghiep.png",
    projects: [
      { title: "Nhà máy dầu Quang Minh (Hưng Yên)", slug: "nha-may-dau-quang-minh", image: "/linh-vuc-san-xuat-cong-nghiep.png" },
      { title: "Nhà máy tinh bột Nước Trong", slug: "nha-may-tinh-bot-nuoc-trong", image: "/linh-vuc-san-xuat-cong-nghiep.png" },
      { title: "Nhà máy Cồn Quảng Nam", slug: "nha-may-con-quang-nam", image: "/linh-vuc-san-xuat-cong-nghiep.png" },
      { title: "Dự án Sắt và Cụm công nghiệp Yên Bái", slug: "du-an-sat-yen-bai", image: "/linh-vuc-san-xuat-cong-nghiep.png" },
      { title: "Nhà máy dăm gỗ & viên nén Vinafor (Quảng Trị)", slug: "nha-may-dam-go-vinafor", image: "/linh-vuc-san-xuat-cong-nghiep.png" },
    ],
  },
  {
    id: "khoang-san",
    label: "Khoáng sản",
    tabLabel: "Khoáng sản",
    heroImage: "/linh-vuc-khoang-san.png",
    projects: [],
  },
  {
    id: "logistics",
    label: "Logistics & Cảng biển",
    tabLabel: "Logistics",
    heroImage: "/linh-vuc-logistics.png",
    projects: [
      { title: "Trung tâm Logistics Chân Mây (Huế)", slug: "logistics-chan-may", image: "/linh-vuc-logistics.png" },
      { title: "Cảng Tổng hợp Thị Vải & kho bãi cảng Phú Mỹ", slug: "cang-thi-vai-phu-my", image: "/linh-vuc-logistics.png" },
    ],
  },
  {
    id: "nong-nghiep",
    label: "Nông nghiệp & Thủy sản",
    tabLabel: "Nông nghiệp",
    heroImage: "/linh-vuc-nong-nghiep.png",
    projects: [
      { title: "Dự án Nông nghiệp PSD", slug: "du-an-nong-nghiep-psd", image: "/linh-vuc-nong-nghiep.png" },
    ],
  },
  {
    id: "du-lich",
    label: "Du lịch & Sinh thái",
    tabLabel: "Du lịch",
    heroImage: "/linh-vuc-du-lich.png",
    projects: [
      { title: "Khu du lịch sinh thái văn hóa Long Việt", slug: "khu-du-lich-long-viet", image: "/linh-vuc-du-lich.png" },
      { title: "Khách sạn Sunrise (Lâm Đồng)", slug: "khach-san-sunrise-lam-dong", image: "/linh-vuc-du-lich.png" },
      { title: "Công viên nghĩa trang sinh thái Tâm Điền (Bắc Ninh)", slug: "cong-vien-tam-dien", image: "/linh-vuc-du-lich.png" },
    ],
  },
  {
    id: "dau-tu-dich-vu",
    label: "Đầu tư & Dịch vụ",
    tabLabel: "Đầu tư",
    heroImage: "/linh-vuc-dau-tu-dich-vu.png",
    projects: [],
  },
  {
    id: "trach-nhiem-xa-hoi",
    label: "Trách nhiệm xã hội",
    tabLabel: "Xã hội",
    heroImage: "/linh-vuc-trach-nhiem-xa-hoi.png",
    projects: [],
  },
];

export default function ProjectsPage() {
  const [active, setActive] = useState(sectors[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white">

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "clamp(280px, 40vw, 560px)", overflow: "hidden", background: "#111", marginTop: 68 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + "-hero"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image src={active.heroImage} alt={active.label} fill style={{ objectFit: "cover", opacity: 0.6 }} priority />
          </motion.div>
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + "-text"}
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
              {active.label}
            </h1>
          </motion.div>
        </AnimatePresence>
      </section>

      <Breadcrumb items={[{ label: "Dự án & Công ty thành viên" }]} />

      {/* ── TABS — Mobile ── */}
      <div className="sectors-mobile-nav" style={{ background: "#f2f2f2", position: "relative" }}>
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          className="vin-font"
          style={{ width: "100%", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#fff", background: "#e82127", border: "none", cursor: "pointer" }}
        >
          <span>{active.label}</span>
          <span style={{ fontSize: 9, transform: mobileMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
        </button>
        {mobileMenuOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", borderTop: "2px solid #e82127" }}>
            {sectors.map(s => (
              <button key={s.id} onClick={() => { setActive(s); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="vin-font"
                style={{ width: "100%", display: "block", padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: active.id === s.id ? "#e82127" : "#424d54", background: active.id === s.id ? "#fff8f8" : "transparent", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── TABS — Desktop ── */}
      <nav className="sectors-desktop-nav" style={{ background: "#f2f2f2", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", width: "100%" }}>
          {sectors.map(s => (
            <button key={s.id} onClick={() => { setActive(s); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="vin-font"
              style={{ flex: 1, padding: "0 12px", height: 52, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: active.id === s.id ? "#fff" : "#424d54", background: active.id === s.id ? "#e82127" : "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s", borderRight: "1px solid rgba(0,0,0,0.08)" }}
              onMouseEnter={e => { if (active.id !== s.id) (e.currentTarget as HTMLElement).style.color = "#e82127"; }}
              onMouseLeave={e => { if (active.id !== s.id) (e.currentTarget as HTMLElement).style.color = "#424d54"; }}
            >
              <span className="hidden lg:inline">{s.label}</span>
              <span className="lg:hidden">{s.tabLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── PROJECT GRID ── */}
      <section style={{ background: "#f8f8f8", padding: "56px clamp(20px, 5vw, 80px) 72px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + "-projects"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <h2 className="vin-font" style={{ fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#e82127", marginBottom: 32 }}>
                Dự án tiêu biểu — {active.label}
              </h2>

              {active.projects.length === 0 ? (
                <p style={{ fontSize: 15, color: "#999", fontStyle: "italic" }}>Đang cập nhật dự án tiêu biểu.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                  {active.projects.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      style={{ background: "#fff", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}
                    >
                      {/* Card image */}
                      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#e0e0e0" }}>
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          style={{ objectFit: "cover", transition: "transform 0.4s" }}
                          className="hover:scale-105"
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
                      </div>

                      {/* Card body */}
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
