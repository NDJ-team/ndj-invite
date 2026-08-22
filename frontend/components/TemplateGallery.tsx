"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Template } from "@/lib/templates";

interface TemplateGalleryProps {
  templates: Template[];
}

const categoryNames: Record<string, string> = {
  wedding: "Свадьба",
  "kyz-uzatuu": "Кыз узатуу",
  "sunnot-toi": "Сүннөт той",
  "tushoo-toi": "Тушоо той",
  jubilee: "Юбилей",
};

export default function TemplateGallery({ templates }: TemplateGalleryProps) {
  const featured = templates.slice(0, 6);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-gold mb-3 font-medium">
            Наши работы
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-4">
            Популярные дизайны
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Лучшие шаблоны для вашего события — от классики до современного минимализма
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <Link href={`/preview/${template.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-xs text-white rounded-full font-medium border border-white/10">
                        {categoryNames[template.category] || template.category}
                      </span>
                    </div>

                    <div className="absolute top-3 left-3">
                      <div className="px-3 py-1.5 bg-gold text-white text-xs font-bold rounded-full shadow-lg">
                        {template.price} сом
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <h3 className="text-2xl font-serif font-light mb-1 drop-shadow-lg">
                        {template.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-3 drop-shadow line-clamp-2">
                        {template.short_desc}
                      </p>
                      <div className="flex items-center gap-3">
                        {template.old_price && (
                          <span className="text-sm line-through opacity-60">
                            {template.old_price} сом
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium group-hover:bg-gold transition-colors duration-300">
                          Заказать
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            Смотреть все шаблоны
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
