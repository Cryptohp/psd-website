"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const PAGE_SIZE = 12;

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
  const [page, setPage] = useState(1);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);

  useEffect(() => {
    fetch("/api/tin-tuc/categories")
      .then((r) => r.json())
      .then((data: { name: string }[]) => {
        if (Array.isArray(data)) setCategories(["Tất cả", ...data.map(c => c.name)]);
      })
      .catch(() => {});
    fetch("/api/tin-tuc?status=published")
      .then((r) => r.json())
      .then((data: NewsItem[]) => setNews(data.filter((n) => n.visible)))
      .catch(() => {});
  }, []);

  /* Reset to page 1 when tab changes */
  function handleTab(cat: string) {
    setActive(cat);
    setPage(1);
  }

  const filtered = active === "Tất cả" ? news : news.filter((n) => n.category === active);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main style={{ paddingTop: 68, background: "#fff", minHeight: "100vh" }}>

      {/* Page title */}
      <div style={{ padding: "56px clamp(20px,5vw,80px) 32px" }}>
        <h1 style={{
          fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 300,
          color: "#1a1a1a", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Tin tức sự kiện
        </h1>
      </div>

      {/* Tab filter */}
      <div style={{ position: "sticky", top: 68, zIndex: 10, background: "#fff", borderBottom: "1px solid #e5e5e7" }}>
        {/* Mobile dropdown */}
        <div className="tintuc-tab-mobile">
          <select
            value={active}
            onChange={(e) => handleTab(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              border: "none", background: "#fff", color: "#1a1a1a",
              appearance: "none" as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e82127' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Desktop tabs */}
        <div className="tintuc-tab-desktop" style={{ justifyContent: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTab(cat)}
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

      {/* 3 × 4 grid */}
      <div style={{ padding: "48px clamp(20px,5vw,80px) 72px" }}>
        {filtered.length === 0 ? (
          <p style={{ padding: "48px 0", color: "#999", fontSize: 15 }}>Chưa có bài viết trong mục này.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px 28px",
          }}
            className="news-grid"
          >
            {paged.map((item) => (
              <Link key={item.slug} href={`/tin-tuc/${item.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
                {/* Thumbnail */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#e8e8e8", marginBottom: 16, flexShrink: 0 }}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#d0d0d0" }} />
                  )}
                </div>

                {/* Meta */}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#e82127", marginBottom: 8, textTransform: "uppercase" }}>
                  {item.label || item.category}
                </p>
                <h3 style={{
                  fontSize: "clamp(14px, 1.1vw, 16px)", fontWeight: 700, color: "#1a1a1a",
                  lineHeight: 1.45, letterSpacing: "0.01em", marginBottom: 10, flex: 1,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: "#999", letterSpacing: "0.04em" }}>{item.date}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 64 }}>
            {page > 1 && (
              <button onClick={() => setPage(p => p - 1)} style={btnStyle(false)}>‹</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={btnStyle(p === page)}>{p}</button>
            ))}
            {page < totalPages && (
              <button onClick={() => setPage(p => p + 1)} style={btnStyle(false)}>›</button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .news-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    width: 36, height: 36, borderRadius: "50%",
    border: active ? "1.5px solid #1a1a1a" : "1px solid #e5e5e7",
    background: "transparent", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 700 : 400,
    color: active ? "#1a1a1a" : "#999",
    transition: "border-color 0.2s, color 0.2s",
  };
}
