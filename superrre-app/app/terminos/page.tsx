import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-brand-secondary font-semibold">
        ← Volver
      </Link>
      <h1 className="font-display font-extrabold text-3xl text-txt-primary mt-6">
        Términos y Condiciones
      </h1>
      <p className="text-sm text-txt-tertiary mt-2">
        Última actualización: agosto de 2026
      </p>

      <div className="mt-8 space-y-6 text-[15px] text-txt-secondary leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Qué es SuperErre
          </h2>
          <p>
            SuperErre es una herramienta de práctica gamificada para
            ayudar a niños de 4 a 7 años a ejercitar la pronunciación de
            la letra R en casa. No es un servicio médico ni de terapia
            de lenguaje, y no reemplaza la evaluación de un
            fonoaudiólogo o profesional de la salud.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Uso bajo supervisión
          </h2>
          <p>
            La app está diseñada para usarse con un adulto responsable
            cerca. La cuenta y el pago quedan a nombre del padre, madre
            o tutor — nunca del niño.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Pagos
          </h2>
          <p>
            El desbloqueo completo de SuperErre es un pago único de
            $19.99 USD, procesado por Hotmart. No hay suscripción ni
            renovación automática.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Uso aceptable
          </h2>
          <p>
            No está permitido copiar, revender o distribuir el contenido
            de la app. Nos reservamos el derecho de suspender cuentas que
            hagan un uso indebido del servicio.
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-txt-tertiary border-t border-border-default pt-5">
        ⚠️ Este texto es un borrador base. Antes de publicar la app,
        conviene que un abogado local lo revise.
      </p>
    </main>
  );
}
