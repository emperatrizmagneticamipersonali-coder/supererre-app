"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { sincronizarPlanDesdeServidor } from "@/lib/progress";

/** Componente invisible: si hay una sesión real de Supabase (la persona entró por su
 * enlace de acceso), pregunta al servidor cuál es su plan REAL y lo refleja localmente.
 * Cierra el hueco de seguridad donde el plan "completo" se podía activar editando el
 * navegador — ahora, apenas hay sesión real, el servidor tiene la última palabra (para
 * bien: activa el plan que sí pagó; y para mal: baja el plan si Hotmart avisó un
 * reembolso). Sin sesión (uso gratis sin cuenta, como hasta ahora), no hace nada. */
export function PlanSync() {
  useEffect(() => {
    let cancelado = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelado) return;

      const { data: perfil } = await supabase
        .from("parents")
        .select("plan, status")
        .eq("id", user.id)
        .single();
      if (!perfil || cancelado) return;

      const planReal = perfil.plan === "completo" && perfil.status === "active"
        ? "completo"
        : "free";
      sincronizarPlanDesdeServidor(planReal);
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  return null;
}
