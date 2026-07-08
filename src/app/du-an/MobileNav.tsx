"use client";

import { useState } from "react";

type Sector = { id: string; title: string };

export default function DuAnMobileNav({ sectors }: { sectors: Sector[] }) {
  const [open, setOpen] = useState(false);

  const handleClick = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sectors-mobile-nav" style={{ background: "#f2f2f2", position: "relative" as const }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", height: 52, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 20px",
          fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
          letterSpacing: "0.07em", color: "#fff", background: "#e82127",
          border: "none", cursor: "pointer",
        }}
      >
        <span>Chọn lĩnh vực</span>
        <span style={{ fontSize: 9, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute" as const, top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderTop: "2px solid #e82127",
        }}>
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              style={{
                width: "100%", display: "block", padding: "14px 20px",
                textAlign: "left" as const, fontSize: 12, fontWeight: 700,
                textTransform: "uppercase" as const, letterSpacing: "0.07em",
                color: "#424d54", background: "transparent",
                border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
