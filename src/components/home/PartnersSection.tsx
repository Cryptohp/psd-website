"use client";


import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const VP = { once: true, amount: 0 };

const partners = [
  { name: "Công ty Cổ phần Đầu tư MST",            logo: "/partner-mst.webp" },
  { name: "Tập đoàn Hóa chất Việt Nam Vinachem",   logo: "/partner-vinachem.webp", logoHeight: 90 },
  { name: "Công ty CP Đầu tư Xây dựng VINA2",      logo: "/partner-vina2.webp" },
  { name: "Ngân hàng SHB",                          logo: "/partner-shb.webp" },
  { name: "Ngân hàng BIDV",                         logo: "/partner-bidv.webp" },
  { name: "Tập đoàn Stavian",                       logo: "/partner-stavian.webp" },
];

export default function PartnersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-psd">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
            <span className="text-[13px] font-semibold text-[#e82127] tracking-wider uppercase">
              Đối tác chiến lược
            </span>
            <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
          </div>
          <h2 className="text-section-title text-[#1a1a1a] mb-3">
            Đồng hành cùng{" "}
            <span className="text-[#e82127]">những tên tuổi lớn</span>
          </h2>
          <p className="text-[15px] text-[#6e6e74] max-w-[480px] mx-auto">
            PSD Group xây dựng hệ thống đối tác bền vững với các tổ chức tài chính, doanh nghiệp
            và địa phương trên cả nước.
          </p>
        </motion.div>

        {/* Partners grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }} viewport={VP}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col items-center justify-between gap-0 p-6 border border-[#e5e5e7] bg-white cursor-default"
              style={{ transition: "transform 0.25s ease, border-color 0.25s ease", minHeight: 160 }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.borderColor = "rgba(232,33,39,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "#e5e5e7";
              }}
            >
              <div className="flex items-center justify-center w-full" style={{ height: 80 }}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={80}
                  unoptimized
                  style={{ width: "auto", height: "auto", maxHeight: 80 }}
                  className="object-contain mx-auto"
                />
              </div>
              <span className="text-[12px] text-[#6e6e74] text-center leading-snug mt-4">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

