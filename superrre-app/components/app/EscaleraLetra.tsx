"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProgreso,
  marcarNivelEscaleraHecho,
  factorTiempoPorEdad,
  registrarTiempoPracticado,
  segundosRestantesHoy,
  calcularRacha,
  type SeveridadR,
} from "@/lib/progress";
import { siguientePasoSesion } from "@/lib/sesion";
import {
  gruposDe,
  INSTRUCCION_POR_TIPO,
  type NivelEscalera,
} from "@/lib/escalera-data";
import { useRugidoDetector } from "@/hooks/useRugidoDetector";
import { useHablar } from "@/hooks/useHablar";
import { BotonEscuchar } from "@/components/app/BotonEscuchar";
import { Mascota } from "@/components/app/Mascota";
import { Celebracion } from "@/components/app/Celebracion";
import { RevelacionPremio } from "@/components/app/RevelacionPremio";
import { SesionCompleta } from "@/components/app/SesionCompleta";
import { MonedaVolando } from "@/components/app/MonedaVolando";
import { reproducirSonidoMonedas } from "@/lib/sonidoMonedas";
import {
  IconChevronLeft,
  IconLock,
  IconMic,
  IconPlay,
  IconSparkles,
  IconStarFilled,
} from "@/components/app/icons";

type Tono = "primary" | "secondary" | "accent";

const TONO_VAR: Record<Tono, string> = {
  primary: "--brand-primary",
  secondary: "--brand-secondary",
  accent: "--brand-accent",
};

const TONO_SOLIDO: Record<Tono, string> = {
  primary: "bg-brand-primary",
  secondary: "bg-brand-secondary",
  accent: "bg-brand-accent",
};

const CICLO_TONOS: Tono[] = ["primary", "secondary", "accent"];

const POS_X = [50, 76, 24];
const GAP_Y = 84;
const PAD_TOP = 56;

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

export function EscaleraLetra(props: {
  letra: string;
  titulo: string;
  subtitulo: string;
  /** true cuando el acceso ya se filtró antes de llegar aquí (ej. la letra L
   * solo se llega tras dominar la R) — así que dentro, todos los peldaños
   * abren directo, sin repetir el gate de plan gratis/pago. */
  gruposSiempreAbiertos?: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <EscaleraLetraContenido {...props} />
    </Suspense>
  );
}

function EscaleraLetraContenido({
  letra,
  titulo,
  subtitulo,
  gruposSiempreAbiertos = false,
}: {
  letra: string;
  titulo: string;
  subtitulo: string;
  gruposSiempreAbiertos?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const p = useProgreso();
  const grupos = gruposDe(letra);
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const tipoSesion = letra === "L" ? "escalera-l" : "escalera-r";
  const [nivelActivo, setNivelActivo] = useState<NivelEscalera | null>(null);
  const [premioAReclamar, setPremioAReclamar] = useState<string | null>(null);
  const [accesorioAReclamar, setAccesorioAReclamar] = useState<string | null>(
    null
  );
  const [idParaSeguirSesion, setIdParaSeguirSesion] = useState<string | null>(
    null
  );
  const [sesionCompleta, setSesionCompleta] = useState(false);

  // Si llegamos desde otra sección de la sesión continua (?ex=id).
  useEffect(() => {
    const exId = params.get("ex");
    if (!exId) return;
    const nivel = grupos
      .flatMap((g) => g.niveles)
      .find((n) => n.id === exId);
    if (nivel) setNivelActivo(nivel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ver comentario equivalente en app/praxias/page.tsx.
  useEffect(() => {
    if (!idParaSeguirSesion || premioAReclamar || accesorioAReclamar) return;
    const idActual = idParaSeguirSesion;
    setIdParaSeguirSesion(null);
    if (segundosRestantesHoy(p) <= 0) {
      setSesionCompleta(true);
      return;
    }
    const sig = siguientePasoSesion(p, tema, tipoSesion, idActual);
    if (sig) router.push(sig.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParaSeguirSesion, premioAReclamar, accesorioAReclamar]);

  if (nivelActivo) {
    const silaba = nivelActivo.id.split("-")[0];
    const esUltimoPeldaño =
      grupos[grupos.length - 1]?.silaba === silaba;
    return (
      <NivelDetector
        nivel={nivelActivo}
        edad={p.edad}
        severidad={p.severidadR}
        onVolver={() => setNivelActivo(null)}
        onDetectado={() => marcarNivelEscaleraHecho(nivelActivo.id)}
        onReclamar={() => {
          setPremioAReclamar(`escalera-${silaba.toLowerCase()}`);
          // el último peldaño de la letra completa la letra entera —
          // la capa (R) o la corona (L) se muestra recién al cerrar la figurita
          if (esUltimoPeldaño) {
            setAccesorioAReclamar(letra === "L" ? "corona" : "capa");
          }
          setIdParaSeguirSesion(nivelActivo.id);
          setNivelActivo(null);
        }}
      />
    );
  }

  const pasosFlat = grupos.flatMap((grupo, gi) =>
    grupo.niveles.map((nivel) => ({ nivel, grupoIndex: gi, silaba: grupo.silaba }))
  );

  const desbloqueado: boolean[] = [];
  let previoCompleto = true;
  pasosFlat.forEach((paso, i) => {
    const grupoAbierto =
      gruposSiempreAbiertos || paso.grupoIndex === 0 || p.plan === "completo";
    desbloqueado[i] = previoCompleto && grupoAbierto;
    previoCompleto = p.palabrasHechas.includes(paso.nivel.id);
  });

  let indiceActual = pasosFlat.findIndex(
    (paso, i) => desbloqueado[i] && !p.palabrasHechas.includes(paso.nivel.id)
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

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <RevelacionPremio
        figuritaId={premioAReclamar}
        accesorioId={premioAReclamar ? null : accesorioAReclamar}
        onCerrar={(tipo) => {
          if (tipo === "figurita") setPremioAReclamar(null);
          else setAccesorioAReclamar(null);
        }}
      />
      {sesionCompleta && (
        <SesionCompleta
          tema={tema}
          minutosHoy={Math.round(p.segundosHoy / 60)}
          racha={calcularRacha(p.diasActivos).actual}
          monedas={p.monedas}
          onCerrar={() => setSesionCompleta(false)}
        />
      )}
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        {titulo}
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">{subtitulo}</p>

      {grupos.map((grupo, gi) => {
        const offset = contadorGlobal;
        contadorGlobal += grupo.niveles.length;
        const tono = CICLO_TONOS[gi % CICLO_TONOS.length];
        const altura = PAD_TOP + (grupo.niveles.length - 1) * GAP_Y + 48;
        const puntos = grupo.niveles.map((_, i) => ({
          x: POS_X[i % POS_X.length],
          y: PAD_TOP + i * GAP_Y,
        }));
        const puntosHechos = puntos.filter((_, i) => desbloqueado[offset + i]);

        return (
          <div key={grupo.silaba} className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary text-center">
              Peldaño {grupo.silaba}
            </p>

            <div className="relative mt-4" style={{ height: altura }}>
              <svg
                viewBox={`0 0 100 ${altura}`}
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
                {puntosHechos.length > 1 && (
                  <path
                    d={construirCurva(puntosHechos)}
                    fill="none"
                    stroke="var(--brand-secondary)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              {grupo.niveles.map((nivel, i) => {
                const gi2 = offset + i;
                const abierta = desbloqueado[gi2];
                const completo = p.palabrasHechas.includes(nivel.id);
                const esActual = gi2 === indiceActual && abierta && !completo;
                const punto = puntos[i];

                const circulo = (
                  <div
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display font-extrabold text-sm transition-transform active:scale-95 ${
                      abierta
                        ? `${TONO_SOLIDO[tono]} text-txt-on-brand`
                        : "bg-surface-tertiary"
                    }`}
                    style={
                      abierta
                        ? {
                            boxShadow: `0 3px 0 0 color-mix(in oklab, var(${TONO_VAR[tono]}) 55%, black)`,
                          }
                        : undefined
                    }
                  >
                    {abierta ? (
                      i + 1
                    ) : (
                      <IconLock className="h-5 w-5 text-txt-tertiary" />
                    )}
                    {completo && (
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-primary shadow-sm">
                        <IconStarFilled className="h-4 w-4 text-brand-primary" />
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
                  <div
                    key={nivel.id}
                    className={abierta ? "" : "cursor-not-allowed"}
                  >
                    {abierta ? (
                      <button
                        type="button"
                        onClick={() => setNivelActivo(nivel)}
                        aria-label={`${INSTRUCCION_POR_TIPO[nivel.tipo]}: ${nivel.texto}`}
                      >
                        {nodo}
                      </button>
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

      <button
        onClick={() => router.push("/app")}
        className="mt-8 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Volver al mapa
      </button>
    </div>
  );
}

const DURACION_NIVEL_SEG = 10;

function NivelDetector({
  nivel,
  edad,
  severidad,
  onVolver,
  onDetectado,
  onReclamar,
}: {
  nivel: NivelEscalera;
  edad: number;
  severidad?: SeveridadR;
  onVolver: () => void;
  onDetectado: () => void;
  onReclamar: () => void;
}) {
  const { estado, nivelVoz, empezar } = useRugidoDetector(edad, severidad);
  const { hablar } = useHablar();
  const [segundos, setSegundos] = useState(
    Math.round(DURACION_NIVEL_SEG * factorTiempoPorEdad(edad))
  );
  const [monedaTrigger, setMonedaTrigger] = useState(0);
  const escala = 1 + Math.min(nivelVoz, 100) / 220;
  const completado = estado === "detectado" || estado === "sin-microfono";
  // cada peldaño tiene exactamente 3 niveles (sílaba/palabra/oración,
  // índices 0/1/2) — el "-2" es siempre el último, ahí se completa la sección
  const finDeSeccion = completado && nivel.id.endsWith("-2");

  useEffect(() => {
    if (completado) {
      onDetectado();
      registrarTiempoPracticado(
        Math.round(DURACION_NIVEL_SEG * factorTiempoPorEdad(edad))
      );
      reproducirSonidoMonedas();
      setMonedaTrigger(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  useEffect(() => {
    hablar(nivel.texto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (estado !== "escuchando" || segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [estado, segundos]);

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
      <Celebracion activa={completado} />
      <MonedaVolando trigger={monedaTrigger} />
      <button
        onClick={onVolver}
        aria-label="Atrás"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {estado === "escuchando" && (
          <div className="mb-6 flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-brand-secondary uppercase tracking-wide flex items-center gap-2">
              <IconMic className="h-4 w-4" /> Escuchando…
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
                segundos > 0
                  ? "bg-brand-accent-soft text-brand-accent"
                  : "bg-brand-secondary-soft text-txt-on-secondary-soft"
              }`}
            >
              ⏱ {segundos > 0 ? `${segundos}s` : "¡Listo!"}
            </span>
          </div>
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
          aria-label={`Practicar ${nivel.texto}`}
        >
          <span className="font-display font-extrabold text-2xl text-txt-on-brand select-none px-3 leading-tight">
            {nivel.tipo === "silaba" ? nivel.texto : ""}
          </span>
          {nivel.tipo !== "silaba" && (
            <IconMic className="h-10 w-10 text-txt-on-brand" />
          )}
          {estado === "idle" && (
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
              <IconPlay className="h-5 w-5" />
            </span>
          )}
        </button>

        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-txt-tertiary">
          {INSTRUCCION_POR_TIPO[nivel.tipo]}
        </p>
        <div className="mt-2 flex items-center gap-3 max-w-72">
          <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
            &ldquo;{nivel.texto}&rdquo;
          </h1>
          <BotonEscuchar texto={nivel.texto} />
        </div>

        {estado === "detectado" && !finDeSeccion && (
          <div className="mt-4 flex items-center gap-2 text-brand-secondary animate-pop-in">
            <IconSparkles className="h-5 w-5" />
            <p className="font-bold">¡Muy bien dicho!</p>
          </div>
        )}
        {estado === "sin-microfono" && !finDeSeccion && (
          <p className="mt-4 text-sm text-txt-secondary max-w-64">
            No pudimos usar el micrófono, pero igual anotamos tu intento.
          </p>
        )}
        {finDeSeccion && (
          <div className="mt-4 flex flex-col items-center gap-2 animate-pop-in">
            <span className="text-5xl" aria-hidden="true">
              🎉
            </span>
            <p className="text-lg font-bold text-txt-primary text-balance">
              ¡Terminaste esta sección de ejercicios!
            </p>
            <p className="text-sm text-txt-secondary">Te ganaste un premio.</p>
          </div>
        )}
      </div>

      {(estado === "detectado" || estado === "sin-microfono") && (
        <button
          onClick={finDeSeccion ? onReclamar : onVolver}
          className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
        >
          {finDeSeccion ? "Reclamar mi premio" : "Continuar"}
        </button>
      )}
    </div>
  );
}
