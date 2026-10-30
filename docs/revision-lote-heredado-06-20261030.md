# Revisión del sexto lote heredado — 30/10/2026

Se inspeccionaron las 48 preguntas pendientes del lote 6 en español e inglés, incluidos enunciados, alternativas y todas las explicaciones. **47 versiones utilizables se aprueban: 39 corregidas y ocho sin cambios.** La pregunta 50 conserva una retención documental. Las preguntas 1 y 2, ya validadas anteriormente, permanecen sin cambios.

El banco acumulado contiene **818 registros importables: 567 versiones validadas, 158 originales rechazados con su propio reemplazo aprobado y 93 pendientes**. Son 660 candidatos iniciales y 158 versiones corregidas; no son 818 ejercicios conceptualmente distintos.

## Correcciones

Cada original se conserva sin sobrescribir. Su versión corregida termina en `-review-r1`, mantiene la familia asignada y tiene clave editorial explícita, hashes de contenido y evidencia.

| Original | Corrección |
|---|---|
| `ccna-legacy-batch6_all-004` | Dos distractores eran la misma dirección IPv6 y la explicación identificaba mal la posición del hexteto. |
| `ccna-legacy-batch6_all-005` | Una dirección fuera de rangos privados/compartidos no implica permiso de uso ni anuncio global efectivo. |
| `ccna-legacy-batch6_all-006` | RST válido significa rechazo/aborto, sin probar puerto cerrado ni cierre FIN de cuatro segmentos obligatorio. |
| `ccna-legacy-batch6_all-007` | Se limita checksum UDP opcional a IPv4; UDP sobre IPv6 normalmente requiere checksum. |
| `ccna-legacy-batch6_all-008` | Se compara Wi-Fi ordinario en un canal con Ethernet full duplex, sin generalizar todo RF o cobre. |
| `ccna-legacy-batch6_all-011` | Omisión en show vlan brief no prueba por sí sola trunk; se añade comprobación del modo L2 operativo. |
| `ccna-legacy-batch6_all-012` | Se verifica no ip routing y capacidad/licencia; no se infiere un default universal Catalyst. |
| `ccna-legacy-batch6_all-014` | BPDU recibida no autentica ni prueba intención maliciosa; LED y recuperación dependen de plataforma/configuración. |
| `ccna-legacy-batch6_all-016` | Se separa derivación de PTK del cifrado AES-CCMP y se explicita método EAP compatible con el backend. |
| `ccna-legacy-batch6_all-017` | El contador acumulado no identifica todas las MAC infractoras ni prueba ataque en curso. |
| `ccna-legacy-batch6_all-018` | Los defaults DTP y negociación de encapsulación varían; se explicita 802.1Q disponible. |
| `ccna-legacy-batch6_all-019` | El segundo salto recibe la etiqueta interna; inyección clásica no demuestra imposibilidad universal de retorno. |
| `ccna-legacy-batch6_all-020` | Ausencia en VLAN allowed and active no demuestra que jamás se creara la VLAN; se evita afirmación universal del root. |
| `ccna-legacy-batch6_all-021` | La LSDB muestra tipos de LSA presentes, no garantiza existencia de tipos 1, 2 y 3 en toda topología. |
| `ccna-legacy-batch6_all-022` | Virtual link es solución OSPF nativa, no única alternativa de rediseño; no se inventa razón sobre tipos 3/4/5. |
| `ccna-legacy-batch6_all-023` | Habilitar OSPF en interfaz no garantiza Hellos si está down/passive ni adyacencia Full inmediata. |
| `ccna-legacy-batch6_all-025` | La estática flotante requiere siguiente salto resoluble y ausencia de otra ruta preferida; retirada no equivale a cualquier falla remota. |
| `ccna-legacy-batch6_all-026` | Se elimina en la explicación de A la afirmación incorrecta de que todas las rutas muestran corchetes AD/métrica. |
| `ccna-legacy-batch6_all-027` | Se elimina garantía universal de reenvío por hardware CEF en explicación del distractor. |
| `ccna-legacy-batch6_all-028` | Se corrige inversión del cociente de ancho de banda en inglés y se excluyen overrides manuales. |
| `ccna-legacy-batch6_all-030` | Configurar una default no garantiza instalación; ip default-network no es exclusivo de RIP/IGRP. |
| `ccna-legacy-batch6_all-031` | Retirar una resolución recursiva solo invalida la estática sin resolvedor alternativo; CEF puede precalcular. |
| `ccna-legacy-batch6_all-032` | Se limita default-information originate always a proceso operativo/área normal sin route-map y no garantiza conectividad. |
| `ccna-legacy-batch6_all-033` | Se elimina failover instantáneo y se explicitan comunicación HSRP y camino de respaldo operativo. |
| `ccna-legacy-batch6_all-034` | 203.0.113.80 es TEST-NET-3 para documentación, no dirección pública utilizable en Internet real. |
| `ccna-legacy-batch6_all-035` | IOS puede excluir su propia dirección y detectar conflictos por sondeo; omitir exclusiones permite, no garantiza, duplicados. |
| `ccna-legacy-batch6_all-036` | Origen loopback estable no garantiza sincronización ni domina overrides por asociación. |
| `ccna-legacy-batch6_all-037` | El enunciado debe excluir nivel 7; de otro modo debugging también cumple enviar niveles 0–6. |
| `ccna-legacy-batch6_all-038` | CoS 5/EF es recomendación de política Cisco, no mandato RFC universal ni garantía de cola/retardo por marcar. |
| `ccna-legacy-batch6_all-039` | Ubicar ACL estándar cerca del destino es pauta dependiente de topología, no mandato sin excepciones. |
| `ccna-legacy-batch6_all-040` | established solo compara ACK/RST; no verifica estado ni bloquea todo SYN que también lleve ACK/RST. |
| `ccna-legacy-batch6_all-042` | Se pide recuperación por puerto sin reiniciar y sin prometer color LED o reenvío sin enlace válido. |
| `ccna-legacy-batch6_all-043` | Se elimina mínimo RSA obsoleto y dependencia falsa de tamaño con versión; se pregunta flujo tradicional explícito, no requisitos universales SSH. |
| `ccna-legacy-batch6_all-044` | Se evita fecha de introducción universal y RADIUS solo UDP universal; el ejemplo no habilita AAA completo. |
| `ccna-legacy-batch6_all-045` | VTY 0–4 no cubre necesariamente todas las líneas ni hay default Telnet universal. |
| `ccna-legacy-batch6_all-046` | Las expresiones incluían barras invertidas literales ante comillas; se aclara que JSON ya está analizado a dict/list. |
| `ccna-legacy-batch6_all-047` | RESTCONF requiere TLS; se elimina puerto 80 en claro y reemplazo obligatorio de CLI/SNMP/MIB. |
| `ccna-legacy-batch6_all-048` | Las etiquetas de integración east/west no son frontera universal; permisos/versiones limitan APIs disponibles. |
| `ccna-legacy-batch6_all-049` | Se usa nombre cualificado network_cli y se limita precedencia a variables de inventario comparables. |

Aprobadas sin modificar contenido: **3, 9, 10, 13, 15, 24, 29 y 41**. En particular se volvió a comprobar la comparación E1/E2, ya corregida en el material disponible.

## Evidencia y pruebas

La ronda [batch6-20261030.json](../server/prisma/reviews/batch6-20261030.json) registra 47 aprobaciones, 39 rechazos enlazados y una retención; incorpora 44 referencias primarias con pasajes, posiciones normalizadas y SHA-256. El manifiesto acumulado reúne 204 referencias. Se contrastaron, entre otros, la inversión U/L e inserción FF:FE (RFC 4291), checksum UDP IPv6 (RFC 8200), restricciones/roles OSPF, presupuesto PoE documentado por Cisco, exclusiones DHCP y detección de conflictos, CoS de voz Cisco más EF (RFC 3246), autenticación RADIUS, TLS obligatorio de RESTCONF y estructuras Python. No se presenta HTTP 200 ni una marca isCorrect como prueba técnica suficiente.

Se añadieron **10 comprobaciones independientes**, ejecutadas sobre contenido ES/EN: enumeración FLSM, EUI-64 con alternativas IPv6 normalizadas distintas, clasificación privada/compartida, costes OSPF, longest-prefix desde el exhibit, decremento HSRP, umbral syslog exclusivo, máscara ACK/RST, primera coincidencia ACL y ejecución restringida de expresiones Python sobre el JSON analizado. Esta última verifica también que los distractores devuelvan el segundo equipo o produzcan TypeError/KeyError. No se usa eval ni se emula IOS. Acumulado: 157 preguntas con cálculo/escenario ejecutable y 410 de revisión documental.

**617 pruebas de servidor en 14 archivos y 22 de Chromium aprobadas.** Incluyen actualización desde las entregas publicadas de 131, 366, 420, 426, 472 y 520 aprobaciones; conservación de hashes de originales; auditoría e idempotencia; retenciones y borradores fuera de exámenes; y un simulacro de 100 familias aprobadas distintas. Compilación de servidor y tipado estricto de herramientas correctos. La auditoría recibe 818 candidatos sin errores estructurales ni duplicados exactos, y verifica el manifiesto 567/93/158. La regeneración coincide byte a byte con el manifiesto guardado.

La base de validación nueva `/workspace/.ccna-runtime/server/prisma/cloud-reviewed-batch6.db` contiene **826 preguntas: 575 validadas, 158 rechazadas, 93 pendientes y 494 familias declaradas validadas**. Incluye los ocho ejemplos del seed, no recertificados por esta revisión. Hay 725 auditorías asistidas. Una segunda aplicación crea cero registros y aplica cero decisiones. Se conservan las bases anteriores.

## Pendientes concretos

| Grupo | Pendientes |
|---|---:|
| Lote 5 | 47 |
| Segundo lote: conectividad IP | 9 |
| Segundo lote: fundamentos de red | 9 |
| Segundo lote: acceso a red | 8 |
| Segundo lote: seguridad | 7 |
| Segundo lote: automatización | 5 |
| Segundo lote: servicios IP | 5 |
| Lote 4: Parser Views y arquitectura Meraki | 2 |
| Lote 6: Agile frente a Waterfall | 1 |
| **Total** | **93** |

El borrador Agile corrige las afirmaciones de que todo Agile exige Scrum, sprints y CI/CD y de que Waterfall prohíbe toda entrega intermedia o cambio. Todavía falta recuperar el pasaje primario focalizado; los accesos consultados fallaron. Se conserva pendiente, no rechazado como atajo ni importado como aprobado. Los [dos borradores actuales](propuestas-cierre-heredadas-20261030.json) son Meraki y Agile; el contenido del sexto lote ya aprobado está en su archivo de correcciones. Los informes anteriores conservan cifras históricas.

No se generan preguntas nuevas para aumentar el contador. Esta revisión es técnica asistida, no certificación humana o de Cisco, y no completa por sí sola cobertura ponderada o deduplicación semántica. GitHub tampoco actualiza automáticamente la base SQLite de Windows. Desde `server`, `npm run db:sync-reviewed` presenta la previsión y `npm run db:sync-reviewed -- --apply` aplica decisiones explícitas sin sobrescribir contenido local incompatible.
