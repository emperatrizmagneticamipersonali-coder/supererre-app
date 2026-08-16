export type Sonido = {
  id: string;
  nombre: string;
  pista: string;
  /** video del personaje haciendo el sonido de verdad — opcional, se va sumando de a poco */
  videoDemo?: string;
};

export type ModoSonidos = {
  nombre: string;
  emoji: string;
  sonidos: Sonido[];
};

export const MODOS: Record<"leon" | "pirata", ModoSonidos> = {
  leon: {
    nombre: "Modo León",
    emoji: "🦁",
    sonidos: [
      {
        id: "rugido",
        nombre: "El Rugido",
        pista: "¡GRRR!",
        videoDemo: "/mascots/sonido-rugido.mp4",
      },
      {
        id: "ronroneo",
        nombre: "El Ronroneo",
        pista: "rrrrr…",
        videoDemo: "/mascots/sonido-ronroneo.mp4",
      },
      {
        id: "rugido-rey",
        nombre: "El Rugido del Rey",
        pista: "¡GRRRR, soy el rey!",
        videoDemo: "/mascots/sonido-rugido-rey.mp4",
      },
      {
        id: "gruñido",
        nombre: "El Gruñido Bajito",
        pista: "grrr… grrr…",
        videoDemo: "/mascots/sonido-grunido.mp4",
      },
    ],
  },
  pirata: {
    nombre: "Modo Pirata",
    emoji: "🏴‍☠️",
    sonidos: [
      { id: "grito", nombre: "El Grito Pirata", pista: "¡ARRR!" },
      { id: "tesoro", nombre: "El Grito del Tesoro", pista: "¡ARRR, tesoro!" },
      {
        id: "guerra",
        nombre: "El Grito de Guerra",
        pista: "¡ARRR, al abordaje!",
      },
      { id: "loro", nombre: "El Loro Pirata", pista: "¡Rrraca, tesoro!" },
    ],
  },
};

export const TOTAL_SONIDOS_POR_MODO = MODOS.leon.sonidos.length;
