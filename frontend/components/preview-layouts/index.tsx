"use client";

import { motion, type Variants } from "framer-motion";
import { PreviewData } from "@/lib/previewData";
import { Template } from "@/lib/templates";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 1, delay: i * 0.2, ease: "easeOut" },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// === LAYOUT: CLASSIC — Full hero, centered elegant ===
export function ClassicLayout({ template, data }: { template: Template; data: PreviewData }) {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url('${template.image}')` }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 text-center text-white px-6 max-w-lg">
          <motion.p className="text-xs uppercase tracking-[0.4em] mb-6 opacity-70" custom={0} variants={fadeIn} initial="hidden" animate="visible">
            Приглашение на {template.category === "wedding" ? "свадьбу" : "торжество"}
          </motion.p>
          <motion.div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: data.accentColor }} custom={1} variants={scaleIn} initial="hidden" animate="visible" />
          <motion.h1 className="text-5xl sm:text-6xl font-serif font-light mb-4 leading-tight" custom={2} variants={fadeUp} initial="hidden" animate="visible">
            {data.names}
          </motion.h1>
          <motion.div className="w-12 h-px mx-auto my-6" style={{ backgroundColor: data.accentColor }} custom={3} variants={scaleIn} initial="hidden" animate="visible" />
          <motion.p className="text-lg opacity-80 leading-relaxed mb-8" custom={4} variants={fadeUp} initial="hidden" animate="visible">
            {data.message}
          </motion.p>
          <motion.p className="text-xl font-serif" custom={5} variants={fadeUp} initial="hidden" animate="visible">
            {data.date} · {data.time}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// === LAYOUT: SPLIT — Left image, right content ===
export function SplitLayout({ template, data }: { template: Template; data: PreviewData }) {
  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <motion.div
          className="relative h-[50vh] lg:h-screen"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${template.image}')` }} />
          <div className="absolute inset-0 bg-black/20 lg:bg-transparent" />
        </motion.div>
        <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="max-w-md">
            <motion.p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: data.accentColor }} custom={0} variants={fadeUp} initial="hidden" animate="visible">
              Приглашение
            </motion.p>
            <motion.h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-800 mb-6 leading-tight" custom={1} variants={fadeUp} initial="hidden" animate="visible">
              {data.names}
            </motion.h1>
            <motion.div className="w-16 h-px mb-8" style={{ backgroundColor: data.accentColor }} custom={2} variants={scaleIn} initial="hidden" animate="visible" />
            <motion.p className="text-gray-600 leading-relaxed mb-8" custom={3} variants={fadeUp} initial="hidden" animate="visible">
              {data.message}
            </motion.p>
            <motion.div className="space-y-4" custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${data.accentColor}15` }}>
                  <svg className="w-5 h-5" style={{ color: data.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Дата</p>
                  <p className="font-medium text-gray-800">{data.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${data.accentColor}15` }}>
                  <svg className="w-5 h-5" style={{ color: data.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Место</p>
                  <p className="font-medium text-gray-800">{data.venue}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === LAYOUT: DARK — Dark theme, gold accents ===
export function DarkLayout({ template, data }: { template: Template; data: PreviewData }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative h-[60vh] flex items-end">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url('${template.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        <div className="relative z-10 p-8 sm:p-12 w-full">
          <motion.p className="text-xs uppercase tracking-[0.4em] mb-4 opacity-50" custom={0} variants={fadeUp} initial="hidden" animate="visible">
            {template.name}
          </motion.p>
          <motion.h1 className="text-5xl sm:text-6xl font-serif font-light leading-tight" custom={1} variants={fadeUp} initial="hidden" animate="visible">
            {data.names}
          </motion.h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-16">
        <motion.div className="w-20 h-px mx-auto mb-12" style={{ backgroundColor: data.accentColor }} custom={2} variants={scaleIn} initial="hidden" animate="visible" />
        <motion.p className="text-center text-gray-400 leading-relaxed mb-12" custom={3} variants={fadeUp} initial="hidden" animate="visible">
          {data.message}
        </motion.p>
        <motion.div className="grid grid-cols-2 gap-8 mb-12" custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <div className="text-center p-6 rounded-2xl border border-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Дата</p>
            <p className="text-lg font-serif" style={{ color: data.accentColor }}>{data.date}</p>
            <p className="text-sm text-gray-500 mt-1">{data.time}</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Место</p>
            <p className="text-lg font-serif text-white">{data.venue}</p>
            <p className="text-sm text-gray-500 mt-1">{data.address}</p>
          </div>
        </motion.div>
        <motion.div className="text-center p-6 rounded-2xl border border-gray-800" custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Дресс-код</p>
          <p className="text-gray-400 text-sm">{data.dresscode}</p>
        </motion.div>
      </div>
    </div>
  );
}

// === LAYOUT: MINIMAL — White, clean, centered ===
export function MinimalLayout({ template, data }: { template: Template; data: PreviewData }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <motion.div className="w-32 h-40 mx-auto mb-10 rounded-2xl overflow-hidden shadow-xl" custom={0} variants={scaleIn} initial="hidden" animate="visible">
          <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
        </motion.div>
        <motion.p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: data.accentColor }} custom={1} variants={fadeUp} initial="hidden" animate="visible">
          Приглашение
        </motion.p>
        <motion.h1 className="text-4xl font-serif font-light text-gray-800 mb-4 leading-tight" custom={2} variants={fadeUp} initial="hidden" animate="visible">
          {data.names}
        </motion.h1>
        <motion.div className="w-8 h-px mx-auto mb-6" style={{ backgroundColor: data.accentColor }} custom={3} variants={scaleIn} initial="hidden" animate="visible" />
        <motion.p className="text-gray-500 leading-relaxed mb-10 text-sm" custom={4} variants={fadeUp} initial="hidden" animate="visible">
          {data.message}
        </motion.p>
        <motion.div className="space-y-6" custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <div className="py-4 border-t border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-1">{data.date}</p>
            <p className="font-medium" style={{ color: data.accentColor }}>{data.time}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{data.venue}</p>
            <p className="text-gray-600 text-sm">{data.address}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// === LAYOUT: GALLERY — Multiple photos mosaic ===
export function GalleryLayout({ template, data }: { template: Template; data: PreviewData }) {
  // Use different crops of the same image for mosaic
  const mosaicImages = [
    `${template.image}`,
    `${template.image}`,
    `${template.image}`,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Photo Mosaic */}
        <div className="grid grid-cols-2 gap-3 mb-10 rounded-3xl overflow-hidden">
          <motion.div className="col-span-2 h-64 relative" custom={0} variants={scaleIn} initial="hidden" animate="visible">
            <img src={mosaicImages[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
          <motion.div className="h-48 relative" custom={1} variants={scaleIn} initial="hidden" animate="visible">
            <img src={mosaicImages[1]} alt="" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div className="h-48 relative" custom={2} variants={scaleIn} initial="hidden" animate="visible">
            <img src={mosaicImages[2]} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center">
          <motion.h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-800 mb-3" custom={3} variants={fadeUp} initial="hidden" animate="visible">
            {data.names}
          </motion.h1>
          <motion.div className="w-10 h-px mx-auto mb-6" style={{ backgroundColor: data.accentColor }} custom={4} variants={scaleIn} initial="hidden" animate="visible" />
          <motion.p className="text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto" custom={5} variants={fadeUp} initial="hidden" animate="visible">
            {data.message}
          </motion.p>

          <motion.div className="inline-flex items-center gap-6 px-8 py-4 bg-white rounded-full shadow-lg" custom={6} variants={scaleIn} initial="hidden" animate="visible">
            <span className="text-sm text-gray-400">{data.date}</span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-medium" style={{ color: data.accentColor }}>{data.time}</span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm text-gray-400">{data.venue}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// === LAYOUT: ROMANTIC — Soft, parallax, decorative ===
export function RomanticLayout({ template, data }: { template: Template; data: PreviewData }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-screen flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.2, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url('${template.image}')` }}
        />
        <div className="absolute inset-0 bg-white/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white" />

        {/* Decorative circles */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-white/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-white/15"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          style={{ bottom: "30%", right: "15%" }}
        />

        <div className="relative z-10 text-center text-white px-6">
          <motion.p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-70" custom={0} variants={fadeIn} initial="hidden" animate="visible">
            Save the Date
          </motion.p>
          <motion.h1 className="text-5xl sm:text-7xl font-serif font-light leading-tight drop-shadow-lg" custom={1} variants={fadeUp} initial="hidden" animate="visible">
            {data.names}
          </motion.h1>
          <motion.div className="w-16 h-px mx-auto my-8" style={{ backgroundColor: data.accentColor }} custom={2} variants={scaleIn} initial="hidden" animate="visible" />
          <motion.p className="text-xl font-serif opacity-90" custom={3} variants={fadeUp} initial="hidden" animate="visible">
            {data.date}
          </motion.p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.p className="text-gray-500 leading-relaxed mb-12" custom={4} variants={fadeUp} initial="hidden" animate="visible">
            {data.message}
          </motion.p>

          <motion.div className="grid grid-cols-3 gap-6 mb-12" custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${data.accentColor}10` }}>
                <svg className="w-6 h-6" style={{ color: data.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-xs text-gray-400 mb-1">Дата</p>
              <p className="text-sm font-medium text-gray-800">{data.date}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${data.accentColor}10` }}>
                <svg className="w-6 h-6" style={{ color: data.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-xs text-gray-400 mb-1">Время</p>
              <p className="text-sm font-medium text-gray-800">{data.time}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${data.accentColor}10` }}>
                <svg className="w-6 h-6" style={{ color: data.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-xs text-gray-400 mb-1">Место</p>
              <p className="text-sm font-medium text-gray-800">{data.venue}</p>
            </div>
          </motion.div>

          <motion.div className="p-6 rounded-2xl bg-gray-50 border border-gray-100" custom={6} variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-xs text-gray-400 mb-2">Дресс-код</p>
            <p className="text-sm text-gray-600">{data.dresscode}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
