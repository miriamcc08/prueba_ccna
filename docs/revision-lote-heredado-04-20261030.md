# Revisión del cuarto lote heredado — 30/10/2026

Se inspeccionaron las 48 preguntas pendientes del lote 4 en ambos idiomas, incluidas alternativas y explicaciones. Se cerraron 46: siete sin cambios y 39 mediante versiones corregidas. Las otras dos conservan retención documental. También se resolvieron las dos retenciones del lote 3 mediante preguntas corregidas con inferencias explícitamente acotadas.

Resultado acumulado: **779 registros importables: 520 versiones validadas, 119 originales rechazados con su propio reemplazo validado y 140 pendientes**. Son 660 candidatos iniciales y 119 correcciones, no 779 ejercicios independientes. Se conserva la familia y el contenido histórico; las versiones rechazadas no participan en exámenes nuevos.

## Correcciones aprobadas

Cada fila identifica la versión `-review-r1`; el original se conserva y queda enlazado en el manifiesto.

| Original | Corrección |
|---|---|
| `ccna-legacy-batch4_all-001` | Se distingue el recuento didáctico de segmentos de las colisiones reales; los enlaces full-duplex no usan CSMA/CD. |
| `ccna-legacy-batch4_all-002` | Se explicita que el destino está en otro puerto elegible; un destino en el propio puerto de entrada se filtra. |
| `ccna-legacy-batch4_all-003` | Autonegociar con un equipo half-duplex no implica caer en full-duplex; se establecen los modos observados y se evita exigir FCS en el mismo extremo. |
| `ccna-legacy-batch4_all-004` | Se distingue goodput de throughput y se evita atribuir causas no medidas a la diferencia de tasas. |
| `ccna-legacy-batch4_all-005` | Se explicitan excepciones ICMP y se evita confundir PMTUD con renegociar el MSS TCP. |
| `ccna-legacy-batch4_all-006` | La asignación multicast de Clase D se contrasta con RFC1112; se elimina la atribución histórica incorrecta a RFC790 y rangos ajenos imprecisos. |
| `ccna-legacy-batch4_all-009` | Se delimita NAT64 con estado sin atribuir estado obligatorio a todas las variantes de traducción. |
| `ccna-legacy-batch4_all-012` | Flooding solo por puertos elegibles en forwarding; no garantiza entrega ni excluye políticas explícitas de supresión. |
| `ccna-legacy-batch4_all-013` | Se explicita etiquetado nativo deshabilitado y VLAN permitida; no se promete reenvío cuando la VLAN esté bloqueada. |
| `ccna-legacy-batch4_all-014` | Se crea la VLAN antes de la SVI, se añaden exits de submodo y se explicitan autostate y routing deshabilitado. |
| `ccna-legacy-batch4_all-015` | Un plano de control unificado no equivale a una única instancia STP ni a exactamente una IP total. |
| `ccna-legacy-batch4_all-016` | 50 segundos es el modelo con espera Max Age completa, no la duración universal de toda falla indirecta. |
| `ccna-legacy-batch4_all-017` | Una BPDU superior no requiere necesariamente menor prioridad configurada; la recuperación no es instantánea. |
| `ccna-legacy-batch4_all-018` | HA SSO reduce interrupciones para estados sincronizados compatibles; no garantiza cero pérdidas ni preservar cualquier cliente. |
| `ccna-legacy-batch4_all-019` | Una RU agrupa subportadoras; 802.11ac también admite paralelismo espacial MU-MIMO. |
| `ccna-legacy-batch4_all-020` | Option43 no asigna IP ni DNS; SSC significa self-signed certificate y un fallo de certificado no prueba por sí solo un error de reloj. |
| `ccna-legacy-batch4_all-021` | Una estática no llega como actualización de protocolo; se explicitan las cuatro rutas candidatas válidas y la resolución del siguiente salto. |
| `ccna-legacy-batch4_all-022` | No se garantiza búsqueda más rápida ni que cualquier cambio de componente deje de propagarse. |
| `ccna-legacy-batch4_all-023` | Se especifica un solo ABR y se corrige que todas las clases de LSA deban atravesar el backbone. |
| `ccna-legacy-batch4_all-024` | Un router interno también puede pertenecer al backbone; un ASBR en NSSA origina Tipo7 y puede ser además ABR. |
| `ccna-legacy-batch4_all-025` | Se explicita ausencia de costos manuales y se distingue escala consistente recomendada de requisito del protocolo. |
| `ccna-legacy-batch4_all-026` | Se evita afirmar que toda adyacencia atraviesa obligatoriamente Loading y todos los estados enumerados. |
| `ccna-legacy-batch4_all-027` | Los orígenes de información OSPF no se equiparan necesariamente a vecinos directos; network no anuncia todo el rango del comando. |
| `ccna-legacy-batch4_all-029` | PBR no elimina requisitos de resolución ni garantiza ignorar la RIB; RPKI valida pares prefijo-origen, no solo AS registrados. |
| `ccna-legacy-batch4_all-031` | Se excluyen reflectores, confederaciones y excepciones allowas-in para que la regla iBGP no sea un nunca universal. |
| `ccna-legacy-batch4_all-032` | No shutdown no demuestra up/up; se evita fecha universal de introducción de L y entrega CPU incondicional. |
| `ccna-legacy-batch4_all-035` | Option150 está normalizada en RFC5859; no es exclusivamente propietaria de Cisco ni Option66 un estándar IEEE. |
| `ccna-legacy-batch4_all-036` | Se delimita a transportes UDP tradicionales y se reconoce estructura de Syslog y alternativas TLS. |
| `ccna-legacy-batch4_all-037` | Se usa neighbors detail para los campos solicitados y no se generalizan defaults LLDP o ajustes por interfaz. |
| `ccna-legacy-batch4_all-038` | Se fijan el camino de la sonda y un respaldo resoluble; fallo ICMP no prueba toda disponibilidad ni conmutación instantánea. |
| `ccna-legacy-batch4_all-039` | Inspeccionar el payload HTTPS requiere terminación/descifrado TLS apropiado y no garantiza bloquear toda vulnerabilidad. |
| `ccna-legacy-batch4_all-040` | Una CAM llena no hace inundar todo unicast por todos los puertos; se conserva aislamiento VLAN y destinos conocidos. |
| `ccna-legacy-batch4_all-041` | Los hosts estáticos pueden tener entradas manuales; una ACL ARP es una solución, no una exigencia universal para todo host estático. |
| `ccna-legacy-batch4_all-042` | Al retirar la etiqueta exterior queda la interior; se evita decir que la trama queda sin etiquetas y luego conserva otra. |
| `ccna-legacy-batch4_all-043` | El tamaño RSA no selecciona por sí solo SSHv1/v2; se completa hostname y se evitan credenciales predeterminadas reutilizables. |
| `ccna-legacy-batch4_all-045` | Se distingue BPDU filtering por interfaz del modo global PortFast y se elimina garantía total de storm control. |
| `ccna-legacy-batch4_all-046` | YAML también admite colecciones flow con llaves y corchetes; JSON conserva espacios dentro de cadenas. |
| `ccna-legacy-batch4_all-048` | Git registra intención versionada y pruebas reducen riesgo; no certifican ausencia de fallos ni son todas simuladores. |
| `ccna-legacy-batch4_all-050` | Se especifica PATCH simple RFC8040 sobre un recurso compuesto JSON; PUT sobre una hoja también podría modificar solo esa hoja. |
| `ccna-legacy-batch3_all-019` | Se corrige la inversión PVID/local y se limita la pregunta a diagnosticar/corregir VLAN nativas diferentes; el alcance del bloqueo se da como observación, no como regla universal inferida. |
| `ccna-legacy-batch3_all-030` | Se acota la conclusión a medición ICMP frente a disponibilidad HTTP; el estado de tracking y la RIB son datos observados y no se presenta validación de CLI no realizada. |

Sin cambios de contenido: lote 4, preguntas **10, 11, 28, 30, 33, 34 y 49**. Las preguntas 7 y 8 ya aprobadas previamente no se modifican.

## Alcance y evidencia

La ronda [batch4-20261030.json](../server/prisma/reviews/batch4-20261030.json) registra 48 aprobaciones y 41 rechazos enlazados, más dos retenciones. Incluye 45 referencias primarias y pasajes normalizados con SHA-256 y posición; el manifiesto acumulado reúne 198 referencias. El generador vuelve a verificar hashes de preguntas, claves explícitas y pasajes. No se usa una respuesta marcada como correcta para justificar automáticamente su aprobación.

Se añadieron siete comprobaciones independientes: temporizadores STP bajo supuestos explícitos, AD para el mismo prefijo, cociente OSPF, lectura del resumen de protocolo, resolución recursiva desde el exhibit, longest-prefix IPv6 y ejemplo DNS64. El acumulado tiene 147 preguntas con cálculo/escenario ejecutable y 373 con revisión documental. Esto no emula IOS ni afirma certificación humana o de Cisco.

Las antiguas retenciones del lote 3 se resolvieron cambiando el alcance: el estado PVID observado y el retiro de rutas por tracking son datos del laboratorio descrito. No se afirma haber demostrado un algoritmo universal de bloqueo por VLAN ni haber ejecutado una combinación CLI IPv4/IP SLA en hardware. Los borradores anteriores permanecen históricos, con contenido diferente de las versiones aprobadas.

## Pendientes explícitos

- Lote 4, 44: falta el pasaje primario focalizado de Parser Views; la fuente sobre niveles de privilegio no basta para certificar toda la comparación.
- Lote 4, 47: la documentación Meraki consultada rechaza acceso. La corrección propuesta sobre administración cloud y reenvío local sigue fuera del banco importable.
- Lote 6: 48 pendientes; se inspeccionaron ES/EN y se guardaron 40 propuestas corregidas y ocho candidatas sin cambios. Todavía faltan cierre documental y pruebas antes de aprobarlas.
- Lote 5: 47 pendientes. Se inspeccionaron inicialmente 1, 2, 3 y 6–12; la tercera contiene solo dos ACK duplicados y no alcanza el umbral clásico de tres. No se aprueba este material por su revisión parcial.
- Segundo lote: 43 pendientes repartidas por área.

Las [41 propuestas restantes](propuestas-cierre-heredadas-20261030.json) son borradores, no preguntas aprobadas ni entradas importables. No se crea material adicional para aumentar el contador.

## Validación

Las **615 pruebas de servidor en 14 archivos** pasan, incluida la migración desde 131, 366, 420, 426 y 472 aprobaciones, integridad de contenido previo, auditoría, idempotencia, borradores fuera de exámenes y simulacro de 100 familias distintas. Compilación del servidor y tipado estricto de herramientas de revisión correctos. Auditoría estructural: 779 recibidas, sin errores estructurales ni duplicados exactos; manifiesto 520/140/119 verificado. La reconstrucción del manifiesto coincide byte a byte.

La primera ejecución de Chromium pasó 21/22: el test de desconexión podía cortar la red durante la recarga, confundir el error de carga con vencimiento y esperar el avance antes del plazo. Se añadió una espera por la recuperación del contador antes de desconectar; no se cambió la lógica del producto. La repetición con el contenido definitivo pasó **22/22 pruebas de Chromium**.

Carga aislada nueva: `/workspace/.ccna-runtime/server/prisma/cloud-reviewed-batch4.db`, **787 preguntas, 528 validadas, 119 rechazadas, 140 pendientes y 450 familias declaradas validadas**. Incluye los ocho ejemplos del seed, no recertificados en esta ronda. Se generaron 639 auditorías asistidas. Repetir `--apply` crea cero preguntas y aplica cero decisiones. Se conservan las bases anteriores.

GitHub no actualiza automáticamente la base SQLite de Windows. `npm run db:sync-reviewed` desde `server` muestra la previsión; `npm run db:sync-reviewed -- --apply` aplica solo las decisiones explícitas y rechaza sobrescribir contenido local incompatible. No se creó un administrador interactivo: la cuenta de auditoría continúa bloqueada para login.

El banco **todavía no está terminado**. La cobertura ponderada, la deduplicación semántica completa y otros pendientes funcionales conservan sus criterios de cierre.
