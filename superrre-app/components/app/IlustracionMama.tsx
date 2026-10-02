export type TipoIlustracion = "hisopo" | "ancha";

const TEXTO = { fill: "var(--text-primary)", fontSize: 13, fontWeight: 700 } as const;

/** Vista de lado de la boca: el palito del hisopo toca la encía de arriba,
 * detrás de los dientes frontales; el algodón queda afuera. Dibujo esquemático
 * con los colores de la marca, no una foto. */
function Hisopo() {
  return (
    <svg
      viewBox="0 0 320 220"
      width="100%"
      role="img"
      aria-label="Dibujo de la boca vista de lado: el palito del hisopo toca la encía de arriba, detrás de los dientes de adelante, con la punta de la lengua apoyada ahí y el algodón afuera de la boca."
    >
      {/* cavidad de la boca */}
      <path
        d="M88,72 C120,56 190,52 252,68 C288,84 288,136 252,152 C200,168 130,164 92,150 Z"
        fill="var(--diagram-cavidad)"
      />
      {/* lengua con la punta arriba, en la encía */}
      <path
        d="M262,144 C200,166 140,158 112,140 C98,126 102,98 112,82 C118,88 126,100 142,108 C172,120 226,116 268,122 Z"
        fill="var(--brand-accent)"
      />
      {/* encía de arriba, detrás de los dientes */}
      <path
        d="M97,72 C102,62 126,60 130,74 C130,84 120,86 112,86 C103,86 97,81 97,72 Z"
        fill="var(--diagram-labio)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
      {/* labios */}
      <rect x="50" y="62" width="48" height="20" rx="10" fill="var(--diagram-labio)" stroke="var(--border-strong)" strokeWidth="2" />
      <rect x="50" y="138" width="48" height="20" rx="10" fill="var(--diagram-labio)" stroke="var(--border-strong)" strokeWidth="2" />
      {/* dientes */}
      <rect x="86" y="72" width="13" height="28" rx="4" fill="var(--surface-primary)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <rect x="88" y="130" width="13" height="26" rx="4" fill="var(--surface-primary)" stroke="var(--border-strong)" strokeWidth="1.5" />
      {/* punto donde va la punta de la lengua */}
      <circle cx="113" cy="77" r="6.5" fill="var(--brand-primary)" />
      {/* aire que sale */}
      <g stroke="var(--brand-secondary)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M78,108 L36,108 M46,102 L36,108 L46,114" />
        <path d="M78,122 L44,122 M54,116 L44,122 L54,128" />
      </g>
      {/* hisopo: palito + algodón afuera */}
      <line x1="46" y1="168" x2="113" y2="79" stroke="var(--text-secondary)" strokeWidth="8" strokeLinecap="round" />
      <line x1="46" y1="168" x2="113" y2="79" stroke="var(--surface-primary)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="42" cy="174" r="10" fill="var(--surface-primary)" stroke="var(--text-secondary)" strokeWidth="2" />
      {/* etiquetas */}
      <line x1="120" y1="72" x2="152" y2="46" stroke="var(--text-secondary)" strokeWidth="1.5" />
      <text x="156" y="38" {...TEXTO}>Aquí va la punta</text>
      <text x="156" y="54" {...TEXTO}>de la lengua</text>
      <text x="62" y="200" {...TEXTO}>Algodón afuera</text>
      <text x="8" y="96" {...TEXTO} fill="var(--brand-secondary)">Sopla</text>
    </svg>
  );
}

/** Vista de frente: sonrisa grande y lengua ancha cubriendo los dientes. */
function Ancha() {
  return (
    <svg
      viewBox="0 0 320 220"
      width="100%"
      role="img"
      aria-label="Dibujo de la boca vista de frente: labios en forma de sonrisa y la lengua ancha y relajada cubriendo los dientes de abajo, mientras sale el aire."
    >
      {/* labios en sonrisa */}
      <path
        d="M50,92 C84,52 236,52 270,92 C250,162 70,162 50,92 Z"
        fill="var(--diagram-labio)"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />
      {/* cavidad */}
      <path
        d="M72,94 C100,70 220,70 248,94 C230,142 90,142 72,94 Z"
        fill="var(--diagram-cavidad)"
      />
      {/* dientes de arriba */}
      {[-48, -32, -16, 0, 16, 32, 48].map((dx) => (
        <rect
          key={dx}
          x={160 + dx - 7}
          y={78 + (dx / 48) ** 2 * 8}
          width="14"
          height="18"
          rx="4"
          fill="var(--surface-primary)"
          stroke="var(--border-strong)"
          strokeWidth="1.2"
        />
      ))}
      {/* lengua ancha y relajada */}
      <path
        d="M84,112 C118,100 202,100 236,112 C226,136 100,140 84,112 Z"
        fill="var(--brand-accent)"
      />
      {/* aire suave */}
      <g stroke="var(--brand-secondary)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M120,176 q10,-8 20,0 t20,0 t20,0" />
        <path d="M130,192 q10,-8 20,0 t20,0" />
      </g>
      {/* etiquetas */}
      <line x1="236" y1="116" x2="256" y2="136" stroke="var(--text-secondary)" strokeWidth="1.5" />
      <text x="214" y="152" {...TEXTO} textAnchor="start">Lengua ancha</text>
      <line x1="266" y1="88" x2="276" y2="48" stroke="var(--text-secondary)" strokeWidth="1.5" />
      <text x="200" y="40" {...TEXTO}>Sonrisa grande</text>
      <text x="196" y="184" {...TEXTO} fill="var(--brand-secondary)">Suelta el aire</text>
    </svg>
  );
}

export function IlustracionMama({ tipo }: { tipo: TipoIlustracion }) {
  return (
    <figure className="rounded-2xl border border-border-default bg-surface-primary p-3">
      <div className="mx-auto max-w-sm">
        {tipo === "hisopo" ? <Hisopo /> : <Ancha />}
      </div>
      <figcaption className="mt-1 text-center text-xs text-txt-tertiary">
        Dibujo de referencia
      </figcaption>
    </figure>
  );
}
