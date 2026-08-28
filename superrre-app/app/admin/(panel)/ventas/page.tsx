import { getVentasResumen } from "@/lib/admin/data";

function formatMonto(minor: number, currency: string) {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(
    minor / 100
  );
}

export default async function AdminVentasPage() {
  const resumen = await getVentasResumen();
  const hayIngresos = resumen.ingresosPorMoneda.length > 0;
  const hayComprasDeAlgunTipo =
    resumen.totalAprobadas +
      resumen.totalPendientes +
      resumen.totalCanceladas +
      resumen.totalReembolsadas >
    0;

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Ventas y Suscripciones
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Ingresos, compras, cancelaciones y churn.
      </p>

      {!hayComprasDeAlgunTipo && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border-default bg-surface-secondary p-8 text-center">
          <p className="font-display font-bold text-txt-primary">
            Sin datos todavía
          </p>
          <p className="mt-2 text-sm text-txt-secondary max-w-md mx-auto leading-relaxed">
            Todavía no hay ninguna venta real registrada porque el aviso
            automático de Hotmart (el webhook) no está conectado. Esta
            pantalla y sus cuentas ya están listas — el día que se
            conecte Hotmart, se llenan solas, sin tocar nada más.
          </p>
        </div>
      )}

      {hayComprasDeAlgunTipo && (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
              <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                Ingresos
              </p>
              {hayIngresos ? (
                resumen.ingresosPorMoneda.map((m) => (
                  <p
                    key={m.currency}
                    className="mt-2 font-display font-extrabold text-2xl text-txt-primary"
                  >
                    {formatMonto(m.totalMinor, m.currency)}
                  </p>
                ))
              ) : (
                <p className="mt-2 font-display font-extrabold text-2xl text-txt-tertiary">
                  Sin datos
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
              <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                Compras aprobadas
              </p>
              <p className="mt-2 font-display font-extrabold text-2xl text-txt-primary">
                {resumen.totalAprobadas}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
              <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                Canceladas (churn voluntario)
              </p>
              <p className="mt-2 font-display font-extrabold text-2xl text-txt-primary">
                {resumen.totalCanceladas}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
              <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                Reembolsadas
              </p>
              <p className="mt-2 font-display font-extrabold text-2xl text-txt-primary">
                {resumen.totalReembolsadas}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-txt-tertiary">
            Nota: distinguir churn voluntario de involuntario (pago
            fallido) con precisión requiere los estados reales que manda
            Hotmart — por ahora "Canceladas" agrupa ambos casos.
          </p>
        </>
      )}

      <p className="mt-10 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
        Ganancia real
      </p>
      <div className="mt-2 rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
        {hayIngresos ? (
          <p className="text-sm text-txt-secondary">
            Todavía falta cargar tus costos (comisión de Hotmart,
            afiliados, impuestos, infra, email) para calcular lo que de
            verdad te queda limpio.
          </p>
        ) : (
          <p className="text-sm text-txt-secondary">
            "Facturaste $X y te quedaron $Y limpios" — esta cuenta
            necesita que primero haya ingresos reales. Sin datos
            todavía.
          </p>
        )}
      </div>
    </div>
  );
}
