"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"hidden" | "enter" | "visible" | "leave">("hidden");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Show overlay when user clicks an internal link */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        anchor.getAttribute("target") === "_blank"
      ) return;

      /* Same page — skip */
      const currentPath = window.location.pathname;
      const targetPath = href.split("?")[0].split("#")[0];
      if (targetPath === currentPath) return;

      /* Clear any pending hide */
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);

      setPhase("enter");
      /* Ratchet to visible after transition-in */
      setTimeout(() => setPhase("visible"), 20);

      /* Safety: force-hide after 4 s */
      safetyTimer.current = setTimeout(() => startHide(), 4000);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  /* Hide overlay once Next.js signals the new page is ready */
  useEffect(() => {
    if (phase === "hidden") return;
    startHide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function startHide() {
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setPhase("leave");
    hideTimer.current = setTimeout(() => setPhase("hidden"), 500);
  }

  if (phase === "hidden") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 15, 18, 0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
        opacity: phase === "leave" ? 0 : phase === "visible" ? 1 : 0,
        transition: phase === "leave" ? "opacity 0.45s ease" : "opacity 0.2s ease",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* PSD wordmark */}
      <span
        style={{
          fontFamily: "var(--font-be-vietnam), sans-serif",
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "0.18em",
          color: "#e82127",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        PSD GROUP
      </span>

      {/* Circular spinner — same technique as Vingroup */}
      <svg
        viewBox="25 25 50 50"
        style={{ width: 44, height: 44, animation: "psd-rotate 2s linear infinite" }}
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#e82127"
          strokeWidth="2.5"
          strokeMiterlimit="10"
          style={{ animation: "psd-dash 1.5s ease-in-out infinite", strokeLinecap: "round" }}
        />
      </svg>

      <style>{`
        @keyframes psd-rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes psd-dash {
          0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50%  { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
          100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
        }
      `}</style>
    </div>
  );
}
