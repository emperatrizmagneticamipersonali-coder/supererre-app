"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProgreso,
  marcarSonidoHecho,
  factorTiempoPorEdad,
  registrarTiempoPracticado,
  segundosRestantesHoy,
  type SeveridadR,
} from "@/lib/progress";
import { siguientePasoSesion } from "@/lib/sesion";
import { MODOS } from "@/lib/sonidos-data";
import { useRugidoDetector } from "@/hooks/useRugidoDetector";
import { useHablar } from "@/hooks/useHablar";
import { BotonEscuchar } from "@/components/app/BotonEscuchar";
import { Celebracion } from "@/components/app/Celebracion";
import { VideoCompanero } from "@/components/app/VideoCompanero";
import { RevelacionPremio } from "@/components/app/RevelacionPremio";
import { MonedaVolando } from "@/components/app/MonedaVolando";
import { reproducirSonidoMonedas } from "@/lib/sonidoMonedas";
import {
  IconCheck,
  IconChevronLeft,
  IconMic,
  IconPlay,
  IconSparkles,
} from "@/components/app/icons";

export default function SonidosPage() {
  return (
    <Suspense fallback={null}>
      <SonidosContenido />
    </Suspense>
  );
}

function SonidosContenido() {
  const router = useRouter();
  const params = useSearchParams();
  const p = useProgreso();
  const [modoOverride, setModoOverride] = useState<keyof typeof MODOS | null>(
    null
  );
  const modo = modoOverride ?? (p.interes === "pirata" ? "pirata" : "leon");
  const [sonidoId, setSonidoId] = useState<string | null>(null);
  const [premioAReclamar, setPremioAReclamar] = useState<string | null>(null);
  const [accesorioAReclamar, setAccesorioAReclamar] = useState<string | null>(
    null
  );
  const [idParaSeguirSesion, setIdParaSeguirSesion] = useState<string | null>(
    null
  );

  // Si llegamos desde otra sección de la sesión continua (?ex=id).
  useEffect(() => {
    const exId = params.get("ex");
    if (exId) setSonidoId(exId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ver comentario equivalente en app/praxias/page.tsx: se espera a que se
  // cierren los premios en cola antes de saltar solo al siguiente ejercicio.
  useEffect(() => {
    if (!idParaSeguirSesion || premioAReclamar || accesorioAReclamar) return;
    const idActual = idParaSeguirSesion;
    setIdParaSeguirSesion(null);
    if (segundosRestantesHoy(p) <= 0) return;
    const sig = siguientePasoSesion(p, modo, "sonido", idActual);
    if (sig) router.push(sig.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParaSeguirSesion, premioAReclamar, accesorioAReclamar]);

  const data = MODOS[modo];
  const sonido = data.sonidos.find((s) => s.id === sonidoId) || null;
  const idxSonido = data.sonidos.findIndex((s) => s.id === sonidoId);
  const siguienteSonido =
    idxSonido >= 0 && idxSonido < data.sonidos.length - 1
      ? data.sonidos[idxSonido + 1]
      : null;

  if (sonido) {
    return (
      <SonidoDetector
        key={sonido.id}
        emoji={data.emoji}
        nombre={sonido.nombre}
        pista={sonido.pista}
        videoDemo={sonido.videoDemo}
        edad={p.edad}
        severidad={p.severidadR}
        onVolver={() => setSonidoId(null)}
        onSiguiente={siguienteSonido ? () => setSonidoId(siguienteSonido.id) : null}
        onDetectado={() => marcarSonidoHecho(`${modo}-${sonido.id}`)}
        onReclamar={() => {
          // el modo León es el único con figurita/accesorio definidos por ahora
          if (modo === "leon") {
            setPremioAReclamar("sonidos-leon");
            setAccesorioAReclamar("gafas");
          }
          setIdParaSeguirSesion(sonido.id);
          setSonidoId(null);
        }}
      />
    );
  }

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
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        El Espejo del León
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        Elige un modo y ruge frente al espejo.
      </p>

      <div className="mt-5 flex gap-2">
        {(Object.keys(MODOS) as (keyof typeof MODOS)[]).map((m) => (
          <button
            key={m}
            onClick={() => setModoOverride(m)}
            className={`flex-1 rounded-2xl border p-3 text-center transition-colors ${
              modo === m
                ? "border-brand-primary bg-brand-primary-soft"
                : "border-border-default bg-surface-primary"
            }`}
          >
            <span className="text-4xl">{MODOS[m].emoji}</span>
            <p className="mt-1 text-sm font-bold text-txt-primary">
              {MODOS[m].nombre}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {data.sonidos.map((s, i) => {
          const hechoYa = p.sonidosHechos.includes(`${modo}-${s.id}`);
          return (
            <button
              key={s.id}
              onClick={() => setSonidoId(s.id)}
              className="flex items-center gap-4 rounded-2xl border border-border-default bg-surface-primary p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary-soft text-2xl">
                {data.emoji}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-sm text-txt-primary">
                  Nivel {i + 1} · {s.nombre}
                </p>
                <p className="text-xs text-txt-secondary">{s.pista}</p>
              </div>
              {hechoYa && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
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

const DURACION_SONIDO_SEG = 8;

function SonidoDetector({
  emoji,
  nombre,
  pista,
  videoDemo,
  edad,
  severidad,
  onVolver,
  onSiguiente,
  onDetectado,
  onReclamar,
}: {
  emoji: string;
  nombre: string;
  pista: string;
  videoDemo?: string;
  edad: number;
  severidad?: SeveridadR;
  onVolver: () => void;
  onSiguiente: (() => void) | null;
  onDetectado: () => void;
  onReclamar: () => void;
}) {
  const { estado, nivelVoz, empezar } = useRugidoDetector(edad, severidad);
  const { hablar } = useHablar();
  const [segundos, setSegundos] = useState(
    Math.round(DURACION_SONIDO_SEG * factorTiempoPorEdad(edad))
  );
  const [monedaTrigger, setMonedaTrigger] = useState(0);
  const escala = 1 + Math.min(nivelVoz, 100) / 220;
  const marco = estado === "detectado";
  const completado = estado === "detectado" || estado === "sin-microfono";
  const completadoSinSiguiente = completado && !onSiguiente;

  useEffect(() => {
    if (estado === "detectado" || estado === "sin-microfono") {
      onDetectado();
      registrarTiempoPracticado(
        Math.round(DURACION_SONIDO_SEG * factorTiempoPorEdad(edad))
      );
      reproducirSonidoMonedas();
      setMonedaTrigger(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  useEffect(() => {
    hablar(pista);
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
          className="relative flex h-48 w-48 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
            boxShadow:
              "0 0 0 6px var(--surface-primary), 0 0 0 11px var(--brand-primary), 0 0 0 15px var(--surface-primary), 0 0 0 19px var(--brand-secondary)",
            transform: estado === "escuchando" ? `scale(${escala})` : undefined,
          }}
          aria-label={`Practicar ${nombre}`}
        >
          {videoDemo ? (
            <VideoCompanero src={videoDemo} size={148} />
          ) : (
            <span className="text-8xl select-none">{emoji}</span>
          )}
          {estado === "idle" && (
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
              <IconPlay className="h-5 w-5" />
            </span>
          )}
        </button>

        <h1 className="mt-6 font-display font-extrabold text-xl text-txt-primary">
          {nombre}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-base text-txt-secondary">
            Di: <strong className="text-txt-primary">{pista}</strong>
          </p>
          <BotonEscuchar texto={pista} />
        </div>

        {marco && !completadoSinSiguiente && (
          <div className="mt-4 flex items-center gap-2 text-brand-secondary animate-pop-in">
            <IconSparkles className="h-5 w-5" />
            <p className="font-bold">¡Muy bien!</p>
          </div>
        )}
        {estado === "sin-microfono" && !completadoSinSiguiente && (
          <p className="mt-4 text-sm text-txt-secondary max-w-64">
            No pudimos usar el micrófono, pero igual anotamos tu intento.
          </p>
        )}
        {completadoSinSiguiente && (
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

      {(marco || estado === "sin-microfono") && (
        <button
          onClick={onSiguiente ?? onReclamar}
          className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 shadow-md transition-colors"
        >
          {onSiguiente ? "Siguiente" : "Reclamar mi premio"}
        </button>
      )}
    </div>
  );
}
