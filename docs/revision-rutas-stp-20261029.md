# Revisión asistida de rutas y STP — 29/10/2026

Esta ronda resuelve seis candidatos pendientes del segundo lote heredado. No cierra todo el banco: **234 candidatos siguen pendientes de revisión técnica integral**. Las cifras anteriores se conservan en [el informe de la tercera ronda](revision-heredadas-20261029.md).

| Candidato heredado | Decisión | Resultado comprobado |
|---|---|---|
| `batch2_ip_connectivity`, 1 | Original rechazado; revisión aprobada | EIGRP interno, AD 90, se prefiere a OSPF 110 y RIP 120 para el mismo prefijo. El extracto tenía cinco /24 pero decía dos máscaras; se corrigió a una. Se retiró la afirmación universal incorrecta de que ECMP solo puede usar un protocolo. |
| `batch2_ip_connectivity`, 3 | Original rechazado; revisión aprobada | Estática AD 90 reemplaza OSPF 110, siguiente salto 10.1.1.254. Se explicita ausencia de rutas más específicas/PBR y que AD 255 impide instalar la ruta. Resolver el siguiente salto no prueba conectividad extremo a extremo. |
| `batch2_ip_connectivity`, 4 | Aprobada sin cambiar contenido | El destino 172.16.25.100 coincide con 172.16.24.0/22, siguiente salto 10.0.3.2, Gi0/3. No coincide con /23. |
| `batch2_ip_connectivity`, 5 | Aprobada sin cambiar contenido | 10.40.12.180 coincide con 10.40.12.128/26, no con la estática 10.40.12.192/27. |
| `batch2_network_access`, 7 | Original rechazado; revisión aprobada | Prioridad y extensión: 4096 OR 45 = 4141. Configurar 4096 no garantiza ser raíz. Se distingue la extensión de 12 bits de las VLAN utilizables 1–4094; 4095 está reservado. |
| `batch2_network_access`, 8 | Aprobada sin cambiar contenido | El camino B–C–A cuesta 8, frente a 19 directamente. Fa0/1 de B queda alternate/discarding. |

Se inspeccionaron enunciados, claves, alternativas y explicaciones en ambos idiomas. Las tres correcciones son versiones del mismo ejercicio, con familia conservada; los originales no se borran ni se sobrescriben. No se añadieron conceptos nuevos.

## Evidencia y reproducción

- `server/prisma/reviews/routing-20261029.json`: nueve decisiones explícitas (seis aprobaciones, tres rechazos), referencias primarias Cisco/RFC 1812 y pasajes con posición, longitud y SHA-256.
- `server/prisma/questions/reviewed_routing_corrections_20261029.json`: tres versiones corregidas vinculadas a sus originales.
- `tools/check-reviewed-legacy-scenarios.py`: seis comprobaciones nuevas; 19 en total. Deriva coincidencias IP de los prefijos del exhibit en ES/EN, compara AD, combina bits de prioridad y enumera caminos del grafo STP. Estos cálculos no equivalen a emular Cisco IOS.
- `tools/build-reviewed-bank-report.py`: incorpora únicamente la lista revisada y comprueba hashes de contenido, claves y pasajes. Una prueba estructural correcta no aprueba el resto del banco.

Inventario versionado: **701 registros; 426 aprobados, 41 rechazados con reemplazo aprobado y 234 pendientes**. La copia de nube, con ocho ejemplos del seed, tiene **709 registros; 434 validados, 41 rechazados y 234 pendientes; 358 familias validadas distintas**. Las cifras cuentan versiones; no son 701 ejercicios independientes ni certificación de Cisco.

Aplicación desde `server`: `npm run db:sync-reviewed` permite ver la previsión; `npm run db:sync-reviewed -- --apply` aplica las decisiones. Desde la entrega anterior añade tres versiones, seis aprobaciones y tres rechazos. Las modificaciones editoriales incompatibles cancelan la operación. Repetirla no debe duplicar auditorías ni cambiar decisiones posteriores de otro revisor. La PC del usuario requiere actualizar los archivos y aplicar el comando; GitHub y la nube no actualizan su SQLite automáticamente.

## Validación

609 pruebas del servidor aprobadas, incluida una prueba nueva de actualización desde las 420 aprobaciones publicadas: conserva hashes del contenido original, valida las tres versiones nuevas y comprueba auditoría/idempotencia. Las 22 pruebas de Chromium también pasaron, incluido iniciar un examen real de 100 preguntas aprobadas y sin familias repetidas. Tipado estricto del importador y compilación del servidor correctos. La auditoría estructural recibió 701 candidatos, sin duplicados exactos ni fallos estructurales; verificó por separado el manifiesto editorial 426/234/41. La deduplicación semántica y las restantes 234 revisiones técnicas siguen abiertas.
