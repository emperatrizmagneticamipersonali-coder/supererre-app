import Link from "next/link";
import { IconCheck, IconLock, IconCoin } from "./icons";

const stack = [
  {
    linea: "Escalera Fonética completa (RA, RE, RI, RO, RU)",
    valor: "$40",
    ejemplo: "carro · perro · rana · ferrocarril · tenedor · guitarra",
  },
  { linea: "Modo Pirata — sonidos y onomatopeyas extra", valor: "$15" },
  { linea: "Minijuegos de recompensa ilimitados", valor: "$20" },
  { linea: "Acceso de por vida, sin suscripción", valor: "$10" },
];

const gratis = [
  "Gimnasia de Lengua (Praxias)",
  "El Espejo del León",
  "1 sonido de la Escalera Fonética",
];

const comparacion = [
  {
    nombre: "1 sesión de fonoaudiología",
    detalle: "Solo 45 minutos",
    precio: "$40",
    sufijo: "",
    destacado: false,
  },
  {
    nombre: "Otras apps de habla",
    detalle: "Cobro recurrente",
    precio: "$59.99",
    sufijo: "/año",
    destacado: false,
  },
  {
    nombre: "SuperErre",
    detalle: "Para siempre",
    precio: "$19.99",
    sufijo: "único",
    destacado: true,
  },
];

export function Oferta() {
  return (
    <section id="oferta" className="py-16 sm:py-20 bg-surface-secondary">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-txt-primary text-balance">
          Un precio justo, una sola vez
        </h2>
        <p className="mt-3 text-center text-txt-secondary max-w-lg mx-auto">
          <strong className="text-txt-primary font-semibold">
            La única app para la letra R sin suscripciones mensuales
            engañosas.
          </strong>{" "}
          Pagas una sola vez y es tuya para siempre.
        </p>

        <div className="mt-9 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {comparacion.map((c) => (
            <div
              key={c.nombre}
              className={`rounded-2xl p-4 text-center ${
                c.destacado
                  ? "bg-brand-primary-soft border-2 border-brand-primary"
                  : "bg-surface-primary border border-border-default"
              }`}
            >
              <p
                className={`text-xs font-bold leading-snug ${
                  c.destacado ? "text-txt-on-primary-soft" : "text-txt-secondary"
                }`}
              >
                {c.nombre}
              </p>
              <p className="mt-3 font-display font-extrabold text-2xl text-txt-primary">
                {c.precio}
                {c.sufijo && (
                  <span className="text-xs font-semibold text-txt-tertiary">
                    {" "}
                    {c.sufijo}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-txt-tertiary">{c.detalle}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-5 items-stretch">
          <div className="rounded-3xl bg-surface-primary border border-border-default p-7 flex flex-col">
            <p className="font-display font-bold text-lg text-txt-primary">
              Gratis
            </p>
            <p className="text-sm text-txt-secondary mt-1">
              Para probar el Espejo del León
            </p>
            <p className="mt-5 font-display font-extrabold text-3xl text-txt-primary">
              $0
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {gratis.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-txt-secondary">
                  <IconCheck className="h-4 w-4 mt-1 text-brand-secondary shrink-0" />
                  {g}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-txt-tertiary">
                <IconLock className="h-4 w-4 mt-1 shrink-0" />
                Escalera Fonética completa y minijuegos
              </li>
            </ul>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex justify-center rounded-full border-2 border-border-strong text-txt-primary font-display font-bold px-6 py-3 hover:bg-surface-tertiary transition-colors"
            >
              Empezar gratis
            </Link>
          </div>

          <div className="relative rounded-3xl bg-surface-primary border-2 border-brand-primary p-7 flex flex-col shadow-lg">
            <span className="absolute -top-3 left-7 rounded-full bg-brand-primary text-txt-on-brand text-xs font-bold px-3 py-1">
              Recomendado
            </span>
            <p className="font-display font-bold text-lg text-txt-primary">
              Espejo Completo
            </p>
            <p className="text-sm text-txt-secondary mt-1">
              <strong className="text-txt-primary font-semibold">
                Acceso ilimitado
              </strong>{" "}
              a todos los niveles, praxias, juegos y futuras
              actualizaciones.{" "}
              <strong className="text-txt-primary font-semibold">
                Sin mensualidades, sin cargos sorpresa.
              </strong>
            </p>
            <div className="mt-5 flex items-baseline gap-2">
              <p className="font-display font-extrabold text-3xl text-txt-primary">
                $19.99
              </p>
              <span className="text-sm text-txt-tertiary line-through">
                valor $85
              </span>
            </div>
            <p className="text-xs text-txt-tertiary mt-1 flex items-center gap-2">
              <IconCoin className="h-4 w-4 shrink-0" />
              Pago único · una sola vez, nunca más
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {stack.map((s) => (
                <li key={s.linea}>
                  <div className="flex items-start justify-between gap-2 text-sm text-txt-primary">
                    <span className="flex items-start gap-2">
                      <IconCheck className="h-4 w-4 mt-1 text-brand-primary shrink-0" />
                      <strong className="font-semibold">{s.linea}</strong>
                    </span>
                    <span className="text-txt-tertiary shrink-0">{s.valor}</span>
                  </div>
                  {s.ejemplo && (
                    <p className="pl-6 mt-1 text-xs text-txt-tertiary">
                      {s.ejemplo}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-6 py-3 shadow-md transition-colors"
            >
              Desbloquear el Espejo completo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
