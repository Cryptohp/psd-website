import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { TrendingUp, Heart, Users, Briefcase } from "lucide-react";
import JobListings from "./JobListings";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Cơ hội nghề nghiệp tại PSD Group — môi trường chuyên nghiệp, phát triển bền vững.",
};

const whyJoin = [
  { icon: TrendingUp, title: "Tầm vóc & Cơ hội", desc: "Làm việc trong hệ sinh thái đa ngành, nhiều dư địa phát triển và học hỏi liên lĩnh vực." },
  { icon: Heart, title: "Ý nghĩa công việc", desc: "Mỗi đóng góp đều gắn với những mục tiêu lớn hơn về văn hóa và cộng đồng." },
  { icon: Users, title: "Môi trường phát triển", desc: "Văn hóa coi trọng năng lực, đề cao chính trực và tinh thần phụng sự." },
  { icon: Briefcase, title: "Lộ trình rõ ràng", desc: "Cơ hội thăng tiến cùng sự mở rộng của tập đoàn. Thu nhập cạnh tranh, bảo hiểm và đào tạo đầy đủ." },
];

export default function RecruitmentPage() {
  return (
    <>
      <div style={{ paddingTop: 68 }} />
      <Breadcrumb items={[{ label: "Tuyển dụng" }]} />

      {/* Why join */}
      <section className="section-padding bg-white">
        <div className="container-psd">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
              <span className="text-[13px] font-semibold text-[#e82127] tracking-wider uppercase">Vì sao chọn PSD Group</span>
              <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
            </div>
            <h2 className="text-section-title text-[#1a1a1a]">Môi trường để bạn <span className="text-[#e82127]">tỏa sáng</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJoin.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-psd p-6 bg-white text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#e82127]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[#e82127]" />
                  </div>
                  <h3 className="font-bold text-[14px] text-[#1a1a1a] mb-2">{item.title}</h3>
                  <p className="text-[13px] text-[#6e6e74] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job listings with sidebar filter */}
      <JobListings />
    </>
  );
}
