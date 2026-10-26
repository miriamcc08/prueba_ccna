# Auditoría funcional y cierre de alcance — 26/10/2026

## Actualización posterior

F04 (cambio de tema en estudio) está completado mediante prácticas independientes: [uso](cambio-tema-estudio.md), [cambios y comprobación](mejoras-temas-20261026.md).

F08 (versión en historial) está completado, con filtros y recuperación de errores corregidos: [cambios y comprobación](mejoras-historial-20261026.md).

F01 (tiempo por pregunta) está implementado: [uso y política](tiempo-por-pregunta.md), [cambios y comprobación](mejoras-tiempo-20261026.md). El rechazo de esa opción descrito en el corte original ya fue sustituido por su ejecución en servidor.

F02 (reinicio de ejercicio) está implementado; [uso y límites](reinicio-estudio.md), [cambios y validación](mejoras-reinicio-20261026.md). La matriz original conserva su corte histórico; reinicio ya no está pendiente.

Se implementó CSV para administración y rendimiento por dificultad visible en resultados. La última verificación es **572 pruebas de servidor, 13 de Chromium y compilación correcta**. El registro detallado de esta continuación está en [mejoras-cierre-20261026.md](mejoras-cierre-20261026.md); los pendientes vigentes, con criterios por tarea, en [pendientes-cierre.md](pendientes-cierre.md). La matriz siguiente conserva el corte de la auditoría anterior: CSV ya no está pendiente.

## Dictamen

El simulador tiene recorridos de aplicación comprobados y puede usarse para desarrollo y evaluación con el contenido disponible. **No se declara terminado todo el encargo original ni listo para producción.** La creación de más preguntas queda pausada por decisión del usuario. Esta entrega corrige funcionamiento y administración; no altera los JSON del banco ni concede aprobaciones editoriales.

Referencias: el PLAN.md y el texto maestro aportados por el usuario, contrastados con el código y las pruebas. Se tratan como requisitos de producto, no como evidencia de cumplimiento. Las afirmaciones históricas del plan sobre una aprobación oficial de 825 o una migración trivial a PostgreSQL no se adoptan: la puntuación es interna y la migración necesita trabajo propio.

## Matriz de comprobación

| Requisito | Resultado y límite |
|---|---|
| Registro, acceso, recuperación de cuenta en interfaz | Registro/inicio de sesión y restauración de sesión probados. No hay flujo de contraseña olvidada por correo. |
| Examen estricto | Elegibilidad, filtros, familias, confirmación, selección múltiple exacta, avance y ausencia de soluciones anticipadas probados. No reduce silenciosamente el número solicitado. |
| Tiempo y recuperación | Fecha límite del servidor, recuperación, caducidad y aviso de cinco minutos probados. Finalización fallida permanece recuperable. |
| Estudio | Sin cronómetro, navegación a respuestas confirmadas, preferencias de explicaciones y finalización probadas. Reinicio individual y variantes recalculadas pendientes. |
| Sonidos | Implementados y opcionales; Chromium comprueba activación/desactivación y tono neutro estricto. Requieren interacción y soporte del navegador/dispositivo; la información visual permanece. |
| Límite por pregunta | No implementado. Ahora una petición que lo solicita se rechaza explícitamente, en lugar de aceptar un ajuste sin efecto. Sí existe tiempo total de examen y medición de duración de respuestas. |
| Resultados y privacidad | Puntuación, revisión posterior al cierre, capturas inmutables, acceso del propietario y favoritos probados. Borrado de historial disponible y aislado por cuenta, con confirmación en interfaz. |
| Español e inglés | Contenido y recorridos principales bilingües. Persisten textos de interfaz/errores por traducir; no se certifica revisión lingüística integral. |
| Administración | Rol real, alta segura de cuenta, creación bilingüe, JSON, búsqueda, paginación, revisión, cambios de alternativas/clave como nueva versión y comprobaciones disponibles. Aprobación separada y auditada. |
| Generación con IA / CSV | No implementados. El administrador redacta o importa JSON; el plan de aprendizaje usa reglas, no un modelo de IA. |
| Banco de 1000 | No cumplido: 660 candidatos JSON y 586 familias declaradas; 360 originales nuevos pendientes. Tener candidato, fuente o prueba numérica no significa aprobación técnica. |
| Vigencia y calidad de todas las preguntas | Pendiente de revisión técnica, distractores, traducción, licencia y equivalencias semánticas. 229 originales tienen consulta focalizada y 101 tienen caso independiente ejecutable; esos conjuntos se superponen. |
| Seguridad de roles y navegador | CORS restrictivo y rol vigente consultado en base, con pruebas. No equivalen a una auditoría de seguridad completa. |
| Producción | Pendientes PostgreSQL/migración si se adopta, despliegue real, copias/restauración ensayadas, límites de peticiones, limpieza del versionado heredado y verificación de accesibilidad/móviles. |

La copia de ejecución mantiene ocho ejemplos del seed etiquetados como validados para probar puntuación y 360 originales pendientes. Esos ejemplos no acreditan una revisión independiente del banco. La base SQLite histórica versionada, las credenciales y dependencias heredadas se preservan; no se usan como base de las pruebas.

## Registro de cambios de esta auditoría

| Archivos | Cambio y motivo |
|---|---|
| `client/src/components/AdminQuestionEditor.tsx` (nuevo) | Formulario manual ES/EN: tema, 14 tipos, dificultad individual, alternativas, clave, explicaciones, referencia, licencia y familia; siempre guarda pendiente. |
| `client/src/pages/AdminPage.tsx` | Alta visible; búsqueda, estado, idioma y páginas de 50; control de respuestas fuera de orden; errores sin datos ficticios; restauración de sesión antes de redirigir; JSON arreglo u objeto; revisión de opciones/clave y referencia; ejecución de comprobaciones y licencia visible. |
| `client/src/services/api.ts`, `shared/types/index.ts` | Métodos y tipos para alta, comprobaciones, borrado de historial y licencia del detalle. |
| `server/src/services/questionService.ts` | Alta rechaza duplicación exacta normalizada ES o EN; orden de alternativas coherente con el arreglo al crear/actualizar; licencia en detalle. Las revisiones conservan su ruta independiente. |
| `server/src/validators/schemas.ts` | Rechaza dificultad `mixed` para una pregunta individual; sigue permitida para seleccionar un examen. |
| `server/prisma/bootstrap-admin.ts` (nuevo), `server/prisma/seed.ts`, `server/package.json`, `server/.env.example` | Comando optativo de alta de administrador, contraseña con mínimo y máximo de bytes, correo normalizado, sin restablecer contraseñas ni promover usuarios normales. Configuración documentada sin secretos. |
| `server/src/middleware/auth.ts` | Consulta identidad y rol vigentes en base tras verificar el token. Las cuentas eliminadas y permisos retirados dejan de funcionar inmediatamente. |
| `server/src/lib/corsPolicy.ts` (nuevo), `server/src/index.ts` | Elimina aceptación de orígenes ajenos. Lista exacta configurable y desarrollo local; producción exige configuración explícita sin comodín. |
| `client/src/hooks/useExamSounds.ts` (nuevo), `client/src/pages/ExamPage.tsx` | Tonos opcionales con Web Audio tras interacción; feedback de estudio, tono neutro estricto y aviso temporal; fallos de audio no bloquean el examen. |
| `server/src/services/examEngine.ts` | Rechaza explícitamente el límite por pregunta todavía no soportado. |
| `client/src/pages/HistoryPage.tsx` | Borrado de los propios intentos con confirmación y manejo de errores; conserva favoritos. Incluye intentos en curso de esa cuenta, como informa la confirmación. |
| `client/src/components/ExamSummaryCard.tsx`, `client/src/components/TopicChart.tsx`, `client/src/pages/ResultsPage.tsx` | Corrige presentación de estudio sin tiempo y rótulos que podían atribuir a Cisco el objetivo de puntuación interno. |
| `client/src/i18n/en.json`, `client/src/i18n/es.json` | Etiquetas bilingües para referencia en revisión. |
| `server/tests/exam.integration.test.ts`, `tests/browser/workflow.spec.cjs` | Casos nuevos de autorización, bootstrap, alta pendiente, duplicados, orden, CORS, temporizador no soportado, aislamiento al borrar, registro sin privilegios; navegador: formulario, búsqueda/páginas, sonido y confirmación de borrado. Ajuste de selectores al idioma visible de administración. |
| `README.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/cobertura-priorizada.md`, este informe y `docs/administracion.md` | Guía de administración, evidencia de comprobación, alcance real y pendientes actualizados. |

## Validación reproducible

La instalación completa se ejecutó con `bash tools/cloud-setup.sh`: copia aislada, instalación por lockfile, generación/migraciones Prisma, seed, comprobaciones Python, importación pendiente e idempotente, compilación y pruebas. Las ampliaciones posteriores de pruebas se ejecutan en esa misma copia. Las pruebas HTTP/SQLite y Chromium crean bases temporales, sin borrar historial real ni añadir cuentas reales al desarrollo.

Resultados finales: **compilación de cliente y servidor correcta, 547 pruebas del servidor aprobadas (12 archivos) y 12 pruebas de Chromium aprobadas**. Los registros están en `/tmp/ccna-auditoria-final-20261026.log`, `/tmp/ccna-audit-tests-20261026.log` y `/tmp/ccna-audit-browser-20261026.log`. `git diff --check` pasó. Se comprobó que el código y pruebas de la copia ejecutada coinciden con el checkout. La consulta de inventario de la copia de ejecución confirmó **0 administradores**, 360 preguntas pendientes y 8 ejemplos validados del seed; no se consultaron ni mostraron credenciales. Los resultados automáticos verifican los escenarios codificados; no demuestran exactitud de todas las preguntas, accesibilidad completa ni funcionamiento en todos los dispositivos.

## Orden para el cierre restante

1. Evaluar el flujo actual con el banco disponible y crear la cuenta administradora mediante variables seguras; procedimiento en [administracion.md](administracion.md).
2. Completar revisión editorial del material existente y matriz del temario oficial. La ampliación del banco queda pausada; el objetivo de 1000 permanece pendiente, no eliminado.
3. Resolver o retirar explícitamente del alcance variantes, reinicio individual, límite por pregunta, CSV y generador IA; actualmente no se presentan como funciones completas.
4. Preparar y comprobar despliegue, restauración, controles de abuso, accesibilidad y móviles antes de declarar producción.

Todos los cambios se guardan en el checkout. No se hizo commit, push, despliegue ni limpieza destructiva del contenido heredado.
