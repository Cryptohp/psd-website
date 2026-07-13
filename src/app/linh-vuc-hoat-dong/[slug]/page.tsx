import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowRight } from "lucide-react";

const sectorData: Record<string, { name: string; desc: string; content: string; highlights: string[] }> = {
  "bat-dong-san-ha-tang": {
    name: "Bất động sản & Hạ tầng",
    desc: "Phát triển bất động sản, hạ tầng, nhà ở xã hội và khu đô thị chiến lược.",
    content: "PSD Group phát triển bất động sản với tầm nhìn dài hạn, ưu tiên tạo ra sản phẩm có giá trị sử dụng thực tế và bền vững. Từ khu đô thị, nhà ở xã hội đến hạ tầng kỹ thuật, chúng tôi cam kết xây dựng những không gian sống chất lượng, đóng góp vào sự phát triển đô thị bền vững.",
    highlights: ["Khu đô thị & Nhà ở xã hội", "Hạ tầng kỹ thuật", "Tài sản chiến lược", "Phát triển quỹ đất"],
  },
  "san-xuat-cong-nghiep": {
    name: "Sản xuất & Công nghiệp",
    desc: "Nhà máy sản xuất sorbitol, tinh bột, cồn và các sản phẩm công nghiệp.",
    content: "Lĩnh vực sản xuất công nghiệp của PSD Group được đại diện bởi Nhà máy SOFAVI — đơn vị sản xuất sorbitol, tinh bột, cồn công nghiệp và dầu thực vật hàng đầu. Chúng tôi đầu tư vào công nghệ tiên tiến, quy trình sản xuất hiệu quả và tiêu chuẩn chất lượng quốc tế.",
    highlights: ["Sorbitol & Tinh bột", "Cồn công nghiệp", "Dầu thực vật", "Năng lượng sinh khối"],
  },
  "khoang-san": {
    name: "Khoáng sản",
    desc: "Phát triển tài nguyên khoáng sản theo hướng bền vững và có trách nhiệm.",
    content: "PSD Group tiếp cận lĩnh vực khoáng sản với triết lý khai thác có trách nhiệm — cân bằng giữa giá trị kinh tế, bảo vệ môi trường và lợi ích cộng đồng. Mọi dự án đều tuân thủ nghiêm ngặt quy định pháp luật và cam kết phục hồi môi trường sau khai thác.",
    highlights: ["Thăm dò & Khai thác", "Chế biến khoáng sản", "Bảo vệ môi trường", "Phục hồi sinh thái"],
  },
  "logistics-cang-bien": {
    name: "Logistics & Cảng biển",
    desc: "Hệ thống logistics, kho bãi và chuỗi cung ứng kết nối toàn quốc.",
    content: "Thông qua Tấn Sang Logistics, PSD Group xây dựng hệ thống vận tải và logistics quy mô lớn, kết nối chuỗi cung ứng từ Bắc đến Nam. Chúng tôi đầu tư vào hạ tầng cảng biển, trung tâm phân phối và giải pháp vận chuyển thông minh.",
    highlights: ["Vận tải đa phương thức", "Kho bãi & ICD", "Cảng biển", "Chuỗi cung ứng"],
  },
  "nong-nghiep-thuy-san": {
    name: "Nông nghiệp & Thủy sản",
    desc: "Nông nghiệp bền vững từ nuôi trồng đến chế biến và xuất khẩu.",
    content: "PSD Group đầu tư vào nông nghiệp và thủy sản với quan điểm an ninh lương thực là nền tảng phát triển quốc gia. Từ nuôi trồng ứng dụng công nghệ cao đến chế biến và xuất khẩu, chúng tôi xây dựng chuỗi giá trị nông nghiệp khép kín và bền vững.",
    highlights: ["Nuôi trồng thủy sản", "Chế biến nông sản", "Nông nghiệp công nghệ cao", "Xuất khẩu"],
  },
  "du-lich-dich-vu-sinh-thai": {
    name: "Du lịch & Dịch vụ sinh thái",
    desc: "Du lịch văn hóa, sinh thái gắn với bản sắc và di sản Việt Nam.",
    content: "Lĩnh vực du lịch của PSD Group được định hình bởi dự án Long Việt — khu du lịch sinh thái văn hóa kết hợp nghỉ dưỡng và trải nghiệm di sản. Chúng tôi phát triển du lịch gắn với văn hóa bản địa, tạo ra giá trị cho cộng đồng địa phương.",
    highlights: ["Du lịch sinh thái", "Nghỉ dưỡng văn hóa", "Công viên sinh thái", "Di sản & Lịch sử"],
  },
  "dau-tu-dich-vu": {
    name: "Đầu tư & Dịch vụ",
    desc: "Đầu tư chiến lược, M&A và các dịch vụ chuyên nghiệp hỗ trợ hệ sinh thái.",
    content: "PSD Group có năng lực đầu tư chiến lược và tái cấu trúc doanh nghiệp với đội ngũ chuyên gia nhiều kinh nghiệm. Chúng tôi thực hiện M&A, thương mại xuất nhập khẩu và cung cấp các dịch vụ chuyên nghiệp cho toàn hệ sinh thái và đối tác.",
    highlights: ["Đầu tư tài chính", "M&A & Tái cấu trúc", "Thương mại XNK", "Dịch vụ pháp lý"],
  },
  "trach-nhiem-xa-hoi": {
    name: "Trách nhiệm xã hội",
    desc: "Nghiên cứu khoa học, hỗ trợ tái hòa nhập và lan tỏa giá trị nhân văn.",
    content: "Viện Nghiên cứu và Ứng dụng Phòng chống Ma túy PSD là đại diện cho trụ cột trách nhiệm xã hội của tập đoàn. Chúng tôi thực hiện nghiên cứu khoa học, hỗ trợ tái hòa nhập cộng đồng và lan tỏa các giá trị nhân văn sâu sắc.",
    highlights: ["Nghiên cứu khoa học", "Hỗ trợ tái hòa nhập", "Giáo dục cộng đồng", "Lan tỏa nhân văn"],
  },
};

export async function generateStaticParams() {
  return Object.keys(sectorData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = sectorData[slug];
  return { title: sector ? `${sector.name} – Lĩnh vực & Công ty thành viên` : "Lĩnh vực" };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = sectorData[slug];
  if (!sector) notFound();

  return (
    <>
      <PageHero
        tag="Lĩnh vực & Công ty thành viên"
        title={sector.name}
        desc={sector.desc}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Lĩnh vực & Công ty thành viên", href: "/linh-vuc-hoat-dong" },
          { label: sector.name },
        ]}
      />

      <Breadcrumb items={[{ label: "Lĩnh vực & Công ty thành viên", href: "/linh-vuc-hoat-dong" }, { label: sector.name }]} />

      <section className="section-padding bg-white">
        <div className="container-psd max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <p className="text-[17px] text-[#6e6e74] leading-relaxed mb-8">{sector.content}</p>
              <Link href="/lien-he" className="btn-primary gap-2">
                Liên hệ tư vấn <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <div className="bg-[#f4f4f5] rounded-2xl p-6">
                <h3 className="font-bold text-[15px] text-[#1a1a1a] mb-4">Hoạt động nổi bật</h3>
                <ul className="space-y-3">
                  {sector.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-[14px] text-[#6e6e74]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e82127] flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Link href="/du-an" className="text-[13px] text-[#e82127] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Xem dự án liên quan <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
