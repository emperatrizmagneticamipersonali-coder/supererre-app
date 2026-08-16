"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

let cacheAnimacion: object | null = null;
let promesaAnimacion: Promise<object> | null = null;

function cargarAnimacion(): Promise<object> {
  if (cacheAnimacion) return Promise.resolve(cacheAnimacion);
  if (!promesaAnimacion) {
    promesaAnimacion = fetch("/lottie/celebrate.json")
      .then((r) => r.json())
      .then((data) => {
        cacheAnimacion = data;
        return data;
      });
  }
  return promesaAnimacion;
}

/**
 * Celebración a pantalla completa al terminar una lección — se dispara sola
 * cuando `activa` pasa a true, reproduce la animación una vez y se cierra
 * sola (o al tocarla, para no bloquear a un niño impaciente).
 */
export function Celebracion({
  activa,
  onFin,
  mensaje = "¡Excelente!",
}: {
  activa: boolean;
  onFin?: () => void;
  mensaje?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [animacion, setAnimacion] = useState<object | null>(cacheAnimacion);

  useEffect(() => {
    if (activa) {
      setVisible(true);
      if (!animacion) cargarAnimacion().then(setAnimacion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa]);

  if (!visible) return null;

  function cerrar() {
    setVisible(false);
    onFin?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-up"
      style={{ backgroundColor: "var(--surface-overlay)" }}
      onClick={cerrar}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        {animacion && (
          <Lottie
            animationData={animacion}
            loop={false}
            onComplete={cerrar}
            style={{ width: 260, height: 260 }}
          />
        )}
        <p className="-mt-4 font-display font-extrabold text-2xl text-txt-on-brand animate-pop-in">
          {mensaje}
        </p>
      </div>
    </div>
  );
}
