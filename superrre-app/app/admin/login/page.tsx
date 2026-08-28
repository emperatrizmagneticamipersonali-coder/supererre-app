"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { IconMail, IconShieldCheck } from "@/components/app/icons";

type Estado = "idle" | "enviando" | "enviado" | "error";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  async function enviarEnlace() {
    if (!email.includes("@") || estado === "enviando") return;
    setEstado("enviando");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
        shouldCreateUser: false, // el admin ya debe existir — este login no crea cuentas nuevas
      },
    });
    // Mensaje siempre igual, exista o no la cuenta (anti-enumeración) — nunca revelar
    // si ese correo tiene o no acceso de administrador.
    setEstado(error ? "error" : "enviado");
  }

  return (
    <main className="min-h-dvh flex flex-col bg-surface-base px-5">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
        {estado !== "enviado" ? (
          <>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-soft text-txt-on-primary-soft mb-4">
              <IconShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
              Panel de administración
            </h1>
            <p className="mt-3 text-sm text-txt-secondary leading-relaxed">
              Solo para el dueño de SuperErre. Escribe tu correo y te
              mandamos un enlace de un solo uso para entrar.
            </p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoFocus
              placeholder="tu@correo.com"
              onKeyDown={(e) => e.key === "Enter" && enviarEnlace()}
              className="mt-8 w-full rounded-2xl border border-border-default bg-surface-primary px-5 py-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-soft"
            />

            <button
              onClick={enviarEnlace}
              disabled={!email.includes("@") || estado === "enviando"}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
            >
              {estado === "enviando" ? (
                <span className="h-5 w-5 rounded-full border-2 border-txt-on-brand/40 border-t-txt-on-brand animate-spin" />
              ) : (
                <IconMail className="h-5 w-5" />
              )}
              Enviarme mi enlace de acceso
            </button>

            {estado === "error" && (
              <p className="mt-3 text-sm text-brand-accent text-center">
                No pudimos enviar el correo. Intenta de nuevo en un
                momento.
              </p>
            )}
          </>
        ) : (
          <div className="text-center animate-pop-in">
            <span className="text-5xl mb-4 inline-block">📬</span>
            <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
              Revisa tu correo
            </h1>
            <p className="mt-3 text-sm text-txt-secondary leading-relaxed">
              Si <strong className="text-txt-primary">{email}</strong>{" "}
              tiene acceso de administrador, le llegó un enlace para
              entrar.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
