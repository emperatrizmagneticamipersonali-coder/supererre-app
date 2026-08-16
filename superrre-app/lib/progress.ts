"use client";

import { useSyncExternalStore } from "react";

export type Plan = "free" | "completo";

export type Progreso = {
  nombre: string;
  plan: Plan;
  interes: "leon" | "pirata" | "";
  /** edad del niño en años (4-7), recogida en el onboarding */
  edad: number;
  estrellas: number;
  praxiasHechas: string[];
  sonidosHechos: string[];
  /** ids de niveles de la Escalera Fonética completados, ej. "RA-0" */
  palabrasHechas: string[];
  /** fechas (YYYY-MM-DD, hora local) en las que el niño practicó al menos un ejercicio */
  diasActivos: string[];
  /** letras (ej. "R", "L") con las que ya ganó el memorama al menos una vez */
  memoramasGanados: string[];
  /** ids de figuritas cuya revelación (cofre) ya se le mostró al niño */
  figuritasVistas: string[];
  /** ids de accesorios cuya revelación ya se le mostró al niño */
  accesoriosVistos: string[];
  /** id del accesorio que el niño eligió ponerle al personaje ahora mismo */
  accesorioEquipado: string | null;
};

const KEY = "supererre_progreso";

const DEFAULT_PROGRESO: Progreso = {
  nombre: "",
  plan: "free",
  interes: "",
  edad: 5,
  estrellas: 1, // la estrella del onboarding ya está guardada
  praxiasHechas: [],
  sonidosHechos: [],
  palabrasHechas: [],
  diasActivos: [],
  memoramasGanados: [],
  figuritasVistas: [],
  accesoriosVistos: [],
  accesorioEquipado: null,
};

function isoLocal(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function hoyISO(): string {
  return isoLocal(new Date());
}

// "YYYY-MM-DD" parseado como fecha LOCAL — new Date(isoString) lo parsea como
// UTC y desalinea los getters locales (getDate/getMonth) en husos horarios
// negativos, corriendo la racha un día. Por eso todo el módulo pasa por aquí.
function analizarISOLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function diaAnteriorISO(iso: string): string {
  const d = analizarISOLocal(iso);
  d.setDate(d.getDate() - 1);
  return isoLocal(d);
}

function registrarActividadHoy(p: Progreso) {
  const hoy = hoyISO();
  if (!p.diasActivos.includes(hoy)) {
    p.diasActivos.push(hoy);
  }
}

export function leerProgreso(): Progreso {
  if (typeof window === "undefined") return DEFAULT_PROGRESO;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESO;
    return { ...DEFAULT_PROGRESO, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESO;
  }
}

function guardar(p: Progreso) {
  window.localStorage.setItem(KEY, JSON.stringify(p));
  cache = null;
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getServerSnapshot(): Progreso {
  return DEFAULT_PROGRESO;
}

// useSyncExternalStore exige que getSnapshot devuelva la MISMA referencia
// si nada cambió — leerProgreso() sola crea un objeto nuevo cada vez (bucle infinito).
let cache: Progreso | null = null;
function getSnapshot(): Progreso {
  if (cache === null) cache = leerProgreso();
  return cache;
}

/** Lee el progreso guardado y se re-renderiza cuando cambia (localStorage, 100% local). */
export function useProgreso(): Progreso {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function iniciarProgreso(datos: {
  nombre: string;
  plan: Plan;
  interes?: "leon" | "pirata" | "";
  edad?: number;
}) {
  const actual = leerProgreso();
  guardar({
    ...actual,
    nombre: datos.nombre || actual.nombre,
    plan: datos.plan,
    interes: datos.interes ?? actual.interes,
    edad: datos.edad || actual.edad,
  });
}

/** Plan diario recomendado según edad — sesiones cortas (criterio de
 * fonoaudiología: a esta edad rinde más la constancia diaria en pocos
 * minutos que una sola sesión larga). Se decide con este criterio, no
 * hace falta que el padre/madre elija los números. */
export function planDiarioPorEdad(edad: number): {
  minutos: number;
  texto: string;
} {
  if (edad <= 4) return { minutos: 5, texto: "5 minutos al día" };
  if (edad === 5) return { minutos: 6, texto: "6 minutos al día" };
  if (edad === 6) return { minutos: 8, texto: "8 minutos al día" };
  return { minutos: 10, texto: "10 minutos al día" };
}

export function marcarPraxiaHecha(id: string) {
  const p = leerProgreso();
  if (!p.praxiasHechas.includes(id)) {
    p.praxiasHechas.push(id);
    p.estrellas += 1;
  }
  registrarActividadHoy(p);
  guardar(p);
  return p;
}

export function marcarSonidoHecho(id: string) {
  const p = leerProgreso();
  if (!p.sonidosHechos.includes(id)) {
    p.sonidosHechos.push(id);
    p.estrellas += 1;
  }
  registrarActividadHoy(p);
  guardar(p);
  return p;
}

export function marcarNivelEscaleraHecho(idNivel: string) {
  const p = leerProgreso();
  if (!p.palabrasHechas.includes(idNivel)) {
    p.palabrasHechas.push(idNivel);
    p.estrellas += 1;
  }
  registrarActividadHoy(p);
  guardar(p);
  return p;
}

export function marcarMemoramaGanado(letra: string) {
  const p = leerProgreso();
  if (!p.memoramasGanados.includes(letra)) {
    p.memoramasGanados.push(letra);
    p.estrellas += 1;
  }
  registrarActividadHoy(p);
  guardar(p);
  return p;
}

export function marcarFiguritaVista(id: string) {
  const p = leerProgreso();
  if (!p.figuritasVistas.includes(id)) p.figuritasVistas.push(id);
  guardar(p);
  return p;
}

export function marcarAccesorioVisto(id: string) {
  const p = leerProgreso();
  if (!p.accesoriosVistos.includes(id)) p.accesoriosVistos.push(id);
  guardar(p);
  return p;
}

export function equiparAccesorio(id: string | null) {
  const p = leerProgreso();
  p.accesorioEquipado = id;
  guardar(p);
  return p;
}

export function totalEjerciciosHechos(p: Progreso) {
  return p.praxiasHechas.length + p.sonidosHechos.length + p.palabrasHechas.length;
}

export function minijuegoDesbloqueado(p: Progreso) {
  return totalEjerciciosHechos(p) >= 2;
}

export type Racha = {
  actual: number;
  mejor: number;
  hoyHecho: boolean;
  enRiesgo: boolean;
};

const UN_DIA_MS = 86_400_000;

export function calcularRacha(diasActivos: string[]): Racha {
  const dias = [...new Set(diasActivos)].sort();
  if (dias.length === 0) {
    return { actual: 0, mejor: 0, hoyHecho: false, enRiesgo: false };
  }

  let mejor = 1;
  let corrida = 1;
  for (let i = 1; i < dias.length; i++) {
    const diff = Math.round(
      (analizarISOLocal(dias[i]).getTime() - analizarISOLocal(dias[i - 1]).getTime()) /
        UN_DIA_MS
    );
    corrida = diff === 1 ? corrida + 1 : 1;
    mejor = Math.max(mejor, corrida);
  }

  const set = new Set(dias);
  const hoy = hoyISO();
  const ayerISO = diaAnteriorISO(hoy);

  let actual = 0;
  let cursor: string | null = set.has(hoy) ? hoy : set.has(ayerISO) ? ayerISO : null;
  while (cursor && set.has(cursor)) {
    actual += 1;
    cursor = diaAnteriorISO(cursor);
  }

  return {
    actual,
    mejor,
    hoyHecho: set.has(hoy),
    enRiesgo: !set.has(hoy) && set.has(ayerISO),
  };
}

export type NivelHijo = { nombre: string; indice: number; total: number };

const NIVELES_LEON = [
  "Cachorro",
  "Explorador",
  "Rugido Fuerte",
  "Rey de la Selva",
  "Leyenda del Rugido",
];
const NIVELES_PIRATA = [
  "Grumete",
  "Marinero",
  "Pirata Valiente",
  "Capitán",
  "Leyenda de los Mares",
];
const UMBRALES_NIVEL = [0, 3, 8, 15, 23];

export function calcularNivel(p: Progreso): NivelHijo {
  const total = totalEjerciciosHechos(p);
  let indice = 0;
  for (let i = 0; i < UMBRALES_NIVEL.length; i++) {
    if (total >= UMBRALES_NIVEL[i]) indice = i;
  }
  const nombres = p.interes === "pirata" ? NIVELES_PIRATA : NIVELES_LEON;
  return { nombre: nombres[indice], indice, total: nombres.length };
}
