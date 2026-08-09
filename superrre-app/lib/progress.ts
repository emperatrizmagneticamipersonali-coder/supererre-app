"use client";

import { useSyncExternalStore } from "react";

export type Plan = "free" | "completo";

export type Progreso = {
  nombre: string;
  plan: Plan;
  interes: "leon" | "pirata" | "";
  estrellas: number;
  praxiasHechas: string[];
  sonidosHechos: string[];
  silabaActual: number; // índice en ESCALERA (0 = RA)
  palabrasHechas: string[];
};

const KEY = "supererre_progreso";

const DEFAULT_PROGRESO: Progreso = {
  nombre: "",
  plan: "free",
  interes: "",
  estrellas: 1, // la estrella del onboarding ya está guardada
  praxiasHechas: [],
  sonidosHechos: [],
  silabaActual: 0,
  palabrasHechas: [],
};

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
}) {
  const actual = leerProgreso();
  guardar({
    ...actual,
    nombre: datos.nombre || actual.nombre,
    plan: datos.plan,
    interes: datos.interes ?? actual.interes,
  });
}

export function marcarPraxiaHecha(id: string) {
  const p = leerProgreso();
  if (!p.praxiasHechas.includes(id)) {
    p.praxiasHechas.push(id);
    p.estrellas += 1;
  }
  guardar(p);
  return p;
}

export function marcarSonidoHecho(id: string) {
  const p = leerProgreso();
  if (!p.sonidosHechos.includes(id)) {
    p.sonidosHechos.push(id);
    p.estrellas += 1;
  }
  guardar(p);
  return p;
}

export function marcarPalabraHecha(palabra: string, avanzaSilaba: boolean) {
  const p = leerProgreso();
  if (!p.palabrasHechas.includes(palabra)) {
    p.palabrasHechas.push(palabra);
    p.estrellas += 1;
  }
  if (avanzaSilaba) p.silabaActual = Math.min(p.silabaActual + 1, 4);
  guardar(p);
  return p;
}

export function totalEjerciciosHechos(p: Progreso) {
  return p.praxiasHechas.length + p.sonidosHechos.length + p.palabrasHechas.length;
}

export function minijuegoDesbloqueado(p: Progreso) {
  return totalEjerciciosHechos(p) >= 2;
}
