"use client";

/** Sonido corto de "moneda ganada" — 2 tonos ascendentes sintetizados con
 * Web Audio, sin depender de ningún archivo de audio (100% local, se genera
 * en el momento). Silencioso si el navegador bloquea audio. */
export function reproducirSonidoMonedas() {
  if (typeof window === "undefined") return;
  try {
    type CtxCtor = typeof AudioContext;
    const Ctx: CtxCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: CtxCtor }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const ahora = ctx.currentTime;
    const notas = [880, 1320];
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const inicio = ahora + i * 0.09;
      gain.gain.setValueAtTime(0.0001, inicio);
      gain.gain.exponentialRampToValueAtTime(0.16, inicio + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.15);
    });
    setTimeout(() => ctx.close(), 400);
  } catch {
    // sin sonido si el navegador lo bloquea — no es crítico
  }
}
