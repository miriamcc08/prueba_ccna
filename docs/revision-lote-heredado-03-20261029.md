# Revisión del tercer lote heredado — 29/10/2026

Se inspeccionaron los **48 candidatos pendientes** de `batch3_all.json`, incluidos enunciados, claves, distractores, explicaciones generales y traducción ES/EN. **46 tienen una versión aprobada: nueve sin cambios y 37 corregidas**. Las otras dos conservan una retención documental explícita. Las preguntas 7 y 9 ya tenían aprobación aritmética previa y no se alteraron.

El banco completo todavía no está terminado: el manifiesto acumula **472 versiones aprobadas, 78 originales rechazados con reemplazo y 188 pendientes**. De las pendientes, dos son las retenciones de esta tanda y 186 requieren completar su revisión técnica. Los 738 registros incluyen versiones: no son 738 ejercicios independientes ni una certificación Cisco o humana.

## Correcciones realizadas

Cada revisión tiene ID del original más `-review-r1`, conserva la familia asignada (o usa el ID del original si no tenía familia), y se vincula por `supersedesQuestionId`. Los originales permanecen con su contenido anterior y se rechazan solo cuando existe su reemplazo aprobado. Ninguna pregunta nueva trata un concepto distinto del candidato corregido.

| Pregunta de `batch3_all.json` | Corrección de la versión aprobada |
|---|---|
| 001 | Se delimita store-and-forward y se corrige la negación de control de flujo Ethernet y el absoluto sobre cut-through. |
| 002 | Se limitan los puertos de flooding a los autorizados y en forwarding; no basta pertenecer a la VLAN. |
| 003 | Se distingue ARP Probe (emisor 0.0.0.0) de ARP Announcement y se elimina la garantía de caché vacía por ser la primera sesión HTTP. |
| 004 | Se limita la nomenclatura didáctica a TCP/IPv4/Ethernet; segmento no es el nombre universal de todas las PDU de transporte. |
| 006 | Se explicitan las condiciones para generar ICMP; no se envía un error ICMP para todo paquete descartado por TTL. |
| 008 | M=1 no desactiva SLAAC; O es redundante con M=1 y RA es multicast, no broadcast IPv6. |
| 010 | Se corrige que unir transmisores cause necesariamente una colisión y se delimita a puertos MDI 100BASE-TX. |
| 011 | VTPv2 transparente reenvía anuncios sin la condición de dominio afirmada; se evita generalizar el almacenamiento vlan.dat. |
| 013 | a-half no demuestra el dúplex remoto; se separa el dato observado de la hipótesis de mismatch. |
| 014 | Full duplex no implica reducir siempre a la mitad el ancho de banda; los routers también pueden tener aceleración por hardware. |
| 016 | Se evita afirmar que un puerto administrativamente deshabilitado necesariamente procesa BPDU. |
| 017 | Se retiran el número universal de canales y la garantía de ausencia de contención; dependen de regulación, DFS y diseño RF. |
| 018 | Se separa definir perfiles de aplicarlos al AP y se añaden salidas de submodo a la secuencia CLI. |
| 021 | Classless no significa link-state y multicast no define la clasificación; RIPv2 sigue siendo vector distancia. |
| 022 | La topología original no garantizaba ECMP ni blackhole; se define un tercer router y la ausencia de prefijos específicos. |
| 024 | Se explicita que la interfaz está up y habilitada en OSPF para conservar el anuncio del prefijo. |
| 025 | Se evita decir que E2 ignora siempre el costo interno y que toda redistribución EIGRP exige métrica explícita. |
| 026 | Se limita a enlaces físicos RFC5340; enlaces virtuales y extensiones posteriores invalidan los absolutos de direcciones y autenticación. |
| 027 | Se elimina la afirmación de que una default de cualquier origen basta y se limita a un área normal sin route-map. |
| 028 | CEF no elimina la resolución recursiva del plano de control ni garantiza hardware o un único acceso físico. |
| 029 | Se sustituyen MAC multicast inválidas para interfaces unicast y se explicita ausencia de NAT y túneles. |
| 032 | Se explicita una elección sin DR/BDR previo y con todos los vecinos conocidos; se corrige el RID máximo y la no preempción. |
| 033 | Se añade alcanzabilidad independiente del siguiente salto y rango AD elegible; no es un monitor de servicio extremo a extremo. |
| 034 | Misses no prueba agotamiento; se añade la verificación de ocupación y se retira la garantía de solución permanente o capacidad infinita. |
| 035 | Discover no equivale siempre a concesión completa; se explicita rate-limit configurado y que chaddr coincidente no detiene toda suplantación. |
| 036 | DNS puede integrarse con health checks; round-robin por sí solo no los aporta ni garantiza fallo hasta expirar TTL. |
| 037 | Stratum cuenta niveles de sincronización, no saltos IP ni precisión garantizada; se identifica el receptor GPS como referencia. |
| 038 | Se evita garantizar copia exacta sin pérdidas y se explicita comportamiento SPAN de destino por defecto. |
| 041 | Se delimita Telnet básico y se exige autenticar la clave del servidor SSH para proteger contra MITM. |
| 042 | El costo de ACL log depende de plataforma y agregación; no todo hit implica punt ni un syslog por paquete. |
| 044 | Un policer no garantiza ancho de banda legítimo ni toda plataforma tiene data plane ASIC. |
| 045 | SAE no sustituye el 4-way handshake y la protección no es una garantía absoluta frente a implementaciones vulnerables o modo transición. |
| 046 | NETCONF y RESTCONF son protocolos de gestión de aplicación, no la capa de transporte; commit requiere capacidad candidate. |
| 047 | Se eliminan retención fija, precisión al segundo y diagnóstico determinista; SNMP sí puede almacenarse históricamente. |
| 048 | Se corrigen contenedor/lista operativa, TLS inseguro y credenciales fijas; Accept negocia y no garantiza respuesta JSON válida. |
| 049 | Idempotencia no garantiza seguridad total ni elimina por sí sola drift ajeno; se precisa estado gestionado y entradas constantes. |
| 050 | Cambiar la URI no garantiza compatibilidad; hay que mantener el contrato v1 durante el período anunciado. |

La pasada final de distractores también distingue que YANG puede modelar BGP sin establecer sesiones, que la idempotencia no exige un estilo de programación único ni garantiza seguridad total, y que la existencia de una SVI no sustituye definir su VLAN. Se evitan afirmaciones universales de hardware, precisión RF o comportamiento de todas las plataformas.

Aprobadas sin cambiar contenido: **5, 12, 15, 20, 23, 31, 39, 40 y 43** (ventana TCP, PVLAN, costos STP, LACP, LSA interárea, LPM, defaults ZBFW, roles 802.1X y envejecimiento por inactividad).

## Retenciones que siguen abiertas

| Pregunta | Hallazgo y condición para cerrar |
|---|---|
| 19 — VLAN nativa/PVID | El log atribuido a SW-1 invierte el PVID remoto y la VLAN local; la explicación confunde PVID-inconsistent y type-inconsistent. Falta un pasaje primario focalizado que confirme el alcance de bloqueo por VLAN. |
| 30 — IP SLA y ruta de respaldo | Hay que explicitar alcanzabilidad independiente del siguiente salto secundario y evaluación después del timeout/convergencia. Falta cerrar el pasaje primario para la combinación IPv4/IP SLA/track; una guía de IPv6 y un índice no bastan. |

Las dos propuestas están en [propuestas-batch3-fuentes-20261029.json](propuestas-batch3-fuentes-20261029.json), marcadas **draft_not_approved_not_imported**. Permanecen fuera de `server/prisma/questions`, del manifiesto de aprobación y de los exámenes. No se aprueba una pregunta porque su enlace HTTP responda 200: también se verificó que varios enlaces devolvían índices sin el contenido necesario.

## Evidencia y comprobaciones

- `server/prisma/reviews/batch3-20261029.json` congela 85 decisiones: 46 aprobaciones, 37 rechazos con reemplazo y dos retenciones. Registra claves esperadas explícitas y 52 referencias primarias, con SHA-256, posición y longitud de los pasajes consultados.
- El manifiesto acumulado contiene 174 entradas URL/SHA. Se conserva una lista explícita de decisiones; no se aprueban automáticamente los candidatos que pasan un esquema de datos.
- `tools/check-reviewed-batch3-scenarios.py` añade diez derivaciones independientes: caminos STP, modos LACP, pérdida de información al resumir, MAC unicast y reescritura Ethernet, LPM, elección OSPF nueva, capacidad NAT uno a uno, niveles NTP, inactividad MAC y lista JSON de YANG. No emula IOS ni prueba comandos sobre equipo Cisco.
- Hay 140 versiones aprobadas con comprobación ejecutable y 332 con contraste documental. La revisión asistida se identifica como tal, sin inventar aprobación humana.

**612 pruebas de servidor en 14 archivos y 22 pruebas de Chromium aprobadas con el contenido definitivo.** Incluyen carga desde las entregas históricas de 131, 366, 420 y 426 aprobaciones; conservación de hashes de originales; auditoría/idempotencia; exclusión de borradores y pendientes; y un examen real de 100 familias aprobadas distintas. Tipado estricto y compilación del servidor correctos. La auditoría estructural recibe 738 candidatos, sin errores estructurales ni duplicados exactos, y verifica por separado el manifiesto editorial 472/188/78.

## Aplicación y base de verificación

Desde `server`, `npm run db:sync-reviewed` muestra la previsión y `npm run db:sync-reviewed -- --apply` aplica las decisiones. Al actualizar desde las 426 aprobaciones publicadas, se añaden 37 versiones, 46 aprobaciones y 37 rechazos. Se mantiene la protección frente a ediciones o decisiones editoriales incompatibles. Repetir la aplicación no crea auditorías duplicadas ni restaura decisiones cambiadas por otro revisor.

La carga final desde cero se verificó en la nueva SQLite aislada `/workspace/.ccna-runtime/server/prisma/cloud-reviewed-batch3.db`, conservando la SQLite de ejecución previa. Cuatro migraciones y el seed se aplicaron correctamente. Esta base contiene **746 registros: 480 validados (472 del manifiesto y ocho del seed), 78 rechazados y 188 pendientes; 403 familias validadas declaradas**. No se creó una cuenta administradora interactiva. Los ocho ejemplos del seed no reciben una nueva certificación técnica por esta tanda.

GitHub y la nube no actualizan automáticamente la SQLite del equipo Windows. Las decisiones se reciben al actualizar archivos y ejecutar la sincronización en la instalación correspondiente. La deduplicación semántica completa y el mapa oficial de subobjetivos/pesos siguen pendientes en [la lista de cierre](pendientes-cierre.md).
