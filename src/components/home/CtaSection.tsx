"use client";


import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const VP = { once: true, amount: 0 };

export default function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="relative py-24 overflow-hidden bg-[#e82127]" ref={ref}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-psd relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.7 }}
          className="max-w-[680px] mx-auto text-center"
        >
          <h2 className="text-section-title text-white mb-5">
            Kết nối cùng PSD Group để{" "}
            <span className="underline decoration-white/40 underline-offset-4">
              kiến tạo giá trị bền vững
            </span>
          </h2>
          <p className="text-[17px] text-white/80 leading-relaxed mb-10">
            Dù bạn là nhà đầu tư, đối tác chiến lược hay ứng viên tiềm năng — PSD Group luôn
            sẵn sàng lắng nghe và cùng bạn xây dựng những giá trị có ý nghĩa.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-white text-[#e82127] font-semibold px-8 py-4 rounded-lg hover:bg-white/90 transition-colors text-[15px]"
            >
              Liên hệ hợp tác
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/du-an"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-8 py-4 rounded-lg transition-colors text-[15px]"
            >
              Khám phá dự án
            </Link>
            <a
              href="/tuyen-dung"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-8 py-4 rounded-lg transition-colors text-[15px]"
            >
              Tìm cơ hội nghề nghiệp
            </a>
          </div>

          {/* Contact quick */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }} viewport={VP}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-6 text-white/70"
          >
            <a
              href="tel:0782741534"
              className="flex items-center gap-2 hover:text-white transition-colors text-[14px]"
            >
              <Phone size={16} />
              0782 741 534
            </a>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <a
              href="mailto:psdgroup.hotmail@gmail.com"
              className="hover:text-white transition-colors text-[14px]"
            >
              psdgroup.hotmail@gmail.com
            </a>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[14px]">235–237 Khuất Duy Tiến, Hà Nội</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

