"use client";

import Link from "next/link";
import { useProgreso, calcularRacha, type Progreso } from "@/lib/progress";
import { ESCALERA_POR_LETRA } from "@/lib/escalera-data";
import { TODAS_LAS_PRAXIAS } from "@/lib/praxias-data";
import { MODOS } from "@/lib/sonidos-data";
import { IconLock, IconCheck, IconFlame, IconCoin } from "@/components/app/icons";
import { Mascota } from "@/components/app/Mascota";
import { useConteo } from "@/hooks/useConteo";

type PasoMapa = {
  id: string;
  emoji: string;
  href: string;
  completo: boolean;
  requierePlanCompleto: boolean;
};

type Seccion = {
  titulo: string;
  pasos: PasoMapa[];
};

const EMOJI_TIPO: Record<string, string> = {
  silaba: "🗣️",
  palabra: "🔤",
  oracion: "💬",
};

// el camino es dorado, los nodos/ruedas de cada sección son azules — a
// diferencia de antes, es un solo color de nodo en todo el mapa (no varía
// por sección), a pedido explícito del usuario.

function construirSecciones(p: Progreso, tema: "leon" | "pirata"): Seccion[] {
  const modo = MODOS[tema];
  const mascotaEmoji = tema === "pirata" ? "🏴‍☠️" : "🦁";

  const praxias: PasoMapa[] = TODAS_LAS_PRAXIAS.map((ex) => ({
    id: `praxia-${ex.id}`,
    emoji: ex.emoji,
    href: `/app/praxias?ex=${ex.id}`,
    completo: p.praxiasHechas.includes(ex.id),
    requierePlanCompleto: false,
  }));

  const sonidos: PasoMapa[] = modo.sonidos.map((s) => ({
    id: `sonido-${s.id}`,
    emoji: modo.emoji,
    href: `/app/sonidos?ex=${s.id}`,
    completo: p.sonidosHechos.includes(`${tema}-${s.id}`),
    requierePlanCompleto: false,
  }));

  const memoramaR: PasoMapa[] = [
    {
      id: "memorama-R",
      emoji: mascotaEmoji,
      href: "/app/premios",
      completo: p.memoramasGanados.includes("R"),
      requierePlanCompleto: false,
    },
  ];

  const escaleraR: PasoMapa[] = ESCALERA_POR_LETRA.R.flatMap((grupo) =>
    grupo.niveles.map((nivel) => ({
      id: `escalera-${nivel.id}`,
      emoji: EMOJI_TIPO[nivel.tipo],
      href: `/app/escalera?ex=${nivel.id}`,
      completo: p.palabrasHechas.includes(nivel.id),
      requierePlanCompleto: grupo.silaba !== "RA",
    }))
  );

  const escaleraL: PasoMapa[] = ESCALERA_POR_LETRA.L.flatMap((grupo) =>
    grupo.niveles.map((nivel) => ({
      id: `escalera-${nivel.id}`,
      emoji: EMOJI_TIPO[nivel.tipo],
      href: `/app/escalera-l?ex=${nivel.id}`,
      completo: p.palabrasHechas.includes(nivel.id),
      requierePlanCompleto: true,
    }))
  );

  const memoramaL: PasoMapa[] = [
    {
      id: "memorama-L",
      emoji: mascotaEmoji,
      href: "/app/premios",
      completo: p.memoramasGanados.includes("L"),
      requierePlanCompleto: true,
    },
  ];

  return [
    { titulo: "Praxias", pasos: praxias },
    { titulo: "Sonidos", pasos: sonidos },
    { titulo: "Memorama de la R", pasos: memoramaR },
    { titulo: "Escalera de la R", pasos: escaleraR },
    { titulo: "Escalera de la L", pasos: escaleraL },
    { titulo: "Memorama de la L", pasos: memoramaL },
  ];
}

const POS_X = [50, 76, 50, 24];
const GAP_Y = 84;
const PAD_TOP = 76;

function construirCurva(puntos: { x: number; y: number }[]) {
  if (puntos.length < 2) return "";
  let d = `M ${puntos[0].x} ${puntos[0].y}`;
  for (let i = 1; i < puntos.length; i++) {
    const p0 = puntos[i - 1];
    const p1 = puntos[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function MapaDeIslasPage() {
  const p = useProgreso();
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const mascotaEmoji = tema === "pirata" ? "🏴‍☠️" : "🦁";

  const secciones = construirSecciones(p, tema);
  const pasosFlat = secciones.flatMap((s) => s.pasos);

  const desbloqueado: boolean[] = [];
  let previoCompleto = true;
  pasosFlat.forEach((paso, i) => {
    const gateOk = !paso.requierePlanCompleto || p.plan === "completo";
    desbloqueado[i] = previoCompleto && gateOk;
    previoCompleto = paso.completo;
  });

  let indiceActual = pasosFlat.findIndex(
    (paso, i) => desbloqueado[i] && !paso.completo
  );
  if (indiceActual === -1) {
    for (let i = pasosFlat.length - 1; i >= 0; i--) {
      if (desbloqueado[i]) {
        indiceActual = i;
        break;
      }
    }
  }
  if (indiceActual === -1) indiceActual = 0;

  let contadorGlobal = 0;
  const rachaAnimada = useConteo(calcularRacha(p.diasActivos).actual);
  const monedasAnimadas = useConteo(p.monedas);

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-txt-secondary">
            {tema === "pirata" ? "¡Ahoy," : "Hola,"} {p.nombre || "explorador"}!
          </p>
          <h1 className="font-display font-extrabold text-2xl text-txt-primary">
            {tema === "pirata" ? "Mar de" : "Isla de"} {p.nombre || "tu hijo"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/racha"
            className="inline-flex items-center gap-1 rounded-full bg-brand-accent-soft text-brand-accent text-sm font-bold px-3 py-2 tabular-nums"
            aria-label="Ver racha"
          >
            <IconFlame className="h-4 w-4" /> {rachaAnimada}
          </Link>
          <Link
            href="/app/premios"
            className="inline-flex items-center gap-1 rounded-full bg-brand-primary-soft text-txt-on-primary-soft text-sm font-bold px-3 py-2 tabular-nums"
            aria-label="Ver monedas"
          >
            <IconCoin className="h-4 w-4" /> {monedasAnimadas}
          </Link>
        </div>
      </div>

      {secciones.map((seccion) => {
        const offset = contadorGlobal;
        contadorGlobal += seccion.pasos.length;
        const alturaSeccion =
          PAD_TOP + (seccion.pasos.length - 1) * GAP_Y + 48;
        const puntos = seccion.pasos.map((_, i) => ({
          x: POS_X[i % POS_X.length],
          y: PAD_TOP + i * GAP_Y,
        }));
        const finGlobalIdx = offset + seccion.pasos.length - 1;
        const puntosHechosLocal = puntos.filter(
          (_, i) => desbloqueado[offset + i]
        );

        return (
          <div key={seccion.titulo} className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary text-center">
              {seccion.titulo}
            </p>

            <div className="relative mt-4" style={{ height: alturaSeccion }}>
              <svg
                viewBox={`0 0 100 ${alturaSeccion}`}
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d={construirCurva(puntos)}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth={1.4}
                  strokeDasharray="1.5 5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {puntosHechosLocal.length > 1 && (
                  <path
                    d={construirCurva(puntosHechosLocal)}
                    fill="none"
                    stroke="var(--brand-primary)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              {seccion.pasos.map((paso, i) => {
                const gi = offset + i;
                const abierta = desbloqueado[gi];
                const esActual = gi === indiceActual && abierta && !paso.completo;
                const punto = puntos[i];

                const circulo = (
                  <div
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl transition-transform active:scale-95 ${
                      abierta ? "bg-brand-secondary" : "bg-surface-tertiary"
                    }`}
                    style={
                      abierta
                        ? {
                            boxShadow: `0 3px 0 0 color-mix(in oklab, var(--brand-secondary) 55%, black)`,
                          }
                        : undefined
                    }
                  >
                    {abierta ? (
                      paso.emoji
                    ) : (
                      <IconLock className="h-5 w-5 text-txt-tertiary" />
                    )}
                    {paso.completo && (
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand shadow-sm">
                        <IconCheck className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                );

                const nodo = (
                  <div
                    className="absolute animate-fade-up"
                    style={{
                      left: `${punto.x}%`,
                      top: punto.y,
                      transform: "translate(-50%, -50%)",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    {esActual && (
                      <div
                        className="absolute -top-20 left-1/2"
                        style={{ transform: "translateX(-50%)" }}
                        aria-hidden="true"
                      >
                        <div className="animate-float-slow">
                          <Mascota tema={tema} size={76} />
                        </div>
                      </div>
                    )}
                    {circulo}
                  </div>
                );

                return (
                  <div key={paso.id} className={abierta ? "" : "cursor-not-allowed"}>
                    {abierta ? (
                      <Link href={paso.href} aria-label={`Paso ${gi + 1}: ${seccion.titulo}`}>
                        {nodo}
                      </Link>
                    ) : (
                      nodo
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <span className="text-3xl select-none" aria-hidden="true">
          {mascotaEmoji}
        </span>
        <p className="text-sm text-txt-secondary max-w-48">
          Más letras llegarán más adelante.
        </p>
      </div>

      {p.plan === "free" && (
        <Link
          href="/app/mama"
          className="mt-4 rounded-2xl bg-surface-secondary p-4 text-center text-sm font-semibold text-txt-primary"
        >
          Tienes el plan gratis — desbloquea todo en{" "}
          <span className="text-brand-primary">Mamá</span>
        </Link>
      )}
    </div>
  );
}
