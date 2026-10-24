import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface TopicSeed {
  code: string;
  nameEn: string;
  nameEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  examArea: string;
  examAreaNumber: string;
  weightPercentage: number;
  parentCode?: string;
  learningObjectives?: string[];
}

const TOPICS_DATA: TopicSeed[] = [
  // ============================================================
  // 1.0 Network Fundamentals (20%)
  // ============================================================
  {
    code: '1.0',
    nameEn: 'Network Fundamentals',
    nameEs: 'Fundamentos de Redes',
    descriptionEn: 'Core networking concepts, architectures, cabling, IPv4/IPv6 addressing and subnetting',
    descriptionEs: 'Conceptos clave de redes, arquitecturas, cableado, direccionamiento y subredes IPv4/IPv6',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
  },
  {
    code: '1.1',
    nameEn: 'Role and Function of Network Components',
    nameEs: 'Rol y Función de los Componentes de Red',
    descriptionEn: 'Routers, L2/L3 switches, next-generation firewalls, IPS, access points, controllers, endpoints, servers, PoE',
    descriptionEs: 'Routers, switches L2/L3, firewalls de última generación, IPS, puntos de acceso, controladores, terminales, servidores, PoE',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
    learningObjectives: ['Routers and Switches', 'Next-Generation Firewalls & IPS', 'Access Points & Controllers', 'Endpoints & Servers', 'PoE'],
  },
  {
    code: '1.2',
    nameEn: 'Network Topology Architectures',
    nameEs: 'Arquitecturas de Topología de Red',
    descriptionEn: '2-tier, 3-tier, spine-leaf, WAN, SOHO, on-premises and cloud architectures',
    descriptionEs: 'Arquitecturas de 2 niveles, 3 niveles, spine-leaf, WAN, SOHO, locales y en la nube',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.3',
    nameEn: 'Physical Interface and Cabling Types',
    nameEs: 'Tipos de Interfaces Físicas y Cableado',
    descriptionEn: 'Single-mode fiber, multimode fiber, copper cabling, and interface connection standards',
    descriptionEs: 'Fibra monomodo, fibra multimodo, cableado de cobre y estándares de conexión de interfaz',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.4',
    nameEn: 'Interface and Cable Issues Identification',
    nameEs: 'Identificación de Problemas de Interfaz y Cable',
    descriptionEn: 'Collisions, errors, duplex mismatch, speed configuration issues',
    descriptionEs: 'Colisiones, errores, desajustes de dúplex y problemas de velocidad',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.5',
    nameEn: 'TCP vs. UDP Protocol Comparison',
    nameEs: 'Comparación de Protocolos TCP vs. UDP',
    descriptionEn: 'Connection-oriented vs. connectionless transport layer protocols, reliability, flow control',
    descriptionEs: 'Protocolos de capa de transporte orientados vs. no orientados a conexión, fiabilidad, control de flujo',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.6',
    nameEn: 'IPv4 Addressing and Subnetting',
    nameEs: 'Direccionamiento y Subredes IPv4',
    descriptionEn: 'Configure and verify IPv4 addressing, VLSM subnetting, prefix masks, host calculation',
    descriptionEs: 'Configuración y verificación de direccionamiento IPv4, subredes VLSM, máscaras y cálculo de hosts',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.7',
    nameEn: 'Private IPv4 Addressing (RFC 1918 / RFC 6598)',
    nameEs: 'Direccionamiento IPv4 Privado (RFC 1918 / RFC 6598)',
    descriptionEn: 'Private address space, Carrier-Grade NAT (CGNAT) space, non-routable public addressing',
    descriptionEs: 'Espacio de direcciones privadas, espacio Carrier-Grade NAT (CGNAT), enrutamiento no público',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.8',
    nameEn: 'IPv6 Addressing and Prefixes',
    nameEs: 'Direccionamiento y Prefijos IPv6',
    descriptionEn: 'Configure and verify IPv6 addressing, hexadecimal notation, prefix lengths',
    descriptionEs: 'Configurar y verificar direccionamiento IPv6, notación hexadecimal, longitudes de prefijo',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.9',
    nameEn: 'IPv6 Address Types and EUI-64',
    nameEs: 'Tipos de Direcciones IPv6 y EUI-64',
    descriptionEn: 'Global unicast, unique local, link-local, anycast, multicast, modified EUI-64 process',
    descriptionEs: 'Unicast global, local única, enlace local, anycast, multicast, proceso EUI-64 modificado',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },
  {
    code: '1.10',
    nameEn: 'Client OS IP Parameters Verification',
    nameEs: 'Verificación de Parámetros IP en SO de Cliente',
    descriptionEn: 'Windows, macOS, Linux IP configuration and verification commands',
    descriptionEs: 'Comandos de configuración y verificación IP en Windows, macOS y Linux',
    examArea: 'network_fundamentals',
    examAreaNumber: '1.0',
    weightPercentage: 20,
    parentCode: '1.0',
  },

  // ============================================================
  // 2.0 Network Access (20%)
  // ============================================================
  {
    code: '2.0',
    nameEn: 'Network Access',
    nameEs: 'Acceso a la Red',
    descriptionEn: 'VLANs, trunks, EtherChannel, Spanning Tree, wireless architectures and access',
    descriptionEs: 'VLANs, enlaces troncales, EtherChannel, Spanning Tree, arquitecturas y acceso inalámbrico',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
  },
  {
    code: '2.1',
    nameEn: 'Configure and Verify VLANs',
    nameEs: 'Configurar y Verificar VLANs',
    descriptionEn: 'Normal range VLANs spanning multiple switches, access ports, data and voice VLANs',
    descriptionEs: 'VLANs de rango normal entre múltiples switches, puertos de acceso, VLANs de datos y voz',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.2',
    nameEn: 'Configure and Verify Interswitch Connectivity',
    nameEs: 'Configurar y Verificar Conectividad entre Switches',
    descriptionEn: 'Trunk ports, 802.1Q encapsulation, native VLAN configuration and security',
    descriptionEs: 'Puertos troncales, encapsulación 802.1Q, configuración y seguridad de VLAN nativa',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.3',
    nameEn: 'Layer 2 Discovery Protocols (CDP and LLDP)',
    nameEs: 'Protocolos de Descubrimiento de Capa 2 (CDP y LLDP)',
    descriptionEn: 'Configure and verify Cisco Discovery Protocol and Link Layer Discovery Protocol',
    descriptionEs: 'Configuración y verificación de Cisco Discovery Protocol (CDP) y LLDP',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.4',
    nameEn: 'Configure and Verify EtherChannel (LACP)',
    nameEs: 'Configurar y Verificar EtherChannel (LACP)',
    descriptionEn: 'Layer 2 and Layer 3 EtherChannel bundling using LACP and static modes',
    descriptionEs: 'Agrupación EtherChannel de Capa 2 y Capa 3 usando LACP y modos estáticos',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.5',
    nameEn: 'Rapid PVST+ Spanning Tree Protocol Operations',
    nameEs: 'Operaciones del Protocolo Rapid PVST+ Spanning Tree',
    descriptionEn: 'Root bridge election, port roles (root, designated, alternate), port states, PortFast, BPDU Guard',
    descriptionEs: 'Elección de puente raíz, roles de puerto, estados, PortFast y BPDU Guard',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.6',
    nameEn: 'Cisco Wireless Architectures and AP Modes',
    nameEs: 'Arquitecturas Inalámbricas Cisco y Modos de AP',
    descriptionEn: 'Autonomous, Cloud-based, Split-MAC / Lightweight AP architecture and modes',
    descriptionEs: 'Arquitecturas autónomas, basadas en la nube, Split-MAC / Lightweight y modos de AP',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.7',
    nameEn: 'WLAN Component Physical Connections',
    nameEs: 'Conexiones Físicas de Componentes WLAN',
    descriptionEn: 'AP, WLC, access and trunk ports, and Link Aggregation (LAG)',
    descriptionEs: 'Puntos de acceso, WLC, puertos de acceso/troncales y agregación de enlaces (LAG)',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },
  {
    code: '2.8',
    nameEn: 'AP and WLC Management Access Connections',
    nameEs: 'Conexiones de Acceso para Gestión de AP y WLC',
    descriptionEn: 'Telnet, SSH, HTTP, HTTPS, console, and TACACS+/RADIUS AAA management',
    descriptionEs: 'Telnet, SSH, HTTP, HTTPS, consola y gestión AAA con TACACS+/RADIUS',
    examArea: 'network_access',
    examAreaNumber: '2.0',
    weightPercentage: 20,
    parentCode: '2.0',
  },

  // ============================================================
  // 3.0 IP Connectivity (25%)
  // ============================================================
  {
    code: '3.0',
    nameEn: 'IP Connectivity',
    nameEs: 'Conectividad IP',
    descriptionEn: 'Routing table logic, longest match, static routing, OSPFv2, and first-hop redundancy',
    descriptionEs: 'Lógica de tablas de enrutamiento, coincidencia más larga, rutas estáticas, OSPFv2 y redundancia de primer salto',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
  },
  {
    code: '3.1',
    nameEn: 'Routing Table Components Interpretation',
    nameEs: 'Interpretación de Componentes de la Tabla de Enrutamiento',
    descriptionEn: 'Protocol codes, prefix, mask, next hop, administrative distance, metric, gateway of last resort',
    descriptionEs: 'Códigos de protocolo, prefijo, máscara, siguiente salto, distancia administrativa, métrica, puerta de enlace predeterminada',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
    parentCode: '3.0',
  },
  {
    code: '3.2',
    nameEn: 'Router Forwarding Decisions (Longest Match / AD / Metric)',
    nameEs: 'Decisiones de Reenvío del Router (Coincidencia más larga / AD / Métrica)',
    descriptionEn: 'Longest prefix match rule, administrative distance comparison, and metric evaluation',
    descriptionEs: 'Regla del prefijo más largo, comparación de distancia administrativa y evaluación de métricas',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
    parentCode: '3.0',
  },
  {
    code: '3.3',
    nameEn: 'Configure and Verify IPv4 and IPv6 Static Routing',
    nameEs: 'Configurar y Verificar Rutas Estáticas IPv4 e IPv6',
    descriptionEn: 'Default route, network route, host route, and floating static routes with administrative distance',
    descriptionEs: 'Ruta predeterminada, ruta de red, ruta de host y rutas flotantes con distancia administrativa',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
    parentCode: '3.0',
  },
  {
    code: '3.4',
    nameEn: 'Configure and Verify Single Area OSPFv2',
    nameEs: 'Configurar y Verificar OSPFv2 en Área Única',
    descriptionEn: 'Neighbor adjacencies, point-to-point and broadcast network types, DR/BDR election, router ID',
    descriptionEs: 'Adyacencias de vecinos, tipos de red punto a punto y difusión, elección DR/BDR, Router ID',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
    parentCode: '3.0',
  },
  {
    code: '3.5',
    nameEn: 'First Hop Redundancy Protocols (HSRP and VRRP)',
    nameEs: 'Protocolos de Redundancia de Primer Salto (HSRP y VRRP)',
    descriptionEn: 'Purpose, operation, active/standby roles, virtual IP, virtual MAC addresses, and preemption',
    descriptionEs: 'Propósito, operación, roles activo/standby, IP virtual, direcciones MAC virtuales y apropiación',
    examArea: 'ip_connectivity',
    examAreaNumber: '3.0',
    weightPercentage: 25,
    parentCode: '3.0',
  },

  // ============================================================
  // 4.0 IP Services (10%)
  // ============================================================
  {
    code: '4.0',
    nameEn: 'IP Services',
    nameEs: 'Servicios IP',
    descriptionEn: 'NAT/PAT, NTP, DHCP, DNS, SNMP, Syslog, QoS mechanisms, and SSH remote access',
    descriptionEs: 'NAT/PAT, NTP, DHCP, DNS, SNMP, Syslog, mecanismos QoS y acceso remoto SSH',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
  },
  {
    code: '4.1',
    nameEn: 'Configure and Verify Inside Source NAT and PAT',
    nameEs: 'Configurar y Verificar NAT de Origen Interno y PAT',
    descriptionEn: 'Static NAT, dynamic NAT pools, and Port Address Translation (PAT/overload)',
    descriptionEs: 'NAT estático, grupos de NAT dinámico y traducción de direcciones de puerto (PAT/overload)',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.2',
    nameEn: 'Configure and Verify NTP Operating Modes',
    nameEs: 'Configurar y Verificar Modos de Operación NTP',
    descriptionEn: 'Client and server mode, stratum levels, clock synchronization',
    descriptionEs: 'Modo cliente y servidor, niveles de estrato, sincronización de reloj',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.3',
    nameEn: 'Role of DHCP and DNS within Network Operations',
    nameEs: 'Rol de DHCP y DNS en las Operaciones de Red',
    descriptionEn: 'DORA process, DNS query resolution, authoritative vs recursive nameservers',
    descriptionEs: 'Proceso DORA, resolución de consultas DNS, servidores autoritativos vs recursivos',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.4',
    nameEn: 'Function of SNMP in Network Operations',
    nameEs: 'Función de SNMP en las Operaciones de Red',
    descriptionEn: 'SNMP manager, agent, MIB, OID, traps, informs, SNMPv2c vs SNMPv3 security',
    descriptionEs: 'Administrador SNMP, agente, MIB, OID, traps, informs, seguridad SNMPv2c vs SNMPv3',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.5',
    nameEn: 'Syslog Features, Facilities, and Severity Levels',
    nameEs: 'Características, Instalaciones y Niveles de Gravedad de Syslog',
    descriptionEn: 'Severity levels 0 (emergencies) through 7 (debugging), facilities, message format',
    descriptionEs: 'Niveles de gravedad 0 (emergencias) a 7 (depuración), instalaciones y formato de mensajes',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.6',
    nameEn: 'Configure and Verify DHCP Client and Relay Agent',
    nameEs: 'Configurar y Verificar Cliente DHCP y Agente Relay',
    descriptionEn: 'ip helper-address command, relaying broadcast DHCP across routers',
    descriptionEs: 'Comando ip helper-address, reenvío de difusión DHCP a través de routers',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.7',
    nameEn: 'QoS Per-Hop Behaviors (PHB) and Mechanisms',
    nameEs: 'Comportamientos por Salto (PHB) y Mecanismos de QoS',
    descriptionEn: 'Classification, marking (CoS, DSCP), queuing, congestion avoidance, policing, shaping',
    descriptionEs: 'Clasificación, marcado (CoS, DSCP), encolamiento, evasión de congestión, policing y conformación',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },
  {
    code: '4.8',
    nameEn: 'Configure Secure Remote Access Using SSH',
    nameEs: 'Configurar Acceso Remoto Seguro Usando SSH',
    descriptionEn: 'Crypto key generation, domain-name, vty transport input ssh, local username authentication',
    descriptionEs: 'Generación de claves criptográficas, domain-name, transport input ssh en líneas vty, autenticación local',
    examArea: 'ip_services',
    examAreaNumber: '4.0',
    weightPercentage: 10,
    parentCode: '4.0',
  },

  // ============================================================
  // 5.0 Security Fundamentals (15%)
  // ============================================================
  {
    code: '5.0',
    nameEn: 'Security Fundamentals',
    nameEs: 'Fundamentos de Seguridad',
    descriptionEn: 'Threats, vulnerabilities, device hardening, ACLs, Layer 2 security, VPNs, AAA',
    descriptionEs: 'Amenazas, vulnerabilidades, aseguramiento de dispositivos, ACLs, seguridad Capa 2, VPNs, AAA',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
  },
  {
    code: '5.1',
    nameEn: 'Key Security Concepts and Threat Mitigation',
    nameEs: 'Conceptos Clave de Seguridad y Mitigación de Amenazas',
    descriptionEn: 'Threats, vulnerabilities, exploits, zero-day attacks, defense-in-depth mitigation',
    descriptionEs: 'Amenazas, vulnerabilidades, exploits, ataques de día cero, mitigación en defensa en profundidad',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.2',
    nameEn: 'Security Program Elements',
    nameEs: 'Elementos del Programa de Seguridad',
    descriptionEn: 'User awareness, security training, and physical access controls',
    descriptionEs: 'Concienciación del usuario, capacitación de seguridad y controles de acceso físico',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.3',
    nameEn: 'Device Access Control Using Local Passwords',
    nameEs: 'Control de Acceso a Dispositivos Usando Contraseñas Locales',
    descriptionEn: 'Enable secret, line console, line vty, service password-encryption',
    descriptionEs: 'Enable secret, línea de consola, líneas vty, service password-encryption',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.4',
    nameEn: 'Password Policy Elements and MFA',
    nameEs: 'Elementos de Políticas de Contraseñas y MFA',
    descriptionEn: 'Password complexity, expiration, multifactor authentication (MFA), certificates, biometrics',
    descriptionEs: 'Complejidad de contraseñas, expiración, autenticación multifactor (MFA), certificados y biometría',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.5',
    nameEn: 'Remote Access and Site-to-Site VPNs',
    nameEs: 'VPNs de Acceso Remoto y Sitio a Sitio',
    descriptionEn: 'IPsec tunnels, IKE phases, ESP, AH, SSL/TLS VPNs, Cisco AnyConnect',
    descriptionEs: 'Túneles IPsec, fases IKE, ESP, AH, VPNs SSL/TLS, Cisco AnyConnect',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.6',
    nameEn: 'Configure and Verify Access Control Lists (ACLs)',
    nameEs: 'Configurar y Verificar Listas de Control de Acceso (ACLs)',
    descriptionEn: 'Standard and extended numbered and named IPv4 ACLs, wildcard masks, implicit deny',
    descriptionEs: 'ACLs IPv4 estándar y extendidas, numeradas y nombradas, máscaras comodín, denegación implícita',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.7',
    nameEn: 'Layer 2 Security Features',
    nameEs: 'Funciones de Seguridad de Capa 2',
    descriptionEn: 'Port Security, DHCP Snooping, Dynamic ARP Inspection (DAI)',
    descriptionEs: 'Seguridad de puerto (Port Security), DHCP Snooping, Inspección Dinámica de ARP (DAI)',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },
  {
    code: '5.8',
    nameEn: 'AAA Concepts (Authentication, Authorization, Accounting)',
    nameEs: 'Conceptos de AAA (Autenticación, Autorización y Auditoría)',
    descriptionEn: 'Differences between Authentication, Authorization, Accounting; RADIUS vs. TACACS+',
    descriptionEs: 'Diferencias entre Autenticación, Autorización y Auditoría; RADIUS vs. TACACS+',
    examArea: 'security_fundamentals',
    examAreaNumber: '5.0',
    weightPercentage: 15,
    parentCode: '5.0',
  },

  // ============================================================
  // 6.0 Automation and Programmability (10%)
  // ============================================================
  {
    code: '6.0',
    nameEn: 'Automation and Programmability',
    nameEs: 'Automatización y Programabilidad',
    descriptionEn: 'Controller architectures, SDN, REST APIs, JSON data encoding, and configuration management tools',
    descriptionEs: 'Arquitecturas de controladores, SDN, APIs REST, codificación de datos JSON y herramientas de gestión de configuración',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
  },
  {
    code: '6.1',
    nameEn: 'Impact of Automation on Network Management',
    nameEs: 'Impacto de la Automatización en la Gestión de Redes',
    descriptionEn: 'Efficiency, speed of deployment, consistency, reduction in human error',
    descriptionEs: 'Eficiencia, velocidad de despliegue, coherencia, reducción de errores humanos',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
  {
    code: '6.2',
    nameEn: 'Traditional vs Controller-Based Networking',
    nameEs: 'Redes Tradicionales vs Basadas en Controladores',
    descriptionEn: 'Distributed vs centralized control plane, northbound and southbound APIs',
    descriptionEs: 'Plano de control distribuido vs centralizado, APIs en dirección norte y sur',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
  {
    code: '6.3',
    nameEn: 'Software-Defined Architectures and Cisco Catalyst Center',
    nameEs: 'Arquitecturas Definidas por Software y Cisco Catalyst Center',
    descriptionEn: 'Overlay, underlay, fabric, control plane / data plane separation, Cisco DNA Center',
    descriptionEs: 'Superposición (overlay), infraestructura base (underlay), fabric, separación de planos, Cisco DNA Center',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
  {
    code: '6.4',
    nameEn: 'Traditional Campus Management vs Cisco DNA Center',
    nameEs: 'Gestión de Campus Tradicional vs Cisco DNA Center',
    descriptionEn: 'Device-by-device configuration vs intent-based networking and automated policy deployment',
    descriptionEs: 'Configuración dispositivo por dispositivo vs redes basadas en intención y despliegue automatizado de políticas',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
  {
    code: '6.5',
    nameEn: 'REST-Based APIs and JSON Data Encoding',
    nameEs: 'APIs Basadas en REST y Codificación de Datos JSON',
    descriptionEn: 'CRUD operations, HTTP methods (GET, POST, PUT, DELETE), JSON structures (arrays, key-value pairs)',
    descriptionEs: 'Operaciones CRUD, métodos HTTP (GET, POST, PUT, DELETE), estructuras JSON (arreglos, pares clave-valor)',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
  {
    code: '6.6',
    nameEn: 'Configuration Management Mechanisms (Ansible, Puppet, Chef)',
    nameEs: 'Mecanismos de Gestión de Configuración (Ansible, Puppet, Chef)',
    descriptionEn: 'Agentless (Ansible) vs agent-based (Puppet, Chef), push vs pull models, playbooks, manifests, recipes',
    descriptionEs: 'Sin agente (Ansible) vs basado en agente (Puppet, Chef), modelos push vs pull, playbooks, manifiestos, recetas',
    examArea: 'automation_programmability',
    examAreaNumber: '6.0',
    weightPercentage: 10,
    parentCode: '6.0',
  },
];

async function main() {
  console.log('--- Seeding CCNA 200-301 v1.1 Database ---');

  // 1. Seed Topics
  console.log(`Seeding ${TOPICS_DATA.length} CCNA blueprint topics...`);
  const topicIdMap = new Map<string, string>();

  // First pass: create parent topics
  for (const t of TOPICS_DATA.filter((td) => !td.parentCode)) {
    const upserted = await prisma.topic.upsert({
      where: { code: t.code },
      update: {
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        descriptionEn: t.descriptionEn,
        descriptionEs: t.descriptionEs,
        examArea: t.examArea,
        examAreaNumber: t.examAreaNumber,
        weightPercentage: t.weightPercentage,
      },
      create: {
        code: t.code,
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        descriptionEn: t.descriptionEn,
        descriptionEs: t.descriptionEs,
        examArea: t.examArea,
        examAreaNumber: t.examAreaNumber,
        weightPercentage: t.weightPercentage,
        learningObjectives: t.learningObjectives ? JSON.stringify(t.learningObjectives) : null,
      },
    });
    topicIdMap.set(t.code, upserted.id);
  }

  // Second pass: create subtopics linked to parents
  for (const t of TOPICS_DATA.filter((td) => td.parentCode)) {
    const parentId = topicIdMap.get(t.parentCode!);
    const upserted = await prisma.topic.upsert({
      where: { code: t.code },
      update: {
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        descriptionEn: t.descriptionEn,
        descriptionEs: t.descriptionEs,
        examArea: t.examArea,
        examAreaNumber: t.examAreaNumber,
        weightPercentage: t.weightPercentage,
        parentTopicId: parentId,
      },
      create: {
        code: t.code,
        nameEn: t.nameEn,
        nameEs: t.nameEs,
        descriptionEn: t.descriptionEn,
        descriptionEs: t.descriptionEs,
        examArea: t.examArea,
        examAreaNumber: t.examAreaNumber,
        weightPercentage: t.weightPercentage,
        parentTopicId: parentId,
        learningObjectives: t.learningObjectives ? JSON.stringify(t.learningObjectives) : null,
      },
    });
    topicIdMap.set(t.code, upserted.id);
  }

  console.log('✓ Topics seeded successfully.');

  // 2. Seed Default Sources
  console.log('Seeding default question sources...');
  const originalSource = await prisma.source.upsert({
    where: { id: 'source-original-001' },
    update: {},
    create: {
      id: 'source-original-001',
      name: 'CCNA 200-301 Official Blueprint Original Question Bank',
      sourceType: 'original',
      reuseConditions: 'CCNA Simulator internal question bank',
    },
  });
  console.log(`✓ Default source ensured: ${originalSource.name}`);

  // 3. Seed Default Admin User
  console.log('Seeding default administrator...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ccna.local' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
    create: {
      email: 'admin@ccna.local',
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin',
      language: 'en',
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email} (password: admin123)`);

  // 4. Seed Comprehensive Sample Question Bank
  console.log('Seeding initial verified CCNA questions...');
  const sampleQuestions = [
    {
      code: '1.6',
      statementEn: 'An administrator needs to create subnets for a network with the prefix 192.168.10.0/24 to support at least 28 usable host addresses per subnet. Which subnet mask meets this requirement while wasting the fewest host addresses?',
      statementEs: 'Un administrador necesita crear subredes para una red con el prefijo 192.168.10.0/24 para admitir al menos 28 direcciones de host utilizables por subred. ¿Qué máscara de subred cumple con este requisito desperdiciando la menor cantidad de direcciones de host?',
      questionType: 'single_choice',
      difficulty: 'intermediate',
      estimatedTimeSeconds: 90,
      validationStatus: 'validated',
      explanationEn: 'A /27 prefix provides 5 host bits: 2^5 - 2 = 30 usable hosts, which satisfies the requirement for 28 hosts with minimal waste. The subnet mask for /27 is 255.255.255.224.',
      explanationEs: 'Un prefijo /27 proporciona 5 bits de host: 2^5 - 2 = 30 hosts utilizables, lo que satisface el requisito de 28 hosts con un desperdicio mínimo. La máscara de subred para /27 es 255.255.255.224.',
      options: [
        { label: 'A', en: '255.255.255.224 (/27)', es: '255.255.255.224 (/27)', isCorrect: true },
        { label: 'B', en: '255.255.255.240 (/28)', es: '255.255.255.240 (/28)', isCorrect: false, enExp: '/28 provides only 14 usable hosts (2^4 - 2 = 14).' },
        { label: 'C', en: '255.255.255.192 (/26)', es: '255.255.255.192 (/26)', isCorrect: false, enExp: '/26 provides 62 usable hosts, which wastes more addresses than /27.' },
        { label: 'D', en: '255.255.255.248 (/29)', es: '255.255.255.248 (/29)', isCorrect: false, enExp: '/29 provides only 6 usable hosts.' },
      ],
    },
    {
      code: '2.1',
      statementEn: 'Which command on a Cisco Catalyst switch assigns an interface to access mode and places it into VLAN 10?',
      statementEs: '¿Qué comando en un switch Cisco Catalyst asigna una interfaz al modo de acceso y la ubica en la VLAN 10?',
      questionType: 'single_choice',
      difficulty: 'basic',
      estimatedTimeSeconds: 60,
      validationStatus: 'validated',
      explanationEn: 'The commands "switchport mode access" followed by "switchport access vlan 10" in interface configuration mode configure the port as an access port in VLAN 10.',
      explanationEs: 'Los comandos "switchport mode access" seguidos de "switchport access vlan 10" en el modo de configuración de interfaz configuran el puerto como un puerto de acceso en la VLAN 10.',
      options: [
        { label: 'A', en: 'switchport mode access and switchport access vlan 10', es: 'switchport mode access y switchport access vlan 10', isCorrect: true },
        { label: 'B', en: 'switchport trunk allowed vlan 10', es: 'switchport trunk allowed vlan 10', isCorrect: false },
        { label: 'C', en: 'encapsulation dot1q 10', es: 'encapsulation dot1q 10', isCorrect: false },
        { label: 'D', en: 'vlan 10 access enable', es: 'vlan 10 access enable', isCorrect: false },
      ],
    },
    {
      code: '3.1',
      statementEn: 'What is the default administrative distance of an OSPF internal route in Cisco IOS?',
      statementEs: '¿Cuál es la distancia administrativa predeterminada de una ruta interna de OSPF en Cisco IOS?',
      questionType: 'single_choice',
      difficulty: 'basic',
      estimatedTimeSeconds: 45,
      validationStatus: 'validated',
      explanationEn: 'OSPF routes have a default administrative distance of 110 in Cisco IOS. Connected is 0, Static is 1, EIGRP internal is 90, and RIP is 120.',
      explanationEs: 'Las rutas OSPF tienen una distancia administrativa predeterminada de 110 en Cisco IOS. Conectada es 0, Estática es 1, EIGRP interno es 90 y RIP es 120.',
      options: [
        { label: 'A', en: '110', es: '110', isCorrect: true },
        { label: 'B', en: '90', es: '90', isCorrect: false, enExp: '90 is the AD of internal EIGRP.' },
        { label: 'C', en: '120', es: '120', isCorrect: false, enExp: '120 is the AD of RIP.' },
        { label: 'D', en: '1', es: '1', isCorrect: false, enExp: '1 is the AD of static routes.' },
      ],
    },
    {
      code: '4.1',
      statementEn: 'Which keyword is added to a Cisco IOS NAT configuration command to enable Port Address Translation (PAT)?',
      statementEs: '¿Qué palabra clave se agrega a un comando de configuración NAT de Cisco IOS para habilitar la traducción de direcciones de puerto (PAT)?',
      questionType: 'single_choice',
      difficulty: 'basic',
      estimatedTimeSeconds: 45,
      validationStatus: 'validated',
      explanationEn: 'The "overload" keyword appended to "ip nat inside source list <ACL> interface <INT> overload" enables Port Address Translation (PAT).',
      explanationEs: 'La palabra clave "overload" añadida a "ip nat inside source list <ACL> interface <INT> overload" habilita la traducción de direcciones de puerto (PAT).',
      options: [
        { label: 'A', en: 'overload', es: 'overload', isCorrect: true },
        { label: 'B', en: 'pat-enable', es: 'pat-enable', isCorrect: false },
        { label: 'C', en: 'dynamic', es: 'dynamic', isCorrect: false },
        { label: 'D', en: 'multiplex', es: 'multiplex', isCorrect: false },
      ],
    },
    {
      code: '5.6',
      statementEn: 'Which wildcard mask should be used in an extended ACL to match all host addresses in the subnet 172.16.32.0/20?',
      statementEs: '¿Qué máscara comodín (wildcard) debe usarse en una ACL extendida para coincidir con todas las direcciones de host en la subred 172.16.32.0/20?',
      questionType: 'single_choice',
      difficulty: 'intermediate',
      estimatedTimeSeconds: 60,
      validationStatus: 'validated',
      explanationEn: 'A /20 subnet mask is 255.255.240.0. Subtracting this from 255.255.255.255 gives the wildcard mask: 0.0.15.255.',
      explanationEs: 'Una máscara de subred /20 es 255.255.240.0. Al restarla de 255.255.255.255 se obtiene la máscara comodín: 0.0.15.255.',
      options: [
        { label: 'A', en: '0.0.15.255', es: '0.0.15.255', isCorrect: true },
        { label: 'B', en: '0.0.31.255', es: '0.0.31.255', isCorrect: false },
        { label: 'C', en: '0.0.7.255', es: '0.0.7.255', isCorrect: false },
        { label: 'D', en: '0.0.240.255', es: '0.0.240.255', isCorrect: false },
      ],
    },
    {
      code: '6.5',
      statementEn: 'Which HTTP method is utilized in a RESTful API to modify or update an existing resource on a network controller?',
      statementEs: '¿Qué método HTTP se utiliza en una API RESTful para modificar o actualizar un recurso existente en un controlador de red?',
      questionType: 'single_choice',
      difficulty: 'basic',
      estimatedTimeSeconds: 45,
      validationStatus: 'validated',
      explanationEn: 'PUT (or PATCH) is used in RESTful architectures to update existing resources. GET reads, POST creates, and DELETE removes resources.',
      explanationEs: 'PUT (o PATCH) se utiliza en arquitecturas RESTful para actualizar recursos existentes. GET lee, POST crea y DELETE elimina recursos.',
      options: [
        { label: 'A', en: 'PUT', es: 'PUT', isCorrect: true },
        { label: 'B', en: 'GET', es: 'GET', isCorrect: false },
        { label: 'C', en: 'POST', es: 'POST', isCorrect: false },
        { label: 'D', en: 'FETCH', es: 'FETCH', isCorrect: false },
      ],
    },
    {
      code: '5.7',
      statementEn: 'Which two security features mitigate Layer 2 attacks on Cisco Catalyst switches? (Choose two.)',
      statementEs: '¿Cuáles dos características de seguridad mitigan los ataques de Capa 2 en los switches Cisco Catalyst? (Elija dos).',
      questionType: 'multiple_choice',
      difficulty: 'intermediate',
      estimatedTimeSeconds: 90,
      validationStatus: 'validated',
      explanationEn: 'DHCP Snooping prevents rogue DHCP servers and builds a binding database. Dynamic ARP Inspection (DAI) uses this database to prevent ARP poisoning/spoofing attacks.',
      explanationEs: 'DHCP Snooping previene servidores DHCP no autorizados y construye una base de datos de enlaces. Dynamic ARP Inspection (DAI) utiliza esta base de datos para prevenir ataques de suplantación de ARP.',
      options: [
        { label: 'A', en: 'DHCP Snooping', es: 'DHCP Snooping', isCorrect: true },
        { label: 'B', en: 'Dynamic ARP Inspection (DAI)', es: 'Inspección Dinámica de ARP (DAI)', isCorrect: true },
        { label: 'C', en: 'Rapid PVST+', es: 'Rapid PVST+', isCorrect: false },
        { label: 'D', en: 'VTP pruning', es: 'VTP pruning', isCorrect: false },
      ],
    },
    {
      code: '3.4',
      statementEn: 'What is the default Hello and Dead interval in seconds for OSPFv2 on a broadcast multi-access network (such as Ethernet)?',
      statementEs: '¿Cuál es el intervalo predeterminado de Hello y Dead en segundos para OSPFv2 en una red multiacceso de difusión (como Ethernet)?',
      questionType: 'single_choice',
      difficulty: 'intermediate',
      estimatedTimeSeconds: 45,
      validationStatus: 'validated',
      explanationEn: 'On OSPF broadcast networks (like Ethernet), the default Hello interval is 10 seconds and the Dead interval is 4 times the Hello interval, which is 40 seconds.',
      explanationEs: 'En redes OSPF de difusión (como Ethernet), el intervalo Hello predeterminado es de 10 segundos y el intervalo Dead es 4 veces el intervalo Hello, es decir, 40 segundos.',
      options: [
        { label: 'A', en: 'Hello 10s, Dead 40s', es: 'Hello 10s, Dead 40s', isCorrect: true },
        { label: 'B', en: 'Hello 30s, Dead 120s', es: 'Hello 30s, Dead 120s', isCorrect: false },
        { label: 'C', en: 'Hello 5s, Dead 15s', es: 'Hello 5s, Dead 15s', isCorrect: false },
        { label: 'D', en: 'Hello 10s, Dead 30s', es: 'Hello 10s, Dead 30s', isCorrect: false },
      ],
    },
  ];

  for (const sq of sampleQuestions) {
    const topicId = topicIdMap.get(sq.code);
    if (!topicId) continue;

    const existingQ = await prisma.question.findFirst({
      where: { statementEn: sq.statementEn },
    });

    if (!existingQ) {
      await prisma.question.create({
        data: {
          statementEn: sq.statementEn,
          statementEs: sq.statementEs,
          questionType: sq.questionType,
          difficulty: sq.difficulty,
          multipleAnswerCount: sq.questionType === 'multiple_choice' ? 2 : undefined,
          estimatedTimeSeconds: sq.estimatedTimeSeconds,
          validationStatus: sq.validationStatus,
          explanationEn: sq.explanationEn,
          explanationEs: sq.explanationEs,
          primaryTopicId: topicId,
          sourceId: originalSource.id,
          options: {
            create: sq.options.map((opt, oIdx) => ({
              optionLabel: opt.label,
              optionTextEn: opt.en,
              optionTextEs: opt.es,
              isCorrect: opt.isCorrect,
              explanationEn: (opt as any).enExp || null,
              displayOrder: oIdx,
            })),
          },
        },
      });
    }
  }

  console.log('✓ Initial verified questions seeded successfully.');
  console.log('--- Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
