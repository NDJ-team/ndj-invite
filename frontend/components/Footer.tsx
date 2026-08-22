"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-gray-500 text-sm">2026 NDJ Invite. Все права защищены.</p>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <a href="https://t.me/NDJInviteBot" className="text-gray-500 hover:text-gold transition-colors">
            📱 Telegram
          </a>
          <Link href="/about" className="text-gray-500 hover:text-gold transition-colors">
            О нас
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-gold transition-colors">
            Контакты
          </Link>
        </div>
      </div>
    </footer>
  );
}