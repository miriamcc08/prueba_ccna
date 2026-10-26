# Lote original: original-20261024-b02-50

Estado: **pendiente de revisión técnica y de traducción**. El estado de consulta y la evidencia de cada referencia figuran en el JSON. Las comprobaciones ejecutables de cálculo/escenario y la consulta documental no constituyen aprobación editorial completa.

Los ejercicios relacionados comparten familia y no se cuentan como conceptos independientes. La equivalencia semántica con todo el banco sigue en revisión. El texto se creó para el proyecto.

| Área | Preguntas |
|---|---:|
| network_fundamentals | 10 |
| network_access | 10 |
| ip_connectivity | 13 |
| ip_services | 5 |
| security_fundamentals | 7 |
| automation_programmability | 5 |

El reparto de 50 requiere redondear los medios puntos de IP Connectivity y Security Fundamentals; no se afirma aquí haber confirmado la versión vigente del temario.

## 1. ipv6-solicited-node-derivation

ID: `ccna-original-20261024-b02-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una interfaz IPv6 tiene 2001:db8::1234:5678. ¿Qué dirección multicast solicited-node corresponde a esta dirección unicast?

- **A.** ff02::1:ff12:3456
- **B.** ff02::1:ff34:5678
- **C.** ff05::1:ff34:5678
- **D.** ff02::2

**Respuesta(s) propuesta(s): B.** Añade los 24 bits bajos de la dirección unicast a ff02::1:ff00:0/104. Los últimos 24 bits son 34:5678, de modo que resulta ff02::1:ff34:5678; el alcance sigue siendo de enlace local.

**English**

An IPv6 interface owns 2001:db8::1234:5678. Which solicited-node multicast address corresponds to this unicast address?

- **A.** ff02::1:ff12:3456
- **B.** ff02::1:ff34:5678
- **C.** ff05::1:ff34:5678
- **D.** ff02::2

Append the low-order 24 bits of the unicast address to ff02::1:ff00:0/104. The final 24 bits are 34:5678, yielding ff02::1:ff34:5678; the scope remains link-local.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · 2.7.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 2. modified-eui64-construction

ID: `ccna-original-20261024-b02-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un laboratorio usa expresamente EUI-64 modificado para derivar un identificador de interfaz de la MAC 00:25:96:12:34:56. Expresando cuatro hextetos de cuatro dígitos cada uno, ¿qué identificador resulta?

- **A.** 0025:9612:3456:0000
- **B.** 0225:96ff:fe12:3456
- **C.** 0025:96ff:fe12:3456
- **D.** 0225:9612:fffe:3456

**Respuesta(s) propuesta(s): B.** Inserta ff:fe entre las mitades de la MAC e invierte el bit universal/local del primer octeto: 00 XOR 02 = 02. Se describe la derivación indicada, no una obligación de que los hosts modernos usen identificadores derivados de la MAC.

**English**

A lab explicitly uses modified EUI-64 to derive an interface identifier from MAC 00:25:96:12:34:56. Expressing four hextets with four digits each, what identifier results?

- **A.** 0025:9612:3456:0000
- **B.** 0225:96ff:fe12:3456
- **C.** 0025:96ff:fe12:3456
- **D.** 0225:9612:fffe:3456

Insert ff:fe between the MAC halves and invert the universal/local bit in the first octet: 00 XOR 02 = 02. This describes the specified derivation, not a requirement that modern hosts use MAC-derived identifiers.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · Appendix A · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 3. ipv6-router-packet-too-big

ID: `ccna-original-20261024-b02-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un router IPv6 recibe un paquete de 1600 bytes para un enlace de salida con MTU 1500. ¿Cuál es la respuesta IPv6 normal si no puede reenviarlo con ese tamaño?

- **A.** Descartarlo y devolver ICMPv6 Packet Too Big
- **B.** Convertir automáticamente el paquete a IPv4
- **C.** Fragmentarlo en el router de tránsito
- **D.** Borrar el bit DF IPv6 y reenviarlo sin cambios

**Respuesta(s) propuesta(s): A.** La fragmentación IPv6 corresponde al origen, no a los routers de tránsito. El router informa de la MTU limitante mediante ICMPv6 Packet Too Big para que el origen se ajuste. IPv6 no tiene un bit DF como IPv4.

**English**

An IPv6 router receives a 1600-byte packet for an outgoing link with MTU 1500. What is the normal IPv6 response when it cannot forward the packet at that size?

- **A.** Discard it and return an ICMPv6 Packet Too Big message
- **B.** Convert the packet to IPv4 automatically
- **C.** Fragment it in the forwarding router
- **D.** Clear the IPv6 DF flag and forward it unchanged

IPv6 fragmentation is performed by source nodes, not forwarding routers. The router reports the limiting MTU with ICMPv6 Packet Too Big so the source can adjust. IPv6 has no IPv4-style DF flag.

Referencia: https://www.rfc-editor.org/rfc/rfc8200.txt · 5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 4. ipv4-df-path-mtu

ID: `ccna-original-20261024-b02-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un paquete IPv4 mide 1600 bytes en total y tiene DF=1. Un router tendría que enviarlo por un enlace de MTU 1500. ¿Qué acción permite Path MTU Discovery?

- **A.** Reenviar los 1600 bytes ignorando la MTU
- **B.** Descartarlo e informar mediante ICMP de que requiere fragmentación y de la MTU del siguiente salto
- **C.** Ignorar DF y fragmentarlo
- **D.** Enviar ICMP echo reply en vez de un error

**Respuesta(s) propuesta(s): B.** DF prohíbe fragmentar en el router. Se descarta el paquete y normalmente se devuelve ICMP Destination Unreachable, fragmentation needed (tipo 3, código 4), con la MTU limitante.

**English**

An IPv4 packet has total length 1600 bytes and DF=1. A router would send it on a 1500-byte-MTU link. Which action supports Path MTU Discovery?

- **A.** Forward all 1600 bytes despite the link MTU
- **B.** Drop it and report ICMP fragmentation needed with the next-hop MTU
- **C.** Ignore DF and fragment it
- **D.** Send an ICMP echo reply instead of an error

DF prohibits router fragmentation. The router discards the packet and normally returns ICMP Destination Unreachable, fragmentation needed (type 3, code 4), including the limiting MTU.

Referencia: https://www.rfc-editor.org/rfc/rfc1191.txt · 2 and 4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 5. ipv6-default-router-discovery

ID: `ccna-original-20261024-b02-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un host recibe un Router Advertisement IPv6 válido desde fe80::1 con Router Lifetime distinto de cero. ¿Qué valor puede incorporarse a su lista de routers por defecto?

- **A.** fe80::1
- **B.** ::
- **C.** ff02::1
- **D.** 2001:db8::53

**Respuesta(s) propuesta(s): A.** Neighbor Discovery usa la dirección link-local de origen de un RA válido como candidata a router por defecto cuando Router Lifetime no es cero. Una dirección DNS o un prefijo anunciado no identifica al router por defecto.

**English**

A host receives a valid IPv6 Router Advertisement from fe80::1 with a nonzero Router Lifetime. Which value can enter its Default Router List?

- **A.** fe80::1
- **B.** ::
- **C.** ff02::1
- **D.** 2001:db8::53

Neighbor Discovery uses the link-local source address of a valid RA as a default-router candidate when its Router Lifetime is nonzero. A DNS server address or advertised subnet prefix is not the default-router identity.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 6.3.4 and 6.3.6 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 6. ipv6-dad-probe-fields

ID: `ccna-original-20261024-b02-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un host realiza Duplicate Address Detection IPv6 para una dirección tentativa y envía Neighbor Solicitation. Selecciona dos propiedades correctas de esa sonda DAD.

- **A.** Demuestra unicidad sin esperar anuncios que indiquen conflicto
- **B.** El campo target contiene la dirección tentativa comprobada
- **C.** Su origen IPv6 es la dirección no especificada ::
- **D.** Su origen ya debe ser la dirección unicast tentativa

**Respuesta(s) propuesta(s): B, C.** El NS de DAD usa origen no especificado y lleva la dirección tentativa en target. Usar esa dirección como origen ordinario ya asignado contradice la comprobación previa al uso. El resultado depende de observar conflictos durante DAD.

**English**

A host performs IPv6 Duplicate Address Detection for a tentative address and sends a Neighbor Solicitation. Select two correct properties of that DAD probe.

- **A.** It proves uniqueness without waiting for conflicting advertisements
- **B.** Its target field contains the tentative address being checked
- **C.** Its IPv6 source is the unspecified address ::
- **D.** Its source must already be the tentative unicast address

The DAD NS uses an unspecified source and names the tentative address as its target. Using the tentative address as an ordinary assigned source would defeat the purpose of checking it before use. The result depends on observing conflicts during the DAD procedure.

Referencia: https://www.rfc-editor.org/rfc/rfc4862.txt · 5.4.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 7. ipv4-link-local-multicast-scope

ID: `ccna-original-20261024-b02-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un hello OSPF se dirige al multicast IPv4 224.0.0.5 en un enlace local ordinario. ¿Qué regla de alcance se aplica a este intervalo?

- **A.** El tráfico de 224.0.0.0/24 queda restringido a la red local
- **B.** Es un gateway por defecto unicast IPv4
- **C.** Debe enrutarse globalmente a todo proceso OSPF
- **D.** Es una subred unicast privada

**Respuesta(s) propuesta(s): A.** El bloque de control local 224.0.0.0/24 se reserva para tráfico de control local y no se reenvía fuera de esa red. Una dirección multicast no es una subred unicast privada.

**English**

An OSPF hello is addressed to IPv4 multicast 224.0.0.5 on an ordinary local link. Which scope rule applies to this address range?

- **A.** Traffic in 224.0.0.0/24 is restricted to the local network
- **B.** It is an IPv4 unicast default gateway
- **C.** It must be routed globally to every OSPF process
- **D.** It is a private unicast subnet

The local-network control block 224.0.0.0/24 is reserved for local control traffic and is not forwarded off the local network. A multicast address is not a private unicast subnet.

Referencia: https://www.rfc-editor.org/rfc/rfc5771.txt · 4 Local Network Control Block · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 8. tcp-mss-fixed-header-budget

ID: `ccna-original-20261024-b02-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una conexión TCP IPv4 usa MTU 1500 bytes, cabecera IPv4 fija de 20 bytes y cabecera TCP fija de 20 bytes. ¿Qué MSS resulta al descontar esas cabeceras fijas?

- **A.** 1500
- **B.** 1480
- **C.** 1440
- **D.** 1460

**Respuesta(s) propuesta(s): D.** El presupuesto de cabeceras fijas es 1500−20−20 = 1460 bytes de datos TCP. Las opciones TCP/IP pueden afectar además los datos enviados en paquetes reales; el cálculo usa específicamente las cabeceras fijas indicadas.

**English**

An IPv4 TCP connection uses an MTU of 1500 bytes, a 20-byte fixed IPv4 header, and a 20-byte fixed TCP header. What MSS follows from subtracting those fixed headers?

- **A.** 1500
- **B.** 1480
- **C.** 1440
- **D.** 1460

The fixed-header budget is 1500−20−20 = 1460 bytes of TCP data. TCP/IP options can further affect the data sent in actual packets; this calculation specifically uses the stated fixed headers.

Referencia: https://www.rfc-editor.org/rfc/rfc6691.txt · 2 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 9. ipv4-fragment-offset-decode

ID: `ccna-original-20261024-b02-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un fragmento IPv4 lleva Fragment Offset=32. ¿En qué posición de byte de la carga útil del datagrama original comienzan sus datos?

- **A.** 256
- **B.** 32
- **C.** 64
- **D.** 128

**Respuesta(s) propuesta(s): A.** Fragment Offset se codifica en unidades de ocho octetos. Multiplica 32 por 8 para obtener el desplazamiento 256, contado desde el principio de la carga de datos original.

**English**

An IPv4 fragment carries Fragment Offset=32. At which payload byte position of the original datagram does its data start?

- **A.** 256
- **B.** 32
- **C.** 64
- **D.** 128

Fragment Offset is encoded in eight-octet units. Multiply 32 by 8 to get byte offset 256, measured from the beginning of the original data payload.

Referencia: https://www.rfc-editor.org/rfc/rfc791.txt · 3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 10. ipv4-multicast-mac-aliasing

ID: `ccna-original-20261024-b02-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

El multicast IPv4 mapea los 23 bits bajos en la MAC Ethernet 01:00:5e:xx:xx:xx. Selecciona dos direcciones IP que se mapean a 01:00:5e:01:02:03.

- **A.** 224.1.2.3
- **B.** 224.1.2.4
- **C.** 239.129.2.3
- **D.** 239.2.2.3

**Respuesta(s) propuesta(s): A, C.** Solo se conservan los 23 bits bajos en este mapeo; varias direcciones multicast IPv4 pueden compartir una MAC. 224.1.2.3 y 239.129.2.3 tienen los bits bajos requeridos; las otras alternativas cambian bits que sí se conservan.

**English**

IPv4 multicast maps the low-order 23 address bits into Ethernet MAC 01:00:5e:xx:xx:xx. Select two IP addresses that map to 01:00:5e:01:02:03.

- **A.** 224.1.2.3
- **B.** 224.1.2.4
- **C.** 239.129.2.3
- **D.** 239.2.2.3

Only the low 23 bits survive this mapping, so different IPv4 multicast addresses can share one Ethernet MAC. Both 224.1.2.3 and 239.129.2.3 have the required lower bits; the other choices change retained bits.

Referencia: https://www.rfc-editor.org/rfc/rfc1112.txt · 6.4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 11. bpdu-guard-edge-violation

ID: `ccna-original-20261024-b02-011` · Área: `network_access` · Dificultad: `intermediate`

Un puerto access de borde Cisco tiene PortFast y BPDU Guard habilitados. Recibe un BPDU de un switch recién conectado. ¿Qué acción se espera?

- **A.** Poner el puerto en estado error-disabled
- **B.** Elegir automáticamente como raíz al switch conectado
- **C.** Desactivar STP en toda la VLAN
- **D.** Reenviar los BPDU como tráfico ordinario

**Respuesta(s) propuesta(s): A.** BPDU Guard protege el supuesto de puerto de borde/PortFast deshabilitando el puerto protegido que recibe un BPDU. PortFast por sí solo es una función de convergencia y no equivale a esta acción ante infracciones.

**English**

A Cisco edge access port has PortFast and BPDU Guard enabled. It receives a BPDU from a newly attached switch. What is the expected guard action?

- **A.** Place the port into an error-disabled state
- **B.** Elect the attached switch root automatically
- **C.** Disable STP on the entire VLAN
- **D.** Forward BPDUs as ordinary user traffic

BPDU Guard protects an edge/PortFast assumption by disabling a guarded port that receives a BPDU. PortFast alone is a convergence feature and should not be confused with this violation action.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_optional_spanning_tree_features.html · BPDU Guard · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 12. root-guard-inconsistent-state

ID: `ccna-original-20261024-b02-012` · Área: `network_access` · Dificultad: `intermediate`

Un puerto designado con Root Guard recibe BPDU superiores que, de otro modo, lo convertirían en root port. ¿Qué estado se usa mientras persiste la condición?

- **A.** Administrativamente apagado
- **B.** Forwarding incondicional
- **C.** Error-disabled por BPDU Guard
- **D.** Root-inconsistent

**Respuesta(s) propuesta(s): D.** Root Guard impide que el puerto protegido sea root port colocándolo en root-inconsistent mientras persistan BPDU superiores. Puede recuperarse cuando cesan; no es la misma acción de BPDU Guard.

**English**

A designated port protected by Root Guard receives superior BPDUs that would otherwise make it a root port. What state is used while this condition persists?

- **A.** Administratively down
- **B.** Unconditionally forwarding
- **C.** Error-disabled by BPDU Guard
- **D.** Root-inconsistent

Root Guard prevents the protected port from becoming a root port by placing it in root-inconsistent state while superior BPDUs persist. It can recover when those BPDUs cease; this is not the same action as BPDU Guard.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_optional_spanning_tree_features.html · Root Guard · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 13. loop-guard-bpdu-loss

ID: `ccna-original-20261024-b02-013` · Área: `network_access` · Dificultad: `intermediate`

Un puerto STP no designado con Loop Guard deja de recibir los BPDU esperados. ¿Qué comportamiento ayuda a evitar que se convierta erróneamente en designado y forme un bucle?

- **A.** Hacerlo inmediatamente designado y forwarding
- **B.** Deshabilitar permanentemente la recepción de BPDU
- **C.** Cambiar toda prioridad de bridge a cero
- **D.** Mantener el puerto/VLAN afectado en loop-inconsistent

**Respuesta(s) propuesta(s): D.** La pérdida de BPDU puede permitir una transición incorrecta a forwarding en un puerto no designado. Loop Guard bloquea esa transición mediante loop-inconsistent hasta que vuelvan BPDU válidos.

**English**

A non-designated STP port with Loop Guard enabled stops receiving expected BPDUs. Which behavior helps avoid a loop caused by incorrectly becoming designated?

- **A.** Immediately make the port designated and forwarding
- **B.** Disable BPDU reception permanently
- **C.** Increase every bridge priority to zero
- **D.** Hold the affected port/VLAN in loop-inconsistent state

Loss of BPDUs can otherwise allow an incorrect transition toward forwarding on a non-designated port. Loop Guard blocks that transition with loop-inconsistent behavior until valid BPDUs resume.

Referencia: https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/10596-84.html · Loop Guard · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. etherchannel-flow-hash-stability

ID: `ccna-original-20261024-b02-014` · Área: `network_access` · Dificultad: `intermediate`

Una plataforma EtherChannel asigna cada flujo de cinco tuplas completo a un enlace miembro mediante un hash. ¿Qué ocurre con los paquetes del mismo flujo sin cambios mientras no cambien los miembros ni el hash?

- **A.** Usan el mismo enlace miembro seleccionado
- **B.** El flujo se divide automáticamente en nuevas sesiones TCP
- **C.** Cada paquete se transmite por todos los miembros
- **D.** Cada paquete debe rotar al siguiente miembro

**Respuesta(s) propuesta(s): A.** Con el hash por flujo indicado, las mismas entradas eligen el mismo miembro. Esto no promete utilización uniforme por paquete ni garantiza a cada flujo la suma de anchos de banda.

**English**

An EtherChannel platform hashes each complete five-tuple flow onto one member link. What happens to packets from the same unchanged flow while membership and hashing remain unchanged?

- **A.** They use the same selected member link
- **B.** The flow is automatically split into new TCP sessions
- **C.** Each packet is transmitted on all members
- **D.** Every packet must rotate to the next member

Under the stated per-flow hash, identical inputs select the same member. This does not promise equal utilization by packet or guarantee every flow receives the sum of member bandwidths.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · Load Balancing · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 15. etherchannel-bandwidth-upper-bounds

ID: `ccna-original-20261024-b02-015` · Área: `network_access` · Dificultad: `intermediate`

Un agregado tiene cuatro enlaces activos de 1 Gbit/s y usa un solo miembro por flujo. Ignorando sobrecarga, selecciona dos límites superiores teóricos correctos.

- **A.** Un flujo queda limitado a 1 Gbit/s por su miembro
- **B.** Cada flujo individual tiene garantizados 4 Gbit/s
- **C.** La capacidad agregada ideal es como máximo 4 Gbit/s
- **D.** El hash garantiza carga uniforme con cualquier mezcla de tráfico

**Respuesta(s) propuesta(s): A, C.** Un flujo usa un miembro de 1 Gbit/s, mientras que cuatro miembros plenamente utilizados suman 4 Gbit/s. Son límites superiores ideales, no garantías de rendimiento o equilibrio con cualquier tráfico.

**English**

An aggregate has four active 1-Gbit/s links and uses one member per flow. Ignoring overhead, select two correct theoretical upper bounds.

- **A.** One flow is limited to 1 Gbit/s by its member
- **B.** Every individual flow is guaranteed 4 Gbit/s
- **C.** Ideal aggregate capacity is at most 4 Gbit/s
- **D.** Hashing guarantees equal loading under any traffic mix

A single flow uses one 1-Gbit/s member, while four fully utilized members sum to 4 Gbit/s. These are ideal upper bounds, not guaranteed throughput or balance under an arbitrary traffic mix.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · Load Balancing · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 16. trunk-allowed-intersection

ID: `ccna-original-20261024-b02-016` · Área: `network_access` · Dificultad: `intermediate`

Un troncal operativo permite VLAN 10, 20 y 30 en A y VLAN 20, 30 y 40 en B. Sin otros filtros, selecciona dos VLAN permitidas en ambos extremos.

- **A.** VLAN 10
- **B.** VLAN 20
- **C.** VLAN 30
- **D.** VLAN 40

**Respuesta(s) propuesta(s): B, C.** Para estar permitida extremo a extremo, una VLAN debe pertenecer a ambas listas. La intersección es {20, 30}; permitirla en un solo extremo no basta.

**English**

An operational trunk permits VLANs 10, 20 and 30 at end A, and VLANs 20, 30 and 40 at end B. With no other filtering, select two VLANs permitted at both ends.

- **A.** VLAN 10
- **B.** VLAN 20
- **C.** VLAN 30
- **D.** VLAN 40

End-to-end eligibility requires membership in both allowed sets. Their intersection is {20, 30}; allowing a VLAN at only one end is insufficient.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Allowed VLAN List · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 17. voice-and-data-vlan-separation

ID: `ccna-original-20261024-b02-017` · Área: `network_access` · Dificultad: `intermediate`

Un puerto conecta un teléfono IP con un PC detrás. La VLAN de datos es 10 y la de voz es 30; el teléfono etiqueta la voz con VLAN 30 y el PC envía sin etiqueta. Selecciona dos clasificaciones correctas.

- **A.** La VLAN de voz obliga al PC a usar VLAN 0
- **B.** Las tramas de voz etiquetadas mantienen VLAN de voz 30
- **C.** Toda trama sin etiqueta del PC debe entrar en VLAN 30
- **D.** Las tramas sin etiqueta del PC pertenecen a VLAN de datos 10

**Respuesta(s) propuesta(s): B, D.** La VLAN access/de datos clasifica el tráfico sin etiqueta del PC y la VLAN de voz configurada transporta la voz etiquetada del teléfono. Ambas clases comparten el puerto físico sin convertirse en una sola VLAN.

**English**

A switch port connects an IP phone with a PC behind it. Data VLAN is 10 and voice VLAN is 30; the phone tags voice with VLAN 30 while PC frames are untagged. Select two correct classifications.

- **A.** Voice VLAN configuration forces PC frames into VLAN 0
- **B.** Tagged voice frames retain voice VLAN 30
- **C.** Every untagged PC frame must enter VLAN 30
- **D.** Untagged PC frames belong to data VLAN 10

The access/data VLAN classifies untagged PC traffic, while the configured voice VLAN carries the phone’s tagged voice traffic. The two traffic classes can share the physical port without becoming the same VLAN.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_voice_vlans.html · Voice VLAN Configuration · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. dtp-negotiation-mode-pairs

ID: `ccna-original-20261024-b02-018` · Área: `network_access` · Dificultad: `intermediate`

En puertos Cisco que admiten DTP, ¿qué par puede negociar un troncal 802.1Q si los demás parámetros son compatibles?

- **A.** Ambas interfaces administrativamente deshabilitadas
- **B.** Dynamic auto con dynamic auto
- **C.** Dynamic desirable con dynamic auto
- **D.** Access estático con dynamic desirable

**Respuesta(s) propuesta(s): C.** Dynamic desirable intenta negociar activamente y dynamic auto puede responder. Dos extremos auto no inician activamente la negociación; un puerto access explícito no pasa a troncal mediante DTP.

**English**

On Cisco ports that support DTP, which pair can negotiate an 802.1Q trunk when all other settings are compatible?

- **A.** Both interfaces administratively disabled
- **B.** Dynamic auto with dynamic auto
- **C.** Dynamic desirable with dynamic auto
- **D.** Static access with dynamic desirable

Dynamic desirable actively attempts trunk negotiation and dynamic auto can respond. Two auto endpoints do not actively initiate, and an explicitly configured access port does not become a trunk through DTP.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Dynamic Trunking Protocol · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 19. dot1q-priority-tag-zero

ID: `ccna-original-20261024-b02-019` · Área: `network_access` · Dificultad: `intermediate`

Una trama 802.1Q tiene VLAN ID 0 y lleva información de prioridad. ¿Qué significa aquí VLAN ID 0?

- **A.** La VLAN de gestión obligatoria de todo switch
- **B.** Una trama que debe enrutarse globalmente
- **C.** Una trama con etiqueta de prioridad, no pertenencia ordinaria a VLAN 0
- **D.** Una VLAN de usuario ordinaria llamada VLAN 0

**Respuesta(s) propuesta(s): C.** VID 0 se reserva para etiquetado de prioridad, no para asignación a una VLAN 0 ordinaria. La clasificación VLAN sigue las reglas de entrada y configuración aplicables.

**English**

An 802.1Q frame has VLAN ID 0 and carries priority information. What does VLAN ID 0 signify in this context?

- **A.** The mandatory management VLAN of every switch
- **B.** A frame that must be routed globally
- **C.** A priority-tagged frame rather than ordinary membership in VLAN 0
- **D.** A normal user VLAN named VLAN 0

VID 0 is reserved for priority tagging, not assignment to an ordinary VLAN 0. VLAN classification follows the applicable ingress rules and platform configuration.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_voice_vlans.html · Priority-Tagged Frames · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. rstp-proposal-agreement

ID: `ccna-original-20261024-b02-020` · Área: `network_access` · Dificultad: `intermediate`

RSTP funciona en un enlace punto a punto full-duplex entre switches. ¿Qué mecanismo puede permitir la transición rápida sin esperar todas las etapas heredadas de forward-delay?

- **A.** Proposal/agreement con la sincronización requerida
- **B.** Deshabilitar la prevención de bucles en ambos extremos
- **C.** Tratar todos los enlaces como segmentos compartidos half-duplex
- **D.** Ignorar todo BPDU después de activar el enlace

**Respuesta(s) propuesta(s): A.** RSTP puede usar proposal/agreement en enlaces punto a punto elegibles mientras sincroniza la topología. La convergencia rápida no implica reenviar sin comprobar la prevención de bucles.

**English**

RSTP is running on a full-duplex point-to-point switch link. Which mechanism can enable a rapid transition without waiting for all legacy forward-delay stages?

- **A.** Proposal/agreement with the required synchronization
- **B.** Disabling loop prevention on both endpoints
- **C.** Treating every link as a shared half-duplex segment
- **D.** Ignoring every BPDU after link-up

RSTP can use a proposal/agreement handshake on eligible point-to-point links while synchronizing the topology. Rapid convergence does not mean forwarding without loop-prevention checks.

Referencia: https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html · Rapid-PVST+ and RSTP · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 21. ipv6-link-local-next-hop-zone

ID: `ccna-original-20261024-b02-021` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos interfaces de un router alcanzan vecinos distintos llamados fe80::2 en enlaces diferentes. ¿Qué información adicional se necesita para usar fe80::2 sin ambigüedad como siguiente salto estático?

- **A.** La interfaz de salida o zona de enlace correspondiente
- **B.** Un puerto TCP de destino
- **C.** Un reemplazo globalmente único para todas las direcciones link-local
- **D.** Solo el sufijo de búsqueda DNS

**Respuesta(s) propuesta(s): A.** Una dirección link-local está limitada a un enlace; la misma dirección puede existir en enlaces diferentes. La interfaz/zona distingue el vecino y enlace deseados.

**English**

Two router interfaces can each reach a different neighbor named fe80::2 on different links. What extra information is needed to use fe80::2 unambiguously as a static next hop?

- **A.** The outgoing interface or appropriate link zone
- **B.** A TCP destination port
- **C.** A globally unique replacement for all link-local addresses
- **D.** The DNS search suffix only

A link-local address is scoped to a link; the same address can exist on multiple links. The interface/zone distinguishes which neighbor and link are intended.

Referencia: https://www.rfc-editor.org/rfc/rfc4007.txt · 6 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 22. floating-static-liveness-limitation

ID: `ccna-original-20261024-b02-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una ruta estática recursiva primaria conserva siguiente salto resoluble e interfaz activa, pero se descartan paquetes más adelante. Hay una ruta de respaldo de mayor distancia, sin tracking. ¿Por qué puede seguir seleccionada la primaria?

- **A.** Cualquier paquete perdido debe eliminar inmediatamente una ruta estática
- **B.** Una ruta estática flotante siempre sustituye a la primaria
- **C.** La distancia administrativa ordena rutas disponibles; por sí sola no prueba la entrega extremo a extremo
- **D.** Las rutas estáticas ignoran por completo la resolución del siguiente salto

**Respuesta(s) propuesta(s): C.** El respaldo de mayor distancia entra en juego cuando la primaria deja de ser elegible o se retira. Un agujero negro posterior puede ser invisible para una ruta estática simple; puede necesitarse tracking u otro mecanismo de enrutamiento.

**English**

A primary recursive static route still has a resolvable next hop and an up interface, but packets are dropped farther downstream. A higher-distance backup exists, with no tracking. Why might the primary remain selected?

- **A.** Any lost user packet must immediately remove a static route
- **B.** A floating static route always overrides every primary
- **C.** Administrative distance ranks available routes; it does not by itself test end-to-end delivery
- **D.** Static routes ignore next-hop reachability completely

A higher-distance backup becomes useful when the primary becomes ineligible or is withdrawn. An upstream black hole can remain invisible to a plain static route; additional tracking or a routing mechanism may be needed.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Use Administrative Distance for Backup · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 23. ospf-passive-interface-behavior

ID: `ccna-original-20261024-b02-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una interfaz está incluida en OSPF pero configurada passive. Selecciona dos resultados previstos en una interfaz LAN OSPF normal.

- **A.** Se suprimen los hello y la formación de vecinos OSPF en esa interfaz
- **B.** Se elimina automáticamente de todo anuncio de rutas
- **C.** Debe dejar de reenviar todo tráfico IP ordinario
- **D.** Su subred conectada puede seguir anunciándose por OSPF

**Respuesta(s) propuesta(s): A, D.** El modo passive de OSPF suprime adyacencias en la interfaz y permite anunciar su red asociada. No apaga administrativamente la interfaz ni prohíbe el reenvío IP ordinario.

**English**

An interface is included in OSPF but configured passive. Select two intended outcomes for a normal OSPF LAN interface.

- **A.** OSPF hellos and neighbor establishment on that interface are suppressed
- **B.** It is removed from every routing advertisement automatically
- **C.** It must stop forwarding all ordinary IP user traffic
- **D.** Its connected subnet can still be advertised by OSPF

Passive OSPF operation suppresses adjacency formation on the interface while allowing the associated network to be advertised. It does not administratively shut the interface or prohibit ordinary IP forwarding.

Referencia: https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-routing/b-ip-routing/m_iri-default-passive-interface.html · Default Passive Interfaces and OSPF · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 24. ospf-zero-priority-ineligibility

ID: `ccna-original-20261024-b02-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una elección inicial de DR en red broadcast tiene A(prioridad 0, RID 9.9.9.9), B(prioridad 1, RID 1.1.1.1) y C(prioridad 1, RID 2.2.2.2). ¿Qué candidato se prefiere por prioridad y router ID?

- **A.** Los tres
- **B.** A
- **C.** C
- **D.** B

**Respuesta(s) propuesta(s): C.** La prioridad cero hace a A inelegible para DR/BDR aunque tenga router ID alto. B y C empatan en prioridad y C gana por router ID. Se trata de una elección inicial, no de desplazar a un DR existente.

**English**

A fresh broadcast-network DR election has A(priority 0, RID 9.9.9.9), B(priority 1, RID 1.1.1.1), and C(priority 1, RID 2.2.2.2). Which router is the DR candidate preferred by priority and router ID?

- **A.** All three
- **B.** A
- **C.** C
- **D.** B

Priority zero makes A ineligible for DR/BDR despite its high router ID. B and C tie on priority, so C wins their router-ID tie. The scenario is a fresh election, not preemption of an existing DR.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 9.4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 25. ospf-point-to-point-no-dr

ID: `ccna-original-20261024-b02-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

OSPF funciona en un enlace configurado expresamente como tipo de red punto a punto. ¿Qué afirmación sobre la elección DR/BDR es correcta?

- **A.** Ambos routers deben convertirse en DR
- **B.** La elección de DR es obligatoria en toda interfaz OSPF
- **C.** La MAC menor debe ser BDR
- **D.** Este tipo de red no elige DR ni BDR

**Respuesta(s) propuesta(s): D.** El mecanismo de router designado se aplica a los tipos multiacceso pertinentes. Un enlace OSPF punto a punto forma la relación de vecinos sin elegir DR/BDR.

**English**

OSPF operates on a link explicitly configured with the point-to-point network type. Which statement about DR/BDR election is correct?

- **A.** Both routers must become DR
- **B.** A DR election is mandatory on every OSPF interface
- **C.** The lower MAC address must become BDR
- **D.** This network type does not elect a DR or BDR

OSPF’s designated-router mechanism applies to relevant multiaccess network types. An OSPF point-to-point link forms its neighbor relationship without a DR/BDR election.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 7.3 and 9.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 26. ospf-drother-two-way-normal

ID: `ccna-original-20261024-b02-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers OSPF DROther comparten una red broadcast sana con DR y BDR. Permanecen 2-Way entre sí pero llegan a Full con DR/BDR. ¿Qué significa normalmente?

- **A.** Comportamiento esperado: no todo par de DROther necesita adyacencia Full
- **B.** 2-Way significa que nunca vieron sus hello
- **C.** Ambos routers están en sistemas autónomos distintos
- **D.** Un fallo obligatorio porque todo par debe ser Full

**Respuesta(s) propuesta(s): A.** En una red broadcast se forman adyacencias Full con DR/BDR y los pares DROther pueden permanecer 2-Way. Esto reduce adyacencias y sobrecarga de flooding sin implicar un fallo.

**English**

Two OSPF DROther routers share a healthy broadcast network with a DR and BDR. They remain 2-Way with each other but reach Full with the DR/BDR. What does this normally mean?

- **A.** Expected behavior: not every DROther pair needs a full adjacency
- **B.** 2-Way means they have never seen each other’s hellos
- **C.** Both routers are in different autonomous systems
- **D.** A mandatory failure because every pair must be Full

On a broadcast network, full adjacencies are formed with the DR/BDR, while DROther pairs can remain 2-Way. This reduces adjacency and flooding overhead without implying a fault.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 27. ospf-hello-ipv4-destination

ID: `ccna-original-20261024-b02-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

En un hello OSPFv2 ordinario por una interfaz broadcast, sin enlace virtual, ¿qué destino multicast IPv4 se usa?

- **A.** 239.255.255.250
- **B.** 255.255.255.255
- **C.** 224.0.0.5
- **D.** 224.0.0.6

**Respuesta(s) propuesta(s): C.** AllSPFRouters es 224.0.0.5. AllDRouters es 224.0.0.6 y tiene otra función; no es el destino de los hello ordinarios en este tipo de red.

**English**

For an ordinary OSPFv2 hello on a broadcast interface, with no virtual link, which IPv4 multicast destination is used?

- **A.** 239.255.255.250
- **B.** 255.255.255.255
- **C.** 224.0.0.5
- **D.** 224.0.0.6

AllSPFRouters is 224.0.0.5. AllDRouters is 224.0.0.6 and has another role; it is not the destination of ordinary hello packets on this network type.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · A.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 28. administrative-distance-255

ID: `ccna-original-20261024-b02-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

Según la convención de distancia administrativa de Cisco, ¿qué significa una distancia administrativa de 255?

- **A.** La ruta siempre es candidata de igual costo
- **B.** La ruta tiene preferencia sobre cualquier ruta conectada
- **C.** El valor es el TTL del paquete IP
- **D.** La ruta no se considera confiable para instalarla

**Respuesta(s) propuesta(s): D.** Una distancia administrativa 255 designa una ruta que no se usa/instala según esta convención. Entre fuentes del mismo prefijo se prefieren distancias utilizables menores.

**English**

Under Cisco’s administrative-distance convention, what is the significance of an administrative distance of 255?

- **A.** The route is always an equal-cost candidate
- **B.** The route overrides every connected route
- **C.** The value is the IP packet TTL
- **D.** The route is not trusted for installation

An administrative distance of 255 denotes a route that is not used/installed under this convention. Lower usable distances are preferred for competing sources of the same prefix.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Default Distance Value Table · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 29. proxy-arp-response

ID: `ccna-original-20261024-b02-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host difunde una solicitud ARP para un destino IPv4 remoto. Un router configurado para responder mediante proxy ARP puede alcanzar ese destino. ¿Qué MAC proporciona en la respuesta?

- **A.** La MAC del propio router en el enlace receptor
- **B.** La MAC del host remoto transportada por todos los enlaces enrutados
- **C.** La MAC de ceros para toda respuesta proxy
- **D.** Una MAC multicast IPv6 sin importar el destino IPv4

**Respuesta(s) propuesta(s): A.** El proxy responde en nombre del destino remoto con su propia MAC local. El host envía las tramas al router, que puede enrutar el paquete hacia el destino real.

**English**

A host broadcasts an ARP request for a remote IPv4 destination. A router configured to answer using proxy ARP can reach that destination. Which MAC address does it provide in its reply?

- **A.** The router’s own MAC on the receiving link
- **B.** The remote host’s MAC carried across all routed links
- **C.** The all-zeros MAC for every proxy reply
- **D.** An IPv6 multicast MAC regardless of the IPv4 destination

The proxy answers on behalf of the remote destination using its own local MAC. The host sends frames to that router, which can then route the packet toward the actual destination.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/dynamic-address-allocation-resolution/13718-5.html · How Proxy ARP Works · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 30. ipv6-ra-invalid-small-mtu

ID: `ccna-original-20261024-b02-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host recibe una opción MTU de Router Advertisement de 1200 bytes en un enlace IPv6 válido. ¿Qué restricción IPv6 hace inadecuado ese valor como MTU del enlace?

- **A.** La MTU debe ser igual al router ID
- **B.** Una MTU menor convierte todas las direcciones a multicast
- **C.** La MTU del enlace IPv6 debe ser al menos 1280 bytes
- **D.** IPv6 prohíbe toda MTU menor que 9000 bytes

**Respuesta(s) propuesta(s): C.** IPv6 requiere una MTU mínima de enlace de 1280. El procesamiento de la opción MTU del RA debe respetar ese límite y no aceptar cualquier valor inferior.

**English**

A host receives a Router Advertisement MTU option of 1200 bytes on an otherwise valid IPv6 link. Which IPv6 constraint makes this advertised value unsuitable as the link MTU?

- **A.** The MTU must equal the router ID
- **B.** A smaller MTU changes all addresses to multicast
- **C.** IPv6 link MTU must be at least 1280 bytes
- **D.** IPv6 forbids every MTU below 9000 bytes

IPv6 requires a minimum link MTU of 1280. RA MTU processing must respect this bound rather than accepting an arbitrary smaller value.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 6.3.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 31. ospf-total-path-cost

ID: `ccna-original-20261024-b02-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos rutas OSPF elegibles llegan al mismo prefijo. La ruta A tiene costos de interfaz 10 y 20; la B, 5 y 30. ¿Qué ruta tiene el menor costo total?

- **A.** No se pueden comparar las rutas
- **B.** B
- **C.** A
- **D.** Igual costo total

**Respuesta(s) propuesta(s): C.** OSPF suma los costos pertinentes: A da 30 y B da 35. Entre estas rutas elegibles al mismo prefijo se prefiere A. No se comparan métricas de protocolos distintos.

**English**

Two eligible OSPF paths reach the same destination prefix. Path A has interface costs 10 and 20; path B has costs 5 and 30. Which path has the lower total cost?

- **A.** Neither path can be compared
- **B.** B
- **C.** A
- **D.** Equal total cost

OSPF sums the relevant path costs: A totals 30 and B totals 35. For these same-prefix eligible paths, A is preferred. This does not compare unrelated protocols’ metrics.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 32. ipv6-small-link-adaptation

ID: `ccna-original-20261024-b02-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una tecnología de capa inferior no puede transmitir directamente paquetes IPv6 de 1280 bytes. ¿Qué adaptación necesita para admitir un enlace IPv6?

- **A.** Aumentar hop limit para que el paquete quepa
- **B.** Eliminar el requisito de MTU mínima IPv6
- **C.** Exigir que los routers IPv6 de tránsito fragmenten cada paquete
- **D.** Proporcionar fragmentación y reensamblado adecuados por debajo de IPv6

**Respuesta(s) propuesta(s): D.** IPv6 establece que los enlaces incapaces de transportar directamente 1280 bytes deben proporcionar fragmentación y reensamblado específicos por debajo de IPv6. No equivale a fragmentación IPv6 en routers de tránsito.

**English**

A lower-layer technology cannot transmit 1280-byte IPv6 packets directly. Which adaptation is required for it to support an IPv6 link?

- **A.** Use a larger hop limit to fit the packet
- **B.** Remove the IPv6 minimum MTU requirement
- **C.** Require transit IPv6 routers to fragment every packet
- **D.** Provide suitable fragmentation/reassembly below IPv6

IPv6 specifies that links unable to carry 1280-byte packets directly must provide link-specific fragmentation and reassembly below IPv6. This is different from transit routers performing IPv6 fragmentation.

Referencia: https://www.rfc-editor.org/rfc/rfc8200.txt · 5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 33. ospf-lsa-maxage-flush

ID: `ccna-original-20261024-b02-033` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un LSA OSPF alcanza MaxAge. ¿Qué tratamiento corresponde en cálculos de rutas y flooding?

- **A.** Convertirlo automáticamente en una ruta conectada
- **B.** Usar su edad como TTL IPv4
- **C.** Excluirlo del cálculo de rutas y retirarlo según las reglas de flooding
- **D.** Preferirlo para siempre sobre todos los LSA más jóvenes

**Respuesta(s) propuesta(s): C.** Un LSA MaxAge no se usa para calcular rutas y se retira según las reglas OSPF. La edad del LSA es la vida del registro en el plano de control, no el TTL de los paquetes de usuario.

**English**

An OSPF LSA reaches MaxAge. What is the intended treatment in routing calculations and flooding?

- **A.** Convert it automatically into a connected route
- **B.** Use its age as an IPv4 TTL
- **C.** Exclude it from routing calculations and flush it according to the flooding rules
- **D.** Prefer it over all younger LSAs forever

A MaxAge LSA is not used in the routing calculation and is aged out/flushed under OSPF’s rules. LSA age is control-plane database lifetime, not the TTL of forwarded user packets.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 14 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 34. dhcp-relay-giaddr-scope

ID: `ccna-original-20261024-b02-034` · Área: `ip_services` · Dificultad: `intermediate`

Un relay DHCP reenvía una solicitud con giaddr=10.20.30.1. ¿Por qué importa este campo al elegir el servidor la subred del cliente?

- **A.** Siempre es el DNS solicitado por el cliente
- **B.** Reemplaza la MAC del cliente por una contraseña
- **C.** Identifica el contexto de red del cliente reenviado para seleccionar la dirección
- **D.** Significa que el cliente ya recibió una concesión permanente

**Respuesta(s) propuesta(s): C.** La dirección gateway del relay ayuda al servidor a determinar la subred de origen y elegir el pool apropiado. No es una opción DNS ni prueba de una concesión terminada.

**English**

A DHCP relay forwards a client request with giaddr=10.20.30.1. Why is this field relevant when the server chooses a client subnet?

- **A.** It is always the client’s requested DNS server
- **B.** It replaces the client MAC with a password
- **C.** It identifies the relayed client’s network context for address selection
- **D.** It means the client has already received a permanent lease

The relay gateway address helps the server determine the subnet from which the request originated and choose an appropriate address pool. It is not a DNS option or evidence of a completed lease.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.3.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 35. dns-aa-ra-distinction

ID: `ccna-original-20261024-b02-035` · Área: `ip_services` · Dificultad: `intermediate`

En una respuesta DNS, selecciona dos interpretaciones correctas de los indicadores de cabecera.

- **A.** RA demuestra que la respuesta es autoritativa
- **B.** AA es la solicitud de recursión del cliente
- **C.** AA indica una respuesta autoritativa para el nombre pertinente consultado
- **D.** RA indica que el servidor dispone de recursión

**Respuesta(s) propuesta(s): C, D.** AA se refiere a autoridad y RA anuncia disponibilidad de recursión. RD es el indicador de recursión deseada en la solicitud; autoridad y servicio recursivo son propiedades diferentes.

**English**

In a DNS response, select two correct interpretations of header flags.

- **A.** RA proves that the answer is authoritative
- **B.** AA is the client’s request for recursion
- **C.** AA indicates an authoritative answer for the relevant query name
- **D.** RA indicates that recursion is available at the server

AA concerns authority, while RA advertises recursion availability. RD is the recursion-desired flag in the request; authority and recursive service are different properties.

Referencia: https://www.rfc-editor.org/rfc/rfc1035.txt · 4.1.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 36. dhcp-default-renew-rebind-times

ID: `ccna-original-20261024-b02-036` · Área: `ip_services` · Dificultad: `intermediate`

Una concesión DHCPv4 dura ocho horas y el servidor no modifica T1/T2. Usando las fracciones base predeterminadas antes de aleatorización, ¿cuándo son T1 de renovación y T2 de rebinding?

- **A.** T1=4 horas; T2=7 horas
- **B.** T1=7 horas; T2=4 horas
- **C.** T1=8 horas; T2=16 horas
- **D.** T1=2 horas; T2=4 horas

**Respuesta(s) propuesta(s): A.** Las fracciones base predeterminadas son 0,5 y 0,875 de la concesión. Para ocho horas resultan 4 y 7 horas. El cálculo indicado no incluye aleatorización ni temporizadores explícitos del servidor.

**English**

A DHCPv4 lease is eight hours, with no server-specified T1/T2 override. Using the default base fractions before randomization, when are renewal T1 and rebinding T2?

- **A.** T1=4 hours; T2=7 hours
- **B.** T1=7 hours; T2=4 hours
- **C.** T1=8 hours; T2=16 hours
- **D.** T1=2 hours; T2=4 hours

The default base fractions are 0.5 and 0.875 of the lease duration. Eight hours therefore gives 4 and 7 hours. Client randomization and explicit server timers are outside this stated base calculation.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.4.5 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 37. ntp-client-stratum-increment

ID: `ccna-original-20261024-b02-037` · Área: `ip_services` · Dificultad: `intermediate`

Un cliente NTP se sincroniza directamente con un servidor seleccionado de stratum 3. ¿Qué stratum anuncia normalmente al estar sincronizado con esa fuente?

- **A.** 3
- **B.** 2
- **C.** 4
- **D.** 0

**Respuesta(s) propuesta(s): C.** Un servidor secundario sincronizado anuncia normalmente un stratum mayor en uno que su fuente seleccionada. Stratum expresa distancia respecto de una referencia, no precisión numérica garantizada.

**English**

An NTP client synchronizes directly to a selected time server of stratum 3. What stratum does the client normally advertise while synchronized to that source?

- **A.** 3
- **B.** 2
- **C.** 4
- **D.** 0

A synchronized secondary server normally reports a stratum one greater than its selected source. Stratum describes distance from a reference source, not a guaranteed numerical accuracy.

Referencia: https://www.rfc-editor.org/rfc/rfc5905.txt · 11.2.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 38. snmp-getnext-numeric-oid-order

ID: `ccna-original-20261024-b02-038` · Área: `ip_services` · Dificultad: `advanced`

Una vista MIB expone como candidatos 1.3.6.1.2.1.2.2.1.2.9, ...2.10 y ...2.100. GETNEXT comienza en el primer OID terminado en .9. ¿Qué OID completo sigue en orden lexicográfico numérico?

- **A.** 1.3.6.1.2.1.2.2.1.2.8
- **B.** 1.3.6.1.2.1.2.2.1.2.10
- **C.** 1.3.6.1.2.1.2.2.1.2.100
- **D.** 1.3.6.1.2.1.2.2.1.2.9

**Respuesta(s) propuesta(s): B.** Los componentes OID se comparan como subidentificadores enteros. Después de 9 viene 10 antes que 100; ordenar caracteres produciría un recorrido incorrecto.

**English**

A MIB view exposes only these next candidates: 1.3.6.1.2.1.2.2.1.2.9, ...2.10, and ...2.100. A GETNEXT starts at the first OID ending in .9. Which complete OID is next in numeric lexicographic order?

- **A.** 1.3.6.1.2.1.2.2.1.2.8
- **B.** 1.3.6.1.2.1.2.2.1.2.10
- **C.** 1.3.6.1.2.1.2.2.1.2.100
- **D.** 1.3.6.1.2.1.2.2.1.2.9

OID components are compared as integer subidentifiers. After 9 comes 10 before 100; sorting textual digits instead would give the wrong traversal order.

Referencia: https://www.rfc-editor.org/rfc/rfc3416.txt · 4.2.2 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 39. noncontiguous-acl-wildcard

ID: `ccna-original-20261024-b02-039` · Área: `security_fundamentals` · Dificultad: `advanced`

Una ACL IPv4 compara orígenes con base 192.0.2.0 y wildcard 0.0.0.5. Selecciona dos direcciones de origen coincidentes.

- **A.** 192.0.2.1
- **B.** 192.0.2.3
- **C.** 192.0.2.2
- **D.** 192.0.2.4

**Respuesta(s) propuesta(s): A, D.** La wildcard 5 es 00000101, por lo que solo se ignoran los bits 0 y 2. Con los demás bits fijos, el último octeto puede ser 0, 1, 4 o 5; no es el intervalo continuo 0–7.

**English**

An IPv4 ACL compares source addresses against base 192.0.2.0 with wildcard 0.0.0.5. Select two matching source addresses.

- **A.** 192.0.2.1
- **B.** 192.0.2.3
- **C.** 192.0.2.2
- **D.** 192.0.2.4

Wildcard 5 is binary 00000101, so only bits 0 and 2 are ignored. With the other bits fixed, the last octet can be 0, 1, 4 or 5; this is not the contiguous range 0–7.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Wildcard Mask · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 40. extended-acl-destination-port

ID: `ccna-original-20261024-b02-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACE IPv4 Cisco es permit tcp 10.0.0.0 0.0.0.255 any eq 443. ¿Qué paquete coincide con sus condiciones de puerto y origen?

- **A.** TCP de 10.0.0.8:50000 a 198.51.100.9:443
- **B.** TCP de 10.0.0.8:443 a 198.51.100.9:50000
- **C.** UDP de 10.0.0.8:50000 a 198.51.100.9:443
- **D.** TCP de 10.0.1.8:50000 a 198.51.100.9:443

**Respuesta(s) propuesta(s): A.** eq 443 después de la expresión de destino coincide con el puerto TCP de destino, no con el de origen. Además, el origen debe estar en 10.0.0.0/24 y el protocolo debe ser TCP.

**English**

A Cisco IPv4 ACE is permit tcp 10.0.0.0 0.0.0.255 any eq 443. Which packet matches its port condition and source condition?

- **A.** TCP from 10.0.0.8:50000 to 198.51.100.9:443
- **B.** TCP from 10.0.0.8:443 to 198.51.100.9:50000
- **C.** UDP from 10.0.0.8:50000 to 198.51.100.9:443
- **D.** TCP from 10.0.1.8:50000 to 198.51.100.9:443

The eq 443 after the destination expression matches the TCP destination port, not the source port. The source must also belong to 10.0.0.0/24, and the protocol must be TCP.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Extended ACL TCP Port Matching · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. aaa-server-error-versus-reject

ID: `ccna-original-20261024-b02-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una lista de métodos de login AAA Cisco intenta un grupo RADIUS y después autenticación local. ¿Qué evento permite normalmente probar el siguiente método?

- **A.** El método anterior devuelve un error, como servidores no disponibles
- **B.** Toda autenticación RADIUS correcta
- **C.** Un administrador ya se autenticó correctamente
- **D.** El servidor rechaza explícitamente las credenciales procesadas

**Respuesta(s) propuesta(s): A.** El fallback de listas AAA distingue un error/método no disponible de un fallo explícito de autenticación. Un rechazo procesado normalmente detiene el intento en vez de eludirlo usando una cuenta local.

**English**

A Cisco AAA login method list tries a RADIUS server group and then local authentication. Which event normally permits trying the next method?

- **A.** The preceding method returns an error such as unavailable servers
- **B.** Every successful RADIUS authentication
- **C.** An administrator has already authenticated successfully
- **D.** The server explicitly rejects validly processed credentials

AAA method-list fallback distinguishes an error/unavailable method from an explicit authentication failure. A processed reject normally stops that authentication attempt rather than bypassing the reject using a local account.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_authentication.html · Method Lists and Authentication Errors · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 42. dhcp-snooping-server-port-trust

ID: `ccna-original-20261024-b02-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

DHCP snooping está habilitado en una VLAN. Un OFFER de servidor entra por un puerto no confiable orientado a clientes. ¿Qué filtrado se pretende?

- **A.** Confiar en todo OFFER por usar UDP
- **B.** Descartar tráfico DHCP de servidor no autorizado en ese puerto no confiable
- **C.** Deshabilitar todos los clientes de la VLAN
- **D.** Convertir el OFFER en una respuesta DNS

**Respuesta(s) propuesta(s): B.** DHCP snooping distingue caminos confiables hacia servidores de puertos de clientes no confiables y filtra mensajes de servidor indebidos en estos últimos. La confianza depende de la topología y no debe concederse a todo puerto access.

**English**

DHCP snooping is enabled for a VLAN. A server OFFER arrives on an untrusted client-facing port. What is the intended filtering behavior?

- **A.** Trust every OFFER because it uses UDP
- **B.** Drop unauthorized server-originated DHCP traffic on that untrusted port
- **C.** Disable every client in the VLAN
- **D.** Convert the OFFER into a DNS response

DHCP snooping distinguishes trusted server-facing paths from untrusted client-facing ports and filters inappropriate server messages on untrusted ports. Trust must be assigned according to topology, not granted to every access port.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_dynamic_arp_inspection.html · DHCP Snooping Database and Trust Boundaries · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 43. dai-binding-validation

ID: `ccna-original-20261024-b02-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Dynamic ARP Inspection valida un paquete ARP de un puerto no confiable contra los bindings DHCP snooping aplicables. ¿Qué discrepancia pretende detectar?

- **A.** Un router ID mayor que el número de VLAN
- **B.** Cualquier broadcast IPv4 legítimo en la tabla de rutas
- **C.** Un nombre DNS más largo que una MAC
- **D.** Una asociación IP/MAC del emisor ARP incompatible con el binding confiable

**Respuesta(s) propuesta(s): D.** DAI puede usar bindings IP-MAC confiables para rechazar asociaciones ARP falsificadas en interfaces no confiables. Una IP o MAC sintácticamente válida no demuestra que la asociación esté autorizada.

**English**

Dynamic ARP Inspection validates an ARP packet on an untrusted port against the applicable DHCP snooping bindings. What mismatch is it designed to detect?

- **A.** A router ID larger than the VLAN number
- **B.** Any legitimate IPv4 broadcast address in a routing table
- **C.** A DNS name longer than an Ethernet MAC
- **D.** An ARP sender IP/MAC association inconsistent with the trusted binding

DAI can use trusted IP-to-MAC bindings to reject forged ARP associations on untrusted interfaces. A syntactically valid IPv4 or MAC address alone is not proof that the association is authorized.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_dynamic_arp_inspection.html · Dynamic ARP Inspection Validation · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. tcp-established-acl-is-not-stateful

ID: `ccna-original-20261024-b02-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL TCP extendida clásica de Cisco usa established. ¿Qué limitación debe comprender el ingeniero?

- **A.** Comprueba indicadores TCP pertinentes, no demuestra que exista una conexión seguida por estado
- **B.** Realiza validación completa de certificados TLS
- **C.** Garantiza que todo ACK pertenece a una sesión legítima
- **D.** Convierte una ACL sin estado en un firewall completo de aplicación

**Respuesta(s) propuesta(s): A.** La coincidencia established clásica se basa en ACK o RST, no en una tabla completa de estado. Un paquete con esos indicadores puede coincidir sin demostrar un handshake previo legítimo.

**English**

A classic Cisco extended TCP ACL uses the established keyword. What limitation should an engineer understand?

- **A.** It checks relevant TCP flag bits rather than proving a tracked connection exists
- **B.** It performs complete TLS certificate validation
- **C.** It guarantees every ACK belongs to a legitimate session
- **D.** It converts a stateless ACL into a full application firewall

The classic established match is based on ACK or RST flags, not a full state table. A packet with such a flag can match without proving the legitimacy of a prior handshake.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · TCP established · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 45. aaa-function-separation

ID: `ccna-original-20261024-b02-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Selecciona tres asociaciones correctas entre funciones AAA y sus propósitos.

- **A.** Authentication significa solo elegir comandos permitidos
- **B.** Authentication comprueba identidad
- **C.** Accounting registra uso o acciones pertinentes
- **D.** Authorization determina acciones permitidas
- **E.** Accounting sustituye toda comprobación de identidad

**Respuesta(s) propuesta(s): B, C, D.** Authentication, authorization y accounting responden preguntas distintas: quién es el sujeto, qué puede hacer y qué actividad registrar. Registrar por sí solo no autentica ni autoriza al sujeto.

**English**

Select three correct associations between AAA functions and their purposes.

- **A.** Authentication means choosing permitted commands only
- **B.** Authentication checks identity
- **C.** Accounting records relevant usage or actions
- **D.** Authorization determines permitted actions
- **E.** Accounting replaces all identity checks

Authentication, authorization and accounting answer different questions: who the subject is, what it may do, and what activity should be recorded. Logging alone does not authenticate or authorize a subject.

Referencia: https://www.rfc-editor.org/rfc/rfc2903.txt · 1 and 2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. http-rate-limit-retry-after

ID: `ccna-original-20261024-b02-046` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API devuelve HTTP 429 con Retry-After: 120. ¿Qué comportamiento del cliente es apropiado?

- **A.** Tratarlo como prueba de que el recurso no existe
- **B.** Borrar automáticamente todas las credenciales locales
- **C.** Reintentar inmediatamente en un bucle infinito
- **D.** Respetar el límite y esperar al menos la demora indicada antes de reintentar

**Respuesta(s) propuesta(s): D.** 429 indica demasiadas solicitudes; Retry-After puede comunicar una demora antes de otro intento. Reintentos controlados y backoff evitan intensificar el problema.

**English**

An API returns HTTP 429 with Retry-After: 120. Which client behavior is appropriate for that response?

- **A.** Treat it as proof the resource does not exist
- **B.** Delete every local credential automatically
- **C.** Immediately retry in an infinite tight loop
- **D.** Respect the rate limit and wait at least the indicated delay before retrying

429 indicates too many requests; Retry-After can communicate a delay before another attempt. Controlled retry/backoff avoids intensifying the rate-limit condition.

Referencia: https://www.rfc-editor.org/rfc/rfc6585.txt · 4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 47. http-if-match-lost-update

ID: `ccna-original-20261024-b02-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Un cliente de configuración envía If-Match con un ETag antiguo, pero el recurso cambió. ¿Qué respuesta evita sobrescribirlo incondicionalmente si la precondición es falsa?

- **A.** 301 Moved Permanently
- **B.** 412 Precondition Failed
- **C.** 201 Created
- **D.** 204 No Content always

**Respuesta(s) propuesta(s): B.** If-Match condiciona la operación al validador de la representación seleccionada. Una precondición falsa normalmente produce 412 en vez de aplicar la actualización obsoleta.

**English**

A configuration client sends If-Match with an old ETag, but the resource has changed. Which response prevents an unconditional overwrite when the precondition is false?

- **A.** 301 Moved Permanently
- **B.** 412 Precondition Failed
- **C.** 201 Created
- **D.** 204 No Content always

If-Match makes the operation conditional on the selected representation’s validator. A false precondition normally produces 412 rather than applying the stale update.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 13.1.1 and 15.5.13 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 48. netconf-candidate-commit

ID: `ccna-original-20261024-b02-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Un servidor NETCONF anuncia la capacidad candidate. Un edit-config correcto cambia solo el datastore candidate. ¿Qué operación aplica la configuración candidate a running?

- **A.** `<get/>`
- **B.** `<commit/>`
- **C.** `<close-session/>`
- **D.** `<unlock/>`

**Respuesta(s) propuesta(s): B.** El datastore candidate prepara la configuración; commit solicita aplicarla a running. Editar candidate no garantiza por sí solo que running haya cambiado.

**English**

A NETCONF server advertises the candidate capability. A successful edit-config changes only the candidate datastore. What operation is used to apply the candidate configuration to running?

- **A.** `<get/>`
- **B.** `<commit/>`
- **C.** `<close-session/>`
- **D.** `<unlock/>`

The candidate datastore stages configuration; commit requests its application to running. Editing candidate is not itself a guarantee that the running configuration has changed.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 8.3.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. netconf-session-lock-lifetime

ID: `ccna-original-20261024-b02-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Una sesión NETCONF mantiene un bloqueo de datastore de configuración y después termina. ¿Qué debe pasar con sus bloqueos?

- **A.** Se convierten en reglas permanentes de acceso
- **B.** Se transfieren a todo cliente no autenticado
- **C.** Se liberan automáticamente al terminar la sesión
- **D.** Permanecen para siempre hasta reemplazar el dispositivo

**Respuesta(s) propuesta(s): C.** Los bloqueos NETCONF están asociados a la sesión que los adquirió. El servidor debe liberarlos al terminar esa sesión para evitar bloqueos abandonados indefinidos.

**English**

A NETCONF session holds a configuration datastore lock and then terminates. What must happen to locks held by that session?

- **A.** They become permanent access-control rules
- **B.** They transfer to every unauthenticated client
- **C.** They are released automatically when the session terminates
- **D.** They remain forever until the device is replaced

NETCONF locks are associated with the session that acquired them. The server must release them when that session terminates, preventing abandoned session locks from remaining indefinitely.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 7.5 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. yang-integer-range-restriction

ID: `ccna-original-20261024-b02-050` · Área: `automation_programmability` · Dificultad: `intermediate`

Una leaf YANG se define como uint16 con el rango adicional 1..4094. Selecciona dos valores aceptados tanto por el tipo base como por ese rango.

- **A.** 4095
- **B.** 20
- **C.** 0
- **D.** 4094

**Respuesta(s) propuesta(s): B, D.** uint16 por sí solo admite de 0 a 65535, pero el rango explícito restringe los valores a 1..4094 inclusive. Deben cumplirse ambas restricciones.

**English**

A YANG leaf is defined as uint16 with the additional range 1..4094. Select two values accepted by both the base type and that range.

- **A.** 4095
- **B.** 20
- **C.** 0
- **D.** 4094

uint16 alone allows 0 through 65535, but the explicit range further restricts valid values to 1 through 4094 inclusive. Both constraints apply.

Referencia: https://www.rfc-editor.org/rfc/rfc7950.txt · 9.2.4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.
