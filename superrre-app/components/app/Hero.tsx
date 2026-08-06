import Link from "next/link";
import { MiniDemo } from "./MiniDemo";
import { IconShieldCheck } from "./icons";

export function Hero() {
  return (
    <section className="pt-10 sm:pt-16 pb-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary-soft text-txt-on-primary-soft text-xs font-bold px-3 py-2 mb-4">
            Pago único · Sin suscripciones
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] text-txt-primary text-balance">
            De &ldquo;cawo&rdquo; a &ldquo;carro&rdquo; en 15 días
          </h1>
          <p className="mt-5 text-lg text-txt-secondary max-w-md leading-relaxed">
            <strong className="text-txt-primary font-semibold">
              El Espejo del León
            </strong>{" "}
            le muestra a tu hijo, con animación paso a paso, cómo mover la
            lengua —{" "}
            <strong className="text-txt-primary font-semibold">
              5 minutos al día
            </strong>
            , sin pelear frente al espejo.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-txt-tertiary uppercase tracking-wide mr-1">
              Practica con:
            </span>
            {["carro", "perro", "rana", "ferrocarril"].map((palabra) => (
              <span
                key={palabra}
                className="rounded-full bg-surface-secondary text-txt-primary text-sm font-bold px-3 py-1"
              >
                {palabra}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base px-8 py-4 shadow-md transition-colors"
            >
              Probar el Espejo gratis
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-txt-tertiary">
              <IconShieldCheck className="h-4 w-4 text-brand-secondary shrink-0" />
              Sin tarjeta · Funciona <strong className="text-txt-primary font-semibold">100% en el celular</strong>
            </span>
          </div>
        </div>

        <MiniDemo />
      </div>
    </section>
  );
}
