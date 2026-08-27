"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProgreso,
  marcarPraxiaHecha,
  factorTiempoPorEdad,
  registrarTiempoPracticado,
  segundosRestantesHoy,
  calcularRacha,
} from "@/lib/progress";
import { siguientePasoSesion } from "@/lib/sesion";
import { NIVELES_PRAXIAS, TODAS_LAS_PRAXIAS, type Praxia } from "@/lib/praxias-data";
import { useHablar } from "@/hooks/useHablar";
import { BotonEscuchar } from "@/components/app/BotonEscuchar";
import { Mascota } from "@/components/app/Mascota";
import { Celebracion } from "@/components/app/Celebracion";
import { PasosEjercicio } from "@/components/app/PasosEjercicio";
import { PASOS_EJERCICIOS } from "@/lib/praxias-pasos";
import { VideoCompanero } from "@/components/app/VideoCompanero";
import { RevelacionPremio } from "@/components/app/RevelacionPremio";
import { SesionCompleta } from "@/components/app/SesionCompleta";
import { MonedaVolando } from "@/components/app/MonedaVolando";
import { reproducirSonidoMonedas } from "@/lib/sonidoMonedas";
import {
  IconCheck,
  IconChevronLeft,
  IconLock,
  IconSparkles,
} from "@/components/app/icons";

function siguientePraxia(actual: Praxia): Praxia | null {
  const idx = TODAS_LAS_PRAXIAS.findIndex((p) => p.id === actual.id);
  if (idx === -1 || idx === TODAS_LAS_PRAXIAS.length - 1) return null;
  return TODAS_LAS_PRAXIAS[idx + 1];
}

/** true si `actual` es el último ejercicio de su nivel (Calentamiento,
 * Fuerza y Puntería, Casi Listos) — ahí se corta el paso automático a
 * "Siguiente" para celebrar la sección completa antes de seguir. */
function esUltimoDeSeccion(actual: Praxia): boolean {
  const nivel = NIVELES_PRAXIAS.find((n) =>
    n.praxias.some((p) => p.id === actual.id)
  );
  if (!nivel) return false;
  return nivel.praxias[nivel.praxias.length - 1].id === actual.id;
}

const FIGURITA_POR_NIVEL = [
  "praxias-calentamiento",
  "praxias-fuerza",
  "praxias-casi-listos",
];

/** id exacto de la figurita que corresponde al nivel de `actual` — se usa
 * SOLO cuando ya se sabe que es fin de sección, para pedirle a
 * RevelacionPremio ese premio puntual (nunca "cualquiera no visto"). */
function figuritaDeSeccion(actual: Praxia): string | null {
  const idx = NIVELES_PRAXIAS.findIndex((n) =>
    n.praxias.some((p) => p.id === actual.id)
  );
  return idx === -1 ? null : FIGURITA_POR_NIVEL[idx];
}

/** Muestra el video del León haciendo el ejercicio de verdad si existe;
 * si no, cae al compañero + emoji genérico. */
function DemoEjercicio({
  ex,
  tema,
}: {
  ex: Praxia;
  tema: "leon" | "pirata";
}) {
  const src = ex.videoDemo?.[tema];
  const nombrePersonaje = tema === "pirata" ? "El Pirata" : "El León";
  const pasos = PASOS_EJERCICIOS[ex.id];

  if (pasos) {
    return (
      <>
        <PasosEjercicio pasos={pasos} />
        <p className="mt-2 text-xs font-bold text-txt-tertiary">
          Seguí los pasos en orden
        </p>
        {src && (
          <div className="mt-4 flex flex-col items-center">
            <VideoCompanero src={src} size={96} />
            <p className="mt-1 text-xs font-bold text-txt-tertiary">
              {nombrePersonaje} también lo intenta contigo
            </p>
          </div>
        )}
      </>
    );
  }

  if (src) {
    return (
      <div className="flex flex-col items-center">
        <VideoCompanero src={src} size={176} />
        <p className="mt-1 text-xs font-bold text-txt-tertiary">
          {nombrePersonaje} también lo intenta contigo
        </p>
      </div>
    );
  }

  return (
    <>
      <Mascota tema={tema} size={84} />
      <p className="mt-1 text-xs font-bold text-txt-tertiary">
        {tema === "pirata" ? "El Pirata" : "El León"} lo hace contigo
      </p>
      <span className="text-7xl mt-4 mb-2" aria-hidden="true">
        {ex.emoji}
      </span>
    </>
  );
}

export default function PraxiasPage() {
  return (
    <Suspense fallback={null}>
      <PraxiasContenido />
    </Suspense>
  );
}

function PraxiasContenido() {
  const router = useRouter();
  const params = useSearchParams();
  const p = useProgreso();
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const [nivelActivo, setNivelActivo] = useState<number | null>(null);
  const [activa, setActiva] = useState<Praxia | null>(null);
  const [monedaTrigger, setMonedaTrigger] = useState(0);

  // Si llegamos desde otra sección de la sesión continua (?ex=id), abrimos
  // ese ejercicio directo en vez de mostrar la lista de niveles.
  useEffect(() => {
    const exId = params.get("ex");
    if (!exId) return;
    const ex = TODAS_LAS_PRAXIAS.find((e) => e.id === exId);
    if (ex) setActiva(ex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [hecho, setHecho] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [cuenta, setCuenta] = useState<number | null>(null);
  const [segundos, setSegundos] = useState(0);
  const [premioAReclamar, setPremioAReclamar] = useState<string | null>(null);
  const [accesorioAReclamar, setAccesorioAReclamar] = useState<string | null>(
    null
  );
  const [idParaSeguirSesion, setIdParaSeguirSesion] = useState<string | null>(
    null
  );
  const [sesionCompleta, setSesionCompleta] = useState(false);
  const { hablar } = useHablar();

  // Cada vez que se cierra un nivel de Praxias se muestran los premios
  // (figurita, y el accesorio si fue el último nivel de todos, en cola) —
  // RECIÉN cuando el niño cerró todo lo pendiente saltamos solos al
  // siguiente ejercicio (de Praxias o de otra sección) — así nunca se pisa
  // el festejo del premio con la sesión continua, y se respeta el cupo de
  // minutos del día.
  useEffect(() => {
    if (!idParaSeguirSesion || premioAReclamar || accesorioAReclamar) return;
    const idActual = idParaSeguirSesion;
    setIdParaSeguirSesion(null);
    if (segundosRestantesHoy(p) <= 0) {
      setSesionCompleta(true);
      return;
    }
    const sig = siguientePasoSesion(p, tema, "praxia", idActual);
    if (sig) router.push(sig.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParaSeguirSesion, premioAReclamar, accesorioAReclamar]);

  useEffect(() => {
    setIniciado(false);
    setCuenta(null);
  }, [activa]);

  // La indicación se escucha apenas se abre el ejercicio (pantalla "¿Estás
  // listo?"), no recién cuando arranca el cronómetro — así el niño ya sabe
  // qué hacer antes de tocar "Empezar" y de la cuenta regresiva.
  useEffect(() => {
    if (!activa) return;
    hablar(activa.instruccion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa]);

  useEffect(() => {
    if (!activa || !iniciado) return;
    setSegundos(Math.round(activa.duracionSeg * factorTiempoPorEdad(p.edad)));
  }, [activa, iniciado, p.edad]);

  useEffect(() => {
    if (!activa || !iniciado || hecho || segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [activa, iniciado, hecho, segundos]);

  // el cronómetro se escucha en voz alta (10, 9, 8...) además de verse,
  // para niños que todavía no leen números
  useEffect(() => {
    if (!activa || !iniciado || hecho || segundos <= 0) return;
    hablar(String(segundos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segundos]);

  useEffect(() => {
    if (cuenta === null) return;
    if (cuenta === 0) {
      const t = setTimeout(() => {
        setIniciado(true);
        setCuenta(null);
      }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCuenta((c) => (c ?? 1) - 1), 700);
    return () => clearTimeout(t);
  }, [cuenta]);

  if (activa && !iniciado) {
    return (
      <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
        <button
          onClick={() => setActiva(null)}
          aria-label="Atrás"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          {cuenta !== null ? (
            <span className="font-display font-extrabold text-8xl text-brand-primary animate-pop-in">
              {cuenta > 0 ? cuenta : "¡Ya!"}
            </span>
          ) : (
            <>
              <DemoEjercicio ex={activa} tema={tema} />
              <h1 className="mt-3 font-display font-extrabold text-2xl text-txt-primary text-balance">
                {activa.nombre}
              </h1>
              <div className="mt-4 flex items-center gap-3 max-w-72">
                <p className="text-base text-txt-secondary leading-relaxed">
                  {activa.instruccion}
                </p>
                <BotonEscuchar texto={activa.instruccion} />
              </div>
            </>
          )}
        </div>

        {cuenta === null && (
          <button
            onClick={() => setCuenta(3)}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
          >
            ¿Estás listo? Empezar
          </button>
        )}
      </div>
    );
  }

  if (activa) {
    const siguiente = siguientePraxia(activa);
    const finDeSeccion = hecho && esUltimoDeSeccion(activa);
    return (
      <div className="flex-1 flex flex-col px-5 pt-4 pb-8">
        <Celebracion activa={hecho} />
        <MonedaVolando trigger={monedaTrigger} />
        <button
          onClick={() => {
            setActiva(null);
            setHecho(false);
          }}
          aria-label="Atrás"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <DemoEjercicio ex={activa} tema={tema} />
          <h1 className="mt-3 font-display font-extrabold text-2xl text-txt-primary text-balance">
            {activa.nombre}
          </h1>

          <span
            className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
              segundos > 0
                ? "bg-brand-accent-soft text-brand-accent"
                : "bg-brand-secondary-soft text-txt-on-secondary-soft"
            }`}
          >
            ⏱ {segundos > 0 ? `${segundos}s` : "¡Listo!"}
          </span>

          <div className="mt-4 flex items-center gap-3 max-w-72">
            <p className="text-base text-txt-secondary leading-relaxed">
              {activa.instruccion}
            </p>
            <BotonEscuchar texto={activa.instruccion} />
          </div>

          {hecho && !finDeSeccion && (
            <div className="mt-6 flex items-center gap-2 text-brand-secondary animate-pop-in">
              <IconSparkles className="h-6 w-6" />
              <p className="text-lg font-bold">¡Bien hecho!</p>
            </div>
          )}

          {finDeSeccion && (
            <div className="mt-6 flex flex-col items-center gap-2 animate-pop-in">
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

        {!hecho ? (
          <button
            onClick={() => {
              marcarPraxiaHecha(activa.id);
              registrarTiempoPracticado(
                Math.round(activa.duracionSeg * factorTiempoPorEdad(p.edad))
              );
              reproducirSonidoMonedas();
              setMonedaTrigger(Date.now());
              setHecho(true);
            }}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
          >
            Ya lo intenté
          </button>
        ) : finDeSeccion ? (
          <button
            onClick={() => {
              setPremioAReclamar(figuritaDeSeccion(activa));
              // Elevador cierra la sección Y toda la app de Praxias a la vez —
              // el accesorio queda en cola, se muestra recién al cerrar la figurita.
              if (!siguientePraxia(activa)) setAccesorioAReclamar("sombrero");
              setIdParaSeguirSesion(activa.id);
              setActiva(null);
              setNivelActivo(null);
              setHecho(false);
            }}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
          >
            Reclamar mi premio
          </button>
        ) : siguiente ? (
          <button
            onClick={() => {
              setActiva(siguiente);
              setHecho(false);
            }}
            className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={() => {
              setActiva(null);
              setNivelActivo(null);
              setHecho(false);
            }}
            className="w-full rounded-full border-2 border-border-strong text-txt-primary font-display font-bold text-base py-4"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  if (nivelActivo !== null) {
    const nivel = NIVELES_PRAXIAS[nivelActivo];
    return (
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
        <button
          onClick={() => setNivelActivo(null)}
          aria-label="Atrás"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="mt-2 font-display font-extrabold text-2xl text-txt-primary">
          {nivel.nombre}
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {nivel.praxias.map((ex) => {
            const hechoYa = p.praxiasHechas.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => setActiva(ex)}
                className="relative rounded-2xl border border-border-default bg-surface-primary p-4 text-left transition-transform active:scale-[0.98]"
              >
                {hechoYa && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-txt-on-brand">
                    <IconCheck className="h-3 w-3" />
                  </span>
                )}
                <span className="text-4xl" aria-hidden="true">
                  {ex.emoji}
                </span>
                <p className="mt-2 font-display font-bold text-sm text-txt-primary leading-tight">
                  {ex.nombre}
                </p>
              </button>
            );
          })}
        </div>
      </div>
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
        Gimnasia de Lengua
      </h1>
      <p className="mt-1 text-sm text-txt-secondary">
        3 niveles para preparar la lengua antes de decir la R.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {NIVELES_PRAXIAS.map((nivel, ni) => {
          const hechos = nivel.praxias.filter((ex) =>
            p.praxiasHechas.includes(ex.id)
          ).length;
          const completo = hechos === nivel.praxias.length;
          const desbloqueado =
            ni === 0 ||
            NIVELES_PRAXIAS[ni - 1].praxias.every((ex) =>
              p.praxiasHechas.includes(ex.id)
            );
          return (
            <button
              key={nivel.nombre}
              onClick={() => desbloqueado && setNivelActivo(ni)}
              disabled={!desbloqueado}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-transform ${
                desbloqueado
                  ? "border-border-default bg-surface-primary active:scale-[0.98]"
                  : "border-border-default bg-surface-secondary opacity-60"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display font-extrabold text-sm ${
                  completo
                    ? "bg-brand-secondary text-txt-on-brand"
                    : "bg-brand-primary-soft text-txt-on-primary-soft"
                }`}
              >
                {desbloqueado ? ni + 1 : <IconLock className="h-5 w-5" />}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold text-base text-txt-primary">
                  {desbloqueado ? nivel.nombre : "Bloqueado"}
                </p>
                <p className="text-xs text-txt-secondary">
                  {desbloqueado
                    ? `${hechos}/${nivel.praxias.length} ejercicios`
                    : "Completa el nivel anterior"}
                </p>
              </div>
              {completo && (
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
