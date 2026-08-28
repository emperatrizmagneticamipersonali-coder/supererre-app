import { getEventosPorTipo, getRetencion } from "@/lib/admin/data";

const NOMBRE_EVENTO: Record<string, string> = {
  app_abierta: "Abrieron la app por primera vez",
  onboarding_completado: "Terminaron el onboarding",
  ejercicio_completado: "Ejercicios completados",
  sesion_iniciada: "Sesiones activas (días distintos)",
};

function TarjetaRetencion({
  titulo,
  dato,
}: {
  titulo: string;
  dato: { cohorte: number; retenidos: number } | null;
}) {
  return (
    <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
      <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
        {titulo}
      </p>
      {dato ? (
        <>
          <p className="mt-2 font-display font-extrabold text-3xl text-txt-primary">
            {Math.round((dato.retenidos / dato.cohorte) * 100)}%
          </p>
          <p className="mt-1 text-sm text-txt-secondary">
            {dato.retenidos} de {dato.cohorte} volvieron
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 font-display font-extrabold text-3xl text-txt-tertiary">
            —
          </p>
          <p className="mt-1 text-sm text-txt-secondary">
            Sin datos todavía — hace falta que pase más tiempo desde los
            primeros usuarios reales
          </p>
        </>
      )}
    </div>
  );
}

export default async function AdminUsoPage() {
  const desde30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [eventos, retencion] = await Promise.all([
    getEventosPorTipo(desde30dias),
    getRetencion(),
  ]);

  const activaciones = eventos.find((e) => e.type === "app_abierta")?.total ?? 0;
  const onboarding =
    eventos.find((e) => e.type === "onboarding_completado")?.total ?? 0;
  const tasaActivacion =
    activaciones > 0 ? Math.round((onboarding / activaciones) * 100) : null;

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Uso
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Qué tanto usa la gente la app de verdad — últimos 30 días.
      </p>

      {eventos.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border-default bg-surface-secondary p-8 text-center">
          <p className="font-display font-bold text-txt-primary">
            Sin datos todavía
          </p>
          <p className="mt-1 text-sm text-txt-secondary max-w-sm mx-auto">
            En cuanto alguien use la app de verdad (no en modo de prueba),
            esta pantalla se llena sola.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
            <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
              Activación
            </p>
            <p className="mt-2 font-display font-extrabold text-3xl text-txt-primary">
              {tasaActivacion !== null ? `${tasaActivacion}%` : "—"}
            </p>
            <p className="mt-1 text-sm text-txt-secondary">
              {tasaActivacion !== null
                ? `${onboarding} de ${activaciones} personas que abrieron la app terminaron el onboarding`
                : "Sin datos todavía"}
            </p>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Retención — ¿vuelven?
          </p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TarjetaRetencion titulo="Día siguiente (D1)" dato={retencion.d1} />
            <TarjetaRetencion titulo="A la semana (D7)" dato={retencion.d7} />
            <TarjetaRetencion titulo="Al mes (D30)" dato={retencion.d30} />
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Qué hace la gente
          </p>
          <div className="mt-2 space-y-2">
            {eventos.map((e) => (
              <div
                key={e.type}
                className="flex items-center justify-between rounded-2xl bg-surface-primary px-4 py-3 shadow-sm ring-1 ring-border-default"
              >
                <span className="text-sm text-txt-primary">
                  {NOMBRE_EVENTO[e.type] ?? e.type}
                </span>
                <span className="font-display font-bold text-txt-primary">
                  {e.total}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
