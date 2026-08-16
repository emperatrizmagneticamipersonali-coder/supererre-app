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
        className="hidden"
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
