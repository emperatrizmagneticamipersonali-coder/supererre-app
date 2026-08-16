export type TipoNivel = "silaba" | "palabra" | "oracion";

export type NivelEscalera = {
  id: string;
  tipo: TipoNivel;
  texto: string;
};

export type GrupoEscalera = {
  silaba: string;
  niveles: NivelEscalera[];
};

/**
 * Progresión fonética por letra. "R" es la letra base de la app; "L" se
 * desbloquea al dominar la R (ver `letraCompleta`). Para sumar una letra
 * nueva más adelante, solo hay que agregar otra entrada con la misma forma.
 */
export const ESCALERA_POR_LETRA: Record<string, GrupoEscalera[]> = {
  R: [
    {
      silaba: "RA",
      niveles: [
        { id: "RA-0", tipo: "silaba", texto: "RA - RA - RA" },
        { id: "RA-1", tipo: "palabra", texto: "guitarra" },
        { id: "RA-2", tipo: "oracion", texto: "Toco la guitarra" },
      ],
    },
    {
      silaba: "RE",
      niveles: [
        { id: "RE-0", tipo: "silaba", texto: "RE - RE - RE" },
        { id: "RE-1", tipo: "palabra", texto: "perro" },
        { id: "RE-2", tipo: "oracion", texto: "Mi perro corre rápido" },
      ],
    },
    {
      silaba: "RI",
      niveles: [
        { id: "RI-0", tipo: "silaba", texto: "RI - RI - RI" },
        { id: "RI-1", tipo: "palabra", texto: "risa" },
        { id: "RI-2", tipo: "oracion", texto: "Me da mucha risa" },
      ],
    },
    {
      silaba: "RO",
      niveles: [
        { id: "RO-0", tipo: "silaba", texto: "RO - RO - RO" },
        { id: "RO-1", tipo: "palabra", texto: "ferrocarril" },
        { id: "RO-2", tipo: "oracion", texto: "El ferrocarril es largo" },
      ],
    },
    {
      silaba: "RU",
      niveles: [
        { id: "RU-0", tipo: "silaba", texto: "RU - RU - RU" },
        { id: "RU-1", tipo: "palabra", texto: "rueda" },
        { id: "RU-2", tipo: "oracion", texto: "El carro tiene una rueda" },
      ],
    },
  ],
  L: [
    {
      silaba: "LA",
      niveles: [
        { id: "LA-0", tipo: "silaba", texto: "LA - LA - LA" },
        { id: "LA-1", tipo: "palabra", texto: "lápiz" },
        { id: "LA-2", tipo: "oracion", texto: "Mi lápiz es azul" },
      ],
    },
    {
      silaba: "LE",
      niveles: [
        { id: "LE-0", tipo: "silaba", texto: "LE - LE - LE" },
        { id: "LE-1", tipo: "palabra", texto: "leche" },
        { id: "LE-2", tipo: "oracion", texto: "Me gusta la leche" },
      ],
    },
    {
      silaba: "LI",
      niveles: [
        { id: "LI-0", tipo: "silaba", texto: "LI - LI - LI" },
        { id: "LI-1", tipo: "palabra", texto: "libro" },
        { id: "LI-2", tipo: "oracion", texto: "Leo mi libro favorito" },
      ],
    },
    {
      silaba: "LO",
      niveles: [
        { id: "LO-0", tipo: "silaba", texto: "LO - LO - LO" },
        { id: "LO-1", tipo: "palabra", texto: "loro" },
        { id: "LO-2", tipo: "oracion", texto: "El loro habla mucho" },
      ],
    },
    {
      silaba: "LU",
      niveles: [
        { id: "LU-0", tipo: "silaba", texto: "LU - LU - LU" },
        { id: "LU-1", tipo: "palabra", texto: "luna" },
        { id: "LU-2", tipo: "oracion", texto: "La luna brilla de noche" },
      ],
    },
  ],
};

export function gruposDe(letra: string): GrupoEscalera[] {
  return ESCALERA_POR_LETRA[letra] ?? [];
}

export function totalNivelesDe(letra: string): number {
  return gruposDe(letra).reduce((suma, grupo) => suma + grupo.niveles.length, 0);
}

export function nivelesHechosDe(letra: string, palabrasHechas: string[]): number {
  const ids = new Set(gruposDe(letra).flatMap((g) => g.niveles.map((n) => n.id)));
  return palabrasHechas.filter((id) => ids.has(id)).length;
}

export function letraCompleta(letra: string, palabrasHechas: string[]): boolean {
  const total = totalNivelesDe(letra);
  return total > 0 && nivelesHechosDe(letra, palabrasHechas) === total;
}

/** @deprecated usar totalNivelesDe("R") — se mantiene por compatibilidad */
export const TOTAL_NIVELES_ESCALERA = totalNivelesDe("R");

export function nivelPorId(id: string): NivelEscalera | undefined {
  for (const grupos of Object.values(ESCALERA_POR_LETRA)) {
    for (const grupo of grupos) {
      const encontrado = grupo.niveles.find((n) => n.id === id);
      if (encontrado) return encontrado;
    }
  }
  return undefined;
}

export const INSTRUCCION_POR_TIPO: Record<TipoNivel, string> = {
  silaba: "Repite en voz alta",
  palabra: "Di la palabra fuerte",
  oracion: "Di la oración completa",
};
