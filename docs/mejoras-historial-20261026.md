# Versionado e integridad visual del historial — 26/10/2026

Se completa F08 del plan: la API y la pantalla de historial muestran la versión de temario **guardada en cada intento**, junto con su idioma original. Cambiar el banco posteriormente no reemplaza esa referencia. No se modifican preguntas del banco ni se reanuda su generación.

## Cambios guardados

| Archivo | Cambio y motivo |
|---|---|
| `shared/types/index.ts` | Añade `examVersion` al contrato `ExamHistoryItem`. |
| `server/src/routes/exams.ts` | Devuelve `Exam.examVersion` del intento registrado, sin deducirlo del banco actual ni fijarlo globalmente en la respuesta. Conserva consulta autenticada por propietario y solo intentos cerrados. |
| `client/src/pages/HistoryPage.tsx` | Nueva columna de versión e idioma original. Ajusta a ocho columnas los estados de carga/vacío y añade nombres accesibles a tabla/filtro y alcance de encabezados. |
| Mismo componente | Hace visibles los fallos de consulta o borrado que antes se guardaban en estado sin mostrarse. Añade reintento y evita presentar una consulta fallida como historial vacío. |
| Mismo componente | Filtro con las siete modalidades, incluidas personalizada, comandos y troubleshooting; diferencia una modalidad sin coincidencias de una cuenta sin intentos. |
| Mismo componente | Conserva el decimal del porcentaje en tabla y gráfica. Localiza etiquetas, modalidades, fechas y ayudas de ese recorrido en español/inglés; el idioma del intento permanece independiente del idioma actual de interfaz. Sustituye PASS/FAIL por objetivo de práctica alcanzado o por reforzar. |
| `server/tests/exam.integration.test.ts` | Dos casos: versión registrada/captura frente a modificación posterior del banco; autenticación, aislamiento de cuentas y exclusión de intentos configurados. |
| `tests/browser/workflow.spec.cjs` | Dos recorridos: versión e idioma originales, 33.3 % con formato local, siete modalidades y cambio de idioma; error de carga visible y recuperación con reintento. |
| `README.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/pendientes-cierre.md`, `docs/auditoria-funcional-20261026.md`, este informe | Evidencia, estado F08, alcance y registro de cambios. |

No hacen falta migraciones ni dependencias nuevas: `Exam.examVersion` ya existía. La columna muestra la versión registrada, no certifica que corresponda al temario oficial vigente. Para valores ausentes de un servidor anterior, la pantalla indica «No registrada»; no inventa la versión. Las capturas históricas que faltan en intentos heredados no pueden reconstruirse con este cambio.

La política de puntuación no cambia: el objetivo de práctica sigue siendo interno y fijo; la configuración/versionado de esa política (F06) sigue pendiente. El porcentaje conserva el decimal que entrega el servidor en vez de redondearse visualmente a enteros. No se certifica la traducción integral de toda la aplicación: esta entrega corrige el recorrido de historial.

## Comprobación

Se utiliza la copia aislada `/workspace/.ccna-runtime` y las bases temporales de las suites, sin borrar historial real ni alterar la SQLite histórica versionada.

**Resultado final: compilación de cliente y servidor correcta, 588 pruebas de servidor (13 archivos) y 19 pruebas Chromium aprobadas.** Se comprobaron códigos de salida cero, `git diff --check` y coincidencia de código/pruebas entre checkout y copia ejecutada. La expectativa inicial de coma decimal se corrigió al formato `es-PE`, que usa punto: se exige conservar 33.3 % en la celda de puntuación, sin redondear a 33 %. Registros: `/tmp/ccna-historial-build.log`, `/tmp/ccna-historial-tests.log`, `/tmp/ccna-historial-browser.log`.

Las pruebas de navegador construyen un intento con un acierto entre tres preguntas para comprobar un porcentaje fraccional real. La prueba HTTP conserva una captura, cambia la versión del banco después y comprueba que el historial devuelve la del intento. Esto verifica la trazabilidad codificada; no acredita exactitud editorial de todas las preguntas ni la vigencia oficial del banco.

Los cambios quedan guardados en el checkout. No se hizo commit, push ni despliegue. La [lista vigente de pendientes](pendientes-cierre.md) conserva variantes recalculadas, diagnóstico adaptativo ampliado, puntuación configurable, revisión editorial y preparación de producción.
