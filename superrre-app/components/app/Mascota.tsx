"use client";

import { useRef } from "react";
import { useVideoChromaKey } from "@/hooks/useVideoChromaKey";

export const MASCOTA_SRC = {
  leon: "/mascots/leon.mp4",
  pirata: "/mascots/pirata.mp4",
} as const;

const ALT = {
  leon: "El León, tu personaje guía",
  pirata: "El Pirata, tu personaje guía",
} as const;

export function Mascota({
  tema,
  size = 120,
  className,
}: {
  tema: "leon" | "pirata";
  size?: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useVideoChromaKey(videoRef, canvasRef, "contain");

  return (
    <div
      className={`inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <video
        ref={videoRef}
        key={tema}
        src={MASCOTA_SRC[tema]}
        aria-label={ALT[tema]}
        autoPlay
        loop
        muted
        playsInline
        // display:none frena la decodificación de cuadros en varios
        // celulares Android/Chrome (para ahorrar batería) — el video queda
        // "pausado" aunque autoplay siga activo, y el canvas dibuja siempre
        // el mismo cuadro viejo. Con opacity:0 + tamaño 1px sigue en el
        // árbol de render (decodifica normal) pero es invisible.
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 6px 10px rgba(34,51,46,0.18))" }}
      />
    </div>
  );
}
