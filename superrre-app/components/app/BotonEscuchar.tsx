"use client";

import { useHablar } from "@/hooks/useHablar";
import { IconVolume } from "@/components/app/icons";

export function BotonEscuchar({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const { hablar, hablando, disponible } = useHablar();
  if (!disponible) return null;

  return (
    <button
      type="button"
      onClick={() => hablar(texto)}
      aria-label="Escuchar la indicación"
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft transition-transform active:scale-90 ${
        hablando ? "animate-breathe" : ""
      } ${className ?? ""}`}
    >
      <IconVolume className="h-5 w-5" />
    </button>
  );
}
