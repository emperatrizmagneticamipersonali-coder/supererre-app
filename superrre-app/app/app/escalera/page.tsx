"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgreso, marcarPalabraHecha } from "@/lib/progress";
import { useRugidoDetector } from "@/hooks/useRugidoDetector";
import {
  IconCheck,
  IconChevronLeft,
  IconLock,
  IconMic,
  IconPlay,
  IconSparkles,
} from "@/components/app/icons";

const ESCALERA = [
  { silaba: "RA", palabra: "carro" },
  { silaba: "RE", palabra: "perro" },
  { silaba: "RI", palabra: "rana" },
  { silaba: "RO", palabra: "ferrocarril" },
  { silaba: "RU", palabra: "guitarra" },
] as const;

export default function EscaleraPage() {
  const router = useRouter();
  const p = useProgreso();
  const [activa, setActiva] = useState<number | null>(null);

  if (activa !== null) {
    const peldano = ESCALERA[activa];
    return (
      <PalabraDetector
        silaba={peldano.silaba}
        palabra={peldano.palabra}
        onVolver={() => setActiva(null)}
        onDetectado={() =>
          marcarPalabraHecha(peldano.palabra, activa === p.silabaActual)
        }
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Escalera Fonética
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Sube un peldaño con cada palabra que practiques.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-3">
        {ESCALERA.map((e, i) => {
          const desbloqueado = i === 0 || p.plan === "completo";
          const hecha = p.palabrasHechas.includes(e.palabra);
          return (
            <button
              key={e.silaba}
              onClick={() => desbloqueado && setActiva(i)}
              disabled={!desbloqueado}
              style={{ marginLeft: `${i * 12}px` }}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-transform ${
                desbloqueado
                  ? "border-border-default bg-surface-primary active:scale-[0.98]"
                  : "border-border-default bg-surface-secondary opacity-60"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display font-extrabold text-sm ${
                  hecha
                    ? "bg-brand-secondary text-txt-on-brand"
                    : "bg-brand-primary-soft text-txt-on-primary-soft"
                }`}
              >
                {desbloqueado ? e.silaba : <IconLock className="h-5 w-5" />}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-base text-txt-primary">
                  {desbloqueado ? `"${e.palabra}"` : "Bloqueado"}
                </p>
                <p className="text-xs text-txt-secondary">
                  {desbloqueado
                    ? hecha
                      ? "Completado"
                      : "Toca para practicar"
                    : "Desbloquea el Espejo Completo"}
                </p>
              </div>
              {hecha && (
                <IconCheck className="h-5 w-5 text-brand-secondary shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/app")}
        className="mt-8 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Volver al mapa
      </button>
    </div>
  );
}

function PalabraDetector({
  silaba,
  palabra,
  onVolver,
  onDetectado,
}: {
  silaba: string;
  palabra: string;
  onVolver: () => void;
  onDetectado: () => void;
}) {
  const { estado, nivelVoz, empezar } = useRugidoDetector();
  const escala = 1 + Math.min(nivelVoz, 100) / 220;

  useEffect(() => {
    if (estado === "detectado" || estado === "sin-microfono") onDetectado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
      <button
        onClick={onVolver}
        aria-label="Atrás"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {estado === "escuchando" && (
          <p className="text-sm font-bold text-brand-secondary uppercase tracking-wide mb-6 flex items-center gap-2">
            <IconMic className="h-4 w-4" /> Escuchando…
          </p>
        )}
        <button
          onClick={estado === "idle" ? empezar : undefined}
          disabled={estado !== "idle"}
          className="relative flex h-40 w-40 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
            boxShadow:
              "0 0 0 6px var(--surface-primary), 0 0 0 11px var(--brand-primary), 0 0 0 15px var(--surface-primary), 0 0 0 19px var(--brand-secondary)",
            transform: estado === "escuchando" ? `scale(${escala})` : undefined,
          }}
          aria-label={`Practicar ${palabra}`}
        >
          <span className="font-display font-extrabold text-3xl text-txt-on-brand select-none">
            {silaba}
          </span>
          {estado === "idle" && (
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
              <IconPlay className="h-5 w-5" />
            </span>
          )}
        </button>

        <h1 className="mt-6 font-display font-extrabold text-2xl text-txt-primary">
          &ldquo;{palabra}&rdquo;
        </h1>
        <p className="mt-2 text-base text-txt-secondary">
          Toca el espejo y dilo fuerte
        </p>

        {estado === "detectado" && (
          <div className="mt-4 flex items-center gap-2 text-brand-secondary animate-pop-in">
            <IconSparkles className="h-5 w-5" />
            <p className="font-bold">¡Muy bien dicho!</p>
          </div>
        )}
        {estado === "sin-microfono" && (
          <p className="mt-4 text-sm text-txt-secondary max-w-xs">
            No pudimos usar el micrófono, pero igual anotamos tu intento.
          </p>
        )}
      </div>

      {(estado === "detectado" || estado === "sin-microfono") && (
        <button
          onClick={onVolver}
          className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 shadow-md transition-colors"
        >
          Continuar
        </button>
      )}
    </div>
  );
}
