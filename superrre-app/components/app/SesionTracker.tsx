"use client";

import { useEffect } from "react";
import { trackSesionDiaria } from "@/lib/analytics";

/** Componente invisible: registra `sesion_iniciada` una vez por día activo
 * (para las curvas D1/D7/D30 del panel de administración). No renderiza nada. */
export function SesionTracker() {
  useEffect(() => {
    trackSesionDiaria();
  }, []);
  return null;
}
