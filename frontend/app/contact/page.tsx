"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-800 mb-8 text-center">
            Контакты
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Есть вопросы? Свяжитесь с нами любым удобным способом.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-medium text-gray-800">Telegram</h3>
                <p className="text-gray-600">
                  <a
                    href="https://t.me/NDJInviteBot"
                    className="text-gold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @NDJInviteBot
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-medium text-gray-800">Телефон</h3>
                <p className="text-gray-600">+996 (776) 260-702</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📧</span>
              <div>
                <h3 className="font-medium text-gray-800">Email</h3>
                <p className="text-gray-600">hello@ndj.group</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium text-gray-800">Город</h3>
                <p className="text-gray-600">Бишкек, Кыргызstan</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/order"
              className="inline-block bg-gold text-white px-10 py-4 rounded-full font-medium hover:bg-gold-dark transition-all"
            >
              Заказать приглашение
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
