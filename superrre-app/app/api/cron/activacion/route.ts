import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, REMITENTE_SUPERERRE } from "@/lib/resend";
import { emailActivacionDia1, emailActivacionDia3 } from "@/lib/emails-activacion";

export const runtime = "nodejs";
export const maxDuration = 60;

const UN_DIA_MS = 24 * 60 * 60 * 1000;

/** Cron diario (Vercel Cron, ver vercel.json) — manda el correo de activación
 * del día 1 y del día 3 a quien ya compró y todavía no se lo enviamos. No usa
 * los correos de Supabase (esos son solo de login/acceso) — este es aparte,
 * vía Resend directo, porque es un aviso informativo, no un enlace mágico. */
export async function GET(req: NextRequest) {
  // Vercel manda este header automáticamente cuando CRON_SECRET está configurado
  // en las variables de entorno del proyecto — evita que cualquiera dispare el
  // envío masivo visitando la URL a mano.
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const resend = getResendClient();
  const ahora = Date.now();

  const { data: candidatos, error: errorParents } = await admin
    .from("parents")
    .select("id, name, email_activacion_d1_enviado, email_activacion_d3_enviado, created_at")
    .eq("plan", "completo")
    .eq("status", "active")
    .or("email_activacion_d1_enviado.eq.false,email_activacion_d3_enviado.eq.false");
  if (errorParents) {
    return NextResponse.json({ error: errorParents.message }, { status: 500 });
  }

  const resultados: { id: string; dia: 1 | 3; ok: boolean }[] = [];

  for (const parent of candidatos ?? []) {
    const creado = new Date(parent.created_at).getTime();
    const antiguedadMs = ahora - creado;

    const tocaD1 = !parent.email_activacion_d1_enviado && antiguedadMs >= UN_DIA_MS;
    const tocaD3 = !parent.email_activacion_d3_enviado && antiguedadMs >= 3 * UN_DIA_MS;
    if (!tocaD1 && !tocaD3) continue;

    const { data: userData } = await admin.auth.admin.getUserById(parent.id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: hijo } = await admin
      .from("children")
      .select("nombre")
      .eq("parent_id", parent.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const urlApp = `${req.nextUrl.origin}/login?plan=completo`;

    if (tocaD1) {
      const { subject, html } = emailActivacionDia1(hijo?.nombre ?? "", urlApp);
      const { error } = await resend.emails.send({
        from: REMITENTE_SUPERERRE,
        to: email,
        subject,
        html,
      });
      if (!error) {
        await admin.from("parents").update({ email_activacion_d1_enviado: true }).eq("id", parent.id);
      }
      resultados.push({ id: parent.id, dia: 1, ok: !error });
    }

    if (tocaD3) {
      const { subject, html } = emailActivacionDia3(hijo?.nombre ?? "", urlApp);
      const { error } = await resend.emails.send({
        from: REMITENTE_SUPERERRE,
        to: email,
        subject,
        html,
      });
      if (!error) {
        await admin.from("parents").update({ email_activacion_d3_enviado: true }).eq("id", parent.id);
      }
      resultados.push({ id: parent.id, dia: 3, ok: !error });
    }
  }

  return NextResponse.json({ procesados: resultados.length, resultados });
}
