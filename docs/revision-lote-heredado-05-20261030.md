# Revisión del quinto lote heredado — 30/10/2026

Se inspeccionaron las **47 pendientes** de `batch5_all.json` en ambos idiomas: enunciado, clave, opciones y todas las explicaciones. **46 tienen una versión corregida aprobada**; la 024 se aprueba sin modificar. Las 004, 005 y 030 ya aprobadas permanecen intactas. Cada original defectuoso se conserva rechazado y enlazado con su propio reemplazo validado. La revisión del lote 5 queda cerrada.

El banco vigente contiene **869 registros importables: 619 versiones validadas, 209 originales rechazados con reemplazo aprobado y 41 pendientes**. Son 660 candidatos iniciales y 209 versiones corregidas, no 869 ejercicios conceptualmente distintos. Esta ronda añade 47 versiones utilizables, sin generar otro lote de preguntas.

## Correcciones documentadas

Los cambios evitan deducir causas sin evidencia, separan configuración de garantías operativas y corrigen cálculos y ejemplos. En TCP llegan dos ACK duplicados, no tres; en STP se aportan los BID upstream que faltaban y se corrige el costo total. CoS no se confunde con DSCP ni con autenticación del teléfono. `ip ospf mtu-ignore` omite una comprobación, no repara MTU real. El caso SSH explicita la regla de intentos de la implementación documentada y usa dos reintentos para tres prompts; no se universaliza a toda versión SSH. HTTP 403 tampoco demuestra autenticación exitosa.

| Número del original | Motivo de la corrección |
|---|---|
| 001 | Ping local no comprueba TCP/UDP ni identifica por sí solo el componente físico averiado. |
| 002 | Se limita consola al hardware indicado y se elimina ubicación y controlador OS universales. |
| 003 | Solo llegan dos segmentos fuera de orden: dos ACK duplicados no alcanzan el umbral clásico de tres. |
| 006 | Incomplete puede ser una resolución pendiente, no prueba de timeout definitivo o inexistencia del host. |
| 007 | Se cuentan solo segmentos Ethernet utilizados descritos; broadcast es L2, no L3. |
| 008 | Se acota DORA IPv4 directo sin relay y no se garantizan todas las opciones DHCP en cada oferta. |
| 009 | Ausencia de registro host en caché no descarta delegaciones; se usa zona hipotética sin alias ni forwarding. |
| 010 | Se distinguen síntomas por extremo y detección paralela de negociación completa, sin exigir FCS en el mismo puerto. |
| 011 | add conserva la lista en esta opción, pero no es la única forma posible de conservar VLAN existentes ni garantiza conectividad total. |
| 012 | La tabla MAC no identifica por sí sola puertos access/trunk; se explicitan roles, envejecimiento y forwarding elegible. |
| 013 | La comparación BID determina ganador, no un tiempo instantáneo de convergencia. |
| 014 | Se corrige explicación de un comando inválido y se acota recuperación manual del puerto. |
| 015 | Se eliminan requisitos universales no demostrados sobre coste STP y QoS en todo EtherChannel. |
| 016 | Se limita Virtual Interface a la arquitectura AireOS heredada, sin atribuirla a todo WLC moderno. |
| 017 | Roaming L2 conserva subred, pero no garantiza mismas claves, ausencia de EAP ni continuidad instantánea de llamada. |
| 018 | El exhibit no demostraba el BID vecino y tenía costes incompatibles; se aportan vectores completos y se corrige orden de desempate. |
| 019 | El desajuste nativo no prueba bloqueo universal de todo el troncal; se centra en corregir IDs. |
| 020 | Se explicita prioridad extendida y se distingue CoS de DSCP y confianza de autenticación del teléfono. |
| 021 | La salida sola no demuestra ECMP ni selección por puertos; se aportan RIB y política de hash verificadas. |
| 022 | Se separa selección RIB por AD de búsqueda de prefijo en reenvío. |
| 023 | mtu-ignore omite validación del campo MTU, no corrige MTU real ni garantiza FULL. |
| 025 | OSPF ya está habilitado; pasiva no origina Tipo1 hacia todas las áreas ni comando garantiza adyacencia. |
| 026 | Se limita retiro a la ruta totalmente especificada mostrada, sin prometer detección universal de fallos remotos. |
| 027 | Se explicita área normal y ruta instalada; network habilita interfaces lógicas también, no redistribuye prefijos. |
| 028 | Se corrige cabecera parcial y se separa AD de coincidencia IPv6. |
| 029 | Tipo2 también existe en NBMA; LinkID es IP del DR y ausencia Tipo5 no demuestra rol ASBR imposible. |
| 031 | Se explicita routing IPv4 habilitado y se evita confundir resolución RIB con prueba de conectividad ARP. |
| 032 | Cuatro caminos y hash se dan como configuración verificada, no defaults universales ni garantía de orden. |
| 033 | Se distingue split horizon simple de poison reverse y no se universalizan holddown o prevención completa. |
| 034 | NAT invierte roles, pero no se promete diagnóstico único sin supuestos de routing/tráfico ni ISP real en TESTNET. |
| 035 | Se configura helper por ingeniero; giaddr selecciona subred bajo supuestos explícitos, no garantiza concesión. |
| 036 | Stratum16 significa estado NTP no sincronizado, no error medido, precisión ni causa concreta. |
| 037 | Severidad3 no demuestra fallo imprevisto de hardware ni necesidad universal de intervención. |
| 038 | Se delimita CoS/CDP clásico compatible y se quitan garantías contra todo abuso de prioridad o reescritura DSCP. |
| 039 | ACL clasifica puertos, no protocolo de aplicación cifrado; se conserva alcance origen de permisos. |
| 040 | Secure-down y contador solos no prueban causa; se añaden errdisable y MAC autorizada verificados. |
| 041 | La implementación documentada cuenta reintentos más intento inicial: dos reintentos dan tres prompts. |
| 042 | QM_IDLE y contadores0 no prueban fallo fase2; se agrega negociación IKEv1 actual sin propuesta ESP común. |
| 043 | RADIUS transporta EAP, no trama EAPOL entera; se precisan roles sin imponer AD o respuesta universal. |
| 044 | Fallback es ERROR del grupo completo, no rechazo de credenciales ni fallo de un único servidor entre varios. |
| 045 | IDS fuera de banda no implica alerta siempre posterior a entrega; IPS puede prevenir, sin garantía absoluta. |
| 046 | 403 no demuestra identidad autenticada; respuesta401 se identifica extracto con challenge omitido. |
| 047 | Se compara modos concretos; Puppet compila catálogos de manifests y no todos los usos son agent/push universales. |
| 048 | Se delimita Velocity y workflow manual/CSV; sustitución no garantiza validez IOS ni transporte NETCONF. |
| 049 | Se aporta fixture explícito, TLS/credenciales seguros y se distingue enabled administrativo de operativo y default omitido. |
| 050 | pyATS es framework, no simulador; CI/CD reduce riesgo sin garantizar detección ni exigir todo push a producción. |

El script RESTCONF usa credenciales de entorno, validación TLS y timeout; se comprueba el estado HTTP antes de interpretar JSON. El fixture distingue `enabled:false`, `enabled:true` y hoja omitida. Esta última tiene default YANG true según RFC 7223, aunque `dict.get` devuelve None y el filtro mostrado la omite. Habilitación administrativa no equivale a interfaz operativamente up.

## Evidencia y validación

La [ronda congelada](../server/prisma/reviews/batch5-20261030.json) contiene 93 decisiones explícitas y 50 referencias primarias con hash y posición del pasaje. El manifiesto acumulado reúne 221 referencias. El [resultado reproducible](validacion-lote-05-20261030.json) incluye siete escenarios: ACK acumulativo, desempate STP, rutas IPv4 e IPv6, matriz de paquetes ACL, regla de reintentos SSH y ejecución real de ambos snippets Python RESTCONF con transporte simulado y sin red. Se contrastan Cisco/RFC y fuentes oficiales de Puppet, Ansible y Snort; no se confunde un índice o HTTP exitoso con evidencia sustantiva.

**622 pruebas de servidor en 14 archivos y 22 de Chromium aprobadas**. Se comprueban upgrades desde las entregas anteriores, incluida la de 572 aprobaciones, preservación del contenido original, rechazo de sobrescrituras locales, auditoría, repetición idempotente y simulacro de 100 familias aprobadas distintas. Tipado estricto y compilación del servidor correctos. Auditoría estructural: 869 recibidas, cero rechazos estructurales y cero duplicados exactos; el manifiesto editorial 619/41/209 se verifica y se reconstruye idéntico byte a byte.

La base aislada nueva `cloud-reviewed-fifth.db` tiene **877 registros: 627 validados, 209 rechazados y 41 pendientes; 544 familias declaradas validadas y 828 auditorías asistidas**. Incluye ocho ejemplos del seed no recertificados en esta ronda. Repetir la aplicación crea cero preguntas y aplica cero decisiones; se conservan las bases anteriores. No se modifica la base SQLite de tu equipo mediante un commit.

Estas son comprobaciones asistidas y ejemplos calculados/ejecutados en Python. No se ejecutaron IOS, WLC, servidores SSH ni solicitudes a un dispositivo RESTCONF real; tampoco se afirma certificación humana o de Cisco.

## Pendientes vigentes

| Grupo | Pendientes |
|---|---:|
| Segundo lote: conectividad IP | 9 |
| Segundo lote: fundamentos de red | 9 |
| Segundo lote: acceso a red | 8 |
| Segundo lote: seguridad | 7 |
| Segundo lote: servicios IP | 5 |
| Parser Views y Meraki del lote 4 | 2 |
| Agile del lote 6 | 1 |
| **Total** | **41** |

Las tres retenciones documentales conservan su estado y los borradores Meraki/Agile siguen fuera del banco importable. Las otras 38 requieren cerrar revisión técnica; no se aprueban por pasar esquema. Siguen abiertos los pendientes propios de cobertura y deduplicación semántica. El banco completo aún no está terminado.

Para actualizar la base de tu PC, primero descarga esta rama y actualiza la copia desde la que ejecutas el simulador. Desde `server`, ejecuta `npm run db:sync-reviewed` para ver la previsión y `npm run db:sync-reviewed -- --apply` para aplicar. El importador preserva contenido local y rechaza conflictos; no se recomienda resetear tu base.
