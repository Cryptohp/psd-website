import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Shield, Leaf, Zap, Heart, Globe, Star, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Giá trị cốt lõi – Về PSD Group" };

const values = [
  { icon: Globe, title: "Tập đoàn đa ngành vững mạnh", desc: "Quy mô bền vững, năng lực toàn diện và tầm nhìn dài hạn. PSD Group xây dựng nội lực từ chiều sâu quản trị đến sức mạnh tài chính.", color: "#1a6fc4" },
  { icon: Star, title: "Văn hóa Việt", desc: "Gìn giữ bản sắc, lan tỏa giá trị Việt. Văn hóa là gốc rễ của mọi sự phát triển bền vững, là nền tảng cho mọi quyết định chiến lược.", color: "#e82127" },
  { icon: Heart, title: "Phụng sự quốc gia", desc: "Đồng hành cùng cộng đồng và các mục tiêu phát triển bền vững của đất nước trong từng hoạt động kinh doanh.", color: "#e87c27" },
  { icon: TrendingUp, title: "Đầu tư đa lĩnh vực", desc: "Phát triển đồng bộ các lĩnh vực kinh tế trọng yếu theo nguyên tắc cộng hưởng, mỗi mảng là mắt xích bổ trợ cho toàn hệ sinh thái.", color: "#7b1fa2" },
  { icon: Shield, title: "Chính trực", desc: "Minh bạch trong quản trị, trung thực trong hợp tác, nhất quán giữa lời nói và hành động.", color: "#1a9fc4" },
  { icon: Leaf, title: "Bền vững", desc: "Mọi quyết định đều cân nhắc giá trị dài hạn cho doanh nghiệp, cộng đồng và xã hội.", color: "#4caf50" },
  { icon: Zap, title: "Cộng hưởng", desc: "Sức mạnh của hệ sinh thái đến từ sự kết nối, không phải sự đơn lẻ.", color: "#f5a623" },
  { icon: Users, title: "Phụng sự", desc: "Đặt lợi ích cộng đồng và quốc gia song hành cùng lợi ích doanh nghiệp trong mọi quyết định.", color: "#e82127" },
];

export default function CoreValuesPage() {
  return (
    <>
      <PageHero
        tag="Giá trị cốt lõi"
        title="Nền tảng của"
        highlight="mọi hành động"
        desc="8 giá trị cốt lõi định hình văn hóa, định hướng chiến lược và dẫn dắt mọi quyết định của PSD Group."
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Về PSD Group", href: "/ve-psd-group" },
          { label: "Giá trị cốt lõi" },
        ]}
      />
      <Breadcrumb items={[{ label: "Về PSD Group", href: "/ve-psd-group" }, { label: "Giá trị cốt lõi" }]} />

      <section className="section-padding bg-white">
        <div className="container-psd">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card-psd p-7 bg-white group hover:border-[#e82127]/20">
                  <div className="text-[11px] font-bold text-[#6e6e74] tracking-widest mb-4">
                    0{i + 1}
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${v.color}15` }}
                  >
                    <Icon size={22} style={{ color: v.color }} />
                  </div>
                  <h3 className="font-bold text-[16px] text-[#1a1a1a] mb-3 leading-snug">{v.title}</h3>
                  <p className="text-[13px] text-[#6e6e74] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
