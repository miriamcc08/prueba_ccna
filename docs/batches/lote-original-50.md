# Lote original: original-20261024-50

Estado: **pendiente de revisión técnica y de traducción**. El estado de consulta y la evidencia de cada referencia figuran en el JSON. Las comprobaciones ejecutables de cálculo/escenario y la consulta documental no constituyen aprobación editorial completa.

Los ejercicios relacionados comparten familia y no se cuentan como conceptos independientes. La equivalencia semántica con todo el banco sigue en revisión. El texto se creó para el proyecto.

Consultas focalizadas registradas: **20/50**. Esta cifra no representa aprobaciones humanas.

| Área | Preguntas |
|---|---:|
| network_fundamentals | 10 |
| network_access | 10 |
| ip_connectivity | 12 |
| ip_services | 5 |
| security_fundamentals | 8 |
| automation_programmability | 5 |

El reparto de 50 requiere redondear los medios puntos de IP Connectivity y Security Fundamentals; no se afirma aquí haber confirmado la versión vigente del temario.

## 1. ipv4-network-boundary

ID: `ccna-original-20261024-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un host tiene la dirección 172.20.14.201/27. ¿Cuál es su dirección de red?

- **A.** 172.20.14.192
- **B.** 172.20.14.201
- **C.** 172.20.14.224
- **D.** 172.20.14.200

**Respuesta(s) propuesta(s): A.** Un /27 forma bloques de 32 direcciones. 201 está en el bloque 192–223; al poner en cero los cinco bits de host se obtiene 172.20.14.192. La dirección del host no es la de red.

**English**

A host is configured as 172.20.14.201/27. What is its network address?

- **A.** 172.20.14.192
- **B.** 172.20.14.201
- **C.** 172.20.14.224
- **D.** 172.20.14.200

A /27 has blocks of 32 addresses. 201 lies in the block 192–223; clearing the five host bits gives 172.20.14.192. The host address itself is not the network address.

Referencia: https://www.rfc-editor.org/rfc/rfc4632 · 3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4632.txt

## 2. ipv4-directed-broadcast

ID: `ccna-original-20261024-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

En la subred IPv4 convencional que contiene 192.0.2.130/26, ¿cuál es la dirección de broadcast dirigido?

- **A.** 192.0.2.191
- **B.** 192.0.2.255
- **C.** 192.0.2.128
- **D.** 192.0.2.190

**Respuesta(s) propuesta(s): A.** El bloque /26 abarca 128–191. Al poner los seis bits de host en uno resulta .191; .128 es la red y .190 el último host convencional.

**English**

For the conventional IPv4 subnet containing 192.0.2.130/26, which address is the directed broadcast address?

- **A.** 192.0.2.191
- **B.** 192.0.2.255
- **C.** 192.0.2.128
- **D.** 192.0.2.190

The /26 block is 128–191. Setting all six host bits to one gives .191; .128 is the network and .190 is the last conventional host.

Referencia: https://www.rfc-editor.org/rfc/rfc919 · 7 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc919.txt

## 3. ipv4-host-capacity

ID: `ccna-original-20261024-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una LAN convencional necesita al menos 58 direcciones IPv4 de host utilizables. ¿Qué prefijo satisface el requisito con el menor número de direcciones totales?

- **A.** /26
- **B.** /27
- **C.** /25
- **D.** /28

**Respuesta(s) propuesta(s): A.** En subredes convencionales, hosts utilizables = 2^(32−prefijo)−2. Un /27 ofrece 30, un /26 ofrece 62 y un /25 ofrece 126. /26 es el bloque suficiente más pequeño.

**English**

A conventional LAN needs at least 58 usable IPv4 host addresses. Which prefix provides enough hosts with the fewest total addresses?

- **A.** /26
- **B.** /27
- **C.** /25
- **D.** /28

For conventional subnets, usable hosts = 2^(32−prefix)−2. A /27 provides 30, a /26 provides 62, and a /25 provides 126. /26 is the smallest sufficient block.

Referencia: https://www.rfc-editor.org/rfc/rfc1878 · Subnet Table · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1878.txt

## 4. ipv4-wildcard-complement

ID: `ccna-original-20261024-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una ACL debe coincidir exactamente con la red de máscara 255.255.254.0 mediante su wildcard inversa. ¿Qué wildcard necesita?

- **A.** 0.0.1.255
- **B.** 0.0.254.255
- **C.** 0.0.0.255
- **D.** 255.255.254.0

**Respuesta(s) propuesta(s): A.** Invierte cada bit de la máscara: resta cada octeto de 255. Se obtiene 0.0.1.255, que ignora los últimos nueve bits de la dirección.

**English**

An ACL must match exactly the network described by mask 255.255.254.0 using its inverse wildcard mask. Which wildcard is required?

- **A.** 0.0.1.255
- **B.** 0.0.254.255
- **C.** 0.0.0.255
- **D.** 255.255.254.0

Invert every bit of the subnet mask: subtract each octet from 255. This gives 0.0.1.255, which ignores the final nine address bits.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 5. ipv4-point-to-point-31

ID: `ccna-original-20261024-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un enlace punto a punto implementa expresamente RFC 3021 y usa 192.0.2.10/31. ¿Qué par de direcciones puede usar para sus extremos?

- **A.** Ninguna dirección utilizable
- **B.** 192.0.2.10, 192.0.2.11
- **C.** 192.0.2.9, 192.0.2.10
- **D.** 192.0.2.11, 192.0.2.12

**Respuesta(s) propuesta(s): B.** En un /31 punto a punto conforme a RFC 3021, ambas direcciones identifican extremos; no se aplica la reserva convencional de red y broadcast. El bloque contiene .10 y .11.

**English**

A point-to-point link explicitly implements RFC 3021 and uses 192.0.2.10/31. Which pair of endpoint addresses can it use?

- **A.** No usable addresses
- **B.** 192.0.2.10, 192.0.2.11
- **C.** 192.0.2.9, 192.0.2.10
- **D.** 192.0.2.11, 192.0.2.12

On an RFC 3021 point-to-point /31, both addresses identify endpoints; the conventional network/broadcast reservation is not applied. The block contains .10 and .11.

Referencia: https://www.rfc-editor.org/rfc/rfc3021 · 2.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc3021.txt

## 6. ipv4-host-route-32

ID: `ccna-original-20261024-006` · Área: `network_fundamentals` · Dificultad: `basic`

¿Con cuántas direcciones IPv4 individuales coincide la ruta 203.0.113.42/32?

- **A.** 2
- **B.** 1
- **C.** 0
- **D.** 32

**Respuesta(s) propuesta(s): B.** Los 32 bits están fijados y no quedan bits variables. La ruta coincide con 2^0 = 1 dirección: 203.0.113.42. Un /32 es una ruta de host.

**English**

How many individual IPv4 addresses does the route 203.0.113.42/32 match?

- **A.** 2
- **B.** 1
- **C.** 0
- **D.** 32

All 32 bits are fixed, leaving zero variable bits. The route matches 2^0 = 1 address: 203.0.113.42. A /32 is a host route.

Referencia: https://www.rfc-editor.org/rfc/rfc4632 · 3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4632.txt

## 7. ipv6-prefix-allocation

ID: `ccna-original-20261024-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una organización recibe un /56 IPv6 y asigna un /64 diferente a cada LAN. ¿Cuántos prefijos LAN /64 caben en la asignación?

- **A.** 8
- **B.** 256
- **C.** 64
- **D.** 65536

**Respuesta(s) propuesta(s): B.** Hay 64−56 = 8 bits disponibles para identificar subredes. Sus 2^8 combinaciones producen 256 prefijos /64 distintos. Se cuentan subredes, no hosts.

**English**

An organization receives an IPv6 /56 and assigns a different /64 to each LAN. How many /64 LAN prefixes fit within the allocation?

- **A.** 8
- **B.** 256
- **C.** 64
- **D.** 65536

There are 64−56 = 8 subnet-ID bits available. Their 2^8 combinations produce 256 different /64 prefixes. This counts subnets, not hosts.

Referencia: https://www.rfc-editor.org/rfc/rfc4291 · 2.3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4291.txt

## 8. ipv6-canonical-compression

ID: `ccna-original-20261024-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

¿Cuál es la forma canónica RFC 5952 de 2001:0db8:0000:0000:0000:003a:0000:0001?

- **A.** 2001:db8:0:0:0:003A:0:1
- **B.** 2001:db8::3a::1
- **C.** 2001:db8::3a:0:1
- **D.** 2001:db8:0:0:0:3a::1

**Respuesta(s) propuesta(s): C.** Elimina ceros iniciales, usa hexadecimal en minúsculas y comprime la secuencia más larga de campos cero. Los tres campos cero anteriores a 3a forman la secuencia más larga. Solo se permite un ::.

**English**

Which is the RFC 5952 canonical form of 2001:0db8:0000:0000:0000:003a:0000:0001?

- **A.** 2001:db8:0:0:0:003A:0:1
- **B.** 2001:db8::3a::1
- **C.** 2001:db8::3a:0:1
- **D.** 2001:db8:0:0:0:3a::1

Remove leading zeros, use lowercase hexadecimal, and compress the longest run of consecutive zero fields. The three zero fields before 3a form the longest run. Only one :: is permitted.

Referencia: https://www.rfc-editor.org/rfc/rfc5952 · 4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc5952.txt

## 9. ipv4-fragment-offset

ID: `ccna-original-20261024-009` · Área: `network_fundamentals` · Dificultad: `advanced`

Un router IPv4 debe fragmentar un datagrama de 3000 bytes de carga útil y 20 bytes de cabecera para una MTU de 1500 bytes. DF=0 y no hay opciones IP. ¿Cuántos fragmentos necesita y cuánto mide la carga útil del último?

- **A.** 3 fragmentos, 40 bytes
- **B.** 2 fragmentos, 1500 bytes
- **C.** 2 fragmentos, 1520 bytes
- **D.** 3 fragmentos, 60 bytes

**Respuesta(s) propuesta(s): A.** Cada carga útil no final debe caber en la MTU y ser múltiplo de 8: floor((1500−20)/8)×8 = 1480. Dos cargas transportan 2960 bytes y la última tiene 40 bytes. Su longitud total añade otra cabecera de 20 bytes.

**English**

An IPv4 router must fragment a datagram with a 3000-byte payload and a 20-byte header for a 1500-byte MTU. DF=0 and no IP options are present. How many fragments are needed, and how large is the last fragment payload?

- **A.** 3 fragments, 40 bytes
- **B.** 2 fragments, 1500 bytes
- **C.** 2 fragments, 1520 bytes
- **D.** 3 fragments, 60 bytes

Each non-final payload must fit the MTU and be a multiple of 8 bytes: floor((1500−20)/8)×8 = 1480. Two such payloads carry 2960 bytes; the final payload is 40 bytes. Its total length includes another 20-byte header.

Referencia: https://www.rfc-editor.org/rfc/rfc791 · 3.1 Fragmentation · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc791.txt

## 10. ethernet-mac-address-bits

ID: `ccna-original-20261024-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

¿Qué dirección Ethernet tiene el bit individual/unicast en cero y el bit de administración local en uno?

- **A.** 00:11:22:33:44:55
- **B.** 03:11:22:33:44:55
- **C.** 01:11:22:33:44:55
- **D.** 02:11:22:33:44:55

**Respuesta(s) propuesta(s): D.** Los dos bits menos significativos del primer octeto son I/G (bit 0) y U/L (bit 1). 0x02 es 00000010 en binario: unicast y administración local. 0x01 y 0x03 son direcciones de grupo.

**English**

Which Ethernet address has both the individual/unicast bit cleared and the locally administered bit set?

- **A.** 00:11:22:33:44:55
- **B.** 03:11:22:33:44:55
- **C.** 01:11:22:33:44:55
- **D.** 02:11:22:33:44:55

The two least significant bits of the first octet are I/G (bit 0) and U/L (bit 1). 0x02 is binary 00000010: unicast and locally administered. 0x01 and 0x03 are group addresses.

Referencia: https://www.rfc-editor.org/rfc/rfc7042 · 2.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc7042.txt

Referencia complementaria: https://www.rfc-editor.org/rfc/rfc9542.txt · MAC address bits

Actualización de referencia: RFC 9542 obsoletes RFC 7042; the current document was also inspected for the unicast and local-bit interpretation.

## 11. vlan-broadcast-isolation

ID: `ccna-original-20261024-011` · Área: `network_access` · Dificultad: `intermediate`

Dos hosts están conectados a puertos access del mismo switch: uno en VLAN 10 y otro en VLAN 20. No hay router ni switching de capa 3. ¿Qué impide la comunicación directa entre sus VLAN?

- **A.** Una VLAN siempre requiere un switch físico dedicado
- **B.** Están en dominios de broadcast de capa 2 distintos
- **C.** Todos los puertos access descartan tramas unicast
- **D.** Los identificadores VLAN deben diferir al menos en 100

**Respuesta(s) propuesta(s): B.** La pertenencia a VLAN separa los dominios de reenvío de capa 2. El tráfico entre VLAN necesita enrutamiento; conectar ambos puertos al mismo switch físico no lo proporciona automáticamente.

**English**

Two hosts connect to access ports on one switch: one in VLAN 10 and one in VLAN 20. No router or Layer 3 switching is configured. What prevents direct communication between their VLANs?

- **A.** A VLAN always requires a dedicated physical switch
- **B.** They are in different Layer 2 broadcast domains
- **C.** All access ports discard unicast frames
- **D.** The VLAN IDs must differ by at least 100

VLAN membership separates Layer 2 forwarding domains. Traffic between VLANs needs routing; placing both ports on one physical switch does not provide it automatically.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlans.html

## 12. access-ingress-classification

ID: `ccna-original-20261024-012` · Área: `network_access` · Dificultad: `intermediate`

Un puerto access pertenece a VLAN 20 y no tiene VLAN de voz. Entra por él una trama Ethernet ordinaria sin etiqueta. ¿Con qué VLAN la asocia el switch?

- **A.** VLAN 20
- **B.** VLAN 0
- **C.** VLAN 4095
- **D.** VLAN 1

**Respuesta(s) propuesta(s): A.** Una trama ordinaria sin etiqueta que entra por este puerto access se clasifica en la VLAN access configurada: VLAN 20. La ausencia de etiqueta no obliga a usar VLAN 1.

**English**

An access port is assigned to VLAN 20, with no voice VLAN. An ordinary untagged Ethernet frame enters the port. Which VLAN does the switch associate with that frame?

- **A.** VLAN 20
- **B.** VLAN 0
- **C.** VLAN 4095
- **D.** VLAN 1

An ordinary untagged frame on this access port is classified into the configured access VLAN, VLAN 20. A missing tag does not force every frame into VLAN 1.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlans.html

## 13. trunk-allowed-vlan-filter

ID: `ccna-original-20261024-013` · Área: `network_access` · Dificultad: `intermediate`

Un troncal 802.1Q operativo permite solo VLAN 10 y 20. Una trama de datos etiquetada de VLAN 30 debe transmitirse por él. ¿Qué resultado se espera?

- **A.** La etiqueta se cambia a VLAN 20
- **B.** No se reenvía por este troncal
- **C.** Se reclasifica automáticamente en VLAN 10
- **D.** Se apaga todo el switch

**Respuesta(s) propuesta(s): B.** La lista de VLAN permitidas controla cuáles atraviesan el troncal. No traduce una VLAN excluida a otra permitida. VLAN 30 está excluida.

**English**

An operational 802.1Q trunk allows only VLANs 10 and 20. A tagged data frame belonging to VLAN 30 reaches this trunk for transmission. What is the expected result?

- **A.** The tag is changed to VLAN 20
- **B.** It is not forwarded on this trunk
- **C.** It is automatically reclassified into VLAN 10
- **D.** The entire switch shuts down

The allowed-VLAN list controls which VLANs can traverse the trunk. It does not translate an excluded VLAN into an allowed one. VLAN 30 is excluded.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html

## 14. stp-root-priority

ID: `ccna-original-20261024-014` · Área: `network_access` · Dificultad: `intermediate`

Para la misma VLAN, el switch A tiene prioridad base STP 24576 y MAC 00:ff:00:00:00:01; B tiene prioridad base 32768 y MAC 00:00:00:00:00:01. ¿Cuál tiene el bridge ID menor?

- **A.** A
- **B.** Ningún bridge ID es válido
- **C.** Bridge ID iguales
- **D.** B

**Respuesta(s) propuesta(s): A.** STP compara el campo de prioridad antes de la MAC. Como la extensión de VLAN/system-ID es la misma, 24576 gana frente a 32768 aunque B tenga una MAC menor.

**English**

For the same VLAN, switch A has STP base priority 24576 and MAC 00:ff:00:00:00:01; switch B has base priority 32768 and MAC 00:00:00:00:00:01. Which switch has the lower bridge ID?

- **A.** A
- **B.** Neither bridge ID is valid
- **C.** Equal bridge IDs
- **D.** B

STP compares the priority field before the MAC address. Because the VLAN/system-ID extension is the same, 24576 wins over 32768 regardless of B’s smaller MAC.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html

## 15. stp-root-mac-tiebreak

ID: `ccna-original-20261024-015` · Área: `network_access` · Dificultad: `intermediate`

Dos switches tienen la misma prioridad STP para la misma VLAN. A usa MAC 00:10:00:00:00:02 y B usa 00:10:00:00:00:01. ¿Cuál gana entre ellos la elección de root bridge?

- **A.** B
- **B.** Siempre gana la MAC mayor
- **C.** Ambos se convierten en raíz del mismo árbol
- **D.** A

**Respuesta(s) propuesta(s): A.** Si los campos de prioridad son iguales, STP elige la MAC menor. B termina en 01 en lugar de 02, por lo que su bridge ID es menor.

**English**

Two switches have identical STP priorities for the same VLAN. A uses MAC 00:10:00:00:00:02 and B uses 00:10:00:00:00:01. Which switch wins the root bridge election between them?

- **A.** B
- **B.** The higher MAC always wins
- **C.** Both become root for the same spanning tree
- **D.** A

With equal priority fields, STP selects the lower MAC address. B ends in 01 rather than 02, so its bridge ID is lower.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html

## 16. stp-root-path-cost

ID: `ccna-original-20261024-016` · Área: `network_access` · Dificultad: `intermediate`

Un switch no raíz tiene dos rutas candidatas hacia el mismo root STP. Sus costos totales son 8 y 12, sin otra ruta de menor costo. ¿Qué costo se prefiere?

- **A.** 0
- **B.** 8
- **C.** 20
- **D.** 12

**Respuesta(s) propuesta(s): B.** El primer criterio para elegir el root port es el menor costo total hacia la raíz. No hacen falta desempates: 8 es menor que 12.

**English**

A non-root switch has two candidate paths to the same STP root. Their total root path costs are 8 and 12, with no other lower-cost path. Which cost is preferred?

- **A.** 0
- **B.** 8
- **C.** 20
- **D.** 12

The first criterion for root-port selection is the lowest total path cost to the root. Tie breakers are unnecessary because 8 is lower than 12.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html

## 17. lacp-active-passive

ID: `ccna-original-20261024-017` · Área: `network_access` · Dificultad: `intermediate`

¿Qué combinación LACP puede iniciar la negociación para formar un agregado, suponiendo que todos los parámetros del enlace coinciden?

- **A.** Ambos enlaces físicos están administrativamente apagados
- **B.** Active en A, passive en B
- **C.** Ningún extremo ejecuta LACP
- **D.** Passive en A, passive en B

**Respuesta(s) propuesta(s): B.** Un extremo LACP active inicia la negociación y un extremo passive puede responder. Dos extremos passive no la inician. Los enlaces físicos también deben estar operativos.

**English**

Which LACP combination can initiate negotiation to form a bundle, assuming all link parameters match?

- **A.** Both physical links are administratively down
- **B.** Active on A, passive on B
- **C.** Neither endpoint runs LACP
- **D.** Passive on A, passive on B

An active LACP endpoint initiates negotiation and a passive endpoint can respond. Two passive endpoints do not initiate. Physical links must also be operational.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html

## 18. etherchannel-consistency

ID: `ccna-original-20261024-018` · Área: `network_access` · Dificultad: `intermediate`

Dos puertos candidatos tienen la misma velocidad y dúplex, pero uno es access en VLAN 10 y el otro en VLAN 20. ¿Qué debe corregirse antes de usarlos como un EtherChannel access?

- **A.** Su pertenencia a la VLAN access debe ser coherente
- **B.** Sus direcciones IP deben ser consecutivas
- **C.** Sus cables deben medir exactamente lo mismo
- **D.** Sus direcciones MAC deben ser idénticas

**Respuesta(s) propuesta(s): A.** Los puertos miembros de un EtherChannel access necesitan configuraciones de capa 2 compatibles, incluida la VLAN access. No basta con igualar la velocidad.

**English**

Two candidate member ports have equal speed and duplex, but one is an access port in VLAN 10 and the other in VLAN 20. What must be corrected before using them as one access EtherChannel?

- **A.** Their access VLAN membership must be consistent
- **B.** Their IP addresses must be consecutive
- **C.** Their cable lengths must be identical
- **D.** Their MAC addresses must be identical

Member ports in an access EtherChannel need compatible Layer 2 configurations, including the access VLAN. Matching speed alone is insufficient.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html

## 19. dot1q-vlan-id-space

ID: `ccna-original-20261024-019` · Área: `network_access` · Dificultad: `intermediate`

El campo VLAN ID de 802.1Q tiene 12 bits. Si se excluyen los ID 0 y 4095 de la asignación ordinaria, ¿cuántos ID quedan?

- **A.** 4095
- **B.** 4094
- **C.** 4096
- **D.** 1024

**Respuesta(s) propuesta(s): B.** Doce bits codifican 2^12 = 4096 valores. Al excluir los dos valores reservados indicados quedan 4094. Una plataforma concreta puede admitir menos VLAN simultáneas.

**English**

The 802.1Q VLAN ID field is 12 bits. If IDs 0 and 4095 are excluded from ordinary VLAN assignment, how many IDs remain?

- **A.** 4095
- **B.** 4094
- **C.** 4096
- **D.** 1024

Twelve bits encode 2^12 = 4096 values. Excluding the two specified reserved values leaves 4094. A particular platform may support fewer simultaneous VLANs.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlans.html

## 20. native-vlan-mismatch

ID: `ccna-original-20261024-020` · Área: `network_access` · Dificultad: `intermediate`

Un troncal envía sin etiqueta las tramas de la VLAN nativa. A usa VLAN nativa 10 y B usa VLAN nativa 20. Una trama sin etiqueta sale de VLAN 10 en A y entra en B. ¿En qué VLAN la clasifica B?

- **A.** VLAN 20
- **B.** VLAN 10
- **C.** VLAN 30
- **D.** VLAN 4095

**Respuesta(s) propuesta(s): A.** B interpreta las tramas entrantes sin etiqueta según su propia VLAN nativa: VLAN 20. La VLAN local de A no viaja en una etiqueta que no existe. Las VLAN nativas deben coincidir.

**English**

A trunk sends native-VLAN frames untagged. Switch A uses native VLAN 10 and switch B uses native VLAN 20. An untagged frame leaves A from VLAN 10 and enters B. Into which VLAN does B classify it?

- **A.** VLAN 20
- **B.** VLAN 10
- **C.** VLAN 30
- **D.** VLAN 4095

B interprets untagged ingress frames using its own native VLAN, VLAN 20. A’s local VLAN choice is not carried in an absent tag. Native VLANs should match across the trunk.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg.html · Protocol specification / configuration guide · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html

## 21. ipv4-longest-prefix

ID: `ccna-original-20261024-021` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router tiene rutas 10.8.0.0/16, 10.8.4.0/24 y 10.8.4.128/25. ¿Qué prefijo gana para 10.8.4.200 antes de resolver empates entre rutas al mismo prefijo?

- **A.** 10.8.4.128/25
- **B.** 10.8.4.0/24
- **C.** Todos los prefijos tienen la misma especificidad
- **D.** 10.8.0.0/16

**Respuesta(s) propuesta(s): A.** El destino pertenece a los tres prefijos, pero /25 fija más bits iniciales. La coincidencia de prefijo más largo precede a la comparación de fuentes para un mismo prefijo.

**English**

A router has routes for 10.8.0.0/16, 10.8.4.0/24, and 10.8.4.128/25. Which prefix wins for destination 10.8.4.200 before any same-prefix tie breaking?

- **A.** 10.8.4.128/25
- **B.** 10.8.4.0/24
- **C.** All prefixes have equal specificity
- **D.** 10.8.0.0/16

The destination belongs to all three prefixes, but /25 fixes the most leading bits. Longest-prefix matching precedes comparisons between sources of the same prefix.

Referencia: https://www.rfc-editor.org/rfc/rfc1812 · 5.2.4.3 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1812.txt

## 22. route-source-distance

ID: `ccna-original-20261024-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Para exactamente el mismo prefijo de destino, un router Cisco tiene una ruta estática utilizable con distancia administrativa 1 y una ruta OSPF con distancia 110. ¿Qué fuente prefiere la selección normal?

- **A.** Ruta OSPF
- **B.** Ruta estática
- **C.** Ninguna hasta igualar sus métricas
- **D.** Ambas porque las longitudes coinciden

**Respuesta(s) propuesta(s): B.** Entre fuentes competidoras del mismo prefijo se prefiere la menor distancia administrativa. No se comparan directamente métricas de protocolos distintos.

**English**

For exactly the same destination prefix, a Cisco router has a usable static route with administrative distance 1 and an OSPF route with distance 110. With default route selection, which source is preferred?

- **A.** OSPF route
- **B.** Static route
- **C.** Neither until their metrics are equal
- **D.** Both because prefix lengths match

For competing sources of the same prefix, the lower administrative distance is preferred. Protocol metrics are not compared directly across these different sources.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Protocol specification / configuration guide · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 23. ospf-interface-cost

ID: `ccna-original-20261024-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una implementación OSPF calcula el costo como ancho de banda de referencia dividido por ancho de banda de interfaz. La referencia está configurada expresamente en 100 Mbit/s y la interfaz en 10 Mbit/s. ¿Cuál es el costo?

- **A.** 1000
- **B.** 10
- **C.** 100
- **D.** 1

**Respuesta(s) propuesta(s): B.** Usa unidades coherentes: 100/10 = 10. El escenario indica la referencia configurada; no se supone que sea universal para todas las implementaciones OSPF.

**English**

An OSPF implementation calculates interface cost as reference bandwidth divided by interface bandwidth. The reference is explicitly configured as 100 Mbit/s, and the interface bandwidth is 10 Mbit/s. What is the cost?

- **A.** 1000
- **B.** 10
- **C.** 100
- **D.** 1

Use the specified units consistently: 100/10 = 10. This question supplies the configured reference rather than assuming it is universal to all OSPF implementations.

Referencia: https://www.rfc-editor.org/rfc/rfc2328 · C.3 Interface output cost · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc2328.txt

## 24. ospf-equal-cost-paths

ID: `ccna-original-20261024-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router admite al menos dos rutas ECMP. Dos rutas OSPF elegibles llegan al mismo prefijo con igual costo total por siguientes saltos distintos. ¿Qué resultado de reenvío es posible?

- **A.** Debe ganar la ruta de mayor costo numérico
- **B.** Se pueden instalar ambos siguientes saltos para reenvío de igual costo
- **C.** El prefijo más largo siempre pierde
- **D.** OSPF nunca admite múltiples siguientes saltos

**Respuesta(s) propuesta(s): B.** OSPF admite múltiples rutas de igual costo cuando hay siguientes saltos elegibles con el mismo costo. La distribución concreta depende de la implementación de reenvío de la plataforma.

**English**

A router supports at least two ECMP paths. Two eligible OSPF routes reach the same prefix with equal total cost through distinct next hops. What forwarding result is possible?

- **A.** The route with the larger numeric cost must win
- **B.** Both next hops can be installed for equal-cost forwarding
- **C.** The longer prefix always loses
- **D.** OSPF never supports multiple next hops

OSPF supports equal-cost multipath when multiple eligible next hops have the same path cost. Actual distribution across paths depends on the platform’s forwarding implementation.

Referencia: https://www.rfc-editor.org/rfc/rfc2328 · 16.8 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc2328.txt

## 25. ipv4-default-route

ID: `ccna-original-20261024-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router tiene 192.0.2.0/24 y 0.0.0.0/0. El destino del paquete es 198.51.100.9. ¿Qué ruta coincide y se selecciona?

- **A.** 198.51.100.9/24
- **B.** 192.0.2.0/24
- **C.** No coincide ninguna ruta
- **D.** 0.0.0.0/0

**Respuesta(s) propuesta(s): D.** El /24 específico no contiene el destino. La ruta por defecto /0 coincide con cualquier dirección IPv4 y se usa si no hay una ruta elegible más específica.

**English**

A router has 192.0.2.0/24 and 0.0.0.0/0. Its packet destination is 198.51.100.9. Which route matches and is selected?

- **A.** 198.51.100.9/24
- **B.** 192.0.2.0/24
- **C.** No route matches
- **D.** 0.0.0.0/0

The specific /24 does not contain the destination. The default /0 matches every IPv4 address and is used when no more-specific eligible route matches.

Referencia: https://www.rfc-editor.org/rfc/rfc1812 · 5.2.4.3 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1812.txt

## 26. ipv6-longest-prefix

ID: `ccna-original-20261024-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

Hay rutas para 2001:db8::/32, 2001:db8:12::/48 y 2001:db8:12:34::/64. ¿Cuál gana para 2001:db8:12:34::9?

- **A.** 2001:db8:12::/48
- **B.** 2001:db8:12:34::/64
- **C.** 2001:db8::/32
- **D.** ::/0

**Respuesta(s) propuesta(s): B.** Los tres prefijos contienen el destino. El /64 tiene la coincidencia de prefijo más larga y por tanto es la ruta más específica.

**English**

Routes exist for 2001:db8::/32, 2001:db8:12::/48, and 2001:db8:12:34::/64. Which wins for 2001:db8:12:34::9?

- **A.** 2001:db8:12::/48
- **B.** 2001:db8:12:34::/64
- **C.** 2001:db8::/32
- **D.** ::/0

All three prefixes contain the destination. The /64 has the longest matching prefix and is therefore the most specific match.

Referencia: https://www.rfc-editor.org/rfc/rfc7608 · 2 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc7608.txt

## 27. ipv4-route-aggregation

ID: `ccna-original-20261024-027` · Área: `ip_connectivity` · Dificultad: `advanced`

¿Qué prefijo único resume exactamente 10.4.8.0/24, 10.4.9.0/24, 10.4.10.0/24 y 10.4.11.0/24 sin incluir otras redes /24?

- **A.** 10.4.8.0/22
- **B.** 10.4.10.0/22
- **C.** 10.4.0.0/20
- **D.** 10.4.8.0/23

**Respuesta(s) propuesta(s): A.** Cuatro redes /24 contiguas requieren dos bits menos de prefijo: /22. El límite del tercer octeto es múltiplo de cuatro y 8 está alineado. El bloque termina en 10.4.11.255.

**English**

Which single prefix exactly summarizes 10.4.8.0/24, 10.4.9.0/24, 10.4.10.0/24 and 10.4.11.0/24 without adding other /24 networks?

- **A.** 10.4.8.0/22
- **B.** 10.4.10.0/22
- **C.** 10.4.0.0/20
- **D.** 10.4.8.0/23

Four contiguous /24 networks need two fewer prefix bits: /22. The third-octet boundary is a multiple of four, and 8 is correctly aligned. The block ends at 10.4.11.255.

Referencia: https://www.rfc-editor.org/rfc/rfc4632 · 3.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4632.txt

## 28. recursive-next-hop

ID: `ccna-original-20261024-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una ruta estática hacia 203.0.113.0/24 apunta a 198.51.100.2. El router tiene 198.51.100.0/30 directamente conectada en G0/1. ¿Qué ruta resuelve ese siguiente salto?

- **A.** 203.0.113.0/24 a través de sí misma
- **B.** 198.51.100.0/30 por G0/1
- **C.** 198.51.100.4/30
- **D.** Una ruta al servidor DNS

**Respuesta(s) propuesta(s): B.** 198.51.100.2 pertenece a la red .0/30 directamente conectada. La resolución recursiva identifica G0/1 como interfaz de salida; aún puede ser necesaria la resolución de capa 2 del vecino.

**English**

A static route to 203.0.113.0/24 points to 198.51.100.2. The router has a directly connected 198.51.100.0/30 on G0/1. Which route resolves that next hop?

- **A.** 203.0.113.0/24 via itself
- **B.** 198.51.100.0/30 via G0/1
- **C.** 198.51.100.4/30
- **D.** A route to the DNS server

198.51.100.2 lies within the directly connected .0/30. Recursive resolution identifies G0/1 as the egress interface; Layer 2 resolution of the neighbor may still be needed.

Referencia: https://www.rfc-editor.org/rfc/rfc1812 · 5.2.4 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1812.txt

## 29. ipv4-ttl-expiry

ID: `ccna-original-20261024-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un paquete unicast IPv4 ordinario llega a un router con TTL=1. ¿Qué debe hacer el router si al reenviarlo su TTL se reduce a cero?

- **A.** Difundirlo por todas las interfaces
- **B.** Reenviarlo con TTL=0
- **C.** Descartarlo y, sujeto a las reglas ICMP, enviar Time Exceeded
- **D.** Restablecer automáticamente su TTL a 255

**Respuesta(s) propuesta(s): C.** TTL limita la vida de un datagrama IPv4. Un router no debe reenviar un paquete cuyo TTL caduca; normalmente devuelve ICMP Time Exceeded salvo que se aplique una excepción ICMP.

**English**

An ordinary forwarded IPv4 unicast packet arrives at a router with TTL=1. What should the router do when forwarding would reduce its TTL to zero?

- **A.** Broadcast it on every interface
- **B.** Forward it with TTL=0
- **C.** Discard it and, subject to ICMP rules, send Time Exceeded
- **D.** Reset its TTL to 255 automatically

TTL limits the lifetime of an IPv4 datagram. A router must not forward a packet whose TTL expires; ICMP Time Exceeded is normally returned unless an ICMP exception applies.

Referencia: https://www.rfc-editor.org/rfc/rfc1812 · 5.3.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1812.txt

## 30. ipv6-default-prefix

ID: `ccna-original-20261024-030` · Área: `ip_connectivity` · Dificultad: `basic`

¿Qué prefijo de destino IPv6 representa una ruta por defecto que coincide con todas las direcciones IPv6?

- **A.** ::/0
- **B.** fe80::/10
- **C.** ::1/128
- **D.** ff00::/8

**Respuesta(s) propuesta(s): A.** Una longitud cero no fija bits de dirección. ::/0 es la ruta por defecto IPv6; ::1/128 es loopback, ff00::/8 multicast y fe80::/10 espacio link-local.

**English**

Which IPv6 destination prefix denotes a default route matching all IPv6 addresses?

- **A.** ::/0
- **B.** fe80::/10
- **C.** ::1/128
- **D.** ff00::/8

A prefix length of zero fixes no address bits. ::/0 is the IPv6 default route; ::1/128 is loopback, ff00::/8 multicast, and fe80::/10 link-local space.

Referencia: https://www.rfc-editor.org/rfc/rfc4291 · 2.5 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4291.txt

## 31. ospf-dr-election

ID: `ccna-original-20261024-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

Ocurre una elección inicial de DR OSPF en un segmento broadcast; aún no hay DR/BDR. El router elegible A tiene prioridad 10 y router ID 1.1.1.1; B tiene prioridad 1 e ID 9.9.9.9. Entre ellos, ¿cuál se prefiere como DR?

- **A.** Ambos deben ser DR simultáneamente
- **B.** B
- **C.** A
- **D.** Ninguno porque difieren sus ID

**Respuesta(s) propuesta(s): C.** En esta elección inicial gana primero la mayor prioridad de interfaz OSPF elegible; el router ID desempata después. A tiene prioridad 10. Esto no significa que un router nuevo de mayor prioridad desplace a un DR existente.

**English**

A fresh OSPF DR election occurs on a broadcast segment; no DR/BDR already exists. Eligible router A has priority 10 and router ID 1.1.1.1; B has priority 1 and ID 9.9.9.9. Between these routers, which is preferred for DR?

- **A.** Both must be DR simultaneously
- **B.** B
- **C.** A
- **D.** Neither because IDs differ

During this fresh election, the higher eligible OSPF interface priority wins before router-ID tie breaking. A has priority 10. This does not imply that a newly arriving higher-priority router preempts an existing DR.

Referencia: https://www.rfc-editor.org/rfc/rfc2328 · 9.4 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc2328.txt

## 32. ospf-hello-dead-compatibility

ID: `ccna-original-20261024-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers OSPFv2 en la misma red broadcast usan la misma área y autenticación, pero A usa hello/dead 10/40 segundos y B usa 30/120. ¿Cuál es el problema?

- **A.** Se prohíben MAC de interfaz diferentes
- **B.** Sus intervalos hello y dead no coinciden
- **C.** OSPF exige áreas diferentes en una LAN
- **D.** El router ID mayor impide toda adyacencia

**Respuesta(s) propuesta(s): B.** El procesamiento Hello de OSPF comprueba que HelloInterval y RouterDeadInterval coincidan en esta red. Los valores diferentes impiden establecer normalmente la vecindad aunque otros parámetros coincidan.

**English**

Two OSPFv2 routers on the same broadcast network use the same area and authentication, but A uses hello/dead 10/40 seconds and B uses 30/120. What is the problem?

- **A.** Different interface MACs are forbidden
- **B.** Their hello and dead intervals do not match
- **C.** OSPF requires different areas on one LAN
- **D.** The larger router ID prevents all adjacency

OSPF Hello processing checks matching HelloInterval and RouterDeadInterval for this network. The mismatched values prevent normal neighbor establishment even though other parameters agree.

Referencia: https://www.rfc-editor.org/rfc/rfc2328 · 10.5 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc2328.txt

## 33. dhcp-initial-message-order

ID: `ccna-original-20261024-033` · Área: `ip_services` · Dificultad: `basic`

Un cliente sin concesión realiza el intercambio ordinario DHCPv4 de cuatro mensajes para obtener una dirección. ¿Qué orden es correcto?

- **A.** OFFER → ACK → DISCOVER → REQUEST
- **B.** DISCOVER → REQUEST → OFFER → ACK
- **C.** REQUEST → DISCOVER → ACK → OFFER
- **D.** DISCOVER → OFFER → REQUEST → ACK

**Respuesta(s) propuesta(s): D.** El cliente descubre servidores; uno ofrece configuración; el cliente solicita la oferta elegida; el servidor confirma la concesión. Se describe la asignación inicial, no la renovación.

**English**

A client with no lease performs the ordinary four-message DHCPv4 allocation exchange. Which order is correct?

- **A.** OFFER → ACK → DISCOVER → REQUEST
- **B.** DISCOVER → REQUEST → OFFER → ACK
- **C.** REQUEST → DISCOVER → ACK → OFFER
- **D.** DISCOVER → OFFER → REQUEST → ACK

The client discovers servers; a server offers configuration; the client requests the chosen offer; the server acknowledges the lease. This describes initial allocation, not lease renewal.

Referencia: https://www.rfc-editor.org/rfc/rfc2131 · 3.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc2131.txt

## 34. dns-query-transport

ID: `ccna-original-20261024-034` · Área: `ip_services` · Dificultad: `basic`

Un cliente envía por UDP una consulta DNS convencional pequeña a un resolvedor recursivo. ¿Qué puerto UDP de destino usa normalmente?

- **A.** 123
- **B.** 67
- **C.** 161
- **D.** 53

**Respuesta(s) propuesta(s): D.** DNS convencional usa el puerto de destino 53 para consultas UDP. DNS también admite TCP y otros transportes, por lo que no se afirma que funcione siempre solo por UDP.

**English**

A client sends a small conventional DNS query over UDP to a recursive resolver. Which destination UDP port does it normally use?

- **A.** 123
- **B.** 67
- **C.** 161
- **D.** 53

Conventional DNS uses destination port 53 for UDP queries. DNS also supports TCP and other transports, so this does not claim that DNS is always UDP-only.

Referencia: https://www.rfc-editor.org/rfc/rfc1035 · 4.2.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc1035.txt

## 35. pat-return-session-mapping

ID: `ccna-original-20261024-035` · Área: `ip_services` · Dificultad: `intermediate`

Una tabla PAT traduce 10.0.0.10:49152 a 192.0.2.10:55001 y 10.0.0.11:49152 a 192.0.2.10:55002. Un paquete TCP de retorno correspondiente llega a 192.0.2.10:55001. ¿Qué destino interno se restablece?

- **A.** 192.0.2.10:49152
- **B.** 10.0.0.10:55002
- **C.** 10.0.0.10:49152
- **D.** 10.0.0.11:49152

**Respuesta(s) propuesta(s): C.** El puerto de destino externo 55001 identifica la primera sesión PAT correspondiente de la tabla. La traducción inversa restablece 10.0.0.10 y su puerto original 49152.

**English**

A PAT table maps inside 10.0.0.10:49152 to outside 192.0.2.10:55001, and 10.0.0.11:49152 to 192.0.2.10:55002. A matching return TCP packet targets 192.0.2.10:55001. Which inside destination is restored?

- **A.** 192.0.2.10:49152
- **B.** 10.0.0.10:55002
- **C.** 10.0.0.10:49152
- **D.** 10.0.0.11:49152

The outside destination port 55001 identifies the first matching PAT session in the supplied table. Reverse translation restores 10.0.0.10 and its original port 49152.

Referencia: https://www.rfc-editor.org/rfc/rfc3022 · 2.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc3022.txt

## 36. ntp-clock-offset

ID: `ccna-original-20261024-036` · Área: `ip_services` · Dificultad: `advanced`

Un intercambio NTP tiene T1=0 ms, T2=30 ms, T3=40 ms y T4=50 ms en la misma escala temporal. Usando ((T2−T1)+(T3−T4))/2, ¿qué desfase servidor menos cliente se estima?

- **A.** +20 ms
- **B.** +10 ms
- **C.** +40 ms
- **D.** −10 ms

**Respuesta(s) propuesta(s): B.** Sustituye las marcas: ((30−0)+(40−50))/2 = (30−10)/2 = +10 ms. La fórmula estima el desfase de reloj, no el retardo de ida y vuelta.

**English**

An NTP exchange has timestamps T1=0 ms, T2=30 ms, T3=40 ms, and T4=50 ms on the same time scale. Using ((T2−T1)+(T3−T4))/2, what server-minus-client clock offset is estimated?

- **A.** +20 ms
- **B.** +10 ms
- **C.** +40 ms
- **D.** −10 ms

Substitute the timestamps: ((30−0)+(40−50))/2 = (30−10)/2 = +10 ms. The formula estimates clock offset, not round-trip delay.

Referencia: https://www.rfc-editor.org/rfc/rfc5905 · 8 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc5905.txt

## 37. syslog-priority-value

ID: `ccna-original-20261024-037` · Área: `ip_services` · Dificultad: `intermediate`

Un mensaje syslog usa facility 16 (local0) y severity 4 (Warning). Con PRI = facility×8 + severity, ¿cuál es su valor PRI?

- **A.** 132
- **B.** 128
- **C.** 164
- **D.** 20

**Respuesta(s) propuesta(s): A.** PRI combina facility y severity, no sus nombres: 16×8+4 = 132. La severidad ocupa los tres bits bajos.

**English**

A syslog message uses facility 16 (local0) and severity 4 (Warning). With PRI = facility×8 + severity, what is its PRI value?

- **A.** 132
- **B.** 128
- **C.** 164
- **D.** 20

PRI combines facility and severity, not their textual names: 16×8+4 = 132. The severity occupies the low three bits.

Referencia: https://www.rfc-editor.org/rfc/rfc5424 · 6.2.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc5424.txt

## 38. acl-first-match

ID: `ccna-original-20261024-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL IPv4 ordenada primero deniega el origen 10.0.0.0/24 y después permite 10.0.0.0/8. ¿Qué acción se aplica al origen 10.0.0.5?

- **A.** Permitir
- **B.** Las acciones se cancelan entre sí
- **C.** Solo se evalúa la línea más larga
- **D.** Denegar

**Respuesta(s) propuesta(s): D.** La evaluación ordenada de ACL termina en la primera entrada coincidente. 10.0.0.5 coincide con el deny /24 inicial; no se usa el permit más amplio posterior para este paquete.

**English**

An ordered IPv4 ACL first denies source 10.0.0.0/24, then permits 10.0.0.0/8. Which action applies to source 10.0.0.5?

- **A.** Permit
- **B.** The actions cancel each other
- **C.** Only the longest ACL line is evaluated
- **D.** Deny

Ordered ACL evaluation stops at the first matching entry. 10.0.0.5 matches the initial deny /24; the later broader permit is never used for this packet.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Protocol specification / configuration guide · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 39. acl-wildcard-match-range

ID: `ccna-original-20261024-039` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una entrada ACL IPv4 usa origen 192.0.2.8 y wildcard 0.0.0.3. ¿Qué intervalo completo de orígenes coincide?

- **A.** 192.0.2.8–192.0.2.11
- **B.** 192.0.2.0–192.0.2.3
- **C.** 192.0.2.9–192.0.2.10
- **D.** 192.0.2.8–192.0.2.15

**Respuesta(s) propuesta(s): A.** La wildcard ignora solo los dos bits finales. Con los otros bits fijados por la base, los cuatro valores son .8, .9, .10 y .11. La ACL coincide con los cuatro, no solo con direcciones de host convencionales.

**English**

An IPv4 ACL entry uses source 192.0.2.8 and wildcard 0.0.0.3. Which complete source range matches?

- **A.** 192.0.2.8–192.0.2.11
- **B.** 192.0.2.0–192.0.2.3
- **C.** 192.0.2.9–192.0.2.10
- **D.** 192.0.2.8–192.0.2.15

The wildcard ignores only the last two bits. With the other bits fixed to the base address, the four values are .8, .9, .10 and .11. ACL matching includes all four, not just conventional subnet host addresses.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Protocol specification / configuration guide · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 40. acl-unmatched-default-deny

ID: `ccna-original-20261024-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL IPv4 de interfaz Cisco aplicada contiene solo entradas permit para 192.0.2.0/24. Un paquete de 198.51.100.7 no coincide con ninguna entrada explícita. ¿Cuál es el resultado de la ACL?

- **A.** NAT automática
- **B.** Denegación implícita
- **C.** Permiso implícito
- **D.** Asignación DHCP automática

**Respuesta(s) propuesta(s): B.** Tras las entradas configuradas, la denegación implícita se aplica al tráfico no coincidente. El escenario usa una ACL aplicada y no vacía; no describe la ausencia de ACL.

**English**

An applied Cisco IPv4 interface ACL contains only permit statements for 192.0.2.0/24. A packet from 198.51.100.7 matches no explicit entry. What is the ACL result?

- **A.** Automatic NAT
- **B.** Implicit deny
- **C.** Implicit permit
- **D.** Automatic DHCP allocation

After the configured entries, the implicit deny applies to unmatched traffic. This concerns an applied, nonempty ACL, not the behavior of an absent ACL.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Protocol specification / configuration guide · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 41. ssh-confidential-management

ID: `ccna-original-20261024-041` · Área: `security_fundamentals` · Dificultad: `basic`

Un administrador necesita acceso remoto interactivo a la CLI con cifrado. ¿Qué protocolo está diseñado para proporcionar esa confidencialidad?

- **A.** Telnet
- **B.** SSH
- **C.** TFTP
- **D.** SNMPv1

**Respuesta(s) propuesta(s): B.** SSH proporciona acceso remoto seguro, con cifrado e integridad después del intercambio de claves. Telnet ordinario no cifra la sesión; TFTP y SNMPv1 no son protocolos de terminal interactivo cifrado.

**English**

An administrator needs encrypted interactive remote CLI access. Which protocol is designed to provide that confidentiality?

- **A.** Telnet
- **B.** SSH
- **C.** TFTP
- **D.** SNMPv1

SSH provides secure remote login, including encryption and integrity protection after key exchange. Ordinary Telnet does not encrypt the terminal session; TFTP and SNMPv1 are not encrypted interactive terminal protocols.

Referencia: https://www.rfc-editor.org/rfc/rfc4251 · 1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4251.txt

## 42. ipsec-tunnel-mode-scope

ID: `ccna-original-20261024-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

En modo túnel IPsec, ¿qué incluye el paquete IP interno encapsulado antes de añadir una nueva cabecera IP externa?

- **A.** Solo una consulta DNS
- **B.** La cabecera IP original y su carga útil
- **C.** Solo el texto de aplicación TCP, nunca cabeceras
- **D.** Solo la MAC de destino original

**Respuesta(s) propuesta(s): B.** El modo túnel encapsula el paquete IP original, incluida su cabecera. Una nueva cabecera externa identifica los extremos del túnel. Qué partes se cifran o autentican depende del protocolo IPsec y la configuración.

**English**

In IPsec tunnel mode, what does the encapsulated inner IP packet include before a new outer IP header is added?

- **A.** Only a DNS query
- **B.** The original IP header and its payload
- **C.** Only the TCP application text, never any headers
- **D.** Only the original destination MAC

Tunnel mode encapsulates the original IP packet, including its original IP header. A new outer header addresses the tunnel endpoints. Which parts are encrypted or authenticated depends on the IPsec protocol and configuration.

Referencia: https://www.rfc-editor.org/rfc/rfc4301 · 3.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4301.txt

## 43. tls-service-identity

ID: `ccna-original-20261024-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un cliente HTTPS confía en la cadena de certificados, pero el certificado no identifica el hostname solicitado. ¿Qué debe hacer un cliente que valida correctamente?

- **A.** Aceptar porque un emisor confiable valida cualquier hostname
- **B.** Desactivar permanentemente la validación
- **C.** Rechazar la comprobación de identidad en lugar de aceptar silenciosamente
- **D.** Usar el número de serie como hostname

**Respuesta(s) propuesta(s): C.** La validación de la cadena de confianza y la coincidencia de identidad del servicio son requisitos distintos. Un certificado confiable de otro servicio no autentica el hostname solicitado.

**English**

An HTTPS client trusts a certificate chain, but the certificate does not identify the requested hostname. What should a properly validating client do?

- **A.** Accept because a trusted issuer makes every hostname valid
- **B.** Disable certificate validation permanently
- **C.** Reject the identity check rather than silently accepting
- **D.** Use the certificate serial number as the hostname

Trust-chain validation and service-identity matching are separate requirements. A trusted certificate for another service does not authenticate the requested hostname.

Referencia: https://www.rfc-editor.org/rfc/rfc9525 · 6 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc9525.txt

## 44. least-privilege-access

ID: `ccna-original-20261024-044` · Área: `security_fundamentals` · Dificultad: `basic`

Un analista solo necesita leer el estado de dispositivos e informes. Según mínimo privilegio, ¿qué rol debe recibir?

- **A.** Una contraseña root compartida por toda la empresa
- **B.** Permiso para eliminar registros de auditoría
- **C.** Administrador sin restricciones
- **D.** Un rol de solo lectura limitado a los recursos necesarios

**Respuesta(s) propuesta(s): D.** El mínimo privilegio concede solo los permisos necesarios para la tarea. La lectura de los recursos pertinentes satisface el requisito sin autoridad de configuración ni eliminación.

**English**

An analyst only needs to read device status and reports. Under least privilege, which role should be granted?

- **A.** A shared root password used by the entire company
- **B.** Permission to delete audit logs
- **C.** Unrestricted administrator
- **D.** A read-only role limited to the required resources

Least privilege grants only the permissions necessary for the task. Read-only access to the relevant resources satisfies the requirement without configuration or deletion authority.

Referencia: https://www.rfc-editor.org/rfc/rfc4949 · least privilege · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc4949.txt

## 45. port-security-protect-mode

ID: `ccna-original-20261024-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un puerto access Cisco usa port security en modo protect y ya aprendió el máximo de dos MAC seguras. Llega una trama desde una tercera MAC de origen desconocida. ¿Qué comportamiento se espera del modo protect?

- **A.** Reemplazar automáticamente la primera MAC segura
- **B.** Poner siempre todo el switch en err-disable
- **C.** Aumentar automáticamente el máximo a tres
- **D.** Descartar el tráfico del origen desconocido sin apagar el puerto

**Respuesta(s) propuesta(s): D.** El modo protect descarta tramas de orígenes desconocidos tras alcanzar el límite, pero permite los orígenes seguros conocidos. Shutdown y restrict tienen otros comportamientos; no deben confundirse con protect.

**English**

A Cisco switch access port uses port security in protect mode, with a maximum of two secure MAC addresses already learned. A frame arrives from a third unknown source MAC. What is the expected protect-mode behavior?

- **A.** Replace the first secure MAC automatically
- **B.** Always err-disable the entire switch
- **C.** Increase the maximum to three automatically
- **D.** Drop traffic from the unknown source without shutting down the port

Protect mode drops frames from unknown sources after the secure-MAC limit is reached, while allowing known secure sources. Shutdown and restrict have different violation behavior; do not conflate them with protect.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg.html · Protocol specification / configuration guide · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. json-valid-object

ID: `ccna-original-20261024-046` · Área: `automation_programmability` · Dificultad: `basic`

¿Qué cadena es un objeto JSON válido para el cuerpo de una petición API?

- **A.** {"enabled":True,"vlan":20}
- **B.** {'enabled':true,'vlan':20}
- **C.** {"enabled":true,"vlan":20,}
- **D.** {"enabled":true,"vlan":20}

**Respuesta(s) propuesta(s): D.** JSON exige nombres entre comillas dobles, literales true/false/null en minúsculas y ausencia de coma final. La forma correcta cumple las tres reglas. JSON no equivale a un literal de objeto de JavaScript o Python.

**English**

Which string is a valid JSON object suitable for an API request body?

- **A.** {"enabled":True,"vlan":20}
- **B.** {'enabled':true,'vlan':20}
- **C.** {"enabled":true,"vlan":20,}
- **D.** {"enabled":true,"vlan":20}

JSON requires double-quoted member names, lowercase true/false/null literals, and no trailing comma. The valid form satisfies all three rules. JSON is not identical to a JavaScript or Python object literal.

Referencia: https://www.rfc-editor.org/rfc/rfc8259 · 4 and 3 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

Documento consultado: https://www.rfc-editor.org/rfc/rfc8259.txt

## 47. http-resource-created

ID: `ccna-original-20261024-047` · Área: `automation_programmability` · Dificultad: `basic`

Una petición HTTP correcta ha creado un recurso nuevo y el servidor devuelve una cabecera Location que lo identifica. ¿Qué código describe específicamente este resultado?

- **A.** 204
- **B.** 404
- **C.** 202
- **D.** 201

**Respuesta(s) propuesta(s): D.** 201 Created indica creación correcta. 202 significa aceptación para procesar sin garantizar que haya terminado; 204 indica éxito sin contenido de respuesta; 404 indica que no se encontró el recurso.

**English**

A successful HTTP request has created a new resource, and the server returns a Location header identifying it. Which status code specifically describes this outcome?

- **A.** 204
- **B.** 404
- **C.** 202
- **D.** 201

201 Created indicates successful creation. 202 means accepted for processing without guaranteeing completion; 204 indicates success with no response content; 404 indicates not found.

Referencia: https://www.rfc-editor.org/rfc/rfc9110 · 15.3.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc9110.txt

## 48. http-put-idempotence

ID: `ccna-original-20261024-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API usa PUT para reemplazar la representación deseada de una interfaz identificada. ¿Qué significa idempotencia al repetir la misma petición válida?

- **A.** Los bytes de respuesta deben ser siempre idénticos
- **B.** El servidor nunca puede registrar la petición
- **C.** Cada repetición debe crear otra interfaz
- **D.** El estado deseado del recurso es el mismo que tras una petición

**Respuesta(s) propuesta(s): D.** La idempotencia se refiere al efecto previsto sobre el recurso, no a respuestas idénticas ni a la ausencia de registros. Repetir el mismo reemplazo no crea acumulativamente más recursos identificados.

**English**

An API uses PUT to replace the desired representation of a named interface resource. What does idempotence mean when the same valid request is repeated?

- **A.** The response bytes must always be identical
- **B.** The server must never record a request log
- **C.** Every repeated request must create another interface
- **D.** The intended resource state is the same as after one request

Idempotence concerns the intended effect on resource state, not identical responses or absence of logging. Repeating the same replacement does not cumulatively create more named resources.

Referencia: https://www.rfc-editor.org/rfc/rfc9110 · 9.2.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc9110.txt

## 49. restconf-json-media-type

ID: `ccna-original-20261024-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Un cliente RESTCONF solicita un recurso de datos YANG en su representación JSON. ¿Qué tipo de medio Accept identifica esa representación?

- **A.** application/yang-data+json
- **B.** application/octet-stream
- **C.** text/html
- **D.** image/png

**Respuesta(s) propuesta(s): A.** RESTCONF define application/yang-data+json para datos YANG codificados en JSON. Accept indica la representación deseada de la respuesta; Content-Type describe el cuerpo que realmente se envía.

**English**

A RESTCONF client requests a YANG data resource using its JSON representation. Which Accept media type identifies that representation?

- **A.** application/yang-data+json
- **B.** application/octet-stream
- **C.** text/html
- **D.** image/png

RESTCONF defines application/yang-data+json for JSON-encoded YANG data. The Accept header specifies the representation the client wants in the response; Content-Type describes the body actually sent.

Referencia: https://www.rfc-editor.org/rfc/rfc8040 · 11.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc8040.txt

## 50. netconf-ssh-port

ID: `ccna-original-20261024-050` · Área: `automation_programmability` · Dificultad: `basic`

Un cliente NETCONF usa el puerto de servicio estándar de NETCONF sobre SSH, sin una configuración personalizada. ¿Qué puerto TCP de destino debe usar?

- **A.** 161
- **B.** 22
- **C.** 830
- **D.** 443

**Respuesta(s) propuesta(s): C.** El puerto TCP estándar asignado a NETCONF sobre SSH es 830. El acceso remoto SSH ordinario suele usar 22; el escenario trata específicamente del servicio NETCONF.

**English**

A NETCONF client uses the standard NETCONF-over-SSH service port, without a custom override. Which TCP destination port should it use?

- **A.** 161
- **B.** 22
- **C.** 830
- **D.** 443

The assigned default TCP port for NETCONF over SSH is 830. Ordinary SSH remote login commonly uses 22; this question specifically concerns the NETCONF service binding.

Referencia: https://www.rfc-editor.org/rfc/rfc6242 · 3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

Documento consultado: https://www.rfc-editor.org/rfc/rfc6242.txt
