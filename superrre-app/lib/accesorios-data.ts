import type { Progreso } from "./progress";
import { TODAS_LAS_PRAXIAS } from "./praxias-data";
import { letraCompleta } from "./escalera-data";

export type Accesorio = {
  id: string;
  nombre: string;
  emoji: string;
  /** posición aproximada sobre el retrato del personaje (en % del tamaño) */
  top: number;
  left: number;
  tamaño: number;
  lograda: (p: Progreso) => boolean;
};

/** 4 accesorios "de vestir" — uno por cada sección completa entera, el
 * premio grande y esporádico (a diferencia de las figuritas, que son
 * chicas y frecuentes). */
export const ACCESORIOS: Accesorio[] = [
  {
    id: "sombrero",
    nombre: "Sombrero de Explorador",
    emoji: "🤠",
    top: 2,
    left: 50,
    tamaño: 34,
    lograda: (p) =>
      TODAS_LAS_PRAXIAS.every((ex) => p.praxiasHechas.includes(ex.id)),
  },
  {
    id: "gafas",
    nombre: "Gafas de Sol",
    emoji: "🕶️",
    top: 34,
    left: 50,
    tamaño: 30,
    lograda: (p) =>
      ["rugido", "ronroneo", "rugido-rey", "gruñido"].every((id) =>
        p.sonidosHechos.includes(`leon-${id}`)
      ),
  },
  {
    id: "capa",
    nombre: "Capa Dorada",
    emoji: "🧣",
    top: 62,
    left: 50,
    tamaño: 40,
    lograda: (p) => letraCompleta("R", p.palabrasHechas),
  },
  {
    id: "corona",
    nombre: "Corona",
    emoji: "👑",
    top: -6,
    left: 50,
    tamaño: 32,
    lograda: (p) => letraCompleta("L", p.palabrasHechas),
  },
];

export function accesoriosLogrados(p: Progreso): Accesorio[] {
  return ACCESORIOS.filter((a) => a.lograda(p));
}
