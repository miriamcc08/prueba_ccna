# Cobertura y orden de revisión del banco

Actualización del 26 de octubre de 2026. El inventario [cobertura-banco.json](cobertura-banco.json) describe archivos candidatos; no certifica objetivos oficiales ni aprobación humana.

| Área declarada | Candidatos |
|---|---:|
| Network Fundamentals | 130 |
| Network Access | 130 |
| IP Connectivity | 163 |
| IP Services | 65 |
| Security Fundamentals | 98 |
| Automation and Programmability | 74 |
| **Total** | **660** |

Hay 586 familias declaradas. Las equivalencias conocidas se agrupan, pero la deduplicación semántica no está terminada.

## Fase 3: revisión pendiente

Los ocho lotes originales reúnen 360 preguntas: 229 tienen consulta focalizada y 101 tienen caso ejecutable independiente. Los conjuntos se superponen y no deben sumarse como preguntas distintas. Otras 131 originales aún no tienen consulta focalizada registrada. Las 300 heredadas requieren revisión completa; sus once comprobaciones numéricas no equivalen a aprobación integral.

Ya se revisaron las primeras veinte del primer lote sin cambiar su contenido importado. Se añadió la referencia vigente RFC 9542 para bits MAC. El primer lote conserva 30 preguntas sin esta revisión documental; el verificador informa esa revisión parcial explícitamente.

El orden siguiente es completar esas 30 y los casos sin evidencia de los lotes 02 a 04, revisar semánticamente distractores y traducciones, y registrar aprobación editorial independiente cuando corresponda. Los casos 020 y 029 del lote 04 siguen pendientes de fuente de plataforma directa o laboratorio.

## Fase 5: próximos temas

El lote 07 amplió campus, leaf-spine, virtualización y controladores; el lote 08 añadió diez casos focalizados de AIOps y automatización. Sigue pendiente contrastar el documento oficial completo y construir la matriz por subobjetivo. Los ejercicios sobre detalles de VXLAN no se presentan como subobjetivos oficiales confirmados.

El cribado siguiente solo busca palabras de enunciados ingleses. Los patrones se ampliaron para reconocer leaf-spine, overlay, EAP-TLS y AIOps; las cifras no son directamente comparables a cribados anteriores ni prueban cobertura completa.

| Tema | Coincidencias orientativas |
|---|---:|
| Arquitecturas | 6 |
| Virtualización, overlay y VRF | 9 |
| Herramientas de automatización | 8 |
| Seguridad WLAN y EAP-TLS | 7 |
| IA y aprendizaje automático | 7 |

Los registros y patrones concretos están en el JSON. Priorizar la revisión de los escenarios existentes de IA, herramientas y seguridad WLAN antes de añadir variantes; ampliar lo que falte según la matriz oficial. Alcanzar 1000 aprobadas distintas no consiste solo en generar 340 registros adicionales.

## Otras fases

La fase 2 ya respeta mostrar u ocultar explicaciones al responder y recuperar en estudio, con compatibilidad de sesiones antiguas. Conserva pendientes de variantes recalculadas y límite por pregunta y otras preferencias avanzadas; los sonidos opcionales ya están implementados. Las fases 6 y 7 conservan accesibilidad, analítica, PostgreSQL, restauración y endurecimiento para producción. Esta continuación avanzó contenido, procedencia y pruebas; no declara terminadas esas funcionalidades.

La ampliación de preguntas queda pausada por petición del usuario. El cierre funcional y el panel administrador se documentan en [auditoria-funcional-20261026.md](auditoria-funcional-20261026.md). El inventario y el estado de aprobación del banco no cambian en esta auditoría.

El reinicio de un ejercicio ya está implementado mediante una práctica independiente; no amplía el banco ni sustituye variantes recalculadas. Ver [reinicio-estudio.md](reinicio-estudio.md).

El tiempo por pregunta ya está implementado y probado; no amplía el banco ni sustituye las variantes recalculadas. Política: [tiempo-por-pregunta.md](tiempo-por-pregunta.md).

## Actualización del 29/10/2026

Las cifras de candidatos anteriores no equivalen a contenido aprobado. La [revisión asistida](revision-y-aprobaciones-20261029.md) aprobó 131 de los 660 candidatos y dejó 529 pendientes. La copia de ejecución actualizada, incluidos ocho ejemplos anteriores, tiene 120 familias validadas y permite 100 preguntas de dificultad mixta. Sigue pendiente certificar cobertura por subobjetivos y pesos oficiales.

La [segunda ronda](continuacion-revision-20261029.md) lleva el inventario a 664 registros (cuatro versiones corregidas adicionales), 366 aprobaciones del manifiesto y 298 pendientes. Incluidos los ocho ejemplos previos, la nube tiene 312 familias validadas; la cobertura completa por subobjetivos sigue sin certificarse.

La [revisión vigente](revision-heredadas-20261029.md) cubre todas las originales y las 50 primeras heredadas: 698 versiones, 420 aprobadas, 38 antiguas rechazadas con reemplazo y 240 heredadas pendientes. Con ocho ejemplos previos, la nube tiene 353 familias validadas. Se alinearon nueve correcciones antes sin familia y se preservó otra asignación; esto no completa la deduplicación semántica ni la certificación de cobertura por subobjetivo.
