import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const Body = z.object({
  type: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9_]+$/, "tipo de evento inválido"),
  deviceId: z.string().trim().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/** Registra un evento de uso (activación/retención). Endpoint público a propósito: la app
 * todavía no tiene login real de compradores (todo vive en localStorage), así que no hay
 * sesión de la que colgar el evento — se identifica solo por `deviceId` (anónimo, sin PII). */
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { type, deviceId, metadata } = parsed.data;

  const dentroDelLimite = await checkRateLimit(`log-event:${deviceId}`, 60, 60);
  if (!dentroDelLimite) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("event_log")
    .insert({ type, device_id: deviceId, metadata: metadata ?? {} });
  if (error) {
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
