import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminActual = { id: string; email: string; name: string | null };

/** Verifica sesión + rol admin EN EL SERVIDOR — segunda barrera además del middleware
 * (defensa en profundidad: nunca confiar en una sola capa). Se llama al principio de
 * CADA página/acción del panel, no solo en el layout, porque una Server Action puede
 * invocarse sin pasar por el layout que la montó. */
export async function requireAdmin(): Promise<AdminActual> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: perfil } = await supabase
    .from("parents")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (perfil?.role !== "admin") redirect("/");

  return { id: user.id, email: user.email ?? "", name: perfil.name };
}
