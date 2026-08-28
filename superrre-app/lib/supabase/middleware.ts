import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Refresca la sesión de Supabase en cada request y protege /admin.
 *
 * IMPORTANTE — alcance deliberado: esta app todavía NO tiene login real para los
 * papás/niños (todo su progreso vive en localStorage, sin cuenta de Supabase — ver
 * ESTADO.md). Este middleware NO protege `/app` ni ninguna otra ruta del funnel público:
 * solo exige sesión + rol admin para `/admin`. Conectar auth real de compradores es
 * trabajo aparte (fuera de esta tarea). */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() valida el JWT contra Supabase (y dispara el refresh si expiró) — nunca
  // getSession() acá, que no revalida nada.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esRutaAdmin = path.startsWith("/admin");
  const esLoginAdmin = path === "/admin/login" || path.startsWith("/admin/auth");

  if (esRutaAdmin && !esLoginAdmin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    // Defensa en profundidad: el rol se vuelve a verificar en cada Server Component/acción
    // del panel (nunca confiar solo en el middleware) — esto es la primera barrera, no la única.
    const { data: perfil } = await supabase
      .from("parents")
      .select("role")
      .eq("id", user.id)
      .single();
    if (perfil?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
