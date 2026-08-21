"use client";

import { useEffect, useRef, useState } from "react";

// misma curva que .animate-fade-up en globals.css, para que se sienta
// parte del mismo sistema de movimiento
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Anima un número entero desde su valor anterior hasta valorFinal. */
export function useConteo(valorFinal: number, duracionMs = 600): number {
  const [valor, setValor] = useState(0);
  const prevRef = useRef(0);
  const montadoRef = useRef(false);

  useEffect(() => {
    const desde = prevRef.current;
    const hasta = valorFinal;
    if (desde === hasta) return;

    const reducido =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || !montadoRef.current) {
      montadoRef.current = true;
    }
    if (reducido) {
      setValor(hasta);
      prevRef.current = hasta;
      return;
    }

    let raf: number;
    const inicio = performance.now();
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracionMs);
      setValor(Math.round(desde + (hasta - desde) * easeOut(t)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = hasta;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valorFinal, duracionMs]);

  return valor;
}
