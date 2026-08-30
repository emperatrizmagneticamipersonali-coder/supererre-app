import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Recibe el click del enlace de invitación/acceso de un usuario NORMAL (no
 * administrador) — ej. alguien dado de alta a mano desde /admin/usuarios.
 * Sin esto, el enlace confirmaba la cuenta en Supabase pero caía en la
 * página principal sin sesión ni destino, mostrando un error en el navegador. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
