# Lote original: original-20261026-b04-50

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

## 1. ipv4-subnet-overlap-detection

ID: `ccna-original-20261026-b04-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un plan asigna 10.20.4.0/23 al edificio A y 10.20.5.0/24 al B en la misma tabla de rutas. ¿Qué debe corregirse?

- **A.** Solo deben ser iguales las máscaras
- **B.** Las asignaciones se superponen; la /24 está dentro de la /23
- **C.** Son disjuntas porque sus direcciones de red escritas difieren
- **D.** La longitud /23 no es válida

**Respuesta(s) propuesta(s): B.** La /23 abarca 10.20.4.0–10.20.5.255 y contiene toda la /24 propuesta. Direcciones de red escritas distintas no garantizan asignaciones separadas.

**English**

An address plan allocates 10.20.4.0/23 to Building A and 10.20.5.0/24 to Building B in the same routing table. What must be corrected?

- **A.** Only the subnet masks need to be identical
- **B.** The allocations overlap; the /24 lies inside the /23
- **C.** They are disjoint because their written network addresses differ
- **D.** The /23 is not a valid prefix length

The /23 spans 10.20.4.0–10.20.5.255, so it contains the entire proposed /24. Distinct written network addresses do not establish disjoint allocations.

Referencia: https://www.rfc-editor.org/rfc/rfc4632.txt · 3.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 2. vlsm-largest-first-allocation

ID: `ccna-original-20261026-b04-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

Dentro de 192.0.2.0/24 asigna las subredes LAN convencionales más bajas disponibles a 100 hosts y luego a 50. Reserva red y broadcast. ¿Qué par cabe sin superposición?

- **A.** 192.0.2.0/26; 192.0.2.64/26
- **B.** 192.0.2.0/24; 192.0.2.128/26
- **C.** 192.0.2.0/25; 192.0.2.64/26
- **D.** 192.0.2.0/25; 192.0.2.128/26

**Respuesta(s) propuesta(s): D.** Una /25 ofrece 126 direcciones utilizables y una /26 ofrece 62. La primera /25 termina en .127; .128/26 es la siguiente asignación alineada más baja.

**English**

Within 192.0.2.0/24, allocate the lowest available conventional LAN subnets to 100 hosts, then 50 hosts. Reserve network and broadcast addresses. Which pair fits without overlap?

- **A.** 192.0.2.0/26; 192.0.2.64/26
- **B.** 192.0.2.0/24; 192.0.2.128/26
- **C.** 192.0.2.0/25; 192.0.2.64/26
- **D.** 192.0.2.0/25; 192.0.2.128/26

A /25 provides 126 usable addresses; a /26 provides 62. The first /25 ends at .127, leaving .128/26 as the lowest aligned next allocation.

Referencia: https://www.rfc-editor.org/rfc/rfc1878.txt · Subnet Tables · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 3. ipv6-anycast-nearest-by-routing

ID: `ccna-original-20261026-b04-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Dos routers anuncian la misma dirección de servicio anycast IPv6 desde sedes diferentes. ¿Cómo se entrega normalmente un paquete?

- **A.** Solo al equipo con la MAC Ethernet menor
- **B.** A todas las instancias como multicast
- **C.** A todos los hosts del enlace como broadcast
- **D.** A una instancia elegida por el sistema de routing

**Respuesta(s) propuesta(s): D.** Anycast identifica varias interfaces, pero el routing entrega cada paquete a una, normalmente la más cercana según sus métricas. No distribuye una copia a cada instancia.

**English**

Two routers advertise the same IPv6 anycast service address from different sites. How is a packet normally delivered?

- **A.** Only to the device with the lowest Ethernet MAC
- **B.** To all instances as with multicast
- **C.** To every host on the local link as a broadcast
- **D.** To one instance selected by the routing system

An anycast address identifies multiple interfaces, but routing delivers a packet to one, usually the nearest according to routing metrics. It is not multicast fan-out.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · 2.6 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 4. ipv6-multicast-scope-field

ID: `ccna-original-20261026-b04-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una herramienta compara ff02::1234 con ff05::1234. ¿Qué propiedad cambia al pasar el nibble de ámbito de 2 a 5?

- **A.** Ambas pasan a ser unicast
- **B.** Los últimos 32 bits se vuelven un gateway IPv4
- **C.** La longitud cambia de 64 a 128 bits
- **D.** El ámbito previsto cambia de enlace local a sitio local

**Respuesta(s) propuesta(s): D.** El campo de ámbito de multicast IPv6 limita su alcance previsto. Los valores 2 y 5 indican enlace local y sitio local; ff00::/8 sigue siendo multicast.

**English**

A monitoring tool compares ff02::1234 with ff05::1234. Which property changes because the scope nibble changes from 2 to 5?

- **A.** Both addresses become unicast
- **B.** The last 32 bits become an IPv4 gateway
- **C.** The address length changes from 64 to 128 bits
- **D.** The intended scope changes from link-local to site-local

The scope field in an IPv6 multicast address limits its intended scope. Values 2 and 5 represent link-local and site-local scope; ff00::/8 remains multicast.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · 2.7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 5. ipv6-loopback-forwarding-prohibition

ID: `ccna-original-20261026-b04-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un host envía un paquete a ::1. ¿Qué comportamiento es correcto?

- **A.** Es tráfico de loopback y debe permanecer dentro del nodo
- **B.** Se envía a todos los routers IPv6
- **C.** Es un destino de Internet con dirección IPv4 mapeada
- **D.** Se enruta por el gateway predeterminado

**Respuesta(s) propuesta(s): A.** ::1 es la dirección de loopback IPv6. Un nodo no debe enviar paquetes destinados a ella fuera de sí mismo y los routers no deben reenviarlos.

**English**

A host sends a packet to ::1. Which behavior is correct?

- **A.** It is loopback traffic and must remain within that node
- **B.** It is sent to all IPv6 routers
- **C.** It is an IPv4-mapped Internet destination
- **D.** It is routed through the default gateway

::1 is the IPv6 loopback address. A node must not send packets addressed to it outside the node, and routers must not forward them.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · 2.5.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 6. ipv4-link-local-router-boundary

ID: `ccna-original-20261026-b04-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una impresora se autoconfigura con 169.254.40.20/16. ¿Puede un router reenviar normalmente tráfico con este origen de enlace local a otro enlace físico?

- **A.** Sí, porque es una subred RFC 1918
- **B.** No; los routers no deben reenviar tráfico IPv4 de enlace local
- **C.** Sí, si el router tiene una ruta predeterminada
- **D.** Solo cuando el TTL es 255

**Respuesta(s) propuesta(s): B.** 169.254.0.0/16 es espacio IPv4 de enlace local, no espacio privado RFC 1918. Los routers no deben reenviar paquetes con origen o destino de enlace local.

**English**

A printer has self-configured 169.254.40.20/16. Can a router normally forward traffic with this link-local source to another physical link?

- **A.** Yes, because it is an RFC 1918 subnet
- **B.** No; IPv4 link-local traffic must not be forwarded by routers
- **C.** Yes, if the router has a default route
- **D.** Only when the TTL is 255

169.254.0.0/16 is IPv4 link-local space, not RFC 1918 private space. Routers must not forward packets with link-local source or destination addresses.

Referencia: https://www.rfc-editor.org/rfc/rfc3927.txt · 2.7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 7. tcp-zero-window-flow-control

ID: `ccna-original-20261026-b04-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un receptor anuncia una ventana TCP de recepción de cero mientras su aplicación está ocupada temporalmente. ¿Qué debe inferir el emisor?

- **A.** El enlace Ethernet cambió a semidúplex
- **B.** El receptor no anuncia espacio para datos nuevos; los sondeos de ventana cero permiten comprobar su reapertura
- **C.** El emisor puede ignorar el control de flujo y enviar toda su ventana de congestión
- **D.** La conexión TCP necesariamente se reinició

**Respuesta(s) propuesta(s): B.** Una ventana de recepción de cero es una señal de control de flujo, no prueba de una conexión rota. Los sondeos evitan que una actualización de ventana perdida detenga la comunicación permanentemente.

**English**

A receiver advertises a TCP receive window of zero while its application is temporarily busy. What should the sender infer?

- **A.** The Ethernet link has changed to half duplex
- **B.** The receiver currently has no advertised room for new data; zero-window probing can check for reopening
- **C.** The sender may ignore flow control and send its full congestion window
- **D.** The TCP connection has necessarily been reset

A zero receive window is a flow-control signal, not proof of a broken connection. TCP zero-window probing prevents a lost window-update segment from stalling communication permanently.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.8.6.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 8. udp-demultiplex-destination-port

ID: `ccna-original-20261026-b04-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

Dos aplicaciones UDP de un host usan los puertos destino 5000 y 5001. ¿Qué campo distingue principalmente los extremos receptores de aplicación en ese host?

- **A.** Solo la prioridad 802.1Q
- **B.** Puerto destino UDP
- **C.** TTL IPv4
- **D.** Preámbulo Ethernet

**Respuesta(s) propuesta(s): B.** El destino IP identifica al host y el puerto destino UDP identifica el extremo local receptor. UDP no establece por sí mismo una conexión como TCP.

**English**

Two UDP applications on one host use destination ports 5000 and 5001. Which header field primarily distinguishes the receiving application endpoints at that host?

- **A.** 802.1Q priority only
- **B.** UDP destination port
- **C.** IPv4 TTL
- **D.** Ethernet preamble

The IP destination identifies the host and the UDP destination port identifies the local destination endpoint. UDP itself does not establish a TCP-style connection.

Referencia: https://www.rfc-editor.org/rfc/rfc768.txt · Fields · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 9. decimal-link-rate-byte-throughput

ID: `ccna-original-20261026-b04-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un enlace transporta exactamente 80 000 000 bits de carga útil por segundo. Ignora toda sobrecarga y usa unidades decimales. ¿Cuál es la tasa en MB/s?

- **A.** 80 MB/s
- **B.** 8 MB/s
- **C.** 640 MB/s
- **D.** 10 MB/s

**Respuesta(s) propuesta(s): D.** Ocho bits forman un byte. Dividir 80 000 000 entre 8 y luego entre 1 000 000 da 10 MB/s; las tasas en bits no son tasas en bytes.

**English**

A link carries exactly 80,000,000 payload bits per second. Ignore all overhead and use decimal units. What is the payload rate in MB/s?

- **A.** 80 MB/s
- **B.** 8 MB/s
- **C.** 640 MB/s
- **D.** 10 MB/s

Eight bits form one byte. Dividing 80,000,000 by 8 and then by 1,000,000 gives 10 MB/s; link bit rates are not byte rates.

Referencia: https://www.rfc-editor.org/rfc/rfc1242.txt · 3.17 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 10. icmp-error-original-packet-identification

ID: `ccna-original-20261026-b04-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un mensaje ICMPv4 Destination Unreachable incluye parte del paquete original. ¿Para qué le sirve al emisor?

- **A.** Para conocer la contraseña Wi-Fi
- **B.** Para sustituir todos los ACK de TCP
- **C.** Para asociar el error con el flujo o paquete original
- **D.** Para retransmitir automáticamente el archivo de aplicación completo

**Respuesta(s) propuesta(s): C.** Los errores ICMPv4 incluyen la cabecera IP original y al menos los primeros 64 bits de sus datos, lo que ayuda al origen a identificar la comunicación afectada. ICMP no retransmite archivos.

**English**

An IPv4 ICMP Destination Unreachable message quotes part of the original packet. Why is that quotation useful to the sender?

- **A.** To learn the Wi-Fi password
- **B.** To replace TCP acknowledgments for all data
- **C.** To associate the error with the original flow or packet
- **D.** To retransmit the full original application file automatically

ICMPv4 errors include the original IP header and at least the first 64 bits of its data, helping the source identify the affected communication. ICMP is not application retransmission.

Referencia: https://www.rfc-editor.org/rfc/rfc792.txt · Destination Unreachable Message · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 11. switch-source-learning-vlan-context

ID: `ccna-original-20261026-b04-011` · Área: `network_access` · Dificultad: `intermediate`

Un switch recibe en VLAN 30 por Gi1/0/4 una trama con MAC origen 02:11:22:33:44:55. ¿Qué asociación dinámica debe aprender?

- **A.** VLAN 30 -> solo la MAC del gateway predeterminado
- **B.** VLAN 30 + 02:11:22:33:44:55 -> Gi1/0/4
- **C.** IP destino -> Gi1/0/4
- **D.** La MAC origen debe pertenecer a todas las VLAN

**Respuesta(s) propuesta(s): B.** El switching dinámico aprende la MAC origen en el puerto de entrada dentro de su VLAN. La búsqueda de MAC destino decide la salida; aquí no se aprende una IP destino.

**English**

A switch receives a frame in VLAN 30 on Gi1/0/4 with source MAC 02:11:22:33:44:55. Which dynamic table association should it learn?

- **A.** VLAN 30 -> the default gateway MAC only
- **B.** VLAN 30 + 02:11:22:33:44:55 -> Gi1/0/4
- **C.** Destination IP -> Gi1/0/4
- **D.** The source MAC must belong to every VLAN

Dynamic switching learns the source MAC on the ingress port within the VLAN context. Destination-MAC lookup then selects egress forwarding; it does not learn a destination IP here.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Address Tables · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 12. unknown-unicast-forwarding-set

ID: `ccna-original-20261026-b04-012` · Área: `network_access` · Dificultad: `intermediate`

Un switch de aprendizaje recibe un unicast desconocido por P1 en VLAN 20. P2 y P3 reenvían VLAN 20; P4 es acceso VLAN 30. No hay supresión ni aislamiento. ¿Qué puertos reciben una copia? Selecciona dos.

- **A.** P3
- **B.** P4
- **C.** P1
- **D.** P2

**Respuesta(s) propuesta(s): A, D.** Un unicast desconocido se inunda por los puertos habilitados de su VLAN salvo el puerto de entrada. Un puerto de otra VLAN no recibe esta inundación.

**English**

An ordinary learning switch receives an unknown unicast on port P1 in VLAN 20. P2 and P3 forward VLAN 20; P4 is access VLAN 30. No suppression or isolation is configured. Which ports receive a flooded copy? Select two.

- **A.** P3
- **B.** P4
- **C.** P1
- **D.** P2

An unknown unicast is flooded to eligible forwarding ports in its VLAN except the ingress port. A port in another VLAN does not receive this flood.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Address Tables · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 13. mac-aging-versus-arp-lifetime

ID: `ccna-original-20261026-b04-013` · Área: `network_access` · Dificultad: `intermediate`

Un switch elimina por envejecimiento una entrada MAC dinámica, pero el host emisor conserva una entrada ARP válida para ese destino. ¿Qué puede pasar con la siguiente trama?

- **A.** La trama se convierte en broadcast IP
- **B.** El host debe perder de inmediato su dirección IP
- **C.** El host usa la MAC destino en caché y el switch puede inundar el unicast desconocido
- **D.** El switch elimina automáticamente la caché ARP de todos los hosts

**Respuesta(s) propuesta(s): C.** Las cachés ARP de los hosts y las tablas MAC del switch son distintas y envejecen por separado. Una asociación válida en el host puede generar una trama cuyo destino desconoce el switch.

**English**

A switch ages out a dynamic MAC entry, while the sending host still has a valid ARP entry for that destination. What can happen to the next frame?

- **A.** The frame becomes an IP broadcast
- **B.** The host must lose its IP address immediately
- **C.** The host uses its cached destination MAC and the switch may flood the unknown unicast
- **D.** The switch automatically deletes the ARP cache on all hosts

Host ARP caches and switch MAC tables are distinct and age independently. A valid host mapping can therefore produce a frame whose destination is currently unknown to the switch.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Address Tables · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. pvst-independent-vlan-root

ID: `ccna-original-20261026-b04-014` · Área: `network_access` · Dificultad: `intermediate`

En un diseño PVST+, SW1 es raíz de VLAN 10 y SW2 es raíz de VLAN 20. ¿Es válida esta distribución?

- **A.** No; debe eliminarse VLAN 20
- **B.** Sí; cada VLAN tiene su propia instancia y elección de raíz
- **C.** No; un mismo switch físico debe ser raíz de todas las VLAN
- **D.** Solo si se deshabilita spanning tree en ambas VLAN

**Respuesta(s) propuesta(s): B.** PVST+ ejecuta una instancia por VLAN y permite distintos puentes raíz y árboles de reenvío. Ser raíz en una VLAN no obliga a serlo en otra.

**English**

In a PVST+ design, SW1 is the root for VLAN 10 and SW2 is the root for VLAN 20. Is this arrangement valid?

- **A.** No; VLAN 20 must be deleted
- **B.** Yes; each VLAN has its own spanning-tree instance and root election
- **C.** No; one physical switch must be root for every VLAN
- **D.** Only if spanning tree is disabled on both VLANs

PVST+ runs a spanning-tree instance per VLAN, permitting different root bridges and forwarding trees. A root in one VLAN need not be root in another.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Spanning-Tree Instances · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 15. bpdu-filter-port-level-loop-risk

ID: `ccna-original-20261026-b04-015` · Área: `network_access` · Dificultad: `intermediate`

Un ingeniero configura spanning-tree bpdufilter enable a nivel de interfaz en un enlace entre switches. ¿Por qué es peligroso en una topología de capa 2 redundante?

- **A.** Garantiza que el puerto remoto quede err-disabled por cada BPDU
- **B.** Suprime el intercambio de BPDU del puerto y puede impedir que STP detecte un bucle
- **C.** Convierte STP en un protocolo de routing
- **D.** Cifra las BPDU con una clave VLAN incorrecta

**Respuesta(s) propuesta(s): B.** El filtrado explícito de BPDU por interfaz suprime BPDU enviadas y recibidas y puede crear bucles. No es BPDU Guard; el filtrado global para PortFast tiene un comportamiento condicional diferente.

**English**

An engineer configures interface-level spanning-tree bpdufilter enable on an inter-switch link. Why is this dangerous in a redundant Layer 2 topology?

- **A.** It guarantees the remote port is error-disabled on every BPDU
- **B.** It suppresses BPDU exchange on that port and can prevent STP from detecting a loop
- **C.** It converts STP into a routing protocol
- **D.** It encrypts BPDUs with the wrong VLAN key

Explicit interface-level BPDU filtering suppresses sent and received BPDUs and can create loops. It is not BPDU Guard; global PortFast BPDU filtering has different conditional behavior.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_optional_spanning_tree_features.html · BPDU Filtering · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 16. stp-sender-port-id-final-tiebreak

ID: `ccna-original-20261026-b04-016` · Área: `network_access` · Dificultad: `intermediate`

Dos BPDU STP candidatas tienen el mismo ID raíz, costo total e ID de puente emisor. Sus ID de puerto emisor son 128.5 y 128.9. ¿Cuál es superior en el siguiente paso de comparación?

- **A.** Ambos deben convertirse en puentes raíz
- **B.** 128.9
- **C.** Ninguna BPDU puede compararse
- **D.** 128.5

**Respuesta(s) propuesta(s): D.** Tras empatar los campos anteriores, gana el ID de puerto emisor menor. Ambas prioridades son 128, por lo que el puerto 5 precede al 9. Se comparan BPDU recibidas, no un desempate de puertos locales.

**English**

Two candidate received STP BPDUs have identical root ID, total path cost and sender bridge ID. Their sender port IDs are 128.5 and 128.9. Which is the superior BPDU at the next comparison step?

- **A.** Both must become root bridges
- **B.** 128.9
- **C.** Neither BPDU can be compared
- **D.** 128.5

After the earlier fields tie, the lower sender port ID wins. Both port priorities are 128, so port number 5 precedes 9. This question compares received BPDUs, not local-port tie breaking.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Spanning-Tree Election · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 17. lacp-minimum-links-operational-threshold

ID: `ccna-original-20261026-b04-017` · Área: `network_access` · Dificultad: `intermediate`

Un port-channel LACP compatible exige al menos dos miembros activos mediante port-channel min-links 2. Falla uno de sus dos enlaces activos y no hay reserva. ¿Cuál es el resultado operativo previsto?

- **A.** El port-channel lógico cae porque solo queda un miembro activo
- **B.** Se duplican los ID de VLAN
- **C.** El canal siempre sigue activo sin importar min-links
- **D.** El miembro superviviente cuenta automáticamente como dos

**Respuesta(s) propuesta(s): A.** El requisito de enlaces mínimos impide mantener operativo el port-channel por debajo del umbral de miembros activos. No crea ancho de banda físico adicional.

**English**

A supported LACP port-channel requires at least two active members through port-channel min-links 2. One of its two active links fails and no standby is available. What is the intended operational result?

- **A.** The logical port-channel goes down because only one active member remains
- **B.** The VLAN IDs are doubled
- **C.** The channel always stays up regardless of min-links
- **D.** The surviving member counts as two links automatically

The minimum-links requirement prevents a port-channel from remaining operational below its configured active-member threshold. It does not create additional physical bandwidth.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · Configuring the LACP Minimum Number of Links · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. vlan-delete-versus-port-membership

ID: `ccna-original-20261026-b04-018` · Área: `network_access` · Dificultad: `intermediate`

En un Catalyst con configuración VLAN normal se elimina VLAN 40, pero un puerto conserva switchport access vlan 40. ¿Qué debe comprobarse antes de esperar que vuelva a funcionar el tráfico?

- **A.** El puerto necesariamente se cambia solo a VLAN 1
- **B.** El host debe usar una máscara /32
- **C.** Todos los puertos de acceso se vuelven troncales
- **D.** VLAN 40 debe existir y estar activa; conservar la asignación del puerto no la recrea automáticamente

**Respuesta(s) propuesta(s): D.** Eliminar una VLAN no elimina necesariamente su asignación en la configuración de interfaz. Los puertos asignados quedan inactivos hasta disponer de la VLAN o cambiar la asignación.

**English**

On a Catalyst switch using normal VLAN configuration, VLAN 40 is deleted while an access port remains configured with switchport access vlan 40. What must be checked before expecting user traffic to work again?

- **A.** The port necessarily moves itself to VLAN 1
- **B.** The host must use a /32 mask
- **C.** All access ports automatically become trunks
- **D.** VLAN 40 must exist and be active; a retained access-VLAN setting does not recreate it automatically

Deleting a VLAN does not necessarily remove the access-VLAN assignment from the interface configuration. Ports assigned to a deleted VLAN are inactive until the VLAN is available or the assignment changes.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlans.html · Deleting a VLAN · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 19. rapid-mac-move-diagnostic

ID: `ccna-original-20261026-b04-019` · Área: `network_access` · Dificultad: `intermediate`

Un switch reaprende repetidamente la misma MAC en la misma VLAN en dos puertos de acceso distintos en pocos segundos. ¿Qué hallazgo merece investigarse más directamente?

- **A.** Un fallo garantizado del servidor DNS
- **B.** Un cambio periódico normal de longitud de prefijo IPv6
- **C.** Prueba de que ambos puertos de acceso son interfaces enrutadas
- **D.** Un bucle de capa 2, una MAC duplicada o un movimiento inesperado del equipo

**Respuesta(s) propuesta(s): D.** El movimiento de MAC indica que tramas con la misma MAC origen llegan por puertos cambiantes. Es un síntoma de diagnóstico, no prueba suficiente de una causa física concreta.

**English**

A switch repeatedly relearns the same MAC in the same VLAN on two different access ports within seconds. Which finding most directly deserves investigation?

- **A.** A guaranteed DNS server failure
- **B.** A normal periodic IPv6 prefix-length change
- **C.** Proof that both access ports are routed interfaces
- **D.** A Layer 2 loop, duplicate MAC, or unexpected movement of that endpoint

MAC movement indicates that frames with the same source MAC arrive through changing ports. It is a diagnostic symptom, not enough by itself to prove which physical cause is responsible.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Address Tables · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. vlan-svi-autostate-requirements

ID: `ccna-original-20261026-b04-020` · Área: `network_access` · Dificultad: `intermediate`

Con el comportamiento autostate predeterminado, interface Vlan50 está administrativamente activa pero su protocolo de línea está caído. VLAN 50 existe. ¿Qué condición adicional debe comprobarse?

- **A.** Debe existir un registro DNS público para Vlan50
- **B.** Todos los puertos deben ser enrutados
- **C.** El ID de VLAN debe coincidir con el proceso OSPF
- **D.** Al menos un puerto de capa 2 elegible para VLAN 50 está activo y en reenvío STP

**Respuesta(s) propuesta(s): D.** El autostate predeterminado de una SVI depende de que exista la VLAN y haya un puerto elegible activo en reenvío, además de no estar administrativamente apagada. Algunas funciones modifican la elegibilidad.

**English**

With default SVI autostate behavior, interface Vlan50 is administratively up but its line protocol is down. VLAN 50 exists. What additional condition should be checked?

- **A.** A public DNS record for Vlan50 must exist
- **B.** Every switch port must be a routed port
- **C.** The VLAN ID must equal the OSPF process ID
- **D.** At least one eligible Layer 2 port for VLAN 50 is up and in STP forwarding

Default SVI autostate depends on the VLAN existing and an eligible active forwarding port, in addition to the SVI not being shut down. Platform features can alter eligibility.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_interface_characteristics.html · SVI Autostate Exclude · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 21. vrrp-virtual-default-gateway

ID: `ccna-original-20261026-b04-021` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers ofrecen VRRP a una LAN. ¿Qué dirección deben usar normalmente los hosts como gateway predeterminado para beneficiarse de la conmutación?

- **A.** La dirección DNS aunque no sea un router
- **B.** La dirección multicast de todos los routers como gateway unicast
- **C.** La IP compartida del router virtual
- **D.** La IP de gestión del router instalado primero

**Respuesta(s) propuesta(s): C.** VRRP presenta una dirección de router virtual a los hosts para que otro participante pueda asumir el reenvío. Usar solo una dirección física evita esa redundancia.

**English**

Two routers provide VRRP for one LAN. Which address should hosts normally use as their default gateway to benefit from failover?

- **A.** The DNS server address even if it is not a router
- **B.** The all-routers multicast address as an ordinary unicast gateway
- **C.** The shared virtual router IP address
- **D.** The management IP of whichever router was installed first

VRRP presents a virtual router address to hosts so another participating router can take over forwarding responsibility. A host using only one physical router address bypasses that redundancy.

Referencia: https://www.rfc-editor.org/rfc/rfc9568.txt · Introduction · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 22. vrrp-priority-election-nonowner

ID: `ccna-original-20261026-b04-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers VRRP elegibles en la misma LAN tienen prioridades R1=110 y R2=140; ninguno es propietario de la dirección virtual. Con preemption habilitado y red estable, ¿cuál debe quedar activo?

- **A.** R2
- **B.** Ninguno porque las prioridades deben ser iguales
- **C.** R1
- **D.** Ambos simultáneamente

**Respuesta(s) propuesta(s): A.** Entre estos routers no propietarios gana la prioridad mayor. El propietario tiene el comportamiento especial de prioridad 255, excluido aquí; no es una comparación de distancia administrativa menor.

**English**

Two VRRP routers on the same LAN are eligible, have priorities R1=110 and R2=140, and neither owns the virtual address. With preemption enabled and a stable network, which should become active?

- **A.** R2
- **B.** Neither because priorities must be equal
- **C.** R1
- **D.** Both simultaneously

For these non-owner routers, the higher priority wins. The address owner has special priority 255 behavior, excluded here; this is not a lowest-value administrative-distance comparison.

Referencia: https://www.rfc-editor.org/rfc/rfc9568.txt · 6.4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 23. ospf-reference-bandwidth-consistency

ID: `ccna-original-20261026-b04-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

R1 usa un ancho de banda de referencia OSPF de 100 Mbps y R2 de 1000 Mbps. ¿Por qué conviene uniformarlo en el dominio?

- **A.** Porque el valor debe coincidir en los Hello para formar adyacencia
- **B.** Porque la referencia cambia la velocidad Ethernet física
- **C.** Porque OSPF se convierte en RIP si difiere
- **D.** Para que los costos de interfaz reflejen una escala coherente al anunciar enlaces

**Respuesta(s) propuesta(s): D.** La referencia afecta los costos de interfaz calculados localmente. Uniformarla mejora la coherencia de métricas, pero no es un campo de Hello que deba coincidir ni cambia la velocidad física.

**English**

R1 uses an OSPF reference bandwidth of 100 Mbps and R2 uses 1000 Mbps. Why should the engineer normally make the reference bandwidth consistent across the domain?

- **A.** Because the reference-bandwidth value must match in Hello packets to form adjacency
- **B.** Because reference bandwidth changes the physical Ethernet speed
- **C.** Because OSPF otherwise turns into RIP
- **D.** So interface costs reflect a consistent scale when routers advertise link costs

Reference bandwidth affects locally calculated interface costs. Consistency improves metric interpretation, but the value itself is not a Hello adjacency-matching field and does not set physical speed.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 24. ospf-network-statement-interface-selection

ID: `ccna-original-20261026-b04-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

En OSPFv2 de Cisco IOS, ¿cuál es el efecto principal de network 10.1.0.0 0.0.255.255 area 0 dentro de router ospf 1?

- **A.** Crea VLAN 0 en todos los switches
- **B.** Cambia automáticamente el router ID a 10.1.0.0
- **C.** Filtra todas las rutas aprendidas y deja solo 10.1.0.0/16
- **D.** Selecciona interfaces locales coincidentes para OSPF área 0; no es un filtro de rutas salientes

**Respuesta(s) propuesta(s): D.** El comando network compara direcciones de interfaces locales y asocia las elegidas a un área OSPF. Filtrar anuncios de rutas es un mecanismo diferente.

**English**

In Cisco IOS OSPFv2, what is the main effect of network 10.1.0.0 0.0.255.255 area 0 under router ospf 1?

- **A.** It creates VLAN 0 on every switch
- **B.** It changes the router ID to 10.1.0.0 automatically
- **C.** It filters all learned routes down to only 10.1.0.0/16
- **D.** It selects matching local interfaces for OSPF area 0; it is not an outbound route filter

The network command matches local interface addresses and associates selected interfaces with an OSPF area. Filtering route advertisements is a separate mechanism.

Referencia: https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/xe-17/iro-xe-17-book/iro-cfg.html · Enabling OSPF · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 25. ospf-area-id-mismatch

ID: `ccna-original-20261026-b04-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers OSPFv2 comparten una subred Ethernet normal. Una interfaz pertenece al área 0 y la otra al área 1; el resto de ajustes relevantes coincide. ¿Por qué no forman la adyacencia prevista?

- **A.** Ambos ID de proceso deben igualar el número de área
- **B.** El Area ID OSPF no coincide en este enlace
- **C.** OSPF prohíbe adyacencias Ethernet
- **D.** Primero deben ser idénticos los router ID

**Respuesta(s) propuesta(s): B.** En un enlace compartido normal los paquetes OSPF recibidos deben corresponder al área de la interfaz. Los ID de proceso locales no deben coincidir; los router ID deben ser únicos. Se excluyen los enlaces virtuales.

**English**

Two OSPFv2 routers share an ordinary Ethernet subnet. One interface belongs to area 0 and the other to area 1; all other relevant settings match. Why will they not form the intended adjacency?

- **A.** The process IDs must both equal the area number
- **B.** The OSPF Area ID does not match on this link
- **C.** OSPF forbids Ethernet adjacencies
- **D.** Router IDs must be identical first

For a normal shared link, received OSPF packets must belong to the interface area. Local process IDs need not match; router IDs should be unique. Virtual links are outside this scenario.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 8.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 26. ospf-authentication-mismatch

ID: `ccna-original-20261026-b04-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos vecinos OSPFv2 directamente conectados coinciden en subred, área y temporizadores, pero usan autenticación incompatible. ¿Qué acción aborda la causa?

- **A.** Compatibilizar el modo de autenticación y las claves del enlace
- **B.** Añadir un CNAME DNS para cada router
- **C.** Aumentar la concesión DHCP de los hosts
- **D.** Forzar router ID idénticos

**Respuesta(s) propuesta(s): A.** OSPF verifica la autenticación al aceptar paquetes. Tener conectividad IP y temporizadores iguales no evita una autenticación incompatible.

**English**

Two directly connected OSPFv2 neighbors have matching subnet, area and timers but incompatible authentication settings. Which action addresses the cause?

- **A.** Align the supported authentication mode and key settings on the link
- **B.** Add a DNS CNAME for each router
- **C.** Increase the host DHCP lease
- **D.** Force identical router IDs

OSPF validates authentication as part of packet acceptance. Reachable IP addresses and matching timers do not bypass incompatible authentication.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 8.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 27. ospf-link-failure-shortest-path

ID: `ccna-original-20261026-b04-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un área OSPF tiene enlaces bidireccionales R1–R2 costo 5, R2–R4 costo 5, R1–R3 costo 8, R3–R4 costo 8 y R2–R3 costo 2. Falla R2–R4. ¿Qué ruta restante de R1 a R4 tiene menor costo?

- **A.** R1 -> R2 -> R4
- **B.** No queda ninguna ruta
- **C.** R1 -> R3 -> R4
- **D.** R1 -> R2 -> R3 -> R4

**Respuesta(s) propuesta(s): D.** Tras retirar el enlace fallado, R1–R2–R3–R4 cuesta 5+2+8=15, frente a 16 por R3 directamente. La ruta antigua por R2–R4 ya no está disponible.

**English**

An OSPF area has bidirectional links R1–R2 cost 5, R2–R4 cost 5, R1–R3 cost 8, R3–R4 cost 8, and R2–R3 cost 2. The R2–R4 link fails. Which remaining path from R1 to R4 has lowest total cost?

- **A.** R1 -> R2 -> R4
- **B.** No path remains
- **C.** R1 -> R3 -> R4
- **D.** R1 -> R2 -> R3 -> R4

After removing the failed link, R1–R2–R3–R4 costs 5+2+8=15, versus 16 through R3 directly. The former path through R2–R4 is unavailable.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.1 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 28. specific-discard-route-over-default

ID: `ccna-original-20261026-b04-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

Las rutas IPv4 instaladas son 0.0.0.0/0 por un ISP y 203.0.113.0/24 hacia Null0. Con reenvío normal por destino y sin policy routing, ¿qué ocurre con un paquete a 203.0.113.7?

- **A.** Coincide con la ruta de descarte /24 y se descarta
- **B.** Se debe balancear entre ambas rutas
- **C.** Se difunde por todos los puertos
- **D.** Usa la predeterminada porque siempre gana

**Respuesta(s) propuesta(s): A.** La coincidencia de prefijo más largo elige la /24 antes que la /0. Null0 descarta deliberadamente el tráfico; la ruta predeterminada no anula la especificidad.

**English**

The installed IPv4 routes are 0.0.0.0/0 via an ISP and 203.0.113.0/24 to Null0. With ordinary destination-based forwarding and no policy routing, what happens to a packet for 203.0.113.7?

- **A.** It matches the /24 discard route and is discarded
- **B.** The two routes must be load-balanced
- **C.** It is broadcast on every port
- **D.** It uses the default because defaults always win

Longest-prefix match chooses the installed /24 before the /0. A discard next hop intentionally drops traffic; the existence of a default route does not override specificity.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.4.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 29. connected-route-interface-down

ID: `ccna-original-20261026-b04-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router conoce 10.50.0.0/24 solo como red conectada de Gi0/0. La interfaz se apaga administrativamente y no hay otra ruta para ese prefijo. ¿Qué pasa con la ruta conectada?

- **A.** Su prefijo cambia automáticamente a /32
- **B.** Se vuelve automáticamente una ruta externa OSPF
- **C.** Se retira de la tabla de rutas activa
- **D.** Sigue siendo utilizable solo porque su distancia administrativa era 0

**Respuesta(s) propuesta(s): C.** Una ruta conectada depende de una interfaz local operativa. Una distancia administrativa baja no mantiene utilizable un camino conectado no disponible.

**English**

A router learns 10.50.0.0/24 only as a connected network on Gi0/0. That interface goes administratively down. No other route for the prefix exists. What happens to the connected route?

- **A.** Its prefix changes to /32 automatically
- **B.** It becomes an OSPF external route automatically
- **C.** It is removed from the active routing table
- **D.** It stays usable merely because its administrative distance was 0

A connected route depends on an operational local interface. A low administrative distance does not keep an unavailable connected path in service.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 30. ethernet-next-hop-versus-final-ip

ID: `ccna-original-20261026-b04-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host envía por Ethernet un paquete IPv4 a una red remota a través de su gateway local. ¿Qué direcciones aparecen normalmente en la primera trama y paquete, antes de cualquier NAT? Selecciona dos.

- **A.** El destino IP debe sustituirse por la IP del gateway local
- **B.** El destino Ethernet debe ser la MAC del host remoto
- **C.** El destino Ethernet es la MAC del gateway local
- **D.** El destino IP es el host remoto final

**Respuesta(s) propuesta(s): C, D.** En el reenvío normal el destino IP sigue siendo el destino final. El destino Ethernet alcanza el siguiente salto local; los saltos enrutados usan cabeceras nuevas de capa 2.

**English**

A host sends an IPv4 packet to a remote network through its local gateway on Ethernet. Which addresses normally appear on the first frame and packet, before any NAT? Select two.

- **A.** IP destination must be replaced with the local gateway IP
- **B.** Ethernet destination must be the remote host MAC
- **C.** Ethernet destination is the local gateway MAC
- **D.** IP destination is the final remote host

The IP destination remains the end destination during ordinary forwarding. The Ethernet destination reaches the next hop on the local link; new Layer 2 headers are used at routed hops.

Referencia: https://www.rfc-editor.org/rfc/rfc1122.txt · 3.3.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 31. ipv6-ra-hop-limit-validation

ID: `ccna-original-20261026-b04-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host recibe un Router Advertisement IPv6 aparentemente válido con Hop Limit IPv6 de 64. ¿Qué debe hacer su validación de Neighbor Discovery?

- **A.** Aceptarlo solo si su servidor DNS responde
- **B.** Convertirlo en una ruta predeterminada IPv4
- **C.** Descartarlo; un RA válido recibido debe tener Hop Limit 255
- **D.** Aceptarlo porque 64 es un valor común en hosts

**Respuesta(s) propuesta(s): C.** Neighbor Discovery exige Hop Limit IPv6 de 255 en los Router Advertisement recibidos. Esto ayuda a comprobar su origen en el enlace local, pero no es autenticación criptográfica.

**English**

A host receives an otherwise plausible IPv6 Router Advertisement with IPv6 Hop Limit 64. What should its Neighbor Discovery validation do?

- **A.** Accept it only if its DNS server is reachable
- **B.** Convert it to an IPv4 default route
- **C.** Discard it; a valid received RA must have Hop Limit 255
- **D.** Accept it because 64 is a common host default

Neighbor Discovery requires received Router Advertisements to have IPv6 Hop Limit 255. This helps establish that they originated on the local link, but is not cryptographic authentication.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 6.1.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 32. icmp-redirect-same-link-next-hop

ID: `ccna-original-20261026-b04-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host envía por R1, pero el mejor siguiente salto R2 está en la misma LAN que el host. Bajo condiciones válidas de redirect IPv4, ¿qué indica un ICMP Redirect?

- **A.** Una contraseña DNS de reemplazo
- **B.** Que el paquete necesariamente es malicioso
- **C.** Que el servidor remoto cambió su puerto TCP
- **D.** Un gateway de siguiente salto más apropiado para ese destino

**Respuesta(s) propuesta(s): D.** Un ICMP Redirect informa al host de un siguiente salto mejor en la red local bajo condiciones definidas. No cambia la identidad de aplicación ni reemplaza las políticas de seguridad de routing.

**English**

A host sends through router R1, but the best next hop R2 is on the same LAN as that host. Under valid IPv4 redirect conditions, what does an ICMP Redirect tell the host?

- **A.** A replacement DNS password
- **B.** That the packet is guaranteed malicious
- **C.** That the remote server changed its TCP port
- **D.** A more appropriate next-hop gateway for that destination

An ICMP Redirect advises a host about a better next hop on the local network under defined conditions. It does not change application identity or replace routing-security policy.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.7.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 33. dhcp-nak-return-to-initialization

ID: `ccna-original-20261026-b04-033` · Área: `ip_services` · Dificultad: `intermediate`

Un cliente DHCPv4 en estado REQUESTING recibe un DHCPNAK válido para la dirección solicitada. ¿Qué debe hacer después?

- **A.** Volver a INIT y reiniciar la obtención de dirección
- **B.** Deshabilitar todos los switches de la subred
- **C.** Seguir usando indefinidamente la dirección rechazada
- **D.** Tratar el NAK como una renovación exitosa

**Respuesta(s) propuesta(s): A.** Un DHCPNAK rechaza la configuración intentada. El cliente vuelve a INIT para obtener una configuración válida; no debe tratar el NAK como un ACK.

**English**

A DHCPv4 client in REQUESTING receives a valid DHCPNAK for its attempted address. What should it do next?

- **A.** Return to INIT and restart address acquisition
- **B.** Disable all switches on the subnet
- **C.** Keep using the rejected address indefinitely
- **D.** Treat NAK as a successful lease renewal

A DHCPNAK rejects the attempted configuration. The client returns to INIT to begin acquiring a valid configuration instead of treating the NAK as an ACK.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.4.1 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 34. dns-nxdomain-versus-nodata

ID: `ccna-original-20261026-b04-034` · Área: `ip_services` · Dificultad: `intermediate`

Una respuesta DNS autoritativa tiene RCODE=NOERROR y ninguna respuesta A para un nombre existente que solo tiene datos AAAA. ¿En qué se diferencia de NXDOMAIN?

- **A.** NOERROR prueba que debe haber una dirección IPv4
- **B.** Ambas siempre indican que todo el servidor DNS está caído
- **C.** NXDOMAIN solo significa que el TTL llegó a cero
- **D.** El nombre existe pero no tiene los datos A pedidos; NXDOMAIN indica que el nombre no existe

**Respuesta(s) propuesta(s): D.** Una respuesta negativa por un conjunto de registros ausente en un nombre existente es NODATA, distinta del error de nombre NXDOMAIN. El escenario usa datos autoritativos sin alias.

**English**

An authoritative DNS reply has RCODE=NOERROR and no A answers for an existing name that has only AAAA data. How should this differ from NXDOMAIN?

- **A.** NOERROR proves an IPv4 address must be present
- **B.** Both always mean the entire DNS server is offline
- **C.** NXDOMAIN only means the TTL reached zero
- **D.** The name exists but has no requested A data; NXDOMAIN indicates the name does not exist

A negative response for a missing RRset at an existing name is NODATA, distinct from the name-error RCODE NXDOMAIN. The question concerns authoritative data without aliases.

Referencia: https://www.rfc-editor.org/rfc/rfc2308.txt · 2.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 35. ntp-round-trip-delay-calculation

ID: `ccna-original-20261026-b04-035` · Área: `ip_services` · Dificultad: `intermediate`

Los timestamps NTP en milisegundos son T1=100, T2=150, T3=170 y T4=240. ¿Cuál es el retardo de ida y vuelta de red tras descontar el procesamiento del servidor?

- **A.** 20 ms
- **B.** 60 ms
- **C.** 140 ms
- **D.** 120 ms

**Respuesta(s) propuesta(s): D.** El retardo NTP es (T4−T1)−(T3−T2) = 140−20 = 120 ms. Es el retardo de ida y vuelta, no el desfase del reloj ni la latencia unidireccional.

**English**

NTP timestamps in milliseconds are T1=100, T2=150, T3=170 and T4=240. What is the network round-trip delay after removing server processing time?

- **A.** 20 ms
- **B.** 60 ms
- **C.** 140 ms
- **D.** 120 ms

NTP delay is (T4−T1)−(T3−T2) = 140−20 = 120 ms. This is round-trip delay, not the clock offset or one-way latency.

Referencia: https://www.rfc-editor.org/rfc/rfc5905.txt · 8 · Consulta: retrieved_pending_review

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 36. qos-shaping-versus-policing

ID: `ccna-original-20261026-b04-036` · Área: `ip_services` · Dificultad: `intermediate`

Un proveedor permite una tasa de tráfico determinada. ¿Qué dos afirmaciones distinguen el shaping habitual del policing? Selecciona dos.

- **A.** El shaping siempre transmite por encima de la velocidad física
- **B.** El shaping puede almacenar paquetes excedentes para enviarlos después
- **C.** El policing garantiza entrega almacenando todo paquete excedente
- **D.** El policing puede descartar o remarcar paquetes no conformes

**Respuesta(s) propuesta(s): B, D.** El shaping retrasa tráfico mediante almacenamiento para ajustarlo a un perfil. El policing evalúa la conformidad y aplica acciones como descarte o remarcado; ninguno crea ancho de banda físico.

**English**

A provider allows a specified traffic rate. Which two statements distinguish common traffic shaping from policing? Select two.

- **A.** Shaping always makes packets leave faster than the physical line rate
- **B.** Shaping can buffer excess packets for later transmission
- **C.** Policing guarantees delivery by buffering every excess packet
- **D.** Policing can drop or remark nonconforming packets

Shaping delays traffic using buffering to conform to a profile. Policing evaluates conformance and applies actions such as dropping or remarking; neither creates physical bandwidth.

Referencia: https://www.rfc-editor.org/rfc/rfc2475.txt · 2.3.3 and 2.3.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 37. diffserv-ef-not-end-to-end-guarantee

ID: `ccna-original-20261026-b04-037` · Área: `ip_services` · Dificultad: `intermediate`

Un paquete de voz está marcado DSCP EF. ¿Qué conclusión operativa se justifica?

- **A.** El paquete se cifra automáticamente
- **B.** Todos los routers de Internet deben reservar ancho de banda para el flujo
- **C.** Solicita comportamiento EF por salto donde esté configurado; la marca sola no garantiza calidad de voz extremo a extremo
- **D.** El paquete no puede descartarse durante congestión

**Respuesta(s) propuesta(s): C.** EF describe un comportamiento de reenvío por salto. Importan el aprovisionamiento, la clasificación, las políticas y la capacidad; una marca DSCP no es garantía universal extremo a extremo.

**English**

A voice packet is marked DSCP EF. Which operational conclusion is justified?

- **A.** The packet is encrypted automatically
- **B.** Every Internet router must reserve bandwidth for the flow
- **C.** It requests an EF per-hop behavior where configured; the marking alone does not guarantee end-to-end voice quality
- **D.** The packet cannot be dropped during congestion

EF describes a per-hop forwarding behavior. Provisioning, classification, policy and capacity matter; a DSCP label alone is not a universal end-to-end service guarantee.

Referencia: https://www.rfc-editor.org/rfc/rfc3246.txt · 2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 38. tls-certificate-expiration-verification

ID: `ccna-original-20261026-b04-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un administrador accede a un portal de gestión HTTPS cuyo certificado venció ayer. ¿Qué respuesta conserva la verificación de identidad del servidor?

- **A.** Suponer que el cifrado por sí solo prueba la identidad esperada
- **B.** Desactivar permanentemente la verificación en todos los equipos
- **C.** Revisar reloj y vigencia, y renovar o corregir el certificado mediante un proceso confiable
- **D.** Reemplazar HTTPS por HTTP sin autenticación

**Respuesta(s) propuesta(s): C.** La validación de la cadena incluye comprobar los períodos de vigencia con la hora actual. Conservar la autenticación exige corregir la causa en lugar de omitir globalmente la verificación.

**English**

An administrator reaches an HTTPS management portal whose certificate expired yesterday. Which response preserves server-identity verification?

- **A.** Assume encryption alone proves the intended server identity
- **B.** Disable certificate verification permanently for all devices
- **C.** Investigate clock and certificate validity, then renew or correct the certificate through a trusted process
- **D.** Replace HTTPS with unauthenticated HTTP

Certificate path validation includes checking validity periods against the current time. Preserving authentication requires fixing the cause rather than globally bypassing verification.

Referencia: https://www.rfc-editor.org/rfc/rfc5280.txt · 6.1.3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 39. ssh-public-key-private-key-separation

ID: `ccna-original-20261026-b04-039` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un ingeniero configura autenticación SSH con clave pública. ¿Qué material se instala en la lista de claves autorizadas del servidor y cuál debe protegerse en el cliente?

- **A.** Instalar la clave pública en el servidor; proteger la privada en el cliente
- **B.** Subir la clave privada a todos los servidores como credencial pública
- **C.** Usar la clave de host del servidor como clave privada de todos los usuarios
- **D.** Publicar ambas claves en DNS sin restricciones

**Respuesta(s) propuesta(s): A.** La autenticación de clave pública prueba posesión de una clave privada mediante firmas. El servidor puede autorizar la pública sin recibir la privada del usuario. La autenticación de host es un rol distinto.

**English**

An engineer configures SSH public-key authentication. Which material should be installed in the server authorized-key list, and which must remain protected at the client?

- **A.** Install the public key at the server; protect the private key at the client
- **B.** Upload the private key to every server as a public credential
- **C.** Use the server host key as every user private key
- **D.** Publish both keys in DNS without restrictions

Public-key authentication proves possession of a private key using signatures. The server can authorize the public key without receiving the user private key. Server host authentication is a separate role.

Referencia: https://www.rfc-editor.org/rfc/rfc4252.txt · 7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 40. esp-integrity-without-encryption-option

ID: `ccna-original-20261026-b04-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un ingeniero afirma que toda configuración ESP IPsec válida necesariamente cifra el contenido. ¿Qué corrección es precisa?

- **A.** ESP solo evita bucles Ethernet
- **B.** Integridad y confidencialidad son propiedades idénticas
- **C.** ESP nunca admite cifrado
- **D.** ESP puede proporcionar integridad sin confidencialidad si se elige deliberadamente cifrado nulo

**Respuesta(s) propuesta(s): D.** ESP admite confidencialidad e integridad en combinaciones permitidas, incluida integridad sin cifrado. Los algoritmos negociados determinan los servicios proporcionados.

**English**

An engineer says every valid IPsec ESP configuration necessarily encrypts packet contents. Which correction is accurate?

- **A.** ESP is only an Ethernet loop-prevention protocol
- **B.** Integrity and confidentiality are identical properties
- **C.** ESP never supports encryption
- **D.** ESP can provide integrity without confidentiality when a null-encryption configuration is deliberately selected

ESP supports confidentiality and integrity services in permitted combinations, including integrity without encryption. The actual negotiated algorithms determine the services supplied.

Referencia: https://www.rfc-editor.org/rfc/rfc4303.txt · 2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. authentication-distinct-factor-categories

ID: `ccna-original-20261026-b04-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un acceso exige contraseña y otro PIN memorizado, ambos introducidos por el usuario. ¿Por qué esto solo no establece dos factores distintos?

- **A.** Un PIN nunca puede usarse para autenticación
- **B.** Dos pantallas siempre cuentan como dos factores
- **C.** Ambos secretos son factores de conocimiento; sigue faltando otra categoría de factor
- **D.** Los factores se determinan solo por la longitud de contraseña

**Respuesta(s) propuesta(s): C.** Usar dos secretos de conocimiento no añade por sí mismo un factor de posesión o inherencia. Tener varios pasos y tener distintas categorías de factor son conceptos diferentes.

**English**

A login requires a password and a second memorized PIN, both entered by the same user. Why does this alone fail to establish two distinct authentication factors?

- **A.** A PIN can never be used in any authentication system
- **B.** Two screens always count as two factors
- **C.** Both secrets are knowledge factors; a different factor category is still needed
- **D.** Authentication factors are determined only by password length

Using two knowledge secrets does not by itself add a possession or inherence factor. Multiple prompts and multiple independent factor categories are different concepts.

Referencia: https://www.rfc-editor.org/rfc/rfc4949.txt · authentication information · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 42. password-storage-salted-one-way-verifier

ID: `ccna-original-20261026-b04-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una aplicación de gestión de red debe verificar contraseñas de usuarios locales. ¿Qué almacenamiento es apropiado?

- **A.** Un salt por contraseña y un verificador mediante una función de hashing de contraseñas con costo adecuado
- **B.** Contraseñas en texto claro legibles por soporte
- **C.** Codificación Base64 sin otra protección
- **D.** Una sustitución reversible compartida para todas las cuentas

**Respuesta(s) propuesta(s): A.** El hashing de contraseñas debe usar salts únicos y un factor de trabajo adecuado. Base64 es codificación; el texto claro o cifrado reversible expone secretos reutilizables si se lee la base.

**English**

A network management application must verify local user passwords. Which storage approach is appropriate?

- **A.** A per-password salt and a suitable costly password-hashing verifier
- **B.** Plaintext passwords readable by support staff
- **C.** Base64 encoding with no additional protection
- **D.** One shared reversible substitution for all accounts

Password hashing should use unique salts and an appropriate work factor. Base64 is encoding, and reversible or plaintext storage exposes reusable secrets if the database is read.

Referencia: https://www.rfc-editor.org/rfc/rfc9106.txt · 7.4 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 43. dhcp-starvation-pool-exhaustion

ID: `ccna-original-20261026-b04-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un atacante envía muchas solicitudes DHCP con identidades cambiantes hasta agotar el pool. ¿Cuál es el efecto más directo en clientes legítimos nuevos?

- **A.** El switch convierte todos los puertos en troncales
- **B.** Toda IP estática existente queda cifrada
- **C.** Todos los nombres DNS necesariamente se eliminan
- **D.** Pueden no obtener concesión porque ya no quedan direcciones disponibles

**Respuesta(s) propuesta(s): D.** Agotar el pool es una denegación de servicio contra la asignación de direcciones. Puede no haber concesiones libres para nuevos clientes; el ataque no reescribe por sí mismo IP estáticas ni DNS.

**English**

An attacker sends many DHCP requests with changing client identities until the address pool is exhausted. What is the most direct effect on new legitimate clients?

- **A.** The switch changes every port to a trunk
- **B.** Every existing static IP address is encrypted
- **C.** All DNS names are necessarily deleted
- **D.** They may fail to obtain a lease because no addresses remain available

Pool exhaustion is a denial-of-service mechanism against address allocation. The server may have no free leases for legitimate newcomers; the attack does not itself rewrite static addressing or DNS.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. antispoof-ingress-source-validation

ID: `ccna-original-20261026-b04-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una interfaz de router hacia un cliente solo debe aceptar paquetes con origen en el prefijo asignado al cliente. ¿Qué control aborda directamente las direcciones origen falsificadas que llegan allí?

- **A.** Una política de validación de origen entrante adecuada al prefijo del cliente
- **B.** Cambiar solo el nombre de host de syslog
- **C.** Deshabilitar todos los contadores
- **D.** Solo un sufijo de búsqueda DNS

**Respuesta(s) propuesta(s): A.** El filtrado de entrada comprueba si una dirección origen corresponde a la interfaz receptora. Limita la suplantación en ese límite, pero no autentica todas las aplicaciones ni elimina todo ataque.

**English**

A customer-facing router interface should accept only packets with source addresses from the customer assigned prefix. Which control directly addresses forged source addresses arriving there?

- **A.** An ingress source-validation policy appropriate to that customer prefix
- **B.** Changing the syslog hostname only
- **C.** Disabling all interface counters
- **D.** A DNS search suffix only

Ingress filtering checks whether a source address is appropriate on the receiving interface. It limits spoofing at that boundary but does not authenticate every application or eliminate all attacks.

Referencia: https://www.rfc-editor.org/rfc/rfc2827.txt · 3 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 45. snmpv3-authpriv-service-properties

ID: `ccna-original-20261026-b04-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una política exige autenticación y confidencialidad de mensajes SNMP. ¿Qué nivel de seguridad SNMPv3 ofrece ambas al configurarse correctamente?

- **A.** authNoPriv
- **B.** Solo una community string de SNMPv1
- **C.** noAuthNoPriv
- **D.** authPriv

**Respuesta(s) propuesta(s): D.** authPriv combina autenticación y privacidad. authNoPriv omite cifrado y noAuthNoPriv omite ambos; elegir el nivel no reemplaza configurar correctamente claves y algoritmos.

**English**

A management policy requires SNMP message authentication and confidentiality. Which SNMPv3 security level supplies both when correctly configured?

- **A.** authNoPriv
- **B.** A community string alone in SNMPv1
- **C.** noAuthNoPriv
- **D.** authPriv

authPriv combines authentication with privacy. authNoPriv omits encryption and noAuthNoPriv omits both; naming a level does not replace correct key and algorithm configuration.

Referencia: https://www.rfc-editor.org/rfc/rfc3414.txt · 1.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. http-delete-idempotent-not-identical-response

ID: `ccna-original-20261026-b04-046` · Área: `automation_programmability` · Dificultad: `intermediate`

Un cliente automatizado envía DELETE dos veces al mismo recurso. La primera respuesta es 204 y la segunda 404. ¿Esa diferencia por sí sola contradice la idempotencia HTTP?

- **A.** No; el efecto final previsto puede ser el mismo aunque las respuestas difieran
- **B.** No; porque HTTP ignora por completo el estado de recursos
- **C.** Sí; DELETE se define como no idempotente
- **D.** Sí; idempotente siempre exige respuestas idénticas byte por byte

**Respuesta(s) propuesta(s): A.** La idempotencia se refiere al efecto previsto de repetir una solicitud idéntica, no a códigos de estado idénticos. Tras eliminarlo, el recurso puede seguir ausente y otra solicitud informar que no existe.

**English**

An automation client sends DELETE twice for the same resource. The first response is 204 and the second is 404. Does that response difference alone contradict HTTP idempotence?

- **A.** No; the intended final server effect may be the same even when responses differ
- **B.** No; because HTTP ignores resource state completely
- **C.** Yes; DELETE is defined as non-idempotent
- **D.** Yes; idempotent always means byte-identical responses

Idempotence concerns the intended effect of repeating an identical request, not identical status codes. Once deleted, the target can remain absent and a later request can report not found.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 9.2.2 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 47. json-array-ordered-interface-selection

ID: `ccna-original-20261026-b04-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API devuelve {"interfaces":[{"name":"Gi0/2"},{"name":"Gi0/1"}]}. En un lenguaje con índices de arreglo desde cero, ¿cuánto vale interfaces[1].name?

- **A.** Gi0/2
- **B.** null porque los arreglos no tienen orden
- **C.** interfaces
- **D.** Gi0/1

**Respuesta(s) propuesta(s): D.** Los arreglos JSON conservan el orden. Con índices desde cero, 1 es el segundo elemento, cuyo nombre es Gi0/1; el orden de miembros de objetos es otro asunto.

**English**

An API returns {"interfaces":[{"name":"Gi0/2"},{"name":"Gi0/1"}]}. In a language using zero-based array indexing, what is interfaces[1].name?

- **A.** Gi0/2
- **B.** null because arrays are unordered
- **C.** interfaces
- **D.** Gi0/1

JSON arrays preserve element order. With zero-based indexing, index 1 is the second element, whose name is Gi0/1; object-member ordering is a separate issue.

Referencia: https://www.rfc-editor.org/rfc/rfc8259.txt · 5 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 48. netconf-confirmed-commit-revert-safety

ID: `ccna-original-20261026-b04-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Un servidor NETCONF anuncia confirmed-commit. Un operador ejecuta un commit confirmado con plazo, pero pierde acceso antes de confirmarlo. ¿Qué comportamiento de seguridad se espera al vencer el plazo?

- **A.** Se revierte la configuración aplicada que no se confirmó
- **B.** El plazo aprueba automáticamente todo cambio sin confirmar
- **C.** NETCONF desactiva el cifrado SSH
- **D.** El servidor borra para siempre todo historial de configuración

**Respuesta(s) propuesta(s): A.** El commit confirmado requiere confirmación antes del plazo configurado; de lo contrario el servidor restaura la configuración anterior. Hay que comprobar capacidad y plazo antes de depender de él.

**English**

A NETCONF server advertises confirmed-commit capability. An operator issues a confirmed commit with a timeout but loses management access before confirming it. What safety behavior is expected when the timeout expires?

- **A.** The unconfirmed committed configuration is reverted
- **B.** The timeout automatically approves any unconfirmed change
- **C.** NETCONF disables SSH cryptography
- **D.** The server permanently erases all configuration history

Confirmed commit requires confirmation before the configured timeout; otherwise the server restores the previous configuration. Capability support and timeout choices must be checked before relying on it.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 8.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. yang-config-false-state-data

ID: `ccna-original-20261026-b04-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Un nodo de datos YANG se declara config false. ¿Qué debe inferir un cliente automatizado sobre escribirlo como configuración normal?

- **A.** El servidor desactivó todo cifrado TLS
- **B.** Representa datos de estado, no un nodo de configuración ordinario escribible
- **C.** El cliente debe cambiar su propia máscara IP para escribirlo
- **D.** El nodo solo puede contener el booleano false

**Respuesta(s) propuesta(s): B.** La propiedad config distingue configuración y estado en YANG. config false describe el rol del nodo, no un valor booleano obligatorio ni un ajuste de seguridad del transporte.

**English**

A YANG data node is declared config false. What should an automation client infer about writing that node as ordinary configuration?

- **A.** The server has disabled all TLS encryption
- **B.** It represents nonconfiguration state data and is not an ordinary writable configuration node
- **C.** The client must change its own IP mask to write it
- **D.** The node can only contain the Boolean false

The YANG config property distinguishes configuration from state data. config false describes the node role, not a required Boolean value or a transport-security setting.

Referencia: https://www.rfc-editor.org/rfc/rfc7950.txt · 7.21.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. restconf-http-status-and-error-body

ID: `ccna-original-20261026-b04-050` · Área: `automation_programmability` · Dificultad: `intermediate`

Un script envía GET por RESTCONF y recibe un estado HTTP de error con cuerpo de error. ¿Qué dos conductas mejoran su fiabilidad? Selecciona dos.

- **A.** Analizar la información de error estructurada cuando esté disponible
- **B.** Reintentar todo error indefinidamente sin pausa ni clasificación
- **C.** Tratar todo cuerpo como una captura exitosa de configuración
- **D.** Comprobar el estado HTTP antes de tratar la respuesta como datos exitosos

**Respuesta(s) propuesta(s): A, D.** RESTCONF asocia errores con códigos HTTP e información estructurada. El cliente debe interpretar ambos y aplicar manejo limitado según el fallo, sin suponer que cualquier JSON significa éxito.

**English**

An automation script sends a RESTCONF GET and receives a non-success HTTP status plus an error body. Which two behaviors improve reliability? Select two.

- **A.** Parse the returned structured error information when available
- **B.** Retry every error forever without delay or classification
- **C.** Treat every response body as a successful configuration snapshot
- **D.** Inspect the HTTP status before treating the response as successful data

RESTCONF maps errors to HTTP status codes and structured error information. Clients should interpret both and apply bounded handling appropriate to the failure instead of assuming that any JSON means success.

Referencia: https://www.rfc-editor.org/rfc/rfc8040.txt · 7 · Consulta: retrieved_pending_review

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.
