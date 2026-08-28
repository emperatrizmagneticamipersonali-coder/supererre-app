import Link from "next/link";
import { getResumen, getAvisos } from "@/lib/admin/data";
import { AvisoBanner } from "@/components/admin/AvisoBanner";

function Tarjeta({
  titulo,
  valor,
  nota,
  href,
}: {
  titulo: string;
  valor: string;
  nota: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-surface-primary p-5 shadow-sm ring-1 ring-border-default transition-transform active:scale-[0.98]"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary">
        {titulo}
      </p>
      <p className="mt-2 font-display font-extrabold text-3xl text-txt-primary">
        {valor}
      </p>
      <p className="mt-1 text-sm text-txt-secondary">{nota}</p>
    </Link>
  );
}

export default async function AdminResumenPage() {
  const [resumen, avisos] = await Promise.all([getResumen(), getAvisos()]);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Resumen
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Lo más importante de tu app, de un vistazo.
      </p>

      <div className="mt-5">
        <AvisoBanner avisos={avisos} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tarjeta
          titulo="Usuarios totales"
          valor={String(resumen.totalUsuarios)}
          nota={
            resumen.totalUsuarios === 0
              ? "Sin datos todavía"
              : `${resumen.usuariosActivos} activos`
          }
          href="/admin/usuarios"
        />
        <Tarjeta
          titulo="Ventas aprobadas"
          valor={resumen.hayVentas ? String(resumen.totalVentas) : "—"}
          nota={
            resumen.hayVentas
              ? "Ver detalle en Ventas"
              : "Sin datos todavía — falta conectar Hotmart"
          }
          href="/admin/ventas"
        />
        <Tarjeta
          titulo="Actividad registrada"
          valor={resumen.hayEventos ? "Sí" : "—"}
          nota={
            resumen.hayEventos
              ? "Ver el detalle en Uso"
              : "Sin datos todavía"
          }
          href="/admin/uso"
        />
        <Tarjeta
          titulo="Errores (24h)"
          valor={String(resumen.erroresUltimas24h)}
          nota={
            resumen.hayErrores ? "Ver el detalle" : "Ninguno reportado"
          }
          href="/admin/errores"
        />
      </div>
    </div>
  );
}
