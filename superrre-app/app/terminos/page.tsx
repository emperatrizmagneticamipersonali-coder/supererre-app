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
        Última actualización: 30 de agosto de 2026
      </p>

      <div className="mt-8 space-y-6 text-sm text-txt-secondary leading-relaxed">
        <p>
          SuperErre es operada por{" "}
          <strong className="text-txt-primary">
            Ana Karen Dorantes Díaz
          </strong>
          , persona física, desde México. Al crear una cuenta o usar la
          app, aceptas estos Términos y nuestro{" "}
          <Link
            href="/privacidad"
            className="font-semibold text-brand-secondary"
          >
            Aviso de Privacidad
          </Link>
          .
        </p>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Qué es SuperErre (y qué no es)
          </h2>
          <p>
            SuperErre es una herramienta de práctica gamificada para
            ayudar a niños de 4 a 7 años a ejercitar la pronunciación
            de la letra R en casa. <strong>No es</strong> un servicio
            médico, de diagnóstico ni de terapia de lenguaje, y{" "}
            <strong>no reemplaza</strong> la evaluación ni el
            tratamiento de un fonoaudiólogo u otro profesional de la
            salud. No garantizamos un resultado terapéutico concreto —
            es un juego de práctica, no un tratamiento clínico.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Uso bajo supervisión
          </h2>
          <p>
            La app está diseñada para usarse con un adulto responsable
            cerca. La cuenta y el pago quedan siempre a nombre del
            padre, madre o tutor — nunca del niño. El adulto es
            responsable de supervisar el uso y de cualquier decisión
            relacionada con la salud o el desarrollo del niño.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Licencia de uso
          </h2>
          <p>
            Te damos una licencia personal, no exclusiva e
            intransferible para usar SuperErre dentro de tu hogar. No
            está permitido copiar, revender, distribuir ni explotar
            comercialmente el contenido de la app.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Pagos
          </h2>
          <p>
            El desbloqueo completo de SuperErre es un{" "}
            <strong className="text-txt-primary">pago único</strong> de
            $19.99 USD, procesado por Hotmart.{" "}
            <strong>No hay suscripción ni renovación automática</strong>{" "}
            — pagas una vez y el acceso completo queda activado, sin
            cobros futuros que cancelar.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Límite de responsabilidad
          </h2>
          <p>
            SuperErre se ofrece &ldquo;tal cual&rdquo;, sin garantía de
            resultados específicos. En la medida permitida por la ley,
            nuestra responsabilidad frente a ti se limita al monto que
            pagaste por la app, y no respondemos por daños indirectos
            derivados del uso o la imposibilidad de uso del servicio.
            Nada de esto limita los derechos que la ley de tu país te
            reconozca como consumidor.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Uso aceptable y suspensión de cuentas
          </h2>
          <p>
            No está permitido copiar, revender o distribuir el
            contenido de la app, ni intentar vulnerar su
            funcionamiento. Nos reservamos el derecho de suspender o
            cancelar cuentas que hagan un uso indebido del servicio,
            avisando por correo cuando sea razonable hacerlo.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Ley aplicable
          </h2>
          <p>
            Estos Términos se rigen por las leyes de México. Esto no
            elimina los derechos de protección al consumidor que
            puedan corresponderte según las leyes de tu propio país de
            residencia.
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-txt-tertiary border-t border-border-default pt-5">
        ⚠️ Este texto lo redactó una IA siguiendo la doctrina interna
        del proyecto para reflejar exactamente lo que la app hace hoy;
        antes de operar a mayor escala, conviene que lo revise un
        abogado local.
      </p>
    </main>
  );
}
