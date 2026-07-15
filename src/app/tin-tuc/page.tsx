"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
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
      <div style={{ padding: "56px clamp(20px,5vw,80px) 32px", textAlign: "center" }}>
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

      {/* Grid */}
      <section style={{ background: "#f8f8f8", padding: "48px clamp(20px,5vw,80px) 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <p style={{ padding: "48px 0", textAlign: "center", color: "#aaa", fontSize: 15, fontStyle: "italic" }}>Chưa có bài viết trong mục này.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }} className="news-grid">
              {paged.map((item) => (
                <div key={item.slug} style={{ background: "#fff", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                  {/* Image */}
                  <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#e0e0e0", flexShrink: 0 }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill unoptimized style={{ objectFit: "cover", transition: "transform 0.4s" }} className="hover:scale-105" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#d0d0d0" }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
                    {/* Category badge */}
                    <span style={{ position: "absolute", top: 14, left: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "#e82127", padding: "3px 8px" }}>
                      {item.label || item.category}
                    </span>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <p style={{ fontSize: 11, color: "#999", marginBottom: 8, letterSpacing: "0.04em" }}>{item.date}</p>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.5, flex: 1, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {item.title}
                    </h3>
                    <Link
                      href={`/tin-tuc/${item.slug}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#e82127", textDecoration: "none", borderTop: "1px solid #f0f0f0", paddingTop: 16 }}
                      className="group"
                    >
                      Xem chi tiết <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 64 }}>
              {page > 1 && <button onClick={() => setPage(p => p - 1)} style={btnStyle(false)}>‹</button>}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} style={btnStyle(p === page)}>{p}</button>
              ))}
              {page < totalPages && <button onClick={() => setPage(p => p + 1)} style={btnStyle(false)}>›</button>}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .news-grid { grid-template-columns: 1fr !important; } }
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
