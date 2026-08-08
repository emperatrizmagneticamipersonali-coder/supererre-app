# ESTADO — SuperErre
Última actualización: 2026-08-04 | Sesión actual: 1

⏸️ CHECKPOINT — Tercera pulida del onboarding: el usuario compartió un video de referencia (app "Keiki") con animaciones y estilo de preguntas. Se extrajeron ~24 fotogramas del video (método: copiar el video a public/, capturarlo con canvas+Web Audio en el navegador, guardarlo vía una ruta API temporal — ya eliminada tras el análisis) y se aplicaron los patrones válidos con nuestro León: (1) MascotBubble rediseñado con "cola" de nube de dos puntos (más fiel al globo de pensamiento de la referencia) y animación de aparición con rebote (bubble-pop); (2) pregunta de edad convertida a grilla 2x2 de chips compactos (antes lista vertical), igual que su patrón para respuestas numéricas cortas; (3) nueva pantalla "revelación" ("¡El camino de [nombre] está listo!") insertada entre el loading y la primera victoria, replicando su pantalla de reveal antes del registro. No se copió: su color violeta de fondo (mantenemos nuestra paleta arena/dorado/turquesa, cosa juzgada de FICHA-ARTE.md), el registro con contraseña (mantenemos magic link, decisión de 26-AUTH-MODERNO), ni los pop-ups clínicos tipo "¿su hijo tiene TDAH?" durante el loading (fuera de alcance de nuestro producto). Verificado: build + typecheck + eslint limpios, grilla de edad confirmada por posición real de los botones, sin overflow a 375px. Archivos temporales de análisis (video, capturas, ruta API de debug) eliminados del repo / Siguiente acción exacta: proponer Sesión 5 (app interna: Praxias, Onomatopeyas/AR, Escalera Fonética, Minijuego)

## Qué es esta app (3 líneas máximo)
App gamificada en español para que niños de 4-7 años destraben la pronunciación de la letra R (rotacismo), mediante la mascota animada "el León" que muestra dónde poner la lengua, ejercicios de praxias linguales, sonidos/onomatopeyas con filtros AR y una escalera fonética progresiva. Dirigida a padres LATAM clase media/media-alta. Monetización: freemium con pago único ($19.99 USD) para desbloquear todo — sin suscripciones.

## Promesa central
"Ayudo a mamás de niños de 4 a 7 años con dificultad para decir la R a lograr que sus hijos suelten la lengua y pronuncien palabras como 'carro' y 'perro' con claridad en 15 días, sin tener que pelear todas las tardes con ejercicios aburridos frente al espejo ni pagar fortunas en terapias."

## Reporte de validación (Sesión 1) — YA APORTADO POR EL USUARIO (RESUMEN FINAL validado, no se re-valida)
- Veredicto: Excelente oportunidad — nicho desatendido en español (educación infantil + fonoaudiología)
- Apps de referencia: Speech Blubs (cobros no autorizados $59.99, difícil cancelar), Pronunciar la R / Bzngr (UI anticuada, aburrida), Writing Wizard/LetterSchool (foco en trazado, no en articulación)
- Lo que los usuarios odian de la competencia (nuestra oportunidad): cobros/suscripciones opacas y no autorizadas; apps repetitivas que aburren rápido; funciones ocultas tras muros de pago progresivos
- Brecha LATAM confirmada: sí — mercado hispanohablante saturado de apps de trazado/estimulación general, pero sin herramienta enfocada 100% en destrabar la R con gamificación moderna y pago justo
- Precio de referencia del mercado: $14.99/mes o $59.99/año (competencia) vs. nuestro pago único $19.99

### Segunda validación independiente (verificada por el agente vía búsqueda web, 2026-08-05)
- Prevalencia real del problema: 30% de niños de 4-5 años aún no pronuncian bien la R (fuentes clínicas de logopedia)
- Prueba de pago en el nicho: app de speech therapy similar (en inglés) alcanzó 5,000+ clientes y $300K ARR bootstrapeada — mercado global de speech therapy apps for kids ~$1.35B en 2024, creciendo 12.9%/año
- Único competidor directo en español (Pronuncia con Sarahí, UNAM): técnicamente correcto pero académico/aburrido, 3.0★ con solo 2 reseñas — confirma la brecha de gamificación en español
- Apps de referencia para diseño/progreso: Speech Blubs (peer modeling — tomar; cobros tras cancelación — evitar), Articulation Station (sistema de progreso por niveles palabra→frase→historia, credibilidad clínica — tomar)
- Veredicto: Excelente oportunidad confirmada de forma independiente

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: pendiente de crear formalmente en Sesión 1 (datos ya recolectados abajo)
- Resumen: Carolina, 34 años, mamá LATAM clase media/media-alta, hijo Mateo (5) con rotacismo · dolor #1: culpa/impotencia al ver a su hijo burlado en el colegio por decir "cawo" en vez de "carro" · deseo #1: escuchar a su hijo decir "carro"/"perro" con claridad y orgullo · nivel de consciencia: Problem & Solution Aware (4/5) · sofisticación de mercado: alta (ya probó espejo, YouTube, apps con cobro sorpresa)
- Objeciones clave: cobro sorpresa/suscripción oculta · miedo a que aburra en 3 días · "¿reemplaza terapeuta?" · privacidad de micrófono/cámara de su hijo
- Razones de compra dominantes: 1) Escapar del dolor mental (culpa/miedo al bullying) 2) Evitar esfuerzo (el padre no sabe enseñar la biomecánica) 3) Ahorrar dinero (pago único vs. suscripción trampa)
- Landing: pendiente — usará la ESTRUCTURA CANÓNICA de 10 secciones del 19

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Freemium con desbloqueo de pago único (decidido por el usuario en su investigación previa — se respeta, no se reabre)
- Justificación: el dolor #1 del avatar es la desconfianza a cobros recurrentes ocultos; un pago único transparente elimina la objeción de compra más fuerte del nicho
- Diseño del paywall: gratis = módulo de Praxias + Onomatopeyas iniciales; $19.99 USD pago único desbloquea Escalera Fonética completa + minijuegos + todos los niveles
- Trial: freemium sin tarjeta de crédito (no es trial temporizado, es acceso gratuito limitado por funciones)
- Pricing: $19.99 USD pago único (benchmark competencia: $14.99/mes o $59.99/año)

## Constitución del Producto (Sesión 1 — decidido con el usuario)
- Onboarding: el padre/madre configura primero (nombre y edad del niño) antes de entregar el celular — personaliza la experiencia y genera confianza antes del paywall
- Gate de pago: puerta de adulto (challenge simple, ej. mantener presionado / operación matemática fácil) ANTES de mostrar paywall o cobrar — evita compras accidentales de un niño de 4-7 años
- Límites éticos que la app NUNCA cruza:
  1. Nunca publicidad ni compras dirigidas al niño (solo el padre ve ofertas, tras el gate de adulto)
  2. Nunca sube audio/video fuera del dispositivo — voz y cámara del niño 100% locales, nunca a servidor
  3. Nunca usa culpa o presión emocional para vender — copy siempre en tono de aliento, nunca miedo parental

## Gamificación y retención (Sesión 3 — el loop central)
- Loop del hábito (Hooked): Gatillo notificación/rutina diaria → Acción imitar sonido/video corto → Recompensa filtro AR + stickers/fiesta visual → Inversión progreso en Escalera Fonética
- Mecánicas elegidas: minijuego de recompensa (reventar globos/estrellas) desbloqueado cada 2 ejercicios; progreso visible en Escalera Fonética (RA-RE-RI-RO-RU)
- Primera victoria que celebra el onboarding (<60s): "El Rugido del León" — imita el sonido frente al micrófono y activa filtro de León animado
- Notificaciones de re-enganche: pendiente de diseñar en Sesión 4

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Sesión 4 cerrada — lista para Sesión 5 (app interna)
- Ruta aprobada: `/` → `/onboarding` (incluye paywall y gate de adulto embebidos) → `/login` → `/app`
- Landing: construida y verificada — protagonista: el Espejo del León (primera victoria) — CTA primario: "Probar el Espejo gratis"
- Onboarding: construido y verificado — nombre → edad → dolor → reconocimiento → loading → primera victoria → celebración
- Paywall: construido y verificado (embebido al final del onboarding) — Gratis vs. Espejo Completo $19.99 pago único, con puerta de adulto antes del CTA de pago
- Login/Auth: construido y verificado (UI con mock de magic link — Supabase real se conecta en Sesión 6)
- App interna: pendiente — secciones: Praxias, Onomatopeyas/AR, Escalera Fonética, Minijuego (máx 4-5)
- Servicios externos: pendiente — GitHub/Supabase/Vercel/Resend/dominio/Hotmart

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: aprobada — verificada en navegador con el usuario a lo largo de varias iteraciones
- Onboarding: aprobada — probada de punta a punta en navegador (nombre/edad/dolor/reconocimiento/loading/victoria/celebración)
- Paywall: aprobada — probada en navegador, personalización con nombre confirmada
- Login/Auth: aprobada (UI) — mock de magic link probado (estados enviando/enviado/reenvío)
- App interna: no iniciada
- Servicios externos: bloqueados
- Certificado /100: pendiente

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) — decidido el 2026-08-04. Razón: la app necesita landing con SEO/conversión, API routes para webhook de Hotmart, y posible BFF si se usa IA — Next.js es el default del stack pineado (51) para este perfil.
- Stack: scaffold canónico de 51-STACK-PINEADO.md (Next 16, Tailwind v4, shadcn/ui, Supabase con @supabase/ssr)
- Features del MVP (orden de prioridad):
  1. Gimnasia de Lengua (Praxias) — 5 rutinas animadas guiadas por la mascota León (sin video de niños reales — decisión de Sesión 3, ver nota abajo)
  2. Modo Onomatopeyas y Sonidos — imitación con activación de micrófono + filtros AR/stickers
  3. Escalera Fonética (RA/RE/RI/RO/RU) — práctica progresiva de sílabas y palabras clave
  4. Minijuego de Recompensa — se desbloquea tras completar 2 ejercicios
- Qué NO construir todavía: reconocimiento de voz en la nube (usar detección local de audio/volumen), trazado de letras/caligrafía, paneles multi-paciente para clínicas
- Modelo de IA: ninguno requerido para el MVP — el filtro AR y la detección de voz/volumen son 100% locales en el dispositivo (sin llamadas a proveedores de IA), coherente con la promesa de privacidad y con "qué NO construir todavía" del resumen validado
- Base de datos (Supabase/Postgres, decisión de implementación — no reabrir): tablas `parents` (cuenta que paga, vinculada a auth.users), `children` (nombre, edad, vinculado a parent_id — el niño NUNCA tiene su propia cuenta/login), `exercise_progress` (child_id, ejercicio, fecha, completado), `purchases` (parent_id, estado, fecha, origen webhook Hotmart). RLS: un parent solo lee/escribe sus propios children y su propio purchases/progress vía child_id → parent_id
- Auth (Supabase Auth, decisión de implementación — no reabrir): login SOLO para el padre/madre (email/magic link o Google) — el niño interactúa desde el dispositivo ya logueado por el padre, sin credenciales propias. Coherente con COPPA (menor de 13 años nunca crea cuenta ni ingresa datos personales directamente)

## Sesiones completadas ✅
- Sesión 0 — Instalación del SO + git init — verificado 2026-08-04

## Sesión en progreso 🔧
- Sesión 3 — Página de ventas: proyecto Next.js creado en `superrre-app/` (scaffold de 51), tokens de FICHA-ARTE volcados a `globals.css`, landing con las 10 secciones canónicas construida (Hero con mini-demo interactivo del mecanismo, Problema, Agitación, Solución con "el Espejo del León" bautizado, App por Dentro con placeholders del carrusel, Oferta pago único $19.99 + plan gratis, Garantía "del Primer Rugido", FAQ, CTA final + PS, Footer legal). Páginas legales (/privacidad /terminos /reembolso) creadas como borrador. Build y typecheck verificados limpios.
- Mecanismo bautizado: "el Espejo del León" — aparece en hero, sección solución y oferta (consistente en los 3 lugares, regla dura de 19).
- Desviación informada: el modelo es pago único (no mensual/anual como default del 19) — la sección Oferta muestra plan Gratis vs. Pago Único $19.99, coherente con la decisión de monetización de Sesión 1.
- Cambio de mecanismo (post-cierre, a pedido del usuario): la investigación original priorizaba "peer modeling" (video de niños reales imitando el sonido) por su alto engagement documentado — pero el usuario no tiene niños disponibles para filmar ese contenido. Se reemplazó por la mascota animada "el León" (ilustración/animación, consistente con la dirección de arte ya aprobada) mostrando dónde poner la lengua. Se actualizó: Hero, Solución (los 3 pasos), metadata de la página, y el feature #1 del MVP (Praxias). Mantiene el mismo insight de la investigación (mostrar visualmente el movimiento oculto de la lengua) sin depender de video de niños reales.

## Próximas sesiones 📋
- Sesión 4: Onboarding, paywall y login (hoy /onboarding y /login son stubs "en construcción")

## Problemas conocidos ⚠️
- Carrusel de "La app por dentro" usa placeholders rotulados "Próximamente" (la app interna aún no existe) — pendiente reemplazar por screenshots reales al cerrar Sesión 5, según regla del 19.
- Footer legal usa email de contacto placeholder (hola@supererre.app) — el usuario debe confirmar/crear una cuenta de correo real antes de publicar.
- Páginas /privacidad, /terminos, /reembolso son borradores base — recomendable revisión legal local antes de publicar.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguno todavía — se avisará cuando lleguemos a cuentas/dominio/claves (Sesión 6+)

## Notas para la próxima sesión
- El usuario ya trajo el RESUMEN FINAL VALIDADO + Perfil de Cliente Ideal (Carolina/Mateo) + Propuesta de Valor con las 10 razones de Jim Edwards. NO re-validar la idea ni re-investigar mercado — ya está hecho. Ir directo a completar B3 (Constitución) y presentar el Plan Maestro B5.
- Verificar edad mínima de usuarios finales (niños 4-7) implica consideraciones COPPA/privacidad reforzadas — ya contemplado en el resumen (procesamiento 100% local de audio/cámara).
