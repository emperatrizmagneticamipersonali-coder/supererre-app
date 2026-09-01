"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelHeader } from "./FunnelHeader";
import { Chip } from "./Chip";
import { MascotBubble } from "./MascotBubble";
import { Mascota, MASCOTA_SRC } from "../Mascota";
import { iniciarProgreso, type SeveridadR } from "@/lib/progress";
import { useRugidoDetector } from "@/hooks/useRugidoDetector";
import { useVideoChromaKey } from "@/hooks/useVideoChromaKey";
import {
  IconCheck,
  IconPlay,
  IconSparkles,
  IconLock,
  IconX,
  IconShieldCheck,
  IconCoin,
  IconMic,
  IconNotebook,
} from "../icons";

type Step =
  | "nombre"
  | "edad"
  | "dolor"
  | "reconocimiento"
  | "loading"
  | "revelacion"
  | "victoria"
  | "celebracion"
  | "paywall"
  | "gate";

const EDADES = ["4 años", "5 años", "6 años", "7 años", "8 años o más"];

const DOLORES = [
  "Dice L o W en vez de R (“cawo”, “lolo”)",
  "No pronuncia la R en ninguna palabra",
  "A veces sí, a veces no",
  "No estoy segura, por eso estoy aquí",
];

const NIVEL_POR_DOLOR: Record<string, string> = {
  "Dice L o W en vez de R (“cawo”, “lolo”)": "Sustitución de sonido",
  "No pronuncia la R en ninguna palabra": "Punto de partida",
  "A veces sí, a veces no": "En transición",
  "No estoy segura, por eso estoy aquí": "Primer diagnóstico",
};

// misma respuesta, pero como código — esto SÍ viaja hasta Progreso y
// personaliza qué tan exigente es el detector de voz (antes se perdía al
// terminar el onboarding, solo servía para el texto de arriba)
const SEVERIDAD_POR_DOLOR: Record<string, SeveridadR> = {
  "Dice L o W en vez de R (“cawo”, “lolo”)": "sustitucion",
  "No pronuncia la R en ninguna palabra": "omision",
  "A veces sí, a veces no": "inconsistente",
  "No estoy segura, por eso estoy aquí": "sin-diagnostico",
};

const INTERESES = [
  { id: "leon", label: "Los leones y animales feroces", emoji: "🦁" },
  { id: "pirata", label: "Los piratas y los tesoros", emoji: "🏴‍☠️" },
] as const;

const LOADING_LINES = (
  nombre: string,
  edad: string,
  tema: "leon" | "pirata"
) => [
  `Preparando el mundo de ${nombre}`,
  `Ajustando los ejercicios a sus ${edad}`,
  tema === "pirata" ? "Cargando el Espejo del Pirata" : "Cargando el Espejo del León",
  `Sirviendo la primera estrella de ${nombre}`,
];

const GATE_CHALLENGE = { a: 7, b: 5 };

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("nombre");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [dolor, setDolor] = useState("");
  // Elegir entre León/Pirata está pausado por ahora (solo León) — se
  // reactiva más adelante reponiendo el paso "interes" del funnel.
  const interes: "leon" | "pirata" = "leon";
  const [gateOptions] = useState(() => {
    const correct = GATE_CHALLENGE.a + GATE_CHALLENGE.b;
    const opts = [correct - 3, correct, correct + 4].sort(
      () => Math.random() - 0.5
    );
    return opts;
  });
  const [gateError, setGateError] = useState(false);

  function goPaywall() {
    setStep("paywall");
  }

  function irALogin(plan: "free" | "completo") {
    const edadNum = parseInt(edad, 10) || 5;
    const severidad = SEVERIDAD_POR_DOLOR[dolor] ?? "";
    router.push(
      `/login?plan=${plan}&nombre=${encodeURIComponent(nombre)}&interes=${interes}&edad=${edadNum}&severidad=${severidad}`
    );
  }

  /** Link real de pago en Hotmart (producto SuperErre, pago único). */
  const HOTMART_CHECKOUT_URL =
    "https://pay.hotmart.com/D107410546E?off=2vgwylvj";

  /** Al pasar la verificación de adulto, se manda a pagar de verdad a Hotmart —
   * antes solo entraba directo, sin pagar nada (hallazgo #2 de la auditoría).
   * Se guarda la personalización (nombre/edad/interés) para que ya esté lista
   * si vuelve en este mismo dispositivo tras pagar, pero SIN marcar "completo"
   * acá: ese plan lo sigue decidiendo solo el servidor (PlanSync), cuando haya
   * una sesión real — si se marcara acá, alguien que abandona el pago se
   * quedaría con acceso completo gratis para siempre (el mismo hueco del
   * hallazgo #1, reabierto por otra puerta). */
  function irAPagar() {
    const edadNum = parseInt(edad, 10) || 5;
    const severidad = SEVERIDAD_POR_DOLOR[dolor] ?? "";
    iniciarProgreso({
      nombre,
      plan: "free",
      interes,
      edad: edadNum,
      severidadR: severidad,
    });
    window.location.href = HOTMART_CHECKOUT_URL;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface-base">
      {step === "nombre" && (
        <>
          <FunnelHeader progress={15} />
          <StepNombre
            value={nombre}
            onChange={setNombre}
            onNext={() => setStep("edad")}
          />
        </>
      )}

      {step === "edad" && (
        <>
          <FunnelHeader progress={35} onBack={() => setStep("nombre")} />
          <StepEdad
            nombre={nombre}
            value={edad}
            onSelect={(v) => {
              setEdad(v);
              setTimeout(() => setStep("dolor"), 320);
            }}
          />
        </>
      )}

      {step === "dolor" && (
        <>
          <FunnelHeader progress={70} onBack={() => setStep("edad")} />
          <StepDolor
            value={dolor}
            onSelect={(v) => {
              setDolor(v);
              setTimeout(() => setStep("reconocimiento"), 320);
            }}
          />
        </>
      )}

      {step === "reconocimiento" && (
        <>
          <FunnelHeader progress={96} onBack={() => setStep("dolor")} />
          <StepReconocimiento
            nombre={nombre}
            interes={interes}
            nivel={NIVEL_POR_DOLOR[dolor] || "Primer diagnóstico"}
            onNext={() => setStep("loading")}
          />
        </>
      )}

      {step === "loading" && (
        <StepLoading
          nombre={nombre}
          edad={edad}
          interes={interes}
          onDone={() => setStep("revelacion")}
        />
      )}

      {step === "revelacion" && (
        <StepRevelacion
          nombre={nombre}
          interes={interes}
          onDone={() => setStep("victoria")}
        />
      )}

      {step === "victoria" && (
        <StepVictoria
          nombre={nombre}
          interes={interes}
          edad={parseInt(edad, 10) || 5}
          severidad={SEVERIDAD_POR_DOLOR[dolor]}
          onDone={() => setStep("celebracion")}
        />
      )}

      {step === "celebracion" && (
        <StepCelebracion nombre={nombre} onNext={goPaywall} />
      )}

      {step === "paywall" && (
        <StepPaywall
          nombre={nombre}
          nivel={NIVEL_POR_DOLOR[dolor] || "Primer diagnóstico"}
          interes={interes}
          onGratis={() => irALogin("free")}
          onCompleto={() => setStep("gate")}
          onCerrar={() => router.push("/")}
        />
      )}

      {step === "gate" && (
        <StepGate
          options={gateOptions}
          correct={GATE_CHALLENGE.a + GATE_CHALLENGE.b}
          a={GATE_CHALLENGE.a}
          b={GATE_CHALLENGE.b}
          error={gateError}
          onCorrect={irAPagar}
          onWrong={() => {
            setGateError(true);
            setTimeout(() => setGateError(false), 600);
          }}
          onBack={() => setStep("paywall")}
        />
      )}
    </div>
  );
}

/* ============ Paso: Nombre ============ */
function StepNombre({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-6 animate-fade-up">
      <MascotBubble>¿Cómo se llama tu hijo o hija?</MascotBubble>
      <p className="mt-3 pl-16 text-sm text-txt-secondary">
        Vamos a personalizar todo con su nombre.
      </p>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onNext();
        }}
        type="text"
        placeholder="Ej. Mateo"
        className="mt-8 w-full rounded-2xl border border-border-default bg-surface-primary px-5 py-4 text-lg text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-soft"
      />
      <div className="flex-1" />
      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}

/* ============ Paso: Edad ============ */
function StepEdad({
  nombre,
  value,
  onSelect,
}: {
  nombre: string;
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-6 animate-fade-up">
      <MascotBubble>¿Cuántos años tiene {nombre || "tu hijo"}?</MascotBubble>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {EDADES.map((e, i) => (
          <button
            key={e}
            onClick={() => onSelect(e)}
            className={`rounded-2xl py-6 text-center font-display font-bold text-xl transition-colors active:scale-[0.98] animate-fade-up ${
              i === EDADES.length - 1 && EDADES.length % 2 === 1
                ? "col-span-2"
                : ""
            } ${
              value === e
                ? "border-2 border-brand-primary bg-brand-primary-soft text-txt-on-primary-soft"
                : "border border-border-default bg-surface-primary text-txt-primary"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ Paso: Dolor (eco de FICHA-AVATAR) ============ */
function StepDolor({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-6 animate-fade-up">
      <MascotBubble>¿Cómo dice la R hoy?</MascotBubble>
      <p className="mt-3 pl-16 text-sm text-txt-secondary">
        Esto nos ayuda a armar sus primeros ejercicios.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {DOLORES.map((d, i) => (
          <Chip
            key={d}
            label={d}
            selected={value === d}
            onClick={() => onSelect(d)}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ Paso: Interés del niño (para personalizar el mapa) ============ */
function StepInteres({
  nombre,
  value,
  onSelect,
}: {
  nombre: string;
  value: string;
  onSelect: (v: (typeof INTERESES)[number]["id"]) => void;
}) {
  const n = nombre || "tu hijo";
  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-6 animate-fade-up">
      <MascotBubble>¿Qué le apasiona más a {n}?</MascotBubble>
      <p className="mt-3 pl-16 text-sm text-txt-secondary">
        Elegimos con esto qué mundo abre primero en su Mapa de Islas.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {INTERESES.map((i, idx) => (
          <Chip
            key={i.id}
            label={`${i.emoji}  ${i.label}`}
            selected={value === i.id}
            onClick={() => onSelect(i.id)}
            style={{ animationDelay: `${idx * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ Paso: Reconocimiento ============ */
function StepReconocimiento({
  nombre,
  interes,
  nivel,
  onNext,
}: {
  nombre: string;
  interes: string;
  nivel: string;
  onNext: () => void;
}) {
  const n = nombre || "tu hijo";
  const tema: "leon" | "pirata" = interes === "pirata" ? "pirata" : "leon";
  return (
    <div className="flex-1 flex flex-col px-5 pt-10 pb-6 text-center items-center animate-fade-up">
      <Mascota tema={tema} size={132} className="mb-4" />
      <p className="text-xs text-txt-tertiary mb-1">
        {n} y su {tema === "pirata" ? "Pirata" : "León"} guía
      </p>
      <span className="inline-flex items-center rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft text-xs font-bold px-3 py-2 mb-2">
        Nivel de {n}: {nivel}
      </span>
      <h1 className="mt-2 font-display font-extrabold text-2xl text-txt-primary text-balance">
        Buena noticia
      </h1>
      <p className="mt-4 text-base text-txt-secondary leading-relaxed max-w-sm">
        No es pereza de {n}:{" "}
        <strong className="text-txt-primary font-semibold">
          el sonido de la R esconde un movimiento de la lengua que casi
          nadie le explica bien
        </strong>
        . Le pasa a 3 de cada 10 niños de su edad — por eso el Espejo del
        León se lo muestra jugando, no explicando.
      </p>
      <div className="flex-1" />
      <button
        onClick={onNext}
        className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}

/* ============ Paso: Loading "construyendo el mundo de..." ============ */
function StepLoading({
  nombre,
  edad,
  interes,
  onDone,
}: {
  nombre: string;
  edad: string;
  interes: string;
  onDone: () => void;
}) {
  const tema: "leon" | "pirata" = interes === "pirata" ? "pirata" : "leon";
  const lineas = LOADING_LINES(nombre || "tu hijo", edad || "5 años", tema);
  const [activeLine, setActiveLine] = useState(0);
  const [pct, setPct] = useState(4);

  useEffect(() => {
    const totalMs = 4800;
    const perLine = totalMs / lineas.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    lineas.forEach((_, i) => {
      timers.push(
        setTimeout(() => setActiveLine(i + 1), perLine * (i + 1))
      );
    });
    const pctTimer = setInterval(() => {
      setPct((p) => Math.min(96, p + Math.random() * 14));
    }, 350);
    const doneTimer = setTimeout(() => {
      clearInterval(pctTimer);
      setPct(100);
      setTimeout(onDone, 500);
    }, totalMs + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(pctTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-8 text-center"
      aria-live="polite"
      aria-busy={pct < 100}
    >
      <div className="relative flex items-center justify-center">
        <div className="animate-float-slow" aria-hidden="true">
          <Mascota tema={tema} size={128} className="shadow-md" />
        </div>
        <span
          className="absolute -bottom-1 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary text-txt-on-brand shadow-md animate-breathe"
          aria-hidden="true"
        >
          <IconNotebook className="h-5 w-5" />
        </span>
        <span
          className="absolute -top-3 -left-4 text-2xl animate-float-slow-alt"
          aria-hidden="true"
        >
          ✨
        </span>
      </div>

      <div
        className="relative h-24 w-24 rounded-full flex items-center justify-center mt-6"
        style={{
          background: `conic-gradient(var(--brand-primary) ${pct * 3.6}deg, var(--surface-tertiary) 0deg)`,
        }}
      >
        <div className="h-16 w-16 rounded-full bg-surface-base flex items-center justify-center">
          <span className="font-display font-extrabold text-lg text-txt-primary tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <h1 className="mt-6 font-display font-bold text-xl text-txt-primary">
        Construyendo el mundo de {nombre || "tu hijo"}…
      </h1>
      <div className="mt-8 flex flex-col gap-3 items-start w-full max-w-xs">
        {lineas.map((l, i) => {
          const state =
            i < activeLine ? "done" : i === activeLine ? "active" : "pending";
          return (
            <div key={l} className="flex items-center gap-3">
              {state === "done" && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand">
                  <IconCheck className="h-3 w-3" />
                </span>
              )}
              {state === "active" && (
                <span className="h-5 w-5 shrink-0 flex items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-primary animate-breathe" />
                </span>
              )}
              {state === "pending" && (
                <span className="h-5 w-5 shrink-0 rounded-full border-2 border-border-strong" />
              )}
              <span
                className={`text-sm text-left ${
                  state === "pending" ? "text-txt-tertiary" : "text-txt-primary font-medium"
                }`}
              >
                {l}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Paso: Revelación ("el camino está listo") ============ */
function StepRevelacion({
  nombre,
  interes,
  onDone,
}: {
  nombre: string;
  interes: string;
  onDone: () => void;
}) {
  const tema: "leon" | "pirata" = interes === "pirata" ? "pirata" : "leon";
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-bubble-pop">
      <Mascota tema={tema} size={140} className="mb-2" />
      <h1 className="mt-4 font-display font-extrabold text-2xl sm:text-3xl text-txt-primary text-balance">
        ¡El camino de {nombre || "tu hijo"} está listo!
      </h1>
    </div>
  );
}

const COPIA_VICTORIA = {
  leon: {
    aria: "Tocar el espejo del león",
    idle: "Toca al León y ruge con él: ¡GRRR!",
    permiso: "Permite el micrófono para que el León te escuche…",
    escuchando: "Ahora ruge fuerte: “¡GRRR!”",
    detectado: "¡El León te escuchó rugir!",
  },
  pirata: {
    aria: "Tocar el espejo del pirata",
    idle: "Toca al Pirata y grita con él: ¡ARRR!",
    permiso: "Permite el micrófono para que el Pirata te escuche…",
    escuchando: "Ahora grita fuerte: “¡ARRR!”",
    detectado: "¡El Pirata te escuchó gritar!",
  },
} as const;

/* ============ Paso: Primera Victoria (con micrófono real, personalizado) ============ */
function StepVictoria({
  nombre,
  interes,
  edad,
  severidad,
  onDone,
}: {
  nombre: string;
  interes: string;
  edad: number;
  severidad?: SeveridadR;
  onDone: () => void;
}) {
  const tema: "leon" | "pirata" = interes === "pirata" ? "pirata" : "leon";
  const copia = COPIA_VICTORIA[tema];
  const { estado: stage, nivelVoz, empezar } = useRugidoDetector(edad, severidad);
  const escala = 1 + Math.min(nivelVoz, 100) / 220; // el personaje "respira" con la voz
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useVideoChromaKey(videoRef, canvasRef, "cover");

  // Si after de un buen rato escuchando no detecta nada (mic con ruido de
  // fondo, cancelación agresiva del celular, etc.) nunca debe quedar
  // trabado sin poder avanzar — se ofrece seguir de todos modos.
  const [tardando, setTardando] = useState(false);
  useEffect(() => {
    if (stage !== "escuchando") {
      setTardando(false);
      return;
    }
    const t = setTimeout(() => setTardando(true), 10000);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-up">
      {(stage === "idle" || stage === "pidiendo-permiso") && (
        <p className="text-sm font-bold text-txt-tertiary uppercase tracking-wide mb-6">
          Dale el celular a {nombre || "tu hijo"}
        </p>
      )}
      {stage === "escuchando" && (
        <div className="mb-6 flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-brand-secondary uppercase tracking-wide flex items-center gap-2">
            <IconMic className="h-4 w-4" /> Escuchando…
          </p>
          {/* Medidor real del volumen que capta el micrófono — para
              distinguir "no llega sonido" (mic/permiso) de "llega pero
              bajo" (necesita más fuerte), en vez de adivinar a ciegas. */}
          <div className="h-2.5 w-48 rounded-full bg-surface-tertiary overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-secondary transition-[width] duration-75"
              style={{ width: `${Math.min(100, nivelVoz)}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={stage === "idle" ? empezar : undefined}
        disabled={stage !== "idle"}
        className="relative flex h-48 w-48 items-center justify-center rounded-full overflow-hidden transition-transform active:scale-95"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, var(--brand-primary-light), var(--brand-primary) 72%)",
          boxShadow:
            "0 0 0 6px var(--surface-primary), 0 0 0 11px var(--brand-primary), 0 0 0 15px var(--surface-primary), 0 0 0 19px var(--brand-secondary)",
          transform: stage === "escuchando" ? `scale(${escala})` : undefined,
        }}
        aria-label={copia.aria}
      >
        <video
          ref={videoRef}
          key={tema}
          src={MASCOTA_SRC[tema]}
          autoPlay
          loop
          muted
          playsInline
          // display:none frena la decodificación de cuadros en varios
          // Android/Chrome (mismo bug ya corregido en Mascota.tsx/VideoCompanero)
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />
        <canvas
          ref={canvasRef}
          width={192}
          height={192}
          className={`h-full w-full rounded-full ${
            stage === "pidiendo-permiso" ? "animate-breathe" : ""
          }`}
        />
        {stage === "idle" && (
          <span className="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-txt-on-brand shadow-md">
            <IconPlay className="h-6 w-6" />
          </span>
        )}
      </button>

      <div className="mt-8 min-h-16">
        {stage === "idle" && (
          <p className="text-lg font-bold text-txt-primary">{copia.idle}</p>
        )}
        {stage === "pidiendo-permiso" && (
          <p className="text-lg font-bold text-txt-primary">
            {copia.permiso}
          </p>
        )}
        {stage === "escuchando" && !tardando && (
          <p className="text-lg font-bold text-txt-on-primary-soft">
            {copia.escuchando}
          </p>
        )}
        {stage === "escuchando" && tardando && (
          <p className="text-sm text-txt-secondary max-w-xs">
            ¿Sigue sin escucharte? No hay problema — tocá el botón de abajo
            para seguir de todos modos.
          </p>
        )}
        {stage === "detectado" && (
          <div className="flex items-center gap-2 text-brand-secondary animate-pop-in justify-center">
            <IconSparkles className="h-6 w-6" />
            <p className="text-lg font-bold">{copia.detectado}</p>
          </div>
        )}
        {stage === "sin-microfono" && (
          <p className="text-sm text-txt-secondary max-w-xs">
            No pudimos usar el micrófono. No hay problema — toca el botón
            de abajo para seguir de todos modos.
          </p>
        )}
      </div>

      {stage === "detectado" && (
        <button
          onClick={onDone}
          className="mt-8 w-full max-w-xs rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
        >
          Continuar
        </button>
      )}
      {stage === "sin-microfono" && (
        <button
          onClick={onDone}
          className="mt-4 w-full max-w-xs rounded-full border-2 border-border-strong text-txt-primary font-display font-bold text-base py-4 transition-colors"
        >
          Continuar sin micrófono
        </button>
      )}
      {stage === "escuchando" && tardando && (
        <button
          onClick={onDone}
          className="mt-4 w-full max-w-xs rounded-full border-2 border-border-strong text-txt-primary font-display font-bold text-base py-4 transition-colors"
        >
          Continuar de todos modos
        </button>
      )}
    </div>
  );
}

/* ============ Paso: Celebración ============ */
function StepCelebracion({
  nombre,
  onNext,
}: {
  nombre: string;
  onNext: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-pop-in">
      <span className="text-7xl mb-2">⭐</span>
      <h1 className="mt-2 font-display font-extrabold text-3xl text-txt-primary text-balance">
        ¡{nombre || "Tu hijo"} ya dio su primer paso!
      </h1>
      <p className="mt-3 text-base text-txt-secondary max-w-xs">
        Guardamos su primera estrella. Ahora arma su plan completo para
        seguir avanzando.
      </p>
      <button
        onClick={onNext}
        className="mt-9 w-full max-w-xs rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
      >
        Ver el plan de {nombre || "mi hijo"}
      </button>
    </div>
  );
}

/* ============ Paso: Paywall ============ */
function StepPaywall({
  nombre,
  nivel,
  interes,
  onGratis,
  onCompleto,
  onCerrar,
}: {
  nombre: string;
  nivel: string;
  interes: string;
  onGratis: () => void;
  onCompleto: () => void;
  onCerrar: () => void;
}) {
  const n = nombre || "tu hijo";
  const tema: "leon" | "pirata" = interes === "pirata" ? "pirata" : "leon";
  const nombrePersonaje = tema === "pirata" ? "Pirata" : "León";
  const bulletTema =
    tema === "pirata"
      ? `El Modo Pirata de ${n} desbloqueado, con mapas y tesoros`
      : `Más aventuras con su León en el Mapa de Islas`;
  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-8 overflow-y-auto animate-fade-up">
      <button
        onClick={onCerrar}
        aria-label="Cerrar"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary hover:bg-surface-secondary transition-colors -ml-2"
      >
        <IconX className="h-5 w-5" />
      </button>

      <h1 className="mt-4 font-display font-extrabold text-3xl text-txt-primary leading-tight text-balance">
        El Plan de {n} está listo
      </h1>
      <p className="mt-2 text-sm text-txt-secondary">
        Nivel: <strong className="text-txt-primary font-semibold">{nivel}</strong> · hecho con sus respuestas de hoy.
      </p>

      <div className="mt-6 rounded-2xl bg-surface-secondary p-5 space-y-3">
        {[
          `Ejercicios ajustados a la edad de ${n}`,
          `El Espejo del ${nombrePersonaje} y su primer ${
            tema === "pirata" ? "grito" : "rugido"
          }, ya guardados`,
          bulletTema,
          "Escalera Fonética completa: carro, perro, rana, ferrocarril",
        ].map((b, i) => (
          <div
            key={b}
            className="flex items-start gap-3 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-txt-primary font-medium">{b}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="rounded-2xl border border-border-default bg-surface-primary p-5">
          <p className="font-display font-bold text-base text-txt-primary">
            Gratis
          </p>
          <p className="text-sm text-txt-secondary mt-1">
            Praxias, el Espejo del León y 1 sonido
          </p>
        </div>

        <div className="relative rounded-2xl border-2 border-brand-primary bg-surface-primary p-5 shadow-lg">
          <span className="absolute -top-3 left-5 rounded-full bg-brand-primary text-txt-on-brand text-xs font-bold px-3 py-1">
            Recomendado
          </span>
          <p className="font-display font-bold text-base text-txt-primary">
            Espejo Completo
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display font-extrabold text-3xl text-txt-primary tabular-nums">
              $19.99
            </p>
            <span className="text-xs text-txt-tertiary">pago único</span>
          </div>
          <p className="text-xs text-txt-tertiary mt-1 flex items-center gap-2">
            <IconCoin className="h-3.5 w-3.5" />
            Para siempre, sin mensualidades
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-6" />

      <button
        onClick={onCompleto}
        className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-txt-on-brand font-display font-bold text-base py-4 btn-3d-primary transition-colors"
      >
        Desbloquear el Plan de {n}
      </button>
      <p className="mt-2 text-center text-xs text-txt-tertiary flex items-center justify-center gap-2">
        <IconShieldCheck className="h-3.5 w-3.5 text-brand-secondary" />
        Garantía del Primer Rugido · 7 días
      </p>
      <button
        onClick={onGratis}
        className="mt-4 text-center text-sm text-txt-secondary underline underline-offset-2"
      >
        Empezar gratis por ahora
      </button>
    </div>
  );
}

/* ============ Paso: Puerta de adulto (gate pre-pago) ============ */
function StepGate({
  options,
  correct,
  a,
  b,
  error,
  onCorrect,
  onWrong,
  onBack,
}: {
  options: number[];
  correct: number;
  a: number;
  b: number;
  error: boolean;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-8 pb-8 animate-fade-up">
      <FunnelHeader onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-secondary-soft text-txt-on-secondary-soft mb-5">
          <IconLock className="h-7 w-7" />
        </span>
        <h1 className="font-display font-extrabold text-2xl text-txt-primary text-balance">
          Un momento para los adultos
        </h1>
        <p className="mt-2 text-sm text-txt-secondary max-w-xs">
          Antes de continuar con el pago, resuelve esto para confirmar que
          eres tú:
        </p>
        <p
          className={`mt-6 font-display font-extrabold text-4xl tabular-nums ${
            error ? "text-error animate-pop-in" : "text-txt-primary"
          }`}
        >
          {a} + {b} = ?
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
          {options.map((n, i) => (
            <button
              key={n}
              onClick={n === correct ? onCorrect : onWrong}
              className="rounded-2xl border border-border-default bg-surface-primary py-4 font-display font-bold text-xl text-txt-primary hover:border-brand-primary transition-colors animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
