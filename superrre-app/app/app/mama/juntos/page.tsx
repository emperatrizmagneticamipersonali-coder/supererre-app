"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EJERCICIOS_MAMA, type EjercicioMama } from "@/lib/ejercicios-mama";
import { useProgreso } from "@/lib/progress";
import { IlustracionMama } from "@/components/app/IlustracionMama";
import {
  IconAlarmClock,
  IconCheck,
  IconChevronLeft,
  IconShieldCheck,
  IconSparkles,
} from "@/components/app/icons";

export default function EjerciciosJuntosPage() {
  const router = useRouter();
  const p = useProgreso();
  const [abierto, setAbierto] = useState<EjercicioMama | null>(null);
  const [intentado, setIntentado] = useState(false);
  const nino = p.nombre || "tu hijo";

  function cerrar() {
    setAbierto(null);
    setIntentado(false);
  }

  const guiados = EJERCICIOS_MAMA.filter((e) => e.grupo === "guiado");
  const espejo = EJERCICIOS_MAMA.filter((e) => e.grupo === "espejo");
  const PILDORA = [
    "bg-brand-primary-soft text-txt-on-primary-soft",
    "bg-brand-secondary-soft text-txt-on-secondary-soft",
    "bg-brand-accent-soft text-txt-primary",
  ];
  const BORDE = [
    "border-brand-primary",
    "border-brand-secondary",
    "border-brand-accent",
  ];

  if (abierto) {
    const cuidados = abierto.cuidados;
    return (
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
        <button
          onClick={cerrar}
          aria-label="Atrás"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="mt-2 font-display font-extrabold text-2xl text-txt-primary text-balance animate-fade-up">
          {abierto.nombre}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up [animation-delay:60ms]">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft text-xs font-bold px-3 py-1">
            <IconAlarmClock className="h-4 w-4" />
            {abierto.minutos} min
          </span>
          {abierto.necesitas.map((n) => (
            <span
              key={n}
              className="rounded-full border border-border-default text-txt-secondary text-xs font-semibold px-3 py-1"
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-brand-secondary-soft p-5 animate-fade-up [animation-delay:90ms]">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-on-secondary-soft">
            ¿Para qué sirve?
          </p>
          <p className="mt-2 text-sm text-txt-primary leading-relaxed">
            {abierto.paraQue}
          </p>
          <p className="mt-2 text-xs text-txt-secondary leading-relaxed">
            Es un calentamiento que se combina con practicar los sonidos en la
            app. No hace falta que salga perfecto: cada intento suma.
          </p>
        </div>

        <div className="mt-6 animate-fade-up [animation-delay:105ms]">
          {abierto.imagen ? (
            <div className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-2xl border-2 border-brand-secondary bg-surface-primary">
              <Image
                src={abierto.imagen}
                alt={abierto.nombre}
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>
          ) : abierto.ilustracion ? (
            <IlustracionMama tipo={abierto.ilustracion} />
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-brand-accent bg-brand-accent-soft p-5 animate-fade-up [animation-delay:120ms]">
          <p className="flex items-center gap-2 font-display font-bold text-base text-txt-primary">
            <IconShieldCheck className="h-5 w-5 text-brand-accent shrink-0" />
            Antes de empezar
          </p>
          <ul className="mt-3 space-y-2">
            {cuidados.map((c) => (
              <li key={c} className="text-sm text-txt-primary leading-relaxed">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-border-default bg-surface-primary p-5 space-y-4 animate-fade-up [animation-delay:150ms]">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Paso a paso
          </p>
          {abierto.pasos.map((paso, i) => (
            <div key={paso} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand font-display font-extrabold text-sm">
                {i + 1}
              </span>
              <p className="text-sm text-txt-primary leading-relaxed pt-1">
                {paso}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-brand-primary-soft p-5 animate-fade-up [animation-delay:180ms]">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-on-primary-soft">
            Qué decirle a {nino}
          </p>
          <p className="mt-2 font-display font-bold text-base text-txt-on-primary-soft text-balance">
            “{abierto.quedecir}”
          </p>
        </div>

        <p className="mt-4 text-xs text-txt-tertiary animate-fade-up [animation-delay:210ms]">
          Es una guía de práctica en casa y no reemplaza la valoración de un
          fonoaudiólogo.
        </p>

        <div className="flex-1 min-h-6" />

        {intentado ? (
          <div className="flex flex-col items-center gap-3 animate-pop-in">
            <p className="flex items-center gap-2 font-display font-bold text-lg text-brand-secondary">
              <IconSparkles className="h-5 w-5" />
              ¡Muy bien, mamá! Cada intento cuenta.
            </p>
            <button
              onClick={cerrar}
              className="w-full rounded-full border-2 border-border-strong text-txt-primary font-display font-bold text-base py-3"
            >
              Volver a los ejercicios
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIntentado(true)}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
          >
            Lo intentamos hoy
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
      <button
        onClick={() => router.push("/app/mama")}
        aria-label="Atrás"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>

      <h1 className="mt-2 font-display font-extrabold text-2xl text-txt-primary animate-fade-up">
        Ejercicios para hacer juntos
      </h1>
      <p className="mt-1 text-sm text-txt-secondary animate-fade-up [animation-delay:60ms]">
        Ejercicios que haces tú con {nino}, paso a paso y con calma. Primero
        lee los cuidados de cada uno.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {guiados.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => setAbierto(ex)}
            style={{ animationDelay: `${120 + i * 60}ms` }}
            className="flex items-center gap-4 rounded-2xl border-2 border-brand-primary bg-surface-primary p-4 text-left transition-transform active:scale-[0.98] animate-fade-up"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand">
              <IconCheck className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="font-display font-bold text-base text-txt-primary">
                {ex.nombre}
              </p>
              <p className="text-xs text-txt-secondary mt-0.5">{ex.resumen}</p>
              <p className="text-xs font-semibold text-txt-tertiary mt-1">
                {ex.minutos} min
                {ex.conHisopo ? " · con hisopo" : " · sin objetos"}
              </p>
            </div>
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-display font-extrabold text-xl text-txt-primary animate-fade-up [animation-delay:240ms]">
        Gimnasia frente al espejo
      </h2>
      <p className="mt-1 text-sm text-txt-secondary animate-fade-up [animation-delay:270ms]">
        Toca una imagen para ver cómo se hace. Háganlo juntos, como un juego.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {espejo.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => setAbierto(ex)}
            style={{ animationDelay: `${300 + i * 40}ms` }}
            className="flex flex-col items-stretch gap-2 text-left transition-transform active:scale-[0.96] animate-fade-up"
          >
            <span
              className={`relative block aspect-square overflow-hidden rounded-2xl border-4 bg-surface-primary ${BORDE[i % 3]}`}
            >
              <Image
                src={ex.imagen ?? ""}
                alt={ex.nombre}
                fill
                sizes="110px"
                className="object-cover"
              />
            </span>
            <span
              className={`flex min-h-9 items-center justify-center rounded-full px-2 py-1 text-center text-xs font-bold leading-tight ${PILDORA[i % 3]}`}
            >
              {ex.etiqueta}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-txt-tertiary flex items-start gap-2">
        <IconShieldCheck className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
        Estos ejercicios son para que los haga un adulto con el niño. No
        reemplazan la valoración de un fonoaudiólogo.
      </p>
    </div>
  );
}
