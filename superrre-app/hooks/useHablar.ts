"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NOMBRES_VOZ_FEMENINA = [
  "helena",
  "sabina",
  "paulina",
  "mónica",
  "monica",
  "lucia",
  "lucía",
  "elvira",
  "female",
  "mujer",
  "google español",
];

function elegirVoz(voces: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const esVoces = voces.filter((v) => v.lang.toLowerCase().startsWith("es"));
  const candidatas = esVoces.length > 0 ? esVoces : voces;
  if (candidatas.length === 0) return null;

  const femenina = candidatas.find((v) =>
    NOMBRES_VOZ_FEMENINA.some((n) => v.name.toLowerCase().includes(n))
  );
  return femenina ?? candidatas[0];
}

/** Lee indicaciones en voz alta con la síntesis de voz del navegador — 100% local,
 * nunca sale del dispositivo. Pensado para niños que aún no saben leer. */
export function useHablar() {
  const [hablando, setHablando] = useState(false);
  const [disponible, setDisponible] = useState(false);
  const vozRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setDisponible(true);

    const actualizarVoz = () => {
      vozRef.current = elegirVoz(window.speechSynthesis.getVoices());
    };
    actualizarVoz();
    window.speechSynthesis.addEventListener("voiceschanged", actualizarVoz);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", actualizarVoz);
      window.speechSynthesis.cancel();
    };
  }, []);

  const hablar = useCallback((texto: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = vozRef.current?.lang ?? "es-ES";
    if (vozRef.current) u.voice = vozRef.current;
    u.rate = 0.92;
    u.pitch = 1;
    u.onstart = () => setHablando(true);
    u.onend = () => setHablando(false);
    u.onerror = () => setHablando(false);
    window.speechSynthesis.speak(u);
  }, []);

  return { hablar, hablando, disponible };
}
