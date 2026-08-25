"use client";

import { useEffect, useState } from "react";
import {
  useProgreso,
  marcarFiguritaVista,
  marcarAccesorioVisto,
} from "@/lib/progress";
import { FIGURITAS } from "@/lib/figuritas-data";
import { ACCESORIOS } from "@/lib/accesorios-data";
import { IconSparkles } from "@/components/app/icons";

/** Se coloca en la misma pantalla que dispara el "Reclamar mi premio".
 * Recibe el id EXACTO de la figurita o el accesorio que se acaba de ganar
 * (no escanea el progreso buscando "cualquiera no visto" — así nunca
 * encadena varios premios de golpe). Muestra el cofre, y al abrirlo la
 * tira completa de la colección: en color lo que ya tiene, en blanco y
 * negro lo que le falta. */
export function RevelacionPremio({
  figuritaId,
  accesorioId,
  onCerrar,
}: {
  figuritaId?: string | null;
  accesorioId?: string | null;
  onCerrar: (tipo: "figurita" | "accesorio") => void;
}) {
  const p = useProgreso();
  const [abierto, setAbierto] = useState(false);

  const figurita = figuritaId
    ? FIGURITAS.find((f) => f.id === figuritaId)
    : undefined;
  const accesorio = !figurita && accesorioId
    ? ACCESORIOS.find((a) => a.id === accesorioId)
    : undefined;

  useEffect(() => {
    setAbierto(false);
  }, [figuritaId, accesorioId]);

  if (!figurita && !accesorio) return null;

  function cerrar() {
    if (figurita) {
      marcarFiguritaVista(figurita.id);
      onCerrar("figurita");
    } else if (accesorio) {
      marcarAccesorioVisto(accesorio.id);
      onCerrar("accesorio");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--surface-overlay)" }}
    >
      {!abierto ? (
        <button
          onClick={() => setAbierto(true)}
          className="flex flex-col items-center gap-4 animate-pop-in"
          aria-label="Abrir el cofre"
        >
          <span className="text-8xl animate-breathe select-none">🎁</span>
          <p className="font-display font-bold text-lg text-txt-on-brand text-center text-balance">
            ¡Ganaste algo nuevo!
            <br />
            Toca para abrir
          </p>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <IconSparkles className="h-8 w-8 text-brand-primary-light" />
          {figurita ? (
            <span className="text-8xl select-none">{figurita.emoji}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={accesorio!.imagen}
              alt=""
              className="h-32 w-32 object-contain select-none animate-breathe"
            />
          )}
          <p className="font-display font-extrabold text-2xl text-txt-on-brand text-balance">
            {figurita ? figurita.nombre : accesorio!.nombre}
          </p>
          <p className="text-sm text-txt-on-brand/80">
            {figurita
              ? "Nueva figurita para tu álbum"
              : "Nuevo accesorio para tu personaje"}
          </p>

          {figurita && (
            <div className="mt-4 w-full">
              <div className="flex gap-2 overflow-x-auto pb-2 px-1 justify-center flex-wrap">
                {FIGURITAS.map((f) => {
                  const tenida =
                    f.id === figurita.id || p.figuritasVistas.includes(f.id);
                  return (
                    <span
                      key={f.id}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                        tenida
                          ? "bg-brand-primary-soft animate-pop-in"
                          : "bg-white/10 grayscale opacity-50"
                      }`}
                      aria-label={tenida ? f.nombre : "Figurita sin descubrir"}
                    >
                      {f.emoji}
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-txt-on-brand/70">
                Colecciona las demás figuritas
              </p>
            </div>
          )}

          <button
            onClick={cerrar}
            className="mt-4 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold px-8 py-3 shadow-md"
          >
            ¡Genial!
          </button>
        </div>
      )}
    </div>
  );
}
