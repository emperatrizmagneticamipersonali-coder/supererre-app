import type { Progreso } from "./progress";
import { gruposDe } from "./escalera-data";
import { TODAS_LAS_PRAXIAS, NIVELES_PRAXIAS } from "./praxias-data";

export type Figurita = {
  id: string;
  nombre: string;
  emoji: string;
  /** true si esta figurita ya está desbloqueada con el progreso actual */
  lograda: (p: Progreso) => boolean;
};

function praxiaNivelCompleto(p: Progreso, nivelIndex: number): boolean {
  return NIVELES_PRAXIAS[nivelIndex].praxias.every((ex) =>
    p.praxiasHechas.includes(ex.id)
  );
}

function escaleraPeldañoCompleto(
  p: Progreso,
  letra: "R" | "L",
  silaba: string
): boolean {
  const grupo = gruposDe(letra).find((g) => g.silaba === silaba);
  if (!grupo) return false;
  return grupo.niveles.every((n) => p.palabrasHechas.includes(n.id));
}

/** 14 figuritas coleccionables — una por cada fase de la app. Cada una usa
 * el emoji del propio ejercicio/palabra que el niño ya practicó, para que
 * el premio se sienta ligado a lo que aprendió, no genérico. */
export const FIGURITAS: Figurita[] = [
  {
    id: "praxias-calentamiento",
    nombre: "Calentamiento",
    emoji: "🥉",
    lograda: (p) => praxiaNivelCompleto(p, 0),
  },
  {
    id: "praxias-fuerza",
    nombre: "Fuerza y Puntería",
    emoji: "🎯",
    lograda: (p) => praxiaNivelCompleto(p, 1),
  },
  {
    id: "praxias-casi-listos",
    nombre: "Casi Listos para la R",
    emoji: "🥇",
    lograda: (p) => praxiaNivelCompleto(p, 2),
  },
  {
    id: "sonidos-leon",
    nombre: "Rugidos del León",
    emoji: "🎤",
    lograda: (p) =>
      ["rugido", "ronroneo", "rugido-rey", "gruñido"].every((id) =>
        p.sonidosHechos.includes(`leon-${id}`)
      ),
  },
  {
    id: "escalera-ra",
    nombre: "Peldaño RA",
    emoji: "🎸",
    lograda: (p) => escaleraPeldañoCompleto(p, "R", "RA"),
  },
  {
    id: "escalera-re",
    nombre: "Peldaño RE",
    emoji: "🐶",
    lograda: (p) => escaleraPeldañoCompleto(p, "R", "RE"),
  },
  {
    id: "escalera-ri",
    nombre: "Peldaño RI",
    emoji: "😄",
    lograda: (p) => escaleraPeldañoCompleto(p, "R", "RI"),
  },
  {
    id: "escalera-ro",
    nombre: "Peldaño RO",
    emoji: "🚂",
    lograda: (p) => escaleraPeldañoCompleto(p, "R", "RO"),
  },
  {
    id: "escalera-ru",
    nombre: "Peldaño RU",
    emoji: "🛞",
    lograda: (p) => escaleraPeldañoCompleto(p, "R", "RU"),
  },
  {
    id: "escalera-la",
    nombre: "Peldaño LA",
    emoji: "✏️",
    lograda: (p) => escaleraPeldañoCompleto(p, "L", "LA"),
  },
  {
    id: "escalera-le",
    nombre: "Peldaño LE",
    emoji: "🥛",
    lograda: (p) => escaleraPeldañoCompleto(p, "L", "LE"),
  },
  {
    id: "escalera-li",
    nombre: "Peldaño LI",
    emoji: "📖",
    lograda: (p) => escaleraPeldañoCompleto(p, "L", "LI"),
  },
  {
    id: "escalera-lo",
    nombre: "Peldaño LO",
    emoji: "🦜",
    lograda: (p) => escaleraPeldañoCompleto(p, "L", "LO"),
  },
  {
    id: "escalera-lu",
    nombre: "Peldaño LU",
    emoji: "🌙",
    lograda: (p) => escaleraPeldañoCompleto(p, "L", "LU"),
  },
];

export function figuritasLogradas(p: Progreso): Figurita[] {
  return FIGURITAS.filter((f) => f.lograda(p));
}

export function totalPraxias(): number {
  return TODAS_LAS_PRAXIAS.length;
}
