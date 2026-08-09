"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProgreso, minijuegoDesbloqueado } from "@/lib/progress";
import { IconSparkles } from "@/components/app/icons";

const COLORES = [
  "var(--brand-primary)",
  "var(--brand-secondary)",
  "var(--brand-accent)",
  "var(--brand-primary)",
  "var(--brand-secondary)",
  "var(--brand-accent)",
];

function generarGlobos() {
  return COLORES.map((color, i) => ({
    id: `${i}-${Date.now()}`,
    color,
    top: 10 + Math.random() * 55,
    left: (i % 3) * 32 + 4 + Math.random() * 6,
    reventado: false,
  }));
}

export default function PremiosPage() {
  const router = useRouter();
  const p = useProgreso();
  const [globos, setGlobos] = useState(() => generarGlobos());
  const [jugando, setJugando] = useState(false);

  const reventados = globos.filter((g) => g.reventado).length;
  const terminado = jugando && reventados === globos.length;

  const disponible = p.plan === "completo" && minijuegoDesbloqueado(p);

  if (!disponible) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-6xl mb-4">🔒</span>
        <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
          El Cofre de Premios está cerrado
        </h1>
        <p className="mt-3 text-sm text-txt-secondary max-w-xs">
          {p.plan !== "completo"
            ? "Se abre con el Espejo Completo — desbloquéalo desde Mamá."
            : "Completa 2 ejercicios en Praxias, Sonidos o la Escalera para abrirlo."}
        </p>
        <Link
          href={p.plan !== "completo" ? "/app/mama" : "/app"}
          className="mt-6 rounded-full bg-brand-primary text-txt-on-brand font-display font-bold px-6 py-3"
        >
          {p.plan !== "completo" ? "Ver el Espejo Completo" : "Volver al mapa"}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Revienta los globos
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Tu premio por practicar tanto 🎉
      </p>

      {!jugando ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-7xl mb-4">🎈</span>
          <button
            onClick={() => {
              setGlobos(generarGlobos());
              setJugando(true);
            }}
            className="rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 shadow-md"
          >
            Jugar
          </button>
        </div>
      ) : terminado ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-pop-in">
          <IconSparkles className="h-10 w-10 text-brand-primary mb-3" />
          <h2 className="font-display font-extrabold text-2xl text-txt-primary">
            ¡Los reventaste todos!
          </h2>
          <p className="mt-2 text-sm text-txt-secondary">
            +1 estrella para tu colección
          </p>
          <button
            onClick={() => {
              setGlobos(generarGlobos());
            }}
            className="mt-6 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 shadow-md"
          >
            Jugar otra vez
          </button>
        </div>
      ) : (
        <div className="relative flex-1 mt-4">
          {globos.map((g) => (
            <button
              key={g.id}
              onClick={() =>
                setGlobos((prev) =>
                  prev.map((x) =>
                    x.id === g.id ? { ...x, reventado: true } : x
                  )
                )
              }
              disabled={g.reventado}
              aria-label="Globo"
              className={`absolute h-16 w-16 rounded-full transition-transform active:scale-90 ${
                g.reventado ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
              style={{
                top: `${g.top}%`,
                left: `${g.left}%`,
                background: g.color,
                transitionDuration: "200ms",
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/app")}
        className="mt-4 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Volver al mapa
      </button>
    </div>
  );
}
