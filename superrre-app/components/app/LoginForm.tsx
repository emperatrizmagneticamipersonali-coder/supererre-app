"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconMail, IconLock } from "./icons";
import { iniciarProgreso, type SeveridadR } from "@/lib/progress";

type EstadoEnvio = "idle" | "enviando" | "enviado" | "error";

const SEVERIDADES_VALIDAS: SeveridadR[] = [
  "sustitucion",
  "omision",
  "inconsistente",
  "sin-diagnostico",
];

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const plan = params.get("plan") === "completo" ? "completo" : "free";
  const nombre = params.get("nombre") || "";
  const interes =
    params.get("interes") === "pirata" ? "pirata" : ("leon" as const);
  const edad = parseInt(params.get("edad") || "", 10) || 5;
  const severidadParam = params.get("severidad") as SeveridadR | null;
  const severidadR: SeveridadR = SEVERIDADES_VALIDAS.includes(
    severidadParam as SeveridadR
  )
    ? (severidadParam as SeveridadR)
    : "";

  const [email, setEmail] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [estado, setEstado] = useState<EstadoEnvio>("idle");
  const [cooldown, setCooldown] = useState(0);

  function enviarEnlace() {
    if (!email.includes("@") || !aceptaTerminos || estado === "enviando")
      return;
    setEstado("enviando");
    setTimeout(() => {
      iniciarProgreso({ nombre, plan, interes, edad, severidadR });
      setEstado("enviado");
      setCooldown(60);
      const id = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(id);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, 900);
  }

  return (
    <main className="min-h-dvh flex flex-col bg-surface-base px-5">
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-bold text-sm text-txt-primary"
        >
          <Image
            src="/logo-mark.png"
            alt="SuperErre"
            width={28}
            height={28}
            className="rounded-md"
          />
          SuperErre
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
        {estado !== "enviado" ? (
          <>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-txt-primary text-balance">
              {plan === "completo"
                ? `Entra para activar el Plan${nombre ? ` de ${nombre}` : ""}`
                : "Entra a tu plan gratis"}
            </h1>
            <p className="mt-3 text-sm text-txt-secondary leading-relaxed">
              Para guardar el progreso{" "}
              {nombre ? `de ${nombre}` : "de tu hijo"} y verlo en
              cualquier dispositivo — sin contraseñas.
            </p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoFocus
              placeholder="tu@correo.com"
              className="mt-8 w-full rounded-2xl border border-border-default bg-surface-primary px-5 py-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-soft"
            />

            <label className="mt-5 flex items-start gap-2.5 text-xs text-txt-secondary leading-relaxed">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-primary"
              />
              <span>
                Acepto los{" "}
                <Link
                  href="/terminos"
                  target="_blank"
                  className="font-semibold text-brand-secondary"
                >
                  Términos
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacidad"
                  target="_blank"
                  className="font-semibold text-brand-secondary"
                >
                  Política de Privacidad
                </Link>
                .
              </span>
            </label>

            <button
              onClick={enviarEnlace}
              disabled={
                !email.includes("@") || !aceptaTerminos || estado === "enviando"
              }
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
            >
              {estado === "enviando" ? (
                <span className="h-5 w-5 rounded-full border-2 border-txt-on-brand/40 border-t-txt-on-brand animate-spin" />
              ) : (
                <IconMail className="h-5 w-5" />
              )}
              Enviarme mi enlace de acceso
            </button>

            <p className="mt-4 text-center text-xs text-txt-tertiary flex items-center justify-center gap-2">
              <IconLock className="h-3.5 w-3.5" />
              Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </>
        ) : (
          <div className="text-center animate-pop-in">
            <span className="text-5xl mb-4 inline-block">📬</span>
            <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
              Revisa tu correo
            </h1>
            <p className="mt-3 text-sm text-txt-secondary leading-relaxed">
              Te enviamos el enlace a{" "}
              <strong className="text-txt-primary font-semibold">
                {email}
              </strong>
              .
            </p>
            <button
              disabled={cooldown > 0}
              onClick={enviarEnlace}
              className="mt-6 text-sm font-semibold text-brand-primary disabled:text-txt-tertiary"
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar enlace"}
            </button>

            <div className="mt-10 border-t border-border-default pt-6">
              <p className="text-xs text-txt-tertiary mb-3">
                Modo de prueba (esto se activa solo con el correo real
                cuando publiquemos la app):
              </p>
              <button
                onClick={() => router.push("/app")}
                className="text-sm font-semibold text-txt-secondary underline underline-offset-2"
              >
                Simular clic en el enlace y entrar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
