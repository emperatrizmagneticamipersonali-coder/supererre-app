import { getErroresAgrupados, getErroresRecientes } from "@/lib/admin/data";

function formatFechaHora(iso: string) {
  return new Date(iso).toLocaleString("es", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminErroresPage() {
  const desde7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [agrupados, recientes] = await Promise.all([
    getErroresAgrupados(desde7dias),
    getErroresRecientes(30),
  ]);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Errores
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Lo que se rompió en la app, en español simple — lo más frecuente
        primero (eso es lo que más urge arreglar).
      </p>

      {agrupados.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border-default bg-surface-secondary p-8 text-center">
          <p className="font-display font-bold text-txt-primary">
            Sin errores en los últimos 7 días
          </p>
          <p className="mt-1 text-sm text-txt-secondary">
            Eso es bueno. Si algo se rompe, va a aparecer acá apenas pase.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Más frecuentes (últimos 7 días)
          </p>
          <div className="mt-2 space-y-2">
            {agrupados.map((e) => (
              <div
                key={e.message}
                className="flex items-center justify-between gap-4 rounded-2xl bg-surface-primary p-4 shadow-sm ring-1 ring-border-default"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-txt-primary truncate">
                    {e.message}
                  </p>
                  <p className="text-xs text-txt-tertiary">
                    Última vez: {formatFechaHora(e.ultimaVez)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-error/15 px-3 py-1 text-sm font-bold text-error">
                  {e.total}×
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Últimos 30 eventos
          </p>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-border-default">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary text-left text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                  <th className="px-4 py-3">Cuándo</th>
                  <th className="px-4 py-3">Mensaje</th>
                  <th className="px-4 py-3">Pantalla</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map((e) => (
                  <tr key={e.id} className="border-t border-border-default">
                    <td className="px-4 py-3 text-txt-tertiary whitespace-nowrap">
                      {formatFechaHora(e.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-txt-primary">
                      {e.message}
                    </td>
                    <td className="px-4 py-3 text-txt-secondary">
                      {e.context ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
