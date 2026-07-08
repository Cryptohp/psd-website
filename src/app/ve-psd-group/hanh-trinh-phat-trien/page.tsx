"use client";

import Image from "next/image";
import { useRef, useState } from "react";
// Image used only in hero
import { motion, useInView } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const milestones = [
  {
    year: "2013",
    label: "Khởi nguồn",
    title: "Thành lập PSD Group",
    body: "PSD Group ra đời từ niềm tin doanh nghiệp lớn phải tạo ra giá trị lâu dài cho xã hội. Khởi nguồn với tầm nhìn xây dựng tập đoàn kinh tế đa ngành, đặt bản sắc văn hóa Việt làm nền tảng cho mọi chiến lược phát triển.",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    side: "right",
  },
  {
    year: "2013–2026",
    label: "Phát triển",
    title: "Xây dựng hệ sinh thái đa ngành",
    body: "Hành trình mở rộng quy mô và chuẩn hóa quản trị — từng bước hình thành hệ sinh thái 8 lĩnh vực trọng tâm. PSD Group đặt nền móng cho các thành viên chiến lược trong bất động sản, sản xuất, logistics và văn hóa.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
    side: "left",
  },
  {
    year: "2026–2028",
    label: "Củng cố",
    title: "Hoàn thiện năng lực & quản trị",
    body: "Hoàn thiện hệ sinh thái và các dự án trọng điểm. Nâng cao năng lực quản trị và vận hành theo chuẩn tập đoàn — chuẩn bị hạ tầng con người, công nghệ và tài chính cho giai đoạn tăng tốc tiếp theo.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
    side: "right",
  },
  {
    year: "2028–2030",
    label: "Mở rộng",
    title: "Tăng tốc & hợp tác chiến lược",
    body: "Nâng cao năng lực vận hành và hợp tác chiến lược. PSD Group đẩy mạnh hiện diện tại các thị trường mới, mở rộng quan hệ đối tác quốc tế và phát triển các lĩnh vực kinh tế chiến lược.",
    img: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=900&q=80",
    side: "left",
  },
  {
    year: "Sau 2030",
    label: "Đích đến",
    title: "Tập đoàn đại chúng tầm vóc quốc gia",
    body: "Hướng tới mô hình tập đoàn đại chúng, minh bạch, bền vững và tầm vóc quốc gia. PSD Group đặt mục tiêu trở thành một trong những tập đoàn kinh tế đa ngành hàng đầu Việt Nam, nơi sức mạnh kinh tế và chiều sâu văn hóa hội tụ.",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
    side: "right",
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

function MilestoneItem({ m, i }: { m: typeof milestones[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const isLast = i === milestones.length - 1;
  const isLeft = i % 2 === 0;
  const [hovered, setHovered] = useState(false);

  const cardContent = (isMobileRight: boolean) => (
    <motion.div
      initial={{ opacity: 0, x: isMobileRight ? 28 : (isLeft ? -28 : 28) }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{ paddingBottom: 72, width: "100%", textAlign: isMobileRight ? "left" as const : (isLeft ? "right" as const : "left" as const) }}
    >
      {/* Year */}
      <div style={{ marginBottom: 8, display: "flex", justifyContent: isMobileRight ? "flex-start" : (isLeft ? "flex-end" : "flex-start") }}>
        <span style={{ fontSize: "clamp(26px, 2.8vw, 38px)", fontWeight: 700, color: "#e82127", lineHeight: 1.1 }}>
          {m.year}
        </span>
      </div>

      {/* Card + arrow wrapper */}
      <div style={{ position: "relative" as const, display: "inline-block", width: "100%" }}>
        {/* Triangle pointing toward axis */}
        <div style={{
          position: "absolute" as const,
          top: "50%", transform: "translateY(-50%)",
          [isMobileRight ? "left" : (isLeft ? "right" : "left")]: -10,
          width: 0, height: 0,
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
          ...(isMobileRight
            ? { borderRight: `10px solid ${hovered ? "#fff" : "#e82127"}` }
            : isLeft
              ? { borderLeft: `10px solid ${hovered ? "#fff" : "#e82127"}` }
              : { borderRight: `10px solid ${hovered ? "#fff" : "#e82127"}` }
          ),
          transition: "border-left-color 0.3s, border-right-color 0.3s",
        }} />

        {/* Card */}
        <div
          style={{
            border: "1px solid #ebebeb",
            padding: "clamp(20px, 2.5vw, 32px)",
            cursor: "default",
            background: hovered ? "#e82127" : "#fff",
            borderColor: hovered ? "#e82127" : "#ebebeb",
            transition: "background 0.3s, border-color 0.3s",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span style={{
            fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 700,
            color: hovered ? "#fff" : "#e82127",
            letterSpacing: "0.04em", textTransform: "uppercase" as const,
            display: "block", marginBottom: 6, transition: "color 0.3s",
          }}>
            {m.label}
          </span>
          <h3 style={{
            fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 700,
            color: hovered ? "#fff" : "#1a1a1a",
            textTransform: "uppercase" as const,
            letterSpacing: "0.03em", lineHeight: 1.2, margin: 0, marginBottom: 14,
            overflow: "hidden", textOverflow: "ellipsis",
            transition: "color 0.3s",
          }}>
            {m.title}
          </h3>
          <p style={{
            fontSize: 14,
            color: hovered ? "rgba(255,255,255,0.82)" : "#666",
            lineHeight: 1.85, margin: 0, transition: "color 0.3s",
          }}>
            {m.body}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const empty = <div style={{ paddingBottom: 72 }} />;

  return (
    <div ref={ref} className="timeline-row">

      {/* Mobile: all cards on right side */}
      <div className="block md:hidden">
        <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Axis */}
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: 32, flexShrink: 0 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ width: 14, height: 14, borderRadius: "50%", background: "#e82127", flexShrink: 0, marginTop: 10, zIndex: 1, boxShadow: "0 0 0 4px #fff, 0 0 0 5px #e0e0e0" }}
          />
          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ flex: 1, width: 1, background: "#e0e0e0", transformOrigin: "top" }}
            />
          )}
        </div>
        {/* Card always on right */}
        <div style={{ flex: 1, paddingLeft: 16 }}>
          {cardContent(true)}
        </div>
        </div>
      </div>

      {/* Desktop: alternating left/right */}
      <div className="hidden md:block">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", alignItems: "stretch" }}>
        {/* Left slot */}
        <div style={{ paddingRight: 32 }}>
          {isLeft ? cardContent(false) : empty}
        </div>

        {/* Center — axis */}
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ width: 14, height: 14, borderRadius: "50%", background: "#e82127", flexShrink: 0, marginTop: 10, zIndex: 1, boxShadow: "0 0 0 4px #fff, 0 0 0 5px #e0e0e0" }}
          />
          {!isLast && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ flex: 1, width: 1, background: "#e0e0e0", transformOrigin: "top" }}
            />
          )}
        </div>

        {/* Right slot */}
        <div style={{ paddingLeft: 32 }}>
          {!isLeft ? cardContent(false) : empty}
        </div>
      </div>
      </div>

    </div>
  );
}

export default function TimelinePage() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "0px" });

  return (
    <main style={{ paddingTop: 68 }}>

      {/* Hero */}
      <div className="vin-page-hero relative w-full" style={{ height: "520px", background: "#111" }}>
        <Image
          src="/hero-hanh-trinh-phat-trien.png"
          alt="Hành trình phát triển PSD Group"
          fill className="object-cover opacity-50" priority unoptimized
        />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column" as const, justifyContent: "flex-end",
          paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingBottom: 60,
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, maxWidth: 700, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}
          >
            Hơn một thập kỷ kiến tạo giá trị
          </motion.h1>
        </div>
      </div>

      <Breadcrumb items={[
        { label: "Về PSD Group", href: "/ve-psd-group" },
        { label: "Hành trình phát triển" },
      ]} />

      {/* Intro */}
      <motion.div
        ref={introRef}
        initial={{ opacity: 0, y: 30 }}
        animate={introInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: "clamp(15px, 5vw, 72px)", paddingBottom: "clamp(15px, 5vw, 72px)", background: "#fff" }}
      >
        <SectionLabel text="Lịch sử hình thành" />
        <div style={{ maxWidth: 820 }}>
          <div className="relative">
            <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", marginBottom: 8 }}>&ldquo;</span>
            <p style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontStyle: "italic", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.45, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
              Từ năm 2013 đến đích đến sau 2030 — một hành trình xây dựng tập đoàn đại chúng, minh bạch và tầm vóc quốc gia
            </p>
            <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", textAlign: "right" as const, marginTop: 8 }}>&rdquo;</span>
          </div>
          <p style={{ marginTop: 32, fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            Mỗi chặng đường là một trang sử của PSD Group — từ những bước đi đầu tiên, qua giai đoạn củng cố hệ sinh thái, đến tầm nhìn mở rộng và hướng tới mô hình tập đoàn đại chúng hàng đầu Việt Nam.
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div style={{ borderTop: "1px solid #f0f0f0", background: "#fff", paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: "clamp(15px, 5vw, 72px)", paddingBottom: 40 }}>
        <SectionLabel text="Các mốc phát triển" />
        <div style={{ marginTop: 48 }}>
          {milestones.map((m, i) => (
            <MilestoneItem key={m.year} m={m} i={i} />
          ))}
        </div>
      </div>

    </main>
  );
}

