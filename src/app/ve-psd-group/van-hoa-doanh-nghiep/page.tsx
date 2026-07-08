"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const culturePillars = [
  {
    num: "01",
    title: "Chính trực",
    body: "Minh bạch trong quản trị, trung thực trong hợp tác, nhất quán giữa lời nói và hành động. Chính trực là nền tảng để xây dựng niềm tin bền vững.",
  },
  {
    num: "02",
    title: "Bền vững",
    body: "Mọi quyết định đều cân nhắc giá trị dài hạn cho doanh nghiệp, cộng đồng và xã hội. Tăng trưởng thực chất, không đánh đổi tương lai.",
  },
  {
    num: "03",
    title: "Bản sắc",
    body: "Gìn giữ và lan tỏa bản sắc văn hóa Việt — đặt giá trị truyền thống làm nền tảng cho mọi hành động chiến lược.",
  },
  {
    num: "04",
    title: "Cộng hưởng",
    body: "Sức mạnh của hệ sinh thái đến từ sự kết nối, không phải sự đơn lẻ. Làm việc cùng nhau để tạo ra giá trị vượt tổng các phần.",
  },
  {
    num: "05",
    title: "Phụng sự",
    body: "Đặt lợi ích cộng đồng và quốc gia song hành cùng lợi ích doanh nghiệp. Con người là trọng tâm của mọi quyết định.",
  },
  {
    num: "06",
    title: "Phát triển con người",
    body: "Con người là tài sản quý giá nhất. Sự phát triển của mỗi cá nhân chính là nền tảng cho sự phát triển của cả tập đoàn.",
  },
];

const benefits = [
  "Thu nhập cạnh tranh, xét duyệt theo năng lực và kết quả thực chất.",
  "Chế độ bảo hiểm, chăm sóc sức khỏe toàn diện cho nhân viên và gia đình.",
  "Đào tạo chuyên sâu, phát triển chuyên môn và kỹ năng lãnh đạo.",
  "Môi trường làm việc chuyên nghiệp, văn minh, khuyến khích sáng tạo.",
  "Du lịch nội bộ và các hoạt động gắn kết văn hóa doanh nghiệp.",
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

function PillarsGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <div ref={ref} style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 60, paddingBottom: 60, background: "#f5f5f5" }}>
      <SectionLabel text="Văn hóa làm việc" />
      <p style={{ fontSize: "clamp(26px, 2.8vw, 36px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 40, maxWidth: 640, textTransform: "uppercase" as const }}>
        6 trục văn hóa PSD GROUP
      </p>

      <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3%" }}>
        {culturePillars.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group"
          >
            {/* Card */}
            <div
              className="group-hover:!bg-[#e82127]"
              style={{
                padding: "clamp(15px, 5vw, 70px) clamp(15px, 2.5vw, 30px)",
                background: "#fff",
                border: "1px solid #dedede",
                position: "relative" as const,
                transition: "background 0.3s",
                height: "100%",
                boxSizing: "border-box" as const,
              }}
            >
              <h3
                className="group-hover:!text-white"
                style={{
                  fontSize: "clamp(16px, 1.6vw, 22px)", fontWeight: 700,
                  color: "#e82127", paddingBottom: 25,
                  lineHeight: 1.25, transition: "color 0.3s",
                  textTransform: "uppercase" as const,
                }}
              >
                {p.title}
              </h3>

              <p
                className="group-hover:!text-white"
                style={{ fontSize: 16, color: "#424d54", lineHeight: 1.7, transition: "color 0.3s" }}
              >
                {p.body}
              </p>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CorporateCulturePage() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "0px" });
  const envRef = useRef(null);
  const envInView = useInView(envRef, { once: true, margin: "0px" });

  return (
    <main style={{ paddingTop: 68 }}>

      {/* Hero */}
      <div className="vin-page-hero relative w-full" style={{ height: "520px", background: "#111" }}>
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=85"
          alt="Văn hóa doanh nghiệp PSD Group"
          fill className="object-cover opacity-55" priority unoptimized
        />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column" as const, justifyContent: "flex-end",
          paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingBottom: 60,
        }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}
          >
            Văn hóa doanh nghiệp
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, maxWidth: 700, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}
          >
            Con người là tài sản quý giá nhất
          </motion.h1>
        </div>
      </div>

      <Breadcrumb items={[
        { label: "Về PSD Group", href: "/ve-psd-group" },
        { label: "Văn hóa doanh nghiệp" },
      ]} />

      {/* Intro quote */}
      <motion.div
        ref={introRef}
        initial={{ opacity: 0, y: 30 }}
        animate={introInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 80, paddingBottom: 80, background: "#fff" }}
      >
        <SectionLabel text="Triết lý" />
        <div style={{ maxWidth: 860 }}>
          <div className="relative">
            <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", marginBottom: 8 }}>&ldquo;</span>
            <p style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontStyle: "italic", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.5, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
              Tại PSD Group, sự phát triển của mỗi cá nhân chính là nền tảng cho sự phát triển của cả tập đoàn
            </p>
            <span style={{ fontSize: 80, lineHeight: 0.6, color: "#e8e8e8", fontFamily: "Georgia, serif", display: "block", textAlign: "right" as const, marginTop: 8 }}>&rdquo;</span>
          </div>
          <p style={{ marginTop: 32, fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            Chúng tôi xây dựng môi trường làm việc nhân văn, sáng tạo và trách nhiệm — nơi mỗi cá nhân đều có cơ hội phát triển và đóng góp cho cộng đồng. Văn hóa PSD Group không chỉ là lý tưởng, mà là tiêu chuẩn hành vi được thực hành mỗi ngày bởi toàn bộ thành viên tập đoàn.
          </p>
        </div>
      </motion.div>

      {/* Culture pillars grid */}
      <div style={{ borderTop: "1px solid #f0f0f0" }}>
        <PillarsGrid />
      </div>

      {/* Working environment — image + benefits list */}
      <div className="pt-16 md:pt-0" style={{ borderTop: "1px solid #f0f0f0" }}>
        <div
          ref={envRef}
          className="env-grid" style={{ display: "grid", gridTemplateColumns: "1fr 55%", background: "#fff" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={envInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ paddingLeft: SIDE_PAD, paddingTop: 72, paddingBottom: 72, paddingRight: "clamp(40px, 5vw, 80px)", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}
          >
            <SectionLabel text="Môi trường làm việc" />
            <h2 style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 36, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
              Chính sách & Phúc lợi
            </h2>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={envInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  style={{ display: "flex", gap: 18, paddingTop: 18, paddingBottom: 18, borderBottom: "1px solid #f5f5f5", alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#e82127", letterSpacing: "0.1em", minWidth: 24, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>{b}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={envInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: "relative" as const, minHeight: 520 }}
          >
            <Image
              src="/van-hoa-doanh-nghiep-moi-truong-lam-viec.png"
              alt="Môi trường làm việc PSD Group"
              fill className="object-cover" unoptimized
            />
          </motion.div>
        </div>
      </div>

      {/* CTA strip */}
      <div style={{ background: "#1a1a1a", paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 64, paddingBottom: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" as const }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#e82127", marginBottom: 12 }}>
            Tuyển dụng
          </p>
          <h2 style={{ fontSize: "clamp(20px, 2.4vw, 28px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, maxWidth: 500 }}>
            Cùng PSD Group kiến tạo những giá trị bền vững
          </h2>
        </div>
        <a
          href="/tuyen-dung"
          style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            border: "1px solid rgba(255,255,255,0.25)", color: "#fff",
            padding: "14px 32px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase" as const,
            textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" as const,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e82127"; (e.currentTarget as HTMLElement).style.borderColor = "#e82127"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
        >
          Xem vị trí tuyển dụng &#8594;
        </a>
      </div>

    </main>
  );
}

