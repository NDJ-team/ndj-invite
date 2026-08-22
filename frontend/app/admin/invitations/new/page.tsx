"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewInvitation() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    template_id: "minimal",
    event_type: "wedding",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    address: "",
    map_url: "",
    program: [] as { time: string; title: string }[],
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const addProgramItem = () => setForm(prev => ({ ...prev, program: [...prev.program, { time: "", title: "" }] }));
  const updateProgram = (i: number, field: string, value: string) => {
    const p = [...form.program];
    (p[i] as any)[field] = value;
    setForm(prev => ({ ...prev, program: p }));
  };
  const removeProgramItem = (i: number) => setForm(prev => ({ ...prev, program: prev.program.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        event_date: form.event_date,
        program: form.program.length > 0 ? form.program : undefined,
      };
      const inv = await api.invitations.create(data);
      router.push(`/admin/invitations/${inv.id}`);
    } catch (err: any) {
      alert(err.message || "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Новое приглашение</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input value={form.title} onChange={e => update("title", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none" placeholder="Алия & Бекзат" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Шаблон</label>
            <select value={form.template_id} onChange={e => update("template_id", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none">
              <option value="minimal">Minimal Wedding</option>
              <option value="premium">Premium Wedding</option>
              <option value="kyrgyz">Kyrgyz Wedding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип события</label>
            <select value={form.event_type} onChange={e => update("event_type", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none">
              <option value="wedding">Свадьба</option>
              <option value="birthday">День рождения</option>
              <option value="corporate">Корпоратив</option>
              <option value="other">Другое</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea value={form.description} onChange={e => update("description", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" rows={3} placeholder="Будем рады разделить с вами наш особенный день..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
            <input type="date" value={form.event_date} onChange={e => update("event_date", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
            <input type="time" value={form.event_time} onChange={e => update("event_time", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Место</label>
          <input value={form.location} onChange={e => update("location", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Ресторан Ала-Тоо" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
          <input value={form.address} onChange={e => update("address", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="г. Бишкек, ул. Манаса 45" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на карту (необязательно)</label>
          <input value={form.map_url} onChange={e => update("map_url", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="https://maps.google.com/..." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Программа</label>
            <button type="button" onClick={addProgramItem} className="text-sm text-gold hover:text-gold-dark">+ Добавить</button>
          </div>
          {form.program.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={item.time} onChange={e => updateProgram(i, "time", e.target.value)} className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="18:00" />
              <input value={item.title} onChange={e => updateProgram(i, "title", e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="Сбор гостей" />
              <button type="button" onClick={() => removeProgramItem(i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors font-medium disabled:opacity-50">
            {saving ? "Сохранение..." : "Создать"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
