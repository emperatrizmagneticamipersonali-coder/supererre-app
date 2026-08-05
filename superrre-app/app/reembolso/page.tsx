import Link from "next/link";

export default function ReembolsoPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-brand-secondary font-semibold">
        ← Volver
      </Link>
      <h1 className="font-display font-extrabold text-3xl text-txt-primary mt-6">
        Política de Reembolso
      </h1>
      <p className="text-sm text-txt-tertiary mt-2">
        Última actualización: agosto de 2026
      </p>

      <div className="mt-8 space-y-6 text-[15px] text-txt-secondary leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            La Garantía del Primer Rugido
          </h2>
          <p>
            Si dentro de los primeros 7 días desde la compra tu hijo no
            logra su primer intento real de sonido con el Espejo del
            León, te devolvemos el pago completo. Solo tienes que
            escribir a{" "}
            <a href="mailto:hola@supererre.app" className="text-brand-secondary font-semibold">
              hola@supererre.app
            </a>
            . Sin preguntas, sin formularios.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Cómo se procesa
          </h2>
          <p>
            Los pagos de SuperErre se procesan a través de Hotmart, cuya
            política de reembolso garantiza 7 días desde la compra. El
            reembolso se acredita por el mismo medio de pago original.
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-txt-tertiary border-t border-border-default pt-5">
        ⚠️ Esta garantía queda condicionada a que la cuenta de Hotmart del
        producto esté configurada con una ventana de reembolso de al
        menos 7 días — se confirma al conectar Hotmart en la Sesión 6.
      </p>
    </main>
  );
}
