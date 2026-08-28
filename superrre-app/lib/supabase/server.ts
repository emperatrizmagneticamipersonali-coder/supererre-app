import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente de Supabase para Server Components / Route Handlers — lee la sesión de las
 * cookies httpOnly del request. Respeta RLS (usa la clave pública, no el service role). */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Desde un Server Component de solo lectura no se puede escribir cookies —
            // el refresh real ocurre en middleware.ts. Defensivo, no rompe el render.
          }
        },
      },
    }
  );
}
