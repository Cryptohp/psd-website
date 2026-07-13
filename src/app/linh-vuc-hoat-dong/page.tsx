"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

/* ─── Types ─────────────────────────────────────────── */
type Entity = { name: string; url?: string; logo?: string; desc?: string };
type Sector = {
  slug: string;
  label: string;
  tabLabel: string;
  heroImage: string;
  detailImage: string;
  heroText: string;
  year: string;
  desc: string;
  entities: Entity[];
};

/* ─── Data ───────────────────────────────────────────── */
const sectors: Sector[] = [
  {
    slug: "bat-dong-san-ha-tang",
    label: "Bất động sản & Hạ tầng",
    tabLabel: "Hạ tầng",
    heroImage: "/linh-vuc-bat-dong-san.png",
    detailImage: "/02-linh-vuc-hoat-dong-BDS-ha-tang.png",
    heroText: "foundation: future",
    year: "2026",
    desc: "Phát triển bất động sản và hạ tầng gắn với giá trị dài hạn, tiếp cận như một tài sản chiến lược tạo nền tảng cho cộng đồng và hệ sinh thái.",
    entities: [
      { name: "Công ty TNHH Đầu tư và Phát triển Bất động sản PSD", url: "psdgroup.vn", logo: "RE", desc: "" },
      { name: "Công ty CP Tập đoàn Đầu tư Golden Palace", url: "psdgroup.vn", logo: "GP", desc: "" },
      { name: "Công ty CP Phát triển Hạ tầng và Giáo dục PSD", url: "psdgroup.vn", logo: "HG", desc: "" },
      { name: "Công ty CP Đầu tư PSD Lai Châu", url: "psdgroup.vn", logo: "LC", desc: "" },
    ],
  },
  {
    slug: "san-xuat-cong-nghiep",
    label: "Sản xuất & Công nghiệp",
    tabLabel: "Công nghiệp",
    heroImage: "/linh-vuc-san-xuat-cong-nghiep.png",
    detailImage: "/02-linh-vuc-hoat-dong-san-xuat-cong-nghiep.png",
    heroText: "industry: power",
    year: "2026",
    desc: "Mảng sản xuất là nơi PSD Group tạo ra giá trị thực, hữu hình - trải rộng từ chế biến thực phẩm - công nghiệp (sorbitol, tinh bột, cồn), năng lượng sinh khối (dăm gỗ, viên nén) đến thép và dầu thực vật.",
    entities: [
      { name: "Công ty CP PSD STEEL", url: "psdgroup.vn", logo: "ST", desc: "" },
      { name: "Công ty TNHH Sản xuất và Đầu tư Thương mại Tiên Phong", url: "psdgroup.vn", logo: "TP", desc: "" },
      { name: "Công ty TNHH DPC Group Việt Nam", url: "psdgroup.vn", logo: "DC", desc: "" },
      { name: "Công ty TNHH Công thương Nam Anh", url: "psdgroup.vn", logo: "NA", desc: "" },
      { name: "Công ty TNHH Đầu tư và Thương mại Việt An Hà Nội (Công ty cổ phần Sorbitol Pháp - Việt)", url: "psdgroup.vn", logo: "VA", desc: "" },
    ],
  },
  {
    slug: "khoang-san",
    label: "Khoáng sản",
    tabLabel: "Khoáng sản",
    heroImage: "/linh-vuc-khoang-san.png",
    detailImage: "/02-linh-vuc-hoat-dong-khoang-san.png",
    heroText: "resource: value",
    year: "2026",
    desc: "PSD Group phát triển lĩnh vực khoáng sản theo định hướng bền vững, tuân thủ pháp luật, cân bằng giữa giá trị kinh tế với bảo vệ môi trường, lợi ích cộng đồng địa phương và khu vực quốc tế tại Campuchia.",
    entities: [
      { name: "Công ty CP Xây dựng cầu đường hạ tầng và khoáng sản Thăng Long (Cốc Chặng)" },
      { name: "Công ty CP Cao Lanh Như Xuân" },
      { name: "Công ty TNHH Khoáng sản PSG Bắc Việt" },
      { name: "Công ty CP Đầu tư Xây dựng và Khoáng sản PSD" },
      { name: "Công ty TNHH Việt Thanh – Stone" },
      { name: "Công ty TNHH Đầu tư PHGC Angkor" },
    ],
  },
  {
    slug: "logistics-cang-bien",
    label: "Logistics & Cảng biển",
    tabLabel: "Logistics",
    heroImage: "/linh-vuc-logistics.png",
    detailImage: "/02-linh-vuc-hoat-dong-logistics-cang-bien.png",
    heroText: "connect: nation",
    year: "2026",
    desc: "Logistics là mạch máu kết nối toàn hệ sinh thái, mở rộng tới hạ tầng cảng biển và trung tâm logistics quy mô lớn.",
    entities: [
      { name: "Công ty CP Đầu tư Thương mại và Dịch vụ Tấn Sang Logistics" },
    ],
  },
  {
    slug: "nong-nghiep-thuy-san",
    label: "Nông nghiệp & Thủy sản",
    tabLabel: "Nông nghiệp",
    heroImage: "/linh-vuc-nong-nghiep.png",
    detailImage: "/02-linh-vuc-hoat-dong-nong-nghiep-thuy-san.png",
    heroText: "harvest: life",
    year: "2026",
    desc: "Trụ cột gắn với an ninh lương thực và phát triển nông nghiệp – thủy sản bền vững, khép kín từ nuôi trồng đến chế biến.",
    entities: [
      { name: "Công ty CP Đầu tư và Phát triển Nông nghiệp PSD" },
      { name: "Công ty CP Thủy sản PSD" },
    ],
  },
  {
    slug: "du-lich-dich-vu-sinh-thai",
    label: "Du lịch & Sinh thái",
    tabLabel: "Du lịch",
    heroImage: "/linh-vuc-du-lich.png",
    detailImage: "/02-linh-vuc-hoat-dong-du-lich-sinh-thai.png",
    heroText: "explore: vietnam",
    year: "2026",
    desc: "PSD Group phát triển du lịch gắn với di sản và văn hóa Việt, cùng các mô hình nghỉ dưỡng và không gian sinh thái bền vững.",
    entities: [
      { name: "Công ty CP Du lịch Long Việt" },
      { name: "Công ty TNHH Tâm Linh Bách Việt" },
    ],
  },
  {
    slug: "dau-tu-dich-vu",
    label: "Đầu tư & Dịch vụ",
    tabLabel: "Đầu tư",
    heroImage: "/linh-vuc-dau-tu-dich-vu.png",
    detailImage: "/02-linh-vuc-hoat-dong-dau-tu-dich-vu.png",
    heroText: "invest: grow",
    year: "2026",
    desc: "Đầu tư - M&A, thương mại - xuất nhập khẩu và các dịch vụ chuyên nghiệp hỗ trợ toàn hệ sinh thái. Đây cũng là nơi PSD Group thực hiện năng lực mua bán – sáp nhập, tìm kiếm và tái cấu trúc những doanh nghiệp có nền tảng tốt (như SOFAVI) để đưa vào quỹ đạo phát triển chung.",
    entities: [
      { name: "Công ty TNHH Quản lý và Đầu tư PSD Holdings" },
      { name: "Công ty CP Đầu tư Thương mại và Xuất nhập khẩu PSD" },
      { name: "Công ty TNHH XNK Homey" },
      { name: "Công ty TNHH Đầu tư và Thương mại Thanh Thái" },
      { name: "Công ty Luật TNHH PSD" },
      { name: "Công ty TNHH Dịch vụ và Thiết bị Ostech Việt Nam" },
    ],
  },
  {
    slug: "trach-nhiem-xa-hoi",
    label: "Trách nhiệm xã hội",
    tabLabel: "Xã hội",
    heroImage: "/linh-vuc-trach-nhiem-xa-hoi.png",
    detailImage: "/02-linh-vuc-hoat-dong-trach-nhiem-xa-hoi.png",
    heroText: "serve: community",
    year: "2026",
    desc: "Viện Nghiên cứu và Ứng dụng Phòng chống ma túy PSD (Viện PSD) hiện thân cho trách nhiệm cộng đồng. Viện hoạt động theo định hướng nghiên cứu khoa học và ứng dụng thực tiễn nhằm phòng, chống ma túy, hỗ trợ người sau cai nghiện tái hòa nhập cộng đồng và lan tỏa những giá trị nhân văn tới xã hội.",
    entities: [
      { name: "Viện Nghiên cứu và Ứng dụng Phòng chống ma túy PSD (Viện PSD)" },
    ],
  },
];


/* ─── Component ──────────────────────────────────────── */
export default function SectorsPage() {
  const [active, setActive] = useState<Sector>(sectors[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const overlapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "0px" });

  const { scrollYProgress } = useScroll({
    target: overlapRef,
    offset: ["start end", "end start"],
  });
  const imgX = useTransform(scrollYProgress, [0, 1], ["0px", "-25px"]);
  const copyX = useTransform(scrollYProgress, [0, 1], ["20px", "0px"]);

  const handleSectorChange = (sector: Sector) => {
    setActive(sector);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div>

        {/* ── HERO BANNER ── */}
        <section style={{ position: "relative", height: "clamp(320px, 55vw, 680px)", overflow: "hidden", background: "#111" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug + "-hero"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{ position: "absolute", inset: 0 }}
            >
              <Image
                src={active.heroImage}
                alt={active.label}
                fill
                style={{ objectFit: "cover", opacity: 0.75 }}
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />

          {/* Hero content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug + "-text"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{
                position: "absolute",
                bottom: "clamp(40px, 7vw, 90px)",
                left: "clamp(24px, 5vw, 72px)",
                right: "clamp(24px, 5vw, 72px)",
              }}
            >
              {/* Big bleed text */}
              <div
                className="vin-font"
                style={{
                  fontSize: "clamp(48px, 10vw, 140px)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "white",
                  opacity: 0.12,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  marginBottom: -8,
                  userSelect: "none",
                }}
              >
                {active.heroText}
              </div>
              <h1
                className="vin-font"
                style={{
                  fontSize: "clamp(26px, 3.5vw, 52px)",
                  fontWeight: 800,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1.1,
                  position: "relative",
                }}
              >
                {active.label}
              </h1>
            </motion.div>
          </AnimatePresence>
        </section>

        <Breadcrumb items={[{ label: "Lĩnh vực & Công ty thành viên" }]} />

        {/* ── SECTOR TABS — Mobile dropdown ── */}
        <div className="sectors-mobile-nav" style={{ background: "#f2f2f2", position: "relative" as const }}>
          {/* Trigger button */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="vin-font"
            style={{
              width: "100%", height: 52, display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "0 20px",
              fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
              letterSpacing: "0.07em", color: "#fff", background: "#e82127",
              border: "none", cursor: "pointer",
            }}
          >
            <span>{active.label}</span>
            <span style={{ fontSize: 9, transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
          </button>
          {/* Dropdown list */}
          {mobileMenuOpen && (
            <div style={{ position: "absolute" as const, top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", borderTop: "2px solid #e82127" }}>
              {sectors.map((sector) => (
                <button
                  key={sector.slug}
                  onClick={() => handleSectorChange(sector)}
                  className="vin-font"
                  style={{
                    width: "100%", display: "block", padding: "14px 20px",
                    textAlign: "left" as const, fontSize: 12, fontWeight: 700,
                    textTransform: "uppercase" as const, letterSpacing: "0.07em",
                    color: active.slug === sector.slug ? "#e82127" : "#424d54",
                    background: active.slug === sector.slug ? "#fff8f8" : "transparent",
                    border: "none", borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                  }}
                >
                  {sector.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── SECTOR TABS — Desktop horizontal ── */}
        <nav className="sectors-desktop-nav" style={{ background: "#f2f2f2", overflowX: "auto", scrollbarWidth: "none" as const }}>
          <div style={{ display: "flex", width: "100%" }}>
            {sectors.map((sector) => (
              <button
                key={sector.slug}
                onClick={() => handleSectorChange(sector)}
                className="vin-font"
                style={{
                  flex: 1, padding: "0 12px", height: 52,
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
                  letterSpacing: "0.07em",
                  color: active.slug === sector.slug ? "#fff" : "#424d54",
                  background: active.slug === sector.slug ? "#e82127" : "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap" as const,
                  transition: "background 0.2s, color 0.2s",
                  borderRight: "1px solid rgba(0,0,0,0.08)",
                }}
                onMouseEnter={e => { if (active.slug !== sector.slug) (e.currentTarget as HTMLElement).style.color = "#e82127"; }}
                onMouseLeave={e => { if (active.slug !== sector.slug) (e.currentTarget as HTMLElement).style.color = "#424d54"; }}
              >
                <span className="hidden lg:inline">{sector.label}</span>
                <span className="lg:hidden">{sector.tabLabel}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── OVERLAP DETAIL ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug + "-detail"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <section className="vin-overlap">
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 10px 0" }}>
                <p className="vin-thongtin-heading" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1a1a1a" }}>
                  Thông tin chi tiết
                </p>
              </div>
              <div className="vin-overlap-container" ref={overlapRef}>
                {/* Image — 85% width */}
                <motion.div className="vin-overlap-img" style={{ x: imgX }}>
                  <Image
                    src={active.detailImage}
                    alt={active.label}
                    width={1200}
                    height={580}
                    style={{ width: "100%", height: "auto", maxHeight: 580, objectFit: "cover", display: "block" }}
                  />
                </motion.div>

                {/* Text box — absolute, overlapping right */}
                <motion.div className="vin-overlap-copy" style={{ x: copyX }}>
                  <div className="vin-overlap-copy-bg" />
                  <div className="vin-overlap-copy-inner">
                    <p className="vin-year">{active.year}</p>
                    <h2 className="vin-sector-title">{active.label}</h2>
                    <p className="vin-desc">{active.desc}</p>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* ── ENTITY GRID ── */}
        <section className="vin-entities">
          <div className="vin-entities-container" ref={gridRef}>
            <motion.h2
              className="vin-entities-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Các đơn vị thành viên
            </motion.h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug + "-entities"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="vin-entity-grid-responsive"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 24 }}
              >
                {active.entities.map((entity, i) => (
                  <motion.div
                    key={entity.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={gridInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.05 + i * 0.08 }}
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: "28px 24px 24px",
                      display: "flex",
                      flexDirection: "column" as const,
                    }}
                  >
                    {/* số thứ tự */}
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#ccc", letterSpacing: "0.15em", display: "block", marginBottom: 14 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* tên công ty */}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                      {entity.name}
                    </div>
                    {/* nút xem chi tiết */}
                    <a
                      href="#"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                        textTransform: "uppercase" as const, color: "#e82127",
                        textDecoration: "none", borderTop: "1px solid #f0f0f0",
                        paddingTop: 14, transition: "gap 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = "14px"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = "8px"}
                    >
                      Xem chi tiết <span style={{ fontSize: 14 }}>→</span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>


      </div>
    </div>
  );
}
