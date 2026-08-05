import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-brand-secondary font-semibold">
        ← Volver
      </Link>
      <h1 className="font-display font-extrabold text-3xl text-txt-primary mt-6">
        Política de Privacidad
      </h1>
      <p className="text-sm text-txt-tertiary mt-2">
        Última actualización: agosto de 2026
      </p>

      <div className="mt-8 space-y-6 text-[15px] text-txt-secondary leading-relaxed">
        <p>
          SuperErre es una aplicación pensada para niños de 4 a 7 años,
          usada bajo la supervisión de un padre, madre o tutor. Esta
          política explica qué información recogemos y qué no.
        </p>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Audio y video del niño
          </h2>
          <p>
            El micrófono y la cámara se usan únicamente para detectar
            intentos de sonido y activar filtros dentro de los ejercicios.
            Ese procesamiento ocurre siempre en el dispositivo — SuperErre
            no sube, guarda ni transmite grabaciones de audio o video a
            ningún servidor.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Cuenta del padre o madre
          </h2>
          <p>
            La única cuenta con datos personales (nombre, correo) es la
            del adulto responsable. El niño no crea cuenta propia ni
            ingresa datos personales directamente — solo un nombre y una
            edad que el adulto configura.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Con quién compartimos datos
          </h2>
          <p>
            Usamos proveedores de infraestructura (hosting, base de
            datos, procesamiento de pagos vía Hotmart) para operar la
            app. No vendemos datos personales a terceros ni los usamos
            para publicidad dirigida a menores.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-txt-primary mb-2">
            Tus derechos
          </h2>
          <p>
            Puedes pedir la eliminación de la cuenta y sus datos
            escribiendo a{" "}
            <a href="mailto:hola@supererre.app" className="text-brand-secondary font-semibold">
              hola@supererre.app
            </a>
            .
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-txt-tertiary border-t border-border-default pt-5">
        ⚠️ Este texto es un borrador base. Antes de publicar la app,
        conviene que un abogado local lo revise según las leyes de
        protección de datos de menores del país donde se opere.
      </p>
    </main>
  );
}
