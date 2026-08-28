import { createBrowserClient } from "@supabase/ssr";

/** Cliente de Supabase para Client Components — usa la clave pública (anon/publishable),
 * segura de exponer porque la protección real es RLS, no el secreto de la clave. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
