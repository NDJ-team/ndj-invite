"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { templates, Template } from "@/lib/templates";

const categories = [
  { id: "all", name: "Все", emoji: "✨" },
  { id: "wedding", name: "Свадьба", emoji: "💍" },
  { id: "kyz-uzatuu", name: "Кыз узатуу", emoji: "👰" },
  { id: "sunnot-toi", name: "Сүннөт той", emoji: "🕌" },
  { id: "tushoo-toi", name: "Тушоо той", emoji: "🎂" },
  { id: "jubilee", name: "Юбилей", emoji: "🎉" },
];

const categoryNames: Record<string, string> = {
  wedding: "Свадьба",
  "kyz-uzatuu": "Кыз узатуу",
  "sunnot-toi": "Сүннөт той",
  "tushoo-toi": "Тушоо той",
  jubilee: "Юбилей",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&h=1080&q=80')`,
            transform: loaded ? "scale(1)" : "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `rgba(201, 169, 110, ${0.3 + Math.random() * 0.4})`,
                animation: `particleFloat ${3 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light mb-4 drop-shadow-2xl">
            Каталог шаблонов
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto drop-shadow-lg">
            Выберите идеальный дизайн для вашего праздника.
            {filtered.length} шаблонов с поддержкой русского и кыргизского языков.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const url = cat.id === "all" ? "/catalog" : `/catalog?category=${cat.id}`;
                  window.history.pushState({}, "", url);
                }}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gold text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((template, index) => (
              <CatalogCard key={template.id} template={template} index={index} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-16 text-lg">
              Шаблоны в этой категории скоро будут добавлены.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function CatalogCard({ template, index }: { template: Template; index: number }) {
  return (
    <Link href={`/preview/${template.id}`} className="group block">
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image */}
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-cover catalog-card-img"
          loading="lazy"
        />

        {/* Always visible gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-xs text-white rounded-full font-medium border border-white/10">
            {categoryNames[template.category] || template.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="px-3 py-1.5 bg-gold text-white text-xs font-bold rounded-full shadow-lg">
            {template.price} сом
          </div>
        </div>

        {/* Content always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
          <h3 className="text-xl font-serif font-light mb-1 drop-shadow-lg">
            {template.name}
          </h3>
          <p className="text-sm opacity-90 mb-2 drop-shadow line-clamp-2">
            {template.short_desc}
          </p>
          <div className="flex items-center gap-2">
            {template.old_price && (
              <span className="text-sm line-through opacity-60">
                {template.old_price} сом
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium group-hover:bg-gold transition-colors duration-300">
              Заказать
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
