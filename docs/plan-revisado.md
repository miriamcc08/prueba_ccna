# Revisión del PLAN.md recibido

El archivo adjunto se usa como referencia de prioridades y entregables, no como prueba de que sus afirmaciones estén verificadas. El estado comprobado del proyecto está en `estado.md`; el trabajo restante y sus criterios están en [pendientes-cierre.md](pendientes-cierre.md).

## Correcciones al plan

- El objetivo de práctica de 82,5 % y la escala 300–1000 pertenecen al simulador. El valor 825 no se presenta como umbral oficial de aprobación de Cisco.
- Migrar SQLite a PostgreSQL exige revisar tipos, migraciones, exportación/importación de datos, restricciones, índices, copias de seguridad y pruebas. No basta cambiar el provider y la cadena de conexión.
- Un lote generado o una prueba estructural correcta no convierte automáticamente sus preguntas en material técnicamente aprobado.
- Las cifras y versiones del entorno en el adjunto corresponden al momento en que se escribió; no son requisitos de instalación de esta máquina.

## Avance por fases

| Fase del adjunto | Avance comprobado | Pendiente relevante |
|---|---|---|
| 1. Infraestructura | Cliente, API, SQLite, migraciones y arranque probados | Producción y PostgreSQL |
| 2. Motor | Examen estricto, estudio sin tiempo, recuperación, revisión, puntuación y preferencia de explicaciones aplicada | Variantes y opciones avanzadas; tiempo por pregunta y sonidos ya implementados |
| 3. Primer lote | 50 preguntas originales nuevas, bilingües y con explicaciones; 28 comprobaciones independientes de cálculo/escenario | Contraste documental, revisión técnica y de traducción |
| 4. Resultados e historial | Resultados, revisión, historial, captura del contenido por intento y revisiones editoriales | Limitaciones de intentos antiguos sin captura |
| 5. Banco de 1000 | 660 candidatos JSON en trece grupos de 50 y uno de diez; ocho lotes originales con 360 preguntas; 11 ejercicios heredados comprobados | Revisión semántica de duplicados y alcanzar 1000 aprobadas distintas |
| 6. Interfaz y aprendizaje | Panel administrativo, favoritos, disponibilidad real y recomendaciones por historial | Pulido y analítica adicional |
| 7. Seguridad y pruebas | Roles, permisos, validación, pruebas SQLite y Chromium | Endurecimiento y operación de producción |

## Entrega de preguntas de esta continuación

- `server/prisma/questions/original_20261024_50.json`: fuente de verdad, 50 preguntas con IDs estables y familias por concepto.
- `batches/lote-original-50.md`: copia legible, preguntas ES/EN, alternativas, respuestas propuestas y explicaciones.
- `batches/original-20261024-calculations.json`: resultados de 28 comprobaciones independientes en Python.
- `auditoria-banco.json`: auditoría estructural actual de los 660 candidatos JSON; ninguna aprobación técnica automática.

El reparto del lote nuevo es 10/10/12/5/8/5 entre las seis áreas, con redondeo para 50 preguntas. Cada pregunta tiene un concepto diferente dentro del lote; la equivalencia con los ejercicios heredados requiere revisión semántica.

En la primera entrega las referencias no pudieron consultarse por el bloqueo del proxy. En la continuación del lote 02 se recuperaron 32 documentos y se registraron 24 consultas focalizadas, con fechas y hashes. Las consultas no equivalen a aprobación editorial completa. Las comprobaciones ejecutables verifican resultados numéricos y escenarios modelados, no certifican la traducción o la vigencia de todo el temario.

La continuación de revisión está documentada en `revision-banco-20261024.md`: concentración de claves, correcciones y pruebas de preservación del historial.

La siguiente entrega añade 50 preguntas más, 10 de selección múltiple, y 13 verificaciones ejecutables. Ver `batches/lote-02-informe.md`.

La tercera entrega añade otras 50 preguntas, con 21 comprobaciones independientes y revisión de referencias. Ver `batches/lote-03-informe.md`. El total de candidatos sigue separado del de preguntas aprobadas.

## Orden de continuación después del lote 04

El lote 04 aporta 50 preguntas ES/EN, cuatro de selección múltiple, nueve comprobaciones independientes y 13 consultas documentales focalizadas. Al cerrar el lote 04, el banco contenía 500 candidatos con 467 familias declaradas. La referencia por fases sigue siendo la tabla anterior; ninguna fase se declara terminada solo por sumar registros.

| Orden | Fase | Trabajo concreto pendiente | Criterio para darlo por terminado |
|---|---|---|---|
| 1 | 3. Calidad editorial | La evidencia de unidades del caso 009 del lote 04 se completó en la continuación del lote 06. Siguen abiertos 020 y 029: autostate de SVI y retirada de rutas conectadas; completar fuentes, claves, distractores y traducción | Evidencia por pregunta y revisión administrativa con autor, fecha y notas; conservar versiones previas si cambia contenido usado |
| 2 | 5. Cobertura del banco | Contrastar la versión oficial completa del temario y revisar semánticamente las familias. Identificar lagunas en arquitecturas, medios físicos, WLAN y automatización antes del siguiente lote | Matriz de objetivos con candidatos y aprobados separados; equivalencias agrupadas sin inflar el número de conceptos |
| 3 | 5. Ampliación | Seguir creando lotes de 50 con IDs estables y referencias, sin limitarse a sustituir cifras en ejercicios anteriores | Importación repetible, pruebas de claves cuando sean calculables y aprobación editorial independiente; alcanzar 1000 aprobadas distintas sigue pendiente |
| 4 | 2. Motor | Variantes recalculadas y nuevo intento de práctica; ejecutar límite por pregunta, sonidos y otras preferencias. La opción de explicaciones ya se aplica en estudio | Reglas del servidor y recorridos de navegador probados, sin modificar respuestas históricas |
| 5 | 6. Interfaz | Accesibilidad por teclado y móvil, evolución por área y dificultad, traducciones restantes | Comprobaciones con datos reales y pruebas de los recorridos afectados |
| 6 | 1 y 7. Operación | PostgreSQL con migración y restauración de datos probadas; endurecimiento de autenticación, CORS y despliegue | Restauración verificada, controles de producción y despliegue revisable; no basta cambiar el proveedor Prisma |

Para esta entrega, las comprobaciones pasaron: compilación, 320 pruebas del servidor y seis de Chromium. Las nueve comprobaciones ejecutables verifican resultados de casos modelados; no sustituyen revisión técnica ni certifican la correspondencia con todos los objetivos oficiales. Informe: `batches/lote-04-informe.md`.

## Actualización tras el lote 05

La fase 5 avanzó con otras 50 preguntas ES/EN: total de 550 candidatos y 506 familias declaradas. La fase 3 avanzó con una revisión documental de los 50 escenarios y claves, atribuida al asistente automatizado, y seis comprobaciones independientes de cálculo/escenario. Las 36 referencias citadas tienen evidencia recuperada; la huella de contenido permite detectar una edición posterior a la revisión. El informe distingue la revisión técnica por asistente de la aprobación editorial humana, que sigue pendiente.

Se mantienen las prioridades de la tabla anterior: completar fuentes parciales de los lotes previos, revisión editorial independiente y matriz de cobertura del temario oficial. Ampliar WLAN/CAPWAP en el lote 05 reduce una laguna de contenido, pero no demuestra cobertura completa. No se declara terminada la fase de 1000 preguntas aprobadas distintas. Ver `batches/lote-05-informe.md` para las validaciones ejecutadas y sus límites.

## Actualización tras el lote 06

Las fases 3 y 5 avanzaron con 50 preguntas adicionales, doce casos ejecutables y revisión documental individual. Se recomprobó el lote 05 completo; se resolvió una de las tres lagunas documentales antiguas y dos siguen abiertas. Al cerrar el lote 06: **600 candidatos, 542 familias declaradas y 300 originales pendientes**. Hay 149 originales con consulta focalizada; todavía faltan registros focalizados para otras 151. Esta métrica de evidencia no equivale a aprobación técnica completa.

La cobertura amplia y la selección de próximos temas están guardadas en `cobertura-priorizada.md` y `cobertura-banco.json`. El cribado detecta pocos enunciados sobre arquitecturas, virtualización, seguridad WLAN e IA, pero es orientativo y no reemplaza una revisión semántica ni la matriz oficial de objetivos. La aprobación editorial y la meta de 1000 aprobadas distintas siguen pendientes. Las demás fases conservan los pendientes ya descritos; no se declaran acabadas por aumentar el banco.

La entrega pasó compilación, 449 pruebas de servidor y seis de navegador. Detalle: `batches/lote-06-informe.md`.

## Actualización tras el lote 07

La fase 3 avanzó con revisión documental de las primeras diez preguntas originales y revisión de las 50 nuevas. La herramienta distingue revisión parcial explícita de revisión completa e invalida evidencia tras cambios de contenido. Se actualizó la referencia MAC con RFC 9542 sin cambiar textos o claves anteriores.

La fase 5 avanzó con campus, leaf-spine, virtualización y controladores: **650 candidatos, 577 familias declaradas y 350 originales pendientes**. Hay 209 originales con consulta focalizada; todavía quedan 141 sin registro focalizado y continúa la revisión completa de las heredadas. La siguiente prioridad es reducir ese pendiente, completar la matriz oficial y revisar IA/herramientas/WLAN; sumar preguntas no termina por sí solo la fase.

Pasaron compilación, 518 pruebas del servidor y seis del navegador. Las demás fases conservan los pendientes ya señalados. Detalle: `batches/lote-07-informe.md`; inventario y orden: `cobertura-priorizada.md`.

## Actualización tras el lote focalizado 08

La fase 2 avanzó con la preferencia `showExplanations` aplicada en servidor e interfaz, incluyendo recuperación y sesiones antiguas. La revisión final conserva el contenido y el modo estricto no revela soluciones. Variantes, sonidos y límite por pregunta siguen pendientes.

La fase 3 avanzó con diez revisiones anteriores adicionales y capítulos técnicos concretos identificados aparte de la cita general. El primer lote queda en 20/50 revisadas documentalmente. La fase 5 añadió diez preguntas focalizadas de AIOps/automatización con dos modelos numéricos explícitos. El cargador exige tamaños declarados exactos de 10 o 50; no rellena tandas pequeñas.

Totales actuales: **660 candidatos, 586 familias y 360 originales pendientes**, de los cuales 229 tienen consulta focalizada registrada. Quedan 131 originales sin ese registro y continúa la revisión completa de las heredadas. No se declaran terminadas aprobación editorial, deduplicación semántica ni matriz oficial. Pasaron compilación, 540 pruebas de servidor y ocho del navegador. Ver `batches/lote-08-informe.md`.

## Cierre funcional y pausa del banco

Por petición del usuario se pausa la creación de preguntas y se prioriza validación funcional. Administración ya permite creación manual, búsqueda, paginación, revisión de alternativas y comprobaciones. CORS y permisos vigentes se corrigieron; sonidos y borrado del historial funcionan. El [informe de auditoría](auditoria-funcional-20261026.md) registra cambios y requisitos pendientes; no se declara completado el banco de 1000 ni producción.

## Continuación de cierre

Se completa importación CSV (fase 3), con plantilla y validación, manteniendo candidatos pendientes. Se muestra rendimiento por dificultad en resultados (fase 4). Pasan compilación, 572 pruebas de servidor y 13 de Chromium. La lista [pendientes-cierre.md](pendientes-cierre.md) identifica lo que sigue faltando, sin reanudar generación ni declarar producción.

## Reinicio de estudio completado

F02 ya crea una práctica independiente sin alterar el intento anterior. Está disponible en estudio tras confirmar y desde revisión de estudios completados, con control de propiedad y elegibilidad actual. Ver [reinicio-estudio.md](reinicio-estudio.md). Las variantes recalculadas y el tiempo por pregunta siguen pendientes.

## Tiempo por pregunta completado

F01 ya se configura y se ejecuta con activación persistida y control de servidor, incluyendo reconexión, vencimientos y compatibilidad con tiempo total. Uso y política: [tiempo-por-pregunta.md](tiempo-por-pregunta.md). La lista vigente conserva las variantes y demás funciones que faltan.

## Historial con versión del temario

F08 completado: API y pantalla muestran la versión registrada e idioma del intento. Se mantienen los decimales, se completan filtros y se hacen visibles los errores de carga con reintento. [Registro y comprobación](mejoras-historial-20261026.md). Las demás tareas permanecen en la lista de cierre.

## Cambio de tema completado

F04 ya abre otra práctica guiada del tema seleccionado con filtros reales, sin alterar el intento anterior y con vuelta al origen. Se mantienen preferencias y controles de propietario; no hay fallback a temas ajenos. [Uso](cambio-tema-estudio.md), [cambios y comprobación](mejoras-temas-20261026.md). Las demás tareas permanecen en la lista de cierre.
