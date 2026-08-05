import { IconShieldCheck } from "./icons";

export function Garantia() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="rounded-3xl bg-brand-secondary-soft border border-brand-secondary/30 p-8 sm:p-10 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand mb-5">
            <IconShieldCheck className="h-7 w-7" />
          </span>
          <h2 className="font-display font-extrabold text-2xl text-txt-primary">
            La Garantía del Primer Rugido
          </h2>
          <p className="mt-4 text-sm text-txt-secondary leading-relaxed">
            Si en 7 días tu hijo no logra su primer intento real de sonido
            con el Espejo del León, te devolvemos el pago. Un correo, sin
            preguntas, sin formularios.
          </p>
          <p className="mt-3 text-xs text-txt-tertiary">
            Respaldado por la política de reembolso de Hotmart (7 días).
          </p>
        </div>
      </div>
    </section>
  );
}
