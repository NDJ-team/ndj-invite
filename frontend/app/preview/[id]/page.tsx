"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { templates } from "@/lib/templates";
import { getPreviewData, getLayoutForTemplate } from "@/lib/previewData";
import { ClassicLayout, SplitLayout, DarkLayout, MinimalLayout, GalleryLayout, RomanticLayout } from "@/components/preview-layouts";

function Countdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(date).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  const blocks = [
    { val: timeLeft.days, label: "Дней" },
    { val: timeLeft.hours, label: "Часов" },
    { val: timeLeft.minutes, label: "Минут" },
    { val: timeLeft.seconds, label: "Секунд" },
  ];

  return (
    <div className="flex justify-center gap-3">
      {blocks.map((b) => (
        <div key={b.label} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <span className="text-xl sm:text-2xl font-serif text-white font-light">
              {String(b.val).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1.5 uppercase tracking-wider">{b.label}</p>
        </div>
      ))}
    </div>
  );
}

const layoutMap = {
  classic: ClassicLayout,
  split: SplitLayout,
  dark: DarkLayout,
  minimal: MinimalLayout,
  gallery: GalleryLayout,
  romantic: RomanticLayout,
};

export default function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const templateIndex = templates.findIndex((t) => t.id === id);
  const template = templates[templateIndex >= 0 ? templateIndex : 0];
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no">("yes");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [showOrder, setShowOrder] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-serif mb-4">Шаблон не найден</h1>
          <Link href="/catalog" className="text-[#C9A96E] hover:underline">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const data = getPreviewData(template);
  const layout = getLayoutForTemplate(template, templateIndex >= 0 ? templateIndex : 0);
  const LayoutComponent = layoutMap[layout] || ClassicLayout;

  // Simple hash for countdown
  const countdownDate = new Date(Date.now() + (30 + templateIndex * 5) * 86400000).toISOString();

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
  };

  return (
    <div className="bg-gray-900">
      {/* Demo Banner */}
      <div className="bg-[#C9A96E] text-white text-center py-2 text-sm font-medium sticky top-0 z-50">
        Превью шаблона «{template.name}» · Так будет выглядеть ваше приглашение
      </div>

      {/* The Preview Layout */}
      <LayoutComponent template={template} data={data} />

      {/* Countdown Section */}
      <div className="bg-gray-950 py-12 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">До начала осталось</p>
          <Countdown date={countdownDate} />
        </div>
      </div>

      {/* RSVP Section */}
      <div className="bg-gray-900 py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-2">Подтвердите участие</h2>
          <p className="text-gray-500 text-sm mb-8">Пожалуйста, дайте нам знать о вашем присутствии</p>

          {!rsvpSent ? (
            <form onSubmit={handleRsvp} className="space-y-4">
              <div className="flex gap-3">
                <button type="button" onClick={() => setRsvpAttending("yes")} className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all duration-300 ${rsvpAttending === "yes" ? "border-[#C9A96E] bg-[#C9A96E] text-white" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                  Буду рад(а)
                </button>
                <button type="button" onClick={() => setRsvpAttending("no")} className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all duration-300 ${rsvpAttending === "no" ? "border-gray-500 bg-gray-500 text-white" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                  Не смогу
                </button>
              </div>
              <input type="text" placeholder="Ваше имя" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none" required />
              <select value={rsvpCount} onChange={(e) => setRsvpCount(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none">
                <option value="1">1 человек</option>
                <option value="2">2 человека</option>
                <option value="3">3 человека</option>
                <option value="4">4+ человека</option>
              </select>
              <button type="submit" className="w-full py-3 bg-[#C9A96E] text-white rounded-xl font-medium hover:bg-[#B8944F] transition-all duration-300">
                Отправить ответ
              </button>
            </form>
          ) : (
            <div className="bg-green-900/30 border border-green-800 rounded-xl p-6">
              <p className="text-green-400 font-medium">
                {rsvpAttending === "yes" ? "Спасибо! Мы будем рады вас видеть!" : "Спасибо за ответ! Очень жаль."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order CTA */}
      <div className="bg-gray-950 py-16 px-6 border-t border-gray-800">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-3">Нравится этот шаблон?</h2>
          <p className="text-gray-500 mb-8 text-sm">Закажите персональное приглашение с вашими данными. Готово за 24 часа.</p>

          <div className="bg-gray-900 rounded-2xl p-5 mb-8 text-left flex items-center gap-4">
            <img src={template.image} alt={template.name} className="w-14 h-18 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-serif truncate">{template.name}</h3>
              <p className="text-gray-500 text-xs truncate">{template.short_desc}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xl font-bold text-[#C9A96E]">{template.price}</span>
              <span className="text-gray-500 text-xs ml-1">сом</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/order?template=${template.id}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#B8944F] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              Заказать этот шаблон
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/catalog" className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-medium transition-all border border-gray-700">
              Назад в каталог
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
