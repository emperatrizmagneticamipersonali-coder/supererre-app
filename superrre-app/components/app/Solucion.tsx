import Link from "next/link";
import { IconEye, IconMic, IconSparkles, IconHeartCrack } from "./icons";

const pasos = [
  {
    n: "1",
    icon: IconEye,
    titulo: "Ve al León mostrar el truco",
    texto: (
      <>
        Tu hijo toca la pantalla y ve al León animado hacer el sonido
        &ldquo;¡GRRR!&rdquo;, mostrando paso a paso{" "}
        <strong className="font-semibold text-txt-primary">
          dónde poner la lengua
        </strong>
        .
      </>
    ),
  },
  {
    n: "2",
    icon: IconMic,
    titulo: "Imita frente al Espejo",
    texto: (
      <>
        Repite el sonido frente al Espejo del León — el micrófono detecta
        el intento, siempre en el celular,{" "}
        <strong className="font-semibold text-txt-primary">
          nunca en internet
        </strong>
        .
      </>
    ),
  },
  {
    n: "3",
    icon: IconSparkles,
    titulo: "Practica palabras reales",
    texto: (
      <>
        Avanza por la Escalera Fonética diciendo{" "}
        <strong className="font-semibold text-txt-primary">
          &ldquo;carro&rdquo;, &ldquo;perro&rdquo;, &ldquo;rana&rdquo;
        </strong>{" "}
        y hasta &ldquo;ferrocarril&rdquo;, ganando una estrella por cada
        logro.
      </>
    ),
  },
];

export function Solucion() {
  return (
    <section className="py-16 sm:py-20 bg-surface-secondary">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-txt-primary text-balance">
            No es pereza — es que nunca vio cómo se mueve la lengua
          </h2>
          <p className="mt-4 text-lg text-txt-secondary leading-relaxed">
            <strong className="text-txt-primary font-semibold">
              El Espejo del León
            </strong>{" "}
            resuelve esto mostrándole a tu hijo, con animación clara,{" "}
            <strong className="text-txt-primary font-semibold">
              dónde va la lengua
            </strong>
            .
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {pasos.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl bg-surface-primary border border-border-default p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand font-display font-bold text-sm shrink-0">
                  {p.n}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-soft text-txt-on-primary-soft shrink-0">
                  <p.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-4 font-display font-bold text-lg text-txt-primary">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-txt-secondary leading-relaxed">
                {p.texto}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border-default bg-surface-primary p-5">
            <div className="flex items-center gap-2 mb-2">
              <IconHeartCrack className="h-4 w-4 text-txt-tertiary" />
              <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                Antes
              </p>
            </div>
            <p className="text-sm text-txt-secondary leading-relaxed">
              Espejo casero, tú explicando sin saber cómo, un niño
              frustrado que pide el celular para calmarse.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-brand-secondary bg-brand-secondary-soft p-5">
            <div className="flex items-center gap-2 mb-2">
              <IconSparkles className="h-4 w-4 text-txt-on-secondary-soft" />
              <p className="text-xs font-bold uppercase tracking-wide text-txt-on-secondary-soft">
                Con el Espejo del León
              </p>
            </div>
            <p className="text-sm text-txt-on-secondary-soft leading-relaxed">
              Tu hijo sigue al León paso a paso, y en minutos dice{" "}
              <strong className="font-semibold">&ldquo;carro&rdquo;</strong>{" "}
              o <strong className="font-semibold">&ldquo;perro&rdquo;</strong>{" "}
              con su primer intento real de R.
            </p>
          </div>
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-sm px-6 py-3 btn-3d-primary transition-colors"
          >
            Probar el Espejo gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}
