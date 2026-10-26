# Estado frente al documento de requisitos

Lista vigente de pendientes y criterios de cierre: [pendientes-cierre.md](pendientes-cierre.md).

Estado vigente del cierre funcional: [auditoría del 26/10/2026](auditoria-funcional-20261026.md). Incluye matriz de requisitos, cambios y pendientes. Las secciones de lotes posteriores conservan su historia; sus cifras de pruebas no sustituyen la última comprobación.

## Implementado y comprobado

- Compilación del cliente y servidor; ruta correcta del servidor compilado.
- Rutas del cliente alineadas con autenticación, recuperación de exámenes, preguntas y administración del servidor.
- Selección de preguntas validadas, filtros sin fallback ajeno y exclusión de familias repetidas. La configuración consulta la disponibilidad real y permite elegir explícitamente la cantidad disponible.
- Modo estricto: pertenencia de opciones, ausencia de duplicados, cantidad exacta, confirmación y avance transaccionales, protección frente a confirmaciones concurrentes y exposición anticipada de soluciones.
- Persistencia de la configuración completa; cronómetro basado en el servidor y duración de respuesta por pregunta. Los sonidos opcionales se aplican; el límite por pregunta ya se aplica con activación persistida y reconciliación del servidor.
- Modo estudio sin cronómetro; regreso a preguntas ya respondidas con selección y explicación guardadas. Las respuestas confirmadas permanecen inmutables. Al terminar la última pregunta hay un botón de resultados funcional.
- Favoritos personales, operaciones idempotentes y filtro del banco por favoritas; las cuentas no pueden consultar ni borrar las favoritas de otras personas.
- Captura inmutable por intento de contenido y orden de alternativas, con comprobación de integridad. Puntuación y revisión conservan la versión presentada aunque cambie el banco; advertencia explícita para intentos antiguos sin captura.
- Revisión editorial mediante nuevas versiones pendientes, preservando originales y alternativas usadas. Barajado persistente salvo textos que dependen de letras.
- Resultados y revisión únicamente tras completar o caducar. Leer resultados no termina el examen. Intentos asociados a una cuenta protegidos frente a otros usuarios.
- Importaciones pendientes de revisión. Panel con preguntas y estadísticas reales, sin números de demostración cuando falla una petición.
- Revisión administrativa con notas, referencia HTTPS y confirmación explícita de revisión técnica; auditoría con autor y fecha. Los cambios posteriores invalidan una aprobación. Las validaciones estructurales no sustituyen la revisión técnica humana.
- Plan de estudio visible en inicio para cuentas: áreas débiles, errores repetidos y temas lentos según el historial. Los temas recomendados se filtran por su área; textos del plan en español e inglés.
- Auditoría reproducible de los JSON en lotes de 50: 660 recibidas, 0 rechazos estructurales, 0 duplicados exactos y 660 pendientes de revisión técnica. Ninguna se aprobó automáticamente. Reporte: `auditoria-banco.json`.
- Seed administrativo optativo, sin contraseña fija ni restablecimiento de cuentas; producción exige JWT_SECRET.
- Documentación de ejecución y puntuación interna sin atribuirla a Cisco.
- Pruebas unitarias y de integración SQLite en bases temporales, y pruebas Chromium de recorridos de interfaz y del cliente API real. Las pruebas del navegador usan su propia base temporal.

## Lote original añadido a partir del plan

Se añadieron 50 preguntas originales con IDs estables, dos idiomas, explicaciones y referencias propuestas, distribuidas 10/10/12/5/8/5 entre las seis áreas. Sus 28 comprobaciones independientes de cálculo/escenario pasan con Python. El cargador es transaccional, no duplica al repetirse y rechaza sobrescribir contenido editado; importa todas como pendientes. La revisión de fuentes y traducciones sigue pendiente. Ver `plan-revisado.md` y `batches/lote-original-50.md`.

## Revisión posterior del banco

Se comprobaron 11 ejercicios numéricos heredados y se corrigieron una clasificación, una descripción de uso de redes privadas y dos explicaciones de routing. Se agruparon familias equivalentes: 350 registros corresponden a 339 familias declaradas, sin afirmar que la detección semántica esté completa. Se detectó que 266 de las 267 claves simples heredadas eran A. Los intentos nuevos barajan alternativas cuando el texto lo permite y conservan su orden y contenido. Informe: `revision-banco-20261024.md`.

## Segundo lote original y acceso a referencias

Se añadieron otras 50 preguntas ES/EN, incluidas 10 de selección múltiple y 13 comprobaciones independientes. Se recuperaron 32 documentos primarios para este lote y se registraron 24 consultas focalizadas. Las nuevas preguntas siguen pendientes de aprobación técnica y de traducción. El importador admite lotes sucesivos; la instalación carga ambos sin duplicar ni sobrescribir revisiones. Informe: `batches/lote-02-informe.md`.

Al cerrar el tercer lote había 450 candidatos JSON y 427 familias declaradas, sin afirmar que no queden equivalencias semánticas por detectar. Los pasajes ya consultados y los documentos recuperados sin revisión completa se distinguen en los metadatos. RFC Editor y los artículos Cisco ahora son accesibles; el documento completo de objetivos del examen enlazado aún no se recuperó.

## Tercer lote original

Se incorporaron otras 50 preguntas bilingües, con 10 de selección múltiple, una de verdadero/falso y 21 comprobaciones independientes. Sus referencias incluyen 38 documentos principales y dos complementarios, con 11 consultas focalizadas registradas. La carga repetida conservó los mismos registros. Pasaron 264 pruebas del servidor y 4 de Chromium. Las preguntas permanecen pendientes de aprobación. Informe: `batches/lote-03-informe.md`.

## Pendiente; no se considera terminado

1. Revisar técnicamente las 108 preguntas heredadas y los 660 candidatos JSON: respuestas, distractores, traducciones, referencias primarias y derechos de reutilización. Alcanzar 1000 aprobadas únicas requiere trabajo real por lotes. Confirmar la vigencia del temario y sus pesos con Cisco. El reporte actual solo certifica comprobaciones estructurales y duplicación exacta.
2. Validadores completos de ACL/routing/comandos, variantes recalculadas y detección de duplicados semánticos. Los intentos nuevos sí conservan el contenido presentado; no puede reconstruirse retrospectivamente el contenido original de intentos antiguos que no lo capturaron.
3. Practicar una variante recalculada desde modo estudio. Reiniciar el mismo ejercicio ya crea un intento independiente; las respuestas originales permanecen inmutables.
4. Revisar otras preferencias avanzadas según alcance. El límite por pregunta y los sonidos opcionales ya se aplican. `showExplanations` ya se aplica al feedback y recuperación de estudio; no sustituye la revisión final.
5. Ampliar diagnóstico adaptativo por dificultad y evolución por área, recomendaciones avanzadas y traducciones restantes de interfaz y errores. El plan actual usa reglas explícitas, no un modelo de IA.
6. Ampliar cobertura de navegador para accesibilidad, dispositivos móviles, fallos prolongados y otras condiciones de red; las pruebas actuales no cubren todos los escenarios.
7. Preparación de producción: PostgreSQL y migración de datos, copias de seguridad/restauración probadas, despliegue, retirada del versionado de dependencias/base/credenciales heredadas y límites de peticiones. CORS restrictivo ya está implementado. Hacer estas migraciones sin perder datos requiere trabajo adicional.

La sesión anónima usa un ID opaco como capacidad de acceso. Para datos privados e historial, utiliza cuentas; todavía no hay una credencial anónima independiente del ID.

### Continuación del 26 de octubre de 2026

- La finalización manual, al terminar las preguntas y por vencimiento solo navega a resultados cuando el servidor confirma la operación. Si falla la conexión, conserva la pantalla y permite reintentar; la fecha límite del servidor sigue vigente.
- El aviso de cinco minutos se comprueba durante la cuenta regresiva y al volver a la pestaña; se muestra una vez por intento y fecha límite.
- Verificación completa mediante `bash tools/cloud-setup.sh`: compilación correcta, 264 pruebas del servidor y 6 pruebas de Chromium aprobadas. Las dos pruebas nuevas reproducen el fallo de finalización y el cruce del umbral de cinco minutos.
- Cambios guardados en el directorio de trabajo. El banco continúa con 450 candidatos; esta continuación corrige el funcionamiento del examen y no añade aprobaciones técnicas ni nuevas preguntas.

## Cuarto lote original: actualización del banco y de las fases

Se guardaron 50 preguntas originales adicionales, ES/EN, con cuatro de selección múltiple y nueve comprobaciones independientes. La fuente es `server/prisma/questions/original_20261026_b04_50.json`; la copia legible está en `batches/lote-original-04-50.md`. Se recuperaron 37 referencias primarias y se registraron 13 consultas focalizadas. Tres casos declaran cobertura documental parcial y conservan una tarea de revisión explícita.

Al cerrar el cuarto lote había **500 candidatos JSON, 467 familias declaradas y 200 preguntas originales nuevas pendientes**. La auditoría detecta cero rechazos estructurales y cero duplicados exactos; no demuestra ausencia de equivalencias semánticas. Se agruparon también dos ejercicios heredados de shaping y acceso a arreglos JSON con sus familias relacionadas; sus enunciados y claves se conservaron.

La instalación completa pasó la compilación, 320 pruebas del servidor y seis de Chromium. La prueba de integración del nuevo lote comprueba carga idempotente y exclusión de todas sus preguntas pendientes de los exámenes puntuables. La repetición de la carga de los cuatro lotes no añade duplicados.

La fase 5 continúa abierta: 500 candidatos no equivalen a 500 aprobados ni a 500 conceptos únicos. Las prioridades de contenido son resolver las referencias parciales del lote 04, revisar traducción y distractores, y ampliar cobertura tras contrastar el temario oficial. Las fases 2, 6 y 7 conservan pendientes de variantes, límites por pregunta, accesibilidad y producción. Detalle y orden: `plan-revisado.md`.

## Quinto lote: creación y validación trazable

Se guardaron otras 50 preguntas ES/EN, cinco de selección múltiple. Las 50 tienen revisión documental atribuida al asistente automatizado, con pasajes y hashes de 36 referencias citadas y huella del contenido revisado. Seis cálculos/escenarios se comprobaron independientemente; sus pruebas detectan claves incorrectas aun conservando la cantidad de respuestas. La nueva comprobación de evidencia detecta revisión desactualizada, bytes de fuente modificados y texto que solo aparece en scripts HTML. No sustituye la aprobación editorial humana.

Al cerrar el lote 05: **550 candidatos, 506 familias declaradas y 250 originales nuevos pendientes**. Cero rechazos estructurales y cero duplicados exactos; la deduplicación semántica completa continúa pendiente. La importación de los cinco lotes se repitió sin crear registros adicionales. Se mantuvo la exclusión de candidatos pendientes de exámenes puntuables.

Pasaron compilación, 383 pruebas del servidor y seis del navegador. Entrega y límites de la validación: `batches/lote-05-informe.md`. La prioridad de las fases 3 y 5 sigue siendo completar revisión editorial y cobertura oficial, además de ampliar el banco.

## Sexto lote y seguimiento de validación

Se guardaron 50 preguntas ES/EN nuevas, seis de selección múltiple, con revisión documental individual y doce comprobaciones independientes. Se verificaron 36 documentos citados. Se corrigieron referencias de ópticas y una guía IPv6 que redirigía a una página general. La revisión automatizada queda atribuida y vinculada por hash al contenido; no otorga aprobación humana.

Se recomprobó el lote 05 completo y se siguieron tres casos antiguos del lote 04: se completó la evidencia de unidades del caso 009; autostate (020) y retirada de ruta conectada (029) siguen pendientes de fuente directa o laboratorio. Se conservaron sus enunciados, alternativas y claves. Ver `batches/lote-04-seguimiento.json`.

Al cerrar el lote 06: **600 candidatos, 542 familias declaradas y 300 originales nuevos pendientes**. Hay 149 originales con consulta focalizada y 89 casos originales calculables comprobados, conjuntos que se superponen. La auditoría mantiene cero rechazos estructurales y cero duplicados exactos, sin prometer deduplicación semántica completa.

Pasaron compilación, 449 pruebas del servidor y seis de Chromium. Las seis cargas se repitieron sin registros nuevos. La prioridad siguiente de las fases 3 y 5 se concreta en `cobertura-priorizada.md`: completar evidencia de originales anteriores, revisión independiente, comprobar temas escasamente representados y construir la matriz oficial. Informe: `batches/lote-06-informe.md`.

## Séptimo lote y revisión parcial explícita

Se guardaron 50 preguntas ES/EN nuevas: cinco de selección múltiple, diez básicas y 40 intermedias. Las 50 tienen revisión documental atribuida al asistente, con 30 referencias citadas y diez comprobaciones independientes. Se amplió campus, leaf-spine, virtualización y modelos de control.

Las primeras diez preguntas del lote 01 recibieron revisión documental individual. Se añadió RFC 9542, que sustituye a RFC 7042, para el caso de bits MAC. Los enunciados y claves anteriores se conservaron. El comprobador requiere `--reviewed-only` para un manifiesto parcial y reporta diez comprobadas de cincuenta, con 40 aún sin esta revisión; el modo normal exige todo el lote.

Al cerrar el lote 07: **650 candidatos, 577 familias declaradas y 350 originales pendientes**. Hay 209 originales con consulta focalizada y 99 casos ejecutables, conjuntos superpuestos. La auditoría mantiene cero rechazos estructurales y cero duplicados exactos; la revisión semántica y la aprobación editorial independiente siguen pendientes.

Pasaron compilación, 518 pruebas del servidor y seis de Chromium. Las siete cargas se repitieron sin nuevos registros ni conflictos. Las prioridades de las fases 3 y 5 están en `cobertura-priorizada.md`; los demás pendientes funcionales se mantienen. Informe: `batches/lote-07-informe.md`.

## Lote 08 y avance del motor

Se corrigió `showExplanations`: la API y la interfaz de estudio respetan la opción al responder y recuperar una pregunta. Se conservan acierto y selección; la revisión final mantiene el contenido. Hay pruebas de ambos valores, sesiones antiguas sin preferencias y protección de modo estricto.

Se guardaron diez preguntas focalizadas nuevas, con cuatro documentos citados, diez consultas y dos comprobaciones independientes. Se revisaron otras diez del primer lote; ahora son veinte de cincuenta, con capítulos de plataforma concretos separados de la cita general original. Se mantuvieron textos y claves importados.

El cargador admite solo tamaños declarados de 10 o 50, exige correspondencia exacta y detecta ambos en el setup. Las pruebas rechazan nueve y once cuando se declara diez y mantienen la exclusión de candidatos pendientes de exámenes puntuables.

Estado actual: **660 candidatos, 586 familias declaradas y 360 originales pendientes**. Hay 229 originales con consulta focalizada y 101 casos ejecutables, conjuntos superpuestos. La auditoría mantiene cero rechazos estructurales y cero duplicados exactos, sin certificar deduplicación semántica completa ni aprobación humana.

Pasaron compilación, 540 pruebas de servidor y ocho de Chromium. Las ocho cargas se repitieron sin registros adicionales. Continúan pendientes variantes, límite por pregunta, sonidos, aprobación editorial, matriz oficial y producción. Informe: `batches/lote-08-informe.md`.

## Auditoría funcional final de esta entrega

Se pausa la creación de preguntas por instrucción del usuario. Compilación correcta, **547 pruebas del servidor y 12 de Chromium aprobadas**. Se completaron alta manual y paginación/búsqueda de administración, revisión de alternativas y clave, comando seguro de alta de administrador, revocación inmediata de roles, CORS restrictivo, sonidos opcionales y borrado del historial con confirmación. El límite por pregunta se rechaza por no estar soportado. Detalle de todos los cambios, matriz de cumplimiento y pendientes en [la auditoría funcional](auditoria-funcional-20261026.md); acceso administrativo en [la guía](administracion.md). No hay una cuenta administradora creada en la copia de ejecución. No se modificó el banco en esta entrega ni se declara producción completa.

## Continuación: CSV y rendimiento por dificultad

Se añadió importación CSV con plantilla, UTF-8, alternativas bilingües, clave simple/múltiple y errores de estructura sin importación silenciosa. Mantiene las comprobaciones de servidor y estado pendiente. Resultados ahora muestra preguntas, aciertos, sin acierto y porcentaje por dificultad. Las etiquetas de importación son bilingües y no anuncian arrastrar/soltar, que no está implementado. No se modificaron preguntas del banco. La compilación, **572 pruebas de servidor y 13 de Chromium** pasan. Todos los pendientes restantes están ordenados y tienen criterio de cierre en [la lista vigente](pendientes-cierre.md).

## Reinicio independiente de estudio

Se completa F02: tras confirmar una respuesta o desde la revisión de un estudio completado, se puede reiniciar una pregunta aprobada en otro intento de estudio sin tiempo. Se conservan la respuesta, captura y resultados originales; se mantienen idioma, explicaciones y sonido, con enlace para regresar. Se rechaza en modo estricto, sobre cuentas ajenas o contenido retirado de aprobación. Uso y límites: [reinicio-estudio.md](reinicio-estudio.md); cambios y comprobación: [mejoras-reinicio-20261026.md](mejoras-reinicio-20261026.md). No genera preguntas nuevas ni variantes.

Última comprobación tras el reinicio: compilación correcta, **578 pruebas del servidor y 14 de Chromium aprobadas**, en bases temporales.

## Tiempo por pregunta completado

F01 incorpora activación persistida, configuración y contador individual, rechazo de respuestas tardías, registro sin responder al vencer y avance controlado por servidor. La recuperación no reinicia el intervalo activo; las preguntas no activadas reciben su intervalo al avanzar. El vencimiento total prevalece. En estudio el reloj activo sigue al leer explicaciones o volver atrás; estudio sin cronómetro excluye este límite. Política: [tiempo-por-pregunta.md](tiempo-por-pregunta.md). Cambios y comprobación: [mejoras-tiempo-20261026.md](mejoras-tiempo-20261026.md). No se modificó el banco.

Última comprobación tras F01: compilación correcta, **586 pruebas de servidor y 17 de Chromium aprobadas**; migración aditiva aplicada en la copia aislada.

## Versión de temario visible e historial corregido

F08 muestra la versión guardada y el idioma original del intento, con comprobación frente a cambios posteriores del banco. Se corrigieron errores de carga invisibles, se añadió reintento y se completaron las siete modalidades del filtro. Tabla y gráfica conservan el decimal del porcentaje; etiquetas y formatos de este recorrido responden al idioma de interfaz. Los intentos de otras cuentas permanecen privados. Cambios, límites y verificación: [mejoras-historial-20261026.md](mejoras-historial-20261026.md). No se modificó el banco ni se inventaron versiones históricas.

Última comprobación tras F08: **588 pruebas de servidor y 19 de Chromium aprobadas**, compilación correcta y código/pruebas coincidentes con la copia ejecutada.

## Cambio de tema de estudio

F04 crea otra práctica filtrada por el tema elegido, manteniendo preferencias y un enlace para regresar. No cambia preguntas, respuestas, capturas ni fechas límite del original; su reloj sigue corriendo. Consulta disponibilidad elegible y bloquea temas vacíos o fallos de consulta, con reintento. Propiedad y modo se comprueban en servidor. [Guía](cambio-tema-estudio.md) y [registro de cambios/validación](mejoras-temas-20261026.md). No se modificó el banco.

Última comprobación tras F04: compilación correcta, **592 pruebas de servidor y 21 de Chromium aprobadas**, con permisos, disponibilidad, conservación y reintento comprobados.
