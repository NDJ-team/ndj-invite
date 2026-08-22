"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { ProgramItem } from "@/types";

interface Props {
  slug: string;
}

export function RSVPForm({ slug }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", guests_count: 1, status: "CONFIRMED" as "CONFIRMED" | "DECLINED" });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.public.rsvp(slug, form);
      setMessage(res.message);
      setSubmitted(true);
    } catch (err: any) {
      setMessage(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <p className="text-4xl mb-3">{form.status === "CONFIRMED" ? "🎉" : "💌"}</p>
        <p className="text-lg font-medium text-gray-800">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        placeholder="Ваше имя"
        className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
        required
      />
      <input
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        placeholder="Телефон (необязательно)"
        className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
      />
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500">Гостей:</span>
        <button type="button" onClick={() => setForm(p => ({ ...p, guests_count: Math.max(1, p.guests_count - 1) }))} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">−</button>
        <span className="w-8 text-center font-medium">{form.guests_count}</span>
        <button type="button" onClick={() => setForm(p => ({ ...p, guests_count: Math.min(20, p.guests_count + 1) }))} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">+</button>
      </div>
      <div className="flex gap-3">
        <button type="submit" onClick={() => setForm(p => ({ ...p, status: "CONFIRMED" }))} disabled={loading} className="flex-1 bg-gold text-white py-3 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50">
          Буду рад(а)!
        </button>
        <button type="submit" onClick={() => setForm(p => ({ ...p, status: "DECLINED" }))} disabled={loading} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
          Не смогу
        </button>
      </div>
    </form>
  );
}
