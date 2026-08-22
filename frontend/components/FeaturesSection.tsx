"use client";

import { motion } from "framer-motion";

const features = [
  {
    emoji: "📱",
    title: "Для любого экрана",
    desc: "Безупречно выглядит и удобно работает на любом устройстве — от смартфона до ПК.",
  },
  {
    emoji: "✅",
    title: "Подтверждение участия",
    desc: "Гости смогут ответить прямо на странице приглашения. Вы получаете статистику в реальном времени.",
  },
  {
    emoji: "⏰",
    title: "Обратный отсчёт",
    desc: "Таймер мягко напоминает, что праздник становится ближе.",
  },
  {
    emoji: "📍",
    title: "Карта и маршрут",
    desc: "Адрес и удобный маршрут к месту торжества всегда под рукой.",
  },
  {
    emoji: "🌐",
    title: "Многоязычность",
    desc: "Подготовим приглашение на русском и кыргизском языках.",
  },
  {
    emoji: "⚡",
    title: "Быстрая подготовка",
    desc: "Персональное приглашение будет готово без долгого ожидания.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-gold mb-3 font-medium">
            Почему мы
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-4">
            Преимущества
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Всё, что нужно вашему приглашению — продуманные детали, с которыми
            делиться радостью легко и приятно.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-8 bg-white rounded-2xl shadow-sm group hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <motion.div
                className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 transition-colors duration-300"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <span className="text-3xl">{feature.emoji}</span>
              </motion.div>
              <h3 className="text-xl font-serif text-gray-800 mb-3 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
