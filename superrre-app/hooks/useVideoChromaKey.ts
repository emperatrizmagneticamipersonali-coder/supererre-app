"use client";

import { useEffect, type RefObject } from "react";

/**
 * Dibuja un <video> dentro de un <canvas> cuadro a cuadro y vuelve
 * transparentes los píxeles casi blancos — reemplaza el fondo blanco de
 * los videos de mascota por transparencia real (no un truco de CSS, que
 * es poco confiable con <video> entre navegadores/celulares).
 *
 * Lee los refs DENTRO del loop (no los captura una sola vez al montar) para
 * seguir funcionando si el <video>/<canvas> se reemplaza mientras el
 * componente sigue montado (ej. cambiar de ejercicio sin desmontar la
 * pantalla).
 */
export function useVideoChromaKey(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  fit: "contain" | "cover" = "contain"
) {
  useEffect(() => {
    let raf = 0;
    let activo = true;

    const dibujar = () => {
      if (!activo) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });

      if (video && canvas && ctx) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (video.readyState >= 2 && vw > 0 && vh > 0) {
          const cw = canvas.width;
          const ch = canvas.height;
          const scale =
            fit === "contain"
              ? Math.min(cw / vw, ch / vh)
              : Math.max(cw / vw, ch / vh);
          const dw = vw * scale;
          const dh = vh * scale;
          const dx = (cw - dw) / 2;
          const dy = (ch - dh) / 2;

          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(video, dx, dy, dw, dh);

          const frame = ctx.getImageData(0, 0, cw, ch);
          const data = frame.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) continue;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const min = Math.min(r, g, b);
            const max = Math.max(r, g, b);
            // casi blanco/gris claro (fondo del video) -> se vuelve transparente.
            // Rango amplio a propósito: hay videos con fondo blanco puro (~250),
            // otros con un beige grisáceo más oscuro (~210-230), y algunos con
            // degradado/viñeta que baja hasta ~172 en las esquinas — los tres deben
            // llegar a transparencia completa, no quedarse "casi" transparentes. El
            // personaje (incluso sus tonos más claros/neutros) siempre quedó muestreado
            // muy por debajo de 150 en todos los videos probados, así que hay margen.
            if (min > 150 && max - min < 30) {
              const t = Math.min(1, Math.max(0, (min - 150) / 30));
              data[i + 3] = Math.round(data[i + 3] * (1 - t));
            }
          }
          ctx.putImageData(frame, 0, 0);
        }
      }
      raf = requestAnimationFrame(dibujar);
    };

    raf = requestAnimationFrame(dibujar);
    return () => {
      activo = false;
      cancelAnimationFrame(raf);
    };
  }, [videoRef, canvasRef, fit]);
}
