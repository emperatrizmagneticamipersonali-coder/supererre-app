import "server-only";
import crypto from "node:crypto";

/** Compara dos strings en tiempo constante — evita que alguien adivine el HOTTOK
 * byte a byte midiendo cuánto tarda en responder cada intento (timing attack). */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** ¿Este aviso viene realmente de Hotmart? El hottok es un secreto compartido
 * (no una firma HMAC) — comparar el valor recibido contra el nuestro, en tiempo
 * constante, siempre sobre HTTPS (lo garantiza Vercel).
 *
 * Fail-secure LEÍDO EN EL MOMENTO (no al importar el archivo): si `HOTMART_HOTTOK`
 * falta, esto SIEMPRE devuelve `false` — nunca deja pasar un aviso sin verificar.
 * Se decidió así (en vez de tirar un error al cargar el módulo, como sugiere la
 * doctrina) porque Next.js evalúa los archivos de las rutas durante `next build`
 * incluso sin recibir ninguna petición real — un throw a nivel de módulo tumbaba
 * la publicación entera apenas faltaba la clave, en vez de solo bloquear pagos. */
export function verifyHotmart(hottokRecibido: string | undefined | null): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK || !hottokRecibido) return false;
  return timingSafeEqualStr(hottokRecibido, HOTTOK);
}

/** Ventana anti-repetición: un aviso capturado y reenviado más tarde se rechaza,
 * aunque el hottok sea válido (defensa extra sobre la deduplicación por evento). */
const VENTANA_REPLAY_MS = 5 * 60 * 1000;

export function esReciente(timestampMs: number | undefined | null): boolean {
  if (!timestampMs) return true; // sin fecha fiable en el payload, no bloquear por esto
  const antiguedad = Date.now() - timestampMs;
  return antiguedad >= 0 && antiguedad <= VENTANA_REPLAY_MS;
}
