import type { TipoIlustracion } from "@/components/app/IlustracionMama";

export type EjercicioMama = {
  id: string;
  grupo: "guiado" | "espejo";
  /** dibujo SVG propio (ejercicios guiados) */
  ilustracion?: TipoIlustracion;
  /** imagen de la cuadrícula (ejercicios frente al espejo) */
  imagen?: string;
  /** etiqueta corta que se ve sobre la imagen en la cuadrícula */
  etiqueta?: string;
  /** nota que explica la imagen, debajo de ella */
  pie?: string;
  nombre: string;
  resumen: string;
  paraQue: string;
  minutos: number;
  necesitas: string[];
  pasos: string[];
  quedecir: string;
  cuidados: string[];
  conHisopo: boolean;
};

const CUIDADOS_GENERALES = [
  "Hazlo con calma y sin forzar. Si hay arcadas, dolor o llanto, paren y sigan otro día.",
  "Si tu hijo tiene heridas en la boca o alguna alergia, no lo hagas y consulta primero.",
  "Sesiones de unos pocos minutos. Si pasan semanas sin avance, consulta a un fonoaudiólogo.",
];

const CUIDADOS_HISOPO = [
  "Lávense las manos y usa un hisopo (cotonete) nuevo y entero cada vez.",
  "El algodón siempre queda afuera de la boca. Revisa que no tenga algodón suelto.",
  "Tú sostienes el extremo de afuera. Nunca dejes que lo muerda ni que camine o juegue con él en la boca.",
];

const CUIDADOS_ESPEJO = [
  "Hazlo como un juego y sin forzar. Si se cansa o se incomoda, paren y sigan otro día.",
  "Sesiones cortas. Si pasan semanas sin avance, consulta a un fonoaudiólogo.",
];

const CUIDADOS_PAJITA = [
  "Es para soplar, no para beber: si empieza a sorber o a tragar agua, paren.",
  "Usa un vaso estable con solo un dedo de agua y quédate a su lado todo el tiempo.",
];

const ESPEJO_BASE = {
  grupo: "espejo" as const,
  conHisopo: false,
  minutos: 2,
  necesitas: ["Un espejo", "Manos limpias"],
  cuidados: CUIDADOS_ESPEJO,
};

export const EJERCICIOS_MAMA: EjercicioMama[] = [
  {
    id: "hisopo-rr",
    grupo: "guiado",
    imagen: "/ejercicios/hisopo-rr.jpg",
    pie: "El círculo muestra lo mismo visto de lado: el punto dorado marca el lugar, en la encía justo detrás de los dientes de arriba, donde van la punta de la lengua y la punta del palito. El algodón siempre queda afuera, en tus dedos.",
    nombre: "El hisopo para la R fuerte",
    resumen: "Una pista para que la puntita de la lengua encuentre su lugar.",
    paraQue:
      "Para decir la R fuerte (como en “carro”), la punta de la lengua tiene que subir a un lugar exacto, la encía de arriba justo detrás de los dientes, y vibrar con el aire. Muchos niños no sienten dónde está ese lugar. El hisopo les da una pista que pueden sentir para encontrarlo. Es normal que tarden varios intentos: lo importante es que se sienta seguro y se divierta.",
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
    cuidados: [...CUIDADOS_HISOPO, ...CUIDADOS_GENERALES],
    conHisopo: true,
  },
  {
    id: "lengua-ancha",
    grupo: "guiado",
    ilustracion: "ancha",
    nombre: "Lengua ancha y sonrisa",
    resumen: "Prepara el aire y la lengua para la R fuerte, sin ningún objeto.",
    paraQue:
      "La R fuerte necesita que el aire salga con la lengua ancha y relajada, no tensa ni en punta. Este ejercicio le enseña esa sensación, sin objetos y sin presión. Es un buen calentamiento antes de otros ejercicios de la R fuerte.",
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
    cuidados: CUIDADOS_GENERALES,
    conHisopo: false,
  },
  {
    ...ESPEJO_BASE,
    id: "sonrisa",
    imagen: "/ejercicios/sonrisa.jpg",
    etiqueta: "Sonrisa grande",
    nombre: "Sonrisa grande",
    resumen: "Estira los labios y las mejillas con una sonrisa enorme.",
    paraQue:
      "Calienta los músculos de los labios y las mejillas y le enseña a moverlos con control. Hablar bien necesita una cara que se mueva con soltura. Es de los ejercicios que más fácil salen, ideal para empezar con buen ánimo.",
    pasos: [
      "Siéntense frente al espejo.",
      "Pídele una sonrisa muy grande, mostrando los dientes.",
      "Mantengan la sonrisa unos segundos, contando juntos. Luego relájenla.",
      "Repítanlo varias veces, mirándose en el espejo.",
    ],
    quedecir: "Sonríe lo más grande que puedas, ¡hasta que te duelan las mejillas de risa!",
  },
  {
    ...ESPEJO_BASE,
    id: "beso",
    imagen: "/ejercicios/beso.jpg",
    etiqueta: "Beso",
    nombre: "El beso",
    resumen: "Labios hacia adelante, como para dar un beso.",
    paraQue:
      "Ayuda a que los labios se muevan hacia adelante y se redondeen, y a pasar de un gesto a otro con facilidad (sonrisa, beso, sonrisa). Esa agilidad de los labios se usa al hablar todo el tiempo.",
    pasos: [
      "Siéntense frente al espejo.",
      "Pídele que lleve los labios hacia adelante, como si fuera a dar un beso.",
      "Mantengan el beso unos segundos y luego relajen.",
      "Alternen: sonrisa grande, beso, sonrisa grande, beso.",
    ],
    quedecir: "Manda un beso grande, ¡como a la abuela!",
  },
  {
    ...ESPEJO_BASE,
    id: "mejillas",
    imagen: "/ejercicios/mejillas.jpg",
    etiqueta: "Inflar mejillas",
    nombre: "Inflar las mejillas",
    resumen: "Llenar de aire las mejillas y soltarlo despacio.",
    paraQue:
      "Enseña a guardar el aire y soltarlo poco a poco, y fortalece las mejillas. Controlar el aire es importante porque la R necesita una salida de aire constante.",
    pasos: [
      "Siéntense frente al espejo.",
      "Pídele que llene de aire las mejillas, con los labios cerrados.",
      "Mantengan el aire unos segundos.",
      "Pídele que suelte el aire despacio. Repítanlo varias veces.",
    ],
    quedecir: "Infla las mejillas como un globo y suelta el aire despacito.",
  },
  {
    ...ESPEJO_BASE,
    id: "lengua-afuera",
    imagen: "/ejercicios/lengua-afuera.jpg",
    etiqueta: "Sacar la lengua",
    nombre: "Sacar la lengua",
    resumen: "Sacarla bien recta hacia adelante y volver a meterla.",
    paraQue:
      "Entrena que la lengua se mueva hacia afuera y hacia adentro con control, y que se mantenga derechita. Cuando tu hijo controla su lengua, le es más fácil colocarla donde pide cada sonido, incluida la R.",
    pasos: [
      "Siéntense frente al espejo, con la boca abierta.",
      "Pídele que saque la lengua lo más recta posible, hacia adelante.",
      "Mantengan unos segundos y luego pídele que la meta.",
      "Repítanlo varias veces, mirando el espejo para que salga recta.",
    ],
    quedecir: "Saca la lengua larga y derechita, como una regla.",
  },
  {
    ...ESPEJO_BASE,
    id: "lengua-lado-a",
    imagen: "/ejercicios/lengua-lado-a.jpg",
    etiqueta: "Lengua a un lado",
    nombre: "Lengua hacia un lado",
    resumen: "Llevar la punta de la lengua a una esquina de la boca.",
    paraQue:
      "Enseña a mover la lengua hacia los lados sin mover la cabeza ni la mandíbula. Esa independencia de la lengua es lo que después le permite colocar la punta justo donde la necesita para decir la R.",
    pasos: [
      "Siéntense frente al espejo, con la boca abierta.",
      "Pídele que lleve la punta de la lengua hacia una esquina de la boca, sin mover la cabeza.",
      "Mantengan unos segundos y regresen la lengua al centro.",
      "Repítanlo varias veces.",
    ],
    quedecir: "Lleva la puntita de la lengua a la esquina de la boca, sin mover la cabeza.",
  },
  {
    ...ESPEJO_BASE,
    id: "lengua-lado-b",
    imagen: "/ejercicios/lengua-lado-b.jpg",
    etiqueta: "Lengua al otro lado",
    nombre: "Lengua hacia el otro lado",
    resumen: "Ahora la punta de la lengua va a la esquina contraria.",
    paraQue:
      "Es la misma idea del ejercicio anterior, pero hacia el otro lado. Así la lengua aprende a moverse con soltura hacia los dos lados, sin que se mueva la cabeza.",
    pasos: [
      "Siéntense frente al espejo, con la boca abierta.",
      "Pídele que lleve la punta de la lengua a la esquina contraria de la boca, sin mover la cabeza.",
      "Mantengan unos segundos y regresen la lengua al centro.",
      "Cuando los dos lados salgan bien, pásala de un lado al otro, como un péndulo.",
    ],
    quedecir: "Ahora al otro lado, como el péndulo de un reloj.",
  },
  {
    ...ESPEJO_BASE,
    id: "lengua-arriba",
    imagen: "/ejercicios/lengua-arriba.jpg",
    etiqueta: "Lengua arriba",
    nombre: "Lengua arriba, detrás de los dientes",
    resumen: "Tocar con la punta la parte de arriba, justo detrás de los dientes.",
    paraQue:
      "Este es el lugar clave de la R fuerte: la punta de la lengua toca el techo de la boca, justo detrás de los dientes de arriba. Aquí tu hijo aprende a subir la lengua hasta ahí y a mantenerla, antes de intentar soltar el aire para que vibre.",
    pasos: [
      "Siéntense frente al espejo, con la boca bien abierta.",
      "Pídele que suba la punta de la lengua y toque el techo de la boca, justo detrás de los dientes de arriba.",
      "Mantengan unos segundos y luego bajen la lengua.",
      "Repítanlo varias veces, mirando en el espejo cómo sube la punta.",
    ],
    quedecir: "Sube la puntita de la lengua y toca el techo, justo detrás de los dientes de arriba.",
  },
  {
    ...ESPEJO_BASE,
    id: "abrir-boca",
    imagen: "/ejercicios/abrir-boca.jpg",
    etiqueta: "Abrir la boca",
    nombre: "Abrir la boca",
    resumen: "Abrir bien la boca, como en un bostezo, y cerrar despacio.",
    paraQue:
      "Enseña a abrir y cerrar la boca con calma y control, sin golpear los dientes. Una boca que se abre bien deja espacio para que la lengua se mueva libre, y ayuda a que tu hijo note qué hace cada parte de su boca.",
    pasos: [
      "Siéntense frente al espejo.",
      "Pídele que abra la boca bien grande, como en un bostezo.",
      "Pídele que la cierre despacio, sin golpear los dientes.",
      "Repítanlo varias veces, con calma.",
    ],
    quedecir: "Abre la boca grande como un bostezo de león y ciérrala despacito.",
  },
  {
    ...ESPEJO_BASE,
    id: "burbujas",
    imagen: "/ejercicios/burbujas.jpg",
    etiqueta: "Soplar burbujas",
    nombre: "Soplar burbujas con pajita",
    resumen: "Soplar por una pajita para hacer burbujas en el agua.",
    paraQue:
      "Entrena el soplo continuo: soltar el aire de forma pareja y por más tiempo. La R fuerte necesita un aire constante para que la lengua vibre. Las burbujas lo hacen divertido y le muestran, con los ojos, que lo está logrando.",
    minutos: 3,
    necesitas: ["Una pajita", "Un vaso con un dedo de agua", "Manos limpias"],
    pasos: [
      "Pon un dedo de agua en un vaso estable y una pajita adentro.",
      "Pídele que sople de forma continua por la pajita, sin sorber.",
      "Pídele que mientras sopla haga el sonido “trrrr”, para que el agua burbujee.",
      "Repítanlo varias veces. Las burbujas lo motivan a seguir soplando.",
    ],
    quedecir: "Sopla fuerte y largo para hacer burbujas, ¡pero solo soplar, no tomar!",
    cuidados: [...CUIDADOS_PAJITA, ...CUIDADOS_ESPEJO],
  },
];
