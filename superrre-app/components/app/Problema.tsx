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
    texto:
      '¿Tu hijo dice "cawo" en vez de "carro" y sientes que se burlan de él en el cole?',
  },
  {
    icon: IconMic,
    texto:
      '¿Le pides que repita "perro" y termina llorando: "¡no puedo, no me sale!"?',
  },
  {
    icon: IconMirror,
    texto:
      "¿Ya lo intentaste frente al espejo y ni tú sabes bien dónde va la lengua por dentro?",
  },
  {
    icon: IconAlarmClock,
    texto:
      "¿Te da miedo que entre a primaria sin poder pronunciar ni escribir bien la R?",
  },
  {
    icon: IconCoin,
    texto:
      'Bajaste una app "gratis" y al séptimo día te cobraron $60 dólares sin avisar?',
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
