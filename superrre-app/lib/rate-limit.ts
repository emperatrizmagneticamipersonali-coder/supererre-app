import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** Sliding window atómico en Postgres (ver 09-SEGURIDAD) — para los endpoints públicos
 * de logging (log-event/log-error), que aceptan escritura anónima porque la app todavía
 * no tiene login real de compradores. FAIL-CLOSED: si el chequeo falla, no se inserta. */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("[rate-limit]", error.message);
    return false;
  }
  return data === true;
}
