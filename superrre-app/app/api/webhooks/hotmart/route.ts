import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { verifyHotmart, esReciente } from "@/lib/hotmart-verify";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs"; // necesitamos node:crypto y el cuerpo crudo (no Edge)

/** ⚠️ Nombres a VERIFICAR contra el panel real de Hotmart (Herramientas → Webhook)
 * antes de conectar en producción — el catálogo de eventos varía por cuenta/versión.
 * SuperErre es PAGO ÚNICO (no suscripción), así que solo hacen falta estos 3 grupos. */
const EVENTOS_APROBADO = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
const EVENTOS_REEMBOLSO = ["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK"];
const EVENTOS_CANCELADO = ["PURCHASE_CANCELED", "PURCHASE_CANCELLED"];

async function registrarIntento(
  eventId: string | null,
  type: string | null,
  result: "applied" | "duplicate" | "illegal" | "unauthorized" | "error"
) {
  const admin = createAdminClient();
  await admin.from("webhook_log").insert({ event_id: eventId, type, result });
}

export async function POST(req: NextRequest) {
  // 1. Cuerpo CRUDO — nunca parsear antes de verificar (si algún día Hotmart exige
  //    firmar sobre bytes exactos, ya lo tenemos disponible).
  const rawBody = await req.text();

  // 2. AUTENTICIDAD — el hottok puede venir por header o dentro del body según la
  //    versión del webhook; probamos ambos caminos.
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const hottokHeader = req.headers.get("x-hotmart-hottok");
  const hottokBody = typeof payload.hottok === "string" ? payload.hottok : undefined;
  if (!verifyHotmart(hottokHeader ?? hottokBody)) {
    await registrarIntento(null, (payload.event as string) ?? null, "unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 3. FRESCURA — anti-repetición de un aviso viejo capturado y reenviado.
  const data = (payload.data as Record<string, unknown>) ?? {};
  const purchase = (data.purchase as Record<string, unknown>) ?? {};
  const creationDate = Number(payload.creation_date ?? purchase.approved_date);
  if (!esReciente(Number.isFinite(creationDate) ? creationDate : undefined)) {
    return NextResponse.json({ error: "stale" }, { status: 400 });
  }

  const event = String(payload.event ?? "");
  const buyer = (data.buyer as Record<string, unknown>) ?? {};
  const email = typeof buyer.email === "string" ? buyer.email : undefined;
  const name = typeof buyer.name === "string" ? buyer.name : "";
  const transactionId =
    typeof purchase.transaction === "string" ? purchase.transaction : undefined;
  const price = (purchase.price as Record<string, unknown>) ?? {};
  const amount = Number(price.value);
  const currency = typeof price.currency_value === "string" ? price.currency_value : "USD";

  let nuevoEstado: "aprobado" | "reembolsado" | "cancelado" | null = null;
  if (EVENTOS_APROBADO.includes(event)) nuevoEstado = "aprobado";
  else if (EVENTOS_REEMBOLSO.includes(event)) nuevoEstado = "reembolsado";
  else if (EVENTOS_CANCELADO.includes(event)) nuevoEstado = "cancelado";

  // Evento que no nos interesa (ej. uno informativo) — 200 para que Hotmart no reintente.
  if (!nuevoEstado) {
    return NextResponse.json({ received: true, ignorado: event });
  }
  if (!email || !transactionId) {
    await registrarIntento(null, event, "error");
    return NextResponse.json({ error: "payload incompleto" }, { status: 400 });
  }

  // 4. IDEMPOTENCIA TÉCNICA — Hotmart reenvía; si ya procesamos este evento exacto, salir.
  const eventId =
    (typeof payload.id === "string" && payload.id) || `${event}:${transactionId}`;
  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  const admin = createAdminClient();
  const yaProcesado = await admin
    .from("processed_events")
    .select("event_id")
    .eq("event_id", eventId)
    .maybeSingle();
  if (yaProcesado.data) {
    await registrarIntento(eventId, event, "duplicate");
    return NextResponse.json({ received: true, result: "duplicate" });
  }

  // 5. APLICAR el cambio — con reintento si la persona todavía no tiene cuenta.
  const aplicar = () =>
    admin.rpc("apply_hotmart_purchase", {
      p_email: email,
      p_name: name,
      p_transaction_id: transactionId,
      p_amount_minor: Number.isFinite(amount) ? Math.round(amount * 100) : null,
      p_currency: currency,
      p_nuevo_estado: nuevoEstado,
    });

  let { data: resultado, error } = await aplicar();

  if (!error && resultado?.status === "needs_account") {
    // Primera compra de esta persona: crear su cuenta real y mandarle el enlace de acceso
    // (inviteUserByEmail crea la cuenta Y manda el correo en una sola llamada).
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${req.nextUrl.origin}/auth/callback`,
    });
    // "ya registrado" no es un error real acá — puede pasar por una carrera de reintentos.
    if (inviteError && !inviteError.message.includes("already been registered")) {
      console.error("hotmart webhook: fallo al crear cuenta", { code: inviteError.status });
      await registrarIntento(eventId, event, "error");
      return NextResponse.json({ error: "processing failed" }, { status: 500 });
    }
    ({ data: resultado, error } = await aplicar());
  }

  if (error) {
    console.error("hotmart webhook error", { event, code: error.code }); // sin PII
    await registrarIntento(eventId, event, "error");
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  if (resultado?.status === "illegal_transition") {
    await registrarIntento(eventId, event, "illegal");
    return NextResponse.json({ received: true, result: "illegal_transition" });
  }

  // Recién ahora que TODO salió bien (cuenta creada, compra registrada) marcamos procesado —
  // si algo hubiera fallado antes, Hotmart reintenta y no quedamos con "pagó y no entró".
  await admin
    .from("processed_events")
    .insert({ event_id: eventId, event_type: event, payload_hash: payloadHash });
  await registrarIntento(eventId, event, "applied");

  return NextResponse.json({ received: true, result: "applied" });
}
