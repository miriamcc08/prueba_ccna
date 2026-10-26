# Lote original: original-20261024-b03-50

Estado: **pendiente de revisión técnica y de traducción**. El estado de consulta y la evidencia de cada referencia figuran en el JSON. Las comprobaciones ejecutables de cálculo/escenario y la consulta documental no constituyen aprobación editorial completa.

Los ejercicios relacionados comparten familia y no se cuentan como conceptos independientes. La equivalencia semántica con todo el banco sigue en revisión. El texto se creó para el proyecto.

| Área | Preguntas |
|---|---:|
| network_fundamentals | 10 |
| network_access | 10 |
| ip_connectivity | 12 |
| ip_services | 5 |
| security_fundamentals | 8 |
| automation_programmability | 5 |

El reparto de 50 requiere redondear los medios puntos de IP Connectivity y Security Fundamentals; no se afirma aquí haber confirmado la versión vigente del temario.

## 1. tcp-next-expected-byte

ID: `ccna-original-20261024-b03-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un segmento TCP tiene SEQ=1000 y 600 bytes de datos, sin SYN ni FIN. El receptor tiene todos los bytes anteriores y lo recibe en orden. ¿Qué ACK acumulativo debe devolver?

- **A.** 1600
- **B.** 1001
- **C.** 600
- **D.** 1599

**Respuesta(s) propuesta(s): A.** ACK TCP identifica el siguiente byte esperado. El segmento cubre las secuencias 1000 a 1599 y el siguiente byte es 1600; ACK no cuenta segmentos recibidos.

**English**

A TCP segment has SEQ=1000 and carries 600 data bytes, with neither SYN nor FIN. The receiver has all earlier bytes and receives this segment in order. What cumulative ACK should it return?

- **A.** 1600
- **B.** 1001
- **C.** 600
- **D.** 1599

TCP ACK identifies the next byte expected. The segment covers sequence numbers 1000 through 1599, so the next expected byte is 1600; ACK is not the count of segments received.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 2. tcp-fin-sequence-consumption

ID: `ccna-original-20261024-b03-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un segmento TCP tiene SEQ=4000, lleva 100 bytes de datos y FIN=1, SYN=0. Todos los datos anteriores llegaron en orden. ¿Qué secuencia siguiente confirma los datos y FIN?

- **A.** 4001
- **B.** 4101
- **C.** 4100
- **D.** 4099

**Respuesta(s) propuesta(s): B.** Los 100 bytes ocupan 4000–4099 y FIN consume una secuencia adicional. Confirmar ambos requiere 4101. SYN y FIN consumen cada uno una posición de secuencia cuando están presentes.

**English**

A TCP segment has SEQ=4000, carries 100 data bytes and has FIN=1, SYN=0. All earlier data arrived in order. What next sequence number acknowledges the data and FIN?

- **A.** 4001
- **B.** 4101
- **C.** 4100
- **D.** 4099

The 100 data bytes occupy 4000–4099, and FIN consumes one additional sequence number. Acknowledging both therefore requires 4101. SYN and FIN each consume sequence space when present.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 3. tcp-flight-window-limits

ID: `ccna-original-20261024-b03-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un emisor tiene ventana de congestión de 20 KiB y ventana de recepción anunciada de 12 KiB. Ignorando otros límites, ¿qué máximo de datos pendientes permiten estas ventanas?

- **A.** 8192 bytes
- **B.** 32768 bytes
- **C.** 20480 bytes
- **D.** 12288 bytes

**Respuesta(s) propuesta(s): D.** Los datos pendientes se limitan por la menor ventana, de congestión o recepción. min(20,12) KiB son 12×1024 = 12288 bytes. Congestión y control de flujo del receptor imponen restricciones distintas.

**English**

A sender has a congestion window of 20 KiB and an advertised receive window of 12 KiB. Ignoring other limits, what is the maximum outstanding data allowed by these two windows?

- **A.** 8192 bytes
- **B.** 32768 bytes
- **C.** 20480 bytes
- **D.** 12288 bytes

Outstanding data is limited by the smaller of congestion and receive windows. min(20,12) KiB is 12×1024 = 12288 bytes. Congestion control and receiver flow control impose separate constraints.

Referencia: https://www.rfc-editor.org/rfc/rfc5681.txt · 2 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 4. udp-length-payload

ID: `ccna-original-20261024-b03-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una cabecera UDP indica Length=60 bytes y la cabecera mide 8 bytes. ¿Cuántos bytes de carga útil UDP hay?

- **A.** 68
- **B.** 8
- **C.** 52
- **D.** 60

**Respuesta(s) propuesta(s): C.** Length UDP incluye cabecera y datos, por lo que la carga útil es 60−8 = 52 bytes. No incluye la cabecera IP envolvente.

**English**

A UDP header states Length=60 bytes. UDP has an 8-byte header. How many bytes of UDP payload are present?

- **A.** 68
- **B.** 8
- **C.** 52
- **D.** 60

UDP Length includes its header and data, so payload = 60−8 = 52 bytes. It does not include the enclosing IP header.

Referencia: https://www.rfc-editor.org/rfc/rfc768.txt · Format · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 5. ipv4-ihl-options-budget

ID: `ccna-original-20261024-b03-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un datagrama IPv4 tiene IHL=6 y Total Length=1000 bytes. ¿Cuántos bytes quedan después de la cabecera IPv4?

- **A.** 980
- **B.** 1000
- **C.** 976
- **D.** 994

**Respuesta(s) propuesta(s): C.** IHL se mide en palabras de 32 bits: la cabecera tiene 6×4 = 24 bytes. La carga útil IP es 1000−24 = 976 bytes; suponer 20 bytes ignoraría las opciones.

**English**

An IPv4 datagram has IHL=6 and Total Length=1000 bytes. How many bytes remain after its IPv4 header?

- **A.** 980
- **B.** 1000
- **C.** 976
- **D.** 994

IHL is measured in 32-bit words, so the header is 6×4 = 24 bytes. The IP payload is 1000−24 = 976 bytes; assuming a fixed 20-byte header would ignore the options.

Referencia: https://www.rfc-editor.org/rfc/rfc791.txt · 3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 6. dscp-ecn-bit-packing

ID: `ccna-original-20261024-b03-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

El campo DS de ocho bits contiene DSCP=46 en los seis bits altos y ECN=3 en los dos bajos. ¿Qué valor decimal tiene el byte completo?

- **A.** 187
- **B.** 46
- **C.** 49
- **D.** 184

**Respuesta(s) propuesta(s): A.** Desplaza DSCP dos posiciones y añade ECN: (46×4)+3 = 187. Sumar DSCP y ECN sin desplazar confunde sus posiciones de bits.

**English**

The eight-bit IP DS field contains DSCP=46 in its upper six bits and ECN=3 in its lower two bits. What is the decimal value of the complete byte?

- **A.** 187
- **B.** 46
- **C.** 49
- **D.** 184

Shift the six-bit DSCP left by two positions and include ECN: (46×4)+3 = 187. Adding DSCP and ECN without shifting mixes their bit positions.

Referencia: https://www.rfc-editor.org/rfc/rfc3168.txt · 5 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 7. ipv6-documentation-prefix-use

ID: `ccna-original-20261024-b03-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

¿Cuál es el uso previsto del prefijo IPv6 2001:db8::/32?

- **A.** Una asignación global que cualquier empresa puede desplegar sin asignación
- **B.** Ejemplos y documentación, no direccionamiento de producción en Internet
- **C.** Todos los grupos multicast IPv6
- **D.** El prefijo link-local obligatorio de toda interfaz IPv6

**Respuesta(s) propuesta(s): B.** 2001:db8::/32 se reserva para documentación. Usarlo en ejemplos evita presentar asignaciones reales arbitrarias como espacio de ejemplo. No es fe80::/10 ni ff00::/8.

**English**

What is the intended use of IPv6 prefix 2001:db8::/32?

- **A.** A globally routable allocation for any company to deploy without assignment
- **B.** Examples and documentation rather than production Internet addressing
- **C.** All IPv6 multicast groups
- **D.** The mandatory link-local prefix on every IPv6 interface

2001:db8::/32 is reserved for documentation. Its use in training examples avoids treating an arbitrary real allocation as example space. It is not fe80::/10 or ff00::/8.

Referencia: https://www.rfc-editor.org/rfc/rfc3849.txt · 2 and 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 8. ipv4-documentation-addresses

ID: `ccna-original-20261024-b03-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

Selecciona dos direcciones IPv4 pertenecientes a los intervalos de documentación de RFC 5737.

- **A.** 198.51.100.25
- **B.** 203.0.113.8
- **C.** 127.0.0.1
- **D.** 10.2.3.4

**Respuesta(s) propuesta(s): A, B.** Los bloques de documentación son 192.0.2.0/24, 198.51.100.0/24 y 203.0.113.0/24. Las otras alternativas son privada y loopback, no bloques RFC 5737.

**English**

Select two IPv4 addresses drawn from RFC 5737 documentation ranges.

- **A.** 198.51.100.25
- **B.** 203.0.113.8
- **C.** 127.0.0.1
- **D.** 10.2.3.4

The documentation blocks are 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24. The other choices are private and loopback addresses, not RFC 5737 documentation blocks.

Referencia: https://www.rfc-editor.org/rfc/rfc5737.txt · 3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 9. rfc1918-boundary-classification

ID: `ccna-original-20261024-b03-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Selecciona dos direcciones que pertenezcan específicamente al espacio privado IPv4 RFC 1918.

- **A.** 172.32.4.5
- **B.** 172.31.4.5
- **C.** 10.7.8.9
- **D.** 100.64.0.1

**Respuesta(s) propuesta(s): B, C.** RFC 1918 reserva 10/8, 172.16/12 y 192.168/16. 172.31 pertenece al segundo bloque; 172.32 queda fuera. El espacio compartido 100.64/10 no es privado RFC 1918.

**English**

Select two addresses that belong specifically to RFC 1918 private IPv4 space.

- **A.** 172.32.4.5
- **B.** 172.31.4.5
- **C.** 10.7.8.9
- **D.** 100.64.0.1

RFC 1918 reserves 10/8, 172.16/12 and 192.168/16. 172.31 is inside the second block; 172.32 is outside. Shared address space 100.64/10 is not RFC 1918 private space.

Referencia: https://www.rfc-editor.org/rfc/rfc1918.txt · 3 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 10. arp-versus-bridge-forwarding-table

ID: `ccna-original-20261024-b03-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

Selecciona dos asociaciones correctas para el reenvío ordinario IPv4 sobre Ethernet.

- **A.** ARP calcula la distancia administrativa OSPF
- **B.** La tabla MAC sustituye todas las búsquedas de rutas IP
- **C.** La tabla de reenvío de un switch asocia MAC aprendidas con puertos y contexto VLAN
- **D.** ARP asocia una IPv4 de siguiente salto local con una MAC Ethernet

**Respuesta(s) propuesta(s): C, D.** ARP resuelve la identidad de capa de enlace necesaria en el enlace local. Una tabla de bridge hace otra búsqueda, de MAC/contexto VLAN a puerto de salida; ninguna es una tabla de métricas de routing.

**English**

Select two correct associations for ordinary IPv4-over-Ethernet forwarding.

- **A.** ARP computes the administrative distance of OSPF
- **B.** The MAC table replaces every IP routing lookup
- **C.** A switch forwarding table associates learned MAC addresses with ports and VLAN context
- **D.** ARP associates a local next-hop IPv4 address with an Ethernet MAC

ARP resolves the link-layer identity needed on the local link. A bridge forwarding table makes a different lookup, from MAC/VLAN context to an egress port; neither is a dynamic routing metric table.

Referencia: https://www.rfc-editor.org/rfc/rfc826.txt · Protocol and packet reception; bridge-table association requires companion L2 review · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 11. stp-received-plus-local-cost

ID: `ccna-original-20261024-b03-011` · Área: `network_access` · Dificultad: `intermediate`

Un switch alcanza el mismo root STP por A, que anuncia costo 4 mediante un puerto local de costo 19, o por B, que anuncia costo 8 mediante un puerto local de costo 4. ¿Qué candidato tiene menor costo total?

- **A.** B
- **B.** Ambos suman 12
- **C.** Ambos suman 23
- **D.** A

**Respuesta(s) propuesta(s): A.** Incluye el costo anunciado hacia root y el costo del puerto local. A suma 23 y B suma 12. Elegir solo el menor valor anunciado ignoraría el costo para llegar al vecino.

**English**

A switch can reach the same STP root via neighbor A, advertising cost 4 over a local port of cost 19, or neighbor B, advertising cost 8 over a local port of cost 4. Which candidate has the lower total root path cost?

- **A.** B
- **B.** Both total 12
- **C.** Both total 23
- **D.** A

Include both the received root path cost and the local port cost. A totals 23; B totals 12. Choosing only the smaller advertised value would ignore the cost of reaching that neighbor.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Root Path Cost · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 12. stp-designated-port-cost-before-bid

ID: `ccna-original-20261024-b03-012` · Área: `network_access` · Dificultad: `intermediate`

Dos switches compiten para ser designado en una LAN y anuncian el mismo root. A anuncia costo 10; B anuncia 20 pero tiene bridge ID menor. ¿Cuál anuncia la información superior para esa LAN?

- **A.** El costo no importa en la elección de puerto designado
- **B.** A
- **C.** B
- **D.** Siempre gana la MAC mayor

**Respuesta(s) propuesta(s): B.** Para el mismo root se compara el menor costo anunciado antes del bridge ID emisor. El costo 10 de A gana frente a 20; bridge ID desempata después de criterios anteriores iguales.

**English**

Two switches compete to be designated on one LAN. Both advertise the same root. A advertises root path cost 10; B advertises 20 but has a lower bridge ID. Which switch advertises the superior information for that LAN?

- **A.** Cost is irrelevant to a designated-port election
- **B.** A
- **C.** B
- **D.** The higher MAC always wins

For the same root, lower advertised root path cost is compared before the sender bridge ID. A’s cost 10 wins over 20; bridge ID would matter only after earlier criteria tied.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Designated Port Selection · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 13. portfast-keeps-stp

ID: `ccna-original-20261024-b03-013` · Área: `network_access` · Dificultad: `intermediate`

¿Qué afirmación describe correctamente PortFast en un puerto access de borde previsto?

- **A.** Permite una transición inicial rápida, pero no desactiva el procesamiento STP
- **B.** Convierte automáticamente al switch en root
- **C.** Sustituye la necesidad de usar correctamente puertos de borde
- **D.** Desactiva todos los BPDU y garantiza que no haya bucles

**Respuesta(s) propuesta(s): A.** PortFast acelera la transición en puertos de borde adecuados. No elimina STP ni vuelve seguras conexiones arbitrarias entre switches; mecanismos separados como BPDU Guard cumplen otras funciones.

**English**

Which statement correctly describes enabling PortFast on an intended edge access port?

- **A.** It allows an initial rapid transition but does not disable STP processing
- **B.** It automatically makes the switch the root
- **C.** It replaces the need for correct edge-port placement
- **D.** It disables all BPDUs and guarantees loops are impossible

PortFast accelerates the transition for appropriate edge ports. It does not remove STP or make arbitrary switch-to-switch connections safe; separate safeguards such as BPDU Guard serve other purposes.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_optional_spanning_tree_features.html · PortFast · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. port-security-restrict-telemetry

ID: `ccna-original-20261024-b03-014` · Área: `network_access` · Dificultad: `intermediate`

Ocurre una infracción port-security en un puerto Cisco configurado en modo restrict. Selecciona dos comportamientos esperados.

- **A.** Se contabiliza la infracción y puede generarse una notificación
- **B.** El puerto debe pasar siempre a modo de infracción shutdown
- **C.** Se reenvía toda trama infractora después de registrarla
- **D.** Se descartan las tramas del origen desconocido infractor

**Respuesta(s) propuesta(s): A, D.** Restrict descarta el tráfico infractor y añade contabilización/notificación. Protect también descarta tráfico desconocido pero informa de otra manera; shutdown es otro modo de infracción.

**English**

A port-security violation occurs on a Cisco port configured in restrict mode. Select two expected behaviors.

- **A.** The violation is counted and notification can be generated
- **B.** The port must always enter shutdown violation mode
- **C.** Every violating frame is forwarded after logging
- **D.** Frames from the violating unknown source are dropped

Restrict drops violating traffic and adds violation accounting/notification behavior. Protect also drops unknown traffic but has different reporting behavior; shutdown is a separate violation mode.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/port_security.html · Security Violation Modes · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 15. trunk-allowed-versus-stp-forwarding

ID: `ccna-original-20261024-b03-015` · Área: `network_access` · Dificultad: `intermediate`

VLAN 20 está permitida en ambos extremos de un troncal, pero STP bloquea ese troncal para VLAN 20. ¿Puede su tráfico de datos ordinario usar ese camino bloqueado?

- **A.** Sí; las VLAN permitidas siempre ignoran el estado STP
- **B.** Sí; toda trama etiquetada omite la prevención de bucles
- **C.** Solo si el identificador VLAN es impar
- **D.** No; la lista de VLAN permitidas no anula el bloqueo STP

**Respuesta(s) propuesta(s): D.** La admisión en el troncal y el estado de reenvío spanning-tree son condiciones distintas. Ambas deben permitir el camino; autorizar la VLAN no obliga a un puerto bloqueado a reenviar datos.

**English**

VLAN 20 is allowed on both ends of a trunk, but STP blocks that trunk for VLAN 20. Can ordinary VLAN 20 data use this blocked path?

- **A.** Yes; allowed VLANs always ignore STP state
- **B.** Yes; every tagged frame bypasses loop prevention
- **C.** Only if the VLAN ID is odd
- **D.** No; an allowed-VLAN list does not override STP blocking

Admission on the trunk and spanning-tree forwarding state are separate conditions. Both must permit the data path; allowing the VLAN does not force a blocked port to forward user traffic.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Port States · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 16. etherchannel-negotiation-protocol-pairs

ID: `ccna-original-20261024-b03-016` · Área: `network_access` · Dificultad: `intermediate`

Selecciona dos pares de negociación compatibles para EtherChannel, suponiendo parámetros físicos y de capa 2 coincidentes.

- **A.** PAgP desirable con PAgP auto
- **B.** LACP active con LACP passive
- **C.** LACP active con PAgP auto
- **D.** LACP passive con PAgP desirable

**Respuesta(s) propuesta(s): A, B.** LACP y PAgP son protocolos de negociación distintos. En LACP, active inicia hacia passive; en PAgP, desirable inicia hacia auto. Mezclar protocolos no forma el agregado negociado previsto.

**English**

Select two compatible negotiation pairs for an EtherChannel, assuming matching physical and Layer 2 settings.

- **A.** PAgP desirable with PAgP auto
- **B.** LACP active with LACP passive
- **C.** LACP active with PAgP auto
- **D.** LACP passive with PAgP desirable

LACP and PAgP are different negotiation protocols. Within LACP, active can initiate toward passive; within PAgP, desirable can initiate toward auto. Mixing protocols does not form the expected negotiated bundle.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · PAgP and LACP Modes · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 17. static-channel-mode-on-no-negotiation

ID: `ccna-original-20261024-b03-017` · Área: `network_access` · Dificultad: `intermediate`

Un miembro EtherChannel Cisco está en modo on en lugar de un modo LACP negociado. ¿Qué propiedad importante se deriva?

- **A.** Obliga a todo puerto vecino a ser passive
- **B.** No negocia la formación del agregado mediante LACP
- **C.** Verifica toda configuración remota con LACP antes de reenviar
- **D.** Negocia automáticamente LACP y PAgP a la vez

**Respuesta(s) propuesta(s): B.** El modo on habilita estáticamente el agregado sin negociación LACP/PAgP. Es esencial configurar coherentemente ambos extremos; el modo estático no ofrece las comprobaciones negociadas de LACP.

**English**

A Cisco EtherChannel member is configured in on mode rather than a negotiated LACP mode. What important property follows?

- **A.** It forces every neighboring port to become passive
- **B.** It does not negotiate channel formation using LACP
- **C.** It verifies every remote configuration using LACP before forwarding
- **D.** It automatically negotiates both LACP and PAgP simultaneously

On mode statically enables channeling without LACP/PAgP negotiation. Matching configuration at both ends is essential; static mode does not provide the negotiation checks of LACP.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · EtherChannel On Mode · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. wireless-snr-from-dbm

ID: `ccna-original-20261024-b03-018` · Área: `network_access` · Dificultad: `intermediate`

Un receptor inalámbrico mide señal −64 dBm y ruido −94 dBm. Con SNR(dB)=señal(dBm)−ruido(dBm), ¿qué SNR resulta?

- **A.** −30 dB
- **B.** 30 dB
- **C.** 158 dB
- **D.** −158 dB

**Respuesta(s) propuesta(s): B.** La resta de niveles logarítmicos da −64−(−94)=30 dB. Es una relación de potencias, no una potencia absoluta en dBm, y por sí sola no garantiza un rendimiento.

**English**

A wireless receiver measures signal power −64 dBm and noise floor −94 dBm. Using SNR(dB)=signal(dBm)−noise(dBm), what SNR results?

- **A.** −30 dB
- **B.** 30 dB
- **C.** 158 dB
- **D.** −158 dB

Subtracting the two logarithmic power levels gives −64−(−94)=30 dB. This is a power ratio, not an absolute received power in dBm, and it does not alone guarantee a throughput.

Referencia: https://www.rfc-editor.org/rfc/rfc5416.txt · IEEE 802.11 radio information and SNR fields · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 19. ssid-versus-bssid-identity

ID: `ccna-original-20261024-b03-019` · Área: `network_access` · Dificultad: `intermediate`

Dos puntos de acceso anuncian el mismo SSID de una WLAN. ¿Por qué puede el cliente distinguir sus conjuntos de servicio básicos?

- **A.** Los clientes no pueden distinguir AP que anuncian el mismo nombre
- **B.** Un SSID debe ser globalmente único por AP físico
- **C.** Todos los AP de un SSID deben compartir una sola MAC de radio física
- **D.** Los BSSID identifican los conjuntos de servicio básicos distintos

**Respuesta(s) propuesta(s): D.** El SSID nombra la red de servicio y el BSSID identifica un BSS concreto. Reutilizar SSID entre AP no hace que sus BSSID sean iguales.

**English**

Two access points advertise the same SSID for one WLAN. Why can a client still distinguish their basic service sets?

- **A.** Clients cannot distinguish APs advertising the same network name
- **B.** An SSID must be globally unique for each physical AP
- **C.** Every AP in one SSID must share one physical radio MAC
- **D.** The BSSIDs identify the distinct basic service sets

The SSID names the service network, while a BSSID identifies a particular BSS. Reusing an SSID across APs does not make their BSSIDs identical.

Referencia: https://www.rfc-editor.org/rfc/rfc5416.txt · 2.5 BSSID to WLAN ID Mapping · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. capwap-control-data-ports

ID: `ccna-original-20261024-b03-020` · Área: `network_access` · Dificultad: `intermediate`

Selecciona dos asociaciones de puerto UDP de destino predeterminado para CAPWAP.

- **A.** Canal de control: 1812
- **B.** Canal de datos: 49
- **C.** Canal de control: 5246
- **D.** Canal de datos: 5247

**Respuesta(s) propuesta(s): C, D.** CAPWAP asigna UDP 5246 a control y UDP 5247 a datos. No deben confundirse con RADIUS de autenticación ni TACACS+ de gestión.

**English**

Select two default UDP destination-port associations for CAPWAP.

- **A.** Control channel: 1812
- **B.** Data channel: 49
- **C.** Control channel: 5246
- **D.** Data channel: 5247

CAPWAP assigns UDP 5246 for control and UDP 5247 for data. These service bindings should not be confused with RADIUS authentication or TACACS+ management.

Referencia: https://www.rfc-editor.org/rfc/rfc5415.txt · 11 IANA Considerations · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 21. recursive-route-resolution-cycle

ID: `ccna-original-20261024-b03-021` · Área: `ip_connectivity` · Dificultad: `advanced`

Dos rutas estáticas dependen recursivamente del siguiente salto de la otra, y ninguno se resuelve a un camino conectado o alcanzable de forma independiente. ¿Por qué no es utilizable la configuración?

- **A.** La búsqueda recursiva carece de un punto de reenvío resoluble
- **B.** El bucle recursivo crea una interfaz física nueva
- **C.** El siguiente salto numéricamente mayor se vuelve conectado
- **D.** La configuración estática garantiza alcance extremo a extremo

**Respuesta(s) propuesta(s): A.** Un siguiente salto recursivo debe terminar en un camino utilizable. Las dependencias circulares sin una ruta independiente no establecen interfaz de salida ni vecino.

**English**

Two static routes depend recursively on each other’s next-hop reachability, and neither next hop resolves to any connected or independently reachable path. Why is the configuration unusable?

- **A.** The recursive lookup has no resolvable forwarding anchor
- **B.** A recursive loop creates a new physical interface
- **C.** The numerically larger next hop automatically becomes connected
- **D.** Static configuration guarantees end-to-end reachability

A recursive next hop must ultimately resolve to a usable forwarding path. Circular dependencies without an independent route do not establish an egress interface or neighbor.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.4.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 22. ospf-intra-before-inter-area

ID: `ccna-original-20261024-b03-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos rutas OSPF elegibles describen exactamente el mismo prefijo: una intraárea con costo 100 y otra interárea con costo 10. ¿Qué tipo de camino OSPF se prefiere?

- **A.** La ruta intraárea
- **B.** La ruta con router ID mayor
- **C.** La interárea solo porque 10 es menor
- **D.** Siempre deben instalarse como ECMP

**Respuesta(s) propuesta(s): A.** La preferencia de tipo OSPF precede a comparar costos de estas clases: intraárea se prefiere a interárea para el mismo destino. Un número menor de otra clase no anula esa regla.

**English**

Two eligible OSPF routes describe the exact same prefix: one intra-area route with cost 100 and one inter-area route with cost 10. Which OSPF path type is preferred?

- **A.** The intra-area route
- **B.** The route with the higher router ID
- **C.** The inter-area route solely because 10 is smaller
- **D.** They must always be installed as ECMP

OSPF path-type preference is considered before comparing costs across these types: intra-area is preferred to inter-area for the same destination. A smaller number from another path class does not override that rule.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 23. ospf-local-cost-asymmetry

ID: `ccna-original-20261024-b03-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos vecinos OSPF coinciden en área, temporizadores y autenticación, pero asignan costos de salida distintos a sus interfaces del enlace. ¿Impide esa diferencia de costo por sí sola una adyacencia Full?

- **A.** Sí; ambos costos deben ser siempre idénticos
- **B.** Sí; el costo es la contraseña de autenticación OSPF
- **C.** No; OSPF nunca usa costos de interfaz
- **D.** No; los costos pueden ser asimétricos sin ser una condición de compatibilidad Hello

**Respuesta(s) propuesta(s): D.** OSPF anuncia costos direccionales de interfaz en su topología. Los costos diferentes pueden afectar caminos, pero su igualdad no es por sí sola una comprobación de compatibilidad Hello.

**English**

Two OSPF neighbors have matching area, timers and authentication, but assign different outgoing costs to their respective interfaces on the link. Does that cost difference alone prevent a Full adjacency?

- **A.** Yes; both interface costs must always be identical
- **B.** Yes; cost is the OSPF authentication password
- **C.** No; OSPF never uses interface costs
- **D.** No; interface costs can be asymmetric without being a Hello compatibility condition

OSPF advertises directional interface costs in its topology information. Different costs can affect path selection, but cost equality is not itself a Hello neighbor-compatibility check.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 9 and 10.5 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 24. ospf-dbd-mtu-mismatch

ID: `ccna-original-20261024-b03-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Vecinos OSPF Ethernet quedan en ExStart/Exchange. Uno recibe un Database Description cuyo Interface MTU supera lo que puede recibir y no se deshabilitó la comprobación. ¿Qué problema encaja?

- **A.** Una condición obligatoria de que todo par quede Down
- **B.** Un costo OSPF mayor que corrompe automáticamente el checksum DBD
- **C.** Una diferencia de sufijo DNS en la tabla de rutas
- **D.** Una diferencia de MTU que afecta el procesamiento Database Description

**Respuesta(s) propuesta(s): D.** OSPF comprueba Interface MTU en Database Description según las reglas aplicables. Una MTU anunciada incompatible puede impedir el intercambio de bases aun después del descubrimiento Hello.

**English**

OSPF neighbors on Ethernet are stuck in ExStart/Exchange. One router receives a Database Description packet whose Interface MTU exceeds what it can receive, and MTU checking is not disabled. Which issue fits?

- **A.** A mandatory condition that every neighbor pair remain Down
- **B.** A higher OSPF cost automatically corrupting the DBD checksum
- **C.** A DNS suffix mismatch in the routing table
- **D.** An interface MTU mismatch affecting Database Description processing

OSPF checks the Interface MTU field in Database Description packets under the applicable rules. An incompatible advertised MTU can prevent database exchange even after initial Hello discovery.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.6 and A.3.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 25. ospf-router-id-uniqueness

ID: `ccna-original-20261024-b03-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Verdadero o falso: dos routers OSPF pueden usar con seguridad el mismo router ID en un dominio de routing solo porque sus IP de interfaz son distintas.

- **A.** Verdadero
- **B.** Falso

**Respuesta(s) propuesta(s): B.** El router ID OSPF identifica de forma única al router en el dominio. Tener IP de interfaz distintas no vuelve aceptables router ID duplicados; pueden perturbar el protocolo.

**English**

True or false: two OSPF routers may safely use the same router ID throughout one routing domain merely because their interface IP addresses differ.

- **A.** True
- **B.** False

An OSPF router ID is intended to uniquely identify the router in the routing domain. Different interface addresses do not make duplicate router IDs acceptable; duplicates can disrupt protocol operation.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 1.2 Router ID · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 26. ospf-passive-default-exception

ID: `ccna-original-20261024-b03-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router OSPF tiene G0/0, G0/1 y G0/2. Se configura passive-interface default y únicamente no passive-interface G0/1. ¿En qué interfaz listada se habilitan los hello OSPF normales?

- **A.** G0/1
- **B.** Las tres
- **C.** G0/0
- **D.** G0/2

**Respuesta(s) propuesta(s): A.** El valor por defecto suprime vecinos en todas las interfaces y la excepción explícita los habilita en G0/1. Las demás pueden seguir anunciando sus redes sin enviar Hello.

**English**

An OSPF router has interfaces G0/0, G0/1 and G0/2. Configuration uses passive-interface default followed only by no passive-interface G0/1. On which listed interface are normal OSPF hellos enabled?

- **A.** G0/1
- **B.** All three
- **C.** G0/0
- **D.** G0/2

The default suppresses neighbor formation on all interfaces, and the explicit exception enables it on G0/1. The other interfaces can still advertise their associated networks without sending Hellos.

Referencia: https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-routing/b-ip-routing/m_iri-default-passive-interface.html · Default Passive Interfaces · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 27. floating-static-failback-preference

ID: `ccna-original-20261024-b03-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

El mismo prefijo tiene una ruta estática primaria utilizable de distancia 1 y otra de respaldo de distancia 200. Tras una caída, la primaria vuelve a ser elegible. ¿Cuál se prefiere normalmente?

- **A.** Ruta primaria
- **B.** Ruta de respaldo
- **C.** Ambas deben quedar activas sin importar la distancia
- **D.** Ninguna hasta que sus IP de siguiente salto sean iguales

**Respuesta(s) propuesta(s): A.** Entre estas fuentes elegibles del mismo prefijo se prefiere distancia 1 frente a 200. Aquí importan elegibilidad y distancia, no cuál estuvo activa más recientemente.

**English**

The exact same prefix has a usable primary static route with distance 1 and a backup static route with distance 200. After an outage, the primary becomes eligible again. Which is normally preferred?

- **A.** Primary route
- **B.** Backup route
- **C.** Both must remain active regardless of distance
- **D.** Neither until their next-hop IPs become equal

For these eligible sources of the same prefix, distance 1 is preferred over 200. Availability and distance determine preference here, not which route happened to be active most recently.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Use Administrative Distance for Backup · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 28. ipv6-multicast-ethernet-mapping

ID: `ccna-original-20261024-b03-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

¿Qué MAC multicast Ethernet corresponde al multicast IPv6 ff02::1:ff00:ab12?

- **A.** 33:33:00:00:ab:12
- **B.** 33:33:ff:00:ab:12
- **C.** 01:00:5e:00:ab:12
- **D.** ff:ff:ff:ff:ff:ff

**Respuesta(s) propuesta(s): B.** El multicast IPv6 sobre Ethernet coloca los 32 bits bajos tras 33:33. Aquí esos bits son ff:00:ab:12; no se aplica el prefijo IPv4 01:00:5e.

**English**

Which Ethernet multicast MAC corresponds to IPv6 multicast ff02::1:ff00:ab12?

- **A.** 33:33:00:00:ab:12
- **B.** 33:33:ff:00:ab:12
- **C.** 01:00:5e:00:ab:12
- **D.** ff:ff:ff:ff:ff:ff

IPv6 multicast over Ethernet maps the low-order 32 IPv6 bits after prefix 33:33. The final 32 bits here are ff:00:ab:12; the IPv4 prefix 01:00:5e does not apply.

Referencia: https://www.rfc-editor.org/rfc/rfc2464.txt · 7 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 29. discontiguous-exact-summary

ID: `ccna-original-20261024-b03-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

¿Pueden 10.0.0.0/24 y 10.0.2.0/24 representarse mediante un solo prefijo CIDR que incluya exactamente esas direcciones y ninguna otra red /24?

- **A.** Sí: 10.0.2.0/24 incluye también 10.0.0.0/24
- **B.** Sí: 10.0.0.0/23 es exacto
- **C.** Sí: 10.0.0.0/22 es exacto
- **D.** No; la representación exacta requiere más de un prefijo

**Respuesta(s) propuesta(s): D.** Un /22 incluye .0, .1, .2 y .3; un /23 que empieza en .0 incluye .0 y .1, no .2. El hueco impide un único prefijo exacto sin espacio adicional.

**English**

Can 10.0.0.0/24 and 10.0.2.0/24 be represented by one CIDR prefix that includes exactly those addresses and no other /24 networks?

- **A.** Yes: 10.0.2.0/24 also includes 10.0.0.0/24
- **B.** Yes: 10.0.0.0/23 is exact
- **C.** Yes: 10.0.0.0/22 is exact
- **D.** No; an exact representation requires more than one prefix

A /22 includes .0, .1, .2 and .3; a /23 beginning at .0 includes .0 and .1, not .2. The gap prevents an exact single-prefix representation without additional space.

Referencia: https://www.rfc-editor.org/rfc/rfc4632.txt · 3.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 30. ra-zero-router-lifetime

ID: `ccna-original-20261024-b03-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host IPv6 recibe un RA válido de un router conocido con Router Lifetime=0, mientras un prefijo anunciado por separado mantiene valid lifetime positivo. ¿Qué significa Router Lifetime=0?

- **A.** El host debe reinterpretar al router como servidor DNS
- **B.** Deben borrarse inmediatamente todas las direcciones de todos los prefijos
- **C.** Ese router no debe seguir como candidato por defecto debido a ese RA
- **D.** El RA desactiva automáticamente IPv6 en el host

**Respuesta(s) propuesta(s): C.** Router Lifetime controla la elegibilidad como router por defecto; las vidas de prefijo son información separada. Un valor cero no invalida por sí solo un prefijo autónomo que sigue siendo válido.

**English**

An IPv6 host receives a valid RA from a known router with Router Lifetime=0, while a separately advertised prefix still has a positive valid lifetime. What does Router Lifetime=0 mean?

- **A.** The host must reinterpret the router as a DNS server
- **B.** Every address from every advertised prefix must immediately be deleted
- **C.** That router should not remain a default-router candidate because of that RA
- **D.** The RA automatically disables IPv6 on the host

Router Lifetime controls default-router eligibility; prefix lifetimes are separate information. A zero router lifetime does not by itself invalidate an otherwise valid autonomous address prefix.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 6.3.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 31. udp-traceroute-terminal-response

ID: `ccna-original-20261024-b03-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

En traceroute UDP clásico, las sondas llegan al destino final pero usan un puerto UDP sin servicio. ¿Qué respuesta ICMPv4 suele indicar que llegaron?

- **A.** Una respuesta ARP enviada por Internet
- **B.** Time Exceeded de todo destino final por definición
- **C.** Destination Unreachable, Port Unreachable
- **D.** Un Hello OSPF

**Respuesta(s) propuesta(s): C.** Los routers intermedios pueden devolver Time Exceeded al caducar TTL; el host final puede devolver Port Unreachable por el puerto UDP sin servicio. Los filtros pueden suprimir respuestas, así que es el comportamiento diagnóstico normal, no una garantía incondicional.

**English**

In classic UDP traceroute, probes reach the final destination but target an unused UDP port. Which ICMPv4 response commonly indicates arrival at the destination?

- **A.** An ARP reply sent across the Internet
- **B.** Time Exceeded from every final destination by definition
- **C.** Destination Unreachable, Port Unreachable
- **D.** An OSPF Hello

Intermediate routers can return Time Exceeded when TTL expires; the final host can instead return Port Unreachable for the unused UDP port. Filtering can suppress responses, so this is the normal diagnostic behavior, not an unconditional guarantee.

Referencia: https://www.rfc-editor.org/rfc/rfc792.txt · Destination Unreachable and Time Exceeded · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 32. ospf-lsa-sequence-recency

ID: `ccna-original-20261024-b03-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos instancias describen el mismo LSA OSPF, con igual tipo, Link State ID y router anunciante. Sus secuencias son A=0x80000002 y B=0x80000003. ¿Cuál es más reciente por comparación de secuencia?

- **A.** Las secuencias LSA nunca se comparan
- **B.** B
- **C.** A
- **D.** Ambos deben ser igual de recientes

**Respuesta(s) propuesta(s): B.** Para estos valores B tiene la secuencia OSPF mayor. La comparación usa el espacio de secuencia con signo del protocolo; el ejemplo no atraviesa un límite de reinicio o agotamiento.

**English**

Two instances describe the same OSPF LSA, with matching type, Link State ID and advertising router. Their sequence numbers are A=0x80000002 and B=0x80000003. Which is newer by sequence comparison?

- **A.** LSA sequence numbers are never compared
- **B.** B
- **C.** A
- **D.** Both must be equally recent

For these two values, B has the higher OSPF sequence number. OSPF sequence comparison uses the protocol’s signed sequence-number space; this example does not cross a wrap/restart boundary.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 12.1.6 and 13.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 33. dns-cname-owner-exclusivity

ID: `ccna-original-20261024-b03-033` · Área: `ip_services` · Dificultad: `intermediate`

Un administrador crea CNAME en api.example hacia origin.example. ¿Qué configuración de datos DNS ordinarios en el mismo nombre propietario entra en conflicto con su exclusividad?

- **A.** Consultar el alias mediante el resolvedor
- **B.** Usar otro nombre para un host no relacionado
- **C.** Añadir también un registro A en api.example
- **D.** Añadir el registro de dirección en origin.example

**Respuesta(s) propuesta(s): C.** El propietario de un CNAME ordinario no puede contener también datos ordinarios como A. El nombre de destino sí puede tener registros de dirección. Las excepciones DNSSEC quedan fuera de este caso A/CNAME.

**English**

An administrator creates a CNAME at api.example pointing to origin.example. Which ordinary DNS data configuration at the same owner name conflicts with CNAME exclusivity?

- **A.** Looking up the alias through the resolver
- **B.** Using a different name for an unrelated host
- **C.** Also adding an A record at api.example
- **D.** Adding the address record at origin.example instead

An ordinary CNAME owner cannot also hold other ordinary data such as an A record. The target name can hold address data. DNSSEC-related exceptions are outside this ordinary A/CNAME scenario.

Referencia: https://www.rfc-editor.org/rfc/rfc1034.txt · 3.6.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 34. dns-cache-ttl-remaining

ID: `ccna-original-20261024-b03-034` · Área: `ip_services` · Dificultad: `intermediate`

Un resolvedor guarda una respuesta DNS con TTL 60 segundos. Pasan treinta segundos sin refrescarla. ¿Qué TTL queda en el modelo ordinario de cuenta regresiva?

- **A.** Siempre 0 segundos
- **B.** 90 segundos
- **C.** 30 segundos
- **D.** 60 segundos

**Respuesta(s) propuesta(s): C.** La vida de caché disminuye con el tiempo: 60−30 = 30 segundos. No se reinicia solo porque un cliente lea la respuesta. No se incluyen políticas especiales serve-stale ajenas al modelo indicado.

**English**

A resolver caches a DNS answer with TTL 60 seconds. Thirty seconds elapse with no refresh. What TTL remains under the ordinary countdown model?

- **A.** 0 seconds always
- **B.** 90 seconds
- **C.** 30 seconds
- **D.** 60 seconds

Cache lifetime decreases with elapsed time: 60−30 = 30 seconds. It is not reset merely because a client reads the cached answer. This ignores special serve-stale policy outside the stated model.

Referencia: https://www.rfc-editor.org/rfc/rfc1035.txt · 3.2.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 35. packet-serialization-delay

ID: `ccna-original-20261024-b03-035` · Área: `ip_services` · Dificultad: `intermediate`

Sin contar tramas adicionales, propagación ni colas, ¿cuánto tarda serializar 1500 bytes por un enlace de 10 Mbit/s?

- **A.** 120 ms
- **B.** 12 ms
- **C.** 0.15 ms
- **D.** 1.2 ms

**Respuesta(s) propuesta(s): D.** La serialización es bits divididos por tasa: 1500×8 / 10000000 segundos = 0,0012 segundos = 1,2 ms. Es solo un componente del retardo extremo a extremo.

**English**

Ignoring framing overhead, propagation and queueing, how long does serializing 1500 bytes take on a 10-Mbit/s link?

- **A.** 120 ms
- **B.** 12 ms
- **C.** 0.15 ms
- **D.** 1.2 ms

Serialization time is bits divided by link rate: 1500×8 / 10000000 seconds = 0.0012 seconds = 1.2 ms. It is only one component of end-to-end latency.

Referencia: https://www.rfc-editor.org/rfc/rfc1242.txt · Latency terminology; calculation follows the stated link-rate model · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 36. snmpv3-auth-no-privacy

ID: `ccna-original-20261024-b03-036` · Área: `ip_services` · Dificultad: `intermediate`

¿Qué protección ofrece SNMPv3 USM authNoPriv en ese nivel de seguridad?

- **A.** Cifrado sin autenticación
- **B.** Autenticación/integridad sin cifrado de privacidad del mensaje
- **C.** Ni autenticación ni integridad
- **D.** Cifrado IPsec automático de todo paquete de red

**Respuesta(s) propuesta(s): B.** authNoPriv incluye autenticación e integridad, pero no el cifrado de privacidad disponible en authPriv. Los nombres distinguen esos servicios, no la protección de todo protocolo de red.

**English**

What protection does SNMPv3 USM authNoPriv provide at its stated security level?

- **A.** Encryption without authentication
- **B.** Authentication/integrity without message privacy encryption
- **C.** Neither authentication nor integrity
- **D.** Automatic IPsec encryption of every network packet

authNoPriv includes authentication and integrity but not the privacy encryption available at authPriv. The level names distinguish these services; they do not imply protection of every network protocol.

Referencia: https://www.rfc-editor.org/rfc/rfc3414.txt · 1.2 and securityLevel processing · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 37. static-nat-inbound-destination

ID: `ccna-original-20261024-b03-037` · Área: `ip_services` · Dificultad: `intermediate`

Una traducción NAT estática vincula inside local 10.1.1.7 con inside global 198.51.100.7. Para un paquete entrante correspondiente hacia 198.51.100.7, ¿qué destino resulta tras traducir?

- **A.** 10.1.1.7
- **B.** 10.1.1.0
- **C.** 203.0.113.7
- **D.** 198.51.100.7

**Respuesta(s) propuesta(s): A.** La traducción inversa cambia el destino de la vinculación global a la dirección inside local configurada. Se describe la traducción, no si una política de firewall separada permite el tráfico.

**English**

A static NAT mapping binds inside local 10.1.1.7 to inside global 198.51.100.7. For a matching inbound packet to 198.51.100.7, what destination address results after this translation?

- **A.** 10.1.1.7
- **B.** 10.1.1.0
- **C.** 203.0.113.7
- **D.** 198.51.100.7

Reverse translation maps the packet’s destination from the public/global binding to the configured inside-local address. This says which address is translated, not whether separate firewall policy permits the traffic.

Referencia: https://www.rfc-editor.org/rfc/rfc3022.txt · 2 and 3 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 38. extended-acl-ordered-service-policy

ID: `ccna-original-20261024-b03-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL IPv4 ordenada deniega TCP destino 443, luego permite UDP destino 53 y luego TCP destino 80; todo lo demás se deniega implícitamente. Selecciona dos paquetes permitidos.

- **A.** Petición TCP al puerto de destino 443
- **B.** Consulta UDP al puerto de destino 53
- **C.** Petición TCP al puerto de destino 80
- **D.** Petición UDP al puerto de destino 123

**Respuesta(s) propuesta(s): B, C.** Evalúa protocolo y puerto de destino en orden. UDP/53 y TCP/80 coinciden con permit; TCP/443 con deny explícito y UDP/123 con deny implícito.

**English**

An ordered IPv4 ACL denies TCP destination port 443, then permits UDP destination port 53, then permits TCP destination port 80; all other traffic is implicitly denied. Select two permitted packets.

- **A.** TCP request to destination port 443
- **B.** UDP query to destination port 53
- **C.** TCP request to destination port 80
- **D.** UDP request to destination port 123

Evaluate protocol and destination port in order. UDP/53 and TCP/80 match permits; TCP/443 matches the explicit deny, and UDP/123 reaches the implicit deny.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Extended ACLs and First-Match Processing · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 39. ip-source-guard-versus-dai

ID: `ccna-original-20261024-b03-039` · Área: `security_fundamentals` · Dificultad: `intermediate`

¿Qué diferencia entre IP Source Guard y Dynamic ARP Inspection es correcta?

- **A.** Ninguna puede usar información confiable de bindings IP/MAC
- **B.** IP Source Guard filtra tráfico de IP origen aplicable; DAI valida asociaciones ARP
- **C.** Ambas funciones solo cambian TTL DNS
- **D.** DAI valida todo certificado TLS e IP Source Guard descifra SSH

**Respuesta(s) propuesta(s): B.** Estas funciones afrontan tráfico falsificado diferente y pueden usar bindings confiables pertinentes. Comprobar ARP con DAI no equivale a validar todo paquete IPv4 de origen. El comportamiento IP Source Guard específico de plataforma requiere revisión separada.

**English**

Which distinction between IP Source Guard and Dynamic ARP Inspection is correct?

- **A.** Neither feature can use trusted IP/MAC binding information
- **B.** IP Source Guard filters applicable source-IP traffic; DAI validates ARP associations
- **C.** Both features only change DNS TTL values
- **D.** DAI validates every TLS certificate and IP Source Guard decrypts SSH

These features address different kinds of spoofed traffic and can use applicable trusted bindings. DAI’s ARP checks should not be treated as validation of all ordinary IPv4 source packets. Verify platform-specific IP Source Guard behavior separately.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_dynamic_arp_inspection.html · DAI and DHCP Binding Database; companion IP Source Guard review required · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 40. dot1x-three-role-separation

ID: `ccna-original-20261024-b03-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Selecciona tres descripciones correctas de roles IEEE 802.1X.

- **A.** El supplicant es el extremo que solicita acceso
- **B.** El servidor de autenticación evalúa el intercambio de autenticación
- **C.** El authenticator controla el acceso en el borde
- **D.** El supplicant debe ser siempre el RADIUS central
- **E.** El authenticator es solo una caché DNS

**Respuesta(s) propuesta(s): A, B, C.** 802.1X separa los roles de extremo, dispositivo de control de acceso y servidor de autenticación. Un switch o AP puede ser authenticator mientras un AAA externo presta autenticación.

**English**

Select three correct IEEE 802.1X role descriptions.

- **A.** The supplicant is the endpoint seeking access
- **B.** The authentication server evaluates the authentication exchange
- **C.** The authenticator controls access at the network edge
- **D.** The supplicant must always be the central RADIUS server
- **E.** The authenticator is only a DNS caching service

802.1X separates the endpoint, access-control device and authentication-server roles. A switch or AP can act as authenticator while an external AAA server supplies the authentication service.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_ieee_802_1x_port_based_authentication.html · Device Roles · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. radius-versus-tacacs-transport

ID: `ccna-original-20261024-b03-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Selecciona dos asociaciones estándar de transporte/puerto de servicios de autenticación.

- **A.** RADIUS de autenticación usa UDP 1812
- **B.** TACACS+ usa UDP 1812 por defecto
- **C.** RADIUS de autenticación usa TCP 49 por defecto
- **D.** TACACS+ usa TCP 49

**Respuesta(s) propuesta(s): A, D.** La vinculación convencional de RADIUS de autenticación es UDP 1812 y TACACS+ usa TCP 49. No se describen transportes opcionales RADIUS ni su servicio separado de accounting.

**English**

Select two standard authentication-service transport/port associations.

- **A.** RADIUS authentication uses UDP 1812
- **B.** TACACS+ uses UDP 1812 by default
- **C.** RADIUS authentication uses TCP 49 by default
- **D.** TACACS+ uses TCP 49

The conventional RADIUS authentication service binding is UDP 1812, while TACACS+ uses TCP 49. This question does not describe separate optional RADIUS transports or the RADIUS accounting service.

Referencia: https://www.rfc-editor.org/rfc/rfc8907.txt · 3.4; RFC 2865 for RADIUS binding · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 42. wireless-shared-key-revocation

ID: `ccna-original-20261024-b03-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una WLAN usa una PSK de modo personal compartida por todos. Una persona que dejó la empresa conocía la clave. ¿Qué limitación central existe al intentar revocar solo su conocimiento del secreto?

- **A.** No puede hacer que una persona olvide el secreto; rotarlo afecta a los demás que usan esa clave
- **B.** Una PSK compartida entrega automáticamente certificados revocables individuales
- **C.** Cambiar el SSID cambia siempre el secreto sin actualizar clientes
- **D.** Borrar una entrada DNS revoca la PSK recordada

**Respuesta(s) propuesta(s): A.** Un secreto común carece de separación de credenciales por usuario. La autenticación empresarial individual puede ofrecer otros controles de identidad y revocación; una clave compartida suele requerir rotación coordinada si se compromete.

**English**

A WLAN uses one shared personal-mode PSK for all users. One departed user knew that key. What is the central limitation of revoking only that person’s knowledge of the shared secret?

- **A.** The shared secret cannot be unlearned by one user; rotating it affects other users of that same key
- **B.** A shared PSK automatically provides an individually revocable certificate to every user
- **C.** Changing the SSID always changes the secret without client updates
- **D.** Deleting a DNS entry revokes the remembered PSK

A common secret lacks per-user credential separation. Individual enterprise authentication can support different identity and revocation controls, while a shared key generally requires coordinated rotation when compromised.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/configuring_ieee_802_1x_port_based_authentication.html · Identity-Based Access; shared-secret operational reasoning · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 43. bearer-token-log-redaction

ID: `ccna-original-20261024-b03-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un cliente de automatización registra cabeceras Authorization: Bearer completas al fallar una API. ¿Qué información necesita eliminar u ocultar prioritariamente de los logs ordinarios?

- **A.** Solo el método de petición no secreto
- **B.** El valor del bearer token
- **C.** Solo el código HTTP
- **D.** Solo el tiempo transcurrido

**Respuesta(s) propuesta(s): B.** Un bearer token puede dar acceso a quien lo posea. Registrar su valor crea otra vía de exposición; conserva diagnósticos útiles no secretos y protege las credenciales.

**English**

An automation client logs complete Authorization: Bearer headers when an API call fails. Which information most urgently needs removal or redaction from ordinary logs?

- **A.** Only the nonsecret request method
- **B.** The bearer token value
- **C.** Only the HTTP status code
- **D.** Only the elapsed time

A bearer token can grant access to whoever possesses it. Logging its value creates another disclosure path; retain useful nonsecret diagnostics while protecting credentials.

Referencia: https://www.rfc-editor.org/rfc/rfc6750.txt · 5 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. ssh-host-key-change-verification

ID: `ccna-original-20261024-b03-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un cliente SSH advierte que cambió la host key de un dispositivo conocido. ¿Qué respuesta operativa corresponde antes de confiar en la nueva clave?

- **A.** Verificar el cambio por un canal independiente confiable o procedimiento aprobado
- **B.** Publicar la clave privada del host para compararla
- **C.** Suponer que un usuario coincidente demuestra identidad del servidor
- **D.** Eliminar comprobaciones en todos los hosts y aceptar cualquier clave

**Respuesta(s) propuesta(s): A.** Un cambio puede ser legítimo o malicioso; la advertencia no demuestra ninguna de las dos cosas. Verifica la identidad de forma segura sin suprimir la validación ni divulgar claves privadas.

**English**

An SSH client warns that a previously known device host key has changed. What is the appropriate operational response before trusting the new key?

- **A.** Verify the change through a trusted independent channel or approved procedure
- **B.** Publish the private host key to compare it publicly
- **C.** Assume a matching username proves server identity
- **D.** Delete known-host checks everywhere and accept any new key

A change can be legitimate or malicious; the warning is not proof of either. Verify the server identity securely rather than suppressing host-key validation or disclosing private keys.

Referencia: https://www.rfc-editor.org/rfc/rfc4253.txt · 4 and 8 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 45. ordinary-udp-ipv6-checksum-zero

ID: `ccna-original-20261024-b03-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Llega un paquete UDP IPv6 ordinario, no de túnel, con checksum cero y sin excepción especificada aplicable. ¿Qué debe hacer el receptor?

- **A.** Usar el número de VLAN como checksum
- **B.** Aceptar siempre cero como checksum deshabilitado igual que UDP IPv4 opcional
- **C.** Descartarlo conforme a la regla normal de checksum UDP/IPv6
- **D.** Convertirlo automáticamente en TCP

**Respuesta(s) propuesta(s): C.** El checksum UDP IPv6 ordinario es obligatorio y se descartan paquetes con cero. Existen excepciones explícitas para túneles, por eso el escenario las excluye. No debe generalizarse la convención de UDP IPv4.

**English**

An ordinary, non-tunnel UDP packet over IPv6 arrives with checksum zero, and no specified zero-checksum exception applies. What must the receiver do?

- **A.** Use the VLAN number as a substitute checksum
- **B.** Always treat zero as a valid disabled checksum just like optional IPv4 UDP
- **C.** Discard it under the normal UDP/IPv6 checksum rule
- **D.** Convert the packet into TCP automatically

The ordinary IPv6 UDP checksum is required; receivers discard zero-checksum packets. Explicit tunnel exceptions exist, which is why the scenario excludes them. IPv4 UDP’s zero-checksum convention must not be generalized.

Referencia: https://www.rfc-editor.org/rfc/rfc8200.txt · 8.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. json-integer-versus-string

ID: `ccna-original-20261024-b03-046` · Área: `automation_programmability` · Dificultad: `intermediate`

El esquema de una API exige que vlan sea un entero igual a 20. ¿Qué cuerpo JSON cumple tipo y valor?

- **A.** {"vlan":20.5}
- **B.** {"vlan":true}
- **C.** {"vlan":"20"}
- **D.** {"vlan":20}

**Respuesta(s) propuesta(s): D.** Cadenas, números y booleanos JSON son tipos distintos. El entero 20 sin comillas cumple el esquema; una cadena con apariencia numérica o true no lo hace.

**English**

An API schema requires vlan to be an integer equal to 20. Which JSON body meets that type and value requirement?

- **A.** {"vlan":20.5}
- **B.** {"vlan":true}
- **C.** {"vlan":"20"}
- **D.** {"vlan":20}

JSON strings, numbers and booleans are distinct types. The unquoted integer 20 satisfies the stated schema; a numeric-looking string or true does not.

Referencia: https://www.rfc-editor.org/rfc/rfc8259.txt · 3, 6 and 7 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 47. http-forbidden-after-authentication

ID: `ccna-original-20261024-b03-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API autentica correctamente un token, pero la cuenta carece de permiso para modificar la configuración solicitada. ¿Qué estado comunica más directamente el rechazo de esa acción?

- **A.** 301 Moved Permanently
- **B.** 403 Forbidden
- **C.** 202 Accepted
- **D.** 201 Created

**Respuesta(s) propuesta(s): B.** 403 indica que el servidor entendió la solicitud pero la rechaza. Autenticación y autorización son distintas; una identidad válida no implica permiso para modificar cualquier recurso.

**English**

An API successfully authenticates a token, but the account lacks permission to modify the requested configuration. Which status most directly communicates refusal to perform that action?

- **A.** 301 Moved Permanently
- **B.** 403 Forbidden
- **C.** 202 Accepted
- **D.** 201 Created

403 indicates the server understood the request but refuses it. Authentication and authorization are different checks; a valid identity does not imply permission to modify every resource.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.5.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 48. http-202-not-job-completion

ID: `ccna-original-20261024-b03-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API de automatización devuelve 202 Accepted para un trabajo largo y proporciona una URL de estado. ¿Qué debe inferir el cliente?

- **A.** El trabajo fue aceptado; su finalización debe comprobarse por separado
- **B.** 202 significa que deben ignorarse todos los errores posteriores
- **C.** El recurso necesariamente no existe
- **D.** Toda la configuración ya está garantizada como terminada

**Respuesta(s) propuesta(s): A.** 202 es aceptación para procesar, no garantía de que el procesamiento haya terminado o vaya a tener éxito. Usa el mecanismo de estado según el contrato de la API.

**English**

A network-automation API returns 202 Accepted for a long-running configuration job and supplies a job-status URL. What should the client infer?

- **A.** The job was accepted; completion must be checked separately
- **B.** 202 means the client should ignore every subsequent error
- **C.** The resource necessarily does not exist
- **D.** The entire configuration is already guaranteed complete

202 is acceptance for processing, not a guarantee that processing has completed or will succeed. Use the provided status mechanism according to the API’s contract.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.3.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. netconf-get-versus-get-config

ID: `ccna-original-20261024-b03-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Selecciona dos descripciones correctas de operaciones de consulta NETCONF.

- **A.** `<get> puede consultar configuración y estado operacional`
- **B.** `<get-config> consulta configuración de un datastore de configuración especificado`
- **C.** `<get-config> siempre confirma el datastore candidate`
- **D.** `<get> siempre borra la configuración running`

**Respuesta(s) propuesta(s): A, B.** Las operaciones de consulta leen datos. get-config se centra en la configuración del datastore indicado; get incluye configuración y estado. Ninguna confirma ni elimina configuración.

**English**

Select two correct descriptions of NETCONF retrieval operations.

- **A.** `<get> can retrieve configuration and operational state`
- **B.** `<get-config> retrieves configuration from a specified configuration datastore`
- **C.** `<get-config> always commits the candidate datastore`
- **D.** `<get> always deletes the running configuration`

Retrieval operations read data. get-config focuses on configuration in the specified datastore; get includes configuration and state data. Neither operation is a commit or delete operation.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 7.1 and 7.7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. netconf-rollback-on-error-capability

ID: `ccna-original-20261024-b03-050` · Área: `automation_programmability` · Dificultad: `advanced`

Un servidor NETCONF anuncia :rollback-on-error. Un edit-config usa error-option rollback-on-error y encuentra un error al procesar. ¿Qué comportamiento se solicita?

- **A.** Deshabilitar autenticación SSH para reintentar
- **B.** Mantener todo cambio parcial e informar éxito incondicional
- **C.** Restaurar la configuración afectada al estado anterior a la operación
- **D.** Borrar permanentemente todos los datastores ajenos

**Respuesta(s) propuesta(s): C.** Si se admite y solicita, rollback-on-error pide revertir los cambios de la edición fallida. Se distingue de stop-on-error y continue-on-error; no debe suponerse su soporte sin la capacidad anunciada.

**English**

A NETCONF server advertises :rollback-on-error. An edit-config uses error-option rollback-on-error, and processing encounters an error. What behavior is requested?

- **A.** Disable SSH authentication to retry automatically
- **B.** Keep every partial change and report unconditional success
- **C.** Restore the affected configuration to its state before the operation
- **D.** Delete all unrelated datastores permanently

When supported and requested, rollback-on-error asks the server to undo changes from the failed edit operation. It differs from stop-on-error and continue-on-error; support must not be assumed without the advertised capability.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 7.2 and 8.5 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.
