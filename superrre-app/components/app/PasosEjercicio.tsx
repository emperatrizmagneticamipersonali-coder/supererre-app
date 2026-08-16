export type PasoConfig = {
  numero: number;
  texto: string;
  /** desplazamiento horizontal de la lengua desde el centro (80) */
  lenguaX?: number;
  /** 62 = abajo/reposo · menor = más arriba · mayor = más abajo/afuera */
  lenguaY: number;
  lenguaEscalaY?: number;
  lenguaEscalaX?: number;
  /** punto objetivo a resaltar (cresta, esquina, etc.) */
  meta?: { cx: number; cy: number };
  metaActiva?: boolean;
  metaSecundaria?: { cx: number; cy: number };
  metaSecundariaActiva?: boolean;
  efecto?: "clop" | "vibra" | "rapido";
  /** mostrar referencia de nariz/mentón (Columpio) */
  narizMenton?: boolean;
  dientesAbajo?: boolean;
};

/** Un cuadro fijo de la boca (sin animar) para un paso puntual del ejercicio.
 * Mismo lenguaje visual en los 9 ejercicios de Praxias: labios, cavidad,
 * dientes y una lengua que se posiciona exactamente donde pide cada paso —
 * dibujo + datos, nunca un video generado, así siempre coincide 100% con
 * la instrucción. */
function MiniBoca({ paso }: { paso: PasoConfig }) {
  const {
    lenguaX = 0,
    lenguaY,
    lenguaEscalaY = 1,
    lenguaEscalaX = 1,
    meta,
    metaActiva,
    metaSecundaria,
    metaSecundariaActiva,
    efecto,
    narizMenton,
    dientesAbajo,
  } = paso;

  return (
    <svg viewBox="0 0 160 190" width="100%" height="100%" aria-hidden="true">
      {narizMenton && (
        <>
          <ellipse cx="80" cy="16" rx="10" ry="7" fill="var(--diagram-labio)" opacity="0.6" />
          <ellipse cx="80" cy="184" rx="14" ry="8" fill="var(--diagram-labio)" opacity="0.6" />
        </>
      )}

      {/* labios */}
      <path
        d="M26,74 C24,58 38,40 56,35 C68,32 76,39 80,39 C84,39 92,32 104,35
           C122,40 136,58 134,74 C132,94 134,112 134,128
           C136,143 124,161 104,166 C92,169 84,163 80,163
           C76,163 68,169 56,166 C38,161 24,143 26,128
           C26,112 28,94 26,74 Z"
        fill="var(--diagram-labio)"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />
      {/* cavidad */}
      <path
        d="M40,78 C38,65 50,51 65,47 C74,45 79,50 80,50 C81,50 86,45 95,47
           C110,51 122,65 120,78 C118,96 120,112 120,127
           C122,141 111,155 95,159 C86,162 81,156 80,156
           C79,156 74,162 65,159 C50,155 38,141 40,127
           C40,112 42,96 40,78 Z"
        fill="var(--diagram-cavidad)"
      />
      {/* dientes de arriba */}
      {[-30, -18, -6, 6, 18, 30].map((dx, i) => {
        const curva = (dx / 30) ** 2;
        const x = 80 + dx;
        const y = 60 + curva * 14;
        return (
          <rect
            key={`arriba-${i}`}
            x={x - 5}
            y={y}
            width="10"
            height="14"
            rx="3"
            fill="var(--surface-primary)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
        );
      })}
      {/* dientes de abajo, solo cuando el paso los necesita (Elevador) */}
      {dientesAbajo &&
        [-30, -18, -6, 6, 18, 30].map((dx, i) => {
          const curva = (dx / 30) ** 2;
          const x = 80 + dx;
          const y = 146 - curva * 12;
          return (
            <rect
              key={`abajo-${i}`}
              x={x - 5}
              y={y}
              width="10"
              height="13"
              rx="3"
              fill="var(--surface-primary)"
              stroke="var(--border-strong)"
              strokeWidth="1"
            />
          );
        })}

      {/* estallido "clop" */}
      {efecto === "clop" && (
        <g stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="58" y1="58" x2="50" y2="48" />
          <line x1="80" y1="52" x2="80" y2="40" />
          <line x1="102" y1="58" x2="110" y2="48" />
        </g>
      )}
      {/* vibración (Moto) */}
      {efecto === "vibra" && (
        <g stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M44,90 q4,-8 0,-16" />
          <path d="M116,90 q-4,-8 0,-16" />
        </g>
      )}
      {/* movimiento rápido (Serpiente/Ardilla) */}
      {efecto === "rapido" && (
        <g stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="30" y1="110" x2="20" y2="110" />
          <line x1="130" y1="110" x2="140" y2="110" />
        </g>
      )}

      {/* meta principal */}
      {meta && (
        <circle
          cx={meta.cx}
          cy={meta.cy}
          r="6.5"
          fill="var(--brand-primary)"
          opacity={metaActiva ? 1 : 0.35}
        />
      )}
      {/* meta secundaria (Elevador: cresta de arriba mientras se muestra la de abajo) */}
      {metaSecundaria && (
        <circle
          cx={metaSecundaria.cx}
          cy={metaSecundaria.cy}
          r="6.5"
          fill="var(--brand-primary)"
          opacity={metaSecundariaActiva ? 1 : 0.35}
        />
      )}

      {/* lengua */}
      <g
        style={{
          transform: `translate(${lenguaX}px, ${lenguaY - 62}px) scale(${lenguaEscalaX}, ${lenguaEscalaY})`,
          transformOrigin: "50% 100%",
        }}
      >
        <path
          d="M50,148 C47,124 62,105 80,103 C98,105 113,124 110,148
             C108,166 95,175 80,175 C65,175 52,166 50,148 Z"
          fill="var(--brand-accent)"
        />
      </g>
    </svg>
  );
}

export function PasosEjercicio({ pasos }: { pasos: PasoConfig[] }) {
  return (
    <div className="flex items-start justify-center gap-2 w-full max-w-xs">
      {pasos.map((paso, i) => (
        <div key={paso.numero} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-full aspect-[160/190] max-w-20">
              <span className="absolute -top-1 -left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-txt-on-brand font-display font-extrabold text-xs shadow-sm">
                {paso.numero}
              </span>
              <MiniBoca paso={paso} />
            </div>
            <p className="mt-1 text-xs font-bold text-txt-secondary text-center leading-tight">
              {paso.texto}
            </p>
          </div>
          {i < pasos.length - 1 && (
            <span className="text-txt-tertiary text-lg pb-5" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
