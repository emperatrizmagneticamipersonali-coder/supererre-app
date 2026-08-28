import { IconCheck, IconHeartCrack } from "@/components/app/icons";

export type Aviso = { emoji: string; texto: string };

/** Banner de avisos del dueño — "qué pasó -> por qué importa -> qué hacer", en simple.
 * Si no hay avisos, dice que todo está en orden (también es información). */
export function AvisoBanner({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3">
        <IconCheck className="h-5 w-5 text-success shrink-0" />
        <p className="text-sm font-semibold text-txt-primary">
          ✅ Todo en orden por ahora
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {avisos.map((a, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl bg-brand-accent-soft px-4 py-3"
        >
          <IconHeartCrack className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
          <p className="text-sm text-txt-primary">
            <span className="mr-1">{a.emoji}</span>
            {a.texto}
          </p>
        </div>
      ))}
    </div>
  );
}
