"use client";


import Link from "next/link";
import { ArrowRight, Leaf, Users, BookOpen, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const VP = { once: true, amount: 0 };

const pillars = [
  {
    icon: BookOpen,
    title: "Dự án Chấn hưng văn hóa",
    desc: "PSD Group theo đuổi sứ mệnh chấn hưng văn hóa Việt thông qua hệ thống nghiên cứu, dự án và nền tảng số. Hệ thống 236 đề tài nghiên cứu về chấn hưng văn hóa Việt Nam là nền tảng tri thức cho các dự án thực tế của tập đoàn.",
  },
  {
    icon: Globe,
    title: "Dự án Đình Làng",
    desc: "Phục dựng và phát huy không gian đình làng — biểu tượng của văn hóa cộng đồng Việt. Dự án hướng tới khôi phục giá trị gắn kết cộng đồng và bảo tồn kiến trúc, tín ngưỡng truyền thống.",
  },
  {
    icon: Leaf,
    title: "Dự án Văn Minh Việt",
    desc: "Số hóa và lan tỏa tri thức, di sản văn hóa Việt trên nền tảng công nghệ, đưa văn hóa truyền thống đến với cộng đồng rộng rãi, đặc biệt là thế hệ trẻ.",
  },
  {
    icon: Users,
    title: "Công tác phòng chống ma túy",
    desc: "Viện Nghiên cứu và Ứng dụng Phòng chống ma túy PSD triển khai các chương trình nghiên cứu, tuyên truyền và hỗ trợ cai nghiện, góp phần xây dựng cộng đồng lành mạnh.",
  },
];

export default function SustainabilitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="section-padding bg-white overflow-hidden" ref={ref}>
      <div className="container-psd">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left visual */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#f4f4f5]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/kinh-te-van-hoa.png')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a1a]/60 to-transparent" />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="w-8 h-[3px] bg-[#e82127] mb-4" />
                <blockquote className="text-white font-bold italic leading-snug mb-3" style={{ fontSize: "clamp(20px, 1.8vw, 26px)", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  "Văn hóa là gốc rễ –<br />
                  Phụng sự là đích đến"
                </blockquote>
                <p className="text-white/75 text-[13px] font-medium tracking-wide">
                  Triết lý phát triển bền vững của PSD Group
                </p>
              </div>
            </div>

            {/* Accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4caf50]/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Right: content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
                <span className="text-[13px] font-semibold text-[#e82127] tracking-wider uppercase">
                  Phụng sự xã hội
                </span>
              </div>
              <h2 className="text-section-title text-[#1a1a1a] mb-4">
                Kinh tế tạo nguồn lực,{" "}
                <span className="text-[#e82127]">văn hóa dẫn đường</span>
              </h2>
              <p className="text-[16px] text-[#6e6e74] leading-relaxed">
                Giá trị xã hội không phải hoạt động bên lề mà là trục lõi trong chiến lược phát
                triển của PSD Group. Chúng tôi dành một phần thành quả kinh doanh để tái đầu tư
                cho văn hóa – xã hội.
              </p>
            </motion.div>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl hover:bg-[#f4f4f5] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#4caf50]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-[#4caf50]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[14px] text-[#1a1a1a] mb-1">
                        {pillar.title}
                      </h4>
                      <p className="text-[13px] text-[#6e6e74] leading-snug"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                        }}
                      >{pillar.desc}</p>
                      <button className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#e82127] mt-2 hover:underline">
                        Xem thêm <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

