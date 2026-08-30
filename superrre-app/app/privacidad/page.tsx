import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-brand-secondary font-semibold">
        ← Volver
      </Link>
      <h1 className="font-display font-extrabold text-3xl text-txt-primary mt-6">
        Aviso de Privacidad
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
          , persona física, desde México. Este aviso explica, en
          palabras simples, qué información recogemos, para qué la
          usamos y qué derechos tienes sobre ella (los llamados
          &ldquo;derechos ARCO&rdquo; en la ley mexicana de protección de
          datos personales).
        </p>

        <p>
          SuperErre es una aplicación pensada para niños de 4 a 7 años,
          usada bajo la supervisión de un padre, madre o tutor. El niño
          no crea una cuenta propia ni acepta este aviso — lo hace el
          adulto responsable.
        </p>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Qué datos recopilamos
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-txt-primary">
                Del adulto responsable:
              </strong>{" "}
              nombre y correo electrónico, para crear la cuenta,
              enviarte el enlace de acceso y comunicarnos contigo sobre
              tu compra.
            </li>
            <li>
              <strong className="text-txt-primary">Del niño:</strong>{" "}
              solo un nombre y una edad que el adulto configura dentro
              de la app — el niño no ingresa ningún dato personal
              directamente.
            </li>
            <li>
              <strong className="text-txt-primary">
                Datos de uso, sin identificar a nadie:
              </strong>{" "}
              registramos internamente eventos como &ldquo;se completó
              un ejercicio&rdquo; o &ldquo;se abrió la app&rdquo;,
              identificados por un código anónimo del dispositivo (no
              tu nombre ni tu correo), para saber si la app funciona y
              mejorar el producto. No usamos herramientas externas de
              publicidad ni de rastreo (no hay cookies de terceros ni
              píxeles de anuncios) — por eso no encontrarás un banner de
              cookies: no las necesitamos.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Audio y video del niño
          </h2>
          <p>
            El micrófono y la cámara se usan únicamente para detectar
            intentos de sonido y activar filtros dentro de los
            ejercicios. Ese procesamiento ocurre siempre en el propio
            dispositivo — SuperErre no sube, guarda ni transmite
            grabaciones de audio o video a ningún servidor, ni las
            comparte con nadie.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Con quién compartimos datos
          </h2>
          <p className="mb-2">
            No vendemos datos personales a nadie, ni los usamos para
            publicidad dirigida a menores. Sí trabajamos con estos
            proveedores, cada uno con una función concreta:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-txt-primary">Supabase</strong> —
              guarda la base de datos y gestiona el acceso a la cuenta
              del adulto responsable.
            </li>
            <li>
              <strong className="text-txt-primary">Vercel</strong> —
              aloja la aplicación web (donde corre SuperErre).
            </li>
            <li>
              <strong className="text-txt-primary">Hotmart</strong> —
              procesa el pago; SuperErre nunca ve ni guarda tu tarjeta
              o datos bancarios, eso queda enteramente en manos de
              Hotmart.
            </li>
          </ul>
          <p className="mt-2">
            No usamos ningún proveedor de inteligencia artificial: el
            detector de voz de SuperErre corre por completo en tu
            propio celular, no envía nada a servicios de IA externos.
            Supabase y Vercel pueden guardar información en servidores
            fuera de México — te lo decimos aquí de forma transparente,
            como exige la ley, aunque solo se trata de los datos
            mínimos de tu cuenta (nombre y correo), nunca del audio o
            video de tu hijo.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Tus derechos (Acceso, Rectificación, Cancelación y
            Oposición)
          </h2>
          <p>
            Puedes pedirnos en cualquier momento que te digamos qué
            datos tenemos tuyos, que los corrijamos, que los
            eliminemos por completo (a ti y a tu hijo), o que dejemos
            de usarlos. Basta con escribir a{" "}
            <a
              href="mailto:supererre.app@gmail.com"
              className="text-brand-secondary font-semibold"
            >
              supererre.app@gmail.com
            </a>
            . Al eliminar tu cuenta, borramos también los datos de tu
            hijo y de su progreso — de forma permanente y sin poder
            deshacerse.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Cambios a este aviso
          </h2>
          <p>
            Si hacemos un cambio importante a este aviso (por ejemplo,
            si empezamos a compartir datos con un proveedor nuevo), te
            avisaremos por correo antes de que entre en vigor, no solo
            actualizando esta página en silencio.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Contacto
          </h2>
          <p>
            Para cualquier duda sobre tus datos o los de tu hijo,
            escribe a{" "}
            <a
              href="mailto:supererre.app@gmail.com"
              className="text-brand-secondary font-semibold"
            >
              supererre.app@gmail.com
            </a>
            .
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-txt-tertiary border-t border-border-default pt-5">
        Esta app cobra por pago único, sin suscripción — no hay cobros
        recurrentes que cancelar. ⚠️ Este aviso lo redactó una IA
        siguiendo la doctrina interna del proyecto para reflejar
        exactamente lo que la app hace hoy; antes de operar a mayor
        escala, conviene que lo revise un abogado local especializado
        en protección de datos.
      </p>
    </main>
  );
}
