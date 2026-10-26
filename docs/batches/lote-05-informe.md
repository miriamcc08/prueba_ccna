# Lote original 05: creación y validación documentada

El 26 de octubre de 2026 se guardaron otras 50 preguntas ES/EN: 45 de respuesta única y cinco de selección múltiple, una de ellas con tres respuestas. El reparto es 10/10/12/5/8/5 entre las seis áreas.

Se revisaron por asistente automatizado los escenarios, las claves propuestas, la lógica de los distractores y la coherencia bilingüe frente a pasajes técnicos. La evidencia corresponde a 36 documentos primarios citados, recuperados de Cisco y RFC Editor. Cada pregunta registra sección, anclas del pasaje, fecha, hash del documento y huella del contenido revisado. Esta revisión se atribuye expresamente a un asistente automatizado y no se presenta como aprobación editorial humana.

## Material guardado

| Archivo | Contenido |
|---|---|
| [lote-original-05-50.md](lote-original-05-50.md) | Las 50 preguntas con alternativas, respuestas y explicaciones ES/EN |
| `server/prisma/questions/original_20261026_b05_50.json` | Fuente de verdad con IDs estables y metadatos de revisión |
| [lote-05-referencias.json](lote-05-referencias.json) | 50 registros de consulta focalizada y 36 documentos citados |
| [lote-05-calculos.json](lote-05-calculos.json) | Seis comprobaciones independientes de cálculo o escenario |
| [lote-05-validacion.json](lote-05-validacion.json) | Integridad de documentos, pasajes y vínculo de revisión con el contenido |
| [lote-05-similitud.json](lote-05-similitud.json) | Comparación léxica contra los 500 candidatos anteriores |

## Temas y correcciones de revisión

El lote amplía WLAN y CAPWAP, división Local/Split MAC, asignación VLAN con RADIUS, puertos enrutados, EtherChannel y STP, diagnóstico Init/Full de OSPF, comportamiento no preemptivo del DR, caché de vecinos IPv6, DHCP, SNMP, SYN flood, certificados wildcard, VACM, PATCH y recuperación tras un POST con resultado incierto.

Se corrigieron y acotaron estos puntos antes de importar:

- El caso de `default-information originate` excluye expresamente `route-map`, que introduce una excepción documentada en Cisco. También excluye `always`.
- El ejercicio de ruta local /32 usa el artículo específico de Cisco sobre rutas locales, en lugar de una referencia general a interfaces.
- El caso del ID de proceso OSPF usa la respuesta explícita de Cisco sobre su significado local en adyacencias normales.
- La comparación Root Guard/Loop Guard incluye una segunda referencia para la reacción a BPDU superiores.
- La pregunta de extensiones IPv6 comprueba el campo `Next Header` sin depender de una tabla numérica de protocolos que no se había consultado.
- Las alternativas temporales del caso OSPF están traducidas a segundos en español.

## Qué se comprobó

1. Las 50 preguntas pasan el esquema de importación, reglas de cantidad de respuestas, claves propuestas y presencia de contenido bilingüe.
2. Los seis casos ejecutables se recalculan en Python: consumo de secuencia SYN, utilización de enlace, temporizador OSPF, prefijo más específico, filtro numérico de severidades y cobertura de wildcard DNS. Seis pruebas cambian una clave manteniendo válida su cardinalidad; los verificadores rechazan los cambios.
3. Se comprobaron los bytes y hashes de los 36 documentos citados y las anclas de evidencia de cada pregunta. Las copias locales se guardan por hash para evitar que otra descarga de la misma URL sobrescriba la evidencia.
4. La revisión se vincula al texto y las alternativas mediante SHA-256. Un cambio posterior invalida esa correspondencia; no conserva silenciosamente una revisión anterior. Las pruebas detectan además documentos modificados y anclas presentes solo dentro de scripts HTML.
5. La comparación léxica no detectó similitudes por encima de 0,72 frente a 500 candidatos. Eso no demuestra ausencia de equivalencias de significado. Los dos ejercicios relacionados de descubrimiento CAPWAP comparten familia; otros conceptos relacionados mantienen familias de lotes anteriores.
6. La importación transaccional crea 50 registros pendientes. La repetición de las cinco cargas creó cero registros adicionales y mantuvo 50 por lote. La prueba de integración comprueba que la revisión automatizada no convierte candidatos en preguntas puntuables.

El banco actual contiene **550 candidatos y 506 familias declaradas**. Hay 250 preguntas originales nuevas pendientes en la base de desarrollo separada, además de los ocho ejemplos puntuables. La base SQLite heredada versionada se conserva.

## Repetir la validación

Desde la raíz de la copia de ejecución:

```bash
python3 tools/check-question-calculations.py server/prisma/questions/original_20261026_b05_50.json
python3 tools/check-question-evidence.py server/prisma/questions/original_20261026_b05_50.json --references docs/batches/lote-05-referencias.json
```

El segundo comando comprueba sin red el manifiesto y la huella de revisión. Añadir `--check-cache` verifica también los bytes y pasajes de las copias recuperadas; requiere la caché local indicada en el manifiesto. Una instalación en otra máquina no contiene automáticamente esos documentos externos.

La instalación completa pasó la compilación, **383 pruebas del servidor y seis de Chromium**.

## Aprobación y siguiente fase

La coincidencia de una frase y su hash comprueba procedencia e integridad, no demuestra por sí sola que la respuesta se deduzca correctamente. La revisión técnica por asistente quedó registrada aparte; todavía corresponde una revisión editorial independiente de claves, distractores, traducción y alcance del temario. Los 50 registros conservan `pending_review`, sin firma humana ni fecha ficticia de aprobación.

La fase 5 sigue abierta: 550 candidatos no son 550 preguntas aprobadas distintas. El siguiente trabajo prioriza la revisión editorial de los lotes ya creados y el contraste de cobertura con los objetivos oficiales antes de seguir ampliando cantidades.
