"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useProgreso,
  minijuegoDesbloqueado,
  marcarMemoramaGanado,
  equiparAccesorio,
} from "@/lib/progress";
import { letraCompleta } from "@/lib/escalera-data";
import {
  PALABRAS_MEMORAMA_POR_LETRA,
  PAREJAS_POR_NIVEL,
} from "@/lib/memorama-data";
import { FIGURITAS, figuritasLogradas } from "@/lib/figuritas-data";
import { ACCESORIOS, accesoriosLogrados } from "@/lib/accesorios-data";
import { IconSparkles, IconLock } from "@/components/app/icons";
import { Mascota } from "@/components/app/Mascota";
import { Celebracion } from "@/components/app/Celebracion";

type Carta = {
  id: number;
  palabra: string;
  emoji: string;
  volteada: boolean;
  emparejada: boolean;
};

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
  const router = useRouter();
  const p = useProgreso();
  const tema: "leon" | "pirata" = p.interes === "pirata" ? "pirata" : "leon";
  const mascota = tema === "pirata" ? "🏴‍☠️" : "🦁";

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

  const disponible = p.plan === "completo" && minijuegoDesbloqueado(p);

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
            { id: "vestir", label: "Mi personaje" },
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
                className="rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 shadow-md"
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
                className="mt-6 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-4 shadow-md"
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
          <div
            className="relative flex items-center justify-center rounded-full animate-fade-up"
            style={{
              width: 240,
              height: 240,
              background:
                "radial-gradient(circle, var(--surface-primary) 58%, transparent 60%)",
              boxShadow:
                "0 0 0 3px var(--surface-primary), 0 0 0 8px var(--brand-primary), 0 0 0 12px var(--surface-primary), 0 0 0 16px var(--brand-secondary)",
            }}
          >
            <div className="relative" style={{ width: 200, height: 200 }}>
              <Mascota tema={tema} size={200} />
              {p.accesorioEquipado &&
                (() => {
                  const acc = ACCESORIOS.find(
                    (a) => a.id === p.accesorioEquipado
                  );
                  if (!acc) return null;
                  return (
                    <span
                      className="absolute select-none animate-pop-in"
                      style={{
                        top: `${acc.top}%`,
                        left: `${acc.left}%`,
                        transform: "translateX(-50%)",
                        fontSize: acc.tamaño,
                      }}
                      aria-hidden="true"
                    >
                      {acc.emoji}
                    </span>
                  );
                })()}
            </div>
          </div>

          <p className="mt-6 text-sm text-txt-secondary text-center max-w-56">
            {accesorios.length === 0
              ? "Termina una sección completa para ganar tu primer accesorio."
              : "Toca un accesorio para ponérselo o quitárselo."}
          </p>

          <div className="mt-4 grid grid-cols-4 gap-3 w-full max-w-72">
            {ACCESORIOS.map((a, i) => {
              const lograda = accesorios.some((g) => g.id === a.id);
              const equipado = p.accesorioEquipado === a.id;
              return (
                <button
                  key={a.id}
                  disabled={!lograda}
                  onClick={() => equiparAccesorio(equipado ? null : a.id)}
                  aria-label={a.nombre}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl transition-transform active:scale-95 animate-fade-up ${
                    equipado
                      ? "bg-brand-primary-soft shadow-md ring-2 ring-brand-primary"
                      : lograda
                      ? "bg-surface-primary shadow-sm ring-1 ring-border-default"
                      : "border-2 border-dashed border-border-default bg-surface-secondary"
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {lograda ? (
                    <span className="text-2xl select-none" aria-hidden="true">
                      {a.emoji}
                    </span>
                  ) : (
                    <IconLock className="h-4 w-4 text-txt-tertiary" />
                  )}
                </button>
              );
            })}
          </div>
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
