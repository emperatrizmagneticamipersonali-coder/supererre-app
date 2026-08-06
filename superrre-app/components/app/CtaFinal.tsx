import Link from "next/link";
import { IconSparkles, IconCoin, IconShieldCheck } from "./icons";

const puntos = [
  { icon: IconSparkles, texto: "Empiezas gratis hoy" },
  { icon: IconCoin, texto: "$19.99 pago único" },
  { icon: IconShieldCheck, texto: "Garantía del Primer Rugido" },
];

export function CtaFinal() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
        <span className="text-5xl mb-4 inline-block">🦁💛</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-txt-primary text-balance">
          Imagina la próxima vez que pida un jugo…
        </h2>
        <p className="mt-4 text-lg text-txt-secondary leading-relaxed">
          Y diga &ldquo;jugo de fresa&rdquo;, clarito, sin pensarlo. Sé la
          mamá que encontró la forma de ayudarlo sin pelear ni gastar de
          más.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {puntos.map((p) => (
            <span
              key={p.texto}
              className="inline-flex items-center gap-2 rounded-full bg-surface-secondary text-txt-primary text-xs font-bold px-4 py-2"
            >
              <p.icon className="h-4 w-4 text-brand-primary" />
              {p.texto}
            </span>
          ))}
        </div>

        <Link
          href="/onboarding"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base px-8 py-4 shadow-md transition-colors"
        >
          Probar el Espejo gratis
        </Link>

        <p className="mt-10 text-xs text-txt-tertiary leading-relaxed max-w-md mx-auto">
          PS: SuperErre convierte la práctica de la R en 5 minutos de
          juego con el Espejo del León. Empiezas gratis, desbloqueas todo
          por $19.99 una sola vez, y si en 7 días tu hijo no logra su
          primer intento real de sonido, te devolvemos el pago.
        </p>
      </div>
    </section>
  );
}
