"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgreso, marcarSonidoHecho } from "@/lib/progress";
import { useRugidoDetector } from "@/hooks/useRugidoDetector";
import {
  IconCheck,
  IconChevronLeft,
  IconMic,
  IconPlay,
  IconSparkles,
} from "@/components/app/icons";

const MODOS = {
  leon: {
    nombre: "Modo León",
    emoji: "🦁",
    sonidos: [
      { id: "rugido", nombre: "El Rugido", pista: "¡GRRR!" },
      { id: "ronroneo", nombre: "El Ronroneo", pista: "rrrrr…" },
    ],
  },
  pirata: {
    nombre: "Modo Pirata",
    emoji: "🏴‍☠️",
    sonidos: [
      { id: "grito", nombre: "El Grito Pirata", pista: "¡ARRR!" },
      { id: "tesoro", nombre: "El Grito del Tesoro", pista: "¡ARRR, tesoro!" },
    ],
  },
} as const;

export default function SonidosPage() {
  const router = useRouter();
  const p = useProgreso();
  const [modoOverride, setModoOverride] = useState<keyof typeof MODOS | null>(
    null
  );
  const modo = modoOverride ?? (p.interes === "pirata" ? "pirata" : "leon");
  const [sonidoId, setSonidoId] = useState<string | null>(null);

  const data = MODOS[modo];
  const sonido = data.sonidos.find((s) => s.id === sonidoId) || null;

  if (sonido) {
    return (
      <SonidoDetector
        emoji={data.emoji}
        nombre={sonido.nombre}
        pista={sonido.pista}
        onVolver={() => setSonidoId(null)}
        onDetectado={() => marcarSonidoHecho(`${modo}-${sonido.id}`)}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        El Espejo del León
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Elige un modo y ruge frente al espejo.
      </p>

      <div className="mt-5 flex gap-2">
        {(Object.keys(MODOS) as (keyof typeof MODOS)[]).map((m) => (
          <button
            key={m}
            onClick={() => setModoOverride(m)}
            className={`flex-1 rounded-2xl border p-3 text-center transition-colors ${
              modo === m
                ? "border-brand-primary bg-brand-primary-soft"
                : "border-border-default bg-surface-primary"
            }`}
          >
            <span className="text-3xl">{MODOS[m].emoji}</span>
            <p className="mt-1 text-sm font-bold text-txt-primary">
              {MODOS[m].nombre}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {data.sonidos.map((s) => {
          const hechoYa = p.sonidosHechos.includes(`${modo}-${s.id}`);
          return (
            <button
              key={s.id}
              onClick={() => setSonidoId(s.id)}
              className="flex items-center gap-4 rounded-2xl border border-border-default bg-surface-primary p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary-soft text-2xl">
                {data.emoji}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-sm text-txt-primary">
                  {s.nombre}
                </p>
                <p className="text-xs text-txt-secondary">{s.pista}</p>
              </div>
              {hechoYa && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/app")}
        className="mt-8 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Volver al mapa
      </button>
    </div>
  );
}

function SonidoDetector({
  emoji,
  nombre,
  pista,
  onVolver,
  onDetectado,
}: {
  emoji: string;
  nombre: string;
  pista: string;
  onVolver: () => void;
  onDetectado: () => void;
}) {
  const { estado, nivelVoz, empezar } = useRugidoDetector();
  const escala = 1 + Math.min(nivelVoz, 100) / 220;
  const marco = estado === "detectado";

  useEffect(() => {
    if (estado === "detectado" || estado === "sin-microfono") onDetectado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
      <button
        onClick={onVolver}
        aria-label="Atrás"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {estado === "escuchando" && (
          <p className="text-sm font-bold text-brand-secondary uppercase tracking-wide mb-6 flex items-center gap-2">
            <IconMic className="h-4 w-4" /> Escuchando…
          </p>
        )}
        <button
          onClick={estado === "idle" ? empezar : undefined}
          disabled={estado !== "idle"}
          className="relative flex h-40 w-40 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
            boxShadow:
              "0 0 0 6px var(--surface-primary), 0 0 0 11px var(--brand-primary), 0 0 0 15px var(--surface-primary), 0 0 0 19px var(--brand-secondary)",
            transform: estado === "escuchando" ? `scale(${escala})` : undefined,
          }}
          aria-label={`Practicar ${nombre}`}
        >
          <span className="text-7xl select-none">{emoji}</span>
          {estado === "idle" && (
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
              <IconPlay className="h-5 w-5" />
            </span>
          )}
        </button>

        <h1 className="mt-6 font-display font-extrabold text-xl text-txt-primary">
          {nombre}
        </h1>
        <p className="mt-2 text-base text-txt-secondary">
          Di: <strong className="text-txt-primary">{pista}</strong>
        </p>

        {marco && (
          <div className="mt-4 flex items-center gap-2 text-brand-secondary animate-pop-in">
            <IconSparkles className="h-5 w-5" />
            <p className="font-bold">¡Muy bien!</p>
          </div>
        )}
        {estado === "sin-microfono" && (
          <p className="mt-4 text-sm text-txt-secondary max-w-xs">
            No pudimos usar el micrófono, pero igual anotamos tu intento.
          </p>
        )}
      </div>

      {(marco || estado === "sin-microfono") && (
        <button
          onClick={onVolver}
          className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 shadow-md transition-colors"
        >
          Continuar
        </button>
      )}
    </div>
  );
}
