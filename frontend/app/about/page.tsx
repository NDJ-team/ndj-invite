"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-800 mb-8">
            О нас
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Priglasi Design — это платформа для создания элегантных цифровых
            приглашений для жизненно важных моментов: свадеб, кыз узатуу,
            юбилеев и других торжеств.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-serif text-lg text-gray-800 mb-2">Дизайн</h3>
              <p className="text-sm text-gray-600">
                Внимание к каждой детали — от шрифтов до анимаций
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-serif text-lg text-gray-800 mb-2">Скорость</h3>
              <p className="text-sm text-gray-600">
                Готовое приглашение за 24 часа после заказа
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-serif text-lg text-gray-800 mb-2">Поддержка</h3>
              <p className="text-sm text-gray-600">
                Связь через Telegram в любой момент
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-gray-800 mb-6">
            Готовы начать?
          </h2>
          <Link
            href="/order"
            className="inline-block bg-gold text-white px-10 py-4 rounded-full font-medium hover:bg-gold-dark transition-all"
          >
            Заказать приглашение
          </Link>
        </div>
      </section>
    </div>
  );
}
