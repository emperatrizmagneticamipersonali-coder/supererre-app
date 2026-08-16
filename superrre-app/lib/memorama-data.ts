export type CartaMemorama = { palabra: string; emoji: string };

/**
 * Banco de palabras del memorama, organizado por letra. Hoy solo existe "R"
 * y "L"; cuando se agreguen secciones para otras letras (S, CH…) se suman
 * aquí con la misma forma. El emoji funciona como el "dibujo" de la carta —
 * ayuda a los niños que aún no leen a emparejar por imagen, no solo texto.
 * Hay más palabras que las que se usan en un solo juego, para que cada
 * nivel y cada "jugar otra vez" pueda mostrar una selección distinta.
 */
export const PALABRAS_MEMORAMA_POR_LETRA: Record<string, CartaMemorama[]> = {
  R: [
    { palabra: "carro", emoji: "🚗" },
    { palabra: "perro", emoji: "🐶" },
    { palabra: "rana", emoji: "🐸" },
    { palabra: "risa", emoji: "😄" },
    { palabra: "rueda", emoji: "🛞" },
    { palabra: "reloj", emoji: "⏰" },
    { palabra: "ratón", emoji: "🐭" },
    { palabra: "toro", emoji: "🐂" },
    { palabra: "regalo", emoji: "🎁" },
    { palabra: "tenedor", emoji: "🍴" },
  ],
  L: [
    { palabra: "leche", emoji: "🥛" },
    { palabra: "libro", emoji: "📖" },
    { palabra: "loro", emoji: "🦜" },
    { palabra: "luna", emoji: "🌙" },
    { palabra: "lápiz", emoji: "✏️" },
    { palabra: "pelota", emoji: "⚽" },
    { palabra: "limón", emoji: "🍋" },
    { palabra: "luz", emoji: "💡" },
    { palabra: "lobo", emoji: "🐺" },
    { palabra: "helado", emoji: "🍦" },
  ],
};

export const LETRAS_MEMORAMA = Object.keys(PALABRAS_MEMORAMA_POR_LETRA);

/** cantidad de parejas por nivel — sube conforme el niño avanza */
export const PAREJAS_POR_NIVEL = [4, 6, 8, 10];
