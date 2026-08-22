"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  loaded: boolean;
}

const heroImages = [
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&h=1080&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&h=1080&q=80",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function HeroSection({ loaded }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Background */}
      {heroImages.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0 bg-cover bg-center hero-slide"
          initial={{ scale: 1.15 }}
          animate={loaded ? { scale: 1 } : {}}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{
            backgroundImage: `url('${src}')`,
            animationDelay: `${i * 8}s`,
            zIndex: i === 0 ? 1 : 0,
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-[2]" />

      {/* Gold Gradient Accents */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `rgba(201, 169, 110, ${0.2 + Math.random() * 0.4})`,
              animation: `particleFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-[4] text-center text-white px-4">
        <motion.div
          className="mb-6"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm tracking-widest uppercase">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Цифровые приглашения
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light mb-6 leading-[1.1] drop-shadow-2xl"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <span className="block">
            Ваш праздник
          </span>
          <span className="block text-gold">
            начинается здесь
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl opacity-90 mb-10 max-w-2xl mx-auto drop-shadow-lg leading-relaxed"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Элегантные сайты-приглашения для свадеб, кыз узатуу, юбилеев и любых торжеств.
          Быстрая подготовка и поддержка на русском и кыргизском языках.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/catalog"
              className="group relative inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-4 rounded-full font-medium transition-all duration-300 shadow-2xl hover:shadow-3xl"
            >
              <span>Смотреть каталог</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/order"
              className="group relative inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              <span>Заказать приглашение</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[4]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-7 h-11 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-gold rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
