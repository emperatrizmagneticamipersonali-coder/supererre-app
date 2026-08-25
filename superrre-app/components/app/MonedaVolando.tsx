"use client";

import { useEffect, useState } from "react";
import { IconCoin } from "./icons";

/** 3 monedas que salen del centro y "vuelan" hacia arriba con sonido —
 * feedback de que se ganó una moneda al terminar un ejercicio. Se dispara
 * cada vez que `activa` cambia a un valor distinto (usar un contador o
 * timestamp, no un booleano, para que dispare de nuevo aunque el valor
 * anterior también fuera "true"). */
export function MonedaVolando({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="fixed z-[60] flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand shadow-md animate-moneda-volar pointer-events-none"
          style={{
            left: `calc(50% + ${(i - 1) * 14}px)`,
            bottom: 140,
            animationDelay: `${i * 80}ms`,
          }}
          aria-hidden="true"
        >
          <IconCoin className="h-4 w-4" />
        </span>
      ))}
    </>
  );
}
