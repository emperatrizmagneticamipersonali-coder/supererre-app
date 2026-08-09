"use client";

import Link from "next/link";
import {
  useProgreso,
  minijuegoDesbloqueado,
  totalEjerciciosHechos,
} from "@/lib/progress";
import { IconLock, IconCheck } from "@/components/app/icons";

const ISLAS = [
  {
    href: "/app/praxias",
    nombre: "Isla de Praxias",
    emoji: "👅",
    resultado: "Gimnasia de lengua",
    tono: "primary",
    siempreAbierta: true,
  },
  {
    href: "/app/sonidos",
    nombre: "El Espejo del León",
    emoji: "🦁",
    resultado: "Ruge y practica sonidos",
    tono: "secondary",
    siempreAbierta: true,
  },
  {
    href: "/app/escalera",
    nombre: "Escalera Fonética",
    emoji: "🪜",
    resultado: "Carro, perro, rana…",
    tono: "accent",
    siempreAbierta: false,
  },
  {
    href: "/app/premios",
    nombre: "Cofre de Premios",
    emoji: "💰",
    resultado: "Minijuego sorpresa",
    tono: "primary",
    siempreAbierta: false,
  },
] as const;

const tono = {
  primary: { soft: "bg-brand-primary-soft", solid: "bg-brand-primary" },
  secondary: { soft: "bg-brand-secondary-soft", solid: "bg-brand-secondary" },
  accent: { soft: "bg-brand-accent-soft", solid: "bg-brand-accent" },
};

export default function MapaDeIslasPage() {
  const p = useProgreso();

  const escaleraAbierta = totalEjerciciosHechos(p) >= 1 || p.plan === "completo";
  const premiosAbierto = minijuegoDesbloqueado(p);
  const desbloqueo: Record<string, boolean> = {
    "/app/praxias": true,
    "/app/sonidos": true,
    "/app/escalera": escaleraAbierta,
    "/app/premios": premiosAbierto,
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-txt-secondary">
            {p.interes === "pirata" ? "¡Ahoy," : "Hola,"} {p.nombre || "explorador"}!
          </p>
          <h1 className="font-display font-extrabold text-2xl text-txt-primary">
            Isla de {p.nombre || "tu hijo"}
          </h1>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-soft text-txt-on-primary-soft text-sm font-bold px-3 py-2">
          ⭐ {p.estrellas}
        </span>
      </div>

      <div className="relative mt-8 flex flex-col gap-5">
        <div
          aria-hidden="true"
          className="absolute left-7 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-border-strong"
        />
        {ISLAS.map((isla, i) => {
          const abierta = desbloqueo[isla.href];
          const contenido = (
            <div
              className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-transform active:scale-[0.98] ${
                abierta
                  ? "border-border-default bg-surface-primary"
                  : "border-border-default bg-surface-secondary opacity-70"
              } ${i % 2 === 1 ? "ml-8" : ""}`}
            >
              <span
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${
                  abierta ? tono[isla.tono].soft : "bg-surface-tertiary"
                }`}
              >
                {abierta ? isla.emoji : <IconLock className="h-6 w-6 text-txt-tertiary" />}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-base text-txt-primary">
                  {isla.nombre}
                </p>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {abierta ? isla.resultado : "Se abre al avanzar un poco más"}
                </p>
              </div>
              {p.plan === "free" && !isla.siempreAbierta && abierta && (
                <IconCheck className="h-5 w-5 text-brand-secondary shrink-0" />
              )}
            </div>
          );
          return abierta ? (
            <Link key={isla.href} href={isla.href}>
              {contenido}
            </Link>
          ) : (
            <div key={isla.href} className="cursor-not-allowed">
              {contenido}
            </div>
          );
        })}
      </div>

      {p.plan === "free" && (
        <Link
          href="/app/mama"
          className="mt-8 rounded-2xl bg-surface-secondary p-4 text-center text-sm font-semibold text-txt-primary"
        >
          Tienes el plan gratis — desbloquea todo en{" "}
          <span className="text-brand-primary">Mamá</span>
        </Link>
      )}
    </div>
  );
}
