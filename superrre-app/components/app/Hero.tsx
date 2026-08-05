import Link from "next/link";
import { MiniDemo } from "./MiniDemo";

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
            El Espejo del León le muestra a tu hijo cómo mover la lengua,
            imitando a otro niño real — 5 minutos al día, sin pelear frente
            al espejo.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base px-8 py-4 shadow-md transition-colors"
            >
              Probar el Espejo gratis
            </Link>
            <span className="text-sm text-txt-tertiary">
              Sin tarjeta · Funciona 100% en el celular
            </span>
          </div>
        </div>

        <MiniDemo />
      </div>
    </section>
  );
}
