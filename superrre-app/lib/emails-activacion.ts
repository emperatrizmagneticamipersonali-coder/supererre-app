import "server-only";

/** Envoltorio visual común para los correos de activación — mismos colores
 * y tono que las plantillas de acceso (FICHA-ARTE.md), en la voz cálida del
 * avatar (FICHA-AVATAR.md): sin pelear, sin jerga, foco en el primer logro. */
function envoltorio(contenido: string) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF6E4;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#FFFFFB;border-radius:24px;padding:32px 28px;">
        ${contenido}
      </table>
    </td>
  </tr>
</table>`;
}

const BOTON = (texto: string, url: string) => `
  <tr>
    <td align="center" style="padding-bottom:20px;">
      <a href="${url}" style="background:#F0A93A;color:#22332E;font-weight:800;font-size:16px;text-decoration:none;padding:16px 32px;border-radius:999px;display:inline-block;">
        ${texto}
      </a>
    </td>
  </tr>`;

export function emailActivacionDia1(nombreNino: string, urlApp: string) {
  const nino = nombreNino || "tu peque";
  return {
    subject: "¿Ya escuchaste el primer rugido? 🦁",
    html: envoltorio(`
      <tr><td align="center" style="font-size:44px;padding-bottom:8px;">🦁</td></tr>
      <tr><td align="center" style="font-size:22px;font-weight:800;color:#22332E;padding-bottom:12px;">
        Solo 5 minutos al día
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.6;color:#6B6558;padding-bottom:20px;">
        Hola, esperamos que ${nino} ya haya conocido al León del Espejo. Si todavía no lo probaron, este es el mejor momento — no hace falta pelear ni insistir, solo abrir la app y dejar que ${nino} juegue un ratito.
      </td></tr>
      ${BOTON("Abrir SuperErre →", urlApp)}
      <tr><td style="font-size:13px;line-height:1.5;color:#6B6558;">
        Un tip: las mejores sesiones son cortas y seguidas — 5 minutos hoy valen más que 20 minutos una vez a la semana.
      </td></tr>
    `),
  };
}

export function emailActivacionDia3(nombreNino: string, urlApp: string) {
  const nino = nombreNino || "tu peque";
  return {
    subject: "¿Cómo va la práctica de la R? 🐾",
    html: envoltorio(`
      <tr><td align="center" style="font-size:44px;padding-bottom:8px;">🐾</td></tr>
      <tr><td align="center" style="font-size:22px;font-weight:800;color:#22332E;padding-bottom:12px;">
        Cada intento cuenta, aunque no salga perfecto
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.6;color:#6B6558;padding-bottom:20px;">
        Ya pasaron unos días desde que ${nino} empezó con SuperErre. Si sienten que va lento, es normal — la R no se aprende de un día para otro, y cada ejercicio (aunque parezca chiquito) suma. La app va desbloqueando cosas nuevas para que ${nino} no se aburra.
      </td></tr>
      ${BOTON("Seguir practicando →", urlApp)}
      <tr><td style="font-size:13px;line-height:1.5;color:#6B6558;">
        ¿Algo no funciona o tienes una duda? Responde a este correo, te leemos de verdad.
      </td></tr>
    `),
  };
}
