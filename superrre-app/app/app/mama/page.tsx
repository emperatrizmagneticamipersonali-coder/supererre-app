"use client";

import { useRouter } from "next/navigation";
import { useProgreso, totalEjerciciosHechos, planDiarioPorEdad } from "@/lib/progress";
import { nivelPorId } from "@/lib/escalera-data";
import { IconShieldCheck, IconCoin, IconCheck, IconAlarmClock } from "@/components/app/icons";

export default function MamaPage() {
  const router = useRouter();
  const p = useProgreso();
  const plan = planDiarioPorEdad(p.edad);

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Progreso de {p.nombre || "tu hijo"}
      </h1>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-secondary p-4">
          <p className="text-2xl font-display font-extrabold text-txt-primary tabular-nums">
            {p.estrellas}
          </p>
          <p className="text-xs text-txt-secondary mt-1">Estrellas ganadas</p>
        </div>
        <div className="rounded-2xl bg-surface-secondary p-4">
          <p className="text-2xl font-display font-extrabold text-txt-primary tabular-nums">
            {totalEjerciciosHechos(p)}
          </p>
          <p className="text-xs text-txt-secondary mt-1">Ejercicios completados</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border-default p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft">
          <IconAlarmClock className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display font-bold text-sm text-txt-primary">
            Plan recomendado: {plan.texto}
          </p>
          <p className="text-xs text-txt-secondary mt-0.5">
            Para {p.edad} años, mejor pocos minutos todos los días que una
            sesión larga de vez en cuando.
          </p>
        </div>
      </div>

      {p.palabrasHechas.length > 0 && (
        <div className="mt-4 rounded-2xl border border-border-default p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-txt-tertiary mb-2">
            Sílabas, palabras y oraciones que ya dijo
          </p>
          <div className="flex flex-wrap gap-2">
            {p.palabrasHechas.map((id) => {
              const nivel = nivelPorId(id);
              if (!nivel) return null;
              return (
                <span
                  key={id}
                  className="rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft text-sm font-bold px-3 py-1"
                >
                  {nivel.texto}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border-2 border-brand-primary bg-surface-primary p-5">
        {p.plan === "completo" ? (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand">
              <IconCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-base text-txt-primary">
                Espejo Completo activo
              </p>
              <p className="text-xs text-txt-secondary">
                Todo desbloqueado, para siempre
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="font-display font-bold text-base text-txt-primary">
              Tienes el plan gratis
            </p>
            <p className="text-sm text-txt-secondary mt-1">
              Desbloquea la Escalera Fonética completa y el Cofre de
              Premios por $19.99, pago único.
            </p>
            <button
              onClick={() => router.push("/onboarding")}
              className="mt-4 w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold py-3 flex items-center justify-center gap-2"
            >
              <IconCoin className="h-4 w-4" />
              Ver el Espejo Completo
            </button>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-txt-tertiary flex items-center gap-2">
        <IconShieldCheck className="h-4 w-4 text-brand-secondary shrink-0" />
        El audio de {p.nombre || "tu hijo"} se procesa 100% en este
        celular — nunca se sube a internet.
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-8 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
