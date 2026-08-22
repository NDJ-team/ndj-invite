"use client";

import { useState, useEffect } from "react";
import { Invitation } from "@/types";

interface Props {
  invitation: Invitation;
  eventTime: string;
}

export function Countdown({ invitation, eventTime }: Props) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calc = () => {
      const eventDateTime = new Date(`${invitation.event_date}T${eventTime}:00`);
      const now = new Date();
      const diff = eventDateTime.getTime() - now.getTime();
      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft("Мероприятие состоялось");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}д ${hours}ч ${mins}м ${secs}с`);
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [invitation.event_date, eventTime]);

  return (
    <div className="text-center py-4">
      {isPast ? (
        <p className="text-gray-500 text-sm italic">{timeLeft}</p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">До начала осталось</p>
          <p className="text-2xl font-light tracking-wider text-gray-700 font-serif">{timeLeft}</p>
        </>
      )}
    </div>
  );
}
