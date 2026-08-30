"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** El origen real del sitio, leído del propio request — evita depender de una
 * variable de entorno extra que alguien podría olvidar configurar en Vercel. */
async function origenDelSitio() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host");
  return `${proto}://${host}`;
}

const CrearUsuarioSchema = z.object({
  email: z.string().trim().email("Ese correo no parece válido"),
  name: z.string().trim().min(1, "Escribe un nombre").max(100),
  plan: z.enum(["free", "completo"]),
});

export type CrearUsuarioResultado =
  | { ok: true }
  | { ok: false; error: string };

/** Alta manual de un usuario — crea la cuenta real y le manda su enlace de acceso.
 * Pensado para cuando el proceso automático (webhook de Hotmart) le falla a alguien.
 * Firma (prevState, formData) porque se usa con useActionState en el cliente. */
export async function crearUsuarioManual(
  _prevState: CrearUsuarioResultado | null,
  formData: FormData
): Promise<CrearUsuarioResultado> {
  await requireAdmin(); // defensa en profundidad: se re-verifica acá, no solo en el layout

  const parsed = CrearUsuarioSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    plan: formData.get("plan"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const admin = createAdminClient();
  const { email, name, plan } = parsed.data;

  const { data: invitado, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${await origenDelSitio()}/auth/callback`,
    });
  if (inviteError) {
    // Mensaje honesto pero sin filtrar detalles internos del proveedor.
    return {
      ok: false,
      error: inviteError.message.includes("already been registered")
        ? "Ese correo ya tiene una cuenta."
        : "No se pudo crear la cuenta. Intenta de nuevo.",
    };
  }

  // El trigger handle_new_parent() ya insertó la fila en `parents` con los valores por
  // defecto (role='user', plan='free', status='active') — acá solo completamos nombre/plan.
  const { error: updateError } = await admin
    .from("parents")
    .update({ name, plan, source: "manual", status: "active" })
    .eq("id", invitado.user.id);
  if (updateError) {
    return { ok: false, error: "La cuenta se creó, pero no se pudo guardar el nombre/plan." };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

/** Activar/desactivar manualmente — para cuando el webhook falla en el otro sentido
 * (reembolso/cancelación que no llegó, o hay que cortar el acceso a mano). */
export async function cambiarEstadoUsuario(
  userId: string,
  nuevoEstado: "active" | "inactive"
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("parents")
    .update({ status: nuevoEstado })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin/usuarios");
}

/** Reenviar el enlace de acceso a alguien que YA tiene cuenta — por si el correo
 * original (el del webhook) no le llegó. Un magic link nuevo, no crea una cuenta duplicada. */
export async function reenviarAcceso(email: string) {
  await requireAdmin();
  // Cliente sin sesión propia (publishable key) — signInWithOtp no requiere estar logueado
  // y es el mismo mecanismo real de login, no una API de "administrador".
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${await origenDelSitio()}/auth/callback`,
    },
  });
  if (error) throw error;
}
