import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type UsuarioAdmin = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  plan: string;
  status: string;
  source: string | null;
  createdAt: string;
  lastSignInAt: string | null;
};

/** Lista de usuarios reales — cruza auth.users (email, fechas) con parents (rol/plan/estado).
 * Requiere el cliente admin porque auth.users no se lee por PostgREST/RLS normal. */
export async function getUsuarios(): Promise<UsuarioAdmin[]> {
  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (authError) throw authError;

  const { data: perfiles, error: perfilesError } = await admin
    .from("parents")
    .select("id, role, plan, status, name, source");
  if (perfilesError) throw perfilesError;

  const perfilPorId = new Map((perfiles ?? []).map((p) => [p.id, p]));

  return authData.users
    .map((u) => {
      const perfil = perfilPorId.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "(sin email)",
        name: perfil?.name ?? null,
        role: (perfil?.role as "user" | "admin") ?? "user",
        plan: perfil?.plan ?? "free",
        status: perfil?.status ?? "active",
        source: perfil?.source ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export type ResumenNegocio = {
  totalUsuarios: number;
  usuariosActivos: number;
  totalVentas: number;
  hayVentas: boolean;
  hayEventos: boolean;
  hayErrores: boolean;
  erroresUltimas24h: number;
};

/** Los números del banner de "Resumen" — cuenta lo que hay sin inventar nada. */
export async function getResumen(): Promise<ResumenNegocio> {
  const admin = createAdminClient();

  const [{ count: totalUsuarios }, { count: usuariosActivos }, { count: totalVentas }, { count: totalEventos }, { count: erroresUltimas24h }] =
    await Promise.all([
      admin.from("parents").select("id", { count: "exact", head: true }),
      admin
        .from("parents")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      admin
        .from("purchases")
        .select("id", { count: "exact", head: true })
        .eq("estado", "aprobado"),
      admin.from("event_log").select("id", { count: "exact", head: true }),
      admin
        .from("error_log")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

  return {
    totalUsuarios: totalUsuarios ?? 0,
    usuariosActivos: usuariosActivos ?? 0,
    totalVentas: totalVentas ?? 0,
    hayVentas: (totalVentas ?? 0) > 0,
    hayEventos: (totalEventos ?? 0) > 0,
    hayErrores: (erroresUltimas24h ?? 0) > 0,
    erroresUltimas24h: erroresUltimas24h ?? 0,
  };
}

export type EventoResumen = { type: string; total: number };

/** Conteo de eventos por tipo — la materia prima de activación/retención/uso. */
export async function getEventosPorTipo(desde: Date): Promise<EventoResumen[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("event_log")
    .select("type")
    .gte("created_at", desde.toISOString());
  if (error) throw error;

  const conteo = new Map<string, number>();
  for (const fila of data ?? []) {
    conteo.set(fila.type, (conteo.get(fila.type) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .map(([type, total]) => ({ type, total }))
    .sort((a, b) => b.total - a.total);
}

export type Aviso = { emoji: string; texto: string };

/** Avisos automáticos reales — solo dispara con datos que existen hoy (errores). Los
 * disparadores de ventas/IA/canal (21-BACKOFFICE) no aplican todavía: sin ventas ni
 * llamadas de IA no hay nada que medir, y "no aplica" no es lo mismo que "todo bien". */
export async function getAvisos(): Promise<Aviso[]> {
  const admin = createAdminClient();
  const avisos: Aviso[] = [];

  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: erroresRecientes } = await admin
    .from("error_log")
    .select("message")
    .gte("created_at", hace24h);

  if (erroresRecientes && erroresRecientes.length >= 5) {
    const porMensaje = new Map<string, number>();
    for (const e of erroresRecientes) {
      porMensaje.set(e.message, (porMensaje.get(e.message) ?? 0) + 1);
    }
    const [peorMensaje, veces] = [...porMensaje.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    avisos.push({
      emoji: "🐞",
      texto: `Hubo ${erroresRecientes.length} errores en las últimas 24 horas. El más repetido pasó ${veces} veces: "${peorMensaje}" — vale la pena revisarlo en la sección Errores.`,
    });
  }

  return avisos;
}

export type PuntoRetencion = { cohorte: number; retenidos: number } | null;

/** Retención D1/D7/D30 real, calculada por dispositivo (esta app todavía no tiene cuentas
 * reales de comprador — ver ESTADO.md). Un día de cohorte solo cuenta si ya pasó tiempo
 * suficiente para medirlo (si el primer usuario fue ayer, D30 todavía no se puede saber). */
export async function getRetencion(): Promise<{
  d1: PuntoRetencion;
  d7: PuntoRetencion;
  d30: PuntoRetencion;
}> {
  const admin = createAdminClient();
  const { data: activaciones } = await admin
    .from("event_log")
    .select("device_id, created_at")
    .eq("type", "onboarding_completado")
    .not("device_id", "is", null);
  const { data: sesiones } = await admin
    .from("event_log")
    .select("device_id, created_at")
    .eq("type", "sesion_iniciada")
    .not("device_id", "is", null);

  const diaISO = (iso: string) => iso.slice(0, 10);
  const sesionesPorDispositivo = new Map<string, Set<string>>();
  for (const s of sesiones ?? []) {
    if (!s.device_id) continue;
    const set = sesionesPorDispositivo.get(s.device_id) ?? new Set<string>();
    set.add(diaISO(s.created_at));
    sesionesPorDispositivo.set(s.device_id, set);
  }

  function calcular(diasDespues: number): PuntoRetencion {
    const ahora = Date.now();
    let cohorte = 0;
    let retenidos = 0;
    for (const a of activaciones ?? []) {
      if (!a.device_id) continue;
      const fechaAlta = new Date(diaISO(a.created_at) + "T00:00:00Z");
      const edadDias = (ahora - fechaAlta.getTime()) / (24 * 60 * 60 * 1000);
      if (edadDias < diasDespues) continue; // todavía no se puede medir este punto
      cohorte += 1;
      const objetivo = new Date(fechaAlta);
      objetivo.setUTCDate(objetivo.getUTCDate() + diasDespues);
      const diaObjetivo = diaISO(objetivo.toISOString());
      if (sesionesPorDispositivo.get(a.device_id)?.has(diaObjetivo)) {
        retenidos += 1;
      }
    }
    return cohorte > 0 ? { cohorte, retenidos } : null;
  }

  return { d1: calcular(1), d7: calcular(7), d30: calcular(30) };
}

export type VentasResumen = {
  totalAprobadas: number;
  totalPendientes: number;
  totalCanceladas: number;
  totalReembolsadas: number;
  ingresosPorMoneda: { currency: string; totalMinor: number }[];
};

/** Ventas reales (tabla purchases, hoy vacía porque el webhook de Hotmart no está
 * conectado). Nunca inventa un monto: si no hay filas con amount_minor, no hay ingreso. */
export async function getVentasResumen(): Promise<VentasResumen> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("purchases")
    .select("estado, amount_minor, currency");
  if (error) throw error;
  const filas = data ?? [];

  const porMoneda = new Map<string, number>();
  for (const f of filas) {
    if (f.estado === "aprobado" && f.amount_minor) {
      porMoneda.set(f.currency, (porMoneda.get(f.currency) ?? 0) + f.amount_minor);
    }
  }

  return {
    totalAprobadas: filas.filter((f) => f.estado === "aprobado").length,
    totalPendientes: filas.filter((f) => f.estado === "pendiente").length,
    totalCanceladas: filas.filter((f) => f.estado === "cancelado").length,
    totalReembolsadas: filas.filter((f) => f.estado === "reembolsado").length,
    ingresosPorMoneda: [...porMoneda.entries()].map(([currency, totalMinor]) => ({
      currency,
      totalMinor,
    })),
  };
}

export async function getGastoAdquisicionTotal(): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("acquisition_spend")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export type ErrorReciente = {
  id: string;
  message: string;
  context: string | null;
  createdAt: string;
};

export type ErrorAgrupado = {
  message: string;
  total: number;
  ultimaVez: string;
};

export async function getErroresRecientes(limite = 20): Promise<ErrorReciente[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("error_log")
    .select("id, message, context, created_at")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return (data ?? []).map((e) => ({
    id: e.id,
    message: e.message,
    context: e.context,
    createdAt: e.created_at,
  }));
}

export async function getErroresAgrupados(desde: Date): Promise<ErrorAgrupado[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("error_log")
    .select("message, created_at")
    .gte("created_at", desde.toISOString());
  if (error) throw error;

  const grupos = new Map<string, { total: number; ultimaVez: string }>();
  for (const fila of data ?? []) {
    const actual = grupos.get(fila.message);
    if (!actual) {
      grupos.set(fila.message, { total: 1, ultimaVez: fila.created_at });
    } else {
      actual.total += 1;
      if (fila.created_at > actual.ultimaVez) actual.ultimaVez = fila.created_at;
    }
  }
  return [...grupos.entries()]
    .map(([message, v]) => ({ message, ...v }))
    .sort((a, b) => b.total - a.total);
}
