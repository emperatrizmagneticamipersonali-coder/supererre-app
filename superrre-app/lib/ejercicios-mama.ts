import type { TipoIlustracion } from "@/components/app/IlustracionMama";

export type EjercicioMama = {
  id: string;
  ilustracion: TipoIlustracion;
  nombre: string;
  resumen: string;
  paraQue: string;
  minutos: number;
  necesitas: string[];
  pasos: string[];
  quedecir: string;
  conHisopo: boolean;
};

export const CUIDADOS_GENERALES = [
  "Hazlo con calma y sin forzar. Si hay arcadas, dolor o llanto, paren y sigan otro día.",
  "Si tu hijo tiene heridas en la boca o alguna alergia, no lo hagas y consulta primero.",
  "Sesiones de unos pocos minutos. Si pasan semanas sin avance, consulta a un fonoaudiólogo.",
];

export const CUIDADOS_HISOPO = [
  "Lávense las manos y usa un hisopo (cotonete) nuevo y entero cada vez.",
  "El algodón siempre queda afuera de la boca. Revisa que no tenga algodón suelto.",
  "Tú sostienes el extremo de afuera. Nunca dejes que lo muerda ni que camine o juegue con él en la boca.",
];

export const EJERCICIOS_MAMA: EjercicioMama[] = [
  {
    id: "hisopo-rr",
    ilustracion: "hisopo",
    nombre: "El hisopo para la R fuerte",
    resumen: "Una pista para que la puntita de la lengua encuentre su lugar.",
    paraQue:
      "Ayuda a que tu hijo sienta dónde va la punta de la lengua y a lograr que vibre, que es lo que hace la R fuerte (rr).",
    minutos: 5,
    necesitas: [
      "Un hisopo (cotonete) nuevo",
      "Manos limpias",
      "Un espejo",
    ],
    pasos: [
      "Siéntense frente al espejo, con tu hijo tranquilo y la boca abierta.",
      "Muéstrale la zona: la encía de arriba, justo detrás de los dientes de adelante. Ahí va la punta de la lengua.",
      "Apoya el extremo del palito del hisopo en esa zona. El algodón queda siempre afuera de la boca.",
      "Pídele que apoye la punta de la lengua ahí y mantenga esa postura, mientras tú sostienes el hisopo desde afuera.",
      "Pídele que tome aire por la nariz y lo suelte por la boca, con algo de fuerza, sin mover la lengua de ese lugar.",
      "Repítelo varias veces. Suelen ser varios intentos hasta sentir que la lengua vibra. Celebra cada intento.",
    ],
    quedecir:
      "Pon la puntita de la lengua aquí, respira por la nariz y sopla fuerte, como un motorcito.",
    conHisopo: true,
  },
  {
    id: "lengua-ancha",
    ilustracion: "ancha",
    nombre: "Lengua ancha y sonrisa",
    resumen: "Prepara el aire y la lengua para la R fuerte, sin ningún objeto.",
    paraQue:
      "Enseña a soltar el aire con la lengua ancha y relajada, que es la base para producir la R fuerte (rr).",
    minutos: 3,
    necesitas: ["Un espejo", "Manos limpias"],
    pasos: [
      "Siéntense frente al espejo. Pídele una sonrisa grande, con los labios en forma de sonrisa.",
      "Pídele que ponga la lengua ancha y relajada, cubriendo los dientes (la arcada dentaria).",
      "Pídele que suelte el aire por la boca, con la lengua ancha y la sonrisa puestas.",
      "Miren juntos en el espejo que la lengua se mantenga ancha y la sonrisa no se cierre.",
      "Repítanlo varias veces y celebra cada intento, aunque todavía no salga el sonido.",
    ],
    quedecir:
      "Haz tu sonrisa grande, lengua ancha como una galleta, y suelta el aire despacito.",
    conHisopo: false,
  },
];
