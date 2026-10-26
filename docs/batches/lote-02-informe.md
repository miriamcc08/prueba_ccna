# Informe del segundo lote original

Se crearon 50 preguntas bilingües: 10 de Network Fundamentals, 10 de Network Access, 13 de IP Connectivity, 5 de IP Services, 7 de Security Fundamentals y 5 de Automation and Programmability. Combinadas con el primer lote original, las 100 preguntas siguen el reparto de trabajo 20/20/25/10/15/10; no se afirma haber descargado nuevamente el documento completo de objetivos oficiales.

Diez preguntas requieren selección múltiple, con la cantidad indicada en ambos idiomas. Incluyen DAD, mapeo multicast, capacidad EtherChannel, listas VLAN, voz/datos, OSPF passive, DNS, wildcards no contiguas, AAA y restricciones YANG. Cada registro tiene enunciados, alternativas, clave propuesta, explicaciones ES/EN, referencia y familia.

## Comprobaciones

- 13 verificaciones ejecutables independientes: solicited-node, EUI-64 modificado, MSS, unidades de fragmentación, mapeo multicast, intersección VLAN, elegibilidad DR, costos de camino, temporizadores DHCP, stratum NTP, recorrido OID, wildcard no contigua y rango entero YANG.
- 32 documentos primarios recuperados por HTTPS, con fecha, tamaño y SHA-256 registrados en `lote-02-referencias.json`.
- 24 consultas focalizadas de pasajes contrastadas con la regla principal de la pregunta. El resto de los documentos recuperados sigue pendiente de revisión del pasaje preciso. Recuperar un documento no equivale a comprobar cada afirmación.
- Cribado léxico contra 350 candidatos previos, con umbral 0,72 tras enmascarar valores numéricos IPv4: no se detectaron candidatos por encima de ese umbral. Este cribado no demuestra ausencia de duplicados semánticos.
- Los dos ejercicios sobre MTU mínima IPv6 comparten familia. Los nuevos ejercicios relacionados con elección DR y filtrado VLAN conservan las familias anteriores. No se contabilizan como conceptos independientes por tener otra redacción.

## Importación

El importador admite múltiples lotes y conserva IDs, preguntas editadas y revisiones anteriores. El setup comprueba todos los lotes originales e importa ambos. La base nueva de desarrollo contiene 8 ejemplos puntuables y 100 preguntas originales pendientes; los 300 JSON heredados no se cargan automáticamente allí.

La importación repetida debe informar cero creadas y 50 sin cambios por lote. Un conflicto de contenido cancela la transacción del lote, sin sobrescribir la edición existente. Ni la consulta de referencias ni las verificaciones de cálculo aprueban preguntas automáticamente.

Tras incorporar este lote, la auditoría reúne 400 candidatos y 386 familias declaradas en siete grupos relacionados. No se interpreta ese recuento como 386 conceptos aprobados.

## Estado editorial

Las 50 preguntas se mantienen en `pending_review`. No se aprobaron, rechazaron ni descartaron automáticamente por el cribado. Queda pendiente revisar técnicamente el contenido completo, las traducciones y la equivalencia semántica con el banco.

El acceso a RFC Editor y los artículos Cisco ahora funciona. La página oficial del examen consultada indica 120 minutos y enlaza el temario v1.1; el documento de objetivos enlazado no pudo recuperarse. Las afirmaciones anteriores de bloqueo general describen el estado de red de esas entregas, no el acceso actual a todos los recursos.

## Archivos

- `lote-original-02-50.md`: lectura de preguntas, respuestas propuestas y explicaciones.
- `lote-02-calculos.json`: resultados independientes.
- `lote-02-referencias.json`: procedencia documental y consultas focalizadas.
- `lote-02-similitud.json`: cribado léxico y límites.
- `../../server/prisma/questions/original_20261024_b02_50.json`: datos importables.
