import type { PasoConfig } from "@/components/app/PasosEjercicio";

const CRESTA_ARRIBA = { cx: 80, cy: 86 };
const CRESTA_ABAJO = { cx: 80, cy: 124 };
const ESQUINA_IZQ = { cx: 48, cy: 108 };
const ESQUINA_DER = { cx: 112, cy: 108 };

/** Pasos exactos de cada ejercicio de Praxias, dibujados (no video generado)
 * para que coincidan 100% con la instrucción. Se van sumando de a poco. */
export const PASOS_EJERCICIOS: Record<string, PasoConfig[]> = {
  caballo: [
    { numero: 1, texto: "Lengua arriba", lenguaY: 44 },
    {
      numero: 2,
      texto: "Detrás de los dientes",
      lenguaY: 30,
      lenguaEscalaY: 0.85,
      meta: CRESTA_ARRIBA,
      metaActiva: true,
    },
    { numero: 3, texto: "¡Suelta fuerte!", lenguaY: 62, meta: CRESTA_ARRIBA, efecto: "clop" },
  ],

  ola: [
    { numero: 1, texto: "Afuera, a la izquierda", lenguaY: 78, lenguaX: -26 },
    { numero: 2, texto: "Afuera, a la derecha", lenguaY: 78, lenguaX: 26 },
  ],

  reloj: [
    {
      numero: 1,
      texto: "Toca una esquina",
      lenguaY: 55,
      lenguaX: -24,
      meta: ESQUINA_IZQ,
      metaActiva: true,
    },
    {
      numero: 2,
      texto: "Toca la otra",
      lenguaY: 55,
      lenguaX: 24,
      meta: ESQUINA_DER,
      metaActiva: true,
    },
  ],

  pintor: [
    {
      numero: 1,
      texto: "Empieza adelante",
      lenguaY: 36,
      lenguaX: -14,
      meta: { cx: 62, cy: 66 },
      metaActiva: true,
    },
    {
      numero: 2,
      texto: "Pinta hacia atrás",
      lenguaY: 36,
      lenguaX: 14,
      meta: { cx: 98, cy: 82 },
      metaActiva: true,
    },
  ],

  columpio: [
    { numero: 1, texto: "Sube a la nariz", lenguaY: -34, lenguaEscalaY: 0.9, narizMenton: true },
    { numero: 2, texto: "Baja a la barbilla", lenguaY: 100, lenguaEscalaY: 0.9, narizMenton: true },
  ],

  serpiente: [
    { numero: 1, texto: "Afuera rápido", lenguaY: 92, lenguaEscalaX: 0.85, efecto: "rapido" },
    { numero: 2, texto: "Adentro rápido", lenguaY: 62, lenguaEscalaX: 0.85, efecto: "rapido" },
  ],

  moto: [
    {
      numero: 1,
      texto: "Detrás de los dientes",
      lenguaY: 30,
      lenguaEscalaY: 0.85,
      meta: CRESTA_ARRIBA,
      metaActiva: true,
    },
    {
      numero: 2,
      texto: "Sopla y vibra: brrr",
      lenguaY: 30,
      lenguaEscalaY: 0.85,
      meta: CRESTA_ARRIBA,
      metaActiva: true,
      efecto: "vibra",
    },
  ],

  ardilla: [
    {
      numero: 1,
      texto: "Punta a la izquierda",
      lenguaY: 50,
      lenguaX: -20,
      lenguaEscalaX: 0.85,
      efecto: "rapido",
    },
    {
      numero: 2,
      texto: "Punta a la derecha",
      lenguaY: 50,
      lenguaX: 20,
      lenguaEscalaX: 0.85,
      efecto: "rapido",
    },
  ],

  elevador: [
    {
      numero: 1,
      texto: "Arriba, detrás de los dientes",
      lenguaY: 30,
      lenguaEscalaY: 0.85,
      meta: CRESTA_ARRIBA,
      metaActiva: true,
      metaSecundaria: CRESTA_ABAJO,
      metaSecundariaActiva: false,
      dientesAbajo: true,
    },
    {
      numero: 2,
      texto: "Abajo, detrás de los dientes",
      lenguaY: 96,
      lenguaEscalaY: 0.85,
      meta: CRESTA_ARRIBA,
      metaActiva: false,
      metaSecundaria: CRESTA_ABAJO,
      metaSecundariaActiva: true,
      dientesAbajo: true,
    },
  ],
};
