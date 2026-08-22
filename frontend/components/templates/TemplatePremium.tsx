"use client";

import { Invitation, Photo } from "@/types";
import { Countdown } from "@/components/invitations/Countdown";
import { RSVPForm } from "@/components/invitations/RSVPForm";

interface Props {
  invitation: Invitation;
  photos: Photo[];
}

export function TemplatePremium({ invitation, photos }: Props) {
  const program = invitation.program || [];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Hero */}
      <section className="relative h-screen flex items-end justify-center pb-16 px-4">
        {invitation.cover_photo_url ? (
          <div className="absolute inset-0">
            <img src={invitation.cover_photo_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-dark-bg" />
        )}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="w-8 h-px bg-gold mx-auto mb-6" />
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Приглашение на свадьбу</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-light leading-tight mb-6">{invitation.title}</h1>
          <div className="w-8 h-px bg-gold mx-auto mb-6" />
          <p className="text-sm tracking-wider text-white/60">
            {new Date(invitation.event_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      {/* Message */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-6">Дорогие гости</p>
        <p className="text-lg text-white/70 leading-relaxed max-w-md mx-auto font-light">
          {invitation.description || "Будем рады разделить с вами наш особенный день."}
        </p>
      </section>

      <div className="w-16 h-px bg-white/10 mx-auto" />

      {/* Date & Time */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Когда</p>
        <p className="text-2xl font-serif">
          {new Date(invitation.event_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
        </p>
        <p className="text-lg text-white/50 mt-1">{invitation.event_time}</p>
      </section>

      {/* Countdown */}
      <Countdown invitation={invitation} eventTime={invitation.event_time} />

      <div className="w-16 h-px bg-white/10 mx-auto" />

      {/* Location */}
      <section className="invitation-section text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Где</p>
        <p className="text-xl font-serif mb-1">{invitation.location}</p>
        <p className="text-sm text-white/50 mb-4">{invitation.address}</p>
        {invitation.map_url && (
          <a href={invitation.map_url} target="_blank" rel="noopener noreferrer" className="inline-block border border-gold text-gold px-6 py-2.5 rounded-full text-sm hover:bg-gold hover:text-dark-bg transition-colors">
            Построить маршрут →
          </a>
        )}
      </section>

      {/* Gallery */}
      {photos.length > 0 && (
        <>
          <div className="w-16 h-px bg-white/10 mx-auto" />
          <section className="invitation-section">
            <p className="text-xs uppercase tracking-[0.3em] text-gold text-center mb-6">Галерея</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {photos.map(photo => (
                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-white/5">
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
          <div className="w-16 h-px bg-white/10 mx-auto" />
          <section className="invitation-section max-w-sm mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-gold text-center mb-6">Программа</p>
            <div className="space-y-4">
              {program.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-gold font-serif text-lg w-14 shrink-0">{item.time}</span>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/70 text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* RSVP */}
      <div className="w-16 h-px bg-white/10 mx-auto" />
      <section className="invitation-section">
        <p className="text-xs uppercase tracking-[0.3em] text-gold text-center mb-6">Подтвердите присутствие</p>
        <RSVPForm slug={invitation.slug} />
      </section>

      {/* Footer */}
      <section className="py-16 text-center">
        <div className="w-8 h-px bg-gold mx-auto mb-6" />
        <p className="text-white/40 text-xs tracking-widest uppercase">С любовью</p>
        <p className="text-xl font-serif text-white/80 mt-2">{invitation.title}</p>
      </section>
    </div>
  );
}
