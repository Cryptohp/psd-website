"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

export const HEADER_H = 68;

const navItems = [
  { label: "TRANG CHỦ", href: "/" },
  {
    label: "VỀ PSD GROUP",
    href: "/ve-psd-group",
    subs: [
      { label: "Giới thiệu chung",           href: "/ve-psd-group" },
      { label: "Ban lãnh đạo & Đội ngũ",   href: "/ve-psd-group/ban-lanh-dao" },
      { label: "Tầm nhìn & Sứ mệnh",        href: "/ve-psd-group/tam-nhin-su-menh" },
{ label: "Văn hóa doanh nghiệp",       href: "/ve-psd-group/van-hoa-doanh-nghiep" },
      { label: "Hành trình phát triển",      href: "/ve-psd-group/hanh-trinh-phat-trien" },
    ],
  },
  { label: "LĨNH VỰC HOẠT ĐỘNG", href: "/linh-vuc-hoat-dong" },
  { label: "DỰ ÁN & CÔNG TY THÀNH VIÊN", href: "/du-an" },
  { label: "PHỤNG SỰ XÃ HỘI",     href: "/phat-trien-ben-vung" },
  { label: "TIN TỨC",             href: "/tin-tuc" },
];

const secondaryLinks = [
  { label: "TUYỂN DỤNG", href: "/tuyen-dung" },
  { label: "LIÊN HỆ",    href: "/lien-he" },
];

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <rect y="0"   width="22" height="2.2" rx="1.1" fill={color}/>
      <rect y="6.9" width="22" height="2.2" rx="1.1" fill={color}/>
      <rect y="13.8" width="22" height="2.2" rx="1.1" fill={color}/>
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="2" y1="2" x2="18" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="2" x2="2"  y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const activeNav  = navItems.find(item => isActive(item.href));
  const hoveredNav = navItems.find(item => item.href === hoveredHref);
  const subs       = (hoveredNav ?? activeNav)?.subs ?? [];

  const iconColor = menuOpen ? "#fff" : "#1a1a1a";

  return (
    <>
      {/* ── TOP BAR ── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: HEADER_H,
          background: menuOpen ? "#e82127" : "#fff",
          borderBottom: menuOpen ? "none" : "1px solid #e8e8e8",
          zIndex: 300,
          isolation: "isolate",
          transition: "background 0.22s, border-color 0.22s",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center",
          height: "100%", padding: "0 28px",
          position: "relative",
        }}>

          {/* LEFT — hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 0", flexShrink: 0,
            }}
          >
            {menuOpen ? <CloseIcon color="#fff" /> : <HamburgerIcon color="#1a1a1a" />}
          </button>

          {/* CENTER — logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", alignItems: "center",
            }}
          >
            {/* Mobile closed: logo-full với multiply để tách nền trắng */}
            {!menuOpen && (
              <img
                src="/logo-full.jpg"
                alt="PSD Group"
                className="md:hidden"
                style={{
                  height: 57, width: "auto", objectFit: "contain",
                  mixBlendMode: "multiply",
                }}
              />
            )}
            {/* Desktop: logo-horizontal luôn */}
            <img
              src="/logo-horizontal.png"
              alt="PSD Group"
              className="hidden md:block"
              style={{
                height: 42, width: "auto", objectFit: "contain",
                filter: menuOpen ? "brightness(0) invert(1)" : "none",
                transition: "filter 0.22s",
              }}
            />
          </Link>

          {/* RIGHT — search + lang */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button
              aria-label="Tìm kiếm"
              style={{
                display: "flex", alignItems: "center",
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 8px", borderRadius: 4,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = menuOpen ? "rgba(0,0,0,0.12)" : "#f5f5f5")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Search size={25} color={iconColor} />
            </button>

            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 7px", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.1em", color: menuOpen ? "rgba(255,255,255,0.5)" : "#aaa",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = menuOpen ? "#fff" : "#1a1a1a")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = menuOpen ? "rgba(255,255,255,0.5)" : "#aaa")}
              >EN</button>
              <span style={{ color: menuOpen ? "rgba(255,255,255,0.2)" : "#e0e0e0", fontSize: 11 }}>|</span>
              <button
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 7px", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.1em", color: menuOpen ? "#fff" : "#e82127",
                  transition: "color 0.15s",
                }}
              >VI</button>
            </div>
          </div>

        </div>
      </header>

      {/* ── MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: HEADER_H, left: 0, right: 0, bottom: 0,
              background: "#fff",
              zIndex: 200,
              display: "flex",
              alignItems: "flex-start",
              overflow: "hidden",
            }}
          >
            {/* Watermark — logo mờ góc phải dưới */}
            <div style={{
              position: "absolute", right: 0, bottom: 0,
              width: "34%", height: "52%",
              backgroundImage: "url(/logo-psd.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "90% 90%",
              backgroundSize: "contain",
              opacity: 0.055,
              filter: "grayscale(1)",
              pointerEvents: "none",
            }} />

            {/* Nav content */}
            <div style={{
              position: "relative", zIndex: 1,
              width: "100%",
              padding: "30px 0 0 clamp(15px, 7vw, 100px)",
              overflowY: "auto",
              maxHeight: "100%",
            }}>
              <div className="flex flex-col md:flex-row md:items-start" style={{ gap: "clamp(52px, 7vw, 110px)" }}>

              {/* Main links */}
              <nav>
                {navItems.map((item, i) => {
                  const active = isActive(item.href);
                  const itemSubs = item.subs ?? [];
                  const mobileExpanded = expandedHref === item.href;
                  const isHovered = hoveredHref === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: 0.04 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Mobile parent: tap toggles subs */}
                      <div
                        className="flex items-center gap-2 md:hidden"
                        onClick={() => {
                          if (itemSubs.length > 0) {
                            setExpandedHref(mobileExpanded ? null : item.href);
                          } else {
                            setMenuOpen(false);
                            window.location.href = item.href;
                          }
                        }}
                        style={{
                          fontSize: "clamp(16px, 1.8vw, 22px)",
                          fontWeight: 400,
                          color: active || mobileExpanded ? "#e82127" : "#a7a7a7",
                          cursor: "pointer",
                          lineHeight: 1.3,
                          padding: "clamp(7px, 0.85vw, 13px) 0",
                          transition: "color 0.15s",
                          userSelect: "none",
                        }}
                      >
                        <span>{item.label}</span>
                        {itemSubs.length > 0 && (
                          <span style={{
                            fontSize: 9, opacity: 0.6,
                            transform: mobileExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            display: "inline-block",
                            lineHeight: 1,
                          }}>▼</span>
                        )}
                      </div>

                      {/* Desktop parent: hover behavior */}
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="hidden md:block"
                        onMouseEnter={(e) => {
                          setHoveredHref(item.href);
                          if (!active) (e.currentTarget as HTMLElement).style.color = "#e82127";
                        }}
                        onMouseLeave={(e) => {
                          setHoveredHref(null);
                          if (!active) (e.currentTarget as HTMLElement).style.color = "#a7a7a7";
                        }}
                        style={{
                          fontSize: "clamp(16px, 1.8vw, 22px)",
                          fontWeight: 400,
                          color: active ? "#e82127" : "#a7a7a7",
                          textDecoration: "none",
                          lineHeight: 1.3,
                          padding: "clamp(7px, 0.85vw, 13px) 0",
                          transition: "color 0.15s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </Link>

                      {/* Mobile inline sub-links — expand on tap */}
                      {itemSubs.length > 0 && mobileExpanded && (
                        <div className="md:hidden" style={{ paddingLeft: 16, paddingBottom: 8 }}>
                          {itemSubs.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMenuOpen(false)}
                              style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: pathname === sub.href ? 700 : 400,
                                color: pathname === sub.href ? "#e82127" : "#bbb",
                                textDecoration: "none",
                                padding: "5px 0",
                                transition: "color 0.15s",
                              }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e82127")}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = pathname === sub.href ? "#e82127" : "#bbb")}
                            >
                              — {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Secondary links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42, duration: 0.25 }}
                  style={{
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                >
                  {secondaryLinks.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "block",
                        fontSize: "clamp(16px, 1.8vw, 22px)",
                        fontWeight: 400,
                        color: isActive(item.href) ? "#e82127" : "#a7a7a7",
                        textDecoration: "none",
                        lineHeight: 1.3,
                        padding: "clamp(7px, 0.85vw, 13px) 0",
                        transition: "color 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e82127")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = isActive(item.href) ? "#e82127" : "#a7a7a7")}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              </nav>

              {/* Sub-links column — desktop only */}
              <AnimatePresence mode="wait">
                {subs.length > 0 && (
                  <motion.div
                    key={hoveredHref ?? "active"}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    className="hidden md:block"
                    style={{ paddingTop: "clamp(56px, 5.5vw, 70px)", minWidth: 230 }}
                  >
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      color: "#d0d0d0", marginBottom: 14,
                    }}>
                      {(hoveredNav ?? activeNav)?.label}
                    </div>
                    {subs.map((sub, i) => (
                      <motion.div
                        key={sub.href}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.18 }}
                      >
                        <Link
                          href={sub.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: "block",
                            fontSize: "clamp(13px, 1.4vw, 16px)",
                            fontWeight: pathname === sub.href ? 700 : 400,
                            color: pathname === sub.href ? "#e82127" : "#999",
                            textDecoration: "none",
                            padding: "clamp(5px, 0.55vw, 8px) 0",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e82127")}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = pathname === sub.href ? "#e82127" : "#999")}
                        >
                          {sub.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
