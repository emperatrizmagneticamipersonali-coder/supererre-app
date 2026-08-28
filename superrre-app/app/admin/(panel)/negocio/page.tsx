import { getGastoAdquisicionTotal, getVentasResumen } from "@/lib/admin/data";

export default async function AdminNegocioPage() {
  const [resumen, gastosCargados] = await Promise.all([
    getVentasResumen(),
    getGastoAdquisicionTotal(),
  ]);
  const hayVentas = resumen.totalAprobadas > 0;

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Negocio
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        LTV, CAC y qué canal de verdad te conviene.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            LTV (valor de un cliente)
          </p>
          <p className="mt-2 font-display font-extrabold text-2xl text-txt-tertiary">
            Sin datos
          </p>
        </div>
        <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            CAC (costo de conseguir uno)
          </p>
          <p className="mt-2 font-display font-extrabold text-2xl text-txt-tertiary">
            Sin datos
          </p>
        </div>
        <div className="rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            LTV : CAC
          </p>
          <p className="mt-2 font-display font-extrabold text-2xl text-txt-tertiary">
            Sin datos
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-dashed border-border-default bg-surface-secondary p-6">
        <p className="text-sm text-txt-secondary leading-relaxed">
          {!hayVentas
            ? "Para calcular esto hacen falta ventas reales (churn y precio) y, si haces publicidad, cuánto gastas por canal. Ninguno de los dos existe todavía."
            : gastosCargados === 0
            ? "Ya hay ventas, pero todavía no cargaste ningún gasto de adquisición (ads, afiliados) — sin eso no se puede calcular el CAC."
            : "Ya hay ventas y gasto cargado — esta sección va a mostrar los números reales apenas haya suficiente historial (al menos unas semanas) para que el cálculo tenga sentido."}
        </p>
      </div>
    </div>
  );
}
