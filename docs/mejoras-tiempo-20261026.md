# Tiempo por pregunta — registro de cambios del 26/10/2026

Se implementa F01 del plan: límite opcional por pregunta, con activación persistida, política de vencimiento y comprobación en servidor. Continúa pausada la generación de preguntas. Política y uso: [tiempo-por-pregunta.md](tiempo-por-pregunta.md).

## Cambios

| Archivo | Cambio y motivo |
|---|---|
| `server/prisma/schema.prisma`, `server/prisma/migrations/20261026190000_question_activation/migration.sql` | Añade `ExamQuestion.activatedAt` nullable. Persistir la activación evita reiniciar el intervalo por recarga. Migración aditiva, sin borrar datos ni inventar activaciones históricas. |
| `server/src/services/examEngine.ts` | Acepta límite individual salvo combinación con estudio sin tiempo. Arranque y activación inicial en transacción; plazo efectivo limitado por el total; vencimiento y avance con control de cursor; siguiente activación al confirmar o recuperar; cierre/puntuación de última vencida. Rechaza respuestas tardías antes y durante la transacción y mantiene orden secuencial con límite activado. Devuelve plazos en estado y confirmación. |
| `shared/types/index.ts` | Campo opcional `questionExpiresAt` en estado y confirmación, compatible con recorridos sin límite. |
| `client/src/hooks/useExam.ts` | Actualiza el plazo de la siguiente pregunta al confirmar; evita que el contador siga mostrando el plazo anterior. |
| `client/src/pages/ConfigPage.tsx` | Selector de intervalo/desactivado, instrucciones y exclusión de estudio sin cronómetro; al salir de ese modo la opción vuelve a habilitarse. |
| `client/src/components/ExamSummaryCard.tsx` | Muestra segundos por pregunta elegidos en el resumen previo al inicio. |
| `client/src/pages/ExamPage.tsx` | Contador de pregunta activa separado del total. Al alcanzar el plazo consulta el servidor y recupera cursor/resultado; reintenta ante desconexión y evita consultas simultáneas. No confirma una selección por vencimiento. |
| `client/src/i18n/es.json`, `client/src/i18n/en.json` | Etiquetas e instrucciones de configuración y estudio en ambos idiomas. |
| `server/tests/exam.integration.test.ts` | Ocho casos nuevos: persistencia, recuperación, rechazo tardío, intervalo siguiente y puntuación final, prioridad del total, navegación de estudio, concurrencia y compatibilidad sin límite. El caso anterior de función no soportada ahora comprueba la combinación contradictoria. |
| `tests/browser/workflow.spec.cjs` | Tres recorridos nuevos: desconexión/recuperación y cierre automático, configuración sin contradicciones y actualización visible del plazo al confirmar. |
| `README.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/pendientes-cierre.md`, `docs/cobertura-priorizada.md`, `docs/auditoria-funcional-20261026.md`, `docs/reinicio-estudio.md` | Actualiza F01, capacidades, política y pendientes vigentes. |
| Este informe y `docs/tiempo-por-pregunta.md` | Registro y guía de uso/semántica. |

No se modificó contenido del banco ni se aprobaron preguntas automáticamente. No se tocaron `.env`, dependencias ni la SQLite histórica versionada. La migración sí se aplicó en la copia aislada de ejecución, además de las bases temporales de pruebas.

## Validación

Se generó Prisma y se aplicó la migración mediante `prisma migrate deploy` en `/workspace/.ccna-runtime/server/prisma/cloud.db`. Las pruebas de integración y navegador aplican las migraciones sobre sus propias bases temporales.

**Resultado final: cliente y servidor compilan, 586 pruebas del servidor (13 archivos) y 17 de Chromium pasan.** Se comprobaron códigos de salida cero, `git diff --check` y coincidencia del código/pruebas con la copia ejecutada. Registros: `/tmp/ccna-tiempo-generate.log`, `/tmp/ccna-tiempo-migrate.log`, `/tmp/ccna-tiempo-build.log`, `/tmp/ccna-tiempo-tests.log`, `/tmp/ccna-tiempo-browser.log`.

Los escenarios de vencimiento del servidor se prueban adelantando marcas de activación en la base temporal; Chromium comprueba también vencimientos reales y pérdida de conexión. No se cambia el reloj de la máquina ni se modifica historial real para probar.

Los cambios se guardan en el checkout. No se hizo commit, push ni despliegue. La entrega no certifica el banco completo ni cierra los pendientes de variantes recalculadas, revisión editorial y producción.
