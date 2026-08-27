"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconMirror, IconMic, IconCompass, IconCoin } from "./icons";

const pantallas = [
  {
    nombre: "El Espejo del León",
    resultado: "Su primer rugido, en menos de un minuto",
    tono: "primary",
    icon: IconMirror,
  },
  {
    nombre: "Isla de Praxias",
    resultado: "5 minutos de gimnasia de lengua, jugando",
    tono: "secondary",
    icon: IconMic,
  },
  {
    nombre: "Mapa de Islas",
    resultado: "Su progreso, visible en un camino que quiere recorrer",
    tono: "accent",
    icon: IconCompass,
  },
  {
    nombre: "Cofre de Premios",
    resultado: "La recompensa que se gana tras cada logro real",
    tono: "primary",
    icon: IconCoin,
  },
] as const;

const tono = {
  primary: {
    soft: "bg-brand-primary-soft",
    solid: "bg-brand-primary",
  },
  secondary: {
    soft: "bg-brand-secondary-soft",
    solid: "bg-brand-secondary",
  },
  accent: {
    soft: "bg-brand-accent-soft",
    solid: "bg-brand-accent",
  },
};

export function AppPorDentro() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const cardWidth = el.firstElementChild?.clientWidth ?? 224;
      const next = (active + 1) % pantallas.length;
      el.scrollTo({ left: next * (cardWidth + 16), behavior: "smooth" });
      setActive(next);
    }, 3200);
    return () => clearInterval(id);
  }, [active, paused]);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-txt-primary text-balance">
          La app por dentro
        </h2>
        <p className="mt-3 text-center text-txt-secondary max-w-md mx-auto">
          Así se ve la app por dentro — cada pantalla ya está lista y
          funcionando.
        </p>

        <div
          ref={trackRef}
          onPointerDown={() => setPaused(true)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {pantallas.map((p) => (
            <div key={p.nombre} className="snap-center shrink-0 w-56">
              <div
                className={`h-96 rounded-xl border-4 border-txt-primary/90 overflow-hidden flex flex-col items-center justify-center text-center px-4 ${tono[p.tono].soft}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 text-txt-on-brand ${tono[p.tono].solid}`}
                >
                  <p.icon className="h-6 w-6" />
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4 text-txt-on-brand ${tono[p.tono].solid}`}
                >
                  Ya disponible
                </span>
                <p className="font-display font-bold text-base text-txt-primary">
                  {p.nombre}
                </p>
                <p className="mt-2 text-xs text-txt-secondary leading-relaxed">
                  {p.resultado}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-1">
          {pantallas.map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                i === active ? "bg-brand-primary" : "bg-border-strong"
              }`}
            />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-sm px-6 py-3 btn-3d-primary transition-colors"
          >
            Probar el Espejo gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}
