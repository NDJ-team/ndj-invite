"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    id: "wedding",
    name: "Свадьба",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&h=600&q=80",
  },
  {
    id: "kyz-uzatuu",
    name: "Кыз узатуу",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&h=600&q=80",
  },
  {
    id: "sunnot-toi",
    name: "Сүннөт той",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&h=600&q=80",
  },
  {
    id: "tushoo-toi",
    name: "Тушоо той",
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=600&h=600&q=80",
  },
  {
    id: "jubilee",
    name: "Юбилей",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&h=600&q=80",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-gold mb-3 font-medium">
            Выберите тип мероприятия
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-4">
            Все категории
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Подбираем шаблон под любой тип праздника — от свадьбы до юбилея
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <Link href={`/catalog?category=${cat.id}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold rounded-2xl transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-lg sm:text-xl font-serif font-light text-center px-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
