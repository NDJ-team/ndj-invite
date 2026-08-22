"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Invitation, Photo } from "@/types";
import { TemplateMinimal } from "@/components/templates/TemplateMinimal";
import { TemplatePremium } from "@/components/templates/TemplatePremium";
import { TemplateKyrgyz } from "@/components/templates/TemplateKyrgyz";

export default function InvitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.public.get(slug as string),
      api.public.photos(slug as string).catch(() => []),
    ])
      .then(([inv, p]) => {
        setInvitation(inv);
        setPhotos(p);
      })
      .catch((err) => setError(err.message || "Приглашение не найдено"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-8">
          <p className="text-6xl mb-4">💌</p>
          <h1 className="text-2xl font-serif text-gray-800 mb-2">Приглашение не найдено</h1>
          <p className="text-gray-500">{error || "Это приглашение не существует или было удалено."}</p>
        </div>
      </div>
    );
  }

  if (invitation.status === "ARCHIVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-8">
          <p className="text-6xl mb-4">✉️</p>
          <h1 className="text-2xl font-serif text-gray-800 mb-2">Приглашение закрыто</h1>
          <p className="text-gray-500">Это приглашение больше недоступно.</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = {
    minimal: TemplateMinimal,
    premium: TemplatePremium,
    kyrgyz: TemplateKyrgyz,
  }[invitation.template_id] || TemplateMinimal;

  return <TemplateComponent invitation={invitation} photos={photos} />;
}
