import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const dynamic = "force-dynamic";

type Row = {
  id: string; title: string; label: string; shortDesc: string | null;
  description: string | null; thumbnail: string | null; images: string[];
  order: number; isActive: boolean;
};

async function getProject(id: string): Promise<Row | null> {
  const rows = await prisma.$queryRaw<Row[]>`SELECT * FROM "social_projects" WHERE id = ${id} AND "isActive" = true`;
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getProject(id);
  if (!p) return { title: "Phụng sự xã hội – PSD Group" };
  return {
    title: `${p.title} – PSD Group`,
    description: p.shortDesc ?? undefined,
  };
}

export default async function PhungSuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const siblings = await prisma.$queryRaw<Row[]>`
    SELECT * FROM "social_projects" WHERE "isActive" = true AND id != ${id} ORDER BY "order" ASC LIMIT 4
  `;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section style={{ background: "#111114", paddingTop: 80, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <Link
            href="/phung-su-xa-hoi"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 13, marginBottom: 32, textDecoration: "none" }}
          >
            <ArrowLeft size={14} /> Quay lại Phụng sự xã hội
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            {project.thumbnail && (
              <div style={{ width: 80, height: 80, borderRadius: 12, background: "#1f2937", flexShrink: 0, overflow: "hidden" }}>
                <Image src={project.thumbnail} alt={project.title} width={80} height={80} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              {project.label && (
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#e82127", marginBottom: 10,
                  border: "1px solid rgba(232,33,39,0.4)", padding: "3px 10px", borderRadius: 4,
                }}>
                  {project.label}
                </span>
              )}
              <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>
                {project.title}
              </h1>
              {project.shortDesc && (
                <p style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.7, maxWidth: 640 }}>
                  {project.shortDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb items={[
        { label: "Phụng sự xã hội", href: "/phung-su-xa-hoi" },
        { label: project.title },
      ]} />

      {/* Content */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 48, alignItems: "start" }}>

          {/* Main */}
          <div>
            {/* Image grid */}
            {project.images && project.images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 40 }}>
                {project.images.map((src, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "16/10", borderRadius: 10, overflow: "hidden", background: "#f0f0f0" }}>
                    <Image src={src} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                  </div>
                ))}
              </div>
            )}

            {project.description ? (
              <>
                <div style={{ width: 32, height: 2, background: "#e82127", marginBottom: 20 }} />
                <div
                  className="article-content"
                  style={{ fontSize: 16, color: "#374151", lineHeight: 1.85 }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </>
            ) : (
              <div style={{ padding: "48px 0", textAlign: "center", color: "#9ca3af" }}>
                <p style={{ fontSize: 15 }}>Thông tin đang được cập nhật.</p>
              </div>
            )}

            <div style={{ marginTop: 40 }}>
              <Link
                href="/lien-he"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#e82127", color: "#fff", fontSize: 13, fontWeight: 700,
                  padding: "11px 22px", borderRadius: 8, textDecoration: "none",
                }}
              >
                Liên hệ hợp tác <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{ background: "#f8f8f8", borderRadius: 16, padding: "28px 24px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 16 }}>
                Thông tin dự án
              </p>
              <dl style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {project.label && (
                  <div>
                    <dt style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>Lĩnh vực</dt>
                    <dd style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{project.label}</dd>
                  </div>
                )}
              </dl>
            </div>
            <Link
              href="/phung-su-xa-hoi"
              style={{
                display: "flex", alignItems: "center", gap: 8, marginTop: 16,
                background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: 12,
                padding: "14px 18px", textDecoration: "none",
                fontSize: 13, fontWeight: 600, color: "#374151",
              }}
            >
              <ArrowLeft size={14} /> Xem tất cả dự án
            </Link>
          </div>
        </div>
      </section>

      {/* Dự án liên quan */}
      {siblings.length > 0 && (
        <section style={{ background: "#f8f8f8", padding: "56px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ width: 32, height: 2, background: "#e82127", marginBottom: 12 }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Dự án khác
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {siblings.map(s => (
                <Link
                  key={s.id}
                  href={`/phung-su-xa-hoi/${s.id}`}
                  style={{
                    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12,
                    overflow: "hidden", textDecoration: "none", display: "flex", flexDirection: "column",
                  }}
                >
                  {s.thumbnail && (
                    <div style={{ position: "relative", aspectRatio: "16/9", background: "#f0f0f0" }}>
                      <Image src={s.thumbnail} alt={s.title} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  )}
                  <div style={{ padding: "16px 18px" }}>
                    {s.label && <span style={{ fontSize: 10, fontWeight: 700, color: "#e82127", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>}
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginTop: 6, lineHeight: 1.4 }}>{s.title}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#e82127", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, display: "block" }}>
                      Xem chi tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
