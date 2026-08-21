import { IconAlarmClock, IconGraduation } from "./icons";

export function Agitacion() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-center text-txt-primary text-balance">
          Cada tarde frente al espejo que termina en llanto no es un
          fracaso tuyo
        </h2>

        <div className="mt-9 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-primary shadow-sm p-5 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent-soft text-brand-accent">
              <IconAlarmClock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-lg text-txt-primary">
                10-15 min diarios
              </p>
              <p className="text-sm text-txt-secondary mt-1">
                de pelea que terminan igual: él frustrado, tú con culpa, y{" "}
                <strong className="text-txt-primary font-semibold">
                  la R sigue sin salir
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-primary shadow-sm p-5 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent-soft text-brand-accent">
              <IconGraduation className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-lg text-txt-primary">
                En 6 meses, igual
              </p>
              <p className="text-sm text-txt-secondary mt-1">
                Mateo entra a primaria diciendo &ldquo;cawo&rdquo; — y
                ahora también debe{" "}
                <strong className="text-txt-primary font-semibold">
                  leer y escribir esa letra
                </strong>
                .
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-lg text-txt-secondary leading-relaxed max-w-xl mx-auto">
          No es que hayas fallado.{" "}
          <strong className="text-txt-primary font-semibold">
            El espejo casero y las apps genéricas fallan por la misma
            razón:
          </strong>{" "}
          ninguno le muestra a un niño de 5 años, jugando, dónde poner la
          lengua por dentro.
        </p>
      </div>
    </section>
  );
}
