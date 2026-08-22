"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.auth.me()
      .then(() => { setAuth(true); setLoading(false); })
      .catch(() => { router.push("/admin/login"); });
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Загрузка...</div></div>;
  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-gray-800">NDJ Invite</Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/invitations" className="text-gray-600 hover:text-gray-900 text-sm">Приглашения</Link>
            <button onClick={() => api.auth.logout().then(() => router.push("/admin/login"))} className="text-gray-500 hover:text-gray-700 text-sm">Выйти</button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
