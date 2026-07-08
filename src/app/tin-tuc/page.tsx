"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const categories = [
  "Tất cả",
  "Tin PSD Group",
  "Tin dự án",
  "Truyền thông & Báo chí",
  "Hoạt động cộng đồng",
  "Góc nhìn & Chia sẻ",
];

type NewsItem = {
  id: string;
  slug: string;
  category: string;
  label: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  status: string;
  visible: boolean;
};

export default function NewsPage() {
  const [active, setActive] = useState("Tất cả");
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/tin-tuc?status=published")
      .then((r) => r.json())
      .then((data: NewsItem[]) => setNews(data.filter((n) => n.visible)))
      .catch(() => {});
  }, []);

  const filtered = active === "Tất cả" ? news : news.filter((n) => n.category === active);
  const featured = filtered[0];
  const second = filtered[1];
  const rest = filtered.slice(2);

  return (
    <main style={{ paddingTop: 68, background: "#fff", minHeight: "100vh" }}>

      {/* Page title */}
      <div style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 56, paddingBottom: 32 }}>
        <h1 style={{
          fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 300,
          color: "#1a1a1a", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Tin tức sự kiện
        </h1>
      </div>

      {/* Tab filter — dropdown on mobile, tabs on desktop */}
      <div style={{ position: "sticky", top: 68, zIndex: 10, background: "#fff", borderBottom: "1px solid #e5e5e7" }}>

        {/* Mobile dropdown */}
        <div className="tintuc-tab-mobile">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              border: "none", background: "#fff",
              color: "#1a1a1a", appearance: "none" as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e82127' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Desktop tabs */}
        <div className="tintuc-tab-desktop" style={{ justifyContent: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="tintuc-tab-btn"
              style={{
                color: active === cat ? "#e82127" : "#424d54",
                borderBottom: active === cat ? "2px solid #e82127" : "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Breadcrumb items={[{ label: "Tin tức sự kiện" }]} />

      {/* News grid */}
      <div style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingBottom: 72 }}>

        {filtered.length === 0 && (
          <p style={{ padding: "48px 0", color: "#999", fontSize: 15 }}>Chưa có bài viết trong mục này.</p>
        )}

        {/* Row 1: Featured + Second */}
        {featured && (
          <div className="tintuc-featured-grid" style={{ gridTemplateColumns: second ? undefined : "1fr" }}>

            {/* Featured card */}
            <Link href={`/tin-tuc/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill unoptimized
                  style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>
                    {featured.label}
                  </p>
                  <h2 style={{ fontSize: "clamp(16px, 1.6vw, 22px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 10 }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
                    {featured.date}
                  </p>
                </div>
              </div>
            </Link>

            {/* Second card */}
            {second && (
              <Link href={`/tin-tuc/${second.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#111", flexShrink: 0 }}>
                    <Image
                      src={second.image}
                      alt={second.title}
                      fill unoptimized
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ paddingTop: 18, flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>
                      {second.label}
                    </p>
                    <h2 style={{ fontSize: "clamp(14px, 1.2vw, 18px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 10 }}>
                      {second.title}
                    </h2>
                    <p style={{ fontSize: 12, color: "#999", letterSpacing: "0.04em" }}>{second.date}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Rows 2+: 3-column grid */}
        {rest.length > 0 && (
          <div className="tintuc-three-col">
            {rest.map((item) => (
              <Link key={item.slug} href={`/tin-tuc/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#111", marginBottom: 16 }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill unoptimized
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>
                  {item.label}
                </p>
                <h3 style={{ fontSize: "clamp(13px, 1vw, 15px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: "#999", letterSpacing: "0.04em" }}>{item.date}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 64 }}>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: p === 1 ? "1px solid #1a1a1a" : "1px solid #e5e5e7",
                  background: "transparent", cursor: "pointer",
                  fontSize: 13, fontWeight: p === 1 ? 700 : 400,
                  color: p === 1 ? "#1a1a1a" : "#999",
                }}
              >
                {p}
              </button>
            ))}
            <button style={{
              width: 36, height: 36, borderRadius: "50%", border: "1px solid #e5e5e7",
              background: "transparent", cursor: "pointer", fontSize: 13, color: "#999",
            }}>
              ›
            </button>
            <button style={{
              width: 36, height: 36, borderRadius: "50%", border: "1px solid #e5e5e7",
              background: "transparent", cursor: "pointer", fontSize: 13, color: "#999",
            }}>
              »
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
