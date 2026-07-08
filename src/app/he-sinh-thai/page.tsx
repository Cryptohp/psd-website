import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Hệ sinh thái PSD Group",
  description: "Các công ty thành viên trong hệ sinh thái PSD Group vận hành cộng hưởng, bổ trợ lẫn nhau.",
};

const companies = [
  { name: "SOFAVI", slug: "sofavi", tag: "Sản xuất & Công nghiệp", desc: "Sản xuất sorbitol, tinh bột, cồn công nghiệp và dầu thực vật chất lượng cao.", website: null },
  { name: "Tấn Sang Logistics", slug: "tan-sang-logistics", tag: "Logistics & Cảng biển", desc: "Hệ thống logistics, vận tải và chuỗi cung ứng kết nối toàn quốc.", website: null },
  { name: "Long Việt", slug: "long-viet", tag: "Du lịch & Sinh thái", desc: "Khu du lịch sinh thái văn hóa gắn với di sản và bản sắc Việt Nam.", website: null },
  { name: "Văn Minh Việt", slug: "van-minh-viet", tag: "Văn hóa & Công nghệ", desc: "Nền tảng số hóa và lan tỏa tri thức, di sản văn hóa Việt đến cộng đồng.", website: null },
  { name: "PSD Invest", slug: "psd-invest", tag: "Đầu tư & Tài chính", desc: "Đầu tư chiến lược, M&A và tái cấu trúc doanh nghiệp.", website: null },
  { name: "PSD Realty", slug: "psd-realty", tag: "Bất động sản", desc: "Phát triển bất động sản, nhà ở xã hội và khu đô thị bền vững.", website: null },
  { name: "PSD Agri", slug: "psd-agri", tag: "Nông nghiệp & Thủy sản", desc: "Nông nghiệp công nghệ cao, nuôi trồng và chế biến thủy sản bền vững.", website: null },
  { name: "Viện PSD", slug: "vien-psd", tag: "Trách nhiệm xã hội", desc: "Nghiên cứu khoa học, phòng chống ma túy và hỗ trợ tái hòa nhập cộng đồng.", website: null },
];

const tagColors: Record<string, string> = {
  "Sản xuất & Công nghiệp": "bg-orange-100 text-orange-700",
  "Logistics & Cảng biển": "bg-blue-100 text-blue-700",
  "Du lịch & Sinh thái": "bg-green-100 text-green-700",
  "Văn hóa & Công nghệ": "bg-purple-100 text-purple-700",
  "Đầu tư & Tài chính": "bg-indigo-100 text-indigo-700",
  "Bất động sản": "bg-rose-100 text-rose-700",
  "Nông nghiệp & Thủy sản": "bg-emerald-100 text-emerald-700",
  "Trách nhiệm xã hội": "bg-red-100 text-red-700",
};

export default function EcosystemPage() {
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
              { value: "8", label: "Lĩnh vực" },
              { value: "20+", label: "Công ty thành viên" },
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

      {/* Companies */}
      <section className="section-padding bg-[#f4f4f5]">
        <div className="container-psd">
          <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-8">Công ty thành viên</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {companies.map((company) => (
              <Link
                key={company.slug}
                href={`/he-sinh-thai/${company.slug}`}
                className="group card-psd bg-white p-6 flex flex-col"
              >
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl bg-[#e82127]/10 flex items-center justify-center mb-4">
                  <span className="text-[20px] font-bold text-[#e82127]">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <span className={`self-start px-2.5 py-1 rounded-full text-[11px] font-medium mb-3 ${tagColors[company.tag] || "bg-gray-100 text-gray-600"}`}>
                  {company.tag}
                </span>
                <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-2 group-hover:text-[#e82127] transition-colors">
                  {company.name}
                </h3>
                <p className="text-[13px] text-[#6e6e74] leading-relaxed flex-1">{company.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-medium text-[#e82127]">
                  Xem chi tiết <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
