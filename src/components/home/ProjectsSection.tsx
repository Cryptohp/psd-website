"use client";


import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const VP = { once: true, amount: 0 };

const categories = ["Tất cả", "Văn hóa", "Công nghiệp", "Logistics", "Du lịch"];

const projects = [
  {
    name: "Văn Minh Việt",
    category: "Văn hóa",
    location: "Hà Nội",
    desc: "Nền tảng số hóa và lan tỏa tri thức, di sản văn hóa Việt đến cộng đồng và thế hệ trẻ trên toàn quốc.",
    status: "Đang triển khai",
    image: "/vanminhviet.png",
    href: "/du-an/van-minh-viet",
  },
  {
    name: "Nhà máy SOFAVI",
    category: "Công nghiệp",
    location: "Miền Bắc",
    desc: "Nhà máy sản xuất sorbitol, tinh bột, cồn và dầu thực vật quy mô công nghiệp.",
    status: "Đang vận hành",
    image: "/sofavi-du-an-tieu-bieu.jpg",
    href: "/du-an/sofavi",
  },
  {
    name: "Tấn Sang Logistics",
    category: "Logistics",
    location: "Toàn quốc",
    desc: "Hệ thống logistics, kho bãi và chuỗi cung ứng kết nối toàn quốc.",
    status: "Đang vận hành",
    image: "/tansang-du-an-tieu-bieu.jpg",
    href: "/du-an/tan-sang-logistics",
  },
  {
    name: "Công ty CP Du lịch Long Việt",
    category: "Du lịch",
    location: "Miền Bắc",
    desc: "Khu du lịch sinh thái văn hóa gắn với di sản và bản sắc Việt Nam.",
    status: "Đang phát triển",
    image: "/longviet-du-an-tieu-bieu.jpg",
    href: "/du-an/long-viet",
  },
  {
    name: "Công ty CP Xây dựng cầu đường hạ tầng và khoáng sản Thăng Long",
    category: "Khoáng sản",
    location: "Toàn quốc",
    desc: "Khai thác và chế biến khoáng sản theo định hướng bền vững, cân bằng kinh tế và môi trường.",
    status: "Đang vận hành",
    image: "/thanglong.jpg",
    href: "/du-an/thang-long",
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filtered =
    activeTab === "Tất cả"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <section className="bg-white py-[60px]" ref={ref}>
      <div className="container-psd">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 3, background: "#e82127", borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#e82127" }}>
                Dự án tiêu biểu
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(24px, 2.4vw, 36px)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.15, margin: 0 }}>
              Những dự án <span style={{ color: "#e82127" }}>tạo dấu ấn</span>
            </h2>
          </div>
          {/* Desktop only "Xem tất cả" */}
          <Link
            href="/du-an"
            className="hidden md:inline-flex group relative items-center gap-2 border border-[#e82127] text-[#e82127] font-semibold px-5 py-2 rounded-lg overflow-hidden transition-colors duration-300 text-[13px] hover:text-white"
          >
            <span className="absolute inset-0 bg-[#e82127] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative">Xem tất cả</span>
            <ArrowRight size={14} className="relative" />
          </Link>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{ display: "flex", gap: 4, marginBottom: 28, overflowX: "auto", paddingBottom: 2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                flexShrink: 0,
                padding: "7px 18px",
                fontSize: 13,
                fontWeight: 600,
                border: activeTab === cat ? "1.5px solid #e82127" : "1.5px solid #e0e0e0",
                background: activeTab === cat ? "#e82127" : "transparent",
                color: activeTab === cat ? "#fff" : "#555",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== cat) {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e82127";
                  (e.currentTarget as HTMLElement).style.color = "#e82127";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== cat) {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0";
                  (e.currentTarget as HTMLElement).style.color = "#555";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── MOBILE: horizontal scroll row ── */}
        <div className="md:hidden -mx-5">
          <div style={{ overflowX: "auto", scrollbarWidth: "none", display: "flex", gap: 12, padding: "0 20px 4px" }}>
            {filtered.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                style={{ flexShrink: 0, width: 240, textDecoration: "none", display: "block" }}
              >
                <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#eee" }}>
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="240px"
                  />
                </div>
                <div style={{ padding: "12px 0 0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#e82127", marginBottom: 4 }}>
                    {project.category}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, margin: "0 0 4px" }}>
                    {project.name}
                  </h3>
                  <p style={{
                    fontSize: 12, color: "#888", lineHeight: 1.5, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>
                    {project.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* Mobile "Xem tất cả" at bottom */}
          <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
            <Link
              href="/du-an"
              className="group relative inline-flex items-center gap-2 border border-[#e82127] text-[#e82127] font-semibold px-5 py-2 rounded-lg overflow-hidden transition-colors duration-300 text-[13px] hover:text-white"
            >
              <span className="absolute inset-0 bg-[#e82127] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="relative">Xem tất cả dự án</span>
              <ArrowRight size={14} className="relative" />
            </Link>
          </div>
        </div>

        {/* ── DESKTOP: grid layout ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="hidden md:block"
          >
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", padding: "60px 0", fontSize: 15 }}>
                Không có dự án nào trong danh mục này.
              </div>
            ) : (
              <ul style={{ display: "flex", flexWrap: "wrap" as const, margin: "0 -12px", padding: 0, listStyle: "none" }}>

                {/* Featured item — 66.667% width */}
                {featured && (
                  <li style={{ width: "66.6666%", padding: "0 12px 24px" }}>
                    <Link href={featured.href} className="group" style={{ display: "block", textDecoration: "none", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "relative", paddingTop: "62%", overflow: "hidden", background: "#eee" }}>
                        <Image src={featured.image} alt={featured.name} fill style={{ objectFit: "cover", transition: "transform 0.55s ease" }} className="group-hover:scale-[1.06]" sizes="67vw" />
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, width: "55%", padding: "20px 24px", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(2px)" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#e82127", marginBottom: 6 }}>{featured.category}</div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, margin: 0, transition: "color 0.18s" }} className="group-hover:text-[#e82127]">{featured.name}</h3>
                        <p style={{ fontSize: 13, color: "#666", marginTop: 6, marginBottom: 0, lineHeight: 1.55 }}>{featured.desc}</p>
                      </div>
                    </Link>
                  </li>
                )}

                {/* Regular items — 33.333% each */}
                {rest.map((project) => (
                  <li key={project.href} style={{ width: "33.3333%", padding: "0 12px 24px" }}>
                    <Link href={project.href} className="group" style={{ display: "block", textDecoration: "none" }}>
                      <div style={{ position: "relative", paddingTop: "66%", overflow: "hidden", background: "#eee" }}>
                        <Image src={project.image} alt={project.name} fill style={{ objectFit: "cover", transition: "transform 0.55s ease" }} className="group-hover:scale-[1.06]" sizes="33vw" />
                      </div>
                      <div style={{ padding: "14px 0 0" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#e82127", marginBottom: 6 }}>{project.category}</div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, margin: "0 0 6px", transition: "color 0.18s" }} className="group-hover:text-[#e82127]">{project.name}</h3>
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{project.desc}</p>
                      </div>
                    </Link>
                  </li>
                ))}

                {featured && rest.length === 0 && (
                  <li style={{ width: "33.3333%", padding: "0 12px 24px" }}>
                    <Link href="/du-an" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, border: "1.5px dashed #ddd", borderRadius: 4, fontSize: 14, fontWeight: 600, color: "#888", textDecoration: "none", gap: 6, transition: "color 0.18s, border-color 0.18s" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "#e82127"; el.style.borderColor = "#e82127"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "#888"; el.style.borderColor = "#ddd"; }}
                    >
                      Xem tất cả dự án <ArrowRight size={14} />
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

