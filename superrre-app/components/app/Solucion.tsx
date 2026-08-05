const pasos = [
  {
    n: "1",
    titulo: "Ve a otro niño rugir",
    texto:
      'Tu hijo toca la pantalla y ve un video de 10 segundos de otro niño real diciendo "¡GRRR!" como un león.',
  },
  {
    n: "2",
    titulo: "Imita frente al Espejo",
    texto:
      "Repite el sonido frente al Espejo del León — el micrófono detecta el intento, siempre en el celular, nunca en internet.",
  },
  {
    n: "3",
    titulo: "Gana su primera estrella",
    texto:
      "La pantalla se llena de fiesta, el filtro de león se activa sobre su cara, y consigue su primer logro visible.",
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
            resuelve esto haciendo que tu hijo imite a otro niño real, en
            vez de intentar entender explicaciones de adultos.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {pasos.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl bg-surface-primary border border-border-default p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand font-display font-bold text-sm">
                {p.n}
              </span>
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
            <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary mb-2">
              Antes
            </p>
            <p className="text-sm text-txt-secondary leading-relaxed">
              Espejo casero, tú explicando sin saber cómo, un niño
              frustrado que pide el celular para calmarse.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-brand-secondary bg-brand-secondary-soft p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-txt-on-secondary-soft mb-2">
              Con el Espejo del León
            </p>
            <p className="text-sm text-txt-on-secondary-soft leading-relaxed">
              Tu hijo pide jugar solo, imita a otro niño, y en minutos
              logra su primer intento real de R.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
