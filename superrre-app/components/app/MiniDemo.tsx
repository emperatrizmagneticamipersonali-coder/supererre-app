"use client";

import { useState } from "react";
import { IconPlay, IconSparkles } from "./icons";

export function MiniDemo() {
  const [stage, setStage] = useState<"idle" | "playing" | "done">("idle");

  function play() {
    if (stage !== "idle") return;
    setStage("playing");
    setTimeout(() => setStage("done"), 1400);
  }

  return (
    <div className="animate-fade-up [animation-delay:120ms] relative">
      <div className="relative mx-auto w-full max-w-md rounded-3xl bg-surface-primary border border-border-default shadow-lg p-8 text-center overflow-visible">
        <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary mb-6">
          Así se siente el primer rugido
        </p>

        <div className="relative mx-auto flex items-center justify-center h-64 w-64">
          <span
            aria-hidden="true"
            className="absolute -top-3 -left-5 text-4xl animate-float-slow select-none"
          >
            ⭐
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -right-4 text-3xl animate-float-slow-alt select-none"
          >
            ✨
          </span>

          {stage === "idle" && (
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
          )}

          <button
            onClick={play}
            className="relative flex h-48 w-48 items-center justify-center rounded-full transition-transform active:scale-95"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
              boxShadow:
                "0 0 0 6px var(--surface-primary), 0 0 0 11px var(--brand-primary), 0 0 0 15px var(--surface-primary), 0 0 0 19px var(--brand-secondary)",
            }}
            aria-label="Reproducir demo del Espejo del León"
          >
            <span
              className={`text-9xl select-none ${
                stage === "playing" ? "animate-breathe" : ""
              }`}
            >
              🦁
            </span>
            {stage === "idle" && (
              <span className="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
                <IconPlay className="h-6 w-6" />
              </span>
            )}
          </button>
        </div>

        <div className="mt-6 min-h-12 flex flex-col items-center justify-center">
          {stage === "idle" && (
            <p className="text-base font-semibold text-txt-primary">
              Toca el espejo para ver cómo imita el sonido
            </p>
          )}
          {stage === "playing" && (
            <p className="text-base font-semibold text-txt-on-primary-soft">
              &ldquo;¡GRRR!&rdquo; — así lo escucha el León…
            </p>
          )}
          {stage === "done" && (
            <div className="flex items-center gap-2 text-brand-secondary animate-pop-in">
              <IconSparkles className="h-5 w-5" />
              <p className="text-base font-bold">
                ¡Así se ve la primera estrella!
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-txt-tertiary leading-relaxed">
          Así se va a sentir con tu hijo. En la app real, el Espejo
          escucha su intento por el micrófono — el audio se procesa
          siempre en el celular, nunca se sube a internet.
        </p>
      </div>
    </div>
  );
}
