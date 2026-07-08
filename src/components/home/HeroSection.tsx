"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full" style={{ paddingTop: 68 }}>

      {/* Mobile hero */}
      <div className="relative w-full md:hidden">
        <Image
          src="/mobile-hero-trang-chu-03.png"
          alt="PSD Group"
          width={750}
          height={1200}
          priority
          unoptimized
          className="w-full h-auto block"
        />
      </div>

      {/* Desktop hero */}
      <div className="relative w-full hidden md:block">
        <Image
          src="/home-hero-06.png"
          alt="PSD Group"
          width={1920}
          height={1080}
          priority
          unoptimized
          className="w-full h-auto block"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 right-10 z-10 flex flex-col items-center gap-2"
      >
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", writingMode: "vertical-rl" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} color="rgba(255,255,255,0.4)" />
        </motion.div>
      </motion.div>

    </section>
  );
}
