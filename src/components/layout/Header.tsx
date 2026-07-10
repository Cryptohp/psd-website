"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, X, Home, Building2, LayoutGrid, Briefcase,
  Heart, Newspaper, Users, Phone, ChevronRight, ChevronDown,
  MapPin, Mail, ArrowRight, Handshake,
} from "lucide-react";

export const HEADER_H = 68;

const navItems = [
  { label: "TRANG CHỦ",                  href: "/",                    Icon: Home       },
  { label: "VỀ PSD GROUP",               href: "/ve-psd-group",        Icon: Building2,
    subs: [
      { label: "Giới thiệu chung",         href: "/ve-psd-group" },
      { label: "Ban lãnh đạo & Đội ngũ",  href: "/ve-psd-group/ban-lanh-dao" },
      { label: "Tầm nhìn & Sứ mệnh",      href: "/ve-psd-group/tam-nhin-su-menh" },
      { label: "Văn hóa doanh nghiệp",    href: "/ve-psd-group/van-hoa-doanh-nghiep" },
      { label: "Hành trình phát triển",   href: "/ve-psd-group/hanh-trinh-phat-trien" },
    ],
  },
  { label: "LĨNH VỰC HOẠT ĐỘNG",         href: "/linh-vuc-hoat-dong",  Icon: LayoutGrid },
  { label: "DỰ ÁN & CÔNG TY THÀNH VIÊN", href: "/du-an",               Icon: Briefcase  },
  { label: "PHỤNG SỰ XÃ HỘI",            href: "/phat-trien-ben-vung", Icon: Heart      },
  { label: "TIN TỨC",                     href: "/tin-tuc",             Icon: Newspaper  },
  { label: "TUYỂN DỤNG",                  href: "/tuyen-dung",          Icon: Users      },
  { label: "LIÊN HỆ",                     href: "/lien-he",             Icon: Phone      },
];

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <rect y="0"    width="22" height="2.2" rx="1.1" fill={color}/>
      <rect y="6.9"  width="22" height="2.2" rx="1.1" fill={color}/>
      <rect y="13.8" width="22" height="2.2" rx="1.1" fill={color}/>
    </svg>
  );
}

// Tất cả các trang có thể tìm kiếm
const allSearchItems = [
  ...navItems.map(({ label, href, Icon }) => ({ label, href, Icon, parent: null as string | null })),
  ...navItems.flatMap(item =>
    (item.subs ?? []).map(sub => ({ label: sub.label, href: sub.href, Icon: item.Icon, parent: item.label }))
  ),
];

export default function Header() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setExpandedHref(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const close = () => { setMenuOpen(false); setExpandedHref(null); setSearchQuery(""); };

  const searchResults = searchQuery.trim().length > 0
    ? allSearchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* ── TOP BAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: HEADER_H,
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        zIndex: 300,
      }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 20px", position: "relative" }}>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Mở menu"
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "6px 0", flexShrink: 0 }}
          >
            <HamburgerIcon color="#1a1a1a" />
          </button>

          {/* Logo center */}
          <Link href="/" onClick={close} style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}>
            <img src="/logo-full.jpg" alt="PSD Group" className="md:hidden" style={{ height: 57, width: "auto", objectFit: "contain", mixBlendMode: "multiply" }} />
            <img src="/logo-horizontal.png" alt="PSD Group" className="hidden md:block" style={{ height: 42, width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Right: search + lang */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <button aria-label="Tìm kiếm" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", display: "flex", alignItems: "center" }}>
              <Search size={20} color="#1a1a1a" />
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 7px", fontSize: 12, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em" }}>EN</button>
              <span style={{ color: "#e0e0e0", fontSize: 11 }}>|</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 7px", fontSize: 12, fontWeight: 700, color: "#e82127", letterSpacing: "0.08em" }}>VI</button>
            </div>
          </div>

        </div>
      </header>

      {/* ── FULL-SCREEN MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", overflow: "hidden" }}
          >

            {/* ── LEFT PANEL (red) ── */}
            <motion.div
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "clamp(100px, 28vw, 300px)",
                background: "linear-gradient(155deg, #c8181f 0%, #8c0c12 55%, #4a0508 100%)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Tagline image overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
                backgroundImage: "linear-gradient(to top, rgba(74,5,8,0) 0%, rgba(74,5,8,0.6) 55%, rgba(74,5,8,1) 100%), url('/tagline-menu02.png')",
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
              }} />

              {/* Content */}
              <div style={{
                position: "relative", zIndex: 1,
                display: "flex", flexDirection: "column", height: "100%",
                padding: "clamp(14px, 3vh, 32px) clamp(10px, 2vw, 28px)",
              }}>

                {/* Logo */}
                <Link href="/" onClick={close} style={{ marginBottom: "clamp(16px, 3vh, 36px)", display: "inline-block" }}>
                  <img
                    src="/logo-horizontal.png"
                    alt="PSD Group"
                    style={{ height: "clamp(24px, 3.5vh, 40px)", width: "auto", maxWidth: "100%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                  />
                </Link>

                {/* Quote + tagline */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "clamp(20px, 3.5vw, 44px)", color: "rgba(255,255,255,0.35)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 2 }}>"</div>
                  <h2 style={{ fontSize: "clamp(11px, 1.8vw, 20px)", fontWeight: 800, color: "#fff", lineHeight: 1.45, marginBottom: "clamp(8px, 1.8vh, 18px)", letterSpacing: "0.01em" }}>
                    Kiến tạo<br />thịnh vượng<br />
                    <span style={{ fontWeight: 400, opacity: 0.85 }}>Phụng sự xã hội</span>
                  </h2>
                  <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.45)", marginBottom: "clamp(8px, 1.8vh, 18px)" }} />
                  <p className="hidden md:block" style={{ fontSize: "clamp(9px, 1vw, 12px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                    PSD Group – Tập đoàn kinh tế đa ngành, kiến tạo giá trị bền vững cho doanh nghiệp, cộng đồng và xã hội.
                  </p>
                </div>

                {/* Contact info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Phone size={10} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(8px, 1.8vw, 11px)", color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>09782 741 534</span>
                  </div>
                  <div className="hidden md:flex" style={{ alignItems: "flex-start", gap: 7 }}>
                    <Mail size={11} color="rgba(255,255,255,0.55)" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(9px, 1vw, 11px)", color: "rgba(255,255,255,0.75)", wordBreak: "break-all" }}>psdgroup.hotmail@gmail.com</span>
                  </div>
                  <div className="hidden md:flex" style={{ alignItems: "flex-start", gap: 7 }}>
                    <MapPin size={11} color="rgba(255,255,255,0.55)" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(9px, 1vw, 11px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>235–237 Khuất Duy Tiến,<br />Đại Mỗ, Hà Nội</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* ── RIGHT PANEL (white) ── */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 16, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
            >

              {/* Top bar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "0 clamp(12px, 2vw, 28px)",
                height: HEADER_H,
                borderBottom: "1px solid #f0f0f0",
              }}>
                <Search size={14} color={searchQuery ? "#e82127" : "#bbb"} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 0, border: "none", outline: "none", fontSize: 13, color: "#333", background: "transparent" }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", flexShrink: 0 }}>
                    <X size={13} color="#bbb" />
                  </button>
                )}

                <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 5px", fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.06em" }}>EN</button>
                  <span style={{ color: "#e8e8e8", fontSize: 10 }}>|</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 5px", fontSize: 11, fontWeight: 700, color: "#e82127", letterSpacing: "0.06em" }}>VI</button>
                </div>

                <button
                  onClick={close}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#e82127", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <X size={13} color="#fff" strokeWidth={2.5} />
                </button>
              </div>

              {/* Search results dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "#fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      zIndex: 10,
                      maxHeight: 320,
                      overflowY: "auto",
                      borderBottom: "2px solid #e82127",
                    }}
                  >
                    {searchResults.map((item, i) => {
                      const Icon = item.Icon;
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={close}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "12px clamp(16px, 3vw, 32px)",
                            textDecoration: "none",
                            borderBottom: "1px solid #f4f4f6",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#fff8f8")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Icon size={15} color="#e82127" strokeWidth={1.6} style={{ flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{item.label}</div>
                            {item.parent && (
                              <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{item.parent}</div>
                            )}
                          </div>
                          <ChevronRight size={13} color="#ddd" style={{ marginLeft: "auto", flexShrink: 0 }} />
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
                {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ padding: "16px clamp(16px, 3vw, 32px)", fontSize: 13, color: "#aaa", borderBottom: "1px solid #f0f0f0", background: "#fff" }}
                  >
                    Không tìm thấy kết quả cho "<strong style={{ color: "#333" }}>{searchQuery}</strong>"
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Nav items */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {navItems.map((item, i) => {
                  const active = isActive(item.href);
                  const subs = item.subs ?? [];
                  const expanded = expandedHref === item.href;
                  const { Icon } = item;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: 0.04 + i * 0.025 }}
                      style={{ borderBottom: "1px solid #f4f4f6" }}
                    >
                      {/* Row */}
                      <div
                        onClick={() => {
                          if (subs.length > 0) {
                            setExpandedHref(expanded ? null : item.href);
                          } else {
                            close();
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Link
                          href={subs.length > 0 ? "#" : item.href}
                          onClick={e => { if (subs.length > 0) e.preventDefault(); }}
                          style={{
                            display: "flex", alignItems: "center",
                            gap: "clamp(8px, 1.5vw, 20px)",
                            padding: "clamp(11px, 1.6vh, 17px) clamp(12px, 2.5vw, 32px)",
                            textDecoration: "none",
                          }}
                        >
                          <Icon size={15} color={active ? "#e82127" : "#c8c8c8"} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                          <span style={{
                            flex: 1,
                            fontSize: "clamp(9px, 1.15vw, 13px)",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase" as const,
                            color: active ? "#e82127" : "#222",
                            lineHeight: 1.3,
                          }}>
                            {item.label}
                          </span>
                          {subs.length > 0
                            ? <ChevronDown size={13} color={active || expanded ? "#e82127" : "#ccc"} style={{ flexShrink: 0, transform: expanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
                            : <ChevronRight size={13} color={active ? "#e82127" : "#ccc"} style={{ flexShrink: 0 }} />
                          }
                        </Link>
                      </div>

                      {/* Sub items */}
                      <AnimatePresence>
                        {subs.length > 0 && expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: "hidden", background: "#fafafa" }}
                          >
                            {subs.map(sub => {
                              const subActive = pathname === sub.href;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={close}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px clamp(16px, 3vw, 32px) 10px clamp(42px, 6vw, 64px)",
                                    textDecoration: "none",
                                    fontSize: "clamp(10px, 1.1vw, 12px)",
                                    fontWeight: subActive ? 700 : 400,
                                    color: subActive ? "#e82127" : "#888",
                                    borderBottom: "1px solid #f0f0f0",
                                    transition: "color 0.15s",
                                  }}
                                >
                                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: subActive ? "#e82127" : "#ccc", flexShrink: 0 }} />
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div style={{
                borderTop: "1px solid #f0f0f0",
                padding: "clamp(10px, 1.6vh, 18px) clamp(12px, 2.5vw, 32px)",
                display: "flex", alignItems: "center", gap: 10,
                flexShrink: 0, background: "#fff",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#fff0f0", border: "1px solid #fddcdc",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Handshake size={14} color="#e82127" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(8px, 1vw, 12px)", fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.03em", lineHeight: 1.3 }}>
                    KẾT NỐI HỢP TÁC CÙNG PSD GROUP
                  </div>
                  <div className="hidden md:block" style={{ fontSize: 11, color: "#b0b0b0", marginTop: 2 }}>
                    Đồng hành phát triển – Kiến tạo tương lai
                  </div>
                </div>
                {/* Mobile: circle arrow */}
                <Link href="/lien-he" onClick={close} className="md:hidden" style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#e82127", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <ArrowRight size={13} color="#fff" />
                </Link>
                {/* Desktop: text button */}
                <Link href="/lien-he" onClick={close} className="hidden md:flex" style={{
                  alignItems: "center", gap: 6,
                  background: "#e82127", color: "#fff",
                  padding: "9px 18px", borderRadius: 6,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
                  textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  LIÊN HỆ NGAY <ArrowRight size={12} />
                </Link>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
