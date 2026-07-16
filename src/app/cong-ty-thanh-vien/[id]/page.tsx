import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, ArrowLeft, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/ui/Breadcrumb";

const sectorSlugMap: Record<string, string> = {
  "Bất động sản & Hạ tầng": "bat-dong-san-ha-tang",
  "Sản xuất & Công nghiệp": "san-xuat-cong-nghiep",
  "Khoáng sản": "khoang-san",
  "Logistics & Cảng biển": "logistics-cang-bien",
  "Nông nghiệp & Thủy sản": "nong-nghiep-thuy-san",
  "Du lịch & Sinh thái": "du-lich-dich-vu-sinh-thai",
  "Đầu tư & Dịch vụ": "dau-tu-dich-vu",
  "Trách nhiệm xã hội": "trach-nhiem-xa-hoi",
};

async function getCompany(id: string) {
  const company = await prisma.company.findUnique({
    where: { id },
    include: { sector: true },
  });
  return company;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) return { title: "Công ty thành viên" };
  return {
    title: `${company.name} – Hệ sinh thái PSD Group`,
    description: company.shortDesc ?? undefined,
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company || !company.isActive) notFound();

  const sectorName = company.sector?.name ?? "";
  const sectorSlug = sectorSlugMap[sectorName];

  // Các công ty khác cùng lĩnh vực
  const siblings = company.sectorId
    ? await prisma.company.findMany({
        where: { sectorId: company.sectorId, isActive: true, NOT: { id } },
        orderBy: { order: "asc" },
        take: 4,
      })
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section style={{ background: "#111114", paddingTop: 80, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <Link
            href={sectorSlug ? `/linh-vuc-hoat-dong/${sectorSlug}` : "/linh-vuc-hoat-dong"}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 13, marginBottom: 32, textDecoration: "none" }}
          >
            <ArrowLeft size={14} /> Quay lại {sectorName || "Lĩnh vực & Công ty thành viên"}
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            {/* Logo */}
            <div style={{
              width: 80, height: 80, borderRadius: 12, background: "#1f2937",
              border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {company.logo ? (
                <Image src={company.logo} alt={company.name} width={80} height={80} style={{ objectFit: "contain" }} />
              ) : (
                <Building2 size={32} color="#4b5563" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {sectorName && (
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#e82127", marginBottom: 10,
                  border: "1px solid rgba(232,33,39,0.4)", padding: "3px 10px", borderRadius: 4,
                }}>
                  {sectorName}
                </span>
              )}
              <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>
                {company.name}
              </h1>
              {company.shortDesc && (
                <p style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.7, maxWidth: 640 }}>
                  {company.shortDesc}
                </p>
              )}
              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "#e82127", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                >
                  <Globe size={14} /> {company.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb items={[
        { label: "Lĩnh vực & Công ty thành viên", href: "/linh-vuc-hoat-dong" },
        ...(sectorName && sectorSlug ? [{ label: sectorName, href: `/linh-vuc-hoat-dong/${sectorSlug}` }] : []),
        { label: company.name },
      ]} />

      {/* Content */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>

          {/* Main */}
          <div>
            {company.description ? (
              <>
                <div style={{ width: 32, height: 2, background: "#e82127", marginBottom: 20 }} />
                <div
                  style={{ fontSize: 16, color: "#374151", lineHeight: 1.85 }}
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              </>
            ) : (
              <div style={{ padding: "48px 0", textAlign: "center", color: "#9ca3af" }}>
                <Building2 size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                <p style={{ fontSize: 15 }}>Thông tin đang được cập nhật.</p>
              </div>
            )}

            <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#e82127", color: "#fff", fontSize: 13, fontWeight: 700,
                    padding: "11px 22px", borderRadius: 8, textDecoration: "none",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Globe size={14} /> Truy cập website
                </a>
              )}
              <Link
                href="/lien-he"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  border: "1.5px solid #e82127", color: "#e82127", fontSize: 13, fontWeight: 700,
                  padding: "11px 22px", borderRadius: 8, textDecoration: "none",
                  letterSpacing: "0.05em",
                }}
              >
                Liên hệ hợp tác <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{ background: "#f8f8f8", borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 16 }}>
                Thông tin công ty
              </p>
              <dl style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {sectorName && (
                  <div>
                    <dt style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>Lĩnh vực</dt>
                    <dd style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{sectorName}</dd>
                  </div>
                )}
                {company.website && (
                  <div>
                    <dt style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>Website</dt>
                    <dd>
                      <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#e82127", textDecoration: "none" }}>
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Back to sector */}
            {sectorSlug && (
              <Link
                href={`/linh-vuc-hoat-dong/${sectorSlug}`}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: 12,
                  padding: "14px 18px", textDecoration: "none",
                  fontSize: 13, fontWeight: 600, color: "#374151",
                }}
              >
                <ArrowLeft size={14} />
                Xem lĩnh vực {sectorName}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Công ty cùng lĩnh vực */}
      {siblings.length > 0 && (
        <section style={{ background: "#f8f8f8", padding: "56px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ width: 32, height: 2, background: "#e82127", marginBottom: 12 }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Công ty cùng lĩnh vực
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {siblings.map(s => (
                <Link
                  key={s.id}
                  href={`/cong-ty-thanh-vien/${s.id}`}
                  style={{
                    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12,
                    padding: "20px 18px", textDecoration: "none",
                    display: "flex", flexDirection: "column", gap: 8,
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0f0f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {s.logo ? (
                        <Image src={s.logo} alt={s.name} width={36} height={36} style={{ objectFit: "contain" }} />
                      ) : (
                        <Building2 size={16} color="#9ca3af" />
                      )}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>{s.name}</p>
                  </div>
                  {s.shortDesc && (
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {s.shortDesc}
                    </p>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#e82127", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                    Xem chi tiết →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
