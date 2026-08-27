import type { Progreso } from "./progress";
import { TODAS_LAS_PRAXIAS } from "./praxias-data";
import { letraCompleta } from "./escalera-data";

export type Accesorio = {
  id: string;
  nombre: string;
  /** emoji de respaldo (aria-label, y render real de los de la tienda) */
  emoji: string;
  /** ilustración real en /public/accesorios, fondo ya recortado — solo los
   * 4 premios de logro la tienen; los de la tienda usan emoji */
  imagen?: string;
  /** posición del CENTRO del accesorio sobre el retrato (% del contenedor) */
  top: number;
  left: number;
  /** ancho en px si usa imagen (retrato de referencia de 200px) */
  ancho?: number;
  /** tamaño de fuente en px si usa emoji */
  tamaño?: number;
  /** premio de logro: se gana solo al completar una sección entera */
  lograda?: (p: Progreso) => boolean;
  /** accesorio de tienda: se compra con monedas ganadas ejercicio a ejercicio */
  precio?: number;
};

/** 4 accesorios "de vestir" premio de logro — uno por cada sección completa
 * entera, el premio grande y esporádico (a diferencia de las figuritas, que
 * son chicas y frecuentes, y de los de la tienda, que se compran de a poco). */
export const ACCESORIOS: Accesorio[] = [
  {
    id: "sombrero",
    nombre: "Sombrero de Explorador",
    emoji: "🤠",
    imagen: "/accesorios/sombrero.png",
    // top/left/ancho calibrados por el USUARIO en vivo, en su celular real,
    // con el modo /app/premios?calibrar=1 (sliders + captura de pantalla
    // confirmando el resultado) — a diferencia de los 3 intentos previos
    // (estimados a ciegas desde video), este valor SÍ está verificado
    // visualmente, solo que por el usuario en vez de por este entorno.
    top: 0,
    left: 25,
    ancho: 88,
    lograda: (p) =>
      TODAS_LAS_PRAXIAS.every((ex) => p.praxiasHechas.includes(ex.id)),
    // también se puede comprar directo con monedas, sin esperar a lograrlo
    precio: 150,
  },
  {
    id: "gafas",
    nombre: "Gafas de Sol",
    emoji: "🕶️",
    imagen: "/accesorios/gafas.png",
    top: 38,
    left: 50,
    ancho: 95,
    lograda: (p) =>
      ["rugido", "ronroneo", "rugido-rey", "gruñido"].every((id) =>
        p.sonidosHechos.includes(`leon-${id}`)
      ),
    precio: 180,
  },
  {
    id: "capa",
    nombre: "Capa Dorada",
    emoji: "🧣",
    imagen: "/accesorios/capa.png",
    top: 68,
    left: 50,
    ancho: 130,
    lograda: (p) => letraCompleta("R", p.palabrasHechas),
    precio: 250,
  },
  {
    id: "corona",
    nombre: "Corona",
    emoji: "👑",
    imagen: "/accesorios/corona.png",
    top: 2,
    left: 50,
    ancho: 95,
    lograda: (p) => letraCompleta("L", p.palabrasHechas),
    precio: 300,
  },
];

/** 6 accesorios de tienda — se compran con monedas (1 por cada ejercicio
 * distinto completado, ver progress.ts). Sin arte a medida todavía, usan
 * emoji — se pueden reemplazar por ilustraciones reales más adelante. */
export const ACCESORIOS_TIENDA: Accesorio[] = [
  {
    id: "moño",
    nombre: "Moño",
    emoji: "🎀",
    top: 30,
    left: 68,
    tamaño: 26,
    precio: 50,
  },
  {
    id: "guantes",
    nombre: "Guantes",
    emoji: "🧤",
    top: 72,
    left: 50,
    tamaño: 26,
    precio: 80,
  },
  {
    id: "gorra",
    nombre: "Gorra",
    emoji: "🧢",
    top: 4,
    left: 50,
    tamaño: 32,
    precio: 80,
  },
  {
    id: "anteojos",
    nombre: "Anteojos Redondos",
    emoji: "🥽",
    top: 36,
    left: 50,
    tamaño: 28,
    precio: 100,
  },
  {
    id: "collar",
    nombre: "Collar",
    emoji: "📿",
    top: 58,
    left: 50,
    tamaño: 28,
    precio: 120,
  },
  {
    id: "chaleco",
    nombre: "Chaleco",
    emoji: "🦺",
    top: 55,
    left: 50,
    tamaño: 42,
    precio: 150,
  },
];

/** Todos los accesorios que existen, logro + tienda — útil para buscar por id. */
export const TODOS_LOS_ACCESORIOS: Accesorio[] = [
  ...ACCESORIOS,
  ...ACCESORIOS_TIENDA,
];

export function accesorioPorId(id: string): Accesorio | undefined {
  return TODOS_LOS_ACCESORIOS.find((a) => a.id === id);
}

/** true si ya lo tiene, sin importar el camino: lo logró completando una
 * sección, o lo compró con monedas (sombrero/gafas/capa/corona admiten los
 * dos caminos; los de la tienda solo se compran). */
export function accesorioDesbloqueado(a: Accesorio, p: Progreso): boolean {
  if (a.lograda && a.lograda(p)) return true;
  if (p.accesoriosComprados.includes(a.id)) return true;
  return false;
}

/** Los 4 premios de logro que el niño ya tiene disponibles (logrados o comprados). */
export function accesoriosLogrados(p: Progreso): Accesorio[] {
  return ACCESORIOS.filter((a) => accesorioDesbloqueado(a, p));
}

export function accesoriosComprados(p: Progreso): Accesorio[] {
  return ACCESORIOS_TIENDA.filter((a) => p.accesoriosComprados.includes(a.id));
}

/** Todo lo que el niño ya tiene disponible para ponerse — logrado o comprado. */
export function accesoriosDisponibles(p: Progreso): Accesorio[] {
  return TODOS_LOS_ACCESORIOS.filter((a) => accesorioDesbloqueado(a, p));
}

/** Todo lo que se puede comprar en la tienda con monedas — incluye los 4
 * premios de logro (para que el niño los vea y quiera juntar monedas para
 * ellos, aunque también se puedan ganar completando una sección) y los 6
 * de la tienda chica. */
export const ACCESORIOS_COMPRABLES: Accesorio[] = [
  ...ACCESORIOS,
  ...ACCESORIOS_TIENDA,
];
