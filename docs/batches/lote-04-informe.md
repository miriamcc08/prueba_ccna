# Lote original 04 — 26 de octubre de 2026

Se añadieron 50 preguntas originales ES/EN: 46 de respuesta única y cuatro de selección múltiple. Todas siguen como `pending_review`; no hay aprobaciones técnicas automáticas.

## Cobertura y entregables

| Área | Cantidad | Ejemplos de cobertura |
|---|---:|---|
| Network Fundamentals | 10 | Superposición de subredes, asignación VLSM, anycast, ámbito multicast, loopback, ventana TCP cero, unidades de tasa |
| Network Access | 10 | Aprendizaje MAC, inundación, envejecimiento, PVST+, riesgo de BPDU Filter, mínimo de miembros LACP, VLAN eliminada, autostate |
| IP Connectivity | 12 | Gateway virtual y prioridades VRRP, diagnóstico OSPF, ruta tras caída de enlace, descarte específico, siguiente salto y redirects |
| IP Services | 5 | DHCPNAK, NODATA frente a NXDOMAIN, retardo NTP, shaping/policing y límites de una marca EF |
| Security Fundamentals | 8 | Certificados, claves SSH, ESP, categorías de factores, almacenamiento de contraseñas, agotamiento DHCP, antispoofing y SNMPv3 |
| Automation and Programmability | 5 | Idempotencia DELETE, arreglos JSON, confirmed commit, estado YANG y errores RESTCONF |

- Fuente de verdad: `server/prisma/questions/original_20261026_b04_50.json`.
- Copia de revisión: [lote-original-04-50.md](lote-original-04-50.md).
- Nueve comprobaciones independientes: [lote-04-calculos.json](lote-04-calculos.json).
- Procedencia de 37 documentos recuperados y 13 consultas focalizadas: [lote-04-referencias.json](lote-04-referencias.json).
- Comparación léxica con los 450 candidatos anteriores: [lote-04-similitud.json](lote-04-similitud.json). No detectó candidatos por encima de 0,72; no es una deduplicación semántica completa.

## Comprobaciones y correcciones

Las nueve comprobaciones Python recalculan superposición de prefijos, asignación VLSM alineada, conversión bits/bytes, conjunto de puertos de inundación, desempate de ID de puerto STP, prioridad VRRP, camino mínimo en un grafo tras caída, retardo NTP y acceso a un arreglo JSON. Tres pruebas alteran claves de VLSM, camino mínimo e inundación manteniendo válida la cantidad de selecciones: el verificador independiente rechaza las tres.

Se corrigió el comando del caso LACP contrastándolo con la guía Catalyst 9300: `port-channel min-links 2`. Una URL inicial de tablas MAC devolvió 404; se localizó el capítulo real de administración del equipo. Las rutas fallidas están registradas separadamente y no se presentan como fuentes consultadas. Los casos de SVI y selección de interfaces OSPF usan capítulos de plataforma recuperados.

Los ejercicios relacionados comparten familias. Dos ejercicios heredados de shaping y consulta de un arreglo JSON se asociaron a las familias del lote; conservaron enunciados y respuestas. El lote tiene 49 familias declaradas; el total del banco es **500 candidatos, 467 familias y cero aprobaciones automáticas**. No se afirma que todas las familias sean semánticamente distintas.

## Revisión que falta antes de aprobar

1. Caso 009: la referencia aporta contexto de throughput; la conversión decimal se comprueba numéricamente. Completar la evidencia de unidades en la revisión editorial.
2. Caso 020: la guía recuperada describe exclusión de autostate, pero falta comprobar en un pasaje específico todos los requisitos predeterminados de estado de línea del modelo.
3. Caso 029: RFC 1812 da contexto de routing; falta una referencia Cisco específica para la retirada operativa de una ruta conectada al apagar su interfaz.
4. En los 50 casos: revisión técnica completa de claves y distractores, traducción ES/EN y correspondencia con el temario oficial vigente. Una consulta focalizada de una referencia no aprueba el ejercicio completo.

## Verificación de aplicación

`bash tools/cloud-setup.sh` pasó la compilación, 320 pruebas del servidor y seis de Chromium. La importación crea 50 registros pendientes; la repetición no duplica ni sobrescribe. Una prueba de integración verifica que los 50 quedan fuera de la selección puntuable. La base de desarrollo separada contiene ocho ejemplos puntuables y 200 originales pendientes; no se modificó la base SQLite heredada versionada.

El orden de continuación por fases está en [plan-revisado.md](../plan-revisado.md#orden-de-continuación-después-del-lote-04).
