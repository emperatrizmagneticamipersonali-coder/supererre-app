"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoChromaKey } from "@/hooks/useVideoChromaKey";

/** Video del personaje (León/Pirata) haciendo el ejercicio/sonido de verdad —
 * chroma-keyed para que se vea flotando, sin fondo blanco.
 * `quieto`: en vez de reproducir el clip entero (algunos videos incluyen al
 * personaje caminando/moviéndose de cuerpo entero), se congela en un cuadro
 * fijo donde se lo ve haciendo el gesto, sin desplazarse.
 * Los videos ya vienen recortados (se les sacaron los primeros ~3s "muertos"
 * antes de comprimirlos), por eso el cuadro por defecto es temprano. */
export function VideoCompanero({
  src,
  size = 176,
  quieto,
  cuadroQuieto = 1.5,
  className,
}: {
  src: string;
  size?: number;
  quieto?: boolean;
  cuadroQuieto?: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useVideoChromaKey(videoRef, canvasRef, "contain");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setListo(false);
  }, [src]);

  return (
    <div className={`relative ${className ?? ""}`} style={{ width: size, height: size }}>
      {!listo && (
        <div className="absolute inset-0 animate-pulse rounded-full bg-surface-secondary" />
      )}
      <video
        ref={videoRef}
        key={src}
        src={src}
        preload="auto"
        autoPlay={!quieto}
        loop={!quieto}
        muted
        playsInline
        onLoadedData={(e) => {
          if (quieto) {
            const v = e.currentTarget;
            v.currentTime = cuadroQuieto;
            v.pause();
          }
        }}
        onSeeked={() => setListo(true)}
        onCanPlay={() => setListo(true)}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className={`h-full w-full transition-opacity duration-300 ${listo ? "opacity-100" : "opacity-0"}`}
        style={{ filter: "drop-shadow(0 6px 10px rgba(34,51,46,0.18))" }}
      />
    </div>
  );
}
