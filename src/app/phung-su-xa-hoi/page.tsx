import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Phụng sự xã hội – PSD Group",
  description: "Triết lý phụng sự và cam kết phát triển bền vững của PSD Group — văn hóa là gốc rễ, phụng sự là đích đến.",
};

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80";

export default async function PhungSuPage() {
  const pillars = await prisma.socialProject.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <main style={{ paddingTop: 68 }}>

      <Breadcrumb items={[{ label: "Phụng sự xã hội" }]} />

      {/* Philosophy */}
      <div style={{ position: "relative", overflow: "hidden", background: "#0d0d10", paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: "clamp(56px, 6vw, 96px)", paddingBottom: "clamp(56px, 6vw, 96px)" }}>

        <Image
          src="/van-hoa-le-hoi.png"
          alt=""
          fill
          priority
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center", opacity: 0.45, filter: "blur(1px)", transform: "scale(1.05)" }}
        />

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,13,16,0.78) 0%, rgba(13,13,16,0.55) 50%, rgba(13,13,16,0.72) 100%)" }} />

        <div className="ptbv-philosophy-grid" style={{ position: "relative" }}>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 3, height: 40, background: "#e82127", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#e82127" }}>
                Triết lý phụng sự
              </span>
            </div>

            <div style={{ fontSize: 72, lineHeight: 0.7, color: "rgba(232,33,39,0.3)", fontFamily: "Georgia, serif", marginBottom: 12 }}>&ldquo;</div>

            <h2 className="ptbv-philosophy-h2" style={{ fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 4, letterSpacing: "-0.01em" }}>
              Lấy kinh tế nuôi dưỡng văn hóa —<br />
              <span style={{ color: "#e82127" }}>Lấy văn hóa dẫn dắt kinh tế</span>
            </h2>
            <div style={{ fontSize: 72, lineHeight: 0.7, color: "rgba(232,33,39,0.3)", fontFamily: "Georgia, serif", textAlign: "right" as const, marginBottom: 24 }}>&rdquo;</div>

            <div style={{ width: 48, height: 2, background: "#e82127", marginBottom: 28 }} />

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 16 }}>
              PSD Group tin rằng phát triển kinh tế phải song hành cùng trách nhiệm với cộng đồng và bản sắc dân tộc.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 16 }}>
              Từ thành quả kinh doanh, PSD Group dành nguồn lực để đồng hành cùng các hoạt động văn hóa – xã hội, xem đó là một phần trong sứ mệnh phụng sự lâu dài.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9 }}>
              Với PSD Group, mỗi dự án kinh tế không chỉ tạo ra giá trị tăng trưởng, mà còn góp phần nuôi dưỡng văn hóa, lan tỏa tinh thần nhân văn và kiến tạo nền tảng phát triển bền vững cho tương lai.
            </p>
          </div>

          {/* Trống đồng */}
          <div className="ptbv-drum">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trong-dong.png"
              alt="Trống đồng Việt Nam"
              className="ptbv-drum-inner"
              style={{ animation: "slow-spin 30s linear infinite", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(232,33,39,0.35))" }}
            />
          </div>

        </div>
      </div>

      {/* Pillars */}
      {pillars.length > 0 && (
        <div style={{ background: "#fff", paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 72, paddingBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#e82127", marginBottom: 12 }}>
            Các sáng kiến & Dự án
          </p>
          <h2 style={{ fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
            Cam kết bền vững trong hành động
          </h2>

          {/* Row 1: featured + second */}
          {pillars.length >= 2 && (
            <div className="ptbv-featured-grid">
              {/* Featured */}
              <div>
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
                  <Image src={pillars[0].thumbnail || FALLBACK_IMAGE} alt={pillars[0].title} fill unoptimized style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>{pillars[0].label}</p>
                    <h3 style={{ fontSize: "clamp(16px, 1.6vw, 22px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, textTransform: "uppercase" as const, letterSpacing: "0.02em", marginBottom: 10 }}>{pillars[0].title}</h3>
                    {pillars[0].shortDesc && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{pillars[0].shortDesc}</p>}
                  </div>
                </div>
              </div>

              {/* Second */}
              <div style={{ display: "flex", flexDirection: "column" as const }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#111", flexShrink: 0 }}>
                  <Image src={pillars[1].thumbnail || FALLBACK_IMAGE} alt={pillars[1].title} fill unoptimized style={{ objectFit: "cover" }} />
                </div>
                <div style={{ paddingTop: 18, flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>{pillars[1].label}</p>
                  <h3 style={{ fontSize: "clamp(14px, 1.2vw, 18px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, textTransform: "uppercase" as const, letterSpacing: "0.02em", marginBottom: 10 }}>{pillars[1].title}</h3>
                  {pillars[1].shortDesc && <p style={{ fontSize: 13, color: "#6e6e74", lineHeight: 1.7 }}>{pillars[1].shortDesc}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Row 2: remaining as 3-column grid */}
          {pillars.length > 2 && (
            <div className="ptbv-three-col">
              {pillars.slice(2).map((p) => (
                <div key={p.id}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#111", marginBottom: 16 }}>
                    <Image src={p.thumbnail || FALLBACK_IMAGE} alt={p.title} fill unoptimized style={{ objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>{p.label}</p>
                  <h3 style={{ fontSize: "clamp(13px, 1vw, 15px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, textTransform: "uppercase" as const, letterSpacing: "0.02em", marginBottom: 10 }}>{p.title}</h3>
                  {p.shortDesc && <p style={{ fontSize: 13, color: "#6e6e74", lineHeight: 1.7 }}>{p.shortDesc}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Single item fallback */}
          {pillars.length === 1 && (
            <div style={{ maxWidth: 640 }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111", marginBottom: 20 }}>
                <Image src={pillars[0].thumbnail || FALLBACK_IMAGE} alt={pillars[0].title} fill unoptimized style={{ objectFit: "cover" }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#e82127", marginBottom: 10 }}>{pillars[0].label}</p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, textTransform: "uppercase" as const, marginBottom: 10 }}>{pillars[0].title}</h3>
              {pillars[0].shortDesc && <p style={{ fontSize: 14, color: "#6e6e74", lineHeight: 1.7 }}>{pillars[0].shortDesc}</p>}
            </div>
          )}
        </div>
      )}

    </main>
  );
}
