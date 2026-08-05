# FICHA DE DIRECCIÓN DE ARTE — SuperErre

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → captura de Lingokids (pantalla "ABC", app store), usada como REFERENCIA-INVESTIGACIÓN (el usuario la mostró como "una app que vio", no como mandato de fidelidad total) — se fusionó su patrón, no se clonó pixel a pixel.
- Extracción de la referencia Lingokids:
  - Modo: claro · Fondo: bloques planos multicolor (cian/amarillo/rosa/morado) · Superficie: blanco
  - Acento(s): multicolor por bloque, cada letra con su propio color
  - Display: sans redondeada muy bold (clase equivalente: Fredoka/Baloo 2)
  - Radio: muy alto (pills, círculos) · Sombras: ninguna/sutil · Bordes: contorno grueso negro en personajes
  - Detalle firma a replicar: mascota de contorno grueso + ojos grandes; tarjeta plana de color por unidad de contenido
- Prohibiciones anti-IA que la referencia levanta: ninguna (la referencia es clara/cálida, coherente con la capa anti-IA por defecto)

## Identidad derivada — FUSIÓN de líderes (16 PASO 0.2bis) + banco 54 para dispositivos ownable
- TABLA DE LÍDERES:
  - Duolingo → lógica de gamificación (racha, XP, camino de niveles bloqueado/desbloqueado), tipografía redondeada friendly
  - Khan Academy Kids → ilustración/mascota protagonista, cards grandes ícono-primero
  - Speech Blubs → el gesto de grabarse imitando un sonido como mecánica central (espejo/cámara)
  - Lingokids (ref. del usuario) → mascota de contorno grueso + tarjeta plana de color por unidad
- Combinación tipográfica: Baloo 2 (display) + Quicksand (body) — familia redondeada geométrica, validada contra Duolingo/Khan Kids/Lingokids (los 3 líderes del nicho la usan o una vecina directa)
- Arquetipo: Bufón + Explorador (juguetón, aventurero) · Mundo del sujeto (0.45): rugido del león (GRRRR = sonido de poder) · mapa del tesoro pirata (progreso = viaje) · espejo de práctica en casa (el gesto real que hacen padre e hijo)
- Dispositivo ownable (banco 54, adaptado): (1) espejo circular con anillo doble dorado+turquesa para el momento de grabar/imitar · (2) mapa de islas con camino punteado para el progreso — dos dispositivos, uno por momento (práctica vs. progreso)

## Personalidad compilada
- 3 adjetivos de personalidad: valiente, cálido, aventurero
- Compilación: spring con bounce 0.25-0.3 · duración base 220ms · stagger 60ms · exclamaciones máx 1/pantalla (la celebración del león) · celebración nivel: alta al completar isla (confeti + sonido), media en pasos intermedios · radio tendencial 20-24px (cards), 999px (pills/badges)

## Brand kit final (los valores que viven en globals.css/@theme)
- Fondo: #FFF6E4 · Superficie: #FFFFFB · Hundido: #F5ECD6 · Texto 1º/2º: #22332E / #6B6558
- Acento primario (dorado tesoro): #F0A93A (SOLO en: CTA principal, nodo "actual" del mapa, racha) · 2ª nota (turquesa agua): #2FB6A8 (porqué: anillo del espejo + progreso completado — bridging entre "espejo" y "mapa") · 3ª nota (coral): #E8604A (porqué: momento de grabar/acción inmediata + bandera de meta)
- Semánticos: éxito #2FB6A8 (con ✓, no solo color) · error #D14A42 (siempre con ícono, distinto del coral de marca) · aviso #D98F1E
- Display: Baloo 2 (pesos 600/700/800) · Body: Quicksand (pesos 500/600/700) · Escala: display 28px / title 19-20px / body 14-15px / label 11px
- Radio: 22-24px cards, 999px pills/badges · Profundidad: sombras sutiles (0-3px) sobre fondo cálido, sin bordes duros · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: espejo circular (anillo dorado+turquesa) + mapa de islas con camino punteado (receta propia, derivada del banco 54 adaptada al mundo pirata/león)
- Motion signature: ease con overshoot suave (spring 0.25-0.3) · stagger 60ms · firma: el león "respira" (scale sutil) en reposo, confeti al completar una isla

## Trazabilidad y vetos
- Protocolo A/B/C: 6 opciones renderizadas (A-F) + 1 ronda de combinación → elegida: combinación de C (espejo) + D (mecánica de bloques, absorbida en el mapa) + F (mapa de islas), con paleta unificada · descartadas: A (Racha de León puro, muy Duolingo-genérico), B (Cuento Ilustrado, mascota sin mecánica de grabación), D pura (paleta arcoíris no combinaba), E (Liga de Campeones, demasiado "videojuego competitivo" para 4-7 años) · página comparativa: `direcciones-abc.html`, `direcciones-def.html`, `direccion-combinada.html` (raíz del proyecto)
- Ajuste post-feedback del usuario: v1 de la combinación convirtió el mapa en lista lineal (perdía autenticidad) → v2 restauró el mapa disperso real de F, recoloreado · tipografía Bangers (poco legible) → reemplazada por Baloo 2
- Paleta derivada de: fusión C (dorado/turquesa del espejo) + F (turquesa/arena de la isla), perturbada y unificada en un solo sistema de 3 acentos
- Registro anti-repetición: paleta (arena #FFF6E4 + dorado #F0A93A + turquesa #2FB6A8 + coral #E8604A) y par tipográfico (Baloo 2 + Quicksand) quedan VETADOS para el próximo proyecto del SO
- Modo (claro/oscuro) DERIVADO por: nicho infantil/familiar + necesidad de transmitir calidez y confianza a la madre (tabla del 16, "Infantil/familiar → multi-acento cálido, alta saturación amable") — nunca oscuro por reflejo

## Idioma UI: Español (LATAM) · Fecha de cierre de la ficha: 2026-08-05 · Aprobada por el usuario: SÍ
