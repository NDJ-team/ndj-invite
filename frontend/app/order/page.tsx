"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { templates } from "@/lib/templates";

const categoryNames: Record<string, string> = {
  wedding: "Свадьба",
  "kyz-uzatuu": "Кыз узатуу",
  "sunnot-toi": "Сүннөт той",
  "tushoo-toi": "Тушоо той",
  jubilee: "Юбилей",
  other: "Другое",
};

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <OrderForm />
    </Suspense>
  );
}

function OrderForm() {
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const tpl = searchParams.get("template");
    if (tpl) setSelectedTemplate(tpl);
  }, [searchParams]);

  const selectedTpl = templates.find((t) => t.id === selectedTemplate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !clientName || !phone || !agree) return;

    window.open(
      `https://t.me/NDJInviteBot?start=order_${selectedTemplate}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-800 mb-4">
          Заказать приглашение
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Выберите шаблон, заполните форму и получите готовое приглашение.
          Мы свяжемся с вами через Telegram для уточнения деталей.
        </p>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Шаблон
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                  required
                >
                  <option value="">— Выберите шаблон —</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} — {tpl.price} сом
                    </option>
                  ))}
                </select>
              </div>

              {selectedTpl && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={selectedTpl.image}
                      alt={selectedTpl.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-serif font-light">{selectedTpl.name}</h3>
                      <p className="text-sm opacity-90 mt-1">{selectedTpl.short_desc}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold">{selectedTpl.price} сом</span>
                        {selectedTpl.old_price && (
                          <span className="text-sm line-through opacity-70">
                            {selectedTpl.old_price} сом
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип события
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                >
                  <option value="wedding">Свадьба</option>
                  <option value="kyz-uzatuu">Кыз узатуу</option>
                  <option value="sunnot-toi">Сүннөт той</option>
                  <option value="tushoo-toi">Тушоо той</option>
                  <option value="jubilee">Юбилей</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Алия & Бекзат"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+996 (70) 123-45-67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дата, время, место проведения..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  Я согласен на обработку персональных данных
                </label>
              </div>

              <button
                type="submit"
                disabled={!selectedTemplate || !clientName || !phone || !agree}
                className="w-full py-4 bg-gold text-white rounded-full font-medium hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Отправить заявку через Telegram</span>
                <span>👉</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-serif text-gray-800 mb-4">Что вы получите</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Готовое цифровое приглашение с вашими данными</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Адаптивная страница для всех устройств</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Таймер обратного отсчёта до события</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Форма RSVP с подтверждением участия</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Галерея фотографий и карта проезда</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Поддержка на русском и кыргизском языках</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold">✓</span>
                  <span>Быстрая связь через Telegram</span>
                </li>
              </ul>
              {selectedTpl && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Выбранный шаблон:</p>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedTpl.name} (от {selectedTpl.price} сом)
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}