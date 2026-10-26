# Reinicio de estudio — registro de cambios del 26/10/2026

Se completa F02 de la lista de cierre: repetir un ejercicio de estudio en un intento independiente, conservando el original. La generación de preguntas continúa pausada.

## Archivos cambiados

| Archivo | Cambio |
|---|---|
| `server/src/services/examEngine.ts` | `restartStudyExercise` comprueba modo, estado, propiedad, respuesta previa, pertenencia y elegibilidad vigente. Crea en transacción un intento de una pregunta con captura nueva, sin tocar el anterior; conserva preferencias y temario. |
| `server/src/routes/exams.ts` | Endpoint de reinicio con cuerpo validado mediante Zod, detrás del control existente de acceso al intento. El servicio exige además propiedad para impedir que un administrador genere intentos en cuentas ajenas. |
| `shared/types/index.ts` | Referencia opcional al intento de origen en la configuración devuelta, creada por servidor. No modifica el esquema de creación pública ni otorga permisos. |
| `client/src/services/api.ts` | Método tipado para la nueva operación. |
| `client/src/pages/ExamPage.tsx` | Botón tras respuesta confirmada, estado ocupado/error, explicación del comportamiento y vuelta al origen persistida. Limpia el estado de presentación solo después de recibir el intento nuevo y reutiliza el arranque normal. |
| `client/src/pages/ReviewPage.tsx` | Reinicio desde la revisión de un estudio completado, para preguntas respondidas; consulta configuración para mostrar el control. |
| `client/src/i18n/es.json`, `client/src/i18n/en.json` | Textos de reinicio, error, progreso, conservación del intento y retorno. |
| `server/tests/exam.integration.test.ts` | Seis casos: intento independiente, captura histórica, contenido aprobado actual, retirada del banco, restricciones de modo/pertenencia, estudio completado y propiedad HTTP. |
| `tests/browser/workflow.spec.cjs` | Recorrido real de confirmar, reiniciar, recuperar al recargar, volver al original y reiniciar desde revisión; verifica que la respuesta anterior no cambia. |
| `docs/pendientes-cierre.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/cobertura-priorizada.md`, `docs/auditoria-funcional-20261026.md`, `README.md` | Actualiza F02 y enlaces, separando reinicio entregado de variantes y límites por pregunta pendientes. |
| `docs/reinicio-estudio.md`, este informe | Uso, permisos, límites, API y trazabilidad de cambios. |

No se modifican JSON del banco, bases SQLite históricas, variables secretas, dependencias ni migraciones. No se crea un administrador real ni se hace despliegue. Todos los cambios quedan guardados en el checkout; no se hizo commit ni push.

## Comprobación

En la copia aislada `/workspace/.ccna-runtime`:

- `npm run build`: cliente y servidor compilan.
- `npm test`: **578 pruebas de servidor aprobadas, 13 archivos**.
- `npm run test:browser`: **14 pruebas Chromium aprobadas**.
- `git diff --check`: sin errores.

Se comprobaron códigos de salida cero y coincidencia del código/pruebas entre checkout y copia ejecutada.

Registros: `/tmp/ccna-reinicio-build.log`, `/tmp/ccna-reinicio-tests.log`, `/tmp/ccna-reinicio-browser.log`. Pruebas HTTP/SQLite y Chromium usan bases temporales; no borran datos reales.

Las comprobaciones de esta entrega no certifican revisión editorial del banco ni todo el alcance original. Permanecen pendientes, entre otros, el tiempo por pregunta, variantes recalculadas, contenido aprobado suficiente y operación de producción. La lista actualizada está en [pendientes-cierre.md](pendientes-cierre.md).
