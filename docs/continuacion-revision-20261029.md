# Continuación de la revisión técnica — 29/10/2026

## Resultado vigente

Esta entrega añade **235 aprobaciones** a las 131 anteriores: 230 originales pendientes, una pregunta protect-mode que antes carecía del capítulo concreto y cuatro versiones corregidas. No se añadieron ejercicios ni conceptos nuevos; las cuatro entradas adicionales son revisiones que conservan los registros originales y sus familias.

| Inventario versionado | Aprobadas | Pendientes | Total |
|---|---:|---:|---:|
| Ocho lotes originales | 351 | 9 | 360 |
| Banco heredado | 11 | 289 | 300 |
| Versiones corregidas | 4 | 0 | 4 |
| Total | **366** | **298** | **664** |

Se ha inspeccionado técnicamente el contenido bilingüe de las 360 originales, las cuatro versiones corregidas y las 11 heredadas previamente revisadas: 375 registros. Las 289 heredadas restantes todavía necesitan revisión técnica completa. Superar la comprobación estructural no las aprueba.

En la base de ejecución de nube, la aplicación real pasó de 668 a **672 registros**, de 139 a **374 validados** y de 120 a **312 familias validadas distintas**. Los ocho ejemplos iniciales se conservan y se cuentan aparte de las 366 aprobaciones del manifiesto. Hay 31 familias básicas, 276 intermedias y ocho avanzadas; esas cantidades no se suman porque algunas familias aparecen con distintas dificultades. Se verificó nuevamente un simulacro mixto de 100 preguntas, sin candidatas pendientes ni familias repetidas.

**La base del PC del usuario no se modifica desde esta copia de nube.** Los números anteriores se obtuvieron después de aplicar el manifiesto a la copia de ejecución, sin contenido propio adicional.

## Correcciones conservando versiones

Las versiones se guardan en `server/prisma/questions/reviewed_corrections_20261029.json`. El sufijo `-review-r1` identifica la corrección y `supersedesQuestionId` su original; ambas conservan `questionFamilyId`. Se reformularon los enunciados en ambos idiomas para distinguir versiones sin introducir duplicados exactos. Las versiones anteriores permanecen pendientes y no participan en exámenes.

| Original | Cambio comprobado en la versión aprobada |
|---|---|
| ccna-original-20261024-b03-026 | Explicitar que las tres interfaces están activas y habilitadas en OSPF antes de preguntar por passive-interface. |
| ccna-original-20261026-b04-025 | Corregir la explicación y todas sus copias en alternativas: los ID locales de proceso no **necesitan** coincidir; no se prohíbe que coincidan. |
| ccna-original-20261026-b05-022 | La misma corrección de significado entre need not y no necesita, manteniendo la respuesta negativa correcta. |
| ccna-original-20261026-b07-048 | Traducir completamente la alternativa A que mezclaba inglés y español. |

La pregunta `ccna-original-20261024-045` se aprobó tras consultar el capítulo específico `port_security.html`, que documenta protect, restrict y shutdown; ya no depende únicamente del índice citado inicialmente.

## Cinco originales que todavía necesitan evidencia específica

- `ccna-original-20261024-b02-042`: la fuente de DAI consultada no basta para acreditar el filtrado de OFFER por DHCP snooping en puertos no confiables.
- `ccna-original-20261024-b03-021`: falta una referencia específica sobre dependencias circulares en la resolución recursiva de rutas estáticas.
- `ccna-original-20261024-b03-039`: IP Source Guard aparece en navegación de la fuente, pero no se documenta ahí el mecanismo que se compara con DAI.
- `ccna-original-20261024-b03-042`: el argumento sobre un secreto compartido es correcto, pero la fuente 802.1X no acredita suficientemente la revocación del caso PSK.
- `ccna-original-20261026-b04-012`: falta un pasaje específico sobre flooding de unicast desconocido y exclusión del puerto de entrada.

Estas cinco, más los cuatro originales sustituidos, explican los nueve registros originales pendientes. No se atribuye a una página un respaldo que solo aparece en su menú o índice.

## Evidencia y aplicación

`server/prisma/reviews/continuation-20261029.json` contiene las 244 decisiones de esta ronda, claves esperadas explícitas, hashes del contenido, secciones, localizadores y hashes de pasajes consultados. Incluye ocho comprobaciones con fuentes complementarias, por ejemplo los puertos RADIUS/TACACS+ y la ausencia del ID de proceso local en la cabecera OSPF. Los documentos son copias primarias Cisco/RFC de la caché, con integridad comprobada; no se afirma una nueva descarga ni certificación de vigencia completa del blueprint.

`tools/build-reviewed-bank-report.py` comprueba esas decisiones, claves y pasajes al reconstruir el manifiesto acumulado `assisted-20261029.json`, revisión 2. Se conserva el identificador de auditoría anterior para no duplicar las 131 decisiones ya aplicadas. La nueva ronda queda diferenciada en cada registro. El manifiesto acumula 123 entradas de referencia; una misma URL puede tener versiones con hashes diferentes, que se vinculan explícitamente por decisión. Las citas breves por URL permanecen limitadas a 90 palabras; los pasajes adicionales se identifican por hash y ubicación sin reproducir el texto completo.

La revisión es **asistida y automatizada, autorizada por el usuario**. No se presenta como una firma humana ni certificación Cisco. Las 110 comprobaciones ejecutables aprobadas anteriores se conservan; las demás 256 aprobaciones son documentales. El generador comprueba que las claves editoriales explícitas coincidan con las alternativas del contenido revisado.

Desde `server`, usando la misma `DATABASE_URL` de la aplicación:

```powershell
npm run db:sync-reviewed
npm run db:sync-reviewed -- --apply
```

El primer comando no escribe. El segundo funciona tanto en una instalación inicial como en la que ya aplicó las 131 decisiones. En esta última crea cuatro versiones, aprueba 235 y reconoce las 131 anteriores. Repetirlo no duplica registros. Detén antes el servidor para actualizar el código y evitar bloqueos de SQLite. No borres ni reinicies la base.

Los cambios locales incompatibles, rechazos editoriales y aprobaciones retiradas siguen requiriendo reconciliación explícita; no se sobrescriben silenciosamente. Las notas de auditoría incluyen ronda, fuente exacta, evidencia adicional y pregunta sustituida. El actor técnico continúa bloqueado para login y tokens, sin permisos de administrador interactivo.

## Cambios de implementación y pruebas

- Generador y manifiestos: incorporar únicamente la lista explícita inspeccionada y verificar claves, contenido y pasajes de fuentes.
- Sincronizador: vincular evidencia por URL y hash, validar referencias complementarias, clave editorial y procedencia de las correcciones; registrar la ronda en auditoría.
- `server/tsconfig.review.json` y `npm run check:review`: comprobación reproducible de tipos de los módulos CLI que no cubría la compilación ordinaria.
- Pruebas del manifiesto: rechazo de una clave editorial o hash documental alterados; cuatro correcciones con familia conservada y originales pendientes; protect-mode aprobado con evidencia.
- Integración: simular exactamente la actualización de 131 a 366 decisiones, comprobar 235 nuevas aprobaciones, cuatro versiones nuevas y conservación del contenido anterior.
- Auditoría y navegador: actualizar inventario de 660 a 664 y comprobar un examen real de 100 preguntas aprobadas con familias únicas y capturas.

Validación: **602 pruebas de servidor y 22 de Chromium aprobadas**, compilación de cliente/servidor y `npm run check:review` correctos. Los 101 escenarios originales y 11 cálculos heredados independientes se mantienen; la reconstrucción comprueba también los hashes documentales. Comprobada la aplicación real y su repetición idempotente en la copia de nube.

Pendientes reales: revisar las 289 heredadas, resolver la evidencia de las cinco originales retenidas, completar cobertura por subobjetivo/pesos oficiales, duplicados semánticos y disponibilidad con cada filtro. No se declara todo el banco terminado ni 100 preguntas disponibles en cualquier dificultad.
