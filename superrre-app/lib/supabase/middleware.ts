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

  const path = request.nextUrl.pathname;
  const esRutaAdmin = path.startsWith("/admin");
  const esLoginAdmin = path === "/admin/login" || path.startsWith("/admin/auth");

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

  // Este middleware corre en TODAS las rutas (no solo /admin) — si Supabase no
  // responde (pausado, caído, o cualquier error de red), antes esto tumbaba el
  // sitio ENTERO con un 500 para cualquier visitante. Ahora, si falla, dejamos
  // pasar la request sin sesión en vez de romper la página — /admin sigue
  // protegido (sin user confirmado, se manda a login), y el resto del sitio
  // (paywall, ejercicios, landing) sigue funcionando con normalidad.
  try {
    // getUser() valida el JWT contra Supabase (y dispara el refresh si expiró) —
    // nunca getSession() acá, que no revalida nada.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (esRutaAdmin && !esLoginAdmin) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      // Defensa en profundidad: el rol se vuelve a verificar en cada Server
      // Component/acción del panel (nunca confiar solo en el middleware) —
      // esto es la primera barrera, no la única.
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
  } catch (error) {
    console.error("proxy: Supabase no respondió, dejando pasar sin sesión", error);
    if (esRutaAdmin && !esLoginAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
