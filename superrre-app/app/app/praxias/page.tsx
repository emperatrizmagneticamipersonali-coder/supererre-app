"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProgreso, marcarPraxiaHecha } from "@/lib/progress";
import { IconCheck, IconChevronLeft, IconSparkles } from "@/components/app/icons";

const PRAXIAS = [
  {
    id: "caballo",
    nombre: "El Chasquido de Caballo",
    emoji: "🐴",
    instruccion:
      'Pega la lengua arriba, atrás de los dientes, y suéltala fuerte para hacer "clop clop" como un caballo.',
  },
  {
    id: "ola",
    nombre: "La Ola",
    emoji: "🌊",
    instruccion:
      "Saca la lengua y muévela de una esquina de la boca a la otra, despacito, como una ola.",
  },
  {
    id: "reloj",
    nombre: "El Reloj",
    emoji: "🕐",
    instruccion:
      'Toca con la punta de la lengua una esquina de la boca y luego la otra: "tic, tac, tic, tac".',
  },
  {
    id: "pintor",
    nombre: "El Pintor",
    emoji: "🖌️",
    instruccion:
      "Con la punta de la lengua, pinta el techo de la boca de adelante hacia atrás, como un pincel.",
  },
  {
    id: "columpio",
    nombre: "El Columpio",
    emoji: "🎪",
    instruccion:
      "Sube la lengua a tocar la nariz y luego bájala a tocar la barbilla, como un columpio.",
  },
] as const;

export default function PraxiasPage() {
  const router = useRouter();
  const p = useProgreso();
  const [activa, setActiva] = useState<(typeof PRAXIAS)[number] | null>(null);
  const [hecho, setHecho] = useState(false);

  if (activa) {
    return (
      <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
        <button
          onClick={() => {
            setActiva(null);
            setHecho(false);
          }}
          aria-label="Atrás"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <span className="text-8xl mb-6" aria-hidden="true">
            {activa.emoji}
          </span>
          <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
            {activa.nombre}
          </h1>
          <p className="mt-4 text-base text-txt-secondary leading-relaxed max-w-xs">
            {activa.instruccion}
          </p>

          {hecho && (
            <div className="mt-6 flex items-center gap-2 text-brand-secondary animate-pop-in">
              <IconSparkles className="h-6 w-6" />
              <p className="text-lg font-bold">¡Bien hecho!</p>
            </div>
          )}
        </div>

        {!hecho ? (
          <button
            onClick={() => {
              marcarPraxiaHecha(activa.id);
              setHecho(true);
            }}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 shadow-md transition-colors"
          >
            Ya lo intenté
          </button>
        ) : (
          <button
            onClick={() => {
              setActiva(null);
              setHecho(false);
            }}
            className="w-full rounded-full border-2 border-border-strong text-txt-primary font-display font-bold text-base py-4"
          >
            Volver a Praxias
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Gimnasia de Lengua
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        5 ejercicios para preparar la lengua antes de decir la R.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {PRAXIAS.map((ex) => {
          const hechoYa = p.praxiasHechas.includes(ex.id);
          return (
            <button
              key={ex.id}
              onClick={() => setActiva(ex)}
              className="relative rounded-2xl border border-border-default bg-surface-primary p-4 text-left transition-transform active:scale-[0.98]"
            >
              {hechoYa && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand">
                  <IconCheck className="h-3 w-3" />
                </span>
              )}
              <span className="text-4xl" aria-hidden="true">
                {ex.emoji}
              </span>
              <p className="mt-2 font-display font-bold text-sm text-txt-primary leading-tight">
                {ex.nombre}
              </p>
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
