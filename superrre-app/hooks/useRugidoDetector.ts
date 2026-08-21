"use client";

import { useEffect, useRef, useState } from "react";

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

/** Detecta un intento de sonido real por micrófono — 100% local, nunca se sube a internet. */
export function useRugidoDetector(edad?: number) {
  const [estado, setEstado] = useState<EstadoDeteccion>("idle");
  const [nivelVoz, setNivelVoz] = useState(0);
  const { umbral: UMBRAL_SONIDO, sostenerMs: SOSTENER_MS } = ajustePorEdad(edad);

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
        const rms = Math.sqrt(sum / data.length) * 100 * 3.2;
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
