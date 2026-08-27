"use client";

import { IconCoin, IconFlame, IconSparkles } from "./icons";
import { Mascota } from "./Mascota";

/** Pantalla de "terminaste tu práctica de hoy" — aparece cuando se
 * cumplieron los minutos del plan diario por edad (ver segundosRestantesHoy
 * en progress.ts). Mismo espíritu que la pantalla de "lección terminada"
 * de las apps de hábitos, con nuestros colores cálidos. */
export function SesionCompleta({
  tema,
  minutosHoy,
  racha,
  monedas,
  onCerrar,
}: {
  tema: "leon" | "pirata";
  minutosHoy: number;
  racha: number;
  monedas: number;
  onCerrar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center animate-fade-up"
      style={{ backgroundColor: "var(--surface-base)" }}
    >
      <div className="animate-pop-in">
        <Mascota tema={tema} size={160} />
      </div>

      <h1 className="mt-4 font-display font-extrabold text-3xl text-txt-primary text-balance">
        ¡Practicaste tu tiempo de hoy!
      </h1>
      <p className="mt-2 text-sm text-txt-secondary max-w-xs">
        Volvé mañana para seguir sumando — la constancia es lo que hace la
        diferencia.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
        <div
          className="rounded-2xl bg-brand-primary-soft p-4 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <IconSparkles className="h-5 w-5 text-txt-on-primary-soft mx-auto" />
          <p className="mt-2 font-display font-extrabold text-2xl text-txt-on-primary-soft tabular-nums">
            {minutosHoy}
          </p>
          <p className="text-xs font-semibold text-txt-on-primary-soft mt-0.5">
            minutos hoy
          </p>
        </div>
        <div
          className="rounded-2xl bg-brand-accent-soft p-4 animate-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          <IconFlame className="h-5 w-5 text-brand-accent mx-auto" />
          <p className="mt-2 font-display font-extrabold text-2xl text-brand-accent tabular-nums">
            {racha}
          </p>
          <p className="text-xs font-semibold text-brand-accent mt-0.5">
            {racha === 1 ? "día seguido" : "días seguidos"}
          </p>
        </div>
        <div
          className="rounded-2xl bg-brand-secondary-soft p-4 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <IconCoin className="h-5 w-5 text-txt-on-secondary-soft mx-auto" />
          <p className="mt-2 font-display font-extrabold text-2xl text-txt-on-secondary-soft tabular-nums">
            {monedas}
          </p>
          <p className="text-xs font-semibold text-txt-on-secondary-soft mt-0.5">
            monedas
          </p>
        </div>
      </div>

      <button
        onClick={onCerrar}
        className="mt-9 w-full max-w-xs rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
      >
        ¡Genial!
      </button>
    </div>
  );
}
