"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import type { UsuarioAdmin } from "@/lib/admin/data";
import {
  cambiarEstadoUsuario,
  crearUsuarioManual,
  eliminarUsuario,
  reenviarAcceso,
} from "@/app/admin/(panel)/usuarios/actions";
import { IconUser, IconMail, IconCheck } from "@/components/app/icons";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BadgeEstado({ estado }: { estado: string }) {
  const estilos: Record<string, string> = {
    active: "bg-success/15 text-success",
    inactive: "bg-surface-tertiary text-txt-tertiary",
    refunded: "bg-error/15 text-error",
    cancelled: "bg-error/15 text-error",
  };
  const texto: Record<string, string> = {
    active: "Activo",
    inactive: "Inactivo",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        estilos[estado] ?? "bg-surface-tertiary text-txt-tertiary"
      }`}
    >
      {texto[estado] ?? estado}
    </span>
  );
}

function ModalAgregarUsuario({ onClose }: { onClose: () => void }) {
  const [estado, formAction, isPending] = useActionState(
    crearUsuarioManual,
    null
  );

  if (estado?.ok) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-5"
        style={{ backgroundColor: "var(--surface-overlay)" }}
      >
        <div className="w-full max-w-sm rounded-3xl bg-surface-primary p-6 text-center shadow-lg animate-pop-in">
          <span className="text-5xl mb-3 inline-block">✅</span>
          <p className="font-display font-bold text-lg text-txt-primary">
            Cuenta creada
          </p>
          <p className="mt-2 text-sm text-txt-secondary">
            Le enviamos su enlace de acceso por correo.
          </p>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-full bg-brand-primary text-txt-on-brand font-display font-bold py-3 btn-3d-primary transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-5 pb-8 sm:items-center"
      style={{ backgroundColor: "var(--surface-overlay)" }}
      onClick={onClose}
    >
      <form
        action={formAction}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-surface-primary p-6 shadow-lg animate-pop-in"
      >
        <p className="font-display font-bold text-lg text-txt-primary">
          Agregar usuario a mano
        </p>
        <p className="mt-1 text-sm text-txt-secondary">
          Crea una cuenta real y le manda su enlace de acceso por correo.
        </p>

        <label className="mt-5 block">
          <span className="text-xs font-bold text-txt-tertiary uppercase tracking-wide">
            Nombre
          </span>
          <input
            name="name"
            required
            placeholder="María Pérez"
            className="mt-1 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-bold text-txt-tertiary uppercase tracking-wide">
            Correo electrónico
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="maria@correo.com"
            className="mt-1 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-bold text-txt-tertiary uppercase tracking-wide">
            Plan
          </span>
          <select
            name="plan"
            defaultValue="completo"
            className="mt-1 w-full rounded-2xl border border-border-default bg-surface-secondary px-4 py-3 text-sm text-txt-primary focus:outline-none focus:border-brand-primary"
          >
            <option value="completo">Completo (pagó, pero le falló el acceso)</option>
            <option value="free">Gratis</option>
          </select>
        </label>

        {estado && !estado.ok && (
          <p className="mt-3 text-sm font-semibold text-error">{estado.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary disabled:opacity-50 text-txt-on-brand font-display font-bold py-3 btn-3d-primary transition-colors"
        >
          {isPending ? (
            <span className="h-4 w-4 rounded-full border-2 border-txt-on-brand/40 border-t-txt-on-brand animate-spin" />
          ) : (
            <IconMail className="h-4 w-4" />
          )}
          Crear cuenta y enviar acceso
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full text-center text-sm text-txt-secondary underline underline-offset-2 py-2"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export function UsuariosClient({ usuarios }: { usuarios: UsuarioAdmin[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const [avisoId, setAvisoId] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<UsuarioAdmin | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q)
    );
  }, [busqueda, usuarios]);

  function toggleEstado(u: UsuarioAdmin) {
    startTransition(async () => {
      await cambiarEstadoUsuario(
        u.id,
        u.status === "active" ? "inactive" : "active"
      );
    });
  }

  function reenviar(u: UsuarioAdmin) {
    startTransition(async () => {
      await reenviarAcceso(u.email);
      setAvisoId(u.id);
      setTimeout(() => setAvisoId(null), 3000);
    });
  }

  function confirmarEliminar() {
    if (!aEliminar) return;
    const objetivo = aEliminar;
    startTransition(async () => {
      await eliminarUsuario(objetivo.id);
      setAEliminar(null);
    });
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por correo o nombre..."
          className="w-full sm:max-w-xs rounded-full border border-border-default bg-surface-primary px-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary"
        />
        <button
          onClick={() => setModalAbierto(true)}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary text-txt-on-brand font-display font-bold text-sm px-5 py-2.5 btn-3d-primary transition-colors"
        >
          <IconUser className="h-4 w-4" />
          Agregar usuario
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-border-default bg-surface-secondary p-8 text-center">
          <p className="font-display font-bold text-txt-primary">
            Sin datos todavía
          </p>
          <p className="mt-1 text-sm text-txt-secondary max-w-sm mx-auto">
            Todavía nadie se registró de verdad. En cuanto tengas tu
            primera venta o agregues a alguien a mano, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border-default">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary text-left text-xs font-bold uppercase tracking-wide text-txt-tertiary">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Alta</th>
                <th className="px-4 py-3">Último acceso</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id} className="border-t border-border-default">
                  <td className="px-4 py-3 font-semibold text-txt-primary whitespace-nowrap">
                    {u.name ?? (
                      <span className="text-txt-tertiary font-normal">
                        Sin nombre
                      </span>
                    )}
                    {u.role === "admin" && (
                      <span className="ml-2 rounded-full bg-brand-secondary-soft px-2 py-0.5 text-xs font-bold text-brand-secondary">
                        admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-txt-secondary whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.plan === "completo" ? "Completo" : "Gratis"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <BadgeEstado estado={u.status} />
                  </td>
                  <td className="px-4 py-3 text-txt-tertiary whitespace-nowrap">
                    {formatFecha(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-txt-tertiary whitespace-nowrap">
                    {u.lastSignInAt ? formatFecha(u.lastSignInAt) : "Nunca"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        disabled={pendiente}
                        onClick={() => toggleEstado(u)}
                        className="text-xs font-semibold text-txt-secondary underline underline-offset-2 disabled:opacity-50"
                      >
                        {u.status === "active" ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        disabled={pendiente}
                        onClick={() => reenviar(u)}
                        className="text-xs font-semibold text-brand-primary underline underline-offset-2 disabled:opacity-50"
                      >
                        {avisoId === u.id ? (
                          <span className="inline-flex items-center gap-1 text-success">
                            <IconCheck className="h-3 w-3" /> Enviado
                          </span>
                        ) : (
                          "Reenviar acceso"
                        )}
                      </button>
                      {u.role !== "admin" && (
                        <button
                          disabled={pendiente}
                          onClick={() => setAEliminar(u)}
                          className="text-xs font-semibold text-error underline underline-offset-2 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-txt-tertiary"
                  >
                    Nadie coincide con “{busqueda}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <ModalAgregarUsuario onClose={() => setModalAbierto(false)} />
      )}

      {aEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-5 pb-8 sm:items-center"
          style={{ backgroundColor: "var(--surface-overlay)" }}
          onClick={() => setAEliminar(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-surface-primary p-6 text-center shadow-lg animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-5xl mb-3 inline-block">⚠️</span>
            <p className="font-display font-bold text-lg text-txt-primary">
              ¿Eliminar a {aEliminar.name ?? aEliminar.email}?
            </p>
            <p className="mt-2 text-sm text-txt-secondary">
              Se borra su cuenta, sus hijos registrados y todo su progreso
              para siempre. No se puede deshacer.
            </p>
            <p className="mt-3 rounded-2xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">
              Si esta persona ya pagó, va a perder el acceso por completo
              y tendría que comprar SuperErre de nuevo para volver a
              entrar — no queda ningún registro de que ya había pagado.
            </p>
            <button
              disabled={pendiente}
              onClick={confirmarEliminar}
              className="mt-5 w-full rounded-full bg-error disabled:opacity-50 text-txt-on-brand font-display font-bold py-3 transition-colors"
            >
              Sí, eliminar para siempre
            </button>
            <button
              disabled={pendiente}
              onClick={() => setAEliminar(null)}
              className="mt-2 w-full text-center text-sm text-txt-secondary underline underline-offset-2 py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
