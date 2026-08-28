import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const Body = z.object({
  message: z.string().trim().min(1).max(500),
  context: z.string().trim().max(200).optional(),
  deviceId: z.string().trim().min(1).max(100),
});

/** Registra un error real de la app (desde el Error Boundary). Público por la misma razón
 * que /api/log-event: no hay sesión de comprador de la que colgarlo todavía. */
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { message, context, deviceId } = parsed.data;

  const dentroDelLimite = await checkRateLimit(`log-error:${deviceId}`, 30, 60);
  if (!dentroDelLimite) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("error_log")
    .insert({ message, context: context ?? null, device_id: deviceId });
  if (error) {
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
