# Revisión de preguntas heredadas — 29/10/2026

## Resultado de esta tanda

Se revisaron las 50 preguntas del primer lote heredado, incluidos enunciados, respuestas, explicaciones y distractores en inglés y español. **34 necesitaban corrección**; se conservaron sus textos originales y se crearon versiones `-review-r1`. Se aprobaron 15 registros sin modificar; el ejercicio de límites /27 ya había sido aprobado. Así, cada una de esas 50 preguntas tiene una versión utilizable.

También se resolvieron las cinco originales retenidas por evidencia insuficiente. Esta tanda aporta **54 aprobaciones nuevas**: 34 correcciones, 15 heredadas intactas y cinco originales. Las cuatro versiones corregidas anteriores se conservan.

Las versiones antiguas incorrectas se registran ahora como **rechazadas**, con motivo y reemplazo aprobado: 34 heredadas y cuatro originales de la tanda previa. No se borran ni se presentan como trabajo pendiente o preguntas disponibles para exámenes. No se añadieron ejercicios nuevos ajenos a las correcciones del material existente.

| Inventario versionado | Aprobadas | Pendientes | Rechazadas con reemplazo | Total |
|---|---:|---:|---:|---:|
| Ocho lotes originales | 356 | 0 | 4 | 360 |
| Banco heredado | 26 | 240 | 34 | 300 |
| Versiones corregidas | 38 | 0 | 0 | 38 |
| Total | **420** | **240** | **38** | **698** |

Hay decisiones técnicas asistidas para 458 registros. **Las 240 heredadas restantes no han recibido una revisión técnica completa** y siguen fuera de los exámenes. No se interpreta un resultado estructural correcto como aprobación técnica.

La aplicación real en la copia de ejecución de nube contiene **706 registros** al contar ocho ejemplos iniciales aparte: **428 validados, 240 pendientes y 38 rechazados**. Tiene **353 familias validadas distintas**. La disponibilidad por dificultad es 47 familias básicas, 292 intermedias y 22 avanzadas; estos grupos pueden compartir familias y no se suman. Se probó un examen mixto de 100 preguntas; no se promete esa cantidad con cualquier filtro.

**La base del PC del usuario no se modifica desde esta copia de nube.** Es necesario actualizar el código y aplicar las decisiones en esa base.

## Correcciones documentadas

Los números de posición comienzan en 1. Los archivos originales no se reescribieron: sus reemplazos están en `server/prisma/questions/reviewed_legacy_corrections_20261029.json`, con `supersedesQuestionId`. El manifiesto registra también `supersededByQuestionId` en cada versión rechazada.

| Archivo | Posición | Corrección de la versión aprobada |
|---|---:|---|
| batch1_network_fundamentals | 1 | Pedir el estándar IEEE mínimo: 802.3bt también podía cumplir la potencia. El escenario corregido especifica 30 W en PSE y separa pérdidas/compatibilidad del PD, sin atribuir consumo fijo a toda una familia de AP. |
| batch1_network_fundamentals | 2 | Inspeccionar carga TLS requiere descifrado autorizado y compatible; NGFW no permite leer automáticamente toda carga cifrada. |
| batch1_network_fundamentals | 3 | Dos servidores del mismo leaf no necesitan atravesar un spine; eliminar la promesa de exactamente dos saltos entre cualesquiera servidores. |
| batch1_network_fundamentals | 5 | Separar el extremo half duplex que detecta colisiones del full duplex que no usa detección de colisiones; no toda transmisión simultánea es una late collision. |
| batch1_network_fundamentals | 6 | La ventana TCP anuncia crédito de recepción, no una cantidad de bytes tras la que obligatoriamente se envía ACK. Ventana cero permite los sondeos definidos. |
| batch1_network_fundamentals | 10 | Clasificar RFC 6598 sin lenguaje de clases ni una obligación universal de traducir por un único mecanismo CGNAT. |
| batch1_network_access | 1 | Preguntar por valores de fábrica documentados de Catalyst 2960, sin extrapolar restricciones de nombres a todas las plataformas. |
| batch1_network_access | 3 | Separar clasificación de una trama sin etiqueta, bloqueo protector STP y advertencia CDP; no confundir inconsistencia PVID con inconsistencia de tipo de puerto. |
| batch1_network_access | 5 | LLDP es IEEE 802.1AB, pero no está implementado universalmente ni CDP tiene los mismos valores predeterminados en todo equipo. |
| batch1_network_access | 8 | Explicitar recepción de BPDU, diagnóstico bpduguard y recuperación automática deshabilitada; un switch no administrado no prueba por sí solo que haya enviado BPDU. |
| batch1_network_access | 9 | Distinguir retransmisión EAP por un autenticador de terminar necesariamente el método EAP en el WLC; funciones adicionales dependen de plataforma y modo. |
| batch1_network_access | 10 | Explicitar un controlador de laboratorio con LAG estático, sin generalizar número de LAG ni modos negociados a todo WLC. |
| batch1_ip_connectivity | 1 | Interpretar [distancia/métrica] de la entrada observada sin afirmar que toda ruta muestre corchetes. |
| batch1_ip_connectivity | 2 | Explicar la ruta local /32 sin atribuir una fecha universal de introducción a todo IOS. |
| batch1_ip_connectivity | 6 | ip default-gateway también puede usarse en routers IOS sin IP routing; no es exclusivo de switches Capa 2. |
| batch1_ip_connectivity | 7 | Explicitar distancia OSPF y siguiente salto secundario utilizable; retirar garantía de conmutación instantánea. |
| batch1_ip_connectivity | 8 | ARP por destino puede aumentar tráfico y estado, pero agotar memoria no es inevitable para toda /24; acotar la recomendación a una subred remota multiacceso. |
| batch1_ip_connectivity | 10 | Aplicar el costo mínimo 1 sin enseñar que todo cociente fraccionario se redondea hacia arriba. |
| batch1_ip_connectivity | 13 | Mantener el formato HSRPv1 necesario y retirar una comparación que describía incorrectamente el ancho del grupo GLBP. |
| batch1_ip_services | 1 | Distinguir roles NAT de direcciones obligatoriamente privadas o públicas reales; los rangos del ejemplo son documentales. |
| batch1_ip_services | 2 | No afirmar que ip dhcp-server no existe en ninguna función IOS; justificar el helper-address de interfaz requerido. |
| batch1_ip_services | 3 | Separar estrato de referencia física, valores transportados por NTP y precisión; no confundir el valor 0 del paquete con un servidor sincronizado normal. |
| batch1_ip_services | 5 | El shaping usa colas finitas y puede descartar; no garantiza ausencia de pérdidas bajo carga sostenida. |
| batch1_security_fundamentals | 1 | Retirar una fórmula universal de riesgo y comandos de hardening ajenos que calificaban HTTPS como intrínsecamente inseguro. |
| batch1_security_fundamentals | 2 | scrypt aumenta el costo de adivinación, no neutraliza todo hardware de ataque; Tipo 7 no protege de forma fuerte ni universal todo secreto. |
| batch1_security_fundamentals | 3 | AH normaliza/excluye campos mutables para autenticar; ESP depende de algoritmos y comprobaciones configurados. |
| batch1_security_fundamentals | 4 | Un permit de ingeniería no deniega a ingeniería por implicit deny. La ubicación de ACL responde a topología/política, no a una obligación universal. |
| batch1_security_fundamentals | 6 | Explicitar las dos MAC aprendidas; entregar notificaciones remotas requiere configuración y alcance, no solo activar restrict. |
| batch1_security_fundamentals | 7 | TACACS+ clásico ofusca, no ofrece cifrado moderno. commands 15 cubre ese nivel, local es fallback y TCP no garantiza éxito final de aplicación. |
| batch1_automation | 1 | Automatizar no garantiza revisión por pares, CI o ausencia de errores; una plantilla incorrecta puede propagarlos. |
| batch1_automation | 2 | Separar roles SDN genéricos de protocolos admitidos por un producto; northbound no exige REST/JSON universalmente. |
| batch1_automation | 3 | Retirar la cifra no demostrada del 99 % y la promesa de identificar siempre una causa raíz exacta. |
| batch1_automation | 4 | Usar un contrato de API hipotético explícito, sin atribuir un endpoint no verificado a Catalyst Center. 201 crea el trabajo, no prueba despliegue terminado. |
| batch1_automation | 5 | Describir Ansible para el modelo IOS/SSH comprobado, sin generalizar runtimes o protocolos de todos los módulos ni expandir incorrectamente YAML. |

Nueve versiones que no tenían familia se alinearon explícitamente con conceptos ya revisados; otra conservó la familia asignada. Esto evita contar esas correcciones equivalentes como familias adicionales. La revisión semántica completa de todo el banco sigue pendiente.

## Evidencia de las cinco originales resueltas

- `ccna-original-20261024-b02-042`: capítulo específico de DHCP de Catalyst 9300, con confianza de puertos y descarte de tráfico DHCP de servidor no autorizado.
- `ccna-original-20261024-b03-021`: documento de resolución de siguiente salto de rutas estáticas y comprobación independiente de una dependencia circular sin anclaje de reenvío.
- `ccna-original-20261024-b03-039`: capítulo sustantivo de IP Source Guard, contrastado también con DAI.
- `ccna-original-20261024-b03-042`: RFC 8110 documenta PSK compartida y conocimiento del secreto; se contrasta con el supuesto explícito de una misma clave usada por todos.
- `ccna-original-20261026-b04-012`: documento Cisco de unicast flooding que especifica todos los puertos de reenvío de la VLAN salvo el puerto receptor.

La ronda queda en `server/prisma/reviews/legacy-20261029.json`: 92 decisiones, 54 aprobaciones y 38 rechazos vinculados a reemplazos. Incluye 21 documentos primarios descargados y consultados el 29/10/2026, además de copias previamente consultadas. Cada referencia se vincula a bytes y pasajes concretos mediante hashes; las páginas fallidas no se consideran evidencia.

El manifiesto acumulado, revisión 3, contiene 146 entradas URL/hash. Los extractos breves no superan 90 palabras por URL; los pasajes completos se identifican por localizador y hash. No se publica la caché completa. Se comprobó que reconstruir el manifiesto con la misma caché produce exactamente los mismos bytes.

La revisión es **asistida por un agente automatizado, autorizada por el usuario**, no una certificación humana ni de Cisco. Consultar las fuentes de estas preguntas no certifica la cobertura ponderada íntegra del blueprint vigente.

## Aplicación segura

El mismo comando funciona para bases iniciales y para las dos versiones publicadas anteriores. Desde `server`, con la misma `DATABASE_URL` de la aplicación:

```powershell
npm run db:sync-reviewed
npm run db:sync-reviewed -- --apply
```

El primero muestra una previsión sin escribir. El segundo importa lo que falta y aplica decisiones en una transacción. En la copia con 366 aprobaciones anteriores creó 34 versiones, añadió 54 aprobaciones y registró 38 rechazos; repetirlo no crea ni cambia más registros.

Para rechazar una versión sustituida, el manifiesto debe enlazar a una corrección aprobada que apunte al original, conservando la familia si ya estaba asignada. El sincronizador no retira una aprobación existente de un administrador, no sobrescribe contenido local y no restaura silenciosamente una decisión cambiada después de importarse. Los casos incompatibles cancelan toda la transacción y requieren reconciliación editorial. Las notas incluyen ronda, decisión, evidencia y enlace por ID entre versiones.

No se borran bases, no se ejecuta reset y no hay migraciones ni dependencias nuevas. El actor técnico permanece bloqueado para login/tokens y no crea un administrador interactivo.

## Archivos modificados

- `reviewed_legacy_corrections_20261029.json`: las 34 versiones corregidas, procedencia y familias.
- `legacy-20261029.json` y el manifiesto acumulado: claves inspeccionadas, 92 decisiones de esta ronda, vínculos de reemplazo, fuentes y localizadores verificables.
- `tools/check-reviewed-legacy-scenarios.py`: 13 comprobaciones independientes reproducibles.
- `tools/build-reviewed-bank-report.py`: acumular rondas, verificar escenarios/pasajes y conservar la distinción entre aprobaciones, pendientes y rechazos.
- `server/prisma/sync-reviewed-bank.ts`: rechazos transaccionales auditados y protegidos, exclusivamente con corrección aprobada vinculada; conservación de decisiones previas.
- `server/prisma/audit-questions.ts` y `server/tsconfig.review.json`: informar la revisión editorial solo si su integridad está comprobada y verificar tipos también del auditor.
- Pruebas de banco, escenarios, integración y navegador: inventario, actualizaciones anteriores, protección editorial, versiones rechazadas y selección de exámenes.
- README y documentación de estado, administración, cobertura y pendientes: cifras actuales y enlaces a los informes históricos.

## Validación

- **608 pruebas de servidor y 22 de Chromium aprobadas**, incluida creación/inicio de un examen mixto real de 100 familias declaradas distintas y solo preguntas validadas.
- Compilación de servidor/cliente y `npm run check:review` correctos.
- Comprobación independiente de 13 escenarios nuevos con Python: VLSM, EUI-64, STP, RIB frente a forwarding, router ID, DR/BDR sin preemption, syslog, ACL, costos OSPF, NTP, wildcard y recursión circular. Se conserva además el cálculo previo de flooding ahora aprobado con fuente específica.
- 124 aprobaciones acumuladas cuentan con evidencia ejecutable independiente; las otras 296 son documentales. Ninguna cifra implica aprobación de los 240 registros pendientes.
- Pruebas de actualización desde 131 y desde 366 aprobaciones, conservación del contenido original, idempotencia, auditoría de rechazos y protección de decisiones editoriales.
- Rechazo de manifiestos que intenten retirar una versión sin reemplazo aprobado, que alteren una clave o que cambien el hash de la evidencia.
- La auditoría conserva separados el resultado estructural (sin aprobación automática) y `editorialReview`, que solo muestra decisiones si los hashes y vínculos del manifiesto están verificados. Una referencia en el registro editorial no se informa como ausente por faltar en el campo directo de la pregunta.
- Auditoría estructural de 698 registros con enunciados ingleses normalizados distintos; hashes de fuentes y contenido comprobados. La distinción exacta no equivale a deduplicación semántica completa.

Pendientes: revisión técnica de las 240 heredadas restantes, mapa de subobjetivos y pesos oficiales, deduplicación semántica completa, suficiencia por filtros y cierre de despliegue de producción. La generación de ejercicios nuevos sigue pausada.
