"use client";


import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

const VP = { once: true, amount: 0 };

const sectors = [
  {
    name: "Bất động sản\n& Hạ tầng",
    desc: "Phát triển bất động sản, hạ tầng, nhà ở xã hội và khu đô thị chiến lược.",
    href: "/linh-vuc-hoat-dong/bat-dong-san-ha-tang",
    image: "/bds-hatang.png",
  },
  {
    name: "Sản xuất\n& Công nghiệp",
    desc: "Nhà máy sorbitol, tinh bột, cồn, dầu thực vật, thép và năng lượng sinh khối.",
    href: "/linh-vuc-hoat-dong/san-xuat-cong-nghiep",
    image: "/congnghiep-sanxuat.png",
  },
  {
    name: "Khoáng sản",
    desc: "Phát triển tài nguyên theo định hướng bền vững, cân bằng kinh tế và môi trường.",
    href: "/linh-vuc-hoat-dong/khoang-san",
    image: "/khoangsan.png",
  },
  {
    name: "Logistics",
    desc: "Kết nối chuỗi cung ứng, hạ tầng cảng biển và trung tâm logistics quy mô lớn.",
    href: "/linh-vuc-hoat-dong/logistics-cang-bien",
    image: "/logistics.png",
  },
  {
    name: "Nông nghiệp\n& Thủy sản",
    desc: "An ninh lương thực, nông nghiệp bền vững từ nuôi trồng đến chế biến.",
    href: "/linh-vuc-hoat-dong/nong-nghiep-thuy-san",
    image: "/nongnghiep-thuysan.png",
  },
  {
    name: "Du lịch\n& Sinh thái",
    desc: "Du lịch gắn với di sản văn hóa Việt, nghỉ dưỡng và không gian sinh thái.",
    href: "/linh-vuc-hoat-dong/du-lich-dich-vu-sinh-thai",
    image: "/dulich-sinhthai.png",
  },
  {
    name: "Đầu tư\n& Dịch vụ",
    desc: "M&A, thương mại xuất nhập khẩu, pháp lý và dịch vụ chuyên nghiệp.",
    href: "/linh-vuc-hoat-dong/dau-tu-dich-vu",
    image: "/dautu-dichvu.png",
  },
  {
    name: "Trách nhiệm\nXã hội",
    desc: "Nghiên cứu khoa học, hỗ trợ tái hòa nhập và lan tỏa giá trị nhân văn.",
    href: "/linh-vuc-hoat-dong/trach-nhiem-xa-hoi",
    image: "/trachnhiemxahoi.png",
  },
];

// Nhân đôi để loop liền mạch
const loopedSectors = [...sectors, ...sectors];

const CARD_W = 305;
const GAP = 10;
const CARD_STEP = CARD_W + GAP;
const SET_WIDTH = sectors.length * CARD_STEP; // chiều rộng 1 set gốc
const PANEL_W = 260;
const SPEED = 0.7; // px/frame

export default function SectorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const isPaused = useRef(false);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;

    const tick = () => {
      if (!isPaused.current) {
        el.scrollLeft += SPEED;
        // Reset seamless khi qua hết set 1
        if (el.scrollLeft >= SET_WIDTH) {
          el.scrollLeft -= SET_WIDTH;
        }
        setScrolled(el.scrollLeft > 10);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const pause = (ms = 1500) => {
    isPaused.current = true;
    setTimeout(() => { isPaused.current = false; }, ms);
  };

  const scrollLeft = useCallback(() => {
    pause();
    scrollRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    pause();
    scrollRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-white py-[30px]" ref={ref}>
      <style>{`
        @media (max-width: 767px) {
          .sectors-layout { flex-direction: column !important; }
          .sectors-panel { width: 100% !important; padding: 24px 20px !important; }
          .sectors-scroll-wrapper { margin-left: 0 !important; }
          .sectors-scroll-inner { padding-left: 16px !important; }
          .sectors-nav-btns { top: auto !important; bottom: 12px !important; }
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: "1300px", paddingLeft: "16px", paddingRight: "16px" }}>
        <div className="sectors-layout flex items-stretch">

          {/* LEFT — panel mô tả */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.7 }}
            className="sectors-panel flex-shrink-0 bg-[#f5f5f5] flex flex-col justify-center px-8 border border-[#e8e8e8]"
            style={{
              width: PANEL_W,
              zIndex: 2,
            }}
          >
            <div className="w-8 h-[2px] bg-[#e82127] mb-5" />
            <h2 className="mb-5 leading-tight">
              <span className="block font-light uppercase tracking-widest text-[#1a1a1a] text-[22px] whitespace-nowrap">Lĩnh vực</span>
              <span className="block font-bold uppercase tracking-widest text-[#e82127] text-[22px] whitespace-nowrap">Hoạt động</span>
            </h2>
            <p className="text-[13px] text-[#666] leading-relaxed mb-8">
              PSD Group phát triển đồng bộ các lĩnh vực kinh tế trọng yếu — mỗi mảng là trụ cột
              độc lập và mắt xích bổ trợ cho toàn hệ sinh thái.
            </p>
            <div className="sectors-scroll-hint flex flex-col items-center gap-2 mb-5 w-full">
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.75" y="0.75" width="18.5" height="26.5" rx="9.25" stroke="#aaa" strokeWidth="1.5"/>
                <line x1="10" y1="6" x2="10" y2="11" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div className="flex items-center gap-2 text-[10px] text-[#aaa] uppercase tracking-widest">
                <motion.span animate={{ x: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>←</motion.span>
                <span className="whitespace-nowrap">Trượt để khám phá</span>
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
              </div>
            </div>
            <Link
              href="/linh-vuc-hoat-dong"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#e82127] font-semibold hover:gap-3 transition-all duration-300"
            >
              <span className="whitespace-nowrap">Xem tất cả</span>
              <ArrowRight size={13} />
            </Link>
          </motion.div>

          {/* RIGHT — scroll container đè lên panel qua negative margin */}
          <div
            className="sectors-scroll-wrapper flex-1 relative overflow-hidden"
            style={{ zIndex: 1, marginLeft: `-${PANEL_W}px` }}
          >
            {/* Nút điều hướng */}
            <div className="sectors-nav-btns absolute top-3 right-0 z-20 flex gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 flex items-center justify-center bg-white border border-[#e8e8e8] hover:border-[#e82127] hover:text-[#e82127] text-[#888] transition-all duration-200"
                aria-label="Trượt trái"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 flex items-center justify-center bg-[#e82127] hover:bg-[#c91c21] text-white transition-all duration-200"
                aria-label="Trượt phải"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Scroll container với padding-left = PANEL_W để thẻ bắt đầu sau panel */}
            <div
              ref={scrollRef}
              onMouseEnter={() => { isPaused.current = true; }}
              onMouseLeave={() => { isPaused.current = false; }}
              className="overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="sectors-scroll-inner flex items-stretch"
                style={{ width: "max-content", gap: GAP, paddingLeft: PANEL_W, paddingTop: 12, paddingBottom: 12 }}
              >
                {loopedSectors.map((sector, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                    transition={{ duration: 0.5, delay: Math.min(i, 7) * 0.07 }}
                    style={{
                      width: CARD_W,
                      flexShrink: 0,
                      boxShadow: "0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
                    }}
                    className="sectors-card group"
                  >
                    <Link href={sector.href} className="flex flex-col h-full relative overflow-hidden block">

                      {/* Red top accent */}
                      <div className="h-[3px] bg-[#e82127] w-full relative z-10" />

                      {/* Image */}
                      <div className="relative h-[200px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                        <Image
                          src={sector.image}
                          alt={sector.name.replace("\n", " ")}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="305px"
                        />
                      </div>

                      {/* Content */}
                      <div
                        className="flex flex-col flex-1 bg-white relative overflow-hidden"
                        style={{ padding: "30px 24px" }}
                      >
                        {/* Red overlay từ trên xuống */}
                        <div className="absolute inset-0 bg-[#e82127] -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />

                        <h3
                          className="font-bold uppercase tracking-wider text-[#e82127] group-hover:text-white mb-3 leading-tight whitespace-pre-line relative z-10 transition-colors duration-300"
                          style={{ fontSize: "15px" }}
                        >
                          {sector.name}
                        </h3>
                        <p className="text-[13px] text-[#666] group-hover:text-white/90 leading-relaxed flex-1 relative z-10 transition-colors duration-300">
                          {sector.desc}
                        </p>
                        <div className="mt-5 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1a1a1a] group-hover:text-white font-semibold relative z-10 transition-colors duration-300">
                          Xem thêm
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>

                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

