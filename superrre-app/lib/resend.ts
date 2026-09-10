import "server-only";
import { Resend } from "resend";

/** Cliente de Resend para correos que NO son de autenticación (bienvenida,
 * activación) — los de login/acceso siguen saliendo por Supabase (SMTP
 * personalizado ya configurado), este es aparte para no mezclar responsabilidades. */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta RESEND_API_KEY — no se puede mandar el correo de activación."
    );
  }
  return new Resend(apiKey);
}

export const REMITENTE_SUPERERRE = "SuperErre <hola@supererre.com>";
