import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Tag, Calendar, ArrowLeft, ArrowRight, Building2 } from "lucide-react";

const projects: Record<string, {
  name: string; tag: string; location: string; province: string;
  status: string; scale: string; startYear: number; company: string;
  image: string; gallery: string[]; desc: string; content: string; impact: string[];
}> = {
  "van-minh-viet": {
    name: "Văn Minh Việt", tag: "Văn hóa – Công nghệ", location: "Hà Nội", province: "Hà Nội",
    status: "Đang triển khai", scale: "Nền tảng số quốc gia", startYear: 2024, company: "Công ty Văn Minh Việt",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    ],
    desc: "Nền tảng số hóa và lan tỏa tri thức, di sản văn hóa Việt đến cộng đồng và thế hệ trẻ.",
    content: "Văn Minh Việt là dự án chiến lược của PSD Group trong lĩnh vực văn hóa số — nơi công nghệ hiện đại phục vụ sứ mệnh bảo tồn và lan tỏa văn hóa dân tộc. Nền tảng cung cấp kho tài nguyên phong phú về lịch sử, nghệ thuật, ngôn ngữ và di sản phi vật thể của người Việt, tiếp cận được từ mọi thiết bị và mọi nơi trên thế giới.",
    impact: ["Số hóa 10.000+ tài liệu văn hóa", "Kết nối 500.000+ người dùng", "Hỗ trợ 50 chương trình giáo dục", "Lan tỏa đến 30 quốc gia"],
  },
  "sofavi": {
    name: "Nhà máy SOFAVI", tag: "Sản xuất công nghiệp", location: "Hưng Yên", province: "Hưng Yên",
    status: "Đang vận hành", scale: "50.000 tấn sorbitol/năm", startYear: 2016, company: "SOFAVI",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
    ],
    desc: "Nhà máy sản xuất sorbitol, tinh bột, cồn và dầu thực vật quy mô công nghiệp hàng đầu miền Bắc.",
    content: "Nhà máy SOFAVI là trụ cột sản xuất công nghiệp của PSD Group, chuyên sản xuất các sản phẩm hóa nông nghiệp chất lượng cao. Sau nhiều giai đoạn mở rộng, hiện nhà máy đạt công suất 50.000 tấn sorbitol/năm cùng với tinh bột, cồn công nghiệp và dầu thực vật, phục vụ thị trường trong nước và xuất khẩu.",
    impact: ["50.000 tấn sorbitol/năm", "300+ việc làm trực tiếp", "Giảm 30% năng lượng tiêu thụ", "Đạt tiêu chuẩn ISO 9001:2015"],
  },
  "tan-sang-logistics": {
    name: "Tấn Sang Logistics Hub", tag: "Logistics", location: "Hà Nội & Toàn quốc", province: "Hà Nội",
    status: "Đang vận hành", scale: "100.000 m² kho bãi", startYear: 2018, company: "Tấn Sang Logistics",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80",
    ],
    desc: "Hệ thống logistics, kho bãi và chuỗi cung ứng kết nối toàn quốc — xương sống vận hành của hệ sinh thái PSD Group.",
    content: "Tấn Sang Logistics là hệ thống logistics tích hợp của PSD Group, cung cấp dịch vụ vận tải đa phương thức, kho bãi và quản lý chuỗi cung ứng cho khách hàng trên toàn quốc. Với 100.000 m² kho bãi và đội xe vận tải hiện đại, Tấn Sang kết nối các mắt xích sản xuất, phân phối và bán lẻ trong hệ sinh thái PSD Group.",
    impact: ["100.000 m² kho bãi", "1.000+ chuyến xe/tháng", "50+ tỉnh thành phủ sóng", "200+ khách hàng doanh nghiệp"],
  },
  "long-viet": {
    name: "Long Việt Eco Resort", tag: "Du lịch sinh thái", location: "Hòa Bình", province: "Hòa Bình",
    status: "Đang phát triển", scale: "500 ha sinh thái", startYear: 2023, company: "Công ty Long Việt",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80",
    ],
    desc: "Khu du lịch sinh thái văn hóa quy mô 500 ha, kết hợp nghỉ dưỡng, trải nghiệm thiên nhiên và di sản văn hóa.",
    content: "Long Việt Eco Resort là dự án du lịch sinh thái văn hóa lớn nhất của PSD Group, tọa lạc tại vùng đồi núi tự nhiên của Hòa Bình. Dự án hướng tới xây dựng điểm đến du lịch gắn với văn hóa bản địa, tạo ra trải nghiệm nghỉ dưỡng độc đáo kết hợp với bảo tồn thiên nhiên và di sản địa phương.",
    impact: ["500 ha không gian sinh thái", "1.000+ phòng nghỉ dưỡng", "500+ việc làm địa phương", "Bảo tồn 200 ha rừng tự nhiên"],
  },
  "dinh-lang": {
    name: "Dự án Đình Làng", tag: "Văn hóa xã hội", location: "Nhiều tỉnh thành", province: "Toàn quốc",
    status: "Đang triển khai", scale: "50 ngôi đình", startYear: 2026, company: "PSD Group",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d43?w=600&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    ],
    desc: "Phục dựng và phát huy giá trị 50 ngôi đình làng trên khắp miền Bắc — biểu tượng văn hóa cộng đồng Việt.",
    content: "Dự án Đình Làng là một trong những sáng kiến văn hóa quy mô lớn nhất của PSD Group, thể hiện cam kết phụng sự văn hóa dân tộc. Trong giai đoạn 2026–2028, PSD Group sẽ tài trợ và đồng hành phục dựng 50 ngôi đình làng ở các tỉnh miền Bắc, phối hợp với chuyên gia kiến trúc di sản và cộng đồng địa phương.",
    impact: ["50 đình làng được phục dựng", "100.000+ người dân hưởng lợi", "Bảo tồn 200+ hiện vật cổ", "20+ lễ hội truyền thống được khôi phục"],
  },
  "khu-do-thi-psd": {
    name: "Khu đô thị PSD", tag: "Bất động sản", location: "Hà Nội", province: "Hà Nội",
    status: "Đang lên kế hoạch", scale: "100 ha đô thị", startYear: 2027, company: "PSD Realty",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    ],
    desc: "Phát triển khu đô thị nhà ở xã hội chất lượng cao, giá hợp lý, đóng góp vào giải quyết nhu cầu nhà ở của người dân.",
    content: "Khu đô thị PSD là dự án bất động sản quy mô lớn của PSD Realty, tập trung vào phân khúc nhà ở xã hội và nhà ở giá vừa phải. Dự án hướng tới xây dựng cộng đồng đô thị bền vững với đầy đủ tiện ích, không gian xanh và kết nối giao thông thuận tiện.",
    impact: ["5.000+ căn hộ nhà ở xã hội", "100 ha không gian xanh", "30% diện tích công cộng", "10.000+ gia đình hưởng lợi"],
  },
};

const statusColor: Record<string, string> = {
  "Đang vận hành": "bg-green-100 text-green-700",
  "Đang triển khai": "bg-blue-100 text-blue-700",
  "Đang phát triển": "bg-orange-100 text-orange-700",
  "Đang lên kế hoạch": "bg-gray-100 text-gray-600",
};

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects[slug];
  return { title: p ? `${p.name} – Dự án PSD Group` : "Dự án" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <div className="relative h-[400px] lg:h-[500px] bg-[#0f0f12] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url('${project.image}')` }} />
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
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${statusColor[project.status]}`}>{project.status}</span>
              <span className="flex items-center gap-1 text-[13px] text-white/60"><Tag size={12} />{project.tag}</span>
              <span className="flex items-center gap-1 text-[13px] text-white/60"><MapPin size={12} />{project.location}</span>
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
              <p className="text-[17px] text-[#6e6e74] leading-relaxed mb-10">{project.content}</p>

              {/* Gallery */}
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-5">Hình ảnh dự án</h2>
              <div className="grid grid-cols-3 gap-3 mb-10">
                {project.gallery.map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#f4f4f5]">
                    <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('${img}')` }} />
                  </div>
                ))}
              </div>

              {/* Impact */}
              <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-5">Tác động & Kết quả</h2>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {project.impact.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-[#f4f4f5] rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[#e82127] flex-shrink-0" />
                    <span className="text-[14px] font-medium text-[#1a1a1a]">{item}</span>
                  </div>
                ))}
              </div>

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
                {/* Info card */}
                <div className="card-psd p-6 bg-white">
                  <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-4">Thông tin dự án</h3>
                  {[
                    { icon: Tag, label: "Lĩnh vực", value: project.tag },
                    { icon: MapPin, label: "Địa điểm", value: project.location },
                    { icon: Building2, label: "Đơn vị triển khai", value: project.company },
                    { icon: Calendar, label: "Năm bắt đầu", value: project.startYear.toString() },
                    { icon: Building2, label: "Quy mô", value: project.scale },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex justify-between gap-3 py-3 border-b border-[#e5e5e7] last:border-0">
                      <span className="flex items-center gap-1.5 text-[13px] text-[#6e6e74]"><Icon size={13} />{label}</span>
                      <span className="text-[13px] font-medium text-[#1a1a1a] text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
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
