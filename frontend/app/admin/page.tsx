"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { InvitationList } from "@/types";

export default function AdminDashboard() {
  const [invitations, setInvitations] = useState<InvitationList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.invitations.list()
      .then(setInvitations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = invitations.filter(i => i.status === "ACTIVE").length;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link href="/admin/invitations/new" className="bg-gold text-white px-5 py-2 rounded-lg hover:bg-gold-dark transition-colors text-sm font-medium">
          + Создать приглашение
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Всего приглашений</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{invitations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Активных</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{active}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Черновиков</p>
          <p className="text-3xl font-bold text-gray-400 mt-1">{invitations.length - active}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Приглашения</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : invitations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Нет приглашений</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invitations.map(inv => (
              <Link key={inv.id} href={`/admin/invitations/${inv.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{inv.title}</p>
                  <p className="text-sm text-gray-500">{inv.event_date} · {inv.event_time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${inv.status === "ACTIVE" ? "bg-green-100 text-green-700" : inv.status === "DRAFT" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"}`}>
                    {inv.status}
                  </span>
                  <span className="text-sm text-gray-400">{inv.template_id}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
