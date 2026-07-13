import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Calendar, ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PLANNING: "Lên kế hoạch",
  IN_PROGRESS: "Đang triển khai",
  COMPLETED: "Hoàn thành",
  ON_HOLD: "Tạm dừng",
};
const statusColor: Record<string, string> = {
  PLANNING: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, include: { sector: true } });
  if (!project) return { title: "Dự án – PSD Group" };
  return {
    title: project.seoTitle ?? `${project.name} – Dự án PSD Group`,
    description: project.seoDesc ?? project.shortDesc ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, include: { sector: true } });
  if (!project) notFound();

  const images: string[] = Array.isArray(project.images) ? (project.images as string[]) : [];

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <div className="relative h-[400px] lg:h-[500px] bg-[#0f0f12] overflow-hidden">
        {project.thumbnail && (
          <Image src={project.thumbnail} alt={project.name} fill style={{ objectFit: "cover", opacity: 0.45 }} priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-psd pb-10">
            <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
              <Link href="/" className="hover:text-white/70">Trang chủ</Link>
              <span>/</span>
              <Link href="/du-an" className="hover:text-white/70">Dự án</Link>
              <span>/</span>
              <span className="text-white/60">{project.name}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${statusColor[project.status] ?? "bg-gray-100 text-gray-600"}`}>
                {statusLabel[project.status] ?? project.status}
              </span>
              {project.sector && (
                <span className="flex items-center gap-1 text-[13px] text-white/60"><Tag size={12} />{project.sector.name}</span>
              )}
              {project.location && (
                <span className="flex items-center gap-1 text-[13px] text-white/60"><MapPin size={12} />{project.location}</span>
              )}
            </div>
            <h1 className="text-[28px] lg:text-[40px] font-bold text-white leading-snug">{project.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        <div className="container-psd py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main */}
            <div className="lg:col-span-8">
              {project.description && (
                <div className="article-content text-[16px] text-[#444] leading-relaxed mb-10"
                  dangerouslySetInnerHTML={{ __html: project.description }} />
              )}
              {!project.description && project.shortDesc && (
                <p className="text-[17px] text-[#6e6e74] leading-relaxed mb-10">{project.shortDesc}</p>
              )}

              {/* Gallery */}
              {images.length > 0 && (
                <>
                  <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-5">Hình ảnh dự án</h2>
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    {images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#f4f4f5]">
                        <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('${img}')` }} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Link href="/du-an" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6e6e74] hover:text-[#e82127] transition-colors">
                  <ArrowLeft size={16} /> Tất cả dự án
                </Link>
                <Link href="/lien-he" className="btn-primary gap-2 text-[14px]">
                  Liên hệ tư vấn <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-[88px] space-y-5">
                <div className="card-psd p-6 bg-white">
                  <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-4">Thông tin dự án</h3>
                  {[
                    project.sector ? { icon: Tag, label: "Lĩnh vực", value: project.sector.name } : null,
                    project.location ? { icon: MapPin, label: "Địa điểm", value: project.location } : null,
                    project.startYear ? { icon: Calendar, label: "Năm bắt đầu", value: String(project.startYear) } : null,
                    project.scale ? { icon: Building2, label: "Quy mô", value: project.scale } : null,
                  ].filter(Boolean).map((row) => {
                    const { icon: Icon, label, value } = row!;
                    return (
                      <div key={label} className="flex justify-between gap-3 py-3 border-b border-[#e5e5e7] last:border-0">
                        <span className="flex items-center gap-1.5 text-[13px] text-[#6e6e74]"><Icon size={13} />{label}</span>
                        <span className="text-[13px] font-medium text-[#1a1a1a] text-right">{value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#e82127] rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-[16px] mb-2">Quan tâm dự án này?</h4>
                  <p className="text-[13px] text-white/80 mb-4">Liên hệ để nhận thông tin chi tiết và cơ hội hợp tác.</p>
                  <Link href="/lien-he" className="block text-center py-2.5 bg-white text-[#e82127] font-semibold text-[14px] rounded-lg hover:bg-white/90 transition-colors">
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
