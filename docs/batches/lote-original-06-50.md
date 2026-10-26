# Lote original: original-20261026-b06-50

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

## 1. sfp-10g-sr-multimode-medium

ID: `ccna-original-20261026-b06-001` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un ingeniero elige un SFP Cisco 10GBASE-SR para un enlace compatible. ¿Qué medio y longitud de onda nominal corresponden?

- **A.** Un cable de consola serial
- **B.** Fibra multimodo a 850 nm
- **C.** Par trenzado de cobre a 850 nm
- **D.** Solo fibra monomodo a 1550 nm

**Respuesta(s) propuesta(s): B.** Las ópticas 10GBASE-SR usan 850 nm y fibra multimodo. El alcance depende del tipo de fibra y la óptica exacta; el nombre no garantiza cualquier distancia.

**English**

An engineer selects a Cisco 10GBASE-SR SFP for a supported fiber link. Which medium and nominal wavelength match this optic family?

- **A.** A serial console cable
- **B.** Multimode fiber at 850 nm
- **C.** Twisted-pair copper at 850 nm
- **D.** Single-mode fiber only at 1550 nm

10GBASE-SR optics use 850 nm with multimode fiber. Supported reach depends on the fiber grade and exact optic; the family name alone does not guarantee every distance.

Referencia: https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/data_sheet_c78-455693.html · 10GBASE-SR modules · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 2. sfp-10g-lr-single-mode-medium

ID: `ccna-original-20261026-b06-002` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un SFP Cisco 10GBASE-LR compatible usa fibra monomodo estándar. ¿Qué longitud de onda nominal asocia la ficha con esta familia?

- **A.** 1310 nm
- **B.** 650 nm
- **C.** 850 nm
- **D.** 1550 nm

**Respuesta(s) propuesta(s): A.** La tabla Cisco indica 10GBASE-LR a 1310 nm sobre fibra monomodo. Una instalación real requiere comprobar compatibilidad, fibra y presupuesto óptico.

**English**

A supported Cisco 10GBASE-LR SFP is used on standard single-mode fiber. Which nominal wavelength is associated with this family in the datasheet?

- **A.** 1310 nm
- **B.** 650 nm
- **C.** 850 nm
- **D.** 1550 nm

The Cisco table lists 10GBASE-LR optics at 1310 nm on single-mode fiber. Module compatibility, fiber type and optical budget still require checking for an actual installation.

Referencia: https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/data_sheet_c78-455693.html · 10GBASE-LR modules · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 3. copper-gigabit-channel-length-limit

ID: `ccna-original-20261026-b06-003` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un Cisco SFP-10G-T-X opera a 1 Gbps por Categoría 5e adecuada en plataforma compatible. ¿Qué alcance máximo de canal indica su ficha para esa velocidad?

- **A.** 1000 m
- **B.** 10 km
- **C.** 550 m
- **D.** 100 m

**Respuesta(s) propuesta(s): D.** La ficha indica hasta 100 m para SFP-10G-T-X a 100 Mbps/1 Gbps con Cat5e o superior adecuada. El alcance a 10 Gbps es otra entrada y no debe suponerse igual.

**English**

A Cisco SFP-10G-T-X operates at 1 Gbps over suitable Category 5e cabling on a supported platform. What maximum channel reach does its datasheet list for that rate?

- **A.** 1000 m
- **B.** 10 km
- **C.** 550 m
- **D.** 100 m

The datasheet lists up to 100 m for SFP-10G-T-X at 100 Mbps/1 Gbps with suitable Cat5e or better. Its 10 Gbps reach is a separate entry and must not be assumed identical.

Referencia: https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/data_sheet_c78-455693.html · SFP-10G-T-X copper reach · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 4. ethernet-ii-ipv4-ethertype

ID: `ccna-original-20261026-b06-004` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una captura Ethernet II tiene Type 0x0800. ¿Qué carga de capa de red identifica ese valor?

- **A.** Un formato Ethernet exclusivo de DNS
- **B.** IPv4
- **C.** ARP
- **D.** IPv6

**Respuesta(s) propuesta(s): B.** RFC 894 asigna Type hexadecimal 0800 al encapsulado IP versión 4. ARP e IPv6 usan otros valores; Type no es un puerto TCP.

**English**

An Ethernet II capture has Type 0x0800. Which network-layer payload does that value identify?

- **A.** A native DNS-only Ethernet format
- **B.** IPv4
- **C.** ARP
- **D.** IPv6

RFC 894 assigns Ethernet Type hexadecimal 0800 to IP version 4 encapsulation. ARP and IPv6 have different EtherType values; Type is not a TCP port.

Referencia: https://www.rfc-editor.org/rfc/rfc894.txt · Protocol Type · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 5. ethernet-minimum-data-padding

ID: `ccna-original-20261026-b06-005` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una trama Ethernet II lleva como única carga un datagrama IPv4 de 28 octetos. Ethernet exige al menos 46 octetos de campo de datos. ¿Cuántos octetos de relleno faltan, sin cabeceras ni FCS?

- **A.** 64
- **B.** 18
- **C.** 46
- **D.** 28

**Respuesta(s) propuesta(s): B.** El relleno es 46−28=18 octetos. No integra la longitud del datagrama IPv4; cabeceras Ethernet y FCS quedan fuera del campo de datos calculado.

**English**

An Ethernet II frame carries a 28-octet IPv4 datagram as its only payload. Ethernet requires at least 46 data-field octets. How many padding octets are needed, excluding headers and FCS?

- **A.** 64
- **B.** 18
- **C.** 46
- **D.** 28

Padding is 46−28=18 octets. The padding is not part of the IPv4 datagram length, and Ethernet headers or FCS are outside the data field in this calculation.

Referencia: https://www.rfc-editor.org/rfc/rfc894.txt · Frame Format · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 6. tcp-data-offset-header-size

ID: `ccna-original-20261026-b06-006` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una cabecera TCP tiene Data Offset=7. ¿Cuál es su longitud, incluidas las opciones?

- **A.** 7 bytes
- **B.** 28 bytes
- **C.** 56 bytes
- **D.** 20 bytes

**Respuesta(s) propuesta(s): B.** Data Offset TCP cuenta palabras de 32 bits, de cuatro bytes. Siete palabras equivalen a 28 bytes, no a siete bytes ni a siete palabras de 64 bits.

**English**

A TCP header has Data Offset=7. What is the TCP header length, including options?

- **A.** 7 bytes
- **B.** 28 bytes
- **C.** 56 bytes
- **D.** 20 bytes

TCP Data Offset counts 32-bit words, each four bytes. Seven words therefore mean 28 bytes, not seven bytes or seven 64-bit words.

Referencia: https://www.rfc-editor.org/rfc/rfc9293.txt · 3.1 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 7. ipv6-hop-limit-not-wall-clock

ID: `ccna-original-20261026-b06-007` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un paquete IPv6 reenviado espera varios segundos en una cola sin cruzar otro router. ¿Hop Limit mide por sí mismo esos segundos?

- **A.** Sí; sus unidades siempre son milisegundos
- **B.** Sí; TTL DNS y Hop Limit IPv6 son el mismo campo
- **C.** No; IPv6 no tiene campo para limitar bucles
- **D.** No; limita saltos de reenvío y no representa una cuenta de segundos

**Respuesta(s) propuesta(s): D.** Los nodos que reenvían decrementan Hop Limit IPv6. Limita saltos; no es la vida de una caché DNS ni un temporizador de cola por segundo.

**English**

A forwarded IPv6 packet waits several seconds in a queue without crossing another router. Does Hop Limit itself measure those elapsed seconds?

- **A.** Yes; its units are always milliseconds
- **B.** Yes; DNS TTL and IPv6 Hop Limit are identical fields
- **C.** No; IPv6 has no loop-limiting header field
- **D.** No; it limits forwarding hops rather than representing a wall-clock countdown

IPv6 Hop Limit is decremented by forwarding nodes. It is a hop bound, not the DNS cache lifetime or a per-second queue timer.

Referencia: https://www.rfc-editor.org/rfc/rfc8200.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 8. poe-budget-device-count

ID: `ccna-original-20261026-b06-008` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un switch dispone de 120 W de presupuesto PoE tras reservas. Cada equipo requiere asignar 30 W en el switch. Ignora otros límites. ¿Cuántos equipos pueden admitirse?

- **A.** 30
- **B.** 120
- **C.** 4
- **D.** 8

**Respuesta(s) propuesta(s): C.** El presupuesto admite floor(120/30)=4 equipos. Los valores son asignaciones en el switch; no se iguala una clase PoE con potencia recibida tras pérdidas del cable.

**English**

A switch has 120 W of available PoE allocation budget after reserves. Each selected device requires a 30 W allocation at the switch. Ignore all other limits. How many such devices can be admitted?

- **A.** 30
- **B.** 120
- **C.** 4
- **D.** 8

The allocation budget admits floor(120/30)=4 devices. The stated values are switch-side allocations; the question does not equate a PoE class rating with power delivered after cable losses.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_poe.html · Power Management · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 9. poe-pse-versus-pd-roles

ID: `ccna-original-20261026-b06-009` · Área: `network_fundamentals` · Dificultad: `intermediate`

Un switch PoE alimenta un teléfono IP por Ethernet. ¿Qué pareja de roles es correcta?

- **A.** Switch: equipo que suministra potencia; teléfono: dispositivo alimentado
- **B.** El teléfono debe proporcionar potencia OSPF al switch
- **C.** Ambos son servidores DNS por definición
- **D.** Switch: dispositivo alimentado; teléfono: equipo que suministra potencia

**Respuesta(s) propuesta(s): A.** El PSE suministra potencia y el PD la recibe. La compatibilidad concreta depende también de negociación, capacidad del puerto y presupuesto.

**English**

A PoE switch powers an IP phone through Ethernet. Which role pairing is correct?

- **A.** Switch: power-sourcing equipment; phone: powered device
- **B.** The phone must provide OSPF power to the switch
- **C.** Both roles are DNS servers by definition
- **D.** Switch: powered device; phone: power-sourcing equipment

The PSE supplies power and the PD receives it. Whether an exact device is supported also depends on negotiation, port capability and budget.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_poe.html · Power over Ethernet · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 10. ethernet-error-counter-diagnostic-limit

ID: `ccna-original-20261026-b06-010` · Área: `network_fundamentals` · Dificultad: `intermediate`

Una interfaz Ethernet acumula errores FCS. ¿Qué respuesta se justifica solo por ese síntoma?

- **A.** Declarar demostrado un fallo DNS
- **B.** Investigar medio físico, interfaces y ajustes; el contador no demuestra por sí solo una causa única
- **C.** Ignorarlos porque FCS valida políticas de routing IP
- **D.** Suponer que todo error necesariamente se debe a autenticación OSPF

**Respuesta(s) propuesta(s): B.** Los errores FCS indican tramas dañadas en recepción. Cableado, hardware y ajustes del enlace son posibilidades; un solo contador no determina por completo la causa.

**English**

An Ethernet interface accumulates FCS errors. Which response is justified by that symptom alone?

- **A.** Declare the DNS server definitively broken
- **B.** Investigate physical media, interfaces and link settings; the counter alone does not prove one unique cause
- **C.** Ignore the errors because FCS validates IP routing policy
- **D.** Assume every error is necessarily caused by OSPF authentication

FCS errors indicate damaged frames at the receiver. Cabling, hardware and link-setting problems are among the possibilities; a single counter is not a complete root-cause diagnosis.

Referencia: https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html · Troubleshoot Ethernet · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 11. stp-blocking-port-bpdu-reception

ID: `ccna-original-20261026-b06-011` · Área: `network_access` · Dificultad: `intermediate`

Un puerto STP IEEE 802.1D clásico está en blocking. ¿Qué comportamiento se espera?

- **A.** Debe reenviar inmediatamente todas las tramas de usuario
- **B.** Puede recibir BPDU mientras bloquea el reenvío normal de datos
- **C.** Necesariamente perdió enlace eléctrico
- **D.** Es una interfaz pasiva OSPF

**Respuesta(s) propuesta(s): B.** Blocking es un estado de reenvío spanning tree, no prueba de interfaz física caída. Se siguen procesando BPDU para evitar bucles.

**English**

A legacy IEEE 802.1D STP port is in blocking state. Which behavior is expected?

- **A.** It must forward all user frames immediately
- **B.** It can receive BPDUs while ordinary user-data forwarding is blocked
- **C.** It has necessarily lost electrical link
- **D.** It is an OSPF passive interface

Blocking is a spanning-tree forwarding state, not proof that the physical interface is down. BPDU processing continues to support loop prevention.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Interface States · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 12. legacy-stp-learning-versus-listening

ID: `ccna-original-20261026-b06-012` · Área: `network_access` · Dificultad: `intermediate`

En STP 802.1D clásico un puerto pasa de listening a learning antes de forwarding. ¿Qué actividad nueva permite learning mientras sigue bloqueado el reenvío de usuarios?

- **A.** Reenviar sin restricciones todos los paquetes de usuario
- **B.** Convertir el puerto físico en consola serial
- **C.** Originar zonas DNS para todas las VLAN
- **D.** Aprender MAC origen para la base de reenvío

**Respuesta(s) propuesta(s): D.** Learning incorpora información MAC mientras retrasa el reenvío normal. Listening no realiza ese aprendizaje de origen. Se trata del modelo STP clásico.

**English**

In legacy 802.1D STP, a port transitions from listening to learning before forwarding. What new activity becomes possible in learning while user forwarding is still blocked?

- **A.** Forwarding every user packet without restriction
- **B.** Turning the physical port into a serial console
- **C.** Originating DNS zones for all VLANs
- **D.** Learning source MAC addresses for the forwarding database

The learning state populates MAC information while delaying normal frame forwarding. Listening does not perform that source-address learning. This is the legacy STP state model.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Interface States · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 13. root-bridge-no-root-port

ID: `ccna-original-20261026-b06-013` · Área: `network_access` · Dificultad: `intermediate`

Un switch es el puente raíz elegido de una instancia STP estable. ¿Cuántos puertos raíz tiene en esa instancia?

- **A.** 1
- **B.** 0
- **C.** Uno por cada troncal VLAN activo
- **D.** 2

**Respuesta(s) propuesta(s): B.** El puente raíz es la referencia y no tiene puerto raíz hacia sí mismo. Los puentes no raíz eligen un puerto raíz; los roles se evalúan por instancia.

**English**

A switch is the elected root bridge for one stable STP instance. How many root ports does that bridge have in that instance?

- **A.** 1
- **B.** 0
- **C.** One per active VLAN trunk
- **D.** 2

The root bridge is the reference point and has no root port toward itself. Non-root bridges select a root port; roles are evaluated per spanning-tree instance.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_spanning_tree_protocol.html · Root Bridge · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 14. lacp-system-priority-selection

ID: `ccna-original-20261026-b06-014` · Área: `network_access` · Dificultad: `intermediate`

Dos sistemas LACP tienen prioridades de sistema 100 y 200. En la comparación de system ID LACP, ¿qué valor tiene precedencia?

- **A.** 200
- **B.** 100
- **C.** Ambos siempre son inválidos
- **D.** El sistema físicamente más rápido sin importar prioridad

**Respuesta(s) propuesta(s): B.** Una prioridad de sistema LACP menor tiene mayor precedencia; la MAC desempata prioridades iguales. No es el orden de prioridad de elección DR OSPF.

**English**

Two LACP systems have different system priorities, 100 and 200. In the LACP system-ID comparison, which priority value has precedence?

- **A.** 200
- **B.** 100
- **C.** Both are always invalid
- **D.** The physically faster system regardless of priority

A lower LACP system priority has higher selection priority; the MAC address breaks an equal-priority system-ID tie. This is not OSPF DR priority ordering.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · LACP System Priority · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 15. etherchannel-member-summary-p-flag

ID: `ccna-original-20261026-b06-015` · Área: `network_access` · Dificultad: `intermediate`

La leyenda Cisco de show etherchannel summary indica P = bundled in port-channel e I = stand-alone. Un miembro aparece como Gi1/0/1(P). ¿Qué establece P?

- **A.** La interfaz está integrada en el port-channel
- **B.** La interfaz es un servidor DNS primario
- **C.** La interfaz es un vecino pasivo OSPF
- **D.** La interfaz necesariamente es un enlace independiente

**Respuesta(s) propuesta(s): A.** La leyenda dada define P como integrado en el canal. Identifica membresía; por sí sola no prueba acceso de aplicación ni suma ancho de banda para un único flujo.

**English**

A Cisco show etherchannel summary legend states P = bundled in port-channel and I = stand-alone. A member is displayed as Gi1/0/1(P). What does the displayed P establish?

- **A.** The interface is bundled in the port-channel
- **B.** The interface is a DNS primary server
- **C.** The interface is an OSPF passive neighbor
- **D.** The interface is necessarily an independent stand-alone link

The supplied command legend explicitly defines P as bundled. It identifies membership status; it does not by itself prove application reachability or sum single-flow throughput.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/lyr2/b_1715_lyr2_9300_cg/configuring_etherchannels.html · Monitoring EtherChannel · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 16. native-vlan-and-allowed-list-independent

ID: `ccna-original-20261026-b06-016` · Área: `network_access` · Dificultad: `intermediate`

Un troncal 802.1Q usa VLAN nativa 99 y permite 10, 20 y 99. Las tres están activas y en reenvío. Con comportamiento nativo normal y sin función explícita de etiquetado nativo, ¿cuáles se transmiten etiquetadas? Selecciona dos.

- **A.** VLAN 10
- **B.** VLAN 20
- **C.** VLAN 99
- **D.** VLAN 30

**Respuesta(s) propuesta(s): A, B.** Con el comportamiento predeterminado indicado, VLAN 99 nativa va sin etiqueta y las permitidas 10 y 20 van etiquetadas. VLAN 30 no está permitida. Lista permitida y clasificación nativa son ajustes distintos.

**English**

An 802.1Q trunk uses native VLAN 99 and allows VLANs 10, 20 and 99. All three are active and forwarding. With ordinary native-VLAN behavior and no explicit native-tagging feature, which two VLANs are transmitted tagged? Select two.

- **A.** VLAN 10
- **B.** VLAN 20
- **C.** VLAN 99
- **D.** VLAN 30

Under the stated default behavior, the native VLAN 99 is untagged and allowed VLANs 10 and 20 are tagged. VLAN 30 is not allowed. The allowed list and native classification are different settings.

Referencia: https://www.cisco.com/c/en/us/support/docs/lan-switching/8021q/17056-741-4.html · IEEE 802.1Q · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 17. trunk-allowed-add-versus-replace

ID: `ccna-original-20261026-b06-017` · Área: `network_access` · Dificultad: `intermediate`

Un troncal permite VLAN 10 y 20. Se desea conservar ambas y añadir VLAN 40. ¿Qué comando expresa ese cambio?

- **A.** switchport trunk allowed vlan add 40
- **B.** no vlan 10
- **C.** switchport access vlan 40
- **D.** switchport trunk allowed vlan 40

**Respuesta(s) propuesta(s): A.** add modifica el conjunto permitido existente. Especificar solo vlan 40 reemplaza el conjunto por esa lista y puede retirar las VLAN 10 y 20.

**English**

A trunk currently allows VLANs 10 and 20. The operator wants to preserve both and add VLAN 40. Which command expresses that change?

- **A.** switchport trunk allowed vlan add 40
- **B.** no vlan 10
- **C.** switchport access vlan 40
- **D.** switchport trunk allowed vlan 40

The add keyword modifies the existing allowed set. Specifying only vlan 40 replaces the set with that list, potentially removing VLANs 10 and 20.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Allowed VLANs · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 18. svi-autostate-exclude-not-disable-switching

ID: `ccna-original-20261026-b06-018` · Área: `network_access` · Dificultad: `intermediate`

Un puerto de capa 2 tiene switchport autostate exclude. ¿Cuál es el efecto previsto?

- **A.** Convertir todos los hosts conectados a solo IPv6
- **B.** Deshabilitar automáticamente la interfaz física
- **C.** Excluirlo del cálculo de estado de línea de la SVI, en lugar de deshabilitar su función normal de switching
- **D.** Eliminar la VLAN de la base del switch

**Respuesta(s) propuesta(s): C.** La exclusión cambia si un puerto contribuye al cálculo de estado de la SVI. No es un comando shutdown ni de eliminación VLAN.

**English**

A Layer 2 port is configured with switchport autostate exclude. What is the intended effect of that setting?

- **A.** Convert every connected host to IPv6-only
- **B.** Automatically disable the physical interface
- **C.** Exclude the port from determining SVI line state, rather than disabling its ordinary switching role
- **D.** Delete the VLAN from the switch database

Autostate exclusion changes whether a port contributes to SVI line-state calculation. It is not a shutdown command or VLAN-deletion command.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/int_hw/b_1715_int_and_hw_9300_cg/configuring_interface_characteristics.html · SVI Autostate Exclude · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 19. clear-dynamic-mac-not-vlan-configuration

ID: `ccna-original-20261026-b06-019` · Área: `network_access` · Dificultad: `intermediate`

Un operador borra entradas MAC dinámicas para diagnosticar switching. ¿Qué debe distinguirse de esa operación?

- **A.** Eliminar la configuración VLAN; las entradas dinámicas pueden reaprenderse con nuevas tramas
- **B.** Borrar automáticamente todas las asignaciones VLAN de interfaces
- **C.** Convertir toda IPv4 en broadcast
- **D.** Deshabilitar permanentemente todos los puertos Ethernet

**Respuesta(s) propuesta(s): A.** Borrar entradas dinámicas retira asociaciones aprendidas, no la configuración VLAN. El tráfico posterior de origen puede poblar de nuevo la tabla.

**English**

An operator clears dynamic MAC entries to troubleshoot switching. What should remain distinct from this operation?

- **A.** Deleting VLAN configuration; dynamic MAC entries can be relearned from subsequent frames
- **B.** Automatically erasing all interface VLAN assignments
- **C.** Changing every IPv4 address into a broadcast
- **D.** Permanently disabling every Ethernet port

Clearing dynamic forwarding entries removes learned mappings, not the VLAN configuration. Subsequent source traffic can populate the table again.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sys_mgmt/b_1715_sys_mgmt_9300_cg/administering_the_device.html · Removing Dynamic Address Entries · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 20. trunk-allowed-set-after-add

ID: `ccna-original-20261026-b06-020` · Área: `network_access` · Dificultad: `intermediate`

Un troncal permite {10,20}. Una operación add de {20,40} conserva las VLAN existentes. ¿Qué dos VLAN quedan permitidas además de VLAN 20? Selecciona dos.

- **A.** VLAN 40
- **B.** VLAN 50
- **C.** VLAN 10
- **D.** VLAN 30

**Respuesta(s) propuesta(s): A, C.** Añadir conjuntos forma la unión {10,20,40}; añadir 20 dos veces no crea otra VLAN. Excluir 20 de la respuesta pedida deja 10 y 40.

**English**

A trunk allows {10,20}. Applying an add operation for {20,40} preserves existing VLANs. Which two VLANs remain allowed besides VLAN 20? Select two.

- **A.** VLAN 40
- **B.** VLAN 50
- **C.** VLAN 10
- **D.** VLAN 30

Adding sets forms the union {10,20,40}; adding 20 twice does not create another VLAN. Excluding 20 from the requested answer leaves 10 and 40.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/vlan/b_1715_vlan_9300_cg/configuring_vlan_trunks.html · Allowed VLANs · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 21. ospf-equal-minimum-path-set

ID: `ccna-original-20261026-b06-021` · Área: `ip_connectivity` · Dificultad: `intermediate`

Tres rutas intraárea OSPF elegibles al mismo prefijo tienen costos A=[3,4], B=[2,5], C=[4,4]. El límite de caminos permite ambas ganadoras. ¿Cuáles dos tienen costo mínimo igual? Selecciona dos.

- **A.** B
- **B.** A
- **C.** C
- **D.** Ninguna

**Respuesta(s) propuesta(s): A, B.** Los totales son A=7, B=7 y C=8. Con tipo, prefijo y elegibilidad iguales, A y B forman el conjunto mínimo; no se deduce una suma de velocidades.

**English**

Three eligible OSPF intra-area paths to the same prefix have link costs A=[3,4], B=[2,5], C=[4,4]. Maximum-path settings permit both winners. Which two are equal least-cost paths? Select two.

- **A.** B
- **B.** A
- **C.** C
- **D.** None

The totals are A=7, B=7 and C=8. Given equal route type, prefix and eligibility, A and B form the least-cost set; no sum of link speeds is inferred.

Referencia: https://www.rfc-editor.org/rfc/rfc2328.txt · 16.8 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 22. ospf-network-wildcard-interface-set

ID: `ccna-original-20261026-b06-022` · Área: `ip_connectivity` · Dificultad: `intermediate`

Una sentencia network OSPF IOS compara 10.8.0.0 con wildcard 0.0.0.255. Hay G0/0=10.8.0.1, G0/1=10.8.0.200, G0/2=10.8.1.1 y G0/3=10.9.0.1. ¿Qué dos direcciones coinciden? Selecciona dos.

- **A.** 10.8.0.1
- **B.** 10.8.1.1
- **C.** 10.8.0.200
- **D.** 10.9.0.1

**Respuesta(s) propuesta(s): A, C.** La wildcard ignora solo el último octeto; los tres primeros deben ser 10.8.0. Selecciona interfaces locales, no un filtro de anuncios.

**English**

An IOS OSPF network statement matches 10.8.0.0 with wildcard 0.0.0.255. Local interfaces have G0/0=10.8.0.1, G0/1=10.8.0.200, G0/2=10.8.1.1 and G0/3=10.9.0.1. Which two interface addresses match? Select two.

- **A.** 10.8.0.1
- **B.** 10.8.1.1
- **C.** 10.8.0.200
- **D.** 10.9.0.1

The wildcard ignores only the last octet; the first three must equal 10.8.0. This selects local interfaces, not a route-advertisement filter.

Referencia: https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/xe-17/iro-xe-17-book/iro-cfg.html · Enabling OSPF · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 23. ios-ospf-router-id-loopback-preference

ID: `ccna-original-20261026-b06-023` · Área: `ip_connectivity` · Dificultad: `intermediate`

Antes de iniciar OSPF IOS hay loopbacks activas 10.0.0.2 y 10.0.0.10 y una IP física activa 203.0.113.200. No se configura router-id manual. ¿Qué ID selecciona la regla normal que prefiere loopbacks?

- **A.** 203.0.113.200
- **B.** 10.0.0.10
- **C.** 0.0.0.0
- **D.** 10.0.0.2

**Respuesta(s) propuesta(s): B.** IOS prefiere una dirección loopback elegible y elige la mayor numéricamente si hay varias. Aquí se selecciona al iniciar el proceso; cambiar un ID existente es otra operación.

**English**

Before starting IOS OSPF, a router has active loopbacks 10.0.0.2 and 10.0.0.10, and active physical address 203.0.113.200. No router-id is manually configured. Which router ID is selected by the normal loopback-preference rule?

- **A.** 203.0.113.200
- **B.** 10.0.0.10
- **C.** 0.0.0.0
- **D.** 10.0.0.2

IOS prefers an eligible loopback address and chooses the highest numerical one when multiple loopbacks exist. Selection occurs at process initialization here; changing an existing router ID is a separate operation.

Referencia: https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/xe-17/iro-xe-17-book/iro-cfg.html · Forcing the Router ID Choice with a Loopback Interface · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 24. ipv6-local-delivery-versus-forwarding

ID: `ccna-original-20261026-b06-024` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un equipo tiene IPv6 y responde paquetes destinados a sí mismo. ¿Esa observación por sí sola prueba que reenvía paquetes entre enlaces distintos?

- **A.** No; la entrega local no demuestra por sí sola el reenvío
- **B.** Sí; toda IPv6 prueba automáticamente que hay routing
- **C.** Sí; una respuesta DNS garantiza reenvío
- **D.** No; porque IPv6 nunca puede enrutarse

**Respuesta(s) propuesta(s): A.** Entrega local y routing son funciones distintas. Neighbor Discovery define router como nodo que reenvía paquetes IP no dirigidos explícitamente a sí mismo; tener dirección y responder localmente no demuestra esa función.

**English**

A device has an IPv6 address and answers packets addressed to itself. Does that observation alone prove that it forwards packets between different links?

- **A.** No; local delivery does not by itself demonstrate forwarding
- **B.** Yes; any IPv6 address automatically proves routing is enabled
- **C.** Yes; a DNS reply guarantees packet forwarding
- **D.** No; because IPv6 cannot be routed at all

Local delivery and routing are different functions. Neighbor Discovery defines a router as a node that forwards IP packets not explicitly addressed to itself; an address and local response alone do not demonstrate that function.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 2.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 25. ipv6-temporary-address-privacy-role

ID: `ccna-original-20261026-b06-025` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un host IPv6 usa direcciones temporales con identificadores de interfaz cambiantes. ¿Qué beneficio de privacidad se busca?

- **A.** Garantizar que ningún observador correlacione tráfico
- **B.** Reducir correlación a largo plazo basada en un identificador de interfaz estable
- **C.** Eliminar la necesidad de prefijos de routing
- **D.** Cifrar toda aplicación sin TLS

**Respuesta(s) propuesta(s): B.** Las direcciones temporales reducen una fuente de correlación prolongada por dirección. No cifran tráfico, ocultan todos los metadatos ni eliminan prefijos válidos.

**English**

An IPv6 host uses temporary addresses with changing interface identifiers. What is the intended privacy benefit?

- **A.** Guarantee that no observer can correlate any traffic
- **B.** Reduce long-term correlation based on a stable interface identifier
- **C.** Eliminate the need for routing prefixes
- **D.** Encrypt all application traffic without TLS

Temporary addresses reduce one source of long-term address-based correlation. They do not encrypt traffic, hide all network metadata or remove the need for valid prefixes.

Referencia: https://www.rfc-editor.org/rfc/rfc8981.txt · 1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 26. ipv6-ra-managed-flag-not-default-router-source

ID: `ccna-original-20261026-b06-026` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un Router Advertisement IPv6 activa Managed e indica disponibilidad de direccionamiento DHCPv6. ¿Mediante qué mecanismo sigue aprendiendo routers predeterminados un host normal?

- **A.** Una opción DHCPv4 dentro de toda respuesta DHCPv6
- **B.** Router Advertisements IPv6 y Neighbor Discovery
- **C.** Números de secuencia SYN TCP
- **D.** Solo registros MX DNS

**Respuesta(s) propuesta(s): B.** Managed trata la configuración de direcciones. Descubrir routers predeterminados sigue siendo parte de Neighbor Discovery; activar M no crea una opción de router al estilo DHCPv4.

**English**

An IPv6 Router Advertisement sets the Managed flag, indicating DHCPv6 address configuration is available. From which mechanism does an ordinary host still learn default routers?

- **A.** A DHCPv4 option embedded in every DHCPv6 reply
- **B.** IPv6 Router Advertisements and Neighbor Discovery
- **C.** TCP SYN sequence numbers
- **D.** DNS MX records only

The Managed flag concerns address configuration. Default-router discovery remains part of IPv6 Neighbor Discovery; it does not become a DHCPv4-style router option merely because M is set.

Referencia: https://www.rfc-editor.org/rfc/rfc4861.txt · 4.2 and 6.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 27. ipv6-default-router-preference

ID: `ccna-original-20261026-b06-027` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos routers predeterminados IPv6 elegibles tienen igual alcanzabilidad conocida. A anuncia preferencia alta y B baja. Según la selección de RFC 4191, ¿cuál se prefiere?

- **A.** B
- **B.** A
- **C.** El de menor TTL DNS
- **D.** Ambos deben descartarse

**Respuesta(s) propuesta(s): B.** Con alcanzabilidad igual se prefiere la preferencia mayor. La alcanzabilidad importa por separado; no se afirma que un router inalcanzable de preferencia alta siempre gane.

**English**

Two otherwise eligible IPv6 default routers have known equal reachability. Router A advertises high preference and B low preference. Under RFC 4191 preference selection, which should be preferred?

- **A.** B
- **B.** A
- **C.** The one with the lowest DNS TTL
- **D.** Both must be discarded

With reachability equal, a higher default-router preference is preferred. Reachability matters separately; the question does not claim an unreachable high-preference router must always win.

Referencia: https://www.rfc-editor.org/rfc/rfc4191.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 28. ipv6-dad-duplicate-address-rejection

ID: `ccna-original-20261026-b06-028` · Área: `ip_connectivity` · Dificultad: `intermediate`

Durante DAD de una IPv6 nueva tentativa, el host detecta que ya se usa. ¿Cuál es la consecuencia normal para esa dirección intentada?

- **A.** Puede ignorarla porque IPv6 nunca comprueba unicidad
- **B.** No debe asignar la dirección duplicada para uso normal
- **C.** Debe borrar todos los vecinos de la LAN
- **D.** Debe anunciarse como único router predeterminado

**Respuesta(s) propuesta(s): B.** DAD prueba unicidad antes de la asignación normal. Detectar duplicado impide usar esa dirección; la recuperación puede elegir otra o requerir intervención.

**English**

During Duplicate Address Detection for a new tentative IPv6 address, a host detects that the address is already in use. What is the normal consequence for that attempted address?

- **A.** It can safely ignore the duplicate because IPv6 never checks uniqueness
- **B.** It must not assign the duplicate address for normal use
- **C.** It must delete every neighbor on the LAN
- **D.** It must advertise itself as the only default router

DAD tests address uniqueness before normal assignment. Detecting a duplicate prevents normal use of that attempted address; recovery policy can choose another address or require intervention.

Referencia: https://www.rfc-editor.org/rfc/rfc4862.txt · 5.4.5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 29. icmpv4-administratively-prohibited-meaning

ID: `ccna-original-20261026-b06-029` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router devuelve ICMPv4 Destination Unreachable código 13, Communication Administratively Prohibited. ¿Qué explicación indica más directamente?

- **A.** Una política administrativa de filtrado prohibió el reenvío
- **B.** Necesariamente falta un registro A DNS
- **C.** El origen usó loopback IPv6
- **D.** El puerto TCP destino necesariamente está abierto

**Respuesta(s) propuesta(s): A.** El código 13 identifica prohibición administrativa. No prueba fallo DNS, puerto de aplicación abierto ni un diagnóstico completo de todo problema extremo a extremo.

**English**

A router returns ICMPv4 Destination Unreachable code 13, Communication Administratively Prohibited. Which explanation is most directly indicated?

- **A.** Forwarding was prohibited by an administrative filtering policy
- **B.** A DNS A record necessarily does not exist
- **C.** The sender used the IPv6 loopback address
- **D.** The target TCP port is guaranteed to be open

Code 13 identifies administrative prohibition. It should not be interpreted as proof of DNS failure, an open application port or a complete diagnosis of every end-to-end problem.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 4.3.3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 30. vrf-separate-forwarding-tables

ID: `ccna-original-20261026-b06-030` · Área: `ip_connectivity` · Dificultad: `intermediate`

Dos redes de clientes usan prefijos privados superpuestos en un equipo con VRF separadas. ¿Qué aporta esa separación?

- **A.** Tablas separadas de routing y reenvío para que un prefijo tenga significados distintos por VRF
- **B.** Cifrado de todo paquete sin otros mecanismos
- **C.** Conectividad completa automática entre todos los clientes
- **D.** Una ruta predeterminada compartida obligatoria para todas las VRF

**Respuesta(s) propuesta(s): A.** Las VRF mantienen contextos separados de reenvío. Pueden aislar superposición; comunicar contextos requiere mecanismos deliberados y no se deduce de compartir hardware.

**English**

Two customer networks use overlapping private prefixes on a device that maintains separate VRFs. What does the VRF separation provide?

- **A.** Separate routing and forwarding tables so the same prefix can have different meanings per VRF
- **B.** Encryption of every packet without additional mechanisms
- **C.** Automatic full connectivity between all customer networks
- **D.** One mandatory shared default route for every VRF

VRFs maintain separate forwarding contexts. Overlap can be isolated; communication between contexts requires deliberate routing or policy mechanisms and is not implied by the shared hardware.

Referencia: https://www.rfc-editor.org/rfc/rfc4364.txt · 3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 31. different-protocol-metrics-not-direct-ranking

ID: `ccna-original-20261026-b06-031` · Área: `ip_connectivity` · Dificultad: `intermediate`

Para un prefijo un router recibe métrica RIP 2 y OSPF 20. ¿Por qué comparar solo 2 < 20 no basta para elegir la fuente en IOS?

- **A.** Los protocolos usan métricas distintas; la distancia administrativa ordena fuentes elegibles del mismo prefijo
- **B.** Las métricas RIP siempre son MAC Ethernet
- **C.** Los costos OSPF son puertos TCP
- **D.** El número mostrado menor siempre gana entre todos los protocolos

**Respuesta(s) propuesta(s): A.** La distancia expresa preferencia de fuente para un prefijo. Saltos RIP y costos OSPF no son una medición numérica común que pueda compararse directamente.

**English**

For one prefix a router receives RIP metric 2 and OSPF metric 20. Why is comparing only 2 < 20 insufficient to choose the route source on IOS?

- **A.** The protocols use different metric meanings; administrative distance ranks eligible sources for the same prefix
- **B.** RIP metrics are always Ethernet MAC addresses
- **C.** OSPF costs are TCP port numbers
- **D.** The smaller displayed number always wins across every protocol

Administrative distance expresses route-source preference for a prefix. RIP hop counts and OSPF costs are not a shared numerical measurement that can simply be compared directly.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/15986-admin-distance.html · Administrative Distance · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 32. ipv4-forwarding-header-updates

ID: `ccna-original-20261026-b06-032` · Área: `ip_connectivity` · Dificultad: `intermediate`

Un router reenvía un paquete IPv4 normal sin fragmentación, NAT ni modificación de políticas. ¿Qué dos campos deben reflejar el procesamiento del salto? Selecciona dos.

- **A.** TTL disminuye
- **B.** El checksum de cabecera IPv4 se actualiza por el cambio
- **C.** La IP origen se vuelve la del router en cada salto
- **D.** El puerto TCP destino se vuelve el número de interfaz de salida

**Respuesta(s) propuesta(s): A, B.** Reenviar disminuye TTL IPv4 y actualiza el checksum correspondiente. El routing normal no hace NAT automáticamente ni reescribe puertos de aplicación.

**English**

A router forwards an ordinary unfragmented IPv4 packet without NAT or policy modification. Which two header fields must reflect the forwarding-hop processing? Select two.

- **A.** TTL decreases
- **B.** IPv4 header checksum is updated for the header change
- **C.** Source IP becomes the router IP on every hop
- **D.** TCP destination port becomes the output interface number

Forwarding decreases IPv4 TTL and updates the header checksum accordingly. Ordinary routing does not automatically perform NAT or rewrite application ports.

Referencia: https://www.rfc-editor.org/rfc/rfc1812.txt · 5.2.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 33. dns-truncated-response-tcp-retry

ID: `ccna-original-20261026-b06-033` · Área: `ip_services` · Dificultad: `intermediate`

Un cliente DNS recibe respuesta UDP con TC=1 por truncamiento. ¿Qué estrategia de transporte estándar permite obtenerla completa?

- **A.** Suponer que el dominio no puede existir
- **B.** Tratar TC como cambio exitoso de contraseña
- **C.** Sustituir DNS por broadcast ARP a través de Internet
- **D.** Reintentar la consulta por TCP

**Respuesta(s) propuesta(s): D.** El bit de truncamiento indica respuesta UDP incompleta. DNS admite TCP para respuestas completas; truncamiento no es NXDOMAIN ni una operación de contraseña.

**English**

A DNS client receives a UDP reply with TC=1 because the answer was truncated. What is the standard next transport strategy to obtain the complete reply?

- **A.** Assume the domain cannot exist
- **B.** Treat TC as a successful password change
- **C.** Replace DNS with an ARP broadcast across the Internet
- **D.** Retry the query using TCP

The truncation bit signals that the UDP answer is incomplete. DNS supports TCP for complete replies; truncation is not NXDOMAIN or a password operation.

Referencia: https://www.rfc-editor.org/rfc/rfc7766.txt · 6.1.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 34. dhcp-direct-client-server-udp-ports

ID: `ccna-original-20261026-b06-034` · Área: `ip_services` · Dificultad: `intermediate`

Sin relay, un cliente DHCPv4 envía al servidor DHCP. ¿Qué puerto UDP destino recibe normalmente el mensaje dirigido al servidor?

- **A.** 123
- **B.** 68
- **C.** 53
- **D.** 67

**Respuesta(s) propuesta(s): D.** DHCP usa puerto UDP 67 del servidor y 68 del cliente. Se pide el destino del servidor, no el puerto receptor del cliente.

**English**

Without a relay, a DHCPv4 client sends to a DHCP server. Which UDP destination port normally receives the server-directed message?

- **A.** 123
- **B.** 68
- **C.** 53
- **D.** 67

DHCP uses UDP server port 67 and client port 68. This question asks for the server destination port, not the client listening port.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 35. dhcp-broadcast-flag-before-address-use

ID: `ccna-original-20261026-b06-035` · Área: `ip_services` · Dificultad: `intermediate`

Un cliente DHCPv4 no puede recibir paquetes IP unicast antes de configurarse. ¿Para qué activa BROADCAST en su solicitud inicial?

- **A.** Deshabilitar permanentemente detección de conflictos
- **B.** Solicitar un router ID OSPF
- **C.** Obligar a todo router a reenviar broadcast limitado sin relay
- **D.** Indicar que la respuesta debe entregarse por broadcast según las reglas DHCP

**Respuesta(s) propuesta(s): D.** El flag ayuda a clientes incapaces de recibir unicast antes de configurar IP. No anula reglas de broadcast limitado ni elimina la necesidad de relay entre subredes.

**English**

A DHCPv4 client cannot receive unicast IP packets before it is configured. What is the purpose of setting the BROADCAST flag in its initial request?

- **A.** Disable address conflict detection permanently
- **B.** Request an OSPF router ID
- **C.** Force all routers to forward limited broadcasts without relays
- **D.** Indicate that the reply should be delivered using broadcast under the defined DHCP delivery rules

The flag supports clients unable to receive preconfiguration unicast delivery. It does not override the routing rules for limited broadcasts or remove the need for a relay across subnets.

Referencia: https://www.rfc-editor.org/rfc/rfc2131.txt · 4.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 36. ntp-client-server-modes

ID: `ccna-original-20261026-b06-036` · Área: `ip_services` · Dificultad: `intermediate`

¿Qué modos usa respectivamente una solicitud y respuesta NTP cliente/servidor normal?

- **A.** Solicitud modo 3; respuesta modo 4
- **B.** Los modos son puertos TCP y no valores de cabecera NTP
- **C.** Ambas deben usar modo OSPF 1
- **D.** Solicitud modo 4; respuesta modo 3

**Respuesta(s) propuesta(s): A.** NTP define modo cliente 3 y servidor 4. Los valores describen roles de asociación, no stratum, desfase ni puertos de transporte.

**English**

An ordinary NTP client/server exchange uses which mode values for the request and response respectively?

- **A.** Request mode 3; response mode 4
- **B.** Modes are TCP ports rather than NTP header values
- **C.** Both must be OSPF mode 1
- **D.** Request mode 4; response mode 3

NTP defines client mode 3 and server mode 4. These header values describe association roles, not strata, time offsets or transport ports.

Referencia: https://www.rfc-editor.org/rfc/rfc5905.txt · 7.3 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 37. snmp-counter32-wrap-delta

ID: `ccna-original-20261026-b06-037` · Área: `ip_services` · Dificultad: `intermediate`

Un Counter32 muestra 4294967290 y luego 9. Supón como máximo un wrap, sin reset ni discontinuidad. ¿Qué incremento ocurrió?

- **A.** 4294967281
- **B.** 9
- **C.** 6
- **D.** 15

**Respuesta(s) propuesta(s): D.** Counter32 vuelve a cero módulo 2^32. El incremento es (9−4294967290) mod 4294967296 = 15; un reset exigiría otra interpretación y se excluye.

**English**

A Counter32 reads 4294967290 and then 9. Assume at most one wrap, no reset and no discontinuity. What increment occurred between readings?

- **A.** 4294967281
- **B.** 9
- **C.** 6
- **D.** 15

Counter32 wraps modulo 2^32. The increment is (9−4294967290) mod 4294967296 = 15; a reset would require a different interpretation and is excluded.

Referencia: https://www.rfc-editor.org/rfc/rfc2578.txt · 7.1.6 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 38. port-security-shutdown-violation-state

ID: `ccna-original-20261026-b06-038` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un puerto de acceso Catalyst usa port-security violation shutdown. Un origen no autorizado causa una violación. ¿Qué estado operativo se espera?

- **A.** Solicita una zona DNS nueva
- **B.** Se convierte automáticamente en raíz spanning tree
- **C.** Entra en estado err-disabled
- **D.** Sigue reenviando silenciosamente todo origen no autorizado

**Respuesta(s) propuesta(s): C.** El modo shutdown deja el puerto err-disabled. Difiere de protect y restrict, que descartan tráfico infractor sin el mismo apagado del puerto.

**English**

A Catalyst access port uses port-security violation shutdown. An unauthorized source causes a violation. What operational state is expected for the port?

- **A.** It requests a new DNS zone
- **B.** It becomes the spanning-tree root automatically
- **C.** It enters the error-disabled state
- **D.** It silently continues forwarding every unauthorized source

The shutdown violation mode error-disables the port. This differs from protect and restrict, which drop violating traffic without the same port shutdown behavior.

Referencia: https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-15/configuration_guide/sec/b_1715_sec_9300_cg/port_security.html · Security Violations · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 39. radius-udp-shared-secret-not-full-encryption

ID: `ccna-original-20261026-b06-039` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un despliegue usa RADIUS tradicional por UDP con secreto compartido, sin transporte protegido adicional. ¿Ese secreto por sí solo cifra todo el paquete?

- **A.** Sí; todo atributo necesariamente es un registro TLS cifrado
- **B.** Sí; el secreto convierte UDP en SSH
- **C.** No; configurar el secreto no da confidencialidad a todo el paquete RADIUS tradicional
- **D.** No; porque RADIUS no autentica

**Respuesta(s) propuesta(s): C.** RADIUS tradicional aplica protecciones específicas, incluido ocultar User-Password, en vez de cifrar todo atributo como TLS. Un secreto compartido no equivale a transporte cifrado de todo el paquete.

**English**

A deployment uses traditional RADIUS over UDP with a shared secret, without a separate protected transport. Does that secret alone encrypt the whole RADIUS packet?

- **A.** Yes; every attribute is necessarily an encrypted TLS record
- **B.** Yes; the secret turns UDP into SSH
- **C.** No; traditional RADIUS does not provide whole-packet confidentiality merely by configuring the secret
- **D.** No; because RADIUS has no authentication function

Traditional RADIUS applies specified protections, including hiding User-Password, rather than encrypting every attribute as a TLS record. A shared secret alone is not a full-packet encrypted transport.

Referencia: https://www.rfc-editor.org/rfc/rfc2865.txt · 5.1 and 5.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 40. bearer-token-transport-confidentiality

ID: `ccna-original-20261026-b06-040` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un script envía un token bearer OAuth a una API por HTTP sin protección. ¿Por qué se requiere HTTPS con validación correcta del certificado?

- **A.** Un token vuelve confidencial automáticamente el transporte en texto claro
- **B.** Los tokens bearer siempre son prefijos de routing públicos
- **C.** HTTPS evita todo compromiso del propio extremo
- **D.** Quien obtiene el token puede usarlo; TLS lo protege en tránsito

**Respuesta(s) propuesta(s): D.** Poseer el token bearer basta para usarlo dentro de su autorización. RFC 6750 exige TLS; proteger el transporte no reemplaza seguridad de extremos ni cuidado de logs.

**English**

A script sends an OAuth bearer token to an API over unprotected HTTP. Why is HTTPS with proper certificate validation required for this use?

- **A.** A token makes plaintext transport confidential automatically
- **B.** Bearer tokens are always public routing prefixes
- **C.** HTTPS prevents all compromise of the endpoint itself
- **D.** An observer who obtains the token can use it; TLS protects it in transit

Bearer-token possession is sufficient for use under its authorization scope. RFC 6750 requires TLS; transport protection does not replace endpoint security or careful logging.

Referencia: https://www.rfc-editor.org/rfc/rfc6750.txt · 5.2 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 41. tls-ip-reference-identifier-san-match

ID: `ccna-original-20261026-b06-041` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un cliente conecta a https://192.0.2.10 y valida identidad contra esa IP. El certificado solo tiene DNS-ID router.example.com y ningún IP-ID coincidente. ¿Ese nombre DNS por sí solo establece coincidencia?

- **A.** Sí; suponer un DNS inverso reemplaza validar el certificado
- **B.** Sí; cualquier nombre DNS coincide automáticamente con toda IP
- **C.** No; la identidad IP de referencia requiere un identificador IP coincidente
- **D.** No; HTTPS nunca puede usar direcciones IP

**Respuesta(s) propuesta(s): C.** Comparar IP-ID es distinto de DNS-ID. Un certificado solo DNS no valida automáticamente una IP literal; conectar por el nombre certificado es otro contexto.

**English**

A client connects to https://192.0.2.10 and performs service-identity validation against that IP. The certificate has only DNS-ID router.example.com and no matching IP-ID. Does that DNS name alone establish a match?

- **A.** Yes; a private reverse-DNS guess replaces certificate validation
- **B.** Yes; any DNS name automatically matches every IP address
- **C.** No; the IP reference identifier requires a matching IP identifier
- **D.** No; because HTTPS cannot use IP addresses under any circumstances

IP-ID matching is separate from DNS-ID matching. A DNS-only certificate does not automatically validate a literal IP reference; connecting by the certified hostname is a different request context.

Referencia: https://www.rfc-editor.org/rfc/rfc9525.txt · 6.4 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 42. totp-time-step-counter

ID: `ccna-original-20261026-b06-042` · Área: `security_fundamentals` · Dificultad: `intermediate`

En TOTP, T=floor((UnixTime−T0)/X). Con UnixTime=59, T0=0 y X=30 segundos, ¿qué contador se usa antes de aplicar HOTP?

- **A.** 1
- **B.** 2
- **C.** 29
- **D.** 59

**Respuesta(s) propuesta(s): A.** El contador es floor(59/30)=1. No es el valor OTP; calcular el token también requiere secreto y procesamiento HOTP.

**English**

For TOTP, T=floor((UnixTime−T0)/X). With UnixTime=59, T0=0 and X=30 seconds, which counter is used before applying the HOTP function?

- **A.** 1
- **B.** 2
- **C.** 29
- **D.** 59

The step counter is floor(59/30)=1. This is not the OTP value itself; calculating the token also requires the secret and HOTP processing.

Referencia: https://www.rfc-editor.org/rfc/rfc6238.txt · 4.2 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 43. ipsec-tunnel-outer-inner-address-roles

ID: `ccna-original-20261026-b06-043` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un paquete IPsec site-to-site en modo túnel lleva el IP original entre hosts dentro de una cabecera IP externa nueva. ¿Qué rol de direcciones es correcto?

- **A.** El modo túnel elimina la necesidad de ruta subyacente
- **B.** La cabecera externa siempre identifica servidores raíz DNS
- **C.** La cabecera externa enruta entre extremos del túnel; las direcciones originales pueden permanecer dentro
- **D.** Las direcciones originales deben convertirse en ID VLAN

**Respuesta(s) propuesta(s): C.** El modo túnel encapsula un IP interno con cabecera externa para los extremos IPsec. Sigue requiriendo conectividad IP subyacente y no convierte direcciones en ID VLAN.

**English**

A site-to-site IPsec tunnel mode packet carries an original host-to-host IP packet inside a new outer IP header. Which address role is correct?

- **A.** Tunnel mode removes all need for an underlying route
- **B.** The outer IP header always names the DNS root servers
- **C.** The outer IP header routes between tunnel endpoints; the original host addresses can remain in the inner packet
- **D.** The original host addresses must become Ethernet VLAN IDs

Tunnel mode encapsulates an inner IP packet with an outer header for the IPsec endpoints. It still requires underlying IP reachability and does not turn IP addresses into VLAN identifiers.

Referencia: https://www.rfc-editor.org/rfc/rfc4301.txt · 3.1 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 44. acl-sequential-shadowed-permit

ID: `ccna-original-20261026-b06-044` · Área: `security_fundamentals` · Dificultad: `intermediate`

Una ACL IPv4 ordenada primero deniega todo origen 10.4.0.0/16 y luego permite 10.4.8.0/24. No coincide ninguna entrada anterior. ¿Qué ocurre con un paquete de origen 10.4.8.9?

- **A.** Denegar
- **B.** La ACL se reordena automáticamente por tamaño de subred
- **C.** Debe evaluar ambas y elegir el prefijo más largo
- **D.** Permitir

**Respuesta(s) propuesta(s): A.** La ACL se detiene en la primera coincidencia. La denegación amplia oculta el permiso específico posterior; el orden ACL no es longest-prefix match de routing.

**English**

An ordered IPv4 ACL first denies all traffic from 10.4.0.0/16, then permits traffic from 10.4.8.0/24. No earlier entry matches. What happens to a packet sourced from 10.4.8.9?

- **A.** Deny
- **B.** The ACL is automatically reordered by subnet size
- **C.** The router must evaluate both and choose the longer prefix
- **D.** Permit

ACL evaluation stops at the first matching entry. The broad deny shadows the later specific permit; ACL order is not routing longest-prefix match.

Referencia: https://www.cisco.com/c/en/us/support/docs/ip/access-lists/26448-ACLsamples.html · ACL Processing · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 45. password-and-totp-factor-categories

ID: `ccna-original-20261026-b06-045` · Área: `security_fundamentals` · Dificultad: `intermediate`

Un administrador usa contraseña memorizada y TOTP de un autenticador controlado por separado que conserva un secreto. ¿Qué dos categorías de factor se buscan? Selecciona dos.

- **A.** Posesión
- **B.** Una máscara de subred
- **C.** Conocimiento
- **D.** La cantidad de pantallas de acceso

**Respuesta(s) propuesta(s): A, C.** La contraseña representa conocimiento; controlar el autenticador representa posesión. Importan independencia y manejo seguro; mostrar dos pasos no basta por sí solo.

**English**

An administrator uses a memorized password and a TOTP code from a separately controlled authenticator holding a secret. Which two factor categories are intended? Select two.

- **A.** Possession
- **B.** A network subnet mask
- **C.** Knowledge
- **D.** The number of login screens

The password represents knowledge; control of the authenticator represents possession. Independence and secure handling matter; merely displaying two prompts is not enough by itself.

Referencia: https://www.rfc-editor.org/rfc/rfc4949.txt · authentication information · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 46. json-boolean-literal-type

ID: `ccna-original-20261026-b06-046` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API exige que enabled sea el booleano JSON true. ¿Qué carga tiene el tipo y valor requeridos?

- **A.** {"enabled":1}
- **B.** {"enabled":True}
- **C.** {"enabled":true}
- **D.** {"enabled":"true"}

**Respuesta(s) propuesta(s): C.** true en minúsculas es un literal booleano JSON. Cadena y número son tipos distintos y True con mayúscula no es literal JSON válido.

**English**

An API schema requires enabled to be a JSON Boolean true. Which payload has the required type and value?

- **A.** {"enabled":1}
- **B.** {"enabled":True}
- **C.** {"enabled":true}
- **D.** {"enabled":"true"}

JSON true is a lowercase Boolean literal. A string and a number are different types, and uppercase True is not a valid JSON literal.

Referencia: https://www.rfc-editor.org/rfc/rfc8259.txt · 3 · Consulta: consulted

Comprobación independiente: cálculo/escenario ejecutable en el reporte.

## 47. http-204-empty-response-body

ID: `ccna-original-20261026-b06-047` · Área: `automation_programmability` · Dificultad: `intermediate`

Una actualización API termina con HTTP 204 No Content. ¿Qué debe evitar suponer el cliente sobre la respuesta?

- **A.** Que 204 pertenece a la clase exitosa 2xx
- **B.** Que toda respuesta exitosa contiene un documento JSON para analizar
- **C.** Que puede haber cabeceras de respuesta
- **D.** Que el servidor puede indicar éxito sin contenido

**Respuesta(s) propuesta(s): B.** 204 señala procesamiento exitoso sin contenido de respuesta. El cliente debe manejarlo sin analizar un JSON inexistente; aún puede haber cabeceras relevantes.

**English**

An API update succeeds with HTTP 204 No Content. What should a client avoid assuming about the response?

- **A.** That 204 belongs to the successful 2xx class
- **B.** That every successful response contains a JSON document to parse
- **C.** That response headers can still exist
- **D.** That the server can signal success without content

204 signals successful processing with no response content. A client should handle that status without trying to parse a nonexistent JSON body; relevant headers can still be present.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.3.5 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 48. http-415-content-type-check

ID: `ccna-original-20261026-b06-048` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API rechaza una solicitud con HTTP 415 Unsupported Media Type. ¿Qué detalle de la solicitud conviene investigar directamente?

- **A.** Si la API necesariamente aplicó todo cambio solicitado
- **B.** Si la raíz STP tiene el router ID menor
- **C.** Si un ACK TCP es una máscara IPv4
- **D.** Si Content-Type y el formato enviado están admitidos

**Respuesta(s) propuesta(s): D.** 415 trata un formato de representación no admitido para ese método y recurso. Conviene comprobar Content-Type y codificación real; no indica éxito.

**English**

An API rejects a request with HTTP 415 Unsupported Media Type. Which request detail is directly relevant to investigate?

- **A.** Whether the API necessarily committed every requested change
- **B.** Whether the STP root has the lowest router ID
- **C.** Whether a TCP ACK is an IPv4 subnet mask
- **D.** Whether Content-Type and the submitted representation format are supported

415 concerns a representation format the server does not support for that method and resource. Checking Content-Type and actual encoding is relevant; it is not a success indication.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.5.16 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 49. netconf-running-versus-startup-persistence

ID: `ccna-original-20261026-b06-049` · Área: `automation_programmability` · Dificultad: `intermediate`

Un equipo NETCONF anuncia datastore startup distinto y permite escribir running. Tras editar running, ¿qué operación copia explícitamente esa configuración a startup?

- **A.** Solo get con filtro vacío
- **B.** Solo lock sobre candidate
- **C.** copy-config con origen running y destino startup
- **D.** Un DNS UPDATE al hostname

**Respuesta(s) propuesta(s): C.** La capacidad startup define un datastore separado. copy-config puede copiar running a startup; cambiar running no implica por sí solo esa operación explícita de persistencia.

**English**

A NETCONF device advertises a distinct startup datastore and supports writing running. After editing running, which operation explicitly copies that configuration to startup?

- **A.** get with an empty filter only
- **B.** lock on the candidate datastore only
- **C.** copy-config with source running and target startup
- **D.** A DNS UPDATE to the router hostname

The startup capability defines a separate datastore. copy-config can write startup from running; changing running alone should not be assumed to perform that explicit persistence operation.

Referencia: https://www.rfc-editor.org/rfc/rfc6241.txt · 8.7 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.

## 50. http-405-allowed-method-investigation

ID: `ccna-original-20261026-b06-050` · Área: `automation_programmability` · Dificultad: `intermediate`

Una API de estilo REST devuelve HTTP 405 Method Not Allowed con cabecera Allow. ¿Qué debe revisar el cliente antes de cambiar credenciales?

- **A.** Una obligación de reintentar el mismo método indefinidamente
- **B.** Solo el serial de la fuente de alimentación
- **C.** Prueba de que se borraron todas las VLAN
- **D.** Los métodos admitidos para el recurso destino

**Respuesta(s) propuesta(s): D.** 405 indica método conocido pero no admitido por ese recurso. Allow identifica métodos admitidos; es distinto de un desafío de autenticación.

**English**

A REST-style API responds HTTP 405 Method Not Allowed with an Allow header. What should the client inspect before changing authentication credentials?

- **A.** A requirement to retry the same method forever
- **B.** Only the device power-supply serial number
- **C.** Proof that every VLAN was deleted
- **D.** The supported methods for the target resource

405 means the method is known but not supported by that target resource. Allow identifies supported methods; it is distinct from an authentication challenge.

Referencia: https://www.rfc-editor.org/rfc/rfc9110.txt · 15.5.6 · Consulta: consulted

Comprobación independiente: requiere revisión documental; no se declara verificada automáticamente.
