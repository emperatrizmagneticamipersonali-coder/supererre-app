import type { Progreso } from "./progress";
import { TODAS_LAS_PRAXIAS } from "./praxias-data";
import { letraCompleta } from "./escalera-data";

export type Accesorio = {
  id: string;
  nombre: string;
  /** emoji de respaldo (aria-label / grid mientras no hay imagen) */
  emoji: string;
  /** ilustración real en /public/accesorios, fondo ya recortado */
  imagen: string;
  /** posición del CENTRO de la imagen sobre el retrato (% del contenedor) */
  top: number;
  left: number;
  /** ancho de la imagen en px, sobre un retrato de referencia de 200px */
  ancho: number;
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
    imagen: "/accesorios/sombrero.png",
    top: 8,
    left: 50,
    ancho: 120,
    lograda: (p) =>
      TODAS_LAS_PRAXIAS.every((ex) => p.praxiasHechas.includes(ex.id)),
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
  },
];

export function accesoriosLogrados(p: Progreso): Accesorio[] {
  return ACCESORIOS.filter((a) => a.lograda(p));
}
