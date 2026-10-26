# Informe del tercer lote original

Se añadieron 50 preguntas ES/EN: 10 de Network Fundamentals, 10 de Network Access, 12 de IP Connectivity, 5 de IP Services, 8 de Security Fundamentals y 5 de Automation and Programmability. Diez son de selección múltiple y una de verdadero/falso.

Los escenarios incluyen secuencias TCP, ventanas, longitudes UDP e IPv4, DSCP/ECN, direccionamiento de documentación, STP, CAPWAP, radio, OSPF, DNS, NAT, ACL, AAA, SSH, HTTP y NETCONF. Cada registro contiene alternativas, respuestas propuestas, explicaciones bilingües y referencias.

## Comprobaciones

- 21 casos recalculados con una implementación independiente: secuencias TCP con y sin FIN, límite de ventana, carga útil UDP, IHL, empaquetado DSCP/ECN, pertenencia a rangos de documentación y RFC 1918, costos STP, puerto designado, SNR, excepciones passive, distancia administrativa, mapeo multicast IPv6, imposibilidad de resumen exacto, secuencias LSA, TTL DNS, serialización, NAT, política ACL y tipo numérico JSON.
- 38 documentos principales y dos complementarios recuperados por HTTPS, con fechas y SHA-256 en `lote-03-referencias.json`. Parte de estas referencias ya estaba disponible en la caché de las entregas anteriores.
- 11 consultas focalizadas de pasajes de referencia registradas. No se atribuye revisión completa a todos los documentos descargados. La cobertura parcial de algunas referencias se marca en los metadatos.
- Cribado léxico contra los 400 candidatos anteriores, con umbral 0,72: no aparecieron pares por encima de ese umbral. Esto no prueba ausencia de equivalencia semántica.

Los ejercicios relacionados comparten familia. En particular, las dos preguntas de secuencias TCP y las dos sobre uso de espacio de documentación no se cuentan como familias independientes. También se conservan familias previas para casos relacionados de STP, resolución recursiva, passive OSPF, distancia, resumen, RA y ACL.

## Carga y estado

El lote se importó como 50 registros `pending_review`. Repetir la carga no creó registros ni sobrescribió ediciones. Los cálculos y la consulta de fuentes no aprueban preguntas automáticamente.

Ahora hay 450 candidatos JSON y 427 familias declaradas. Esto no es un recuento de 450 preguntas técnicamente aprobadas. La copia de desarrollo contiene 8 ejemplos puntuables y 150 originales pendientes; los 300 candidatos heredados no se cargan automáticamente.

La instalación completa, compilación y pruebas pasaron: 264 pruebas del servidor y 4 recorridos de regresión en Chromium. Las pruebas comprueban también que una clave ACL incorrecta se detecta aunque conserve el número de selecciones requerido.

## Archivos

- `lote-original-03-50.md`: preguntas y explicaciones para lectura.
- `lote-03-calculos.json`: resultados de los 21 casos independientes.
- `lote-03-referencias.json`: documentos y consultas focalizadas.
- `lote-03-similitud.json`: cribado léxico y límites.
- `../../server/prisma/questions/original_20261024_b03_50.json`: fuente importable.

La revisión técnica completa, la revisión de traducción y la equivalencia con todo el banco continúan pendientes. No se afirma que este lote contenga preguntas reales de un examen Cisco.
