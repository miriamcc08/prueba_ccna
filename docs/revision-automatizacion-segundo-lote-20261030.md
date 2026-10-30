# Cierre de automatización del segundo lote — 30/10/2026

Se revisaron íntegramente las cinco preguntas pendientes de `batch2_automation.json` en español e inglés: enunciados, claves, distractores y todas las explicaciones. Las cinco requieren corrección y ahora tienen versión aprobada enlazada con su original rechazado. Son versiones corregidas de preguntas existentes.

Con esta ronda y la revisión del sexto lote se incorporan **52 versiones utilizables en esta continuación: 44 corregidas y ocho sin cambios**. El banco vigente tiene **823 registros importables: 572 versiones validadas, 163 originales rechazados con reemplazo aprobado y 88 pendientes**. Los 823 son 660 candidatos iniciales y 163 versiones corregidas; no representan 823 ejercicios conceptualmente distintos.

## Cambios

| Original | Corrección |
|---|---|
| `ccna-legacy-batch2_automation-001` | Los modelos/API no son independientes de versión ni eliminan todo CLI; SSH cifra paquetes de sesión y no una sola vez al iniciar. |
| `ccna-legacy-batch2_automation-002` | Se separa desencapsulación VXLAN del intercambio BGP y se eliminan garantías de ausencia de flooding y reenvío siempre ASIC/a velocidad de línea. |
| `ccna-legacy-batch2_automation-003` | Se eliminan dicotomía exclusiva cuantitativo/cualitativo y afirmaciones de compilador Puppet/TTL siempre en ASIC; se explicitan límites de predicción/generación. |
| `ccna-legacy-batch2_automation-004` | 403 no demuestra autenticación exitosa; se eliminan Bearer intercambiable, plazo fijo/JWT obligatorio, timestamp incoherente y mapeo automático de caída de switch a HTTP 500. |
| `ccna-legacy-batch2_automation-005` | ios_system no admite config/state merged; se usan argumentos publicados, conexión cualificada y modelo push del ejemplo sin negar ansible-pull ni otros modos Puppet/Chef. |

Las correcciones separan encapsular datos de intercambiar rutas, evitan atribuir a una API compatibilidad universal y distinguen errores HTTP sin inferir que 403 demuestra autenticación exitosa. El caso de IA presenta usos típicos que pueden solaparse, no garantías de predicción o configuración válida.

## Evidencia y alcance de las pruebas

La ronda [automation-20261030.json](../server/prisma/reviews/automation-20261030.json) contiene cinco aprobaciones y cinco rechazos enlazados, con 12 referencias primarias y pasajes de SHA-256/posición comprobados. Se inspeccionaron RFC 7950, RFC 4251 y RFC 9110; el diseño SDA de Cisco; ejemplos oficiales de predicción temporal y generación de texto; y las definiciones publicadas de módulos Ansible. El manifiesto acumulado reúne 210 referencias. No se cita un índice vacío como evidencia sustantiva.

El extracto HTTP es un ejemplo de laboratorio con otras cabeceras omitidas, no una captura completa ni un esquema de error de proveedor garantizado. Se analiza su JSON y se comprueba coherencia entre estado HTTP 401 y el código de expiración suministrado. La semántica de 400/401/403 se revisa documentalmente en RFC 9110.

El playbook se analizó realmente con **PyYAML 6.0.3** en ambos idiomas. Se extrajo DOCUMENTATION de las dos fuentes Python mediante AST y literal_eval, sin importar ni ejecutar su código, y se compararon nombres, tipos y choices de parámetros. `ios_ntp_global` usa config/state merged; `ios_system` usa domain_name directamente y state present. Se verificó un play, dos tareas y YAML idéntico ES/EN. [Resultado](comprobacion-ansible-20261030.json). **No se ejecutaron Ansible ni cambios sobre switches.**

La comprobación automática habitual vuelve a verificar el hash del YAML contra ese resultado; no se presenta esa vinculación como un parseo YAML nuevo. Para repetir el análisis completo, instala PyYAML 6.0.3 en tu entorno de herramientas y ejecuta `python3 tools/check-reviewed-automation-yaml.py --cache RUTA_A_LAS_COPIAS_VERIFICADAS`. Las copias deben coincidir con los hashes publicados; no se descarga código durante la prueba ni se aceptan cambios de fuente silenciosamente. PyYAML se necesita solo para repetir esta comprobación opcional, no para ejecutar el simulador ni las pruebas habituales.

## Resultados

**619 pruebas de servidor en 14 archivos y 22 de Chromium aprobadas**, incluyendo importación desde las entregas de 131, 366, 420, 426, 472, 520 y 567 aprobaciones; preservación de originales; auditoría e idempotencia; y simulacro de 100 familias aprobadas distintas. Tipado estricto y compilación del servidor correctos. Auditoría estructural: 823 recibidas, sin rechazos estructurales ni duplicados exactos, con manifiesto editorial 572/88/163 verificado. Regenerarlo produce el mismo archivo byte a byte.

Hay 158 versiones con comprobación directa de cálculo/escenario, otra vinculada al análisis YAML ejecutado y 413 de revisión documental. Ninguna cifra implica certificación humana o de Cisco ni ejecución de IOS.

La base aislada `/workspace/.ccna-runtime/server/prisma/cloud-reviewed-automation.db` contiene **831 preguntas: 580 validadas, 163 rechazadas, 88 pendientes y 499 familias declaradas validadas**. Incluye los ocho ejemplos del seed, no recertificados en esta ronda. Hay 735 auditorías asistidas; repetir la aplicación crea cero registros y aplica cero decisiones. Se conservan las bases anteriores.

## Lo que falta

| Grupo | Pendientes |
|---|---:|
| Lote 5 | 47 |
| Segundo lote: conectividad IP | 9 |
| Segundo lote: fundamentos de red | 9 |
| Segundo lote: acceso a red | 8 |
| Segundo lote: seguridad | 7 |
| Segundo lote: servicios IP | 5 |
| Parser Views y arquitectura Meraki del lote 4 | 2 |
| Agile del lote 6 | 1 |
| **Total** | **88** |

Los [dos borradores retenidos](propuestas-cierre-heredadas-20261030.json), Meraki y Agile, permanecen fuera del banco importable. Parser Views conserva su retención documental en el manifiesto. Las otras 85 preguntas de esta lista todavía no tienen cierre técnico completo. No se rechazan ni aprueban en bloque para reducir el contador. El banco aún no está terminado y la deduplicación semántica/cobertura ponderada tienen sus propios pendientes.

GitHub no actualiza automáticamente la base SQLite de tu PC. Desde `server`, `npm run db:sync-reviewed` muestra la previsión y `npm run db:sync-reviewed -- --apply` aplica decisiones explícitas. El importador rechaza sobrescribir contenido local diferente o decisiones editoriales incompatibles.
