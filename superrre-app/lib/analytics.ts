const DEVICE_KEY = "superrre_device_id";
const SESION_DIARIA_KEY = "superrre_sesion_diaria";

function idDeDispositivo(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Registra un evento de uso real para el panel de administración (activación/retención).
 * Nunca bloquea ni rompe la UI: si falla (sin red, endpoint caído), se ignora en silencio —
 * medir uso no puede costarle una experiencia rota a un niño practicando. */
export function track(type: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, deviceId: idDeDispositivo(), metadata }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silencioso a propósito
  }
}

/** `sesion_iniciada` una sola vez por día activo (base de las curvas D1/D7/D30) — dedup
 * por fecha en localStorage, igual que documenta 36-ANALITICA-Y-EVENTOS. */
export function trackSesionDiaria() {
  if (typeof window === "undefined") return;
  const hoy = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(SESION_DIARIA_KEY) === hoy) return;
  localStorage.setItem(SESION_DIARIA_KEY, hoy);
  track("sesion_iniciada", {});
}

export function logError(message: string, context: string) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, deviceId: idDeDispositivo() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silencioso a propósito
  }
}
