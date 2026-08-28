"use client";

import { useEffect } from "react";
import { logError } from "@/lib/analytics";

/** Red de seguridad de toda la app — sin esto, un error no capturado deja
 * pantalla blanca (regla 18 de CLAUDE.md). Loguea a error_log (panel de
 * administración) y ofrece reintentar en vez de dejar al niño/mamá varado. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error.message || "Error desconocido", "global-error");
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
            fontFamily: "system-ui, sans-serif",
            background: "#FFF6E4",
            color: "#22332E",
          }}
        >
          <span style={{ fontSize: 48, marginBottom: 16 }}>😿</span>
          <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
            Algo se rompió por un momento
          </h1>
          <p style={{ fontSize: 14, opacity: 0.75, marginBottom: 24 }}>
            No es nada que hayas hecho — ya quedó anotado. Intenta de
            nuevo.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#F0A93A",
              color: "#22332E",
              fontWeight: 700,
              border: "none",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 15,
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
