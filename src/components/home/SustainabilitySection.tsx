"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const VP = { once: true, amount: 0 };

type Project = {
  id: string;
  title: string;
  label: string;
  shortDesc: string | null;
  thumbnail: string | null;
};

const FALLBACK = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=70";

export default function SustainabilitySection() {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "0px" });
  const [pillars, setPillars] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/phung-su")
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setPillars(data.filter((p: Project & { isActive?: boolean }) => p.isActive !== false).slice(0, 4)) : null)
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white overflow-hidden" ref={ref}>
      <div className="container-psd">
        <div className="grid grid-cols-1 gap-12">
          {/* Content */}
          <div>
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
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <Link href={`/phung-su-xa-hoi/${pillar.id}`} className="block rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                      <Image
                        src={pillar.thumbnail || FALLBACK}
                        alt={pillar.title}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Text */}
                    <div className="p-4">
                      {pillar.label && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#e82127] mb-1 block">{pillar.label}</span>
                      )}
                      <h4 className="font-semibold text-[14px] text-[#1a1a1a] mb-1 leading-snug line-clamp-2">
                        {pillar.title}
                      </h4>
                      {pillar.shortDesc && (
                        <p className="text-[12px] text-[#6e6e74] leading-snug line-clamp-2">{pillar.shortDesc}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e82127] mt-2">
                        Xem thêm <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/phung-su-xa-hoi"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#e82127] hover:gap-3 transition-all duration-300 uppercase tracking-wider"
              >
                Xem tất cả dự án <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
