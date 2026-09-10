"use client";

import { useEffect } from "react";

/** Varios navegadores (sobre todo Android y iOS) bloquean en silencio la
 * síntesis de voz hasta que hubo un toque real del usuario en la página —
 * si `hablar()` se llama antes de eso (ej. apenas se abre un ejercicio,
 * desde un efecto automático) el navegador la descarta sin avisar. Este
 * componente "destraba" la voz con el PRIMER toque de toda la sesión en
 * /app, diciendo una palabra casi inaudible, para que las instrucciones
 * automáticas de ahí en adelante sí se escuchen. */
export function DesbloqueoAudio() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const destrabar = () => {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    };
    window.addEventListener("pointerdown", destrabar, { once: true });
    return () => window.removeEventListener("pointerdown", destrabar);
  }, []);
  return null;
}
