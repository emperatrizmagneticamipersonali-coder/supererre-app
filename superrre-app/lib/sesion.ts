import type { Progreso } from "./progress";
import { TODAS_LAS_PRAXIAS } from "./praxias-data";
import { MODOS } from "./sonidos-data";
import { ESCALERA_POR_LETRA } from "./escalera-data";

export type PasoSesion = {
  tipo: "praxia" | "sonido" | "escalera-r" | "escalera-l";
  id: string;
  href: string;
  completo: boolean;
  desbloqueado: boolean;
};

/** Lista plana de TODOS los ejercicios de pronunciación (Praxias, Sonidos,
 * Escalera R y Escalera L) en el mismo orden y con el mismo desbloqueo
 * secuencial que ya usa el Mapa de Islas — la sesión continua no inventa un
 * orden nuevo. No incluye el Memorama (es un juego de memoria suelto, no un
 * ejercicio de pronunciación con cronómetro que tenga sentido encadenar). */
export function pasosDeSesion(
  p: Progreso,
  tema: "leon" | "pirata"
): PasoSesion[] {
  const modo = MODOS[tema];

  type Crudo = Omit<PasoSesion, "desbloqueado"> & { requierePlanCompleto: boolean };

  const praxias: Crudo[] = TODAS_LAS_PRAXIAS.map((ex) => ({
    tipo: "praxia",
    id: ex.id,
    href: `/app/praxias?ex=${ex.id}`,
    completo: p.praxiasHechas.includes(ex.id),
    requierePlanCompleto: false,
  }));

  const sonidos: Crudo[] = modo.sonidos.map((s) => ({
    tipo: "sonido",
    id: s.id,
    href: `/app/sonidos?ex=${s.id}`,
    completo: p.sonidosHechos.includes(`${tema}-${s.id}`),
    requierePlanCompleto: false,
  }));

  const escaleraR: Crudo[] = ESCALERA_POR_LETRA.R.flatMap((grupo) =>
    grupo.niveles.map((nivel) => ({
      tipo: "escalera-r" as const,
      id: nivel.id,
      href: `/app/escalera?ex=${nivel.id}`,
      completo: p.palabrasHechas.includes(nivel.id),
      requierePlanCompleto: grupo.silaba !== "RA",
    }))
  );

  const escaleraL: Crudo[] = ESCALERA_POR_LETRA.L.flatMap((grupo) =>
    grupo.niveles.map((nivel) => ({
      tipo: "escalera-l" as const,
      id: nivel.id,
      href: `/app/escalera-l?ex=${nivel.id}`,
      completo: p.palabrasHechas.includes(nivel.id),
      requierePlanCompleto: true,
    }))
  );

  const todos = [...praxias, ...sonidos, ...escaleraR, ...escaleraL];

  let previoCompleto = true;
  return todos.map((paso) => {
    const gateOk = !paso.requierePlanCompleto || p.plan === "completo";
    const desbloqueado = previoCompleto && gateOk;
    previoCompleto = paso.completo;
    return {
      tipo: paso.tipo,
      id: paso.id,
      href: paso.href,
      completo: paso.completo,
      desbloqueado,
    };
  });
}

/** El siguiente ejercicio pendiente después de (tipo, id) — o null si no
 * queda ninguno desbloqueado sin hacer (se acabó la secuencia por hoy). */
export function siguientePasoSesion(
  p: Progreso,
  tema: "leon" | "pirata",
  tipoActual: PasoSesion["tipo"],
  idActual: string
): PasoSesion | null {
  const pasos = pasosDeSesion(p, tema);
  const idx = pasos.findIndex((x) => x.tipo === tipoActual && x.id === idActual);
  if (idx === -1) return null;
  for (let i = idx + 1; i < pasos.length; i++) {
    if (pasos[i].desbloqueado && !pasos[i].completo) return pasos[i];
  }
  return null;
}
