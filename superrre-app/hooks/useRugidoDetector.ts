"use client";

import { useEffect, useRef, useState } from "react";
import type { SeveridadR } from "@/lib/progress";

export type EstadoDeteccion =
  | "idle"
  | "pidiendo-permiso"
  | "escuchando"
  | "detectado"
  | "sin-microfono";

/** Umbral de volumen y tiempo sostenido según edad — los más chicos tienen
 * menos control de aire/volumen (les cuesta más sostener un sonido fuerte),
 * así que se les exige menos; los más grandes ya pueden ser más precisos. */
function ajustePorEdad(edad?: number): { umbral: number; sostenerMs: number } {
  if (!edad || edad === 6) return { umbral: 32, sostenerMs: 200 };
  if (edad <= 4) return { umbral: 24, sostenerMs: 150 };
  if (edad === 5) return { umbral: 28, sostenerMs: 175 };
  if (edad === 7) return { umbral: 34, sostenerMs: 220 };
  return { umbral: 36, sostenerMs: 240 }; // 8 años o más
}

/** Multiplicador extra según cómo dice la R hoy (respuesta del onboarding) —
 * si todavía no la dice en ninguna palabra, cualquier intento real ya es un
 * progreso enorme y hay que ser más permisivo; si ya la dice a veces, tiene
 * sentido pedirle un poquito más de precisión para seguir mejorando. */
function factorSeveridad(severidad?: SeveridadR): number {
  if (severidad === "omision") return 0.82;
  if (severidad === "inconsistente") return 1.12;
  return 1; // sustitucion, sin-diagnostico, o sin dato: usa el valor por edad tal cual
}

/** Detecta un intento de sonido real por micrófono — 100% local, nunca se sube a internet. */
export function useRugidoDetector(edad?: number, severidad?: SeveridadR) {
  const [estado, setEstado] = useState<EstadoDeteccion>("idle");
  const [nivelVoz, setNivelVoz] = useState(0);
  const base = ajustePorEdad(edad);
  const factor = factorSeveridad(severidad);
  const UMBRAL_SONIDO = Math.round(base.umbral * factor);
  const SOSTENER_MS = Math.round(base.sostenerMs * factor);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const sostenidoDesdeRef = useRef<number | null>(null);

  function detener() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current = null;
    audioCtxRef.current = null;
  }

  useEffect(() => () => detener(), []);

  function reiniciar() {
    detener();
    setEstado("idle");
    setNivelVoz(0);
  }

  async function empezar() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado("sin-microfono");
      return;
    }
    setEstado("pidiendo-permiso");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      // En varios celulares (sobre todo iOS Safari) el AudioContext arranca
      // "suspended" incluso con gesto del usuario — sin resume() el analyser
      // solo lee silencio para siempre y nunca detecta ningún sonido real.
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      setEstado("escuchando");
      sostenidoDesdeRef.current = null;

      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        // *4.6 (antes 3.2): un gruñido/rugido real ("grrrr") es naturalmente
        // más bajo de volumen que un grito abierto tipo "¡AAAH!" aunque el
        // niño se esfuerce igual — el detector no lo estaba reconociendo.
        const rms = Math.sqrt(sum / data.length) * 100 * 4.6;
        setNivelVoz(Math.min(100, rms));

        if (rms >= UMBRAL_SONIDO) {
          if (sostenidoDesdeRef.current === null) {
            sostenidoDesdeRef.current = performance.now();
          } else if (
            performance.now() - sostenidoDesdeRef.current >=
            SOSTENER_MS
          ) {
            detener();
            setEstado("detectado");
            return;
          }
        } else {
          sostenidoDesdeRef.current = null;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setEstado("sin-microfono");
    }
  }

  return { estado, nivelVoz, empezar, reiniciar };
}
