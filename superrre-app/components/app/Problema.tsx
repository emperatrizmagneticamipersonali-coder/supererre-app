import {
  IconHeartCrack,
  IconMic,
  IconMirror,
  IconAlarmClock,
  IconCoin,
} from "./icons";

const dolores = [
  {
    icon: IconHeartCrack,
    texto: (
      <>
        ¿Tu hijo dice &ldquo;cawo&rdquo; en vez de{" "}
        <strong className="font-semibold">&ldquo;carro&rdquo;</strong> y
        sientes que <strong className="font-semibold">se burlan de él</strong>{" "}
        en el cole?
      </>
    ),
  },
  {
    icon: IconMic,
    texto: (
      <>
        ¿Le pides que repita &ldquo;perro&rdquo; y termina llorando:{" "}
        <strong className="font-semibold">
          &ldquo;¡no puedo, no me sale!&rdquo;
        </strong>
        ?
      </>
    ),
  },
  {
    icon: IconMirror,
    texto: (
      <>
        ¿Ya lo intentaste frente al espejo y ni tú sabes bien{" "}
        <strong className="font-semibold">dónde va la lengua</strong> por
        dentro?
      </>
    ),
  },
  {
    icon: IconAlarmClock,
    texto: (
      <>
        ¿Te da miedo que entre a primaria{" "}
        <strong className="font-semibold">
          sin poder pronunciar ni escribir bien la R
        </strong>
        ?
      </>
    ),
  },
  {
    icon: IconCoin,
    texto: (
      <>
        Bajaste una app &ldquo;gratis&rdquo; y al séptimo día te{" "}
        <strong className="font-semibold">
          cobraron $60 dólares sin avisar
        </strong>
        ?
      </>
    ),
  },
];

export function Problema() {
  return (
    <section className="py-16 sm:py-20 bg-surface-secondary">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-txt-primary text-balance">
          ¿Te suena familiar?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {dolores.map(({ icon: Icon, texto }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl bg-surface-primary border border-border-default p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent-soft text-brand-accent">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm leading-relaxed text-txt-primary pt-2">
                {texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
