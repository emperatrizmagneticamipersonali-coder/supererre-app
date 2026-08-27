"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useProgreso,
  minijuegoDesbloqueado,
  marcarMemoramaGanado,
  equiparAccesorio,
  comprarAccesorio,
} from "@/lib/progress";
import { letraCompleta } from "@/lib/escalera-data";
import {
  PALABRAS_MEMORAMA_POR_LETRA,
  PAREJAS_POR_NIVEL,
} from "@/lib/memorama-data";
import { FIGURITAS, figuritasLogradas } from "@/lib/figuritas-data";
import {
  ACCESORIOS,
  ACCESORIOS_COMPRABLES,
  accesoriosLogrados,
  accesorioDesbloqueado,
  accesorioPorId,
  type Accesorio,
} from "@/lib/accesorios-data";
import { IconSparkles, IconLock, IconCoin } from "@/components/app/icons";
import { Mascota } from "@/components/app/Mascota";
import { Celebracion } from "@/components/app/Celebracion";

type Carta = {
  id: number;
  palabra: string;
  emoji: string;
  volteada: boolean;
  emparejada: boolean;
};

/** Dibuja un accesorio sobre el retrato — imagen real si la tiene (los 4
 * premios de logro), o emoji si no (los de la tienda, sin arte a medida
 * todavía). */
function AccesorioOverlay({ acc }: { acc: Accesorio }) {
  const estilo = {
    top: `${acc.top}%`,
    left: `${acc.left}%`,
    transform: "translate(-50%, -50%)",
    filter: "drop-shadow(0 3px 4px rgba(34,51,46,0.35))",
  };
  if (acc.imagen) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={acc.imagen}
        alt=""
        className="absolute select-none animate-pop-in"
        style={{ ...estilo, width: acc.ancho }}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className="absolute select-none animate-pop-in"
      style={{ ...estilo, fontSize: acc.tamaño }}
      aria-hidden="true"
    >
      {acc.emoji}
    </span>
  );
}

type EstadoArrastre = { acc: Accesorio; x: number; y: number } | null;

/** Arrastrar un accesorio ya conseguido hasta el retrato del personaje para
 * ponérselo — el niño lo mueve con el dedo hasta la cabeza/cuerpo del León
 * en vez de que quede una posición fija adivinada. Tocarlo (sin arrastrar)
 * sigue funcionando igual que antes, esto es un agregado, no un reemplazo. */
function useArrastrarParaVestir(zonaRef: RefObject<HTMLDivElement | null>) {
  const [arrastre, setArrastre] = useState<EstadoArrastre>(null);

  function iniciarArrastre(e: React.PointerEvent, acc: Accesorio) {
    setArrastre({ acc, x: e.clientX, y: e.clientY });
  }

  useEffect(() => {
    if (!arrastre) return;

    function mover(e: PointerEvent) {
      setArrastre((a) => (a ? { ...a, x: e.clientX, y: e.clientY } : a));
    }

    function soltar(e: PointerEvent) {
      const zona = zonaRef.current;
      if (zona) {
        const r = zona.getBoundingClientRect();
        const adentro =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        if (adentro) {
          setArrastre((actual) => {
            if (actual) equiparAccesorio(actual.acc.id);
            return null;
          });
          return;
        }
      }
      setArrastre(null);
    }

    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar, { once: true });
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrastre !== null]);

  return { arrastre, iniciarArrastre };
}

function barajar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function generarCartas(letra: string, nivel: number): Carta[] {
  const banco = PALABRAS_MEMORAMA_POR_LETRA[letra];
  const cantidad = Math.min(
    PAREJAS_POR_NIVEL[nivel] ?? PAREJAS_POR_NIVEL[PAREJAS_POR_NIVEL.length - 1],
    banco.length
  );
  const elegidas = barajar(banco).slice(0, cantidad);
  return barajar([...elegidas, ...elegidas]).map((item, i) => ({
    id: i,
    palabra: item.palabra,
    emoji: item.emoji,
    volteada: false,
    emparejada: false,
  }));
}

export default function PremiosPage() {
  return (
    <Suspense fallback={null}>
      <PremiosContenido />
    </Suspense>
  );
}

/** Cuadrícula de referencia (cada 10% del retrato) — solo visible en modo
 * calibración, para poder leer a ojo dónde cae cada punto. */
function CuadriculaCalibracion() {
  const marcas = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {marcas.map((v) => (
        <div
          key={`v${v}`}
          className="absolute top-0 bottom-0 border-l border-red-500/50"
          style={{ left: `${v}%` }}
        />
      ))}
      {marcas.map((v) => (
        <div
          key={`h${v}`}
          className="absolute left-0 right-0 border-t border-red-500/50"
          style={{ top: `${v}%` }}
        />
      ))}
    </div>
  );
}

type AjusteManual = { top: number; left: number; ancho: number };

function PremiosContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const calibrando = searchParams.get("calibrar") === "1";
  const p = useProgreso();
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const mascota = tema === "pirata" ? "🏴‍☠️" : "🦁";
  const retratoRef = useRef<HTMLDivElement>(null);
  const { arrastre, iniciarArrastre } = useArrastrarParaVestir(retratoRef);

  const letraLDisponible = letraCompleta("R", p.palabrasHechas);
  const [pestaña, setPestaña] = useState<"memorama" | "album" | "vestir">(
    "memorama"
  );
  const [letra, setLetra] = useState<"R" | "L">("R");
  const [nivel, setNivel] = useState(0);

  const [cartas, setCartas] = useState<Carta[]>(() => generarCartas("R", 0));
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [jugando, setJugando] = useState(false);
  const [gano, setGano] = useState(false);
  const [itemAConfirmar, setItemAConfirmar] = useState<Accesorio | null>(null);
  const [ajusteManual, setAjusteManual] = useState<AjusteManual | null>(null);
  const [verCuadricula, setVerCuadricula] = useState(true);
  const [previsualizado, setPrevisualizado] = useState<string | null>(null);

  const disponible = p.plan === "completo" && minijuegoDesbloqueado(p);
  const accEquipadoId = p.accesorioEquipado;

  useEffect(() => {
    if (!calibrando || !accEquipadoId) {
      setAjusteManual(null);
      return;
    }
    const acc = accesorioPorId(accEquipadoId);
    if (acc) {
      setAjusteManual({ top: acc.top, left: acc.left, ancho: acc.ancho ?? 90 });
    }
  }, [calibrando, accEquipadoId]);

  useEffect(() => {
    if (jugando && !gano && cartas.every((c) => c.emparejada)) {
      setGano(true);
      marcarMemoramaGanado(letra);
    }
  }, [cartas, jugando, gano, letra]);

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

  function elegirLetra(nueva: "R" | "L") {
    setLetra(nueva);
    setNivel(0);
    setCartas(generarCartas(nueva, 0));
    setSeleccion([]);
    setBloqueado(false);
    setGano(false);
    setJugando(false);
  }

  function empezar() {
    setCartas(generarCartas(letra, nivel));
    setSeleccion([]);
    setBloqueado(false);
    setGano(false);
    setJugando(true);
  }

  function siguienteNivel() {
    const nuevoNivel = Math.min(nivel + 1, PAREJAS_POR_NIVEL.length - 1);
    setNivel(nuevoNivel);
    setCartas(generarCartas(letra, nuevoNivel));
    setSeleccion([]);
    setBloqueado(false);
    setGano(false);
    setJugando(true);
  }

  function voltear(id: number) {
    if (bloqueado || gano) return;
    const carta = cartas.find((c) => c.id === id);
    if (!carta || carta.volteada || carta.emparejada) return;
    if (seleccion.length === 2) return;

    const nuevas = cartas.map((c) =>
      c.id === id ? { ...c, volteada: true } : c
    );
    const nuevaSeleccion = [...seleccion, id];
    setCartas(nuevas);
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.length === 2) {
      setBloqueado(true);
      const [id1, id2] = nuevaSeleccion;
      const c1 = nuevas.find((c) => c.id === id1)!;
      const c2 = nuevas.find((c) => c.id === id2)!;

      if (c1.palabra === c2.palabra) {
        setTimeout(() => {
          setCartas((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, emparejada: true } : c
            )
          );
          setSeleccion([]);
          setBloqueado(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCartas((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, volteada: false } : c
            )
          );
          setSeleccion([]);
          setBloqueado(false);
        }, 900);
      }
    }
  }

  const figuritas = figuritasLogradas(p);
  const accesorios = accesoriosLogrados(p);
  const accEquipado = p.accesorioEquipado
    ? accesorioPorId(p.accesorioEquipado)
    : undefined;
  const accMostrado = previsualizado
    ? accesorioPorId(previsualizado)
    : accEquipado;
  const accParaMostrar: Accesorio | undefined =
    calibrando && ajusteManual && accEquipado
      ? { ...accEquipado, ...ajusteManual }
      : accMostrado;
  const alcanzaParaComprar = itemAConfirmar
    ? p.monedas >= itemAConfirmar.precio!
    : false;

  /** Tocar cualquier accesorio: si ya es tuyo, se lo pone/saca de una. Si
   * no, primero lo muestra en vista previa sobre el León y abre el diálogo
   * de compra — así el niño ve cómo le queda ANTES de decidir comprarlo. */
  function elegirAccesorio(a: Accesorio, yaLoTiene: boolean) {
    if (yaLoTiene) {
      setPrevisualizado(null);
      equiparAccesorio(p.accesorioEquipado === a.id ? null : a.id);
    } else {
      setPrevisualizado(a.id);
      setItemAConfirmar(a);
    }
  }

  function confirmarCompra() {
    if (!itemAConfirmar) return;
    if (comprarAccesorio(itemAConfirmar.id, itemAConfirmar.precio!)) {
      equiparAccesorio(itemAConfirmar.id);
    }
    setPrevisualizado(null);
    setItemAConfirmar(null);
  }

  function cancelarCompra() {
    setPrevisualizado(null);
    setItemAConfirmar(null);
  }

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Cofre de Premios
      </h1>

      <div className="mt-4 flex gap-2">
        {(
          [
            { id: "memorama", label: "Memorama" },
            { id: "album", label: "Álbum" },
            { id: "vestir", label: "Tienda" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setPestaña(t.id)}
            className={`flex-1 rounded-full border py-2 text-center text-sm font-display font-bold transition-colors ${
              pestaña === t.id
                ? "border-brand-primary bg-brand-primary-soft text-txt-on-primary-soft"
                : "border-border-default bg-surface-primary text-txt-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {pestaña === "memorama" && (
        <>
          <p className="mt-4 text-sm text-txt-secondary">
            Nivel {nivel + 1} · Encuentra las {cartas.length / 2} parejas de
            palabras con la {letra}.
          </p>

          {letraLDisponible && !jugando && (
            <div className="mt-4 flex gap-2">
              {(["R", "L"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => elegirLetra(l)}
                  className={`flex-1 rounded-2xl border p-3 text-center font-display font-bold transition-colors ${
                    letra === l
                      ? "border-brand-primary bg-brand-primary-soft text-txt-on-primary-soft"
                      : "border-border-default bg-surface-primary text-txt-primary"
                  }`}
                >
                  Letra {l}
                </button>
              ))}
            </div>
          )}

          {!jugando ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Mascota tema={tema} size={180} className="mb-4" />
              <button
                onClick={empezar}
                className="rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 btn-3d-primary transition-colors"
              >
                Jugar
              </button>
            </div>
          ) : gano ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-pop-in">
              <Celebracion activa={gano} mensaje="¡Lo lograste!" />
              <IconSparkles className="h-10 w-10 text-brand-primary mb-3" />
              <h2 className="font-display font-extrabold text-2xl text-txt-primary">
                ¡Encontraste todas las parejas!
              </h2>
              <p className="mt-2 text-sm text-txt-secondary">
                +1 estrella para tu colección
              </p>
              <button
                onClick={siguienteNivel}
                className="mt-6 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 btn-3d-primary transition-colors"
              >
                {nivel < PAREJAS_POR_NIVEL.length - 1
                  ? "Siguiente nivel: más cartas"
                  : "Jugar otra vez"}
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {cartas.map((c) => {
                const visible = c.volteada || c.emparejada;
                return (
                  <button
                    key={c.id}
                    onClick={() => voltear(c.id)}
                    disabled={visible}
                    aria-label={visible ? c.palabra : "Carta boca abajo"}
                    className={`relative flex aspect-square items-center justify-center rounded-2xl border p-2 text-center transition-transform active:scale-95 ${
                      c.emparejada
                        ? "border-brand-secondary bg-brand-secondary-soft"
                        : visible
                        ? "border-brand-primary bg-surface-primary"
                        : "border-border-default bg-brand-primary-soft"
                    }`}
                  >
                    {visible ? (
                      <span className="flex flex-col items-center gap-1 animate-pop-in">
                        <span className="text-3xl select-none" aria-hidden="true">
                          {c.emoji}
                        </span>
                        <span className="font-display font-extrabold text-xs text-txt-primary leading-tight">
                          {c.palabra}
                        </span>
                      </span>
                    ) : (
                      <span className="text-2xl select-none" aria-hidden="true">
                        {mascota}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {pestaña === "album" && (
        <>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary transition-[width] duration-500"
                style={{
                  width: `${(figuritas.length / FIGURITAS.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-bold text-txt-secondary tabular-nums shrink-0">
              {figuritas.length}/{FIGURITAS.length}
            </span>
          </div>
          <p className="mt-2 text-xs text-txt-tertiary">
            Ganás una figurita nueva cada vez que terminás una fase completa.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {FIGURITAS.map((f, i) => {
              const lograda = figuritas.some((g) => g.id === f.id);
              return (
                <div
                  key={f.id}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center animate-fade-up ${
                    lograda
                      ? "bg-surface-primary shadow-md ring-2 ring-brand-primary"
                      : "border-2 border-dashed border-border-default bg-surface-secondary"
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {lograda ? (
                    <>
                      <span className="text-3xl select-none" aria-hidden="true">
                        {f.emoji}
                      </span>
                      <span className="font-display font-bold text-xs text-txt-primary leading-tight">
                        {f.nombre}
                      </span>
                    </>
                  ) : (
                    <IconLock className="h-5 w-5 text-txt-tertiary" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {pestaña === "vestir" && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-soft text-txt-on-primary-soft text-sm font-bold px-4 py-2 tabular-nums">
            <IconCoin className="h-4 w-4" /> {p.monedas} monedas
          </span>

          <div
            ref={retratoRef}
            className={`relative mt-4 flex items-center justify-center rounded-full animate-fade-up transition-transform ${
              arrastre ? "scale-105" : ""
            }`}
            style={{
              width: 240,
              height: 240,
              background:
                "radial-gradient(circle, var(--surface-primary) 58%, transparent 60%)",
              boxShadow: arrastre
                ? "0 0 0 3px var(--surface-primary), 0 0 0 8px var(--brand-accent), 0 0 0 12px var(--surface-primary), 0 0 0 16px var(--brand-secondary)"
                : "0 0 0 3px var(--surface-primary), 0 0 0 8px var(--brand-primary), 0 0 0 12px var(--surface-primary), 0 0 0 16px var(--brand-secondary)",
            }}
          >
            <div className="relative" style={{ width: 200, height: 200 }}>
              {accParaMostrar?.detras && (
                <AccesorioOverlay acc={accParaMostrar} />
              )}
              <Mascota tema={tema} size={200} />
              {accParaMostrar && !accParaMostrar.detras && (
                <AccesorioOverlay acc={accParaMostrar} />
              )}
              {calibrando && verCuadricula && <CuadriculaCalibracion />}
            </div>
          </div>

          <p className="mt-6 text-sm text-txt-secondary text-center max-w-56">
            {!ACCESORIOS_COMPRABLES.some((a) => accesorioDesbloqueado(a, p))
              ? "Termina una sección completa o comprá algo en la tienda para tener tu primer accesorio."
              : "Arrastrá un accesorio hasta el León para ponérselo, o tocalo."}
          </p>

          {calibrando && accEquipado && ajusteManual && (
            <div className="mt-4 w-full rounded-2xl border border-border-default bg-surface-secondary p-4 text-left">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-txt-tertiary">
                  MODO CALIBRACIÓN — {accEquipado.nombre}
                </p>
                <button
                  onClick={() => setVerCuadricula((v) => !v)}
                  className="shrink-0 rounded-full bg-surface-tertiary px-3 py-1 text-xs font-bold text-txt-secondary"
                >
                  {verCuadricula ? "Ver limpio" : "Ver cuadrícula"}
                </button>
              </div>
              {(["top", "left", "ancho"] as const).map((campo) => (
                <label key={campo} className="block mb-3">
                  <span className="text-xs text-txt-secondary">
                    {campo}: {ajusteManual[campo]}
                  </span>
                  <input
                    type="range"
                    min={campo === "ancho" ? 30 : 0}
                    max={campo === "ancho" ? 170 : 100}
                    value={ajusteManual[campo]}
                    onChange={(e) =>
                      setAjusteManual(
                        (a) => a && { ...a, [campo]: Number(e.target.value) }
                      )
                    }
                    className="w-full"
                  />
                </label>
              ))}
              <p className="mt-1 rounded-lg bg-surface-tertiary p-3 font-mono text-sm text-txt-primary select-all">
                top: {ajusteManual.top}, left: {ajusteManual.left}, ancho:{" "}
                {ajusteManual.ancho}
              </p>
              <p className="mt-2 text-xs text-txt-tertiary">
                Movés los deslizadores hasta que el accesorio quede bien
                puesto, y me mandás una captura de estos 3 números.
              </p>
            </div>
          )}

          <p className="mt-6 self-start text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Tus logros
          </p>
          <div className="mt-2 grid grid-cols-4 gap-3 w-full">
            {ACCESORIOS.map((a, i) => {
              const logradaReal = accesorios.some((g) => g.id === a.id);
              const logradaVisible = logradaReal || calibrando;
              const mostradoAhora = accParaMostrar?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (calibrando) {
                      equiparAccesorio(mostradoAhora ? null : a.id);
                      return;
                    }
                    elegirAccesorio(a, logradaReal);
                  }}
                  onPointerDown={
                    logradaReal && !calibrando
                      ? (e) => iniciarArrastre(e, a)
                      : undefined
                  }
                  aria-label={a.nombre}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl transition-transform active:scale-95 animate-fade-up ${
                    mostradoAhora
                      ? "bg-brand-primary-soft shadow-md ring-2 ring-brand-primary"
                      : logradaVisible
                      ? "bg-surface-primary shadow-sm ring-1 ring-border-default"
                      : "border-2 border-dashed border-border-default bg-surface-secondary"
                  }`}
                  style={{ animationDelay: `${i * 40}ms`, touchAction: "none" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.imagen}
                    alt={a.nombre}
                    className={`h-10 w-10 object-contain select-none ${
                      logradaVisible ? "" : "opacity-40"
                    }`}
                  />
                  {!logradaVisible && (
                    <IconLock className="absolute bottom-1 right-1 h-3.5 w-3.5 text-txt-tertiary" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-6 self-start text-xs font-bold uppercase tracking-wide text-txt-tertiary">
            Comprar con monedas
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3 w-full">
            {ACCESORIOS_COMPRABLES.map((a, i) => {
              const tenidoReal = accesorioDesbloqueado(a, p);
              const tenidoVisible = tenidoReal || calibrando;
              const mostradoAhora = accParaMostrar?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (calibrando) {
                      equiparAccesorio(mostradoAhora ? null : a.id);
                      return;
                    }
                    elegirAccesorio(a, tenidoReal);
                  }}
                  onPointerDown={
                    tenidoReal && !calibrando
                      ? (e) => iniciarArrastre(e, a)
                      : undefined
                  }
                  aria-label={a.nombre}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-transform active:scale-95 animate-fade-up ${
                    mostradoAhora
                      ? "bg-brand-primary-soft shadow-md ring-2 ring-brand-primary"
                      : tenidoVisible
                      ? "bg-surface-primary shadow-sm ring-1 ring-border-default"
                      : "bg-surface-secondary"
                  }`}
                  style={{
                    animationDelay: `${i * 40}ms`,
                    touchAction: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  {a.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imagen}
                      alt=""
                      className="h-12 w-12 object-contain select-none"
                    />
                  ) : (
                    <span className="text-2xl select-none" aria-hidden="true">
                      {a.emoji}
                    </span>
                  )}
                  <span className="select-none text-xs font-bold text-txt-primary leading-tight text-center">
                    {a.nombre}
                  </span>
                  {!tenidoVisible && (
                    <span className="select-none inline-flex items-center gap-1 rounded-full bg-brand-primary-soft px-2 py-0.5 text-xs font-bold text-txt-on-primary-soft">
                      <IconCoin className="h-3 w-3" /> {a.precio}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {itemAConfirmar && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center px-5 pb-8 sm:items-center"
              style={{ backgroundColor: "var(--surface-overlay)" }}
              onClick={cancelarCompra}
            >
              <div
                className="w-full max-w-xs rounded-3xl bg-surface-primary p-6 text-center shadow-lg animate-pop-in"
                onClick={(e) => e.stopPropagation()}
              >
                {itemAConfirmar.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={itemAConfirmar.imagen}
                    alt=""
                    className="mx-auto h-20 w-20 object-contain select-none"
                  />
                ) : (
                  <span className="text-5xl" aria-hidden="true">
                    {itemAConfirmar.emoji}
                  </span>
                )}
                <p className="mt-3 font-display font-bold text-lg text-txt-primary">
                  {itemAConfirmar.nombre}
                </p>
                <p className="mt-1 text-sm text-txt-secondary">
                  Así se ve puesto. Esto te costará{" "}
                  <strong className="text-txt-primary">
                    {itemAConfirmar.precio} monedas
                  </strong>
                  .
                </p>
                {!alcanzaParaComprar && (
                  <p className="mt-2 text-sm font-bold text-brand-accent">
                    Te faltan {itemAConfirmar.precio! - p.monedas} monedas
                    todavía.
                  </p>
                )}
                <button
                  onClick={confirmarCompra}
                  disabled={!alcanzaParaComprar}
                  className="mt-5 w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold py-3 btn-3d-primary transition-colors disabled:opacity-40"
                >
                  Sí, comprar
                </button>
                <button
                  onClick={cancelarCompra}
                  className="mt-2 w-full text-center text-sm text-txt-secondary underline underline-offset-2 py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {arrastre && (
            <div
              className="pointer-events-none fixed z-[70]"
              style={{
                left: arrastre.x,
                top: arrastre.y,
                transform: "translate(-50%, -50%) scale(1.15)",
              }}
              aria-hidden="true"
            >
              {arrastre.acc.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={arrastre.acc.imagen}
                  alt=""
                  className="opacity-90 drop-shadow-lg"
                  style={{ width: arrastre.acc.ancho ?? 80 }}
                />
              ) : (
                <span
                  className="opacity-90 drop-shadow-lg"
                  style={{ fontSize: (arrastre.acc.tamaño ?? 32) * 1.3 }}
                >
                  {arrastre.acc.emoji}
                </span>
              )}
            </div>
          )}
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
