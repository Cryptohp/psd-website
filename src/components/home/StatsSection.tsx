"use client";


import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const VP = { once: true, amount: 0 };

const stats = [
  { value: 8,   suffix: "+", label: "Lĩnh vực hoạt động", desc: "Đa ngành, cộng hưởng" },
  { value: 20,  suffix: "+", label: "Công ty thành viên",  desc: "Trong hệ sinh thái" },
  { value: 50,  suffix: "+", label: "Dự án tiêu biểu",     desc: "Trên toàn quốc" },
  { value: 500, suffix: "+", label: "Nhân sự",             desc: "Con người là nền tảng" },
];

const capabilities = [
  { title: "Kiến tạo dự án",        desc: "Ý tưởng đến hiện thực" },
  { title: "Kết nối nguồn lực",     desc: "Mạng lưới đối tác chiến lược" },
  { title: "Vận hành hệ sinh thái", desc: "Cộng hưởng giá trị" },
  { title: "M&A & Tái cấu trúc",    desc: "Năng lực chuyển hóa dự án" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="section-padding bg-[#f7f7f7]" ref={ref}>
      <div className="container-psd">

        {/* Main row: left text + right stats grid */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-20 mb-14">

          {/* LEFT — text content, left-aligned */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#e82127" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e82127", letterSpacing: "0.18em", textTransform: "uppercase" as const }}>
                Năng lực vận hành
              </span>
              <div style={{ width: 28, height: 2, background: "#e82127" }} />
            </div>
            <h2 className="text-section-title text-[#1a1a1a] mb-5">
              Con số nói lên{" "}
              <span style={{ color: "#e82127" }}>sức mạnh</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6e6e74", lineHeight: 1.75, maxWidth: 400 }}>
              Những chỉ số phản ánh năng lực thực sự của PSD Group sau hơn một thập kỷ xây dựng.
            </p>
          </motion.div>

          {/* RIGHT — 2×2 stats grid */}
          <div className="flex-1 grid grid-cols-2" style={{ gap: 10 }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col items-start px-8 py-8 overflow-hidden bg-white"
                style={{ border: "1px solid #e8e8e8" }}
              >
                {/* Top red accent on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] bg-[#e82127]"
                  style={{ transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" }}
                  ref={(el) => {
                    if (!el) return;
                    const parent = el.parentElement;
                    if (!parent) return;
                    parent.addEventListener("mouseenter", () => (el.style.transform = "scaleX(1)"));
                    parent.addEventListener("mouseleave", () => (el.style.transform = "scaleX(0)"));
                  }}
                />

                {/* Number */}
                <div style={{ fontSize: 28, fontWeight: 800, color: "#e82127", lineHeight: 1, marginBottom: 10 }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Divider */}
                <div style={{ width: 24, height: 2, background: "#e0e0e0", marginBottom: 10 }} />

                {/* Label */}
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#424d54", marginBottom: 3, lineHeight: 1.4 }}>
                  {stat.label}
                </div>

                {/* Desc */}
                <div style={{ fontSize: 11, color: "#b0b0b0", lineHeight: 1.4 }}>
                  {stat.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capability blocks */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ border: "1px solid #e8e8e8" }}
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ duration: 0.45, delay: 0.45 + i * 0.08 }}
              className="group py-7 px-6 transition-colors duration-300 hover:bg-[#f7f7f7] relative overflow-hidden"
              style={{ borderRight: i < 3 ? "1px solid #e8e8e8" : "none" }}
            >
              <div
                style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: "#e82127",
                  transform: "scaleY(0)", transformOrigin: "bottom",
                  transition: "transform 0.3s ease",
                }}
                ref={(el) => {
                  if (!el) return;
                  const parent = el.parentElement;
                  if (!parent) return;
                  parent.addEventListener("mouseenter", () => (el.style.transform = "scaleY(1)"));
                  parent.addEventListener("mouseleave", () => (el.style.transform = "scaleY(0)"));
                }}
              />
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#424d54", marginBottom: 6, lineHeight: 1.4 }}>
                {cap.title}
              </div>
              <div style={{ fontSize: 12, color: "#a7a7a7", lineHeight: 1.55 }}>
                {cap.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

