import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Globe, ArrowLeft, ArrowRight, Tag, Building2 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const companies: Record<string, {
  name: string; tag: string; logo: string; website: string | null;
  desc: string; content: string; role: string;
  products: string[]; projects: string[]; image: string;
}> = {
  "sofavi": {
    name: "SOFAVI", tag: "Sản xuất & Công nghiệp", logo: "S", website: null,
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80",
    desc: "Sản xuất sorbitol, tinh bột, cồn công nghiệp và dầu thực vật chất lượng cao.",
    content: "SOFAVI là trụ cột sản xuất công nghiệp của PSD Group, với nhà máy sản xuất hiện đại tại miền Bắc Việt Nam. Công ty chuyên sản xuất các sản phẩm hóa nông nghiệp phục vụ thị trường trong nước và xuất khẩu, đạt tiêu chuẩn chất lượng quốc tế.",
    role: "Tạo ra nguồn thu ổn định từ sản xuất, cung cấp nguyên liệu cho chuỗi cung ứng nội bộ và thể hiện năng lực công nghiệp của tập đoàn.",
    products: ["Sorbitol công nghiệp & thực phẩm", "Tinh bột các loại", "Cồn công nghiệp", "Dầu thực vật", "Năng lượng sinh khối"],
    projects: ["sofavi"],
  },
  "tan-sang-logistics": {
    name: "Tấn Sang Logistics", tag: "Logistics & Cảng biển", logo: "T", website: null,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
    desc: "Hệ thống logistics, vận tải và chuỗi cung ứng kết nối toàn quốc.",
    content: "Tấn Sang Logistics là công ty vận tải và logistics thuộc PSD Group, chuyên cung cấp dịch vụ vận chuyển hàng hóa, quản lý kho bãi và giải pháp chuỗi cung ứng cho khách hàng doanh nghiệp trên toàn quốc.",
    role: "Là mắt xích kết nối trong hệ sinh thái PSD Group, vận chuyển hàng hóa từ SOFAVI và các đơn vị sản xuất đến điểm phân phối và xuất khẩu.",
    products: ["Vận tải đường bộ & đa phương thức", "Kho bãi & ICD", "Dịch vụ hải quan", "Giải pháp chuỗi cung ứng", "Logistics thương mại điện tử"],
    projects: ["tan-sang-logistics"],
  },
  "long-viet": {
    name: "Long Việt", tag: "Du lịch & Sinh thái", logo: "L", website: null,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    desc: "Khu du lịch sinh thái văn hóa gắn với di sản và bản sắc Việt Nam.",
    content: "Long Việt là đơn vị phát triển du lịch sinh thái văn hóa của PSD Group, tập trung vào mô hình du lịch gắn với thiên nhiên, di sản và văn hóa bản địa. Công ty đang phát triển khu resort sinh thái quy mô lớn tại Hòa Bình.",
    role: "Đại diện cho trụ cột du lịch – dịch vụ trong hệ sinh thái, đồng thời là cầu nối giữa kinh doanh và bảo tồn văn hóa, thiên nhiên.",
    products: ["Nghỉ dưỡng sinh thái", "Tour văn hóa – lịch sử", "Ẩm thực dân tộc", "Hoạt động team building", "Sự kiện và hội nghị"],
    projects: ["long-viet"],
  },
  "van-minh-viet": {
    name: "Văn Minh Việt", tag: "Văn hóa & Công nghệ", logo: "V", website: null,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    desc: "Nền tảng số hóa và lan tỏa tri thức, di sản văn hóa Việt đến cộng đồng.",
    content: "Văn Minh Việt là dự án đặc biệt của PSD Group, kết hợp công nghệ số với sứ mệnh bảo tồn văn hóa dân tộc. Nền tảng cung cấp kho tài nguyên số phong phú về văn hóa, lịch sử, nghệ thuật Việt Nam, tiếp cận được với người Việt trong nước và quốc tế.",
    role: "Thể hiện triết lý 'Lấy kinh tế nuôi văn hóa' của PSD Group — chuyển nguồn lực kinh tế thành dự án văn hóa có tác động xã hội sâu rộng.",
    products: ["Thư viện số văn hóa Việt", "Bản đồ di sản tương tác", "Chương trình học tiếng Việt", "Tài liệu lịch sử số hóa", "Cộng đồng người Việt toàn cầu"],
    projects: ["van-minh-viet"],
  },
  "psd-invest": {
    name: "PSD Invest", tag: "Đầu tư & Tài chính", logo: "I", website: null,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    desc: "Đầu tư chiến lược, M&A và tái cấu trúc doanh nghiệp.",
    content: "PSD Invest là cánh tay tài chính của PSD Group, chuyên thực hiện các hoạt động đầu tư chiến lược, mua bán – sáp nhập (M&A) và tái cấu trúc doanh nghiệp. Với đội ngũ chuyên gia tài chính và pháp lý giàu kinh nghiệm, PSD Invest giúp các doanh nghiệp trong và ngoài hệ sinh thái tối ưu hóa giá trị.",
    role: "Là bộ não tài chính của hệ sinh thái — tìm kiếm cơ hội đầu tư, huy động vốn và tối ưu hóa cơ cấu tài chính toàn tập đoàn.",
    products: ["Đầu tư cổ phần tư nhân", "M&A Advisory", "Tái cấu trúc tài chính", "Huy động vốn", "Tư vấn chiến lược"],
    projects: [],
  },
  "psd-realty": {
    name: "PSD Realty", tag: "Bất động sản", logo: "R", website: null,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    desc: "Phát triển bất động sản, nhà ở xã hội và khu đô thị bền vững.",
    content: "PSD Realty là đơn vị phát triển bất động sản của PSD Group, tập trung vào phân khúc nhà ở xã hội, nhà ở giá vừa phải và khu đô thị phức hợp. Công ty cam kết tạo ra sản phẩm bất động sản chất lượng với giá trị sử dụng thực tế và bền vững.",
    role: "Phát triển quỹ đất chiến lược và tạo ra sản phẩm bất động sản đáp ứng nhu cầu nhà ở chất lượng, đóng góp vào sự phát triển đô thị.",
    products: ["Nhà ở xã hội", "Khu đô thị phức hợp", "Bất động sản thương mại", "Phát triển quỹ đất", "Quản lý tài sản"],
    projects: ["khu-do-thi-psd"],
  },
  "psd-agri": {
    name: "PSD Agri", tag: "Nông nghiệp & Thủy sản", logo: "A", website: null,
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&q=80",
    desc: "Nông nghiệp công nghệ cao, nuôi trồng và chế biến thủy sản bền vững.",
    content: "PSD Agri là đơn vị nông nghiệp của PSD Group, phát triển mô hình nông nghiệp công nghệ cao và thủy sản bền vững. Công ty xây dựng chuỗi giá trị khép kín từ nuôi trồng, thu hoạch, chế biến đến phân phối, đảm bảo chất lượng và truy xuất nguồn gốc.",
    role: "Góp phần đảm bảo an ninh lương thực và tạo ra nguồn nguyên liệu bền vững cho chuỗi sản xuất của hệ sinh thái PSD Group.",
    products: ["Nuôi trồng thủy sản", "Nông nghiệp công nghệ cao", "Chế biến nông sản", "Xuất khẩu nông sản", "Phân phối thực phẩm sạch"],
    projects: [],
  },
  "vien-psd": {
    name: "Viện PSD", tag: "Trách nhiệm xã hội", logo: "V", website: null,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    desc: "Nghiên cứu khoa học, phòng chống ma túy và hỗ trợ tái hòa nhập cộng đồng.",
    content: "Viện Nghiên cứu và Ứng dụng Phòng chống Ma túy PSD là biểu tượng cho cam kết trách nhiệm xã hội của PSD Group. Viện thực hiện nghiên cứu khoa học, cung cấp chương trình hỗ trợ tái hòa nhập và lan tỏa các giá trị nhân văn, góp phần xây dựng cộng đồng lành mạnh.",
    role: "Là minh chứng rõ ràng nhất cho triết lý 'Phụng sự xã hội' của PSD Group — đầu tư vào con người và cộng đồng không vì lợi nhuận.",
    products: ["Nghiên cứu phòng chống ma túy", "Chương trình tái hòa nhập", "Tư vấn tâm lý cộng đồng", "Giáo dục phòng ngừa", "Hỗ trợ gia đình"],
    projects: [],
  },
};

export async function generateStaticParams() {
  return Object.keys(companies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = companies[slug];
  return { title: c ? `${c.name} – Hệ sinh thái PSD Group` : "Công ty thành viên" };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = companies[slug];
  if (!company) notFound();

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <div className="relative h-[360px] bg-[#0f0f12] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url('${company.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-psd pb-10">
            <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
              <Link href="/" className="hover:text-white/70">Trang chủ</Link>
              <span>/</span>
              <Link href="/he-sinh-thai" className="hover:text-white/70">Hệ sinh thái</Link>
              <span>/</span>
              <span className="text-white/60">{company.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#e82127] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[28px] font-bold">{company.logo}</span>
              </div>
              <div>
                <span className="inline-flex px-2.5 py-1 bg-white/15 rounded-full text-[12px] text-white/80 mb-2">{company.tag}</span>
                <h1 className="text-[28px] lg:text-[36px] font-bold text-white">{company.name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Breadcrumb items={[{ label: "Hệ sinh thái", href: "/he-sinh-thai" }, { label: company.name }]} />

      {/* Content */}
      <div className="bg-white">
        <div className="container-psd py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Giới thiệu</h2>
                <p className="text-[16px] text-[#6e6e74] leading-relaxed">{company.content}</p>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Vai trò trong hệ sinh thái</h2>
                <div className="p-5 bg-[#f4f4f5] rounded-xl border-l-4 border-[#e82127]">
                  <p className="text-[15px] text-[#6e6e74] leading-relaxed">{company.role}</p>
                </div>
              </div>

              <div>
                <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Sản phẩm & Dịch vụ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.products.map((p) => (
                    <div key={p} className="flex items-center gap-3 p-3.5 bg-[#f4f4f5] rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-[#e82127] flex-shrink-0" />
                      <span className="text-[14px] text-[#1a1a1a] font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {company.projects.length > 0 && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Dự án liên quan</h2>
                  <div className="flex flex-wrap gap-3">
                    {company.projects.map((pSlug) => (
                      <Link key={pSlug} href={`/du-an/${pSlug}`} className="inline-flex items-center gap-2 px-4 py-2.5 card-psd bg-white text-[14px] font-medium text-[#1a1a1a] hover:text-[#e82127] hover:border-[#e82127]/30 transition-colors">
                        <Building2 size={15} />
                        Xem dự án <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/he-sinh-thai" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6e6e74] hover:text-[#e82127] transition-colors">
                <ArrowLeft size={16} /> Về Hệ sinh thái
              </Link>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-[88px] space-y-5">
                <div className="card-psd p-6 bg-white">
                  <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-4">Thông tin</h3>
                  {[
                    { icon: Tag, label: "Lĩnh vực", value: company.tag },
                    { icon: Building2, label: "Thuộc tập đoàn", value: "PSD Group" },
                    ...(company.website ? [{ icon: Globe, label: "Website", value: company.website }] : []),
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex justify-between gap-3 py-3 border-b border-[#e5e5e7] last:border-0">
                      <span className="flex items-center gap-1.5 text-[13px] text-[#6e6e74]"><Icon size={13} />{label}</span>
                      <span className="text-[13px] font-medium text-[#1a1a1a] text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#e82127] rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-[16px] mb-2">Hợp tác cùng {company.name}</h4>
                  <p className="text-[13px] text-white/80 mb-4">Liên hệ để tìm hiểu cơ hội hợp tác và đầu tư.</p>
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
