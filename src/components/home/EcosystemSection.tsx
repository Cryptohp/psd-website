"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useCallback, useEffect } from "react";
import Image from "next/image";

const VP = { once: true, amount: 0 };

type Company = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  logo: string | null;
  sectorName: string;
};

const CARD_W = 305;

const GAP = 10;
const CARD_STEP = CARD_W + GAP;
const PANEL_W = 260;
const SPEED_DESKTOP = 0.7; // px/frame (matches SectorsSection)
const SPEED_MOBILE = 0.3;  // px/frame (matches SectorsSection mobile)

export default function EcosystemSection({ initialCompanies }: { initialCompanies: Company[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);

  const companies = initialCompanies;

  const REPEAT = companies.length > 0 ? Math.max(6, Math.ceil(12 / companies.length)) : 0;
  const looped = companies.length > 0 ? Array.from({ length: REPEAT }, () => companies).flat() : [];
  const SET_WIDTH = companies.length * CARD_STEP;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || companies.length === 0) return;

    const speed = window.matchMedia("(max-width: 767px)").matches ? SPEED_MOBILE : SPEED_DESKTOP;
    let animId: number;
    const tick = () => {
      if (!isPaused.current) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= SET_WIDTH) el.scrollLeft -= SET_WIDTH;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const handleTouchMove = (e: TouchEvent) => {
      const dx = touchStartX.current - e.touches[0].clientX;
      el.scrollLeft = touchScrollLeft.current + dx;
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [companies, SET_WIDTH]);

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
    <section className="bg-[#f8f8f8] py-[30px]" ref={ref}>
      <style>{`
        @media (max-width: 767px) {
          .eco-layout { flex-direction: column !important; }
          .eco-panel { width: 100% !important; padding: 24px 20px !important; }
          .eco-scroll-wrapper { margin-left: 0 !important; }
          .eco-scroll-inner { padding-left: 16px !important; }
          .eco-nav-btns { top: auto !important; bottom: 12px !important; }
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: "1300px", paddingLeft: "16px", paddingRight: "16px" }}>
        <div className="eco-layout flex items-stretch">

          {/* LEFT — panel mô tả */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.7 }}
            className="eco-panel flex-shrink-0 bg-white flex flex-col justify-center px-8 border border-[#e8e8e8]"
            style={{ width: PANEL_W, zIndex: 2 }}
          >
            <div className="w-8 h-[2px] bg-[#e82127] mb-5" />
            <h2 className="mb-5 leading-tight">
              <span className="block font-light uppercase tracking-widest text-[#1a1a1a] text-[22px] whitespace-nowrap">Hệ sinh thái</span>
              <span className="block font-bold uppercase tracking-widest text-[#e82127] text-[22px] whitespace-nowrap">PSD Group</span>
            </h2>
            <p className="text-[13px] text-[#666] leading-relaxed mb-8">
              Các công ty thành viên vận hành cộng hưởng, bổ trợ lẫn nhau để tạo ra giá trị
              lớn hơn tổng các phần.
            </p>
            <div className="eco-scroll-hint flex flex-col items-center gap-2 mb-5 w-full">
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

          {/* RIGHT — scroll container */}
          <div
            className="eco-scroll-wrapper flex-1 relative overflow-hidden"
            style={{ zIndex: 1, marginLeft: `-${PANEL_W}px` }}
          >
            {/* Nút điều hướng */}
            <div className="eco-nav-btns absolute top-3 right-0 z-20 flex gap-1.5">
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

            <div
              ref={scrollRef}
              onTouchStart={(e) => {
                isPaused.current = true;
                touchStartX.current = e.touches[0].clientX;
                touchScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
              }}
              onTouchEnd={() => { setTimeout(() => { isPaused.current = false; }, 1200); }}
              className="eco-scroll-inner-wrap"
              style={{ overflowX: "scroll", overflowY: "hidden", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" as never, touchAction: "pan-x" }}
            >
              <div
                className="eco-scroll-inner flex items-stretch"
                style={{ width: "max-content", gap: GAP, paddingLeft: PANEL_W, paddingTop: 12, paddingBottom: 12 }}
              >
                {looped.map((company, i) => (
                  <div
                    key={i}
                    style={{
                      width: CARD_W,
                      flexShrink: 0,
                      boxShadow: "0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
                    }}
                    className="eco-card group"
                  >
                    <Link href={`/linh-vuc-hoat-dong/${company.slug}`} className="flex flex-col h-full relative overflow-hidden block">

                      {/* Red top accent */}
                      <div className="h-[3px] bg-[#e82127] w-full relative z-10" />

                      {/* Image */}
                      <div className="relative h-[200px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="305px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[48px] font-bold text-[#e82127] opacity-15">{company.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className="flex flex-col flex-1 bg-white relative overflow-hidden"
                        style={{ padding: "30px 24px" }}
                      >
                        <div className="absolute inset-0 bg-[#e82127] -translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-in-out z-0" />

                        <span className="inline-block self-start px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border border-[#e82127] text-[#e82127] group-hover:border-white group-hover:text-white group-active:border-white group-active:text-white mb-3 relative z-10 transition-colors duration-300">
                          {company.sectorName}
                        </span>

                        <h3
                          className="font-bold uppercase tracking-wider text-[#1a1a1a] group-hover:text-white group-active:text-white mb-3 leading-tight relative z-10 transition-colors duration-300"
                          style={{ fontSize: "15px" }}
                        >
                          {company.name}
                        </h3>
                        <p className="text-[13px] text-[#666] group-hover:text-white/90 group-active:text-white/90 leading-relaxed flex-1 relative z-10 transition-colors duration-300">
                          {company.shortDesc ?? ""}
                        </p>
                      </div>

                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
