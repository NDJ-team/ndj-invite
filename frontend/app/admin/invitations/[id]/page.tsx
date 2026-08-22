"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Invitation, Guest, GuestStats, Photo } from "@/types";

export default function EditInvitation() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tab, setTab] = useState<"edit" | "photos" | "guests">("edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<any>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.invitations.get(id).then(data => {
      setInv(data);
      setForm({ ...data, program: data.program || [] });
    });
    api.guests.list(id).then(setGuests).catch(() => {});
    api.guests.stats(id).then(setStats).catch(() => {});
  }, [id]);

  const loadPhotos = () => {
    if (inv) {
      api.public.photos(inv.slug).then(setPhotos).catch(() => {});
    }
  };
  useEffect(() => { loadPhotos(); }, [inv]);

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, program: form.program?.length > 0 ? form.program : null };
      await api.invitations.update(id, data);
      setInv((prev) => prev ? { ...prev, ...data } : prev);
      alert("Сохранено");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await api.invitations.publish(id);
    setInv(prev => prev ? { ...prev, status: "ACTIVE" } : prev);
  };

  const handleArchive = async () => {
    await api.invitations.archive(id);
    setInv(prev => prev ? { ...prev, status: "ARCHIVED" } : prev);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.photos.upload(id, file);
      loadPhotos();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Удалить фото?")) return;
    await api.photos.delete(photoId);
    loadPhotos();
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Удалить гостя?")) return;
    await api.guests.delete(guestId);
    setGuests(prev => prev.filter(g => g.id !== guestId));
    api.guests.stats(id).then(setStats).catch(() => {});
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${inv?.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addProgramItem = () => update("program", [...(form.program || []), { time: "", title: "" }]);
  const updateProgram = (i: number, field: string, value: string) => {
    const p = [...(form.program || [])];
    p[i][field] = value;
    update("program", p);
  };
  const removeProgramItem = (i: number) => update("program", form.program.filter((_: any, idx: number) => idx !== i));

  const handleDelete = async () => {
    if (!confirm("Удалить приглашение? Это действие необратимо.")) return;
    await api.invitations.delete(id);
    router.push("/admin");
  };

  if (!inv) return <div className="py-6 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">← Назад</button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1">{inv.title}</h1>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${inv.status === "ACTIVE" ? "bg-green-100 text-green-700" : inv.status === "DRAFT" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"}`}>
          {inv.status}
        </span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={copyLink} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
          {copied ? "✓ Скопировано" : "📋 Копировать ссылку"}
        </button>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/public/invitations/${inv.slug}/qr`} target="_blank" className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors">
          ⬇ QR-код
        </a>
        {inv.status !== "ACTIVE" && (
          <button onClick={handlePublish} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
            Опубликовать
          </button>
        )}
        {inv.status === "ACTIVE" && (
          <button onClick={handleArchive} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">
            Архивировать
          </button>
        )}
        <Link href={`/invite/${inv.slug}`} target="_blank" className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Preview →
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {(["edit", "photos", "guests"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "edit" ? "Данные" : t === "photos" ? "Фото" : `Гости${stats ? ` (${stats.total})` : ""}`}
          </button>
        ))}
      </div>

      {tab === "edit" && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input value={form.title || ""} onChange={e => update("title", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Шаблон</label>
              <select value={form.template_id || ""} onChange={e => update("template_id", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none">
                <option value="minimal">Minimal Wedding</option>
                <option value="premium">Premium Wedding</option>
                <option value="kyrgyz">Kyrgyz Wedding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={form.slug || ""} onChange={e => update("slug", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description || ""} onChange={e => update("description", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold outline-none" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <input type="date" value={form.event_date || ""} onChange={e => update("event_date", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
              <input type="time" value={form.event_time || ""} onChange={e => update("event_time", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" />
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Место</label><input value={form.location || ""} onChange={e => update("location", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label><input value={form.address || ""} onChange={e => update("address", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на карту</label><input value={form.map_url || ""} onChange={e => update("map_url", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none" /></div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Программа</label>
              <button type="button" onClick={addProgramItem} className="text-sm text-gold hover:text-gold-dark">+ Добавить</button>
            </div>
            {(form.program || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={item.time} onChange={e => updateProgram(i, "time", e.target.value)} className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" placeholder="18:00" />
                <input value={item.title} onChange={e => updateProgram(i, "title", e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                <button type="button" onClick={() => removeProgramItem(i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors font-medium disabled:opacity-50">
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={handleDelete} className="text-red-500 px-4 py-2.5 text-sm hover:text-red-700">Удалить</button>
          </div>
        </div>
      )}

      {tab === "photos" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Фотографии</h3>
            <div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-gold text-white px-4 py-2 rounded-lg text-sm hover:bg-gold-dark transition-colors disabled:opacity-50">
                {uploading ? "Загрузка..." : "📷 Загрузить фото"}
              </button>
            </div>
          </div>
          {photos.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Нет фотографий</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "guests" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-gray-500">Всего ответов</p><p className="text-xl font-bold">{stats.total}</p></div>
              <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xs text-green-600">Подтвердили</p><p className="text-xl font-bold text-green-700">{stats.confirmed}</p></div>
              <div className="bg-red-50 rounded-lg p-3 text-center"><p className="text-xs text-red-600">Отказались</p><p className="text-xl font-bold text-red-700">{stats.declined}</p></div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center"><p className="text-xs text-yellow-600">Ожидают</p><p className="text-xl font-bold text-yellow-700">{stats.pending}</p></div>
            </div>
          )}
          {guests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Пока нет гостей</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {guests.map(g => (
                <div key={g.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-800">{g.name}</p>
                    <p className="text-sm text-gray-500">{g.phone || "—"} · {g.guests_count} чел.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${g.status === "CONFIRMED" ? "bg-green-100 text-green-700" : g.status === "DECLINED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                      {g.status === "CONFIRMED" ? "✓" : g.status === "DECLINED" ? "✕" : "?"}
                    </span>
                    <button onClick={() => handleDeleteGuest(g.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
