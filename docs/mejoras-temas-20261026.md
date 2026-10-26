# Cambio de tema en estudio — registro de cambios del 26/10/2026

Se completa F04 del plan: abrir una práctica del tema elegido sin alterar el intento anterior. El banco de preguntas permanece sin ampliaciones ni aprobaciones automáticas. Guía y límites: [cambio-tema-estudio.md](cambio-tema-estudio.md).

## Cambios guardados

| Archivo | Cambio |
|---|---|
| `server/src/services/examEngine.ts` | `createStudyTopicPractice` exige estudio activo/completado, propiedad, tema existente y cantidad válida. Reutiliza selección y captura del motor para un intento independiente filtrado por el tema, con preferencias conservadas y referencia al origen. No modifica el intento anterior. |
| `server/src/routes/exams.ts` | Nuevo endpoint protegido por acceso al intento y validación Zod; el servicio añade control del propietario incluso frente a administradores. |
| `client/src/services/api.ts` | Método tipado `changeStudyTopic`. |
| `client/src/components/StudyTopicPractice.tsx` (nuevo) | Formulario bilingüe con temas reales, cantidad, disponibilidad elegible, bloqueo ante cero/error, reintento, estado de creación y aviso de que el reloj anterior no se pausa. Ignora respuestas de consultas anteriores mediante limpieza de efectos. |
| `client/src/pages/ExamPage.tsx` | Botón de cambio de tema solo en estudio; abre/cierra el formulario, limpia su visibilidad al cambiar de intento y navega únicamente después de creación confirmada. Reutiliza el enlace de vuelta persistido. |
| `server/tests/exam.integration.test.ts` | Cuatro casos nuevos: filtrado exacto/conservación del origen; temas vacíos/desconocidos y cantidades inválidas; modo/estado admitidos y estudio completado; propietario/administrador y contrato HTTP. |
| `tests/browser/workflow.spec.cjs` | Cambio real a otro tema, cero disponible bloqueado, configuración y respuesta original conservadas, recarga/vuelta al origen; fallo de disponibilidad bloquea inicio y reintento lo recupera. |
| `README.md`, `docs/pendientes-cierre.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/auditoria-funcional-20261026.md` | Estado F04, enlaces, evidencia y pendientes actualizados. |
| `docs/cambio-tema-estudio.md`, este informe | Uso, política, permisos, contrato y registro de cambios. |

No requiere migraciones ni nuevas dependencias. Se conservaron la SQLite histórica versionada, `.env`, dependencias heredadas y JSON del banco. Las preguntas y cuentas de prueba se crean únicamente en bases temporales.

## Validación

La primera compilación detectó que la API de temas no devuelve `code`; se corrigió el selector para utilizar los nombres que realmente proporciona. Durante el arranque inicial de comprobaciones hubo una desconexión del entorno; al volver se verificó que los archivos y registros se conservaron y se continuó la validación. No se dieron por aprobadas pruebas sin resultados.

**Resultado final: cliente y servidor compilan, 592 pruebas de servidor (13 archivos) y 21 de Chromium aprobadas.** Se comprobaron códigos de salida cero, `git diff --check` y coincidencia del código/pruebas del checkout con la copia ejecutada. Registros: `/tmp/ccna-temas-build.log`, `/tmp/ccna-temas-tests.log`, `/tmp/ccna-temas-browser.log`. La copia de ejecución es `/workspace/.ccna-runtime`; integración y Chromium usan bases independientes temporales.

Las pruebas comprueban filtros y conservación de respuestas, capturas, configuración y fechas límite, y que un administrador no pueda poblar el historial de otra persona con esta operación. No certifican cobertura oficial del banco ni exactitud editorial de todas sus preguntas.

Los cambios quedan guardados en el checkout; no se hizo commit, push ni despliegue. Las variantes recalculadas, ampliación de validadores/diagnóstico, puntuación configurable, revisión editorial y producción siguen en [la lista de cierre](pendientes-cierre.md).
