"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const VP = { once: true, amount: 0 };

export default function IntroSection() {

  return (
    <section className="relative overflow-hidden bg-[#f7f7f7] py-[30px]">

      {/* Decorative background — trống đồng desktop: far left */}
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-[950px] h-[950px] opacity-[0.3] pointer-events-none select-none" style={{ left: -120 }}>
        <img src="/trong-dong-gold.webp" alt="" className="w-full h-full object-contain" />
      </div>
      {/* Decorative background — trống đồng mobile: behind top content */}
      <div className="md:hidden absolute top-[60px] left-1/2 -translate-x-1/2 w-[475px] h-[475px] opacity-[0.25] pointer-events-none select-none">
        <img src="/trong-dong-gold.webp" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="container-psd relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Quote + content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7 }}
          >
            {/* Accent bar */}
            <div className="w-10 h-[3px] bg-[#e82127] rounded-full mb-8" />

            {/* Opening quote mark */}
            <div className="text-[#e82127] leading-none mb-2 select-none" style={{ fontSize: "72px", fontFamily: "Georgia, serif", lineHeight: 0.8 }}>
              &ldquo;
            </div>

            {/* Quote text */}
            <blockquote
              className="font-bold italic text-[#1a1a1a] leading-[1.35] mb-2"
              style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}
            >
              Một tập đoàn lớn không chỉ tạo ra lợi nhuận, mà còn đồng hành cùng những{" "}
              <em className="text-[#e82127] not-italic font-bold">mục tiêu Quốc gia</em>.
            </blockquote>

            {/* Closing quote mark */}
            <div className="text-[#e82127] leading-none mb-8 text-right select-none" style={{ fontSize: "72px", fontFamily: "Georgia, serif", lineHeight: 0.8 }}>
              &rdquo;
            </div>

            {/* Body */}
            <p className="text-[#6e6e74] leading-relaxed mb-10" style={{ fontSize: "clamp(14px, 1.1vw, 16px)" }}>
              Tại PSD Group, chúng tôi tin rằng quy mô của một doanh nghiệp được đo bằng giá trị nó để lại, chứ không chỉ bằng con số doanh thu. Sự phát triển bền vững của chúng tôi luôn được cân bằng giữa hiệu quả kinh tế vững chắc và những đóng góp lâu dài cho văn hóa, cộng đồng và xã hội.
            </p>

            {/* CTA */}
            <Link
              href="/ve-psd-group"
              className="group relative inline-flex items-center gap-2 border border-[#e82127] text-[#e82127] font-medium px-6 py-3 rounded-lg overflow-hidden transition-colors duration-300 text-[14px] hover:text-white"
            >
              <span className="absolute inset-0 bg-[#e82127] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="relative">Tìm hiểu về PSD Group</span>
              <ArrowRight size={15} className="relative" />
            </Link>
          </motion.div>

          {/* RIGHT — Vietnam map visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-center justify-center -mt-6 md:mt-0"
          >
            <div className="relative flex items-center justify-center"
              style={{ width: "clamp(300px, 80vw, 620px)", height: "clamp(300px, 80vw, 620px)" }}
            >

              {/* Ring 1 — đỏ, clockwise 10s */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 620 620" fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="310" cy="310" r="300" stroke="#e82127" strokeWidth="4" strokeOpacity="0.7" strokeDasharray="520 104" />
              </motion.svg>

              {/* Ring 2 — vàng, counter-clockwise 14s */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 620 620" fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="310" cy="310" r="258" stroke="#f0a500" strokeWidth="3.5" strokeOpacity="0.6" strokeDasharray="280 148" />
              </motion.svg>

              {/* Ring 3 — đỏ, clockwise 18s */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 620 620" fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="310" cy="310" r="216" stroke="#e82127" strokeWidth="3" strokeOpacity="0.45" strokeDasharray="340 115" />
              </motion.svg>

              {/* Ring 4 — vàng, counter-clockwise 22s */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 620 620" fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="310" cy="310" r="174" stroke="#f0a500" strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="160 130" />
              </motion.svg>

              {/* Bản đồ */}
              <div className="relative z-10">
                <img
                  src="/ban-do-vn-muc-tieu-qg.webp"
                  alt="Bản đồ Việt Nam"
                  className="h-auto"
                  style={{ width: "clamp(240px, 64vw, 480px)" }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
