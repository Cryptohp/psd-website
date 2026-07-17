import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Globe, ArrowLeft, ArrowRight, Tag, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/ui/Breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug }, include: { sector: true } });
  if (!company) return { title: "Công ty thành viên – PSD Group" };
  return {
    title: company.seoTitle ?? `${company.name} – PSD Group`,
    description: company.seoDesc ?? company.shortDesc ?? undefined,
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { sector: true, projects: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
  if (!company || !company.isActive) notFound();

  const images: string[] = Array.isArray(company.images) ? (company.images as string[]) : [];

  return (
    <div>
      {/* Hero — full bleed, header floats on top */}
      <div className="relative bg-[#0f0f12] overflow-hidden" style={{ height: "clamp(420px, 60vw, 720px)" }}>
        {company.logo && (
          <Image
            src={company.logo}
            alt={company.name}
            fill
            unoptimized
            style={{ objectFit: "cover", opacity: 1 }}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-psd pb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {company.sector && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[13px] text-white/90">
                  <Tag size={12} />{company.sector.name}
                </span>
              )}
            </div>
            <h1 className="text-[28px] lg:text-[44px] font-bold text-white leading-snug drop-shadow-lg">{company.name}</h1>
            {company.shortDesc && (
              <p className="mt-3 text-[15px] text-white/80 max-w-2xl leading-relaxed drop-shadow">{company.shortDesc}</p>
            )}
          </div>
        </div>
      </div>

      <Breadcrumb items={[{ label: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" }, { label: company.name }]} />

      {/* Content */}
      <div className="bg-white">
        <div className="container-psd py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main */}
            <div className="lg:col-span-8">
              {company.description ? (
                <div
                  className="article-content text-[16px] text-[#444] leading-relaxed mb-10"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              ) : company.shortDesc ? (
                <p className="text-[17px] text-[#6e6e74] leading-relaxed mb-10">{company.shortDesc}</p>
              ) : null}

              {/* Gallery */}
              {images.length > 0 && (
                <>
                  <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-5">Hình ảnh</h2>
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    {images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#f4f4f5]">
                        <div
                          className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Related projects */}
              {company.projects.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Dự án liên quan</h2>
                  <div className="flex flex-wrap gap-3">
                    {company.projects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/du-an/${p.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 card-psd bg-white text-[14px] font-medium text-[#1a1a1a] hover:text-[#e82127] hover:border-[#e82127]/30 transition-colors"
                      >
                        <Building2 size={15} />
                        {p.name}
                        <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Link
                  href="/linh-vuc-hoat-dong"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6e6e74] hover:text-[#e82127] transition-colors"
                >
                  <ArrowLeft size={16} /> Về Lĩnh vực hoạt động
                </Link>
                <Link href="/lien-he" className="btn-primary gap-2 text-[14px]">
                  Liên hệ hợp tác <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-[88px] space-y-5">
                <div className="card-psd p-6 bg-white">
                  <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-4">Thông tin công ty</h3>
                  {[
                    company.sector ? { icon: Tag, label: "Lĩnh vực", value: company.sector.name } : null,
                    { icon: Building2, label: "Thuộc tập đoàn", value: "PSD Group" },
                    company.website ? { icon: Globe, label: "Website", value: company.website } : null,
                  ].filter(Boolean).map((row) => {
                    const { icon: Icon, label, value } = row!;
                    const isWebsite = label === "Website";
                    return (
                      <div key={label} className="flex justify-between gap-3 py-3 border-b border-[#e5e5e7] last:border-0">
                        <span className="flex items-center gap-1.5 text-[13px] text-[#6e6e74] flex-shrink-0">
                          <Icon size={13} />{label}
                        </span>
                        {isWebsite ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-medium text-[#e82127] text-right truncate max-w-[160px] hover:underline"
                          >
                            {value.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="text-[13px] font-medium text-[#1a1a1a] text-right">{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#e82127] rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-[16px] mb-2">Hợp tác cùng {company.name}</h4>
                  <p className="text-[13px] text-white/80 mb-4">Liên hệ để tìm hiểu cơ hội hợp tác và đầu tư.</p>
                  <Link
                    href="/lien-he"
                    className="block text-center py-2.5 bg-white text-[#e82127] font-semibold text-[14px] rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Liên hệ ngay
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
