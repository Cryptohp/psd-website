import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hệ sinh thái PSD Group",
  description: "Các công ty thành viên trong hệ sinh thái PSD Group vận hành cộng hưởng, bổ trợ lẫn nhau.",
};

interface Company {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  sectorId: string;
  sectorName: string;
  order: number;
}

interface Sector {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://psd-website-sand.vercel.app";
  const [companiesRes, sectorsRes] = await Promise.all([
    fetch(`${base}/api/cong-ty`, { next: { revalidate: 60 } }),
    fetch(`${base}/api/sectors`, { next: { revalidate: 60 } }),
  ]);
  const companies: Company[] = companiesRes.ok ? await companiesRes.json() : [];
  const sectors: Sector[] = sectorsRes.ok ? await sectorsRes.json() : [];
  return { companies, sectors };
}

export default async function EcosystemPage() {
  const { companies, sectors } = await getData();

  const activeCompanies = companies.filter((c) => c.isActive);
  const activeSectors = sectors
    .filter((s) => s.isActive && activeCompanies.some((c) => c.sectorId === s.id))
    .sort((a, b) => a.order - b.order);

  const bysector = (sectorId: string) =>
    activeCompanies.filter((c) => c.sectorId === sectorId).sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        tag="Hệ sinh thái"
        title="Cộng hưởng tạo"
        highlight="sức mạnh"
        desc="PSD Group là hệ sinh thái doanh nghiệp đa ngành, trong đó các công ty thành viên vận hành cộng hưởng giữa kinh tế, công nghiệp, dịch vụ, văn hóa và xã hội."
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Hệ sinh thái" }]}
      />
      <Breadcrumb items={[{ label: "Hệ sinh thái PSD Group" }]} />

      {/* Overview */}
      <section className="py-12 bg-white border-b border-[#e5e5e7]">
        <div className="container-psd">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${activeSectors.length}`, label: "Lĩnh vực" },
              { value: `${activeCompanies.length}+`, label: "Công ty thành viên" },
              { value: "50+", label: "Dự án" },
              { value: "500+", label: "Nhân sự" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[36px] font-bold text-[#e82127]">{s.value}</div>
                <div className="text-[14px] text-[#6e6e74]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies grouped by sector */}
      <section className="section-padding bg-[#f4f4f5]">
        <div className="container-psd space-y-14">
          {activeSectors.map((sector) => {
            const sectorCompanies = bysector(sector.id);
            if (!sectorCompanies.length) return null;
            return (
              <div key={sector.id}>
                <h2 className="text-[22px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#e82127] rounded-full inline-block" />
                  {sector.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sectorCompanies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const initial = company.name.charAt(0).toUpperCase();
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Cover image */}
      <div className="relative w-full aspect-video bg-[#f4f4f5] overflow-hidden">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e82127]/10 to-[#e82127]/5 flex items-center justify-center">
            <span className="text-[48px] font-bold text-[#e82127]/30">{initial}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-[15px] text-[#1a1a1a] leading-snug mb-2 group-hover:text-[#e82127] transition-colors line-clamp-2">
          {company.name}
        </h3>
        {company.shortDesc && (
          <p className="text-[13px] text-[#6e6e74] leading-relaxed line-clamp-3 flex-1">
            {company.shortDesc}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-[#f4f4f5]">
          <Link
            href={`/he-sinh-thai/${company.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#e82127] hover:gap-2.5 transition-all duration-200"
          >
            Xem chi tiết
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
