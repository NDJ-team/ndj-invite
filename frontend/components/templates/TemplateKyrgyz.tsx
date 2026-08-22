"use client";

import { Invitation, Photo } from "@/types";
import { Countdown } from "@/components/invitations/Countdown";
import { RSVPForm } from "@/components/invitations/RSVPForm";

interface Props {
  invitation: Invitation;
  photos: Photo[];
}

export function TemplateKyrgyz({ invitation, photos }: Props) {
  const program = invitation.program || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-screen flex items-end justify-center pb-16 px-4">
        {invitation.cover_photo_url ? (
          <div className="absolute inset-0">
            <img src={invitation.cover_photo_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-cream to-white" />
        )}
        <div className="relative z-10 text-center text-white animate-fade-in">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold opacity-80">
              <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
            </svg>
            <p className="text-xs uppercase tracking-[0.3em] opacity-80">Приглашение</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold opacity-80">
              <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light leading-tight mb-4">{invitation.title}</h1>
          <div className="w-20 h-px bg-gold/60 mx-auto mb-4" />
          <p className="text-sm tracking-wider opacity-80">
            {new Date(invitation.event_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* Ornamental divider */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-8 h-px bg-gold/30" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold/40">
          <path d="M8 0L10 6L16 6L11 10L13 16L8 12L3 16L5 10L0 6L6 6L8 0Z" fill="currentColor" />
        </svg>
        <div className="w-8 h-px bg-gold/30" />
      </div>

      {/* Message */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-6">Дорогие гости</p>
        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto font-light">
          {invitation.description || "Будем рады разделить с вами наш особенный день."}
        </p>
      </section>

      {/* Ornamental divider */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-px bg-gold/30" />
        <div className="w-2 h-2 rotate-45 bg-gold/30" />
        <div className="w-12 h-px bg-gold/30" />
      </div>

      {/* Date & Time */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-3">Когда</p>
        <p className="text-2xl font-serif text-gray-800">
          {new Date(invitation.event_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
        </p>
        <p className="text-lg text-gray-500 mt-1">{invitation.event_time}</p>
      </section>

      {/* Countdown */}
      <Countdown invitation={invitation} eventTime={invitation.event_time} />

      {/* Ornamental divider */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-px bg-gold/30" />
        <div className="w-2 h-2 rotate-45 bg-gold/30" />
        <div className="w-12 h-px bg-gold/30" />
      </div>

      {/* Location */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-3">Где</p>
        <p className="text-xl font-serif text-gray-800 mb-1">{invitation.location}</p>
        <p className="text-sm text-gray-500 mb-4">{invitation.address}</p>
        {invitation.map_url && (
          <a href={invitation.map_url} target="_blank" rel="noopener noreferrer" className="inline-block border border-gold text-gold px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-white transition-colors">
            Построить маршрут →
          </a>
        )}
      </section>

      {/* Gallery */}
      {photos.length > 0 && (
        <>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gold/30" />
            <div className="w-2 h-2 rotate-45 bg-gold/30" />
            <div className="w-12 h-px bg-gold/30" />
          </div>
          <section className="invitation-section">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/60 text-center mb-6">Галерея</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {photos.map(photo => (
                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gold/10">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Program */}
      {program.length > 0 && (
        <>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gold/30" />
            <div className="w-2 h-2 rotate-45 bg-gold/30" />
            <div className="w-12 h-px bg-gold/30" />
          </div>
          <section className="invitation-section max-w-sm mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold/60 text-center mb-6">Программа</p>
            <div className="space-y-4">
              {program.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-gold font-serif text-lg w-14 shrink-0">{item.time}</span>
                  <div className="flex-1 h-px bg-gold/20" />
                  <span className="text-gray-700 text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* RSVP */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-px bg-gold/30" />
        <div className="w-2 h-2 rotate-45 bg-gold/30" />
        <div className="w-12 h-px bg-gold/30" />
      </div>
      <section className="invitation-section">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/60 text-center mb-6">Подтвердите присутствие</p>
        <RSVPForm slug={invitation.slug} />
      </section>

      {/* Footer */}
      <section className="py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-px bg-gold/30" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold/40">
            <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
          </svg>
          <div className="w-8 h-px bg-gold/30" />
        </div>
        <p className="text-gray-400 text-xs tracking-widest uppercase">С любовью</p>
        <p className="text-xl font-serif text-gray-700 mt-2">{invitation.title}</p>
      </section>
    </div>
  );
}
