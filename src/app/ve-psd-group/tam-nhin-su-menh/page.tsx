"use client";

import React from "react";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const coreValues = [
  {
    key: "1",
    label: "Tập đoàn đa ngành",
    quote: "Tập đoàn đa ngành vững mạnh",
    body: "Quy mô bền vững, năng lực toàn diện và tầm nhìn dài hạn. PSD Group xây dựng nội lực từ chiều sâu quản trị đến sức mạnh tài chính, đủ sức kiến tạo và triển khai những dự án có tầm vóc.",
    img: "/vepsd-tap-doan-da-nganh.png",
  },
  {
    key: "2",
    label: "Văn hóa Việt",
    quote: "Gìn giữ bản sắc, lan tỏa giá trị Việt",
    body: "Chúng tôi xem văn hóa là gốc rễ của mọi sự phát triển bền vững, và đặt giá trị truyền thống làm nền tảng cho mọi quyết định chiến lược.",
    img: "/vepsd-van-hoa-viet.png",
  },
  {
    key: "3",
    label: "Phụng sự quốc gia",
    quote: "Đồng hành cùng cộng đồng và sự phát triển đất nước",
    body: "PSD Group cam kết chuyển hóa thành quả kinh tế thành những giá trị thực chất cho xã hội, đồng hành cùng các mục tiêu phát triển bền vững của đất nước.",
    img: "/vepsd-phung-su-quoc-gia.png",
  },
  {
    key: "4",
    label: "Đầu tư đa lĩnh vực",
    quote: "Phát triển cộng hưởng, tạo sức bật cho toàn hệ sinh thái",
    body: "Phát triển các lĩnh vực kinh tế chiến lược một cách cộng hưởng, tạo nguồn lực dài hạn và sức bật cho toàn hệ sinh thái PSD Group.",
    img: "/vepsd-dau-tu-da-linh-vuc.png",
  },
];

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-[3px] bg-[#e82127]" />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#e82127" }}>
        {text}
      </span>
    </div>
  );
}

function QuoteBlock({ text }: { text: string }) {
  return (
    <div className="relative">
      <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", marginBottom: 8 }}>&ldquo;</span>
      <p style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontStyle: "italic", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.45, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
        {text}
      </p>
      <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", textAlign: "right" as const, marginTop: 8 }}>&rdquo;</span>
    </div>
  );
}

function ValueSlider() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const total = coreValues.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const v = coreValues[current];

  return (
    <div ref={ref} style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: "clamp(15px, 5vw, 80px)", paddingBottom: "clamp(15px, 5vw, 80px)", background: "#fff" }}>
      <SectionLabel text="Giá trị cốt lõi" />

      {/* Mobile: button tabs */}
      <div className="md:hidden" style={{ display: "flex", gap: 4, marginBottom: 28, paddingBottom: 2 }}>
        {coreValues.map((val, i) => (
          <button
            key={val.key}
            onClick={() => setCurrent(i)}
            style={{
              flex: 1,
              padding: "7px 6px",
              fontSize: 11,
              fontWeight: 600,
              border: i === current ? "1.5px solid #e82127" : "1.5px solid #e0e0e0",
              background: i === current ? "#e82127" : "transparent",
              color: i === current ? "#fff" : "#555",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.18s",
              lineHeight: 1.3,
              textAlign: "center" as const,
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Desktop: text nav + arrows */}
      <div className="hidden md:flex" style={{ alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div style={{ fontSize: "clamp(16px, 1.8vw, 22px)", fontStyle: "italic", color: "#ccc", letterSpacing: "0.06em" }}>
          {coreValues.map((val, i) => (
            <span key={val.key}>
              {i > 0 && <span style={{ margin: "0 8px", color: "#e0e0e0" }}>-</span>}
              <span
                onClick={() => setCurrent(i)}
                style={{
                  cursor: "pointer",
                  color: i === current ? "#e82127" : "#bbb",
                  fontWeight: i === current ? 700 : 400,
                  fontStyle: i === current ? "italic" : "normal",
                  transition: "color 0.2s",
                }}
              >
                {val.label}
              </span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={prev} style={{ background: "none", border: "1px solid #e0e0e0", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 18, transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e82127"; (e.currentTarget as HTMLElement).style.color = "#e82127"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
          >&#8592;</button>
          <button onClick={next} style={{ background: "none", border: "1px solid #e0e0e0", cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 18, transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e82127"; (e.currentTarget as HTMLElement).style.color = "#e82127"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
          >&#8594;</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="value-slider-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}
        >
          <div>
            <QuoteBlock text={v.quote} />
            <p style={{ marginTop: 28, fontSize: 15, color: "#666", lineHeight: 1.85 }}>{v.body}</p>
          </div>
          <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
            <Image src={v.img} alt={v.label} fill className="object-cover" unoptimized />
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 40 }}>
        {coreValues.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 0 }}
          >
            {i > 0 && (
              <span style={{ display: "block", width: 28, height: 1, background: i <= current ? "#e82127" : "#e0e0e0", transition: "background 0.3s" }} />
            )}
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              color: i === current ? "#e82127" : "#ccc",
              transition: "color 0.3s", marginLeft: i > 0 ? 4 : 0, marginRight: 4,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const cycleCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "28px 24px",
  width: "100%",
  textAlign: "center",
};
const cycleNumStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
  color: "#e82127", marginBottom: 12,
};
const cycleIconStyle: React.CSSProperties = {
  fontSize: 28, marginBottom: 12, display: "block",
};
const cycleTitleStyle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "#fff",
  marginBottom: 10, lineHeight: 1.4,
};
const cycleDescStyle: React.CSSProperties = {
  fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
};

export default function VisionPage() {
  const visionRef = useRef(null);
  const visionInView = useInView(visionRef, { once: true, margin: "0px" });

  return (
    <main style={{ paddingTop: 68 }}>

      <div className="vin-page-hero relative w-full" style={{ height: "520px", background: "#111" }}>
        <Image
          src="/hero-vepsd-tam-nhin-su-menh.png"
          alt="Tầm nhìn & Sứ mệnh PSD Group"
          fill className="object-cover opacity-60" priority unoptimized
        />
      </div>

      <Breadcrumb items={[
        { label: "Về PSD Group", href: "/ve-psd-group" },
        { label: "Tầm nhìn & Sứ mệnh" },
      ]} />

      <motion.div
        ref={visionRef}
        initial={{ opacity: 0, y: 30 }}
        animate={visionInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: "clamp(15px, 5vw, 72px)", paddingBottom: "clamp(15px, 5vw, 72px)", background: "#fff" }}
      >
        <SectionLabel text="Tầm nhìn" />
        <div style={{ maxWidth: 820 }}>
          <QuoteBlock text="Trở thành tập đoàn kinh tế đa ngành hàng đầu Việt Nam — nơi sức mạnh kinh tế và chiều sâu văn hóa hội tụ để kiến tạo thịnh vượng bền vững cho đất nước." />
          <p style={{ marginTop: 32, fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            Bằng khát vọng tiên phong và chiến lược đầu tư bền vững, PSD Group định hướng phát triển theo 8 lĩnh vực trọng tâm: Bất động sản, Sản xuất & Công nghiệp, Khoáng sản, Logistics & Cảng biển, Nông nghiệp & Thủy sản, Du lịch & Dịch vụ sinh thái, Đầu tư & Tài chính, và Trách nhiệm Xã hội.
          </p>
        </div>
      </motion.div>

      <div style={{ borderTop: "1px solid #f0f0f0" }}>
        <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "55% 1fr", background: "#fff" }}>
          <div style={{ position: "relative", minHeight: 480 }}>
            <Image
              src="/vepsd-tam-nhin-su-menh.png"
              alt="Sứ mệnh PSD Group"
              fill className="object-cover" unoptimized
            />
          </div>
          <div style={{ paddingLeft: "clamp(40px, 5vw, 80px)", paddingRight: "clamp(40px, 5vw, 80px)", display: "flex", flexDirection: "column" as const, justifyContent: "center", paddingTop: 60, paddingBottom: 60 }}>
            <SectionLabel text="Sứ mệnh" />
            <QuoteBlock text="Kiến tạo giá trị bền vững — phụng sự cộng đồng và quốc gia" />
            <p style={{ marginTop: 28, fontSize: 15, color: "#666", lineHeight: 1.85 }}>
              PSD Group vận hành theo vòng tuần hoàn giá trị: kinh tế tạo nguồn lực, nguồn lực tái đầu tư cho văn hóa — xã hội, và chính chiều sâu văn hóa trở thành lợi thế cạnh tranh dài hạn.
            </p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f0f0f0" }}>
        <ValueSlider />
      </div>

    </main>
  );
}
