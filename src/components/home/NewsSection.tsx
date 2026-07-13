"use client";


import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const VP = { once: true, amount: 0 };

type NewsItem = {
  id: string; slug: string; title: string; excerpt: string | null;
  category: string; date: string; image: string | null;
};


const categoryColor: Record<string, string> = {
  "Tin PSD Group": "bg-[#e82127]/10 text-[#e82127]",
  "Tin dự án": "bg-blue-100 text-blue-700",
  "Hoạt động cộng đồng": "bg-green-100 text-green-700",
};

export default function NewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/tin-tuc?featured=true")
      .then(r => r.json())
      .then(data => setNews(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  const featured = news[0] ?? null;
  const secondary = news.slice(1);

  return (
    <section className="section-padding bg-[#f4f4f5]" ref={ref}>
      <div className="container-psd">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={VP}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[3px] bg-[#e82127] rounded-full" />
              <span className="text-[13px] font-semibold text-[#e82127] tracking-wider uppercase">
                Tin tức & Truyền thông
              </span>
            </div>
            <h2 className="text-section-title text-[#1a1a1a]">
              Câu chuyện{" "}
              <span className="text-[#e82127]">từ PSD Group</span>
            </h2>
          </div>
          {/* Desktop only */}
          <div className="hidden sm:block flex-shrink-0">
            <Link href="/tin-tuc" className="btn-outline gap-2">
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Asymmetric grid: 1 featured lớn trái + 2 nhỏ phải */}
        {news.length === 0 ? null : (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Featured card — chiếm 3/5 */}
          {featured && <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={`/tin-tuc/${featured.slug}`} className="group card-psd overflow-hidden bg-white flex flex-col h-full block">
              {/* Image lớn */}
              <div className="card-img-wrap relative h-[300px] lg:h-[360px]">
                <Image
                  src={featured.image ?? "/placeholder-news.jpg"}
                  alt={featured.title}
                  fill
                  className="card-img-inner object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Category overlay */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm ${categoryColor[featured.category] || "bg-gray-100 text-gray-600"}`}>
                    <Tag size={10} />
                    {featured.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="flex items-center gap-1.5 text-[12px] text-[#6e6e74] mb-3">
                  <Calendar size={12} />
                  {featured.date}
                </span>
                <h3 className="font-bold text-[20px] text-[#1a1a1a] leading-snug mb-3 group-hover:text-[#e82127] transition-colors duration-300 line-clamp-2">
                  {featured.title}
                </h3>
                <p className="text-[14px] text-[#6e6e74] leading-relaxed line-clamp-3 flex-1">
                  {featured.excerpt ?? ""}
                </p>
                <div className="mt-5">
                  <span className="btn-text-link text-[13px]">
                    Đọc bài viết
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>}

          {/* Secondary cards — chiếm 2/5, xếp dọc */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {secondary.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex-1"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              >
                <Link href={`/tin-tuc/${item.slug}`} className="group card-psd overflow-hidden bg-white flex flex-col h-full block">
                  {/* Image nhỏ */}
                  <div className="card-img-wrap relative h-[160px]">
                    <Image
                      src={item.image ?? "/placeholder-news.jpg"}
                      alt={item.title}
                      fill
                      className="card-img-inner object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm ${categoryColor[item.category] || "bg-gray-100 text-gray-600"}`}>
                        <Tag size={9} />
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="flex items-center gap-1 text-[11px] text-[#6e6e74] mb-2">
                      <Calendar size={11} />
                      {item.date}
                    </span>
                    <h3 className="font-bold text-[14px] text-[#1a1a1a] leading-snug mb-2 group-hover:text-[#e82127] transition-colors duration-300 line-clamp-2 flex-1">
                      {item.title}
                    </h3>
                    <span className="btn-text-link text-[12px] mt-2">
                      Đọc thêm
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile "Xem tất cả" at bottom, centered */}
        <div className="flex sm:hidden justify-center mt-8">
          <Link href="/tin-tuc" className="inline-flex items-center gap-2 border border-[#e82127] text-[#e82127] font-semibold px-4 py-2 text-[12px] rounded-lg">
            Xem tất cả
            <ArrowRight size={13} />
          </Link>
        </div>
        </>
        )}

      </div>
    </section>
  );
}

