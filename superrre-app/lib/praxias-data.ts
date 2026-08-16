export type Praxia = {
  id: string;
  nombre: string;
  emoji: string;
  instruccion: string;
  duracionSeg: number;
  /** video del personaje haciendo el ejercicio de verdad, uno por tema — opcional, se va sumando de a poco */
  videoDemo?: { leon?: string; pirata?: string };
};

export type NivelPraxias = {
  nombre: string;
  praxias: Praxia[];
};

export const NIVELES_PRAXIAS: NivelPraxias[] = [
  {
    nombre: "Calentamiento",
    praxias: [
      {
        id: "caballo",
        nombre: "El Chasquido de Caballo",
        emoji: "🐴",
        instruccion:
          'Pega la lengua arriba, atrás de los dientes, y suéltala fuerte para hacer "clop clop" como un caballo.',
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-caballo.mp4" },
      },
      {
        id: "ola",
        nombre: "La Ola",
        emoji: "🌊",
        instruccion:
          "Saca la lengua y muévela de una esquina de la boca a la otra, despacito, como una ola.",
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-ola.mp4" },
      },
      {
        id: "reloj",
        nombre: "El Reloj",
        emoji: "🕐",
        instruccion:
          'Toca con la punta de la lengua una esquina de la boca y luego la otra: "tic, tac, tic, tac".',
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-reloj.mp4" },
      },
    ],
  },
  {
    nombre: "Fuerza y Puntería",
    praxias: [
      {
        id: "pintor",
        nombre: "El Pintor",
        emoji: "🖌️",
        instruccion:
          "Con la punta de la lengua, pinta el techo de la boca de adelante hacia atrás, como un pincel.",
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-pintor.mp4" },
      },
      {
        id: "columpio",
        nombre: "El Columpio",
        emoji: "🎪",
        instruccion:
          "Sube la lengua a tocar la nariz y luego bájala a tocar la barbilla, como un columpio.",
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-columpio.mp4" },
      },
      {
        id: "serpiente",
        nombre: "La Serpiente",
        emoji: "🐍",
        instruccion:
          "Saca la lengua rápido y métela rápido, muchas veces, como una serpiente que sisea.",
        duracionSeg: 15,
        videoDemo: { leon: "/mascots/praxia-serpiente.mp4" },
      },
    ],
  },
  {
    nombre: "Casi Listos para la R",
    praxias: [
      {
        id: "moto",
        nombre: "La Moto",
        emoji: "🏍️",
        instruccion:
          "Pon la punta de la lengua justo detrás de los dientes de arriba y sopla fuerte para hacerla vibrar: brrrrr, como el motor de una moto.",
        duracionSeg: 20,
        videoDemo: { leon: "/mascots/praxia-moto.mp4" },
      },
      {
        id: "ardilla",
        nombre: "La Ardilla",
        emoji: "🐿️",
        instruccion:
          "Mueve la punta de la lengua bien rápido de un lado a otro, sin parar, como la colita de una ardilla nerviosa.",
        duracionSeg: 20,
        videoDemo: { leon: "/mascots/praxia-ardilla.mp4" },
      },
      {
        id: "elevador",
        nombre: "El Elevador",
        emoji: "🛗",
        instruccion:
          "Sube la punta de la lengua a tocar detrás de los dientes de arriba, y bájala a tocar detrás de los dientes de abajo, como un elevador.",
        duracionSeg: 20,
        videoDemo: { leon: "/mascots/praxia-elevador.mp4" },
      },
    ],
  },
];

export const TODAS_LAS_PRAXIAS: Praxia[] = NIVELES_PRAXIAS.flatMap(
  (n) => n.praxias
);

export const TOTAL_PRAXIAS = TODAS_LAS_PRAXIAS.length;
