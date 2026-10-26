# Continuación de mejoras y lista de cierre — 26/10/2026

## Resultado

Se completó importación CSV desde administración y se hizo visible el rendimiento por dificultad en resultados. Se conserva la pausa de generación de preguntas. La entrega no modifica los JSON del banco ni aprueba candidatos, no crea una cuenta administradora real ni publica un despliegue.

La lista vigente y completa del trabajo identificado en la revisión está en [pendientes-cierre.md](pendientes-cierre.md), agrupada por contenido, funciones originales, interfaz/cuentas y producción. Incluye criterios de aceptación y distingue mejoras opcionales de requisitos originales. No se considera cerrado todo el proyecto por aprobar pruebas automáticas.

## Cambios guardados

| Archivo | Cambio |
|---|---|
| `shared/questionCsv.ts` (nuevo) | Adaptador de CSV con BOM/UTF-8, comas y saltos entrecomillados, escape de comillas, LF/CRLF, cabeceras verificadas, opciones bilingües A–F, clave simple/múltiple, selección derivada, estimación numérica, límites de 2 MiB UTF-8 y 1000 preguntas. Cabeceras repetidas/desconocidas y filas mal formadas fallan explícitamente. No concede estado validado. |
| `client/src/pages/AdminPage.tsx` | Selector JSON/CSV, detección por extensión de archivo, plantilla CSV descargable, instrucciones, tamaño de archivo, errores de lectura/formato y nombres accesibles para contenido/proceso. Reutiliza el endpoint JSON protegido, manteniendo las reglas de servidor y revisión. |
| `client/src/i18n/en.json`, `client/src/i18n/es.json` | Actualiza título/instrucciones/selección/vista previa para ambos formatos. Elimina promesa de arrastrar/soltar porque el control usa selección de archivo. |
| `client/src/pages/ResultsPage.tsx` | Tabla bilingüe de rendimiento por dificultad: total, aciertos, sin acierto y porcentaje. Aclara que «sin acierto» incluye incorrectas y no respondidas; usa cifras calculadas por servidor, sin nueva fórmula de puntuación. |
| `server/tests/questionCsv.test.ts` (nuevo) | 25 casos de adaptación al esquema existente, Unicode, comillas, múltiples líneas, múltiples respuestas, cabeceras/filas inválidas, traducciones incompletas, clave inexistente, límites de registros y bytes. |
| `tests/browser/workflow.spec.cjs` | Verifica descarga de plantilla, subida CSV real, selección de formato, clave y explicación multilínea preservadas, estado pendiente y rechazo previo al envío de CSV inválido. Amplía el recorrido de resultados para cotejar cada fila de dificultad con la API. |
| `docs/pendientes-cierre.md` (nuevo) | Lista priorizada de cierre con criterios verificables. No presenta PostgreSQL o un proveedor IA como condiciones universales para ejecutar el simulador básico. |
| `docs/importacion-csv.md` (nuevo) | Formato, columnas, límites, errores y comportamiento de importación parcial del servidor. |
| `README.md`, `docs/administracion.md`, `docs/estado.md`, `docs/plan-revisado.md`, `docs/auditoria-funcional-20261026.md` | Actualiza capacidades, enlaces, evidencia y estado de CSV. Conserva los resultados históricos como cortes anteriores. |
| Este informe | Registro de cambios y validación de esta continuación. |

El adaptador no necesita dependencias nuevas. Los archivos de banco, la SQLite histórica versionada, los `.env` y las dependencias versionadas heredadas se preservaron. Los ejemplos de prueba solo se crean en bases temporales y no aumentan el banco de preguntas.

## Validación realizada

En `/workspace/.ccna-runtime`, sincronizando el código y pruebas del checkout:

- `npm run build`: cliente y servidor compilados correctamente.
- `npm test`: **572 pruebas aprobadas, 13 archivos** (547 anteriores más 25 de CSV).
- `npm run test:browser`: **13 pruebas Chromium aprobadas** (12 anteriores ampliadas con dificultad más una de importación CSV).
- `git diff --check`: sin errores de espacios.

Registros de la ejecución: `/tmp/ccna-mejoras-build.log`, `/tmp/ccna-mejoras-tests.log`, `/tmp/ccna-mejoras-browser.log`. Se comprobaron códigos de salida cero. Las pruebas de integración y navegador usan sus propias bases temporales; no borran historial real.

Las pruebas verifican los escenarios descritos. No certifican todo el contenido técnico, todas las traducciones, dispositivos, accesibilidad, restauración o seguridad de un despliegue real. Esos pendientes están enumerados con su criterio de cierre.

Los cambios están guardados en el checkout. No se hizo commit, push ni despliegue en esta continuación.
