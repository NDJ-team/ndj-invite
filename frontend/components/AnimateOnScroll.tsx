"use client";

import { useEffect, useRef, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale" | "fadeUpBlur";
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const animations = {
  fadeUp: {
    initial: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  fadeIn: {
    initial: "opacity-0",
    visible: "opacity-100",
  },
  slideLeft: {
    initial: "opacity-0 -translate-x-16",
    visible: "opacity-100 translate-x-0",
  },
  slideRight: {
    initial: "opacity-0 translate-x-16",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    initial: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  fadeUpBlur: {
    initial: "opacity-0 translate-y-12 blur-sm",
    visible: "opacity-100 translate-y-0 blur-0",
  },
};

export default function AnimateOnScroll({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  threshold = 0.15,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = animations[animation];
    el.classList.add(...anim.initial.split(" "));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove(...anim.initial.split(" "));
            el.classList.add(...anim.visible.split(" "));
          }, delay);
          if (once) observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, threshold, once]);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}
