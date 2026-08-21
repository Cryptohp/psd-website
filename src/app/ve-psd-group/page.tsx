"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react"; // useState kept for CardItem
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const infoCards = [
  {
    title: ["BAN LÃNH ĐẠO", "& ĐỘI NGŨ"],
    desc: "Đội ngũ lãnh đạo giàu kinh nghiệm, tâm huyết với sứ mệnh xây dựng tập đoàn kinh tế đa ngành bền vững, góp phần vào sự phát triển chung của đất nước.",
    href: "/ve-psd-group/ban-lanh-dao",
  },
  {
    title: ["TẦM NHÌN & SỨ MỆNH", "GIÁ TRỊ CỐT LÕI"],
    desc: "PSD Group định hướng phát triển theo 8 lĩnh vực trọng tâm: Bất động sản, Sản xuất, Khoáng sản, Logistics, Nông nghiệp, Du lịch, Đầu tư và Trách nhiệm Xã hội.",
    href: "/ve-psd-group/tam-nhin-su-menh",
  },
  {
    title: ["VĂN HÓA", "DOANH NGHIỆP"],
    desc: "Xây dựng môi trường làm việc nhân văn, sáng tạo và trách nhiệm — nơi mỗi cá nhân đều có cơ hội phát triển và đóng góp cho cộng đồng.",
    href: "/ve-psd-group/van-hoa-doanh-nghiep",
  },
  {
    title: ["LỘ TRÌNH", "PHÁT TRIỂN"],
    desc: "Từ khởi nguồn 2013 đến đích đến sau 2030 — hành trình xây dựng tập đoàn đại chúng, minh bạch, bền vững và tầm vóc quốc gia.",
    href: "/ve-psd-group/hanh-trinh-phat-trien",
  },
];

const partners = [
  { img: "/partner-bidv.webp", name: "BIDV", sub: "Ngân hàng", scale: 1 },
  { img: "/partner-shb.webp", name: "SHB", sub: "Ngân hàng", scale: 1 },
  { img: "/logo-vina2.png", name: "Vina2", sub: "Xây dựng & Hạ tầng", scale: 1 },
  { img: "/partner-stavian.webp", name: "Stavian Group", sub: "Hóa chất", scale: 1 },
  { img: "/partner-vinachem.webp", name: "Vinachem", sub: "Tập đoàn Hóa chất VN", scale: 1.5 },
  { img: "/partner-mst.webp", name: "MST", sub: "Đối tác chiến lược", scale: 1 },
];

const SIDE_PAD = "max(24px, calc((100vw - 1300px) / 2 + 60px))";

function CardItem({ card, i, inView }: { card: typeof infoCards[0]; i: number; inView: boolean }) {
  const headingRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    if (headingRef.current) {
      setBarHeight(headingRef.current.offsetHeight);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col relative cursor-pointer"
      style={{ border: "1px solid #e8e8e8", padding: "35px" }}
    >
      {/* Hover overlay — fade opacity */}
      <div className="absolute inset-0 bg-[#e82127] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

      {/* Vạch đỏ: nằm trên border trái, cao đúng bằng H2 */}
      {barHeight > 0 && (
        <div
          className="absolute z-20 bg-[#e82127]"
          style={{ left: 0, width: "4px", top: "35px", height: barHeight }}
        />
      )}

      {/* Heading */}
      <div ref={headingRef} className="mb-7 relative z-10" style={{ paddingLeft: "0" }}>
        <h2
          className="font-bold uppercase leading-tight text-[#e82127] group-hover:text-white transition-colors duration-300"
          style={{ fontSize: "24px", letterSpacing: "0.01em" }}
        >
          {card.title.map((line, j) => (
            <span key={j} className="block">{line}</span>
          ))}
        </h2>
      </div>

      {/* Body */}
      <p
        className="text-[#444] group-hover:text-white/90 leading-relaxed flex-1 relative z-10 transition-colors duration-300"
        style={{ fontSize: "14px", lineHeight: 1.75 }}
      >
        {card.desc}
      </p>

      {/* CTA */}
      <Link
        href={card.href}
        className="mt-10 inline-flex items-center gap-2 text-[#999] group-hover:text-white transition-colors duration-300 relative z-10"
        style={{ fontSize: "11px", letterSpacing: "0.15em" }}
      >
        <span className="uppercase font-medium">Xem chi tiết</span>
        <span style={{ fontSize: "14px", lineHeight: 1 }}>→</span>
      </Link>
    </motion.div>
  );
}

function InfoCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <div ref={ref} className="info-cards-grid grid grid-cols-2 gap-5 bg-white pb-16" style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD }}>
      {infoCards.map((card, i) => (
        <CardItem key={i} card={card} i={i} inView={inView} />
      ))}
    </div>
  );
}

export default function AboutPage() {

  return (
    <main style={{ paddingTop: 68 }}>
      {/* Hero image — full bleed */}
      <div className="relative w-full">
        <Image
          src="/hero-ve-psd.webp"
          alt="PSD Group — Kiến tạo thịnh vượng"
          width={1920}
          height={1080}
          className="w-full h-auto block hidden md:block"
          priority
          unoptimized
        />
        <Image
          src="/mobile-hero-ve-psd.webp"
          alt="PSD Group — Kiến tạo thịnh vượng"
          width={800}
          height={1000}
          className="w-full h-auto block md:hidden"
          priority
          unoptimized
        />
      </div>
      <Breadcrumb items={[{ label: "Giới thiệu chung" }]} />

      {/* Intro text */}
      <div className="bg-white py-14" style={{ paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD }}>
        <h1
          className="font-bold text-[#444] mb-8 uppercase tracking-wide"
          style={{ fontSize: "32px", lineHeight: 1.2 }}
        >
          Hơn một tập đoàn kinh tế — một hành trình kiến tạo giá trị bền vững
        </h1>

        <div className="space-y-5 text-[#555]" style={{ fontSize: "16px", lineHeight: 1.85, fontStyle: "italic" }}>
          <p>
            Từ năm 2013, PSD Group đã từng bước xây dựng một hệ sinh thái doanh nghiệp đa ngành, nơi sức mạnh kinh tế và chiều sâu văn hóa hội tụ để phụng sự cộng đồng và đất nước.
          </p>
          <p>
            PSD Group vận hành theo một vòng tuần hoàn giá trị: các lĩnh vực kinh tế tạo ra nguồn lực, nguồn lực được tái đầu tư cho văn hóa – xã hội, và chính chiều sâu văn hóa lại trở thành lợi thế cạnh tranh, định hướng dài hạn cho mọi hoạt động kinh doanh.
          </p>
          <p>8 lĩnh vực hoạt động trọng tâm của Tập đoàn bao gồm:</p>
          <p style={{ fontStyle: "normal", color: "#444" }}>
            {["- Bất động sản & Hạ tầng","- Sản xuất & Công nghiệp","- Khoáng sản","- Logistics & Cảng biển","- Nông nghiệp & Thủy sản","- Du lịch & Dịch vụ sinh thái","- Đầu tư & Dịch vụ","- Trách nhiệm Xã hội"].map((item) => (
              <span key={item} className="block">{item}</span>
            ))}
          </p>
        </div>
      </div>

      {/* 3 info cards — mỗi card có border riêng, gap giữa */}
      <InfoCards />

      {/* Đối tác chiến lược */}
      <div style={{ background: "#f3f3f3", paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD, paddingTop: 72, paddingBottom: 72 }}>
        <div className="partners-layout-grid" style={{ display: "grid", gridTemplateColumns: "28% 1fr", gap: "clamp(40px, 6vw, 100px)", alignItems: "center" }}>

          {/* Cột trái */}
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 300, color: "#333", textTransform: "uppercase" as const, letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: 20 }}>
              Đối tác chiến lược
            </h2>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontStyle: "italic" as const }}>
              PSD Group mở rộng hợp tác với các tổ chức, doanh nghiệp và đối tác chiến lược cùng chung tầm nhìn phát triển bền vững.
            </p>
          </div>

          {/* Cột phải — logo grid 3×2 */}
          <div className="partners-logo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: 48, columnGap: 40, alignItems: "center" }}>
            {partners.map((p, i) => (
              <div key={i} style={{ position: "relative" as const, height: 70 }}>
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center", mixBlendMode: "multiply", transform: `scale(${p.scale})` }}
                  unoptimized
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}

