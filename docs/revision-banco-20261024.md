# Revisión del banco y protección del historial

## Hallazgos comprobados

- Los 300 candidatos heredados contienen 267 preguntas de respuesta única: 266 tienen clave A y una tiene clave B. De las 33 de selección múltiple, 29 tienen A,B. Esta concentración permite aprender un patrón de letras sin demostrar conocimientos.
- Se revisaron 11 ejercicios numéricos heredados de límites de subred, capacidad, VLSM, resumen de rutas, máscara binaria y compresión IPv6. Sus claves coinciden con cálculos independientes y con los valores de la alternativa española. No se encontraron claves numéricas incorrectas en esos 11 casos.
- Cuatro grupos de ejercicios equivalentes ya tienen una familia común: resumen IPv4 de cuatro /24 contiguos, longest-prefix match IPv4, longest-prefix match IPv6 e interpretación de distancia/métrica. Incluyen las preguntas equivalentes del lote original nuevo. Las familias declaradas reducen los 350 registros a 339 grupos; esto no demuestra ausencia de otros duplicados semánticos.

## Correcciones en los archivos de candidatos

| Archivo e índice (desde cero) | Cambio |
|---|---|
| `batch2_network_fundamentals.json`, 7 | La pregunta sobre alcance link-local ahora es `ipv6_addressing`, no `subnetting`. |
| `batch4_all.json`, 6 | Se describe una reserva interna de redes privadas; se elimina la asignación por un ISP y la terminología classful innecesaria. |
| `batch6_all.json`, 23 | E2 usa principalmente la métrica externa, pero el costo interno puede desempatar métricas externas iguales. Se elimina la afirmación de que nunca importa y la presentación de métricas del ejemplo como constantes universales. |
| `batch6_all.json`, 25 | Se aclara que las entradas conectadas/locales no tienen por qué mostrar el par entre corchetes. No todas las líneas de `show ip route` presentan `[distancia/métrica]`. |

También se añadieron identificadores de familia a 12 registros heredados. Los importadores conservan esa familia. Las correcciones afectan los candidatos JSON; no sobrescriben ciegamente las copias que alguien haya editado o aprobado en una base existente. Esas copias pueden actualizarse mediante una nueva revisión en el panel administrativo.

## Cambios funcionales

Los intentos nuevos capturan el contenido completo de cada pregunta al configurarse: enunciados, traducciones, alternativas, clave, explicaciones, tema y orden presentado. Un hash permite detectar corrupción accidental. La API pública sigue excluyendo las soluciones durante el modo estricto.

Las alternativas elegibles se barajan y reciben letras según el orden guardado; este orden se mantiene tras una recarga. Si el texto referencia explícitamente una letra, se conserva el orden original para no alterar su significado: esas preguntas aún requieren edición. El barajado no sustituye la revisión de la calidad del banco.

La revisión y la puntuación usan la copia del intento. Una edición posterior del banco no cambia la pregunta presentada, la nota ni sus explicaciones. Los intentos antiguos sin copia no se reconstruyen artificialmente y muestran una advertencia en la revisión. La edición directa de contenido asociado a esos intentos antiguos se bloquea; se ofrece crear una revisión separada.

Desde administración se pueden corregir enunciados y explicaciones ES/EN guardándolos como una nueva revisión. La nueva pregunta comparte familia, queda pendiente de aprobación y conserva el original y sus alternativas para el historial. Las alternativas de una pregunta ya usada no se reemplazan en el mismo registro; la API de revisiones permite crear una versión con alternativas corregidas.

## Evidencia y límites

- `batches/revision-calculos-heredados.json`: resultados reproducibles de los 11 ejercicios y distribución de claves.
- `auditoria-banco.json`: recuento actualizado de candidatos, familias declaradas y advertencia sobre concentración de claves.
- `tools/review-legacy-calculations.py`: verificador independiente con Python `ipaddress`.
- Pruebas de contenido guardado, integridad, barajado, claves históricas y creación de revisiones.

No se aprobaron automáticamente preguntas por estas comprobaciones. En el momento de esta revisión las referencias primarias estaban bloqueadas. En la entrega del lote 02 se recuperaron documentos y se registraron consultas focalizadas; la revisión completa de contenido, traducciones y vigencia del temario continúa pendiente. El objetivo de 1000 preguntas aprobadas distintas todavía no se alcanzó.
