# Lote original: original-20261026-b05-50

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

## 1. ipv6-ula-global-internet-expectation

ID: `ccna-original-20261026-b05-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una empresa usa fd12:3456:789a::/48 internamente. ¿Qué expectativa sobre estas direcciones IPv6 locales únicas es adecuada?

- **A.** Se destinan a comunicaciones locales y no se espera que se enruten en Internet global
- **B.** Todas equivalen a loopback ::1
- **C.** Todo ISP debe anunciar globalmente el prefijo
- **D.** Son direcciones multicast IPv6

**Respuesta(s) propuesta(s): A.** Las direcciones IPv6 locales únicas usan FC00::/7; los prefijos asignados localmente tienen el bit L activo y pertenecen a FD00::/8. No se espera su enrutamiento en Internet global.

**English**

An enterprise uses fd12:3456:789a::/48 internally. Which expectation about these IPv6 Unique Local Addresses is appropriate?

- **A.** They are intended for local communications and are not expected to be routed on the global Internet
- **B.** They are all equivalent to ::1 loopback
- **C.** Every ISP must advertise the prefix globally
- **D.** They are IPv6 multicast addresses

Unique Local IPv6 addresses use FC00::/7; locally assigned prefixes have the L bit set, yielding FD00::/8. They are not expected to be routed on the global Internet.

Referencia: https://www.rfc-editor.org/rfc/rfc4193.txt · 1 and 3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 2. ipv4-reassembly-final-destination

ID: `ccna-original-20261026-b05-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un origen envía tráfico IPv4 fragmentado por dos routers de tránsito. ¿Qué nodo reensambla normalmente el datagrama IP original para entregarlo a la capa superior?

- **A.** El destino IP final
- **B.** Solo el primer switch Ethernet
- **C.** El servidor DNS del dominio origen
- **D.** Cada router de tránsito antes de reenviar

**Respuesta(s) propuesta(s): A.** IPv4 puede fragmentarse en tránsito, pero el destino final efectúa el reensamblado. Exigirlo en cada router impondría estado y retardo innecesarios.

**English**

A source sends fragmented IPv4 traffic through two transit routers. Which node normally reassembles the original IP datagram for delivery to the upper layer?

- **A.** The final IP destination
- **B.** The first Ethernet switch only
- **C.** The DNS server for the source domain
- **D.** Every transit router before forwarding

IPv4 fragmentation can occur in transit, but reassembly is performed at the final destination. Requiring reassembly at each router would impose unnecessary state and delay.

Referencia: https://www.rfc-editor.org/rfc/rfc791.txt · 2.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 3. icmpv6-blanket-filter-pmtu-breakage

ID: `ccna-original-20261026-b05-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un firewall descarta todo ICMPv6 y permite TCP. HTTPS pequeño funciona, pero fallan paquetes grandes en un camino de menor MTU. ¿Qué tipo ICMPv6 bloqueado es directamente relevante?

- **A.** Source Quench IPv4
- **B.** Una trama PAUSE Ethernet
- **C.** Una respuesta DNS MX
- **D.** Packet Too Big

**Respuesta(s) propuesta(s): D.** El descubrimiento de MTU de camino IPv6 depende de Packet Too Big. Bloquearlo puede crear un agujero negro de MTU aunque los puertos TCP estén permitidos.

**English**

A firewall drops every ICMPv6 message while allowing TCP. Small HTTPS exchanges work, but larger packets fail across a smaller-MTU path. Which blocked ICMPv6 type is directly relevant?

- **A.** IPv4 Source Quench
- **B.** An Ethernet PAUSE frame
- **C.** A DNS MX reply
- **D.** Packet Too Big

IPv6 Path MTU Discovery depends on Packet Too Big feedback. Blocking it can create a path-MTU black hole even when the TCP ports are permitted.

Referencia: https://www.rfc-editor.org/rfc/rfc8201.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 4. ipv4-limited-broadcast-forwarding

ID: `ccna-original-20261026-b05-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un host emite un paquete IPv4 a 255.255.255.255. ¿Debe un router reenviar este broadcast limitado a otra red?

- **A.** Sí, si el origen usa una dirección privada
- **B.** Solo tras convertir el destino en multicast
- **C.** No; un broadcast limitado permanece en la red local
- **D.** Sí, por toda ruta predeterminada disponible

**Respuesta(s) propuesta(s): C.** El destino de broadcast limitado se usa en la red conectada y un router no debe reenviarlo. Difiere del broadcast dirigido a una subred remota específica.

**English**

A host emits an IPv4 packet to 255.255.255.255. Should a router forward this limited broadcast to another network?

- **A.** Yes, if the source uses a private address
- **B.** Only after converting the destination into multicast
- **C.** No; a limited broadcast is confined to the local network
- **D.** Yes, through every available default route

The limited broadcast destination is for the attached network and must not be forwarded by a router. It differs from a directed broadcast for a specific remote subnet.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.3.5.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 5. tcp-syn-acknowledgment-initial-sequence

ID: `ccna-original-20261026-b05-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un cliente TCP envía SYN con secuencia 7000 y sin datos de aplicación. ¿Qué número de confirmación debe usar el SYN+ACK del servidor?

- **A.** 7002
- **B.** 7000
- **C.** 7001
- **D.** 0

**Respuesta(s) propuesta(s): C.** SYN consume una posición de secuencia incluso sin carga útil. El servidor confirma la siguiente secuencia esperada, 7001; no repite 7000 como confirmación.

**English**

A TCP client sends SYN with sequence number 7000 and no application data. What acknowledgment number should the server SYN+ACK use?

- **A.** 7002
- **B.** 7000
- **C.** 7001
- **D.** 0

SYN consumes one sequence number even without payload. The server acknowledges the next expected sequence, 7001; it does not echo 7000 as the acknowledgment.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.4 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 6. udp-ipv4-pseudoheader-checksum

ID: `ccna-original-20261026-b05-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

Al calcular un checksum UDP sobre IPv4, ¿qué elementos de la pseudocabecera IP ayudan a detectar entrega a un extremo incorrecto? Selecciona dos.

- **A.** Dirección IPv4 origen
- **B.** Dirección IPv4 destino
- **C.** Número de puerto del switch Ethernet
- **D.** Edad de la caché ARP

**Respuesta(s) propuesta(s): A, B.** La pseudocabecera UDP incluye IP origen y destino, protocolo y longitud UDP. Se usa para calcular el checksum, pero no se transmite como carga UDP adicional.

**English**

When an IPv4 UDP checksum is calculated, which items from the IP pseudo-header help detect delivery to an unintended endpoint? Select two.

- **A.** Source IPv4 address
- **B.** Destination IPv4 address
- **C.** Ethernet switch port number
- **D.** ARP cache age

The UDP pseudo-header includes IP source and destination addresses, protocol and UDP length. It is used in checksum computation but is not itself a UDP field sent as extra payload.

Referencia: https://www.rfc-editor.org/rfc/rfc768.txt · Fields · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 7. link-utilization-decimal-rate

ID: `ccna-original-20261026-b05-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

El tráfico promedia 24 Mbps en un enlace de 100 Mbps. Ignorando sobrecarga y usando el mismo intervalo de medición, ¿cuál es la utilización media?

- **A.** 240%
- **B.** 24%
- **C.** 76%
- **D.** 4.17%

**Respuesta(s) propuesta(s): B.** La utilización es tráfico medido dividido por capacidad: 24/100 × 100% = 24%. No es la capacidad libre ni garantiza el comportamiento de ráfagas cortas.

**English**

Traffic averages 24 Mbps on a 100 Mbps link. Ignoring overhead and using the same measurement interval, what is average utilization?

- **A.** 240%
- **B.** 24%
- **C.** 76%
- **D.** 4.17%

Utilization is measured traffic divided by link capacity: 24/100 × 100% = 24%. It is not the unused capacity or a guarantee about short bursts.

Referencia: https://www.rfc-editor.org/rfc/rfc5136.txt · 2.3.5 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 8. ipv6-extension-header-next-header-chain

ID: `ccna-original-20261026-b05-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un paquete IPv6 tiene una cabecera Hop-by-Hop Options seguida de TCP. ¿Qué campo de esa extensión identifica el tipo de cabecera que sigue inmediatamente?

- **A.** Puerto origen TCP
- **B.** Next Header
- **C.** Flow Label
- **D.** Hop Limit

**Respuesta(s) propuesta(s): B.** Next Header de la extensión identifica la cabecera siguiente. Hop Limit y Flow Label cumplen otras funciones en la cabecera base; un puerto TCP no selecciona extensiones.

**English**

An IPv6 packet has a Hop-by-Hop Options header followed by TCP. Which field in that extension header identifies the type of header that immediately follows it?

- **A.** TCP source port
- **B.** Next Header
- **C.** Flow Label
- **D.** Hop Limit

The extension header Next Header field identifies the immediately following header. Hop Limit and Flow Label have different functions in the base IPv6 header; a TCP port is not an extension-header selector.

Referencia: https://www.rfc-editor.org/rfc/rfc8200.txt · 4.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 9. tcp-full-duplex-independent-sequence-spaces

ID: `ccna-original-20261026-b05-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una conexión TCP transporta datos en ambos sentidos simultáneamente. ¿Qué afirmación sobre la numeración de secuencia es correcta?

- **A.** Cada sentido tiene su propio espacio de secuencias
- **B.** Ambos sentidos deben compartir un contador idéntico
- **C.** La MAC establece el único número de secuencia
- **D.** Solo el cliente puede enviar datos confirmados

**Respuesta(s) propuesta(s): A.** TCP es un flujo de bytes dúplex completo con estado de secuencia independiente en cada sentido. Un ACK describe el progreso del sentido opuesto, no un contador compartido.

**English**

A TCP connection carries data in both directions at once. Which statement about sequence numbering is correct?

- **A.** Each direction has its own sequence-number space
- **B.** Both directions must share one identical sequence counter
- **C.** The MAC address sets the only sequence number
- **D.** Only the client can send acknowledged data

TCP is a full-duplex byte stream with independently maintained sequence state in each direction. An ACK describes progress in the opposite direction, not a single shared counter.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 10. ipv6-source-address-unspecified-prohibition

ID: `ccna-original-20261026-b05-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un router recibe un paquete IPv6 con origen :: destinado a un host unicast remoto fuera del enlace local. ¿Qué restricción de reenvío se aplica?

- **A.** El origen es una dirección de host global normal
- **B.** Un router IPv6 nunca debe reenviar un paquete con origen no especificado
- **C.** Debe sustituir :: por la IP del servidor DNS
- **D.** Debe reenviarlo por todos los routers predeterminados

**Respuesta(s) propuesta(s): B.** :: es la dirección no especificada y no identifica un origen global normal. Los routers IPv6 no deben reenviar paquetes cuyo origen sea no especificado.

**English**

A router receives an IPv6 packet with source :: destined to a remote unicast host beyond its local link. What forwarding constraint applies?

- **A.** The source is a normal globally routable host address
- **B.** A packet with an unspecified source must never be forwarded by an IPv6 router
- **C.** It must replace :: with the DNS server address
- **D.** It must be forwarded through every default router

:: is the unspecified address and cannot identify an ordinary globally routed source. IPv6 routers must not forward packets whose source is unspecified.

Referencia: https://www.rfc-editor.org/rfc/rfc4291.txt · 2.5.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 11. capwap-discovery-before-join

ID: `ccna-original-20261026-b05-011` · Área: `network_access` · Dificultad: `intermediate`

Un punto de acceso CAPWAP arranca sin sesión establecida con un controlador. ¿Qué orden es coherente con la máquina de estados?

- **A.** Hacer commit NETCONF antes de todo descubrimiento CAPWAP
- **B.** Descubrir un controlador, establecer la seguridad de control requerida y luego unirse
- **C.** Usar la elección DR OSPF como unión CAPWAP
- **D.** Enviar tráfico normal de clientes antes de descubrir controlador en todo despliegue

**Respuesta(s) propuesta(s): B.** CAPWAP separa descubrimiento, establecimiento del canal de control y unión. No es una elección OSPF ni una transacción NETCONF; las políticas de reenvío del despliegue son otro asunto.

**English**

A CAPWAP access point is starting without an established controller session. Which ordering is consistent with the protocol state machine?

- **A.** Commit NETCONF configuration before any CAPWAP discovery
- **B.** Discover a controller, establish the required control security, then join
- **C.** Use OSPF DR election as the CAPWAP join procedure
- **D.** Send normal client traffic before discovering any controller in every deployment

CAPWAP separates discovery, control-channel establishment and joining. It is not an OSPF election or a NETCONF transaction; deployment forwarding policies are separate.

Referencia: https://www.rfc-editor.org/rfc/rfc5415.txt · 2.3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 12. capwap-local-versus-split-mac-binding

ID: `ccna-original-20261026-b05-012` · Área: `network_access` · Dificultad: `intermediate`

Un documento de WLAN distingue funcionamiento Local MAC y Split MAC. ¿Cuál es la diferencia arquitectónica principal?

- **A.** Si todas las tramas Ethernet deben ser broadcast
- **B.** Si las direcciones IPv6 tienen 64 o 128 bits totales
- **C.** Si DNS usa solo el puerto 22
- **D.** Cómo se distribuyen las funciones MAC IEEE 802.11 entre el punto de acceso y el controlador

**Respuesta(s) propuesta(s): D.** El binding IEEE 802.11 de CAPWAP describe divisiones Local y Split MAC de funciones inalámbricas entre WTP y controlador. No modifica la longitud de direcciones IP.

**English**

A wireless design document distinguishes Local MAC from Split MAC operation. What is the main architectural distinction?

- **A.** Whether all Ethernet frames must be broadcasts
- **B.** Whether IPv6 addresses contain 64 or 128 total bits
- **C.** Whether DNS uses only port 22
- **D.** How IEEE 802.11 MAC functions are distributed between the access point and controller

The CAPWAP IEEE 802.11 binding describes Local and Split MAC divisions of wireless MAC functionality between WTP and access controller. This is not a change to IP address length.

Referencia: https://www.rfc-editor.org/rfc/rfc5416.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 13. radius-dynamic-vlan-assignment-attributes

ID: `ccna-original-20261026-b05-013` · Área: `network_access` · Dificultad: `intermediate`

Un despliegue 802.1X usa atributos de túnel RADIUS para asignar una VLAN tras autenticar. ¿Qué tres atributos forman el conjunto descrito para ese propósito? Selecciona tres.

- **A.** Tunnel-Type = VLAN
- **B.** Tunnel-Medium-Type = IEEE-802
- **C.** Tunnel-Private-Group-ID = VLAN ID
- **D.** TCP-Window-Scale = VLAN ID

**Respuesta(s) propuesta(s): A, B, C.** Las guías RADIUS describen la asignación mediante Tunnel-Type, Tunnel-Medium-Type y Tunnel-Private-Group-ID. El ID VLAN se codifica como cadena en el atributo de grupo privado.

**English**

An 802.1X deployment uses RADIUS tunnel attributes to assign a VLAN after authentication. Which three attributes form the VLAN-assignment set described for this purpose? Select three.

- **A.** Tunnel-Type = VLAN
- **B.** Tunnel-Medium-Type = IEEE-802
- **C.** Tunnel-Private-Group-ID = VLAN ID
- **D.** TCP-Window-Scale = VLAN ID

The RADIUS usage guidelines describe VLAN assignment through Tunnel-Type, Tunnel-Medium-Type and Tunnel-Private-Group-ID. The VLAN ID is encoded as a string in the private group ID attribute.

Referencia: https://www.rfc-editor.org/rfc/rfc3580.txt · 3.31 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. capwap-control-channel-dtls-protection

ID: `ccna-original-20261026-b05-014` · Área: `network_access` · Dificultad: `intermediate`

Un diseño CAPWAP necesita proteger el canal de control establecido entre controlador y punto de acceso. ¿Qué protocolo proporciona la seguridad de control especificada?

- **A.** Una prioridad raíz spanning tree
- **B.** TFTP sin autenticación
- **C.** ARP sin protección
- **D.** DTLS

**Respuesta(s) propuesta(s): D.** CAPWAP usa DTLS para proteger el canal de control. Descubrimiento y canal de datos tienen reglas propias; proteger el control no implica que CAPWAP cifre siempre todos los datos de clientes.

**English**

A CAPWAP design needs to protect its established controller-to-access-point control channel. Which protocol provides the specified control-channel security?

- **A.** A spanning-tree root priority
- **B.** TFTP without authentication
- **C.** Plain ARP
- **D.** DTLS

CAPWAP uses DTLS to secure its control channel. Discovery and data-channel policies have their own rules; saying control uses DTLS does not imply all client data is always encrypted by CAPWAP.

Referencia: https://www.rfc-editor.org/rfc/rfc5415.txt · 2.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 15. capwap-discovery-not-client-dhcp

ID: `ccna-original-20261026-b05-015` · Área: `network_access` · Dificultad: `intermediate`

Un punto de acceso envía CAPWAP Discovery Request mientras un cliente inalámbrico obtiene por separado una concesión DHCPv4. ¿Qué distingue las dos actividades?

- **A.** Ambos mensajes son el mismo tipo DHCP
- **B.** CAPWAP Discovery asigna todo puerto TCP de clientes
- **C.** CAPWAP descubre un controlador; DHCP asigna información de direccionamiento al host
- **D.** DHCP elige el controlador CAPWAP activo por costo OSPF

**Respuesta(s) propuesta(s): C.** CAPWAP Discovery Request participa en descubrir el controlador del WTP. Obtener dirección DHCP es un servicio distinto; completar uno no demuestra por sí solo que el otro funcionó.

**English**

An access point sends a CAPWAP Discovery Request while a wireless client separately obtains an IPv4 DHCP lease. Which statement distinguishes the two activities?

- **A.** Both messages are the same DHCP message type
- **B.** CAPWAP Discovery allocates every client TCP port
- **C.** CAPWAP discovers an access controller; DHCP allocates host addressing information
- **D.** DHCP elects the CAPWAP active controller by OSPF cost

A CAPWAP Discovery Request is part of WTP access-controller discovery. DHCP address acquisition is a distinct service; completing one does not by itself prove the other succeeded.

Referencia: https://www.rfc-editor.org/rfc/rfc5415.txt · 5.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 16. catalyst-no-switchport-routed-interface

ID: `ccna-original-20261026-b05-016` · Área: `network_access` · Dificultad: `intermediate`

En un puerto enrutado compatible de Catalyst, ¿qué efecto tiene no switchport antes de asignar una IP?

- **A.** Crea un troncal con todas las VLAN
- **B.** Deshabilita IP routing en todo el equipo
- **C.** Coloca la interfaz física en modo capa 3 en lugar del switching normal de capa 2
- **D.** Elimina permanentemente el hardware de la interfaz

**Respuesta(s) propuesta(s): C.** Un puerto físico enrutado se configura con no switchport. Actúa como interfaz de capa 3 en vez de acceso o troncal, según las capacidades de la plataforma.

**English**

On a supported Catalyst routed port, what is the effect of no switchport before assigning an IP address?

- **A.** It creates a trunk carrying every VLAN
- **B.** It turns off IP routing on the whole device
- **C.** It places the physical interface in Layer 3 mode instead of ordinary Layer 2 switching mode
- **D.** It permanently removes the interface hardware

A routed physical port is configured with no switchport. The port then acts as a Layer 3 interface rather than an access or trunk switchport, subject to platform capabilities.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_interface_characteristics.html · Routed Ports · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 17. etherchannel-stp-logical-port

ID: `ccna-original-20261026-b05-017` · Área: `network_access` · Dificultad: `intermediate`

Un EtherChannel correctamente formado tiene cuatro miembros físicos. ¿Cómo trata normalmente spanning tree al conjunto para decidir la topología?

- **A.** Como un área OSPF con cuatro router ID
- **B.** Como cuatro bucles independientes que siempre requieren bloquear tres miembros
- **C.** Como un puerto lógico de spanning tree
- **D.** Como una zona DNS

**Respuesta(s) propuesta(s): C.** Spanning tree trata un EtherChannel formado como un enlace lógico. Difiere de enlaces paralelos separados que no han formado correctamente un canal.

**English**

A correctly formed EtherChannel has four physical members. How does spanning tree normally treat the bundle for topology decisions?

- **A.** As an OSPF area with four router IDs
- **B.** As four unrelated loops that always require blocking three members
- **C.** As one logical spanning-tree port
- **D.** As a DNS zone

A formed EtherChannel is treated as a single logical link by spanning tree. This differs from separate parallel links that have not successfully formed a bundle.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · EtherChannel and Spanning Tree · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. root-guard-versus-loop-guard-trigger

ID: `ccna-original-20261026-b05-018` · Área: `network_access` · Dificultad: `intermediate`

¿Qué dos descripciones distinguen correctamente Root Guard y Loop Guard? Selecciona dos.

- **A.** Root Guard solo se activa al vencer una concesión DHCP
- **B.** Loop Guard elige un resolver DNS
- **C.** Loop Guard evita que ciertos puertos no designados reenvíen al desaparecer BPDU esperadas
- **D.** Root Guard reacciona a BPDU superiores en un puerto protegido

**Respuesta(s) propuesta(s): C, D.** Root Guard protege la ubicación de la raíz ante BPDU superiores. Loop Guard aborda la pérdida de BPDU esperadas en puertos que podrían pasar a reenvío al envejecer información.

**English**

Which two descriptions correctly distinguish Root Guard and Loop Guard? Select two.

- **A.** Root Guard is triggered only by an expired DHCP lease
- **B.** Loop Guard chooses a DNS resolver
- **C.** Loop Guard prevents certain non-designated ports from forwarding when expected BPDUs disappear
- **D.** Root Guard reacts to superior BPDUs on a protected port

Root Guard protects root placement by responding to superior BPDUs. Loop Guard addresses loss of expected BPDU reception on ports that would otherwise risk becoming forwarding through aging.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_optional_spanning_tree_features.html · Root Guard and Loop Guard · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 19. static-mac-entry-no-aging

ID: `ccna-original-20261026-b05-019` · Área: `network_access` · Dificultad: `intermediate`

Una entrada MAC unicast estática configurada manualmente no recibe tráfico por más tiempo que el temporizador dinámico. ¿Qué debe pasar según el comportamiento normal de Catalyst?

- **A.** Debe volverse un broadcast ARP cada segundo
- **B.** Debe caducar exactamente como toda entrada dinámica
- **C.** La entrada estática no caduca solo porque venció el temporizador dinámico
- **D.** Debe convertirse automáticamente en concesión DHCP

**Respuesta(s) propuesta(s): C.** Las entradas MAC estáticas no envejecen como las dinámicas. Una asociación estática obsoleta puede requerir corrección administrativa en vez de esperar el temporizador dinámico.

**English**

A valid manually configured static unicast MAC entry has received no traffic for longer than the dynamic MAC aging timer. What should happen under ordinary Catalyst behavior?

- **A.** It must become an ARP broadcast every second
- **B.** It must age exactly like every dynamic entry
- **C.** The static entry does not age out merely because the dynamic timer elapsed
- **D.** It must automatically change into a DHCP lease

Static MAC entries do not age like dynamically learned addresses. Keeping a stale static mapping can therefore require administrative correction rather than waiting for the dynamic timer.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Address Tables · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. vlan-scoped-identical-mac-entries

ID: `ccna-original-20261026-b05-020` · Área: `network_access` · Dificultad: `intermediate`

Un switch aprende la misma MAC origen en Gi1/0/1 de VLAN 10 y Gi1/0/2 de VLAN 20. ¿Por qué no es automáticamente un evento de MAC flapping en una VLAN?

- **A.** Los ID VLAN nunca se usan en switching
- **B.** Una MAC siempre es globalmente única incluso en redes virtualizadas
- **C.** Ambos puertos necesariamente son el mismo puerto físico
- **D.** Las entradas de reenvío MAC incluyen la VLAN, por lo que pueden ser asociaciones distintas

**Respuesta(s) propuesta(s): D.** Cada VLAN mantiene su propia tabla MAC lógica. La misma dirección en dos VLAN no equivale a movimientos rápidos entre puertos dentro de una sola VLAN.

**English**

A switch learns the same source MAC on Gi1/0/1 in VLAN 10 and Gi1/0/2 in VLAN 20. Why is this not automatically a same-VLAN MAC-flapping event?

- **A.** VLAN IDs are never used in switching
- **B.** A MAC address is always globally unique even in virtualized networks
- **C.** Both ports must physically be the same port
- **D.** MAC forwarding entries include VLAN context, so these can be distinct associations

Each VLAN maintains its own logical MAC table. The same address in two VLAN contexts is not the same observation as rapid movement between ports inside a single VLAN.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · MAC Addresses and VLANs · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 21. ios-local-host-route-delivery

ID: `ccna-original-20261026-b05-021` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una interfaz de router usa 192.0.2.9/24. IOS muestra una ruta conectada 192.0.2.0/24 y una local 192.0.2.9/32. ¿Qué identifica la /32 local?

- **A.** Solo el router ID de un vecino OSPF remoto
- **B.** Un destino broadcast para todos los routers
- **C.** La dirección propia de interfaz del router para entrega local
- **D.** Una LAN adicional con 254 hosts utilizables

**Respuesta(s) propuesta(s): C.** La ruta local de host identifica tráfico para el propio router; la ruta conectada representa la red adjunta. La /32 no crea otra LAN /24.

**English**

A router interface is configured as 192.0.2.9/24. IOS displays a connected 192.0.2.0/24 route and a local 192.0.2.9/32 route. What does the local /32 identify?

- **A.** A remote OSPF neighbor router ID only
- **B.** A broadcast destination for all routers
- **C.** The router own interface address for local delivery
- **D.** An additional LAN with 254 usable hosts

The local host route identifies traffic destined to the router itself, while the connected subnet route represents the attached network. The /32 does not create another /24 LAN.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/ip-routing/116264-technote-ios-00.html · Local Host Routes · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 22. ospf-process-id-local-significance

ID: `ccna-original-20261026-b05-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

R1 ejecuta router ospf 10 y R2 router ospf 20 en su subred compartida. Área, autenticación, temporizadores, tipo de red y demás parámetros relevantes son compatibles. ¿El distinto ID de proceso impide por sí solo la adyacencia?

- **A.** Sí; debe igualar al ID VLAN en toda la red
- **B.** Sí; los ID de proceso son las IP del router remoto
- **C.** Solo si ambos usan Ethernet
- **D.** No; el ID de proceso OSPF de IOS tiene significado local

**Respuesta(s) propuesta(s): D.** El ID de proceso OSPF de IOS identifica el proceso local. No debe coincidir con el ID del vecino; los campos y ajustes del protocolo en el enlace determinan la compatibilidad.

**English**

R1 runs router ospf 10 and R2 runs router ospf 20 on their shared subnet. Area, authentication, timers, network type and other relevant settings are compatible. Does the different process ID alone prevent adjacency?

- **A.** Yes; the process ID must equal the VLAN ID everywhere
- **B.** Yes; process IDs are the remote router IP addresses
- **C.** Only if both routers use Ethernet
- **D.** No; the IOS OSPF process ID has local significance

An IOS OSPF process ID identifies the local routing process. It need not match a neighbor process ID; the on-link OSPF protocol fields and settings determine adjacency compatibility.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/9237-9.html · Same OSPF process number on multiple routers · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 23. ospf-init-local-router-id-not-seen

ID: `ccna-original-20261026-b05-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

R1 recibe Hello OSPF válidos de R2, pero no encuentra su propio router ID en la lista de vecinos de R2. ¿Qué estado en R1 concuerda con esto?

- **A.** Down porque nunca llegó un Hello
- **B.** Full
- **C.** Init
- **D.** Loading porque terminó la sincronización

**Respuesta(s) propuesta(s): C.** Init significa que llegó un Hello, pero no se estableció comunicación bidireccional. Encontrar el router ID local en la lista recibida fundamenta la recepción 2-Way.

**English**

R1 receives valid OSPF Hello packets from R2, but R1 does not find its own router ID in R2 neighbor list. Which state on R1 is consistent with this observation?

- **A.** Down because no Hello has ever arrived
- **B.** Full
- **C.** Init
- **D.** Loading because database synchronization is complete

Init means a Hello has been received but bidirectional communication has not been established. Seeing the local router ID in the received neighbor list is the basis for 2-Way reception.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 24. ospf-full-not-end-to-end-application-proof

ID: `ccna-original-20261026-b05-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos vecinos OSPF alcanzan Full. ¿Qué establece ese estado sin demostrar acceso de aplicación extremo a extremo?

- **A.** Todas las ACL permiten toda aplicación de todo host
- **B.** Son plenamente adyacentes y completaron la sincronización de base requerida
- **C.** El DNS remoto necesariamente es correcto
- **D.** Se eliminó toda ruta asimétrica

**Respuesta(s) propuesta(s): B.** Full indica una adyacencia OSPF formada tras sincronizar la base. El éxito de aplicaciones también depende de rutas, retorno, filtros y extremos.

**English**

Two OSPF neighbors reach Full. What has this state established, without proving end-to-end application access?

- **A.** Every possible ACL permits every host application
- **B.** They are fully adjacent and have completed the required database synchronization
- **C.** The remote DNS server is guaranteed correct
- **D.** All asymmetric routes have been eliminated

Full denotes a fully formed OSPF adjacency following database synchronization. Application success also depends on route selection, return paths, filtering and endpoint behavior.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 25. ospf-dead-timer-remaining

ID: `ccna-original-20261026-b05-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un vecino OSPF usa RouterDeadInterval de 40 segundos. Su último Hello válido llegó hace 27 segundos. Ignorando granularidad y sin otro Hello, ¿cuánto falta para vencer el temporizador de inactividad?

- **A.** 40 segundos
- **B.** 27 segundos
- **C.** 13 segundos
- **D.** 67 segundos

**Respuesta(s) propuesta(s): C.** Quedan 40−27=13 segundos. Cada Hello válido reinicia el temporizador; se supone que no llega otro Hello y se ignora el retardo de planificación.

**English**

An OSPF neighbor uses a 40-second RouterDeadInterval. Its last valid Hello arrived 27 seconds ago. Ignoring scheduling granularity and assuming no new Hello, how much time remains before the inactivity timer expires?

- **A.** 40 seconds
- **B.** 27 seconds
- **C.** 13 seconds
- **D.** 67 seconds

The remaining interval is 40−27=13 seconds. Each valid Hello resets the inactivity timer; this calculation assumes no further Hello and no implementation scheduling delay.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 26. ospf-default-originate-route-prerequisite

ID: `ccna-original-20261026-b05-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

En Cisco IOS se configura default-information originate sin always. ¿Qué condición permite normalmente originar la predeterminada en OSPF? No hay route-map configurado.

- **A.** La búsqueda DNS del router está deshabilitada
- **B.** Hay una ruta predeterminada en la tabla del router que origina
- **C.** Todos los puertos de acceso están en VLAN 1
- **D.** El ID de proceso OSPF es 0

**Respuesta(s) propuesta(s): B.** Sin always, el comando normal de IOS origina una predeterminada cuando el router dispone de ella. always modifica deliberadamente ese requisito y exige cuidado.

**English**

On Cisco IOS, default-information originate is configured without always. Which condition normally permits originating the default into OSPF? No route map is configured.

- **A.** The router DNS lookup is disabled
- **B.** A default route is present in the originating router routing table
- **C.** Every access port is in VLAN 1
- **D.** The OSPF process ID equals 0

Without always, the ordinary IOS command originates a default when the router has a default route. The always keyword deliberately changes that prerequisite and should be considered carefully.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/9237-9.html · OSPF default route generation · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 27. ospf-dr-election-nonpreemptive

ID: `ccna-original-20261026-b05-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

En un segmento broadcast OSPF establecido, entra un router elegible con mayor prioridad que el DR actual sano. ¿Lo reemplaza inmediatamente solo por tener mayor prioridad?

- **A.** Sí; cada Hello obliga al de prioridad mayor a asumir
- **B.** Sí; las secuencias TCP deciden el DR
- **C.** No; la elección DR no desplaza preventivamente al DR existente sano
- **D.** No; porque OSPF nunca usa prioridad

**Respuesta(s) propuesta(s): C.** OSPF conserva al DR ya elegido cuando se incorpora otro router. La prioridad importa durante la elección, pero un recién llegado de mayor prioridad no desplaza por sí solo al DR operativo.

**English**

On an established OSPF broadcast segment, a new eligible router joins with a higher priority than the healthy current DR. Does it immediately replace that DR solely because its priority is higher?

- **A.** Yes; every Hello forces the highest priority router to take over
- **B.** Yes; TCP sequence numbers decide the new DR
- **C.** No; DR election is nonpreemptive for the existing healthy DR
- **D.** No; because OSPF never uses router priority

OSPF preserves the existing elected DR when a new router joins. Priority matters during election, but a higher-priority newcomer does not by itself preempt a functioning DR.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 9.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 28. ipv6-neighbor-stale-first-packet

ID: `ccna-original-20261026-b05-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una entrada de vecinos IPv6 está STALE y tiene dirección de enlace conocida. ¿Qué sucede al enviar el siguiente paquete según Neighbor Unreachability Detection?

- **A.** El paquete siempre debe descartarse de inmediato
- **B.** El host debe reiniciar DHCPv4 primero
- **C.** STALE significa una asociación estática permanente
- **D.** El paquete puede usar la dirección en caché y la entrada pasa a DELAY mientras se busca confirmar alcanzabilidad

**Respuesta(s) propuesta(s): D.** STALE no significa que se desconozca la dirección de enlace. Enviar tráfico lleva la entrada a DELAY y permite confirmación superior antes de sondeos activos.

**English**

An IPv6 neighbor-cache entry is STALE and has a known link-layer address. What happens when the node next sends a packet to that neighbor according to Neighbor Unreachability Detection?

- **A.** The packet must always be discarded immediately
- **B.** The host must restart DHCPv4 first
- **C.** STALE means the address is a permanent static mapping
- **D.** The packet can use the cached address and the entry moves to DELAY while reachability confirmation is sought

STALE does not mean the link-layer address is unknown. Sending traffic transitions the entry to DELAY, allowing upper-layer confirmation before active probing.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 7.3.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 29. ipv6-neighbor-discovery-next-hop-not-remote-host

ID: `ccna-original-20261026-b05-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host IPv6 tiene ruta a un prefijo remoto mediante un router de enlace local en Ethernet. ¿Qué dirección resuelve con Neighbor Discovery para el destino Ethernet del primer salto?

- **A.** La dirección del router de siguiente salto en el enlace
- **B.** Una dirección broadcast IPv4
- **C.** El número de serie del controlador
- **D.** La dirección del host remoto de otro enlace

**Respuesta(s) propuesta(s): A.** Neighbor Discovery resuelve direcciones de enlace para vecinos locales. El destino remoto se alcanza por el siguiente salto local seleccionado; el destino IP puede seguir siendo el host remoto.

**English**

An IPv6 host has a route to a remote prefix through a link-local router on Ethernet. Which address does it resolve with Neighbor Discovery for the first-hop Ethernet destination?

- **A.** The on-link next-hop router address
- **B.** An IPv4 broadcast address
- **C.** The controller serial number
- **D.** The remote host address on a different link

Neighbor Discovery resolves link-layer addresses for on-link neighbors. A remote destination is reached through the selected on-link next hop; the IP destination can remain the remote host.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 5.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 30. ipv4-prefix-before-distance-forwarding

ID: `ccna-original-20261026-b05-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos rutas instaladas coinciden con 10.9.1.7: estática 10.0.0.0/8 con distancia 1 y OSPF 10.9.1.0/24 con distancia 110. ¿Qué prefijo gana en el reenvío normal por destino?

- **A.** 10.0.0.0/8
- **B.** 0.0.0.0/0
- **C.** 10.9.0.0/16
- **D.** 10.9.1.0/24

**Respuesta(s) propuesta(s): D.** La coincidencia de prefijo más largo compara prefijos destino instalados. La /24 gana a /8 aunque su fuente tenga distancia mayor; la distancia no anula la especificidad.

**English**

Both installed routes match 10.9.1.7: a static 10.0.0.0/8 with distance 1 and an OSPF 10.9.1.0/24 with distance 110. Which prefix wins ordinary destination forwarding?

- **A.** 10.0.0.0/8
- **B.** 0.0.0.0/0
- **C.** 10.9.0.0/16
- **D.** 10.9.1.0/24

Longest-prefix match compares installed destination prefixes. The /24 wins over /8 even though its route source has a higher administrative distance; distance is not a way to override specificity.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.4.3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 31. ospf-link-state-spf-role

ID: `ccna-original-20261026-b05-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

Tras sincronizar información de estado de enlace, ¿qué cálculo permite a OSPF obtener caminos de menor costo dentro de un área?

- **A.** Una consulta DNS recursiva por paquete
- **B.** Un handshake TCP con cada host destino
- **C.** Un cálculo de árbol de caminos mínimos con raíz en el router que calcula
- **D.** Seleccionar solo la IP destino numéricamente menor

**Respuesta(s) propuesta(s): C.** OSPF usa su base de estado de enlace para construir un árbol de caminos mínimos desde el router que calcula. DNS y los handshakes TCP no calculan caminos OSPF.

**English**

After link-state information is synchronized, which computation allows an OSPF router to derive least-cost paths within an area?

- **A.** A DNS recursive query for every packet
- **B.** A TCP handshake with every destination host
- **C.** A shortest-path tree calculation rooted at the calculating router
- **D.** Selecting only the numerically lowest destination IP

OSPF uses its link-state database to build a shortest-path tree rooted at the calculating router. DNS and TCP handshakes do not compute OSPF topology paths.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 32. asymmetric-routing-return-path-independence

ID: `ccna-original-20261026-b05-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un paquete llega a un servidor remoto por el router A. ¿Debe la respuesta usar exactamente los mismos routers en orden inverso?

- **A.** No; cada sentido se reenvía según sus propias decisiones de routing y políticas
- **B.** Sí; IPv4 registra y exige por defecto el camino inverso completo
- **C.** Sí; TCP exige enlaces físicos idénticos en ambos sentidos
- **D.** No; las respuestas nunca necesitan ruta

**Respuesta(s) propuesta(s): A.** El reenvío IP normal se basa en destino en cada salto. Alcanzar el destino no prueba un retorno utilizable; los equipos con estado pueden hacer relevante la asimetría.

**English**

A packet reaches a remote server through router A. Must the reply use exactly the same routers in reverse order?

- **A.** No; each direction is forwarded according to its own routing and policy decisions
- **B.** Yes; IPv4 records and enforces the complete reverse path by default
- **C.** Yes; TCP requires identical physical links in both directions
- **D.** No; replies never need any route

Ordinary IP forwarding is destination-based at each hop. Forward reachability does not prove a usable return path, and stateful devices can make asymmetric paths operationally important.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 33. dhcp-router-versus-dns-options

ID: `ccna-original-20261026-b05-033` · Área: `ip_services` · Dificultad: `intermediate`

Una concesión DHCPv4 entrega las opciones 3 y 6. ¿Qué pareja interpreta correctamente sus significados normales?

- **A.** Ambas contienen solo puertos TCP
- **B.** Opción 3: routers; opción 6: servidores DNS
- **C.** Opción 3: DNS; opción 6: router ID OSPF
- **D.** Opción 3: PSK Wi-Fi; opción 6: modo troncal VLAN

**Respuesta(s) propuesta(s): B.** La opción 3 enumera routers de la subred del cliente y la 6 enumera servidores DNS. Recibir ajustes DNS no sustituye un gateway válido.

**English**

A DHCPv4 lease supplies option 3 and option 6. Which pairing correctly interprets their ordinary meanings?

- **A.** Both options contain only TCP ports
- **B.** Option 3: routers; option 6: DNS servers
- **C.** Option 3: DNS; option 6: OSPF router IDs
- **D.** Option 3: Wi-Fi PSK; option 6: VLAN trunk mode

DHCP option 3 lists routers on the client subnet, and option 6 lists DNS servers. Receiving DNS settings does not substitute for a valid default-router setting.

Referencia: https://www.rfc-editor.org/rfc/rfc2132.txt · 3.5 and 3.8 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 34. dhcp-renewing-unicast-server

ID: `ccna-original-20261026-b05-034` · Área: `ip_services` · Dificultad: `intermediate`

Un cliente DHCPv4 entra en RENEWING en T1 y el servidor original responde. ¿Cómo se direcciona normalmente DHCPREQUEST?

- **A.** Solo a los servidores raíz DNS
- **B.** Multicast a todos los routers OSPF
- **C.** Broadcast a todos los servidores como en REBINDING
- **D.** Unicast al servidor que concedió la concesión

**Respuesta(s) propuesta(s): D.** En RENEWING el cliente normalmente usa unicast al servidor de la concesión. Si falla y llega T2, REBINDING usa broadcast para contactar un servidor adecuado.

**English**

A DHCPv4 client enters RENEWING at T1 while its original server is reachable. How is the DHCPREQUEST normally addressed?

- **A.** Only to the DNS root servers
- **B.** Multicast to all OSPF routers
- **C.** Broadcast to all servers as in REBINDING
- **D.** Unicast to the server that granted the lease

In RENEWING the client normally unicasts to its leasing server. If renewal fails and T2 is reached, REBINDING uses broadcast to contact any suitable server.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.4.5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 35. syslog-severity-threshold-selection

ID: `ccna-original-20261026-b05-035` · Área: `ip_services` · Dificultad: `intermediate`

Una política del colector acepta severidades syslog numéricamente no mayores que 4. ¿Qué dos severidades cumplen esa regla? Selecciona dos.

- **A.** 7 — Depuración
- **B.** 4 — Advertencia
- **C.** 5 — Aviso
- **D.** 2 — Crítico

**Respuesta(s) propuesta(s): B, D.** Las severidades syslog van de 0, la más grave, a 7, depuración. Con la regla ≤4 pasan 2 y 4; 5 y 7 no.

**English**

A collector policy accepts syslog severities numerically no greater than 4. Which two message severities satisfy that rule? Select two.

- **A.** 7 — Debug
- **B.** 4 — Warning
- **C.** 5 — Notice
- **D.** 2 — Critical

Syslog severity numbers run from 0, most severe, through 7, debug. Under the stated ≤4 rule, 2 and 4 pass while 5 and 7 do not.

Referencia: https://www.rfc-editor.org/rfc/rfc5424.txt · 6.2.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 36. snmp-inform-versus-trap-response

ID: `ccna-original-20261026-b05-036` · Área: `ip_services` · Dificultad: `intermediate`

¿Qué afirmación distingue InformRequest de una notificación SNMPv2-Trap?

- **A.** InformRequest espera respuesta; SNMPv2-Trap no
- **B.** Ambos son mensajes de inicio de conexión TCP
- **C.** Un Trap siempre tiene cifrado más fuerte que un Inform
- **D.** Un Inform cambia prioridades de vecinos OSPF

**Respuesta(s) propuesta(s): A.** Los informs son notificaciones confirmadas mediante respuesta; los traps no se confirman. Autenticación y privacidad dependen de la configuración de seguridad.

**English**

Which statement distinguishes an SNMP InformRequest from an SNMPv2-Trap notification?

- **A.** An InformRequest expects a response; an SNMPv2-Trap does not
- **B.** Both are TCP connection setup messages
- **C.** A Trap always has stronger encryption than an Inform
- **D.** An Inform changes OSPF neighbor priorities

SNMP informs are confirmed notifications with a response, whereas traps are unconfirmed. Whether either uses authentication or privacy depends on its security configuration.

Referencia: https://www.rfc-editor.org/rfc/rfc3416.txt · 4.2.6 and 4.2.7 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 37. ntp-stratum-unsynchronized-value

ID: `ccna-original-20261026-b05-037` · Área: `ip_services` · Dificultad: `intermediate`

Un servidor NTP anuncia stratum 16. ¿Qué indica ese valor para seleccionar sincronización NTP normal?

- **A.** El desfase es exactamente 16 milisegundos
- **B.** El servidor no está sincronizado y no es una fuente horaria normal utilizable
- **C.** El servidor usa puerto TCP 16
- **D.** Es más preciso que cualquier servidor stratum 1

**Respuesta(s) propuesta(s): B.** NTP reserva stratum 16 para el estado no sincronizado. Stratum no mide directamente desfase, latencia ni precisión garantizada.

**English**

An NTP server advertises stratum 16. What does this value indicate for normal NTP synchronization selection?

- **A.** The clock offset is exactly 16 milliseconds
- **B.** The server is unsynchronized and is not a normal usable time source
- **C.** The server uses TCP port 16
- **D.** It is more accurate than every stratum 1 server

NTP reserves stratum 16 for an unsynchronized condition. Stratum is not a direct measurement of offset, latency or guaranteed clock accuracy.

Referencia: https://www.rfc-editor.org/rfc/rfc5905.txt · 7.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 38. standard-ipv4-acl-predicate-limits

ID: `ccna-original-20261026-b05-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL IPv4 numerada estándar debe distinguir paquetes con la misma IP origen y distinto puerto TCP destino. ¿Puede ese tipo de ACL por sí solo expresar la diferencia?

- **A.** Sí; las ACL estándar siempre inspeccionan puertos TCP destino
- **B.** No; hace falta ACL extendida u otro mecanismo adecuado para comparar puertos destino
- **C.** No; IPv4 no puede transportar TCP
- **D.** Sí; los bits wildcard de origen codifican puertos TCP

**Respuesta(s) propuesta(s): B.** Las ACL IPv4 estándar filtran por origen. Las extendidas pueden incluir protocolo, destino y puertos; usar wildcard de origen no añade inspección de puertos.

**English**

A standard numbered IPv4 ACL must distinguish two packets that have the same source IP but different TCP destination ports. Can that ACL type alone express the distinction?

- **A.** Yes; standard ACLs always inspect TCP destination ports
- **B.** No; an extended ACL or another suitable mechanism is needed to match destination ports
- **C.** No; IPv4 has no TCP port concept anywhere
- **D.** Yes; source wildcard bits encode TCP ports

Standard IPv4 ACLs filter by source address. Extended ACLs can include protocol, destination and transport ports; wildcard source matching does not add port inspection.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Standard ACLs · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 39. ingress-egress-acl-observation-point

ID: `ccna-original-20261026-b05-039` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un paquete entra al router por Gi0/0 y sale enrutado por Gi0/1. ¿Qué asociación ACL lo comprueba al entrar por Gi0/0?

- **A.** Una ACL entrante en Gi0/0
- **B.** Solo una lista de búsqueda DNS
- **C.** Una ACL entrante en una interfaz no usada y ajena
- **D.** Una ACL saliente en Gi0/0

**Respuesta(s) propuesta(s): A.** Entrante y saliente se definen respecto a la interfaz del router. Entrar por Gi0/0 alcanza su política entrante; salir por Gi0/1 alcanza la política saliente de esa interfaz.

**English**

A packet enters router Gi0/0 and is routed out Gi0/1. Which ACL attachment checks it at entry on Gi0/0?

- **A.** An inbound ACL on Gi0/0
- **B.** Only a DNS search list
- **C.** An inbound ACL on an unrelated unused interface
- **D.** An outbound ACL on Gi0/0

Inbound and outbound directions are relative to the interface on the router. Entering Gi0/0 reaches its inbound policy; leaving Gi0/1 reaches that interface outbound policy.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Apply ACLs · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 40. tcp-syn-flood-half-open-state

ID: `ccna-original-20261026-b05-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un servidor recibe muchos SYN TCP falsificados y pocos ACK finales que completan el handshake. ¿Qué agotamiento de recursos busca el ataque?

- **A.** El campo de bits ID VLAN 802.1Q
- **B.** Estado o cola asociada con conexiones a medio abrir
- **C.** Solo el cálculo del serial de zona DNS
- **D.** La longitud física de todos los cables Ethernet

**Respuesta(s) propuesta(s): B.** Un SYN flood intenta agotar recursos asociados al establecimiento incompleto. La falta de ACK final puede dejar estado a medio abrir hasta recuperarlo o mitigar el ataque.

**English**

A server receives many spoofed TCP SYNs but few final ACKs completing the handshake. Which resource-exhaustion mechanism is the attack targeting?

- **A.** The 802.1Q VLAN ID bit field
- **B.** State or backlog associated with half-open connections
- **C.** The DNS zone serial number arithmetic only
- **D.** The physical length of every Ethernet cable

A SYN flood attempts to exhaust resources associated with incomplete connection establishment. The missing final ACK can leave half-open state until it is reclaimed or mitigated.

Referencia: https://www.rfc-editor.org/rfc/rfc4987.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. tls-wildcard-single-label-match

ID: `ccna-original-20261026-b05-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Según las reglas wildcard de RFC 9525, un certificado identifica *.example.com. ¿Qué dos nombres DNS solicitados puede cubrir ese wildcard? Selecciona dos.

- **A.** switch.example.com
- **B.** example.com
- **C.** a.b.example.com
- **D.** router.example.com

**Respuesta(s) propuesta(s): A, D.** Un wildcard permitido ocupa toda la etiqueta izquierda y coincide con una etiqueta. No cubre el nombre padre sin etiqueta adicional ni varios niveles. Siguen aplicándose las demás validaciones del certificado.

**English**

Under the RFC 9525 wildcard rules, a certificate DNS identifier is *.example.com. Which two requested DNS names can that wildcard match? Select two.

- **A.** switch.example.com
- **B.** example.com
- **C.** a.b.example.com
- **D.** router.example.com

A permitted wildcard is the complete left-most label and matches one label. It does not match the bare parent name or multiple additional labels. Other certificate validation checks still apply.

Referencia: https://www.rfc-editor.org/rfc/rfc9525.txt · 6.3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 42. ipsec-ah-no-confidentiality

ID: `ccna-original-20261026-b05-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una política exige ocultar el contenido de la carga útil a observadores. ¿Por qué AH de IPsec por sí solo es insuficiente?

- **A.** AH es un protocolo de asignación DHCP
- **B.** AH convierte toda dirección en loopback IPv6
- **C.** AH siempre cifra solo paquetes DNS
- **D.** AH proporciona integridad/autenticación, pero no confidencialidad

**Respuesta(s) propuesta(s): D.** Authentication Header ofrece integridad y autenticación de origen, no cifrado de carga. La confidencialidad requiere un servicio de cifrado apropiado como ESP configurado para ello.

**English**

A policy requires hiding packet payload contents from observers. Why is IPsec AH by itself insufficient?

- **A.** AH is a DHCP allocation protocol
- **B.** AH changes all addresses into IPv6 loopback
- **C.** AH always encrypts only DNS packets
- **D.** AH provides integrity/authentication services but not confidentiality

Authentication Header supplies integrity and data-origin authentication, not payload encryption. Confidentiality requires an appropriate encryption service such as suitably configured ESP.

Referencia: https://www.rfc-editor.org/rfc/rfc4302.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 43. eap-framework-not-universal-encryption

ID: `ccna-original-20261026-b05-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una WLAN usa EAP para autenticación. ¿Nombrar solo EAP define el método exacto y garantiza cifrado de todo tráfico de usuario?

- **A.** Sí; todos los métodos EAP son el mismo cifrador
- **B.** Sí; EAP deshabilita IP forwarding permanentemente
- **C.** No; EAP es solo un protocolo de routing
- **D.** No; EAP es un marco de autenticación y deben examinarse el método elegido y la seguridad del enlace

**Respuesta(s) propuesta(s): D.** EAP admite varios métodos de autenticación. El marco por sí solo no especifica todo comportamiento del método ni garantiza cifrado de todos los datos ordinarios.

**English**

A WLAN uses EAP for authentication. Does merely naming EAP establish the exact authentication method and guarantee encryption of all user traffic?

- **A.** Yes; all EAP methods are the same cipher
- **B.** Yes; EAP permanently disables IP forwarding
- **C.** No; EAP is only a routing protocol
- **D.** No; EAP is an authentication framework and the selected method and link security must be examined

EAP supports multiple authentication methods. Its framework alone does not specify the complete method behavior or guarantee that all ordinary user data is encrypted.

Referencia: https://www.rfc-editor.org/rfc/rfc3748.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. snmp-vacm-read-view-restriction

ID: `ccna-original-20261026-b05-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una cuenta SNMP debe leer solo un subconjunto permitido de objetos MIB. ¿Qué función define directamente esa vista de objetos permitida?

- **A.** Vistas de acceso del modelo VACM
- **B.** Un offset de fragmentación IPv4
- **C.** Un ID de puerto raíz spanning tree
- **D.** Una ventana de recepción TCP mayor

**Respuesta(s) propuesta(s): A.** VACM define acceso según grupos, contextos, niveles de seguridad y vistas MIB. El cifrado protege contenido, pero no define por sí mismo qué objetos puede leer una cuenta.

**English**

An SNMP account should read only a permitted subset of MIB objects. Which feature directly defines that permitted object view?

- **A.** View-based Access Control Model access views
- **B.** An IPv4 fragmentation offset
- **C.** A spanning-tree root port ID
- **D.** A larger TCP receive window

VACM defines access control based on groups, contexts, security levels and MIB views. Encryption protects transport content but does not by itself define which objects an account may read.

Referencia: https://www.rfc-editor.org/rfc/rfc3415.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 45. unused-access-port-administrative-shutdown

ID: `ccna-original-20261026-b05-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un puerto de switch no tiene equipo autorizado y no debe dar acceso inmediato si alguien conecta uno. ¿Qué acción administrativa directa deshabilita la interfaz?

- **A.** Configurar shutdown en esa interfaz
- **B.** Establecer la etiqueta de zona horaria NTP
- **C.** Aumentar el temporizador de envejecimiento MAC
- **D.** Cambiar solo el sufijo de dominio DNS

**Respuesta(s) propuesta(s): A.** El comando shutdown deshabilita administrativamente el puerto. Es una medida para puertos sin uso, no reemplaza políticas más amplias de acceso y seguridad física.

**English**

A switch port has no authorized endpoint and should not provide immediate network access if someone plugs in a device. Which direct administrative action disables that interface?

- **A.** Configure shutdown on that interface
- **B.** Set the NTP time zone label
- **C.** Increase the MAC aging timer
- **D.** Change only the DNS domain suffix

The shutdown interface command administratively disables the port. It is one control for unused ports, not a substitute for broader physical and access-control policies.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_interface_characteristics.html · Shutting Down and Restarting an Interface · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. http-401-authentication-challenge

ID: `ccna-original-20261026-b05-046` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API devuelve HTTP 401 con desafío WWW-Authenticate. ¿Qué condición debe investigar primero el cliente?

- **A.** Un desajuste dúplex Ethernet demostrado
- **B.** Credenciales ausentes o no aceptables para el recurso
- **C.** Una renumeración VLAN obligatoria
- **D.** Un commit de configuración automáticamente exitoso

**Respuesta(s) propuesta(s): B.** 401 indica que faltan credenciales válidas y requiere un desafío de autenticación. No equivale a suponer que un usuario ya autenticado dispone de autorización suficiente.

**English**

An API returns HTTP 401 with a WWW-Authenticate challenge. Which condition should the client investigate first?

- **A.** A proven Ethernet duplex mismatch
- **B.** Missing or unacceptable authentication credentials for the target resource
- **C.** A mandatory VLAN renumbering event
- **D.** An automatic successful configuration commit

401 indicates the request lacks valid authentication credentials and requires an authentication challenge. It is distinct from assuming an already authenticated user has sufficient authorization.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.5.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 47. http-patch-partial-update

ID: `ccna-original-20261026-b05-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API admite explícitamente PATCH y un tipo de contenido de parche documentado. ¿Qué pretende expresar el método frente al reemplazo de PUT?

- **A.** La garantía de que todo PATCH es idempotente sin importar el documento
- **B.** Un conjunto de cambios al recurso en lugar de necesariamente una representación completa de reemplazo
- **C.** Un reemplazo completo obligatorio con todos los campos en toda API
- **D.** Un reset TCP sin respuesta HTTP

**Respuesta(s) propuesta(s): B.** PATCH aplica un conjunto descrito de modificaciones; PUT solicita estado de reemplazo. Soporte, formato y comportamiento ante reintentos dependen de la API y la operación.

**English**

An API explicitly supports PATCH and a documented patch media type. What is the method intended to express compared with PUT replacement semantics?

- **A.** A guarantee that every PATCH request is idempotent regardless of document
- **B.** A set of changes to apply to a resource rather than necessarily a complete replacement representation
- **C.** A mandatory complete replacement with every field on every API
- **D.** A TCP connection reset without an HTTP response

PATCH applies a described set of modifications; PUT requests replacement state. PATCH support, document format and retry behavior depend on the API and patch operation.

Referencia: https://www.rfc-editor.org/rfc/rfc5789.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 48. post-timeout-unknown-outcome

ID: `ccna-original-20261026-b05-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Un POST no idempotente vence su plazo cuando pudo haber llegado al servidor. ¿Qué debe hacer la automatización antes de repetirlo a ciegas?

- **A.** Sustituir la carga por la contraseña del administrador
- **B.** Suponer que el timeout prueba que el servidor no cambió nada
- **C.** Reintentar siempre a máxima velocidad
- **D.** Determinar si se aplicó o usar el mecanismo documentado de prevención de duplicados o recuperación

**Respuesta(s) propuesta(s): D.** Perder la respuesta no demuestra que la solicitud no se procesó. Una operación no idempotente necesita recuperación específica o evidencia de reintento seguro; HTTP no ofrece una clave universal contra duplicados.

**English**

A non-idempotent POST request times out after it may have reached the server. What should automation do before blindly repeating the operation?

- **A.** Replace the payload with the administrator password
- **B.** Assume timeout proves the server made no change
- **C.** Retry forever at maximum speed
- **D.** Determine whether it was applied or use the API documented duplicate-prevention or recovery mechanism

A lost response does not prove the request was unprocessed. Non-idempotent operations need application-specific recovery or evidence that retrying is safe; HTTP alone supplies no universal duplicate-prevention key.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 9.2.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. netconf-stop-on-error-not-rollback

ID: `ccna-original-20261026-b05-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Un edit-config NETCONF usa error-option stop-on-error. Aparece un error tras cambios anteriores exitosos. ¿Esta opción promete por sí misma deshacerlos?

- **A.** No; detiene el procesamiento y no proporciona por sí mismo la semántica rollback-on-error
- **B.** No; significa que todo cambio posterior debe continuar pese a errores
- **C.** Sí; es idéntica a rollback-on-error en todo caso
- **D.** Sí; siempre restaura la configuración de fábrica

**Respuesta(s) propuesta(s): A.** stop-on-error aborta el procesamiento al encontrar un error. Revertir requiere la opción y capacidad separadas rollback-on-error; detener y revertir son operaciones distintas.

**English**

A NETCONF edit-config uses error-option stop-on-error. An error occurs after earlier edits succeeded. Does this option itself promise to undo those earlier successful edits?

- **A.** No; stop-on-error stops processing and does not itself provide rollback-on-error semantics
- **B.** No; it means every later edit must continue despite errors
- **C.** Yes; it is identical to rollback-on-error in all cases
- **D.** Yes; it always restores the factory configuration

stop-on-error aborts processing at an error. Rollback semantics require the separately defined rollback-on-error option and capability; stopping and reverting are different operations.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 7.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. yang-keyed-list-duplicate-key

ID: `ccna-original-20261026-b05-050` · Área: `automation_programmability` · Dificultad: `intermediate`

Una lista YANG usa name como única clave. ¿Puede una instancia válida contener dos entradas de esa lista con exactamente la misma clave name="Gi0/1"?

- **A.** Sí; si las propiedades JSON están ordenadas alfabéticamente
- **B.** Sí; las claves nunca restringen unicidad
- **C.** No; la clave debe identificar de forma única cada entrada de esa instancia de lista
- **D.** Solo cuando la interfaz es servidor DNS

**Respuesta(s) propuesta(s): C.** Los valores clave YANG identifican entradas de forma única en su instancia de lista. Es una restricción del esquema, no una consecuencia del orden alfabético JSON.

**English**

A YANG list uses name as its only key. Can a single valid instance contain two list entries with exactly the same key value name="Gi0/1"?

- **A.** Yes; as long as the JSON properties are alphabetized
- **B.** Yes; keys never constrain uniqueness
- **C.** No; the key must uniquely identify each list entry in that list instance
- **D.** Only when the interface is a DNS server

YANG list key values identify entries uniquely within their list instance. This is a schema constraint, not a consequence of alphabetical JSON member ordering.

Referencia: https://www.rfc-editor.org/rfc/rfc7950.txt · 7.8.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.
