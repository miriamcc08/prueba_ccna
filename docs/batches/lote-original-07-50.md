# Lote original: original-20261026-b07-50

Estado: **pendiente de revisión técnica y de traducción**. El estado de consulta y la evidencia de cada referencia figuran en el JSON. Las comprobaciones ejecutables de cálculo/escenario y la consulta documental no constituyen aprobación editorial completa.

Los ejercicios relacionados comparten familia y no se cuentan como conceptos independientes. La equivalencia semántica con todo el banco sigue en revisión. El texto se creó para el proyecto.

Consultas focalizadas registradas: **50/50**. Esta cifra no representa aprobaciones humanas.

| Área | Preguntas |
|---|---:|
| network_fundamentals | 10 |
| network_access | 10 |
| ip_connectivity | 12 |
| ip_services | 5 |
| security_fundamentals | 8 |
| automation_programmability | 5 |

El reparto de 50 requiere redondear los medios puntos de IP Connectivity y Security Fundamentals; no se afirma aquí haber confirmado la versión vigente del temario.

## 1. campus-access-layer-endpoints

ID: `ccna-original-20261026-b07-001` · Área: `network_fundamentals` · Dificultad: `basic`

En una LAN de campus jerárquica, ¿qué capa suele dar la primera conexión de red a los equipos de usuario?

- **A.** Registro de sistemas autónomos de Internet
- **B.** Zona raíz DNS
- **C.** Un proveedor de tránsito WAN obligatorio
- **D.** Capa de acceso

**Respuesta(s) propuesta(s): D.** La capa de acceso conecta equipos como estaciones, teléfonos y puntos de acceso. Distribución y núcleo cumplen funciones de agregación y tránsito.

**English**

In a hierarchical campus LAN, which layer normally provides the first network attachment for user endpoints?

- **A.** Internet autonomous-system registry
- **B.** DNS root zone
- **C.** A mandatory WAN transit provider
- **D.** Access layer

The campus access layer connects endpoints such as workstations, phones and access points. Distribution and core layers have aggregation and transit roles.

Referencia: https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html · Access layer · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 2. campus-distribution-aggregation-role

ID: `ccna-original-20261026-b07-002` · Área: `network_fundamentals` · Dificultad: `basic`

Varios switches de acceso alimentan una capa que los agrega y aporta un límite de políticas. ¿Qué rol jerárquico se describe?

- **A.** Un registro DNS
- **B.** Distribución
- **C.** Solo un cable de consola
- **D.** Un socket TCP del host

**Respuesta(s) propuesta(s): B.** Distribución agrega la conectividad de acceso y puede aportar límites de routing y políticas. El rol no exige un modelo de hardware único.

**English**

Multiple campus access switches feed a layer that aggregates them and provides a policy boundary. Which hierarchical role is described?

- **A.** A DNS resource record
- **B.** Distribution
- **C.** Only a console cable
- **D.** A host TCP socket

The distribution layer aggregates access connectivity and can provide routing and policy boundaries. A hierarchical role does not require one fixed hardware model.

Referencia: https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html · Distribution layer · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 3. collapsed-core-combines-roles

ID: `ccna-original-20261026-b07-003` · Área: `network_fundamentals` · Dificultad: `basic`

Un campus pequeño usa diseño de dos capas con núcleo colapsado en vez de separar acceso, distribución y núcleo. ¿Qué roles se combinan?

- **A.** Distribución y núcleo
- **B.** DNS y numeración de secuencia TCP
- **C.** Cada equipo se vuelve router de núcleo
- **D.** Solo aplicaciones y contraseñas de usuario

**Respuesta(s) propuesta(s): A.** Un núcleo colapsado combina distribución y núcleo y conserva una capa de acceso. Su idoneidad depende de tamaño, resiliencia y crecimiento.

**English**

A smaller campus uses a two-tier collapsed-core design rather than separate access, distribution and core tiers. Which roles are combined?

- **A.** Distribution and core
- **B.** DNS and TCP sequence numbering
- **C.** Every endpoint becomes a core router
- **D.** Only the user applications and passwords

A collapsed-core design combines distribution and core functions while retaining an access tier. Suitability depends on size, resilience and growth requirements.

Referencia: https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html · Two-tier design · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 4. leaf-spine-complete-bipartite-link-count

ID: `ccna-original-20261026-b07-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una fabric leaf-spine tiene seis leaf y tres spine. Cada leaf tiene un enlace a cada spine, sin enlaces de la misma capa. ¿Cuántos enlaces leaf-spine hay?

- **A.** 9
- **B.** 18
- **C.** 36
- **D.** 6

**Respuesta(s) propuesta(s): B.** Hay un enlace por pareja leaf-spine: 6×3=18. Cada enlace se cuenta una vez, no una por sentido.

**English**

A simple leaf-spine fabric has six leaves and three spines. Every leaf has exactly one link to each spine, with no same-tier links. How many leaf-to-spine links exist?

- **A.** 9
- **B.** 18
- **C.** 36
- **D.** 6

There is one link for every leaf-spine pair, giving 6×3=18 links. Links are counted once, not once per direction.

Referencia: https://www.rfc-editor.org/rfc/rfc7938.txt · 3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 5. leaf-spine-same-hop-count

ID: `ccna-original-20261026-b07-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

En una topología leaf-spine de dos etapas sin enlaces entre leaf, un paquete va de un leaf a otro pasando por un spine. ¿Cuántos enlaces entre switches cruza?

- **A.** 1
- **B.** 2
- **C.** 0
- **D.** 3

**Respuesta(s) propuesta(s): B.** El camino es leaf → spine → leaf y cruza dos enlaces. El conteo topológico no garantiza igual latencia con congestión.

**English**

In a simple two-stage leaf-spine topology with no leaf-to-leaf links, a packet travels from one leaf to a different leaf through one spine. How many inter-switch links does that path traverse?

- **A.** 1
- **B.** 2
- **C.** 0
- **D.** 3

The path is leaf → spine → leaf, which traverses two links. This topology count does not guarantee equal latency under congestion.

Referencia: https://www.rfc-editor.org/rfc/rfc7938.txt · 3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 6. network-virtualization-overlay-underlay-separation

ID: `ccna-original-20261026-b07-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un overlay transporta tráfico de clientes sobre una red IP física. ¿Qué afirmación separa correctamente los roles de overlay y underlay?

- **A.** El underlay debe conocer toda contraseña de aplicación
- **B.** El overlay aporta contexto de red virtual y el underlay aporta alcanzabilidad de transporte
- **C.** Ambos siempre significan la misma zona DNS
- **D.** El overlay elimina toda necesidad de conectividad física

**Respuesta(s) propuesta(s): B.** La virtualización separa la red virtual del cliente de la red de transporte del tráfico encapsulado. La red subyacente sigue teniendo que entregar paquetes.

**English**

An overlay carries tenant traffic over a physical IP network. Which statement correctly separates overlay and underlay roles?

- **A.** The underlay must know every application password
- **B.** The overlay supplies virtual-network context while the underlay supplies transport reachability
- **C.** Both terms always mean the same DNS zone
- **D.** The overlay removes every need for physical connectivity

Network virtualization separates a tenant virtual network from the transport network used to carry encapsulated traffic. The underlying network still has to deliver packets.

Referencia: https://www.rfc-editor.org/rfc/rfc7365.txt · Underlay and overlay definitions · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 7. nve-hypervisor-or-physical-placement

ID: `ccna-original-20261026-b07-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

¿Un Network Virtualization Edge debe ser siempre un switch físico separado?

- **A.** No; puede implementarse en un switch virtual del hipervisor u otros equipos adecuados
- **B.** Sí; se prohíben implementaciones por software
- **C.** No; las redes virtuales nunca requieren funciones de borde
- **D.** Sí; debe ser un servidor DNS público

**Respuesta(s) propuesta(s): A.** El marco NVO3 permite NVE en switch virtual del hipervisor, equipo físico, appliance o implementación repartida. El rol no equivale a un único chasis.

**English**

Must a Network Virtualization Edge always be a separate physical switch?

- **A.** No; it can be implemented in a hypervisor virtual switch or other suitable devices
- **B.** Yes; software implementations are prohibited
- **C.** No; because virtual networks never need edge functions
- **D.** Yes; it must be a public DNS server

The NVO3 framework permits an NVE in a hypervisor virtual switch, a physical device, an appliance or split implementations. The role is not synonymous with one chassis.

Referencia: https://www.rfc-editor.org/rfc/rfc7365.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 8. vxlan-vni-bit-field-capacity

ID: `ccna-original-20261026-b07-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

VXLAN define un VNI de 24 bits. Considerando solo patrones de bits, antes de reservas o límites de plataforma, ¿cuántos patrones existen?

- **A.** 4096
- **B.** 24
- **C.** 16777216
- **D.** 65536

**Respuesta(s) propuesta(s): C.** Un campo de 24 bits tiene 2^24=16 777 216 patrones. No promete que un equipo admita tantos segmentos activos ni que todo patrón sea utilizable.

**English**

VXLAN defines a 24-bit VNI field. Considering only its raw bit-pattern space, before any reservations or platform limits, how many patterns exist?

- **A.** 4096
- **B.** 24
- **C.** 16777216
- **D.** 65536

A 24-bit field has 2^24=16,777,216 raw patterns. That is not a promise that a device supports that many active segments, nor that every pattern is usable.

Referencia: https://www.rfc-editor.org/rfc/rfc7348.txt · 5 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 9. vxlan-vtep-encapsulation-visibility

ID: `ccna-original-20261026-b07-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una VM envía una trama Ethernet normal por un VTEP VXLAN. ¿Qué componente añade normalmente el encapsulado VXLAN externo?

- **A.** El registro MX DNS
- **B.** El VTEP
- **C.** La aplicación debe añadir una LSA OSPF a cada escritura
- **D.** El teclado del usuario receptor

**Respuesta(s) propuesta(s): B.** El VTEP encapsula y desencapsula VXLAN. La VM puede enviar su trama interna normal sin ver las cabeceras del túnel.

**English**

A VM sends an ordinary Ethernet frame through a VXLAN VTEP. Which component normally adds the VXLAN outer encapsulation?

- **A.** The DNS MX record
- **B.** The VTEP
- **C.** The application must append an OSPF LSA to every write
- **D.** The receiving user keyboard

The VTEP performs VXLAN encapsulation and decapsulation. The VM can transmit its normal inner frame without seeing the tunnel headers.

Referencia: https://www.rfc-editor.org/rfc/rfc7348.txt · 4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 10. vxlan-isolation-not-encryption-guarantee

ID: `ccna-original-20261026-b07-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

¿Un identificador VXLAN garantiza por sí solo que la carga del cliente esté cifrada?

- **A.** No; segmentación y encapsulado por sí solos no dan confidencialidad
- **B.** No; Ethernet no puede encapsularse
- **C.** Sí; todo VNI es una clave secreta de cifrado
- **D.** Sí; todo router underlay se vuelve servidor TLS

**Respuesta(s) propuesta(s): A.** VXLAN aporta identificador y encapsulado overlay. La confidencialidad requiere un mecanismo de seguridad adecuado adicional; aislar y cifrar son propiedades distintas.

**English**

Does a VXLAN identifier by itself guarantee that tenant payload is encrypted?

- **A.** No; segmentation and encapsulation alone are not a confidentiality service
- **B.** No; because Ethernet cannot be encapsulated
- **C.** Yes; every VNI is a secret encryption key
- **D.** Yes; all underlay routers become TLS servers

VXLAN supplies an overlay identifier and encapsulation. Confidentiality requires a suitable additional security mechanism; isolation and encryption are different properties.

Referencia: https://www.rfc-editor.org/rfc/rfc7348.txt · 7. Security Considerations · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 11. capwap-bssid-to-wlan-identifier-scope

ID: `ccna-original-20261026-b07-011` · Área: `network_access` · Dificultad: `basic`

Un controlador CAPWAP usa WLAN ID en su modelo de control. ¿Es ese identificador simplemente lo mismo que la MAC BSSID IEEE 802.11?

- **A.** Sí; ambos son máscaras IPv4
- **B.** Sí; ambos siempre contienen los mismos 48 bits
- **C.** No; CAPWAP no puede representar WLAN
- **D.** No; el binding define una asociación entre WLAN ID y BSSID

**Respuesta(s) propuesta(s): D.** El binding CAPWAP IEEE 802.11 define explícitamente la asociación BSSID-WLAN-ID. Un WLAN ID de control y un BSSID de radio no son formatos intercambiables.

**English**

A CAPWAP controller uses WLAN IDs in its control model. Is that identifier simply the same thing as the IEEE 802.11 BSSID MAC address?

- **A.** Yes; both are IPv4 subnet masks
- **B.** Yes; both always contain the same 48 bits
- **C.** No; CAPWAP cannot represent wireless LANs
- **D.** No; the binding defines a mapping between WLAN IDs and BSSIDs

The IEEE 802.11 CAPWAP binding explicitly defines BSSID-to-WLAN-ID mapping. A control-plane WLAN ID and a radio BSSID are not interchangeable address formats.

Referencia: https://www.rfc-editor.org/rfc/rfc5416.txt · 2.5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 12. wireless-transmit-power-dbm-ratio

ID: `ccna-original-20261026-b07-012` · Área: `network_access` · Dificultad: `intermediate`

La radio A transmite a 20 dBm y B a 10 dBm. Usando P(A)/P(B)=10^((dBmA−dBmB)/10), ¿cuál es la razón de potencia?

- **A.** 10
- **B.** 100
- **C.** 2
- **D.** 1

**Respuesta(s) propuesta(s): A.** Una diferencia de 10 dB representa potencia diez veces mayor. No implica directamente diez veces el radio de cobertura ni la tasa de datos.

**English**

Radio A transmits at 20 dBm and radio B at 10 dBm. Using P(A)/P(B)=10^((dBmA−dBmB)/10), what is their power ratio?

- **A.** 10
- **B.** 100
- **C.** 2
- **D.** 1

A difference of 10 dB represents a tenfold power ratio. It does not directly imply ten times the coverage radius or data rate.

Referencia: https://www.rfc-editor.org/rfc/rfc5416.txt · Transmit-power fields · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 13. capwap-control-up-not-client-path-proof

ID: `ccna-original-20261026-b07-013` · Área: `network_access` · Dificultad: `intermediate`

Un WTP tiene sesión de control CAPWAP sana, pero un cliente no alcanza una aplicación. ¿Qué puede concluirse solo de la sesión de control?

- **A.** Todas las VLAN, DHCP y autorizaciones del cliente necesariamente son correctas
- **B.** La aplicación remota necesariamente está caída
- **C.** Hay conectividad de control, pero faltan comprobaciones del camino de datos y servicios del cliente
- **D.** Todos los clientes necesariamente se autenticaron

**Respuesta(s) propuesta(s): C.** CAPWAP separa funciones de control y datos. Un canal de control operativo no prueba direccionamiento, reenvío, autenticación ni acceso de aplicación del cliente.

**English**

A WTP has a healthy CAPWAP control session, but a wireless client cannot reach an application. What can be concluded from the control session alone?

- **A.** All client VLANs, DHCP and application permissions are guaranteed correct
- **B.** The remote application must be down
- **C.** Controller control-channel connectivity exists, but client data-path and service checks are still needed
- **D.** Every wireless client has been authenticated successfully

CAPWAP separates control and data functions. A working control channel does not prove client addressing, forwarding, authentication and end-to-end application access.

Referencia: https://www.rfc-editor.org/rfc/rfc5415.txt · 2.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. campus-oversubscription-ratio

ID: `ccna-original-20261026-b07-014` · Área: `network_access` · Dificultad: `intermediate`

Un bloque ofrece 48 puertos de 1 Gbps y dos uplinks activos de 10 Gbps. Ignorando sobrecarga y suponiendo reparto agregado, ¿cuál es la razón capacidad de acceso/uplinks?

- **A.** 4.8:1
- **B.** 1:2.4
- **C.** 2.4:1
- **D.** 24:1

**Respuesta(s) propuesta(s): C.** El acceso suma 48 Gbps y los uplinks 20 Gbps: 48/20=2,4:1. La razón agregada no garantiza que un flujo use ambos uplinks.

**English**

An access block offers 48 ports at 1 Gbps and has two active 10 Gbps uplinks. Ignoring overhead and assuming aggregate use can be balanced, what is the offered access-to-uplink capacity ratio?

- **A.** 4.8:1
- **B.** 1:2.4
- **C.** 2.4:1
- **D.** 24:1

The access total is 48 Gbps and uplink total 20 Gbps, yielding 48/20=2.4:1. This aggregate ratio does not guarantee one flow can use both uplinks.

Referencia: https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html · Oversubscription ratios · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 15. stp-local-port-priority-tiebreak

ID: `ccna-original-20261026-b07-015` · Área: `network_access` · Dificultad: `intermediate`

Dos puertos STP locales reciben BPDU idénticas en lo demás y tienen igual costo. Sus ID locales son 64.7 y 128.1. En el desempate final de ID local, ¿cuál se prefiere?

- **A.** 128.1
- **B.** Ningún ID de puerto puede compararse
- **C.** 64.7
- **D.** Ambos deben ser puentes raíz

**Respuesta(s) propuesta(s): C.** El ID compara prioridad antes del número. La prioridad 64 precede a 128 aunque el puerto 7 sea mayor que 1. Se supone empate en las comparaciones previas de BPDU y costo.

**English**

Two local candidate STP ports receive otherwise identical BPDUs and have equal path cost. Their local port IDs are 64.7 and 128.1. At the final local-port-ID tie-break, which is preferred?

- **A.** 128.1
- **B.** Neither port ID can be compared
- **C.** 64.7
- **D.** Both must be root bridges

Port IDs compare priority before port number. Priority 64 precedes 128 even though port number 7 is larger than 1. The earlier BPDU and cost comparisons are explicitly tied.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Port Priority · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 16. legacy-stp-topology-change-aging

ID: `ccna-original-20261026-b07-016` · Área: `network_access` · Dificultad: `intermediate`

En STP clásico, ¿por qué un cambio de topología puede acelerar el envejecimiento de información dinámica de reenvío?

- **A.** Para cifrar automáticamente la tabla MAC
- **B.** Para convertir toda IP estática en broadcast
- **C.** Para deshabilitar toda caché DNS por definición
- **D.** Para retirar antes ubicaciones obsoletas al cambiar caminos de reenvío

**Respuesta(s) propuesta(s): D.** El envejecimiento MAC acelerado adapta la base de reenvío a cambios de caminos de capa 2. Es convergencia de switching, no modificación de IP ni DNS.

**English**

In legacy STP operation, why can a topology change cause dynamic forwarding information to age faster?

- **A.** To encrypt the MAC table automatically
- **B.** To make every static IP address a broadcast
- **C.** To disable all DNS caching by protocol definition
- **D.** To remove stale location information sooner as forwarding paths change

Accelerated MAC aging helps the forwarding database adapt to changed Layer 2 paths. This is a switching convergence mechanism, not a change to IP addresses or DNS records.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Accelerated Aging · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 17. lacp-fast-control-interval

ID: `ccna-original-20261026-b07-017` · Área: `network_access` · Dificultad: `intermediate`

Una interfaz compatible usa lacp rate fast. ¿Qué intervalo nominal de mensajes de control LACP documenta Cisco para modo rápido?

- **A.** 0 segundos
- **B.** 1 hora
- **C.** 30 segundos
- **D.** 1 segundo

**Respuesta(s) propuesta(s): D.** LACP rápido usa intervalo de control de un segundo frente a los 30 segundos normales. Detectar fallos también depende de reglas de timeout e implementación.

**English**

A supported switch interface uses lacp rate fast. What nominal LACP control-message interval does Cisco document for fast mode?

- **A.** 0 seconds
- **B.** 1 hour
- **C.** 30 seconds
- **D.** 1 second

Fast LACP uses the documented one-second control interval, rather than the normal 30-second interval. Actual failure detection also depends on timeout rules and implementation.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · LACP Rate · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. lacp-port-priority-hot-standby-selection

ID: `ccna-original-20261026-b07-018` · Área: `network_access` · Dificultad: `intermediate`

En el mismo sistema LACP elegible y con condiciones de miembro iguales, dos puertos tienen prioridades LACP 100 y 200. ¿Cuál se prefiere para selección activa cuando se usa esa comparación?

- **A.** 200
- **B.** 100
- **C.** La preferencia del servidor DNS
- **D.** El puerto TCP mayor

**Respuesta(s) propuesta(s): B.** Los valores menores de prioridad de puerto LACP tienen mayor precedencia. Selección de sistema y elegibilidad preceden esa comparación; el ancho de banda no la anula por sí solo.

**English**

With the same eligible LACP system and otherwise equal member conditions, two candidate ports have LACP port priorities 100 and 200. Which is preferred for active selection when that comparison is needed?

- **A.** 200
- **B.** 100
- **C.** The DNS server preference
- **D.** The larger TCP port

Lower LACP port-priority values have higher priority. System selection and other eligibility conditions precede the member-port comparison; bandwidth alone does not override it.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · LACP Port Priority · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 19. dtp-nonegotiate-peer-static-trunk

ID: `ccna-original-20261026-b07-019` · Área: `network_access` · Dificultad: `intermediate`

Un Catalyst tiene troncal estático y suprime DTP con switchport nonegotiate. ¿Qué debe prepararse en un extremo compatible que no negocia DTP?

- **A.** Confiar en dos puertos DTP pasivos para crear el troncal
- **B.** Configurar explícitamente el troncal del otro extremo con ajustes VLAN compatibles
- **C.** Usar DNS para negociar el encapsulado Ethernet
- **D.** Suponer que nonegotiate elimina todas las etiquetas VLAN

**Respuesta(s) propuesta(s): B.** Suprimir DTP elimina negociación, no encapsulado troncal. Ambos extremos deben configurarse de manera coherente al establecer un troncal estático.

**English**

A Catalyst port is statically configured as a trunk and DTP is suppressed using switchport nonegotiate. What should be arranged on a compatible peer that cannot negotiate DTP?

- **A.** Rely on two passive DTP ports to create the trunk
- **B.** Configure the peer trunk explicitly with matching required VLAN settings
- **C.** Use DNS to negotiate the Ethernet encapsulation
- **D.** Assume nonegotiate deletes every VLAN tag

Suppressing DTP removes negotiation, not trunk encapsulation. Both ends must be configured consistently when trunking is established statically.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Trunking Modes · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. dtp-suppression-not-data-tag-removal

ID: `ccna-original-20261026-b07-020` · Área: `network_access` · Dificultad: `intermediate`

¿switchport nonegotiate en un troncal 802.1Q ya configurado significa que el tráfico VLAN normalmente etiquetado deja de etiquetarse?

- **A.** Sí; fuerza todas las VLAN dentro de un paquete DNS
- **B.** No; suprimir negociación DTP es distinto de retirar encapsulado 802.1Q
- **C.** No; un troncal nunca lleva tráfico etiquetado
- **D.** Sí; DTP es toda etiqueta VLAN

**Respuesta(s) propuesta(s): B.** DTP controla negociación. Un troncal estático puede transportar 802.1Q sin enviar tramas DTP, según su configuración VLAN.

**English**

Does switchport nonegotiate on an already configured 802.1Q trunk mean ordinary tagged VLAN traffic is no longer tagged?

- **A.** Yes; it forces all VLANs into a DNS packet
- **B.** No; suppressing DTP negotiation is different from removing 802.1Q encapsulation
- **C.** No; because a trunk never has tagged traffic
- **D.** Yes; DTP itself is every VLAN tag

DTP controls negotiation. A static trunk can carry 802.1Q traffic while not sending DTP frames, subject to its VLAN configuration.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Trunking Modes · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 21. ipv4-multicast-host-membership-igmp

ID: `ccna-original-20261026-b07-021` · Área: `ip_connectivity` · Dificultad: `basic`

Un host IPv4 debe informar interés en un grupo multicast en su enlace. ¿Qué familia de protocolo aporta informes de membresía de host?

- **A.** Commit NETCONF
- **B.** Handshake TCP a 255.255.255.255
- **C.** ARP como protocolo de routing global
- **D.** IGMP

**Respuesta(s) propuesta(s): D.** IGMP informa membresía multicast del host en la red local. Es distinto de protocolos que los routers usan para construir reenvío multicast entre redes.

**English**

An IPv4 host needs to report interest in a multicast group on its attached link. Which protocol family supplies host membership reporting?

- **A.** NETCONF commit
- **B.** TCP three-way handshake to 255.255.255.255
- **C.** ARP as an Internet-wide routing protocol
- **D.** IGMP

IGMP reports host multicast-group membership on the local network. It is distinct from the protocols routers may use to build multicast forwarding across networks.

Referencia: https://www.rfc-editor.org/rfc/rfc3376.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 22. ipv6-deprecated-address-still-valid

ID: `ccna-original-20261026-b07-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una IPv6 tiene vida preferida 0 y vida válida positiva. ¿Qué interpretación es correcta?

- **A.** Está deprecada pero sigue válida; las comunicaciones nuevas deben preferir una dirección preferida adecuada
- **B.** El host necesariamente perdió su router predeterminado
- **C.** Ya es inválida y nunca puede usarse en comunicaciones existentes
- **D.** Se vuelve una MAC multicast

**Respuesta(s) propuesta(s): A.** Vida preferida y válida cumplen funciones distintas. Una dirección deprecada sigue válida durante su vida válida; se desaconseja uso nuevo si existe alternativa adecuada.

**English**

An IPv6 address has preferred lifetime 0 but positive valid lifetime. Which state interpretation is correct?

- **A.** It is deprecated but still valid; new communications should prefer a suitable preferred address
- **B.** The host has necessarily lost its default router
- **C.** It is already invalid and can never be used for existing communication
- **D.** It becomes an Ethernet multicast address

Preferred and valid lifetimes serve different purposes. A deprecated address remains valid during its valid lifetime; deprecation discourages new use when an appropriate alternative exists.

Referencia: https://www.rfc-editor.org/rfc/rfc4862.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 23. ipv6-valid-lifetime-expiry

ID: `ccna-original-20261026-b07-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

Vence la vida válida de una IPv6. ¿Qué consecuencia la distingue de quedar solo deprecada?

- **A.** Sigue válida para siempre para conexiones nuevas
- **B.** Crea automáticamente una ruta predeterminada hacia sí misma
- **C.** Se vuelve inválida y no debe usarse como dirección asignada a la interfaz
- **D.** Convierte toda ACL IPv4 en IPv6

**Respuesta(s) propuesta(s): C.** Vencer vida válida vuelve inválida la dirección, a diferencia de la vida preferida que solo la depreca. La vida del router es otro parámetro de Neighbor Discovery.

**English**

An IPv6 address valid lifetime expires. Which consequence distinguishes it from merely becoming deprecated?

- **A.** It remains valid forever for new connections
- **B.** It automatically creates a default route to itself
- **C.** It becomes invalid and must not be used as an address assigned to the interface
- **D.** It changes every IPv4 ACL into an IPv6 ACL

Validity expiry makes the address invalid, unlike preferred-lifetime expiry that only deprecates it. Router lifetime is a separate Neighbor Discovery parameter.

Referencia: https://www.rfc-editor.org/rfc/rfc4862.txt · 5.5.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 24. ospf-hello-mask-broadcast-check

ID: `ccna-original-20261026-b07-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos interfaces OSPFv2 de una red broadcast reciben Hello con máscaras de red distintas, sin excepciones especiales. ¿Qué incompatibilidad debe corregirse?

- **A.** Los puertos origen TCP deben igualarse
- **B.** TTL DNS debe coincidir con costo OSPF
- **C.** La máscara del Hello debe coincidir con la de la interfaz broadcast receptora
- **D.** Ambos routers deben tener el mismo router ID

**Respuesta(s) propuesta(s): C.** En este tipo de red OSPF compara la máscara Hello con la interfaz. Hay excepciones para punto a punto y enlaces virtuales, excluidas aquí.

**English**

Two OSPFv2 interfaces on a broadcast network receive Hellos with different network masks, with no special exceptions. What compatibility issue must be corrected?

- **A.** TCP source ports must become equal
- **B.** DNS TTL must match OSPF cost
- **C.** The Hello network mask must match the receiving broadcast interface mask
- **D.** Both routers must have the same router ID

For this network type, OSPF checks the received Hello network mask against the interface. Point-to-point and virtual-link rules have exceptions and are excluded here.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 10.5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 25. ospf-priority-zero-adjacency-not-disabled

ID: `ccna-original-20261026-b07-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router OSPFv2 tiene prioridad 0 en una LAN broadcast y configuración compatible en lo demás. ¿Qué dos afirmaciones son correctas? Selecciona dos.

- **A.** OSPF queda totalmente deshabilitado en la interfaz
- **B.** No es elegible como DR ni BDR en ese segmento
- **C.** Debe usar el mismo router ID del DR
- **D.** Puede formar las adyacencias requeridas con DR o BDR

**Respuesta(s) propuesta(s): B, D.** Prioridad 0 elimina elegibilidad DR/BDR; no deshabilita participación OSPF ni sus reglas normales de adyacencia. Los router ID deben seguir siendo únicos.

**English**

An OSPFv2 router has priority 0 on a broadcast LAN and otherwise compatible configuration. Which two statements are correct? Select two.

- **A.** OSPF is disabled completely on the interface
- **B.** It is ineligible to become DR or BDR on that segment
- **C.** It must use the same router ID as the DR
- **D.** It can still form required adjacencies with the DR or BDR

Priority 0 removes DR/BDR eligibility; it does not disable OSPF participation or the ordinary adjacency rules. Router IDs must remain unique.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 9.4 and 10.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 26. ospfv2-ip-protocol-number-not-udp-port

ID: `ccna-original-20261026-b07-026` · Área: `ip_connectivity` · Dificultad: `basic`

Un filtro IPv4 debe identificar paquetes OSPFv2 nativos. ¿Qué coincidencia describe el encapsulado?

- **A.** Protocolo IP 89
- **B.** Puerto TCP destino 179
- **C.** Tipo ICMP 89
- **D.** Puerto UDP destino 89

**Respuesta(s) propuesta(s): A.** OSPF funciona directamente sobre IP con número de protocolo 89. No es puerto UDP ni TCP; filtrar solo puertos compara otro campo.

**English**

An IPv4 filter must identify native OSPFv2 packets. Which match describes the protocol encapsulation?

- **A.** IP protocol 89
- **B.** TCP destination port 179
- **C.** ICMP type 89
- **D.** UDP destination port 89

OSPF runs directly over IP using protocol number 89. The number is not a UDP or TCP port; a port-only filter would target the wrong header field.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · A.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 27. ospf-alldrouters-multicast-role

ID: `ccna-original-20261026-b07-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

En una red OSPF broadcast un DROther debe enviar tráfico de inundación pertinente al grupo del DR y BDR. ¿Qué dirección multicast IPv4 identifica AllDRouters?

- **A.** 224.0.0.5
- **B.** 224.0.0.6
- **C.** 255.255.255.255
- **D.** 239.255.255.250

**Respuesta(s) propuesta(s): B.** AllDRouters es 224.0.0.6 y difiere de AllSPFRouters 224.0.0.5. El destino depende del paquete OSPF y el rol emisor.

**English**

On an OSPF broadcast network, a DROther needs to send relevant flooding traffic to the DR and BDR multicast group. Which IPv4 multicast address names AllDRouters?

- **A.** 224.0.0.5
- **B.** 224.0.0.6
- **C.** 255.255.255.255
- **D.** 239.255.255.250

AllDRouters is 224.0.0.6, distinct from AllSPFRouters at 224.0.0.5. The destination depends on OSPF packet type and sender role.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · A.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 28. ipv6-neighbor-cache-not-arp-cache

ID: `ccna-original-20261026-b07-028` · Área: `ip_connectivity` · Dificultad: `basic`

Un administrador no ve entrada ARP de un vecino IPv6 que funciona. ¿Qué tabla debe consultar para resolver direcciones de enlace IPv6?

- **A.** La tabla de secuencias TCP como reemplazo ARP
- **B.** La caché de vecinos IPv6
- **C.** Solo la lista de pruning VLAN
- **D.** Solo la tabla MX DNS

**Respuesta(s) propuesta(s): B.** Neighbor Discovery IPv6 resuelve direcciones y conserva caché de vecinos. Una entrada ARP IPv4 vacía no diagnostica por sí sola un fallo IPv6.

**English**

An administrator sees no ARP entry for a working IPv6 neighbor. Which table should be checked for IPv6 link-layer resolution?

- **A.** The TCP sequence-number table as an ARP replacement
- **B.** The IPv6 Neighbor Cache
- **C.** The VLAN pruning list only
- **D.** Only the DNS MX table

IPv6 Neighbor Discovery supplies address resolution and maintains neighbor-cache entries. An empty IPv4 ARP entry does not by itself diagnose broken IPv6 communication.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 5.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 29. routed-ethernet-source-and-destination-rewrite

ID: `ccna-original-20261026-b07-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router reenvía un paquete a un host remoto mediante otro router Ethernet. No hay NAT. ¿Qué dos cambios de cabecera Ethernet se esperan a la salida? Selecciona dos.

- **A.** La MAC origen es la de la interfaz de salida del router
- **B.** La MAC destino alcanza al vecino de siguiente salto elegido
- **C.** La MAC destino es el ID de consulta DNS original
- **D.** La MAC origen debe seguir siendo la del host original en todo salto

**Respuesta(s) propuesta(s): A, B.** El routing crea una trama de enlace nueva para el siguiente enlace. Direcciones IP extremo a extremo y MAC por enlace tienen ámbitos distintos; no se conserva la cabecera Ethernet original en cada salto.

**English**

A router forwards a packet to a remote host through another Ethernet router. No NAT is used. Which two Ethernet-header changes are expected on the outgoing frame? Select two.

- **A.** Source MAC is the outgoing router interface MAC
- **B.** Destination MAC reaches the selected next-hop neighbor
- **C.** Destination MAC is the original DNS query ID
- **D.** Source MAC must remain the original host MAC across all routed hops

Routing creates a new link-layer frame for the next link. End-to-end IP addressing and per-link MAC addressing serve different scopes; normal routing does not preserve the original Ethernet header across hops.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 30. ipv6-same-link-local-address-different-zones

ID: `ccna-original-20261026-b07-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos interfaces aisladas usan la misma fe80::1 de enlace local en enlaces distintos. ¿Es necesariamente un conflicto de dirección duplicada entre esos enlaces?

- **A.** No; las direcciones locales se interpretan dentro del ámbito y zona de su enlace
- **B.** Sí; toda fe80 es broadcast
- **C.** No; IPv6 no usa direcciones
- **D.** Sí; deben ser únicas en todo Internet

**Respuesta(s) propuesta(s): A.** Una dirección con ámbito tiene significado dentro de su zona. Reutilizarla en enlaces distintos puede ser válido; un siguiente salto local puede requerir identificar interfaz o zona.

**English**

Two isolated interfaces use the same fe80::1 link-local address on different links. Is that necessarily a duplicate-address conflict across those links?

- **A.** No; link-local addresses are interpreted within their link scope and zone
- **B.** Yes; every fe80 address is a broadcast
- **C.** No; because IPv6 does not use addresses
- **D.** Yes; link-local addresses must be unique across the entire Internet

A scoped address is meaningful within its zone. Reuse on distinct links can be valid; using a link-local next hop may require identifying its interface or zone.

Referencia: https://www.rfc-editor.org/rfc/rfc4007.txt · 5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 31. ospf-positive-interface-output-cost

ID: `ccna-original-20261026-b07-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

OSPF exige un costo de salida de interfaz positivo. ¿Qué dos valores cumplen ese requisito? Selecciona dos.

- **A.** 0
- **B.** 1
- **C.** -1
- **D.** 10

**Respuesta(s) propuesta(s): B, D.** El costo de salida OSPF debe ser mayor que cero. Los límites superiores de plataforma son otra cuestión; los ejemplos positivos están en rangos normales.

**English**

OSPF requires a positive interface output cost. Which two proposed costs satisfy that requirement? Select two.

- **A.** 0
- **B.** 1
- **C.** -1
- **D.** 10

The OSPF interface output cost must be greater than zero. Platform-specific upper bounds are a separate matter; the supplied positive examples are within ordinary supported ranges.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · C.3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 32. routing-bracket-distance-versus-metric-meaning

ID: `ccna-original-20261026-b07-032` · Área: `ip_connectivity` · Dificultad: `basic`

Una ruta OSPF IOS muestra [110/30]. ¿Qué interpretación es correcta?

- **A.** 110 es longitud de prefijo IPv4
- **B.** Ambos números son MAC
- **C.** 110 es puerto TCP y 30 TTL DNS
- **D.** 110 es distancia administrativa y 30 es métrica

**Respuesta(s) propuesta(s): D.** En este formato IOS los corchetes muestran distancia y luego métrica. No es requisito universal que toda línea de la tabla incluya corchetes.

**English**

An IOS OSPF route displays [110/30]. Which interpretation of these bracketed numbers is correct?

- **A.** 110 is the IPv4 prefix length
- **B.** Both numbers are MAC addresses
- **C.** 110 is a TCP port and 30 is DNS TTL
- **D.** 110 is administrative distance and 30 is the route metric

For this displayed IOS route format, brackets show administrative distance followed by metric. It is not a universal requirement that every routing-table line contain such brackets.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Administrative Distance · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 33. dns-negative-cache-ttl-minimum

ID: `ccna-original-20261026-b07-033` · Área: `ip_services` · Dificultad: `intermediate`

Una respuesta DNS negativa tiene TTL SOA de 900 segundos y SOA MINIMUM de 300. Según RFC 2308, ¿qué TTL inicial de caché negativa se usa antes de descontar tiempo?

- **A.** 900 segundos
- **B.** 0 segundos
- **C.** 300 segundos
- **D.** 1200 segundos

**Respuesta(s) propuesta(s): C.** El TTL negativo es el mínimo entre TTL SOA y SOA MINIMUM, aquí 300 segundos. No es su suma ni automáticamente el mayor.

**English**

A negative DNS answer has SOA TTL=900 seconds and SOA MINIMUM=300 seconds. Under RFC 2308, what initial negative-cache TTL is used before elapsed time?

- **A.** 900 seconds
- **B.** 0 seconds
- **C.** 300 seconds
- **D.** 1200 seconds

The negative-cache TTL is the minimum of SOA TTL and SOA MINIMUM, here 300 seconds. It is not their sum or automatically the largest value.

Referencia: https://www.rfc-editor.org/rfc/rfc2308.txt · 5 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 34. dynamic-nat-new-allocation-exhaustion

ID: `ccna-original-20261026-b07-034` · Área: `ip_services` · Dificultad: `intermediate`

Un pool NAT dinámico no tiene direcciones globales libres ni mecanismo de sobrecarga de puertos. ¿Qué puede ocurrir cuando otro host interno requiere traducción?

- **A.** No puede asignarse la traducción nueva hasta liberar recursos
- **B.** El pool se vuelve infinito por habilitar NAT
- **C.** DNS crea automáticamente IP públicas
- **D.** Toda traducción existente debe cifrarse de inmediato

**Respuesta(s) propuesta(s): A.** NAT dinámico básico requiere una dirección externa disponible para asignar otra traducción. PAT cambia el reparto de recursos, pero se excluye. Fallar una nueva asignación no implica terminar todas las sesiones existentes.

**English**

A dynamic NAT pool has no free global addresses, and the configuration has no port-overload mechanism. What can happen when a new internal host needs a translation?

- **A.** The new translation cannot be allocated until resources become available
- **B.** The pool size becomes infinite because NAT is enabled
- **C.** DNS automatically creates public IP addresses
- **D.** All existing translations must instantly become encrypted

Basic dynamic address translation needs an available external address for a new allocation. Port translation changes resource sharing, but it is explicitly absent here. Existing sessions need not all terminate merely because a new allocation fails.

Referencia: https://www.rfc-editor.org/rfc/rfc3022.txt · 2.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 35. pat-explicit-allocation-model-capacity

ID: `ccna-original-20261026-b07-035` · Área: `ip_services` · Dificultad: `intermediate`

Un modelo PAT simplificado de un protocolo tiene tres IP públicas y 200 puertos origen disponibles por IP. Cada asignación consume una pareja única IP/puerto, sin reutilizar tuplas. ¿Cuál es el máximo del modelo?

- **A.** 200
- **B.** 65535
- **C.** 600
- **D.** 203

**Respuesta(s) propuesta(s): C.** El modelo tiene 3×200=600 parejas. La capacidad real depende también de mapeo de extremos, puertos reservados, memoria y plataforma; no es garantía de un equipo.

**English**

A simplified single-protocol PAT model has three public IPs and 200 available source ports per IP. Each mapping consumes one unique public-IP/port pair, with no tuple reuse. What is the mapping upper bound in this model?

- **A.** 200
- **B.** 65535
- **C.** 600
- **D.** 203

The declared model has 3×200=600 distinct pairs. Real NAT capacity also depends on endpoint mapping behavior, reserved ports, memory and platform constraints; the model is not a device guarantee.

Referencia: https://www.rfc-editor.org/rfc/rfc3022.txt · 2.2 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 36. ntp-leap-indicator-unsynchronized

ID: `ccna-original-20261026-b07-036` · Área: `ip_services` · Dificultad: `intermediate`

Una respuesta NTP tiene Leap Indicator=3. ¿Cómo se interpreta?

- **A.** El reloj no está sincronizado
- **B.** Se deben añadir exactamente tres segundos a todo timestamp
- **C.** El servidor necesariamente es más preciso que stratum 1
- **D.** El paquete debe usar puerto TCP 3

**Respuesta(s) propuesta(s): A.** NTP define indicador 3 como desconocido/reloj no sincronizado. Es un estado, no cantidad de desfase ni puerto.

**English**

An NTP reply has Leap Indicator=3. How should that status be interpreted?

- **A.** The clock is unsynchronized
- **B.** Exactly three seconds must be added to every timestamp
- **C.** The server is guaranteed more accurate than stratum 1
- **D.** The packet must use TCP port 3

NTP defines Leap Indicator 3 as unknown/clock unsynchronized. It is a status value, not an offset count or transport port.

Referencia: https://www.rfc-editor.org/rfc/rfc5905.txt · 7.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 37. dns-recursion-final-answer-versus-referral

ID: `ccna-original-20261026-b07-037` · Área: `ip_services` · Dificultad: `intermediate`

Un servidor DNS acepta hacer recursión para un cliente. ¿Cómo difiere el servicio previsto de devolver solo la siguiente referencia?

- **A.** Garantiza que todo nombre consultado existe
- **B.** Continúa la resolución y devuelve respuesta o error, en vez de exigir al cliente seguir cada referencia
- **C.** Convierte la consulta en LSA OSPF
- **D.** Elimina todos los TTL DNS

**Respuesta(s) propuesta(s): B.** La recursión resuelve en nombre del solicitante. Las respuestas iterativas pueden dar referencias; ningún modo garantiza respuesta positiva a todo nombre.

**English**

A recursive DNS server agrees to perform recursion for a client. How does the intended service differ from merely returning the next referral?

- **A.** It guarantees every queried name exists
- **B.** It pursues the resolution and returns an answer or error rather than requiring the client to follow each referral
- **C.** It changes the query into an OSPF LSA
- **D.** It removes all DNS TTL values

Recursive service carries out resolution on behalf of the requester. Iterative replies may instead supply referrals; neither mode guarantees a positive answer for every name.

Referencia: https://www.rfc-editor.org/rfc/rfc1034.txt · 4.3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 38. eap-tls-server-certificate-validation

ID: `ccna-original-20261026-b07-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una WLAN empresarial usa EAP-TLS. ¿Por qué el cliente debe validar el certificado del servidor en vez de aceptar cualquiera?

- **A.** Porque confiar en cualquier certificado ya prueba identidad
- **B.** Para autenticar al servidor previsto y resistir un extremo de autenticación no autorizado
- **C.** Para asignar automáticamente máscara IPv4
- **D.** Para convertir todo tráfico de radio en broadcast Ethernet

**Respuesta(s) propuesta(s): B.** La autenticación mutua por certificado depende de validar identidad y confianza. Aceptar cualquier certificado elimina esa garantía del servidor aunque se intercambien mensajes criptográficos.

**English**

An enterprise WLAN uses EAP-TLS. Why must a supplicant validate the authentication server certificate instead of accepting any certificate?

- **A.** Because trusting any certificate already proves identity
- **B.** To authenticate the intended server and resist an unauthorized authentication endpoint
- **C.** To allocate an IPv4 subnet mask automatically
- **D.** To turn all radio traffic into Ethernet broadcasts

Certificate-based mutual authentication depends on validating the peer identity and trust. Accepting arbitrary certificates removes that server-authentication assurance even if cryptographic messages are exchanged.

Referencia: https://www.rfc-editor.org/rfc/rfc9190.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 39. eap-tls-mutual-certificate-roles

ID: `ccna-original-20261026-b07-039` · Área: `security_fundamentals` · Dificultad: `basic`

¿Qué afirmación describe autenticación EAP-TLS basada en certificados?

- **A.** Es solo una cadena SSID compartida sin autenticación
- **B.** Admite autenticación mutua de cliente y servidor mediante certificados
- **C.** Exige que todo usuario comparta una única clave privada reutilizable
- **D.** Sustituye las métricas de routing IP

**Respuesta(s) propuesta(s): B.** EAP-TLS ofrece autenticación mutua por certificados y establecimiento de claves. El despliegue aún requiere ciclo de vida, confianza y políticas de autorización.

**English**

Which statement describes certificate-based EAP-TLS authentication?

- **A.** It is only a shared SSID string with no authentication
- **B.** It supports mutual authentication of peer and server using certificates
- **C.** It requires every user to share one reusable private key
- **D.** It is a replacement for IP routing metrics

EAP-TLS provides certificate-based mutual authentication and key establishment. Deployments still need certificate lifecycle, trust and authorization policies.

Referencia: https://www.rfc-editor.org/rfc/rfc9190.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 40. eap-does-not-require-ip-layer

ID: `ccna-original-20261026-b07-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

¿Un cliente debe obtener dirección IP antes de que EAP funcione sobre una capa de enlace IEEE 802?

- **A.** No; EAP puede funcionar sobre enlace sin requerir IP
- **B.** Sí; todo mensaje EAP debe pasar primero por DNS
- **C.** Sí; EAP es protocolo de routing IPv4
- **D.** No; EAP nunca autentica nada

**Respuesta(s) propuesta(s): A.** EAP puede funcionar sobre capas de enlace sin requerir IP. Obtener configuración IP es distinto de completar EAP; el método elegido mantiene sus propios requisitos.

**English**

Must a client obtain an IP address before EAP can operate over an IEEE 802 data-link layer?

- **A.** No; EAP can operate over a data-link layer without requiring IP
- **B.** Yes; every EAP message must first pass through DNS
- **C.** Yes; EAP is an IPv4 routing protocol
- **D.** No; because EAP never authenticates anything

EAP can run directly over data-link layers without requiring IP. Obtaining an IP configuration is separate from completing an EAP exchange; the selected method still has its own requirements.

Referencia: https://www.rfc-editor.org/rfc/rfc3748.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. accountability-individual-admin-identities

ID: `ccna-original-20261026-b07-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un equipo necesita atribuir cambios a operadores individuales. ¿Qué desventaja directa tiene que todos usen la misma cuenta de administrador?

- **A.** Los logs de cuenta por sí solos no distinguen de forma fiable a la persona que usó la identidad compartida
- **B.** Una cuenta compartida garantiza mayor atribución individual
- **C.** Toda cuenta compartida deshabilita automáticamente el cifrado
- **D.** El router debe dejar de reenviar IP

**Respuesta(s) propuesta(s): A.** La rendición de cuentas exige poder atribuir acciones a una entidad. Identidades individuales y auditoría ayudan; una identidad compartida limita lo que prueba por sí solo el registro de cuenta.

**English**

A team needs to trace administrative changes to individual operators. What is the direct drawback of everyone using one shared administrator account?

- **A.** Account logs alone cannot reliably distinguish which individual used the shared identity
- **B.** A shared account guarantees stronger individual accountability
- **C.** Every shared account automatically disables encryption
- **D.** The router must stop forwarding IP packets

Accountability requires actions to be traceable to an entity. Individual identities and suitable audit records support attribution; one shared identity weakens what the account record alone can establish.

Referencia: https://www.rfc-editor.org/rfc/rfc4949.txt · accountability · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 42. ipv4-acl-host-shorthand

ID: `ccna-original-20261026-b07-042` · Área: `security_fundamentals` · Dificultad: `basic`

En una ACL IPv4 IOS, ¿qué coincidencia expresa host 192.0.2.20?

- **A.** Solo una MAC multicast Ethernet
- **B.** Todo origen IPv4 posible
- **C.** Toda 192.0.2.0/24 con wildcard 0.0.0.255
- **D.** 192.0.2.20 con wildcard 0.0.0.0

**Respuesta(s) propuesta(s): D.** host indica coincidencia exacta de una IPv4, equivalente a wildcard cero. No significa toda dirección de su subred.

**English**

In an IOS IPv4 ACL, what address match does host 192.0.2.20 express?

- **A.** Only the Ethernet multicast MAC address
- **B.** Every possible IPv4 source
- **C.** The whole 192.0.2.0/24 with wildcard 0.0.0.255
- **D.** 192.0.2.20 with wildcard 0.0.0.0

The host keyword denotes an exact IPv4 address match, equivalent to a zero wildcard. It does not mean every address in the host subnet.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · ACL Examples · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 43. standard-acl-source-only-placement-effect

ID: `ccna-original-20261026-b07-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL estándar solo por origen cerca del emisor lo deniega antes de que el tráfico se separe hacia varios destinos. ¿Por qué puede incumplir una política que solo bloquea un destino?

- **A.** El routing ignora automáticamente toda ACL estándar
- **B.** El origen siempre se vuelve un nombre DNS
- **C.** No distingue el destino y puede bloquear también tráfico permitido a otros destinos
- **D.** Las ACL estándar cifran todo destino

**Respuesta(s) propuesta(s): C.** Una coincidencia solo por origen no tiene condición de destino. Ubicación y tipo de ACL deben respetar la política; un requisito por destino puede requerir ACL extendida.

**English**

A source-only standard ACL near a sender denies that sender before traffic can branch toward several destinations. Why can this violate a policy intended to block only one destination?

- **A.** Routing automatically ignores every standard ACL
- **B.** The source address always becomes a DNS name
- **C.** It cannot distinguish the destination and can block permitted traffic to other destinations too
- **D.** Standard ACLs encrypt all destination addresses

A source-only match has no destination condition. Placement and ACL type must preserve the actual policy; a destination-specific requirement may call for an extended ACL rather than a blanket source block.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · Standard and Extended ACLs · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. api-authorization-server-enforcement

ID: `ccna-original-20261026-b07-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una GUI de gestión oculta Eliminar al usuario de solo lectura. ¿Por qué la API aún debe verificar autorización de solicitudes DELETE?

- **A.** El servidor debe confiar en toda solicitud con JSON
- **B.** Un cliente puede enviar la solicitud directamente; ocultar un control no decide autorización en servidor
- **C.** La visibilidad GUI cifra todo paquete no autorizado
- **D.** HTTP nunca permite solicitudes directas

**Respuesta(s) propuesta(s): B.** Autorizar decide si una entidad puede ejecutar una operación. El servicio debe imponerlo; los controles de presentación no limitan clientes independientes.

**English**

A network-management GUI hides its Delete button from a read-only user. Why must the API still enforce authorization on DELETE requests?

- **A.** The server should trust any request containing JSON
- **B.** A client can submit a request directly; hiding a control is not an authorization decision at the server
- **C.** GUI visibility encrypts every unauthorized packet
- **D.** HTTP never permits direct requests

Authorization determines whether an entity may perform an operation. The service must enforce that decision; presentation controls alone do not constrain independent clients.

Referencia: https://www.rfc-editor.org/rfc/rfc2904.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 45. leaked-oauth-token-revocation

ID: `ccna-original-20261026-b07-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un token de acceso se expone en un repositorio público. El servidor admite revocación. ¿Por qué no basta borrar la línea del repositorio?

- **A.** Ya puede haber copias; hay que revocar el token expuesto y sustituirlo por el proceso autorizado
- **B.** Borrar texto invalida automáticamente todo token en el emisor
- **C.** El servidor debe publicar otra vez el token para confirmarlo
- **D.** El token se vuelve seguro al renombrar una variable

**Respuesta(s) propuesta(s): A.** La revocación invalida la credencial en el servicio. Quitar una copia visible no elimina otras copias ni impide usarlas mientras siga válida.

**English**

An access token is exposed in a public repository. The authorization server supports token revocation. Why is deleting the repository line alone insufficient?

- **A.** Copies may already exist; revoke the exposed token and replace it through the authorized process
- **B.** Deleting text automatically invalidates every token at its issuer
- **C.** The server must publish the token again to confirm it
- **D.** The token becomes safe if renamed in a local variable

Revocation invalidates the credential at the authorization service. Removing one visible copy does not remove copies or prevent their use while the credential remains valid.

Referencia: https://www.rfc-editor.org/rfc/rfc7009.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. sdn-northbound-and-device-facing-interfaces

ID: `ccna-original-20261026-b07-046` · Área: `automation_programmability` · Dificultad: `intermediate`

¿Qué dos roles distinguen correctamente interfaces de un controlador SDN? Selecciona dos.

- **A.** Las interfaces hacia aplicaciones permiten interactuar con abstracciones del controlador
- **B.** Las interfaces de control hacia equipos conectan funciones del controlador con dispositivos de reenvío
- **C.** Toda interfaz southbound debe ser un registro MX DNS
- **D.** Toda interfaz northbound debe ser un puerto de acceso Ethernet

**Respuesta(s) propuesta(s): A, B.** SDN separa abstracciones de aplicación, control y reenvío. Los roles de interfaz no exigen un protocolo universal ni un conector físico único.

**English**

Which two role descriptions correctly distinguish controller interfaces in an SDN model? Select two.

- **A.** Application-facing interfaces let applications interact with controller abstractions
- **B.** Device-facing control interfaces connect controller functions to forwarding devices
- **C.** Every southbound interface must be a DNS MX record
- **D.** Every northbound interface must be an Ethernet access port

SDN separates application abstractions, control functions and forwarding. Interface roles do not require one universal protocol or one physical connector.

Referencia: https://www.rfc-editor.org/rfc/rfc7426.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 47. logical-controller-centralization-not-single-box

ID: `ccna-original-20261026-b07-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Un diseño describe control lógicamente centralizado. ¿Eso por sí solo exige un controlador físico sin redundancia?

- **A.** Sí; centralización lógica y física son requisitos idénticos
- **B.** No; el control lógico puede implementarse con componentes distribuidos o agrupados
- **C.** No; los controladores nunca mantienen estado
- **D.** Sí; redundancia es incompatible con todo controlador

**Respuesta(s) propuesta(s): B.** NVO3 permite control agrupado que aparece lógicamente centralizado. La organización lógica no obliga a un único equipo físico sin redundancia.

**English**

A network design describes logically centralized control. Does that phrase alone require one physical controller with no redundancy?

- **A.** Yes; logical and physical centralization are identical requirements
- **B.** No; logical control can be implemented by distributed or clustered components
- **C.** No; because controllers never maintain state
- **D.** Yes; redundancy is incompatible with any controller

The NVO3 framework explicitly permits clustered control appearing logically centralized. Logical service organization does not prescribe one failure-prone physical box.

Referencia: https://www.rfc-editor.org/rfc/rfc7365.txt · Network Virtualization Authority control implementation · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 48. intent-declarative-outcome-versus-steps

ID: `ccna-original-20261026-b07-048` · Área: `automation_programmability` · Dificultad: `intermediate`

¿Qué solicitud expresa mejor una intención que una secuencia de comandos de equipo?

- **A.** Send one specific CLI keystroke every segundo
- **B.** Entrar a G0/1 y escribir comandos exactos en orden exacto
- **C.** Copiar un prompt sin indicar resultado deseado
- **D.** Mantener aislado el tráfico de aplicación indicado entre los grupos de clientes nombrados

**Respuesta(s) propuesta(s): D.** La intención expresa resultados y restricciones sin prescribir pasos de implementación. Sigue necesitando interpretación, validación y verificación; expresarla no prueba que se cumpla.

**English**

Which request best expresses an intent rather than a device-specific command sequence?

- **A.** Send one specific CLI keystroke every second
- **B.** Enter interface G0/1, then type these exact commands in this exact order
- **C.** Copy a console prompt without stating a desired outcome
- **D.** Keep the specified application traffic isolated between the named tenant groups

Intent states desired outcomes and constraints without prescribing the implementation steps. It still needs interpretation, validation and assurance; wording an outcome alone does not prove it is achieved.

Referencia: https://www.rfc-editor.org/rfc/rfc9315.txt · 2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. json-duplicate-object-member-interoperability

ID: `ccna-original-20261026-b07-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Una carga de configuración contiene {"mtu":1500,"mtu":9000}. ¿Por qué debe rechazarse o normalizarse antes de confiar en un valor?

- **A.** Ambos valores se vuelven puertos TCP automáticamente
- **B.** JSON exige sumar nombres duplicados aritméticamente
- **C.** Todo parser debe elegir 1500 sin excepción
- **D.** Distintos receptores pueden tratar diferente los nombres duplicados y el valor pretendido es ambiguo

**Respuesta(s) propuesta(s): D.** RFC 8259 recomienda nombres únicos y describe comportamientos distintos ante duplicados. Validar un esquema no debe suponer silenciosamente una interpretación única.

**English**

A configuration payload contains {"mtu":1500,"mtu":9000}. Why should automation reject or normalize this before relying on a value?

- **A.** Both values become TCP ports automatically
- **B.** JSON requires duplicate names to be added arithmetically
- **C.** Every parser must choose 1500 without exception
- **D.** Duplicate object names can be handled differently by receivers, so the intended value is ambiguous

RFC 8259 says object names should be unique and explains differing receiver behavior when they are not. Validating a schema should not silently assume one duplicate-key interpretation.

Referencia: https://www.rfc-editor.org/rfc/rfc8259.txt · 4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. http-safe-request-methods

ID: `ccna-original-20261026-b07-050` · Área: `automation_programmability` · Dificultad: `intermediate`

Según la semántica HTTP estándar, ¿qué dos métodos son seguros en el sentido de no solicitar una acción que cambie estado? Selecciona dos.

- **A.** HEAD
- **B.** GET
- **C.** PUT
- **D.** POST

**Respuesta(s) propuesta(s): A, B.** GET y HEAD tienen semántica prevista segura. El servidor puede registrar solicitudes; seguridad semántica trata la operación solicitada y difiere de idempotencia o confidencialidad.

**English**

Under standard HTTP method semantics, which two methods are defined as safe, meaning they do not request a state-changing action? Select two.

- **A.** HEAD
- **B.** GET
- **C.** PUT
- **D.** POST

GET and HEAD have safe intended semantics. Servers can still log requests; safety concerns the requested operation and is distinct from idempotence or confidentiality.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 9.2.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.
