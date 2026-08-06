"use client";

import { useState } from "react";
import {
  IconChevronDown,
  IconCoin,
  IconMirror,
  IconGraduation,
  IconEye,
  IconShieldCheck,
} from "./icons";

const preguntas = [
  {
    icon: IconCoin,
    q: "¿Me van a cobrar de más sin avisar, como otras apps?",
    a: "No. SuperErre es un pago único de $19.99, una sola vez. Sin suscripción, sin renovación automática, sin sorpresas en la tarjeta.",
  },
  {
    icon: IconMirror,
    q: "¿Mi hijo va a perder el interés en 3 días?",
    a: "Cada sesión dura 5 minutos y desbloquea algo nuevo — un filtro, una isla, un minijuego. No es la repetición sin fin que cansa a los niños en otras apps.",
  },
  {
    icon: IconGraduation,
    q: "¿Reemplaza a un fonoaudiólogo?",
    a: "No. Es una herramienta de práctica diaria en casa. Si el rotacismo persiste más allá de los 6-7 años, sigue siendo importante consultar a un especialista.",
  },
  {
    icon: IconEye,
    q: "¿Es seguro que use el micrófono y la cámara de mi hijo?",
    a: "Sí. Todo el audio y el video se procesan dentro del celular — nunca se suben a internet ni se guardan en ningún servidor.",
  },
  {
    icon: IconShieldCheck,
    q: "¿Y si no funciona para mi hijo?",
    a: "Tienes la Garantía del Primer Rugido: si en 7 días no ves su primer intento real de sonido, te devolvemos el pago completo.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-surface-secondary">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-txt-primary">
          Preguntas frecuentes
        </h2>
        <div className="mt-9 space-y-3">
          {preguntas.map((p, i) => {
            const isOpen = open === i;
            return (
              <div
                key={p.q}
                className="rounded-2xl bg-surface-primary border border-border-default overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 text-left px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-txt-on-primary-soft">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-semibold text-sm text-txt-primary">
                    {p.q}
                  </span>
                  <IconChevronDown
                    className={`h-5 w-5 shrink-0 text-txt-tertiary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 pl-16 text-sm text-txt-secondary leading-relaxed">
                    {p.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
