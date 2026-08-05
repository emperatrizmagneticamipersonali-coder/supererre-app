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
    <div className="animate-fade-up [animation-delay:120ms]">
      <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-surface-primary border border-border-default shadow-lg p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary mb-4">
          Así se siente el primer rugido
        </p>

        <button
          onClick={play}
          className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
            boxShadow:
              "0 0 0 5px var(--surface-primary), 0 0 0 9px var(--brand-primary), 0 0 0 12px var(--surface-primary), 0 0 0 15px var(--brand-secondary)",
          }}
          aria-label="Reproducir demo del Espejo del León"
        >
          <span
            className={`text-6xl select-none ${
              stage === "playing" ? "animate-breathe" : ""
            }`}
          >
            🦁
          </span>
          {stage === "idle" && (
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
              <IconPlay className="h-5 w-5" />
            </span>
          )}
        </button>

        <div className="mt-4 min-h-12 flex flex-col items-center justify-center">
          {stage === "idle" && (
            <p className="text-sm text-txt-secondary">
              Toca el espejo para ver cómo imita el sonido
            </p>
          )}
          {stage === "playing" && (
            <p className="text-sm font-semibold text-txt-on-primary-soft">
              &ldquo;¡GRRR!&rdquo; — grabando la imitación…
            </p>
          )}
          {stage === "done" && (
            <div className="flex items-center gap-2 text-brand-secondary animate-pop-in">
              <IconSparkles className="h-5 w-5" />
              <p className="text-sm font-bold">
                ¡Primera estrella conseguida!
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-txt-tertiary leading-relaxed">
          Demo del mecanismo real. El audio se procesa siempre en el
          celular — nunca se sube a internet.
        </p>
      </div>
    </div>
  );
}
