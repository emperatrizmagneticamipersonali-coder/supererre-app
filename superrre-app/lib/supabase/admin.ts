import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Cliente de Supabase con la clave secreta (service role) — SOLO para código de servidor
 * del panel de administración. Ignora RLS por completo, así que nunca se importa desde el
 * cliente ni se usa para nada que no sea una acción ya autorizada por `requireAdmin()`.
 * `import "server-only"` hace que el build falle si algún Client Component lo importa. */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    // Fail-closed: sin la clave secreta configurada, ninguna acción de admin debe "funcionar
    // igual pero sin seguridad" — mejor un error explícito que un agujero silencioso.
    throw new Error(
      "Faltan las variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY) para el panel de administración."
    );
  }
  return createSupabaseClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
