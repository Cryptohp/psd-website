"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    desktop: "/home-hero-06.png",
    mobile: "/mobile-hero-trang-chu-03.png",
    desktopW: 1920,
    desktopH: 1080,
    mobileW: 750,
    mobileH: 1200,
  },
  {
    desktop: "/home-hero-02.jpg",
    mobile: "/mobile-home-hero-02.jpg",
    desktopW: 1920,
    desktopH: 1080,
    mobileW: 750,
    mobileH: 1200,
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ paddingTop: 68 }}>

      {/* Mobile slider */}
      <div className="relative w-full md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={slides[current].mobile}
              alt="PSD Group"
              width={slides[current].mobileW}
              height={slides[current].mobileH}
              priority
              unoptimized
              className="w-full h-auto block"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop slider */}
      <div className="relative w-full hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={`desktop-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={slides[current].desktop}
              alt="PSD Group"
              width={slides[current].desktopW}
              height={slides[current].desktopH}
              priority
              unoptimized
              className="w-full h-auto block"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              transform: i === current ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
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
