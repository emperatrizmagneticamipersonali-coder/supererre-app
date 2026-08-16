"use client";

import { useRouter } from "next/navigation";
import {
  useProgreso,
  calcularRacha,
  calcularNivel,
  totalEjerciciosHechos,
} from "@/lib/progress";
import { IconFlame } from "@/components/app/icons";

const DIAS_CORTOS = ["do", "lu", "ma", "mi", "ju", "vi", "sa"];

function isoDeFecha(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function RachaPage() {
  const router = useRouter();
  const p = useProgreso();
  const racha = calcularRacha(p.diasActivos);
  const nivel = calcularNivel(p);
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const activos = new Set(p.diasActivos);

  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const mensaje = racha.hoyHecho
    ? tema === "pirata"
      ? "¡Ya navegaste hoy, capitán! Vuelve mañana."
      : "¡Ya rugiste hoy! Vuelve mañana."
    : racha.enRiesgo
    ? tema === "pirata"
      ? "Tu racha está en peligro — practica hoy para no perderla."
      : "Tu racha está en peligro — practica hoy para no perderla."
    : racha.actual === 0
    ? tema === "pirata"
      ? "Empieza tu racha: practica hoy en el mapa."
      : "Empieza tu racha: practica hoy en el mapa."
    : "¡Sigue así!";

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Racha de {p.nombre || "tu hijo"}
      </h1>

      <div className="mt-6 flex flex-col items-center rounded-2xl border border-border-default bg-surface-primary p-6">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            racha.actual > 0 ? "bg-brand-accent-soft" : "bg-surface-tertiary"
          }`}
        >
          <IconFlame
            className={`h-12 w-12 ${
              racha.actual > 0 ? "text-brand-accent" : "text-txt-tertiary"
            }`}
          />
        </div>
        <p className="mt-4 font-display font-extrabold text-4xl text-txt-primary tabular-nums">
          {racha.actual}
        </p>
        <p className="text-sm text-txt-secondary">
          {racha.actual === 1 ? "día seguido" : "días seguidos"}
        </p>
        <p className="mt-3 text-sm font-semibold text-txt-primary text-center max-w-64">
          {mensaje}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {ultimos7.map((d, i) => {
          const iso = isoDeFecha(d);
          const activo = activos.has(iso);
          const esHoy = i === 6;
          return (
            <div key={iso} className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-txt-tertiary uppercase">
                {DIAS_CORTOS[d.getDay()]}
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  activo
                    ? "bg-brand-accent text-txt-on-brand"
                    : esHoy
                    ? "border-2 border-dashed border-border-strong text-txt-tertiary"
                    : "bg-surface-secondary text-txt-tertiary"
                }`}
              >
                {activo ? (
                  <IconFlame className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{d.getDate()}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-2xl bg-surface-secondary p-4">
          <p className="text-2xl font-display font-extrabold text-txt-primary tabular-nums">
            {racha.mejor}
          </p>
          <p className="text-xs text-txt-secondary mt-1">Mejor racha</p>
        </div>
        <div className="flex-1 rounded-2xl bg-surface-secondary p-4">
          <p className="text-2xl font-display font-extrabold text-txt-primary tabular-nums">
            {totalEjerciciosHechos(p)}
          </p>
          <p className="text-xs text-txt-secondary mt-1">Ejercicios en total</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-brand-primary bg-surface-primary p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
          Nivel actual
        </p>
        <p className="mt-1 font-display font-extrabold text-xl text-txt-primary">
          {nivel.nombre}
        </p>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: nivel.total }, (_, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= nivel.indice ? "bg-brand-primary" : "bg-surface-tertiary"
              }`}
            />
          ))}
        </div>
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
